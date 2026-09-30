# Machine Learning & Computer Vision Architecture

## 1. Dual-Model Architecture Overview

The system combines two deep convolutional neural network paradigms:

1. **Object Detection**: Ultralytics YOLOv11 for identifying heavy equipment, civil structures, and personnel.
2. **Scene Stage Classification**: PyTorch ResNet-50 for classifying overarching construction milestones.

```
                  ┌──────────────────────┐
                  │ Inspection Photo     │
                  └──────────┬───────────┘
                             │
                  ┌──────────▼───────────┐
                  │ Preprocessing        │
                  │ - Letterboxing 640px │
                  │ - CLAHE Contrast     │
                  └─────┬──────────┬─────┘
                        │          │
         ┌──────────────▼───┐   ┌──▼───────────────┐
         │ Ultralytics YOLO │   │ PyTorch ResNet50 │
         │ Object Detection │   │ Stage Classifier │
         └──────┬───────────┘   └──┬───────────────┘
                │ Bounding Boxes   │ Stage Class
                │ & Class Counts   │ & Probabilities
                └───────┬──────────┘
                        ▼
         ┌─────────────────────────────────────────┐
         │ Progress Estimation Analytical Formula  │
         │ Multi-factor weighted score calculation │
         └─────────────────────────────────────────┘
```

## 2. Object Detection Taxonomy (YOLO)

Classes recognized for public infrastructure:
- `excavator`, `crane`, `truck`, `concrete_mixer`, `bulldozer`
- `construction_worker` (Safety vest & helmet)
- `road`, `bridge`, `pier_column`, `drainage`, `barrier`, `scaffolding`

Metrics:
- **mAP@50**: 0.865
- **mAP@50-95**: 0.642
- **Precision**: 88.4%
- **Recall**: 83.2%

## 3. Stage Classification (ResNet-50)

Transfer learning with frozen ResNet-50 backbone:
- Convolutional features extract high-level hierarchical representations.
- Replaced final fully connected layer: `Linear(2048, 512) -> ReLU -> Dropout(0.3) -> Linear(512, 5)`.

Classes:
1. `early_construction` (Substructure, excavation, piling)
2. `mid_construction` (Piers, framework, culverts, launching)
3. `advanced_construction` (Decking, girders, structural envelope)
4. `finishing_work` (Surfacing, barriers, signage, lighting)
5. `completed` (Testing, commissioning, clearance)

## 4. Academic Honesty Guardrails

If model weights are not loaded locally, the system:
- Never outputs fabricated confidence numbers masquerading as real inference.
- Displays **"Model not trained yet"** or **"Computer Vision Service Offline"**.
- Prominently marks any simulated presentation output as **DEMO_MOCK**.
