# Dataset Strategy & Synthetic Benchmark

## 1. Dataset Ethics & Academic Integrity
Per project guidelines, this academic prototype does NOT fabricate fake real-world data or claim that classified satellite telemetry was processed when it was not.

The repository includes a clearly labeled synthetic development benchmark:
- **Spatial Grounding:** Real geographic coordinates across Indian states and districts (Maharashtra, Tamil Nadu, Karnataka, Gujarat, Telangana, Rajasthan) to validate GIS spatial rendering.
- **Image Provenance:** High-resolution public domain inspection benchmark photographs paired with validated bounding boxes and stage labels.
- **Data Tagging:** All records are tagged with `provenance: 'CALCULATED_ANALYTIC'` or `'DEMO_MOCK'`.

## 2. Directory Layout for Real Dataset Integration
```
data/
├── raw/                      # Unprocessed field camera captures
├── processed/                # Normalized, letterboxed 640x640 images
├── yolo/
│   ├── images/               # train / val / test image splits
│   ├── labels/               # YOLO format .txt bounding boxes
│   └── infra.yaml            # Ultralytics dataset configuration
├── classification/
│   ├── early_construction/
│   ├── mid_construction/
│   ├── advanced_construction/
│   ├── finishing_work/
│   └── completed/
└── database.json             # Serialized database repository
```
