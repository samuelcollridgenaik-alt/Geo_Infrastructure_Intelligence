# REST API Specification

OpenAPI compatible REST API specification for Geo Infrastructure Intelligence.

## Endpoints

### 1. Projects API
- `GET /api/projects`: List projects with search, filter (`type`, `status`, `condition`), and pagination (`page`, `limit`).
- `POST /api/projects`: Register a new infrastructure project.
- `GET /api/projects/:id`: Detailed dossier including inspection history, budget, and coordinates.
- `PUT /api/projects/:id`: Update project attributes.
- `DELETE /api/projects/:id`: Delete a project.

### 2. Inspections API
- `GET /api/projects/:id/inspections`: List all inspection records for a project.
- `POST /api/inspections`: Create a new field inspection with visual stage, progress, notes, and photos.

### 3. Computer Vision AI API
- `POST /api/ai/inspect`:
  - Request body: `{ imageUrl, milestoneScore, visualStageHint, demoMode, projectId }`
  - Returns: Object detection bounding boxes, stage classification probabilities, progress analytics calculation.
  - If Python ML service is offline and `demoMode: false`: returns `503 Service Unavailable`.

### 4. Analytics & Geospatial API
- `GET /api/analytics/overview`: Portfolio KPIs, asset class distribution, status breakdown.
- `GET /api/analytics/cv`: Isolated detection frequencies, confidence score distribution histogram.
- `GET /api/geojson`: Standard RFC 7946 GeoJSON FeatureCollection of all monitored public works.

### 5. Gemini Grounded Synthesis API
- `POST /api/gemini/summary`: Generates formal grounded inspection report (strictly without hallucinations).
- `POST /api/gemini/query`: Translates natural language queries into safe, read-only analytics operations.

### 6. Health & MLOps API
- `GET /api/health`: Application server status.
- `GET /api/health/ml`: Python FastAPI machine learning microservice connection status.
- `GET /api/models`: Model registry catalog and evaluation metrics.
- `GET /api/audit-logs`: Audit trail records.
