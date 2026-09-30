/**
 * Geo Infrastructure Intelligence
 * Academic Research Prototype - Shared Types and Domain Models
 *
 * "Geo-Spatial Data Visualization and Convolutional Vision Framework
 *  for Automated Monitoring of Public Infrastructure Progress"
 */

export type InfrastructureType =
  | 'highway_road'
  | 'bridge_flyover'
  | 'metro_rail'
  | 'water_drainage'
  | 'urban_building'
  | 'energy_grid';

export type ProjectStatus =
  | 'planned'
  | 'in_progress'
  | 'delayed'
  | 'under_inspection'
  | 'completed';

export type ConditionRating =
  | 'good'
  | 'moderate'
  | 'poor'
  | 'critical';

export type ConstructionVisualStage =
  | 'early_construction'
  | 'mid_construction'
  | 'advanced_construction'
  | 'finishing_work'
  | 'completed';

export type ProvenanceType =
  | 'REAL_INFERENCE'
  | 'CALCULATED_ANALYTIC'
  | 'DEMO_MOCK';

export interface ProjectLocation {
  name: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  address?: string;
}

export interface ProjectBudget {
  allocated: number;
  spent: number;
  currency: string;
}

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  width: number; // 0..1 normalized
  height: number; // 0..1 normalized
  color?: string;
  category?: 'equipment' | 'material' | 'structure' | 'safety';
}

export interface DetectionResult {
  modelName: string;
  modelVersion: string;
  inferenceTimeMs: number;
  provenance: ProvenanceType;
  boxes: BoundingBox[];
  detectedClassesCount: Record<string, number>;
  totalObjects: number;
  timestamp: string;
}

export interface ClassificationResult {
  modelName: string;
  modelVersion: string;
  inferenceTimeMs: number;
  provenance: ProvenanceType;
  predictedStage: ConstructionVisualStage;
  confidence: number;
  stageProbabilities: Record<ConstructionVisualStage, number>;
  isTrained: boolean;
  timestamp: string;
}

export interface ProgressFactors {
  milestoneScore: number; // 0..100
  visualStageScore: number; // 0..100
  componentDetectionScore: number; // 0..100
  historicalVelocityScore: number; // 0..100
  equipmentActivityScore: number; // 0..100
}

export interface ProgressFactorWeights {
  milestoneWeight: number; // default 0.35
  visualStageWeight: number; // default 0.25
  componentWeight: number; // default 0.15
  historicalVelocityWeight: number; // default 0.15
  equipmentWeight: number; // default 0.10
}

export interface ProgressAnalyticsResult {
  formulaDescription: string;
  weights: ProgressFactorWeights;
  factors: ProgressFactors;
  estimatedProgress: number; // 0..100
  previousEstimate?: number;
  deltaSincePrevious?: number;
  confidenceInterval: [number, number]; // e.g. [62.4, 68.2]
  provenance: ProvenanceType;
  notes: string;
}

export interface InspectionImage {
  id: string;
  inspectionId: string;
  url: string;
  caption: string;
  capturedAt: string;
  perspective?: 'aerial_drone' | 'ground_level' | 'perimeter_station' | 'satellite';
  detectionResults?: DetectionResult;
  classificationResult?: ClassificationResult;
  progressAnalytics?: ProgressAnalyticsResult;
}

export interface InspectionRecord {
  id: string;
  projectId: string;
  inspectionDate: string;
  inspectorName: string;
  inspectionType: 'routine' | 'drone_survey' | 'milestone_verification' | 'quality_audit';
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  weatherCondition: string;
  visualStage: ConstructionVisualStage;
  conditionRating: ConditionRating;
  estimatedProgressPercent: number;
  plannedProgressPercent: number;
  progressDeltaPercent: number;
  confidenceScore: number;
  provenance: ProvenanceType;
  notes: string;
  aiSummary?: string;
  images: InspectionImage[];
  createdAt: string;
}

export interface InfrastructureProject {
  id: string;
  code: string;
  name: string;
  description: string;
  infrastructureType: InfrastructureType;
  status: ProjectStatus;
  location: ProjectLocation;
  budget: ProjectBudget;
  contractor: string;
  supervisingAgency: string;
  startDate: string;
  targetCompletionDate: string;
  estimatedEndDate: string;
  currentProgressPercent: number;
  plannedProgressPercent: number;
  conditionRating: ConditionRating;
  inspectionCount: number;
  lastInspectionDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  inspections?: InspectionRecord[];
}

export interface ModelRegistryEntry {
  id: string;
  name: string;
  version: string;
  framework: string;
  task: 'object_detection' | 'image_classification' | 'multimodal_summary';
  status: 'pretrained' | 'custom_trained' | 'evaluation_pending' | 'mock_prototype';
  classes: string[];
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1?: number;
    mAP50?: number;
    mAP50_95?: number;
  };
  backboneArchitecture: string;
  trainingDatasetName?: string;
  trainingDatasetSize?: number;
  lastUpdated: string;
  isRealModelAvailable: boolean;
  notes: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  user: string;
}

export interface AnalyticsOverview {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  averageProgress: number;
  averagePlannedProgress: number;
  inspectionsThisMonth: number;
  totalInspections: number;
  criticalConditionCount: number;
  infrastructureTypeDistribution: Record<InfrastructureType, number>;
  projectStatusDistribution: Record<ProjectStatus, number>;
  conditionDistribution: Record<ConditionRating, number>;
  regionalDistribution: Record<string, number>;
}

export interface MlServiceHealth {
  status: 'online' | 'offline' | 'simulated';
  url: string;
  yoloModelReady: boolean;
  resnetModelReady: boolean;
  device: string;
  message: string;
}
