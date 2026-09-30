# Database Schema & Relational Design

The database abstraction implements a 3NF normalized schema compatible with SQLite and scalable to PostgreSQL with PostGIS extensions.

## Entity Relational Structure

### 1. `projects`
- `id` (VARCHAR PK): e.g. `proj-001`
- `code` (VARCHAR UNIQUE): e.g. `INFRA-NH-48X`
- `name` (VARCHAR): Project title
- `description` (TEXT): Engineering scope
- `infrastructure_type` (ENUM): `highway_road`, `bridge_flyover`, `metro_rail`, `water_drainage`, `urban_building`, `energy_grid`
- `status` (ENUM): `planned`, `in_progress`, `delayed`, `under_inspection`, `completed`
- `contractor` (VARCHAR): Primary construction contractor
- `supervising_agency` (VARCHAR): Government oversight authority
- `start_date` (DATE)
- `target_completion_date` (DATE)
- `current_progress_percent` (FLOAT): 0.0 to 100.0
- `planned_progress_percent` (FLOAT): 0.0 to 100.0
- `condition_rating` (ENUM): `good`, `moderate`, `poor`, `critical`
- `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP)

### 2. `project_locations` (Spatial Attributes)
- `project_id` (FK -> projects.id)
- `latitude` (DOUBLE PRECISION): -90.0 to +90.0
- `longitude` (DOUBLE PRECISION): -180.0 to +180.0
- `elevation_meters` (FLOAT)
- `district` (VARCHAR), `state` (VARCHAR), `country` (VARCHAR)

### 3. `inspections`
- `id` (VARCHAR PK): e.g. `insp-001-1`
- `project_id` (FK -> projects.id)
- `inspection_date` (DATE)
- `inspector_name` (VARCHAR)
- `visual_stage` (ENUM): `early_construction`, `mid_construction`, `advanced_construction`, `finishing_work`, `completed`
- `estimated_progress_percent` (FLOAT)
- `progress_delta_percent` (FLOAT)
- `confidence_score` (FLOAT)
- `provenance` (ENUM): `REAL_INFERENCE`, `CALCULATED_ANALYTIC`, `DEMO_MOCK`
- `notes` (TEXT)

### 4. `inspection_images` & `detections`
- `id` (VARCHAR PK)
- `inspection_id` (FK -> inspections.id)
- `url` (VARCHAR)
- `bounding_boxes` (JSON / Relation): `{ id, label, confidence, x, y, width, height }`
- `model_name` (VARCHAR), `model_version` (VARCHAR)

### 5. `model_registry`
- `id` (VARCHAR PK)
- `name` (VARCHAR), `version` (VARCHAR), `task` (VARCHAR)
- `status` (VARCHAR): `pretrained`, `custom_trained`, `evaluation_pending`, `mock_prototype`
- `metrics` (JSON): `{ precision, recall, mAP50, accuracy }`
