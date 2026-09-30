# GEO INFRASTRUCTURE INTELLIGENCE
### “Geo-Spatial Data Visualization and Convolutional Vision Framework for Automated Monitoring of Public Infrastructure Progress”

An academic prototype combining Data Analytics, Computer Vision (YOLO + ResNet), Geographic Information Systems (GIS), and Large Language Model Grounding for public civil infrastructure monitoring.

---

## 1. Problem Statement
Monitoring large-scale public infrastructure projects (expressways, elevated corridors, bridges, transit tunnels, stormwater channels) traditionally relies on sporadic, manual field audits prone to subjective estimations, reporting delays, and lack of visual traceability. This project establishes an automated monitoring framework coupling satellite/ground GIS spatial tracking with convolutional computer vision to verify progress, detect machinery, classify visual construction stages, and compute transparent progress analytics.

---

## 2. Key Objectives
- **Geospatial Tracking:** Map public works projects in standard WGS 84 coordinates with interactive status indicators, district clustering, and RFC 7946 GeoJSON exports.
- **Convolutional Vision Framework:**
  - **Object Detection:** Ultralytics YOLOv11 for machinery, worker safety gear, and structural components.
  - **Stage Classification:** PyTorch ResNet-50 transfer learning backbone for civil construction phases.
- **Analytical Progress Engine:** Transparent mathematical formula combining visual stages, component presence, contractual milestones, and historical velocity into an estimated completion score.
- **Data Analytics:** Portfolio KPIs, longitudinal planned vs observed trajectory curves, and confidence distributions.
- **Gemini Multimodal Grounding:** Grounded inspection report synthesis and read-only natural language querying strictly without hallucinating dates, measurements, or equipment.
- **Academic Rigor:** Explicit demarcation between `REAL_INFERENCE`, `CALCULATED_ANALYTIC`, and `DEMO_MOCK`.

---

## 3. Technology Stack & Versions
- **Frontend:** React 19 (`19.0.1`), TypeScript (`7.0.2`), Vite (`8.3.0`), Tailwind CSS v4, Lucide Icons, Recharts (`2.15.x`), Leaflet (`1.9.4`).
- **Application Server:** Node.js v22, Express (`4.21.2`), `@google/genai` (`2.4.0`), `tsx`.
- **Computer Vision Microservice:** Python 3.10, FastAPI, PyTorch, Torchvision, Ultralytics YOLO, OpenCV, Pillow, Scikit-learn.
- **Geospatial & Storage:** OpenStreetMap / CartoDB tiles, GeoJSON, file-backed normalized relational repository.

---

## 4. Setup & Running Instructions

### Step 1: Start Application Server & Web Interface
```bash
# Install dependencies
npm install

# Start development full-stack server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Step 2: (Optional) Launch Python Computer Vision Service
```bash
cd services/ml
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: If the Python service is offline, the interface displays "Computer Vision Service Offline", and provides a toggle to Demo Mode for academic presentations.*

### Step 3: Run the Academic Test Suite
```bash
npm test
```
Executes all 32 unit and integration tests.

---

## 5. Progress Estimation Mathematical Formula

$$\text{Estimated Progress } E = W_m \cdot S_{\text{milestone}} + W_v \cdot S_{\text{visual}} + W_c \cdot S_{\text{components}} + W_h \cdot S_{\text{velocity}} + W_e \cdot S_{\text{equipment}}$$

Subject to:
$$\sum W_i = 1.0 \quad \text{and} \quad 0 \le E \le 100$$

- $W_m = 0.35$ (Contractual Milestone Target)
- $W_v = 0.25$ (ResNet-50 Visual Stage Baseline: 15% Early, 45% Mid, 75% Advanced, 90% Finishing, 100% Completed)
- $W_c = 0.15$ (Detected Structural Parts: Piers, Girders, Decks, Guardrails)
- $W_h = 0.15$ (Historical Velocity from Elapsed Observation Days)
- $W_e = 0.10$ (Heavy Equipment Activity Density: Excavators, Cranes, Mixers)

---

## 6. Project Architecture & Folder Structure
```
geo-infrastructure-intelligence/
├── data/                       # Serialized database & seed assets
├── docs/                       # Comprehensive technical documentation
│   ├── architecture.md
│   ├── setup.md
│   ├── database.md
│   ├── machine-learning.md
│   ├── dataset.md
│   ├── api.md
│   ├── testing.md
│   └── deployment.md
├── services/
│   └── ml/                     # Python Computer Vision Microservice
│       ├── models/             # YOLO detector & ResNet classifier
│       ├── preprocessing/      # Letterboxing & CLAHE enhancement
│       ├── training/           # Fine-tuning scripts
│       ├── evaluation/         # Metrics & confusion matrix
│       ├── main.py             # FastAPI entry point
│       └── requirements.txt
├── src/
│   ├── components/             # Modular React UI views
│   ├── server/                 # Database repository & relational store
│   ├── utils/                  # Analytical formulas & math engine
│   ├── types.ts                # Domain types & interfaces
│   ├── App.tsx                 # Main application
│   └── index.css               # Tailwind styling & Leaflet overrides
├── tests/
│   └── run_all_tests.ts        # 32-case automated academic test suite
├── server.ts                   # Express full-stack server & Vite middleware
├── package.json
└── README.md
```

---

## 7. Limitations & Future Scope
- **Current Limitations:** Object detection performance depends on resolution and clear daylight weather. Deep subterranean tunneling progress cannot be directly assessed from surface imagery alone.
- **Future Scope:** Integrating Synthetic Aperture Radar (SAR) for deformation monitoring, multi-spectral NDVI for environmental clearance, and Edge-AI drone onboard processing.
