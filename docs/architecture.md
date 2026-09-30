# System Architecture

## Geo Infrastructure Intelligence
**“Geo-Spatial Data Visualization and Convolutional Vision Framework for Automated Monitoring of Public Infrastructure Progress”**

### 1. Architectural Topology

```
                  ┌──────────────────────────────────────────┐
                  │          React 19 SPA Frontend           │
                  │  (TypeScript, Tailwind CSS, Leaflet,     │
                  │   Recharts, Lucide, Zero-Pill Design)    │
                  └────────────────────┬─────────────────────┘
                                       │ HTTP / REST & GeoJSON
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │      Express Application Server          │
                  │    (REST API, Telemetry Cache, DB repo)  │
                  └───────┬───────────────────────────┬──────┘
                          │                           │
            ┌─────────────┴───────────────┐           │ Python IPC /
            │ Gemini-3.8-Flash Foundation │           │ HTTP Proxy
            │ (Grounded Audit & NL Query) │           │ (Port 8000)
            └─────────────────────────────┘           ▼
                                       ┌─────────────────────────────┐
                                       │   Python ML FastAPI Service │
                                       │  - Ultralytics YOLOv11      │
                                       │  - ResNet-50 Classifier     │
                                       │  - OpenCV Preprocessing     │
                                       └─────────────────────────────┘
                                                      │
                                       ┌──────────────┴──────────────┐
                                       │   Normalized Relational     │
                                       │   Repository (SQLite / DB)  │
                                       └─────────────────────────────┘
```

### 2. Layer Descriptions

1. **Frontend Presentation Tier**:
   - Single Page Application built on React 19 and Vite.
   - Spatial visualization powered by Leaflet and OpenStreetMap WGS 84 tiles.
   - Strict adherence to the `frontend-design` constitution: zero-pill typography, high information density, WCAG AA contrast, dark and light mode.

2. **Application Server & Integration Tier**:
   - Node.js Express server (`server.ts`) hosting REST endpoints, GeoJSON generation, and Vite middlewares.
   - Bridges to the Python Machine Learning service.
   - Truthful ML health monitoring: if the Python microservice is not running, reports `503 Computer Vision Service Offline` unless explicitly overridden via Demo Mode.

3. **Computer Vision Microservice**:
   - Python FastAPI application running on port 8000.
   - Dual-head convolutional vision: Ultralytics YOLO (heavy equipment and structural element detection) and ResNet-50 (construction stage classification).

4. **Persistence & Data Tier**:
   - Normalized relational schema supporting projects, spatial geometries, inspections, bounding boxes, model registries, and audit logs.
   - Pre-configured with realistic synthetic public works data.
