/**
 * Geo Infrastructure Intelligence - Academic Verification Test Suite
 * 32 Comprehensive Unit, Domain, and Analytical Test Cases
 */

import { computeProgressEstimation, STAGE_BASELINE_SCORES, calculateComponentScore, calculateEquipmentActivityScore } from '../src/utils/progressCalculator.ts';
import { db } from '../src/server/db.ts';
import { BoundingBox, ConstructionVisualStage } from '../src/types.ts';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedCount++;
    console.error(`  ✗ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
  }
}

console.log('\n=============================================================');
console.log('GEO INFRASTRUCTURE INTELLIGENCE - ACADEMIC TEST SUITE');
console.log('=============================================================\n');

// -----------------------------------------------------------------
// 1. Analytical Progress Calculation Tests
// -----------------------------------------------------------------
console.log('--- Suite 1: Analytical Progress & CV Formula Validation ---');

const dummyBoxes: BoundingBox[] = [
  { id: '1', label: 'excavator', confidence: 0.95, x: 0.1, y: 0.2, width: 0.3, height: 0.3, category: 'equipment' },
  { id: '2', label: 'pier_column', confidence: 0.90, x: 0.5, y: 0.3, width: 0.2, height: 0.4, category: 'structure' },
];

const res1 = computeProgressEstimation({
  visualStage: 'mid_construction',
  milestoneScore: 50.0,
  detectedBoxes: dummyBoxes,
});

assert(res1.estimatedProgress >= 0 && res1.estimatedProgress <= 100, 'T01: Progress estimate must stay within 0% to 100%');
assert(res1.weights.milestoneWeight + res1.weights.visualStageWeight + res1.weights.componentWeight + res1.weights.historicalVelocityWeight + res1.weights.equipmentWeight === 1.0, 'T02: Sum of normalized factor weights must equal 1.0');
assert(res1.confidenceInterval[0] <= res1.estimatedProgress && res1.estimatedProgress <= res1.confidenceInterval[1], 'T03: Estimated progress must reside within the uncertainty interval [lower, upper]');
assert(res1.provenance === 'CALCULATED_ANALYTIC', 'T04: Analytical estimation must be tagged with CALCULATED_ANALYTIC provenance');

const resEarly = computeProgressEstimation({ visualStage: 'early_construction', milestoneScore: 10, detectedBoxes: [] });
const resComp = computeProgressEstimation({ visualStage: 'completed', milestoneScore: 100, detectedBoxes: [] });
assert(resComp.estimatedProgress > resEarly.estimatedProgress, 'T05: Completed stage must yield strictly higher progress than early_construction');

assert(STAGE_BASELINE_SCORES.early_construction === 15.0, 'T06: Early construction baseline score is 15.0%');
assert(STAGE_BASELINE_SCORES.completed === 100.0, 'T07: Completed baseline score is 100.0%');

const compScore = calculateComponentScore([
  { id: 'c1', label: 'slab_deck', confidence: 0.9, x: 0, y: 0, width: 0.5, height: 0.5 },
  { id: 'c2', label: 'guardrail', confidence: 0.9, x: 0, y: 0, width: 0.5, height: 0.5 },
]);
assert(compScore >= 92, 'T08: High-tier components (guardrail, slab) contribute proportional structural score');

const eqScore0 = calculateEquipmentActivityScore([]);
const eqScore3 = calculateEquipmentActivityScore([
  { id: 'e1', label: 'crane', confidence: 0.9, x: 0, y: 0, width: 0.1, height: 0.1 },
  { id: 'e2', label: 'excavator', confidence: 0.9, x: 0, y: 0, width: 0.1, height: 0.1 },
]);
assert(eqScore3 > eqScore0, 'T09: Heavy equipment presence increases activity score relative to vacant site');

const deltaRes = computeProgressEstimation({
  visualStage: 'advanced_construction',
  milestoneScore: 70,
  detectedBoxes: dummyBoxes,
  previousProgress: 60.0,
});
assert(deltaRes.deltaSincePrevious !== undefined && deltaRes.deltaSincePrevious > 0, 'T10: Progress delta must accurately calculate positive change from previous inspection');

// -----------------------------------------------------------------
// 2. Database Repository & CRUD Tests
// -----------------------------------------------------------------
console.log('\n--- Suite 2: Relational Database Repository & CRUD ---');

const allProjects = db.getProjects({ limit: 100 });
assert(allProjects.projects.length >= 6, 'T11: Seed database contains initial infrastructure projects', `Found ${allProjects.projects.length}`);

const p1 = db.getProjectById('proj-001');
assert(p1 !== null && p1.code === 'INFRA-NH-48X', 'T12: Lookup project by ID returns valid record with code');

const searchRes = db.getProjects({ search: 'Elevated' });
assert(searchRes.projects.length >= 1, 'T13: Full-text search correctly filters projects by keyword');

const typeFilter = db.getProjects({ type: 'bridge_flyover' });
assert(typeFilter.projects.every(p => p.infrastructureType === 'bridge_flyover'), 'T14: Type filter strictly restricts results to requested infrastructure type');

const statusFilter = db.getProjects({ status: 'delayed' });
assert(statusFilter.projects.every(p => p.status === 'delayed'), 'T15: Status filter correctly isolates delayed projects');

// Create a new test project
const newProj = db.createProject({
  code: 'INFRA-TEST-99',
  name: 'Academic Test Bridge Expansion',
  description: 'Automated test suite validation entity',
  infrastructureType: 'bridge_flyover',
  status: 'planned',
  location: {
    name: 'Test Point',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    latitude: 18.5204,
    longitude: 73.8567,
    elevationMeters: 560,
  },
  budget: { allocated: 50000000, spent: 1000000, currency: 'INR' },
  contractor: 'Test Infrastructure Labs',
  supervisingAgency: 'Academic Evaluation Board',
  startDate: '2026-01-01',
  targetCompletionDate: '2027-01-01',
  estimatedEndDate: '2027-01-01',
  currentProgressPercent: 5.0,
  plannedProgressPercent: 10.0,
  conditionRating: 'good',
  tags: ['test', 'academic_validation'],
});

assert(newProj.id.startsWith('proj-'), 'T16: Project creation assigns standard prefixed identifier');
assert(db.getProjectById(newProj.id) !== null, 'T17: Newly created project is immediately queryable');

// Update project
const updated = db.updateProject(newProj.id, { currentProgressPercent: 15.5, status: 'in_progress' });
assert(updated !== null && updated.currentProgressPercent === 15.5 && updated.status === 'in_progress', 'T18: Project update reflects modified progress and status fields');

// Add inspection to project
const newInsp = db.addInspection(newProj.id, {
  projectId: newProj.id,
  inspectionDate: '2026-09-29',
  inspectorName: 'Prof. Test Evaluator',
  inspectionType: 'routine',
  gpsCoordinates: { lat: 18.5204, lng: 73.8567 },
  weatherCondition: 'Clear / Test',
  visualStage: 'early_construction',
  conditionRating: 'good',
  estimatedProgressPercent: 18.0,
  plannedProgressPercent: 20.0,
  progressDeltaPercent: 2.5,
  confidenceScore: 0.95,
  provenance: 'CALCULATED_ANALYTIC',
  notes: 'Automated test verification inspection.',
  images: [],
});

assert(newInsp !== null && newInsp.id.startsWith(`insp-${newProj.id}`), 'T19: Inspection creation generates correctly linked inspection record');
const refreshed = db.getProjectById(newProj.id);
assert(refreshed?.currentProgressPercent === 18.0, 'T20: Recording inspection updates project currentProgressPercent to latest estimate');
assert(refreshed?.inspectionCount === 1, 'T21: Project inspection count increments accurately');

// Delete project
const deleted = db.deleteProject(newProj.id);
assert(deleted === true, 'T22: Deleting project returns true');
assert(db.getProjectById(newProj.id) === null, 'T23: Deleted project is no longer retrievable');

// -----------------------------------------------------------------
// 3. Analytics & Geospatial GeoJSON Tests
// -----------------------------------------------------------------
console.log('\n--- Suite 3: Analytics & Geospatial GIS Engine ---');

const overview = db.getOverviewAnalytics();
assert(overview.totalProjects >= 6, 'T24: Overview analytics computes total projects count');
assert(overview.activeProjects + overview.completedProjects + overview.delayedProjects <= overview.totalProjects, 'T25: Status breakdown sub-counts do not exceed total projects');
assert(overview.averageProgress >= 0 && overview.averageProgress <= 100, 'T26: Average progress is bounded between 0% and 100%');

const geojson = db.getGeoJsonFeatureCollection();
assert(geojson.type === 'FeatureCollection', 'T27: GeoJSON export adheres to standard FeatureCollection format');
assert(geojson.features.length === overview.totalProjects, 'T28: Every project is mapped to a GeoJSON Feature');

const firstFeature = geojson.features[0];
assert(firstFeature.geometry.type === 'Point', 'T29: Project spatial geometry is Point representation');
assert(
  firstFeature.geometry.coordinates[0] >= -180 && firstFeature.geometry.coordinates[0] <= 180 &&
  firstFeature.geometry.coordinates[1] >= -90 && firstFeature.geometry.coordinates[1] <= 90,
  'T30: GeoJSON coordinates conform to valid [longitude, latitude] geospatial ranges'
);

// -----------------------------------------------------------------
// 4. Model Registry & Audit Log Verification
// -----------------------------------------------------------------
console.log('\n--- Suite 4: Model Registry & Provenance Tagging ---');

const models = db.getModels();
assert(models.length >= 3, 'T31: Model registry maintains registered deep learning models');

const resnetModel = models.find(m => m.id.includes('resnet'));
assert(resnetModel !== undefined && resnetModel.status === 'evaluation_pending', 'T32: ResNet model status reflects un-trained / evaluation pending state per academic integrity');

// Summary report
console.log('\n=============================================================');
console.log(`TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
console.log('=============================================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
