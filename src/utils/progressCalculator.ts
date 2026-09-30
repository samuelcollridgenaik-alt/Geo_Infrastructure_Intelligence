/**
 * Academic Progress Estimation Analytical Engine
 *
 * Formula:
 * Estimated Progress E = W_m * S_milestone +
 *                        W_v * S_visual_stage +
 *                        W_c * S_components +
 *                        W_h * S_historical_trend +
 *                        W_e * S_equipment
 *
 * Constraints:
 * 1. Sum of weights (W_m + W_v + W_c + W_h + W_e) = 1.0 (normalized)
 * 2. 0 <= E <= 100
 * 3. Uncertainty interval computed based on detection confidences and stage variance.
 */

import {
  BoundingBox,
  ConstructionVisualStage,
  ProgressFactors,
  ProgressFactorWeights,
  ProgressAnalyticsResult,
  ProvenanceType,
} from '../types.ts';

export const DEFAULT_PROGRESS_WEIGHTS: ProgressFactorWeights = {
  milestoneWeight: 0.35,
  visualStageWeight: 0.25,
  componentWeight: 0.15,
  historicalVelocityWeight: 0.15,
  equipmentWeight: 0.10,
};

// Numerical baselines for standard construction visual stages
export const STAGE_BASELINE_SCORES: Record<ConstructionVisualStage, number> = {
  early_construction: 15.0, // Excavation, foundation, subgrade
  mid_construction: 45.0, // Structural framing, pillars, drainage trenches
  advanced_construction: 75.0, // Decking, paving, exterior envelope
  finishing_work: 90.0, // Signage, barriers, lighting, surfacing
  completed: 100.0, // Final clearance and testing
};

// Component structural maturity contribution
const COMPONENT_SCORE_MAP: Record<string, number> = {
  foundation: 20,
  pier_column: 40,
  girder: 60,
  slab_deck: 75,
  asphalt_pavement: 85,
  guardrail: 92,
  road_marking: 95,
  streetlight: 96,
  signage: 98,
  bridge: 70,
  building: 65,
  drainage: 50,
};

// Heavy equipment density indicates active middle/heavy construction phase
const EQUIPMENT_CLASSES = new Set([
  'excavator',
  'crane',
  'bulldozer',
  'concrete_mixer',
  'truck',
  'compactor',
  'roller',
  'pile_driver',
]);

export function calculateComponentScore(boxes: BoundingBox[]): number {
  if (!boxes || boxes.length === 0) return 30; // default baseline

  let maxComponentWeight = 10;
  let detectedCount = 0;

  for (const box of boxes) {
    const label = box.label.toLowerCase();
    if (COMPONENT_SCORE_MAP[label] !== undefined) {
      if (COMPONENT_SCORE_MAP[label] > maxComponentWeight) {
        maxComponentWeight = COMPONENT_SCORE_MAP[label];
      }
      detectedCount++;
    }
  }

  // Combine highest structural element seen with density adjustment
  const densityBonus = Math.min(15, detectedCount * 3);
  return Math.min(100, maxComponentWeight + densityBonus);
}

export function calculateEquipmentActivityScore(boxes: BoundingBox[]): number {
  if (!boxes || boxes.length === 0) return 40;

  let equipmentCount = 0;
  for (const box of boxes) {
    if (EQUIPMENT_CLASSES.has(box.label.toLowerCase())) {
      equipmentCount++;
    }
  }

  // High equipment count indicates active mid-stage operations (50-80 range)
  if (equipmentCount === 0) return 30;
  if (equipmentCount === 1) return 50;
  if (equipmentCount <= 3) return 70;
  return 85;
}

export function computeProgressEstimation(params: {
  visualStage: ConstructionVisualStage;
  milestoneScore: number;
  detectedBoxes: BoundingBox[];
  previousProgress?: number;
  daysSinceLastInspection?: number;
  plannedDailyVelocity?: number;
  customWeights?: Partial<ProgressFactorWeights>;
  provenance?: ProvenanceType;
}): ProgressAnalyticsResult {
  const weights: ProgressFactorWeights = {
    ...DEFAULT_PROGRESS_WEIGHTS,
    ...(params.customWeights || {}),
  };

  // 1. Normalize weights so sum equals 1.0
  const totalWeight =
    weights.milestoneWeight +
    weights.visualStageWeight +
    weights.componentWeight +
    weights.historicalVelocityWeight +
    weights.equipmentWeight;

  const normMilestoneWeight = weights.milestoneWeight / totalWeight;
  const normVisualStageWeight = weights.visualStageWeight / totalWeight;
  const normComponentWeight = weights.componentWeight / totalWeight;
  const normHistWeight = weights.historicalVelocityWeight / totalWeight;
  const normEquipWeight = weights.equipmentWeight / totalWeight;

  // 2. Compute individual factor scores (0..100)
  const visualStageScore = STAGE_BASELINE_SCORES[params.visualStage] ?? 40;
  const componentScore = calculateComponentScore(params.detectedBoxes);
  const equipmentScore = calculateEquipmentActivityScore(params.detectedBoxes);

  // Historical trend factor: if previous progress exists, project with velocity
  let historicalVelocityScore = visualStageScore;
  if (params.previousProgress !== undefined) {
    const elapsedDays = params.daysSinceLastInspection ?? 14;
    const velocity = params.plannedDailyVelocity ?? 0.15; // default ~0.15% per day
    historicalVelocityScore = Math.min(
      100,
      Math.max(params.previousProgress, params.previousProgress + velocity * elapsedDays)
    );
  }

  const factors: ProgressFactors = {
    milestoneScore: Math.max(0, Math.min(100, params.milestoneScore)),
    visualStageScore,
    componentDetectionScore: componentScore,
    historicalVelocityScore: Math.round(historicalVelocityScore * 10) / 10,
    equipmentActivityScore: equipmentScore,
  };

  // 3. Weighted sum
  const rawEstimate =
    normMilestoneWeight * factors.milestoneScore +
    normVisualStageWeight * factors.visualStageScore +
    normComponentWeight * factors.componentDetectionScore +
    normHistWeight * factors.historicalVelocityScore +
    normEquipWeight * factors.equipmentActivityScore;

  const estimatedProgress = Math.round(Math.max(0, Math.min(100, rawEstimate)) * 10) / 10;

  // 4. Uncertainty band estimation
  // Variance depends on agreement between visual stage and milestone score
  const discrepancy = Math.abs(factors.visualStageScore - factors.milestoneScore);
  const uncertaintyHalfWidth = Math.max(2.5, Math.min(9.0, discrepancy * 0.15 + 2.0));
  const lowerBound = Math.max(0, Math.round((estimatedProgress - uncertaintyHalfWidth) * 10) / 10);
  const upperBound = Math.min(100, Math.round((estimatedProgress + uncertaintyHalfWidth) * 10) / 10);

  const deltaSincePrevious =
    params.previousProgress !== undefined
      ? Math.round((estimatedProgress - params.previousProgress) * 10) / 10
      : undefined;

  return {
    formulaDescription:
      'Multi-factor weighted analytic combination: (0.35 × Milestone) + (0.25 × Visual Stage) + (0.15 × Component Detections) + (0.15 × Historical Velocity) + (0.10 × Equipment Density)',
    weights: {
      milestoneWeight: normMilestoneWeight,
      visualStageWeight: normVisualStageWeight,
      componentWeight: normComponentWeight,
      historicalVelocityWeight: normHistWeight,
      equipmentWeight: normEquipWeight,
    },
    factors,
    estimatedProgress,
    previousEstimate: params.previousProgress,
    deltaSincePrevious,
    confidenceInterval: [lowerBound, upperBound],
    provenance: params.provenance ?? 'CALCULATED_ANALYTIC',
    notes: `Calculated from ${params.detectedBoxes.length} detected features with ${params.visualStage} classification baseline.`,
  };
}
