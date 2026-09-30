"""
Ultralytics YOLO Infrastructure Object Detector Wrapper
Geo Infrastructure Intelligence
"""

import time
from typing import List, Dict, Any, Optional

INFRA_CLASSES = [
    "road",
    "vehicle",
    "truck",
    "excavator",
    "crane",
    "construction_worker",
    "building",
    "bridge",
    "drainage",
    "streetlight",
    "construction_material",
    "barrier",
    "machinery",
    "pier_column",
]

class InfraYoloDetector:
    def __init__(self, model_weight_path: Optional[str] = None):
        self.model_name = "Ultralytics-YOLOv11-Infra"
        self.version = "11.2.0-custom"
        self.classes = INFRA_CLASSES
        self.is_loaded = False
        self.model = None

        try:
            from ultralytics import YOLO
            # Load custom weights if provided, or fallback to standard pretrained
            weight_target = model_weight_path if model_weight_path else "yolo11n.pt"
            self.model = YOLO(weight_target)
            self.is_loaded = True
            print(f"[YOLO] Successfully loaded model weights: {weight_target}")
        except Exception as e:
            print(f"[YOLO] Ultralytics YOLO not loaded: {e}. Running in simulation/interface mode.")
            self.is_loaded = False

    def predict(self, image_input, conf_threshold: float = 0.25) -> Dict[str, Any]:
        start_time = time.time()

        if not self.is_loaded or self.model is None:
            return {
                "model_name": self.model_name,
                "model_version": self.version,
                "is_real_inference": False,
                "provenance": "DEMO_MOCK",
                "inference_time_ms": int((time.time() - start_time) * 1000),
                "error": "Ultralytics YOLO model weights not loaded on host. Start python service with installed weights.",
                "boxes": [],
                "detected_classes_count": {},
                "total_objects": 0,
            }

        # Real Ultralytics inference
        results = self.model.predict(image_input, conf=conf_threshold, verbose=False)
        boxes_out = []
        class_counts = {}

        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                cls_name = r.names.get(cls_id, f"class_{cls_id}")
                conf = float(box.conf[0])
                xyxy = box.xyxy[0].tolist() # [x1, y1, x2, y2]
                orig_shape = r.orig_shape # (h, w)
                
                # Normalize coordinates (0..1)
                norm_x = xyxy[0] / orig_shape[1]
                norm_y = xyxy[1] / orig_shape[0]
                norm_w = (xyxy[2] - xyxy[0]) / orig_shape[1]
                norm_h = (xyxy[3] - xyxy[1]) / orig_shape[0]

                class_counts[cls_name] = class_counts.get(cls_name, 0) + 1
                boxes_out.append({
                    "id": f"det_{len(boxes_out)+1}",
                    "label": cls_name,
                    "confidence": round(conf, 4),
                    "x": round(norm_x, 4),
                    "y": round(norm_y, 4),
                    "width": round(norm_w, 4),
                    "height": round(norm_h, 4),
                })

        return {
            "model_name": self.model_name,
            "model_version": self.version,
            "is_real_inference": True,
            "provenance": "REAL_INFERENCE",
            "inference_time_ms": int((time.time() - start_time) * 1000),
            "boxes": boxes_out,
            "detected_classes_count": class_counts,
            "total_objects": len(boxes_out),
        }
