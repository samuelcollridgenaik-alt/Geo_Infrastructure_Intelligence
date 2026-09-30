"""
PyTorch ResNet-50 Construction Visual Stage Classifier
Geo Infrastructure Intelligence Academic Research
"""

import time
from typing import Dict, Any, Optional

CONSTRUCTION_STAGES = [
    "early_construction",
    "mid_construction",
    "advanced_construction",
    "finishing_work",
    "completed",
]

class ResNetStageClassifier:
    """
    ResNet-50 transfer learning architecture for public works stage classification.
    Backbone: Pretrained torchvision resnet50 (frozen features)
    Head: Sequential(Linear(2048, 512), ReLU(), Dropout(0.3), Linear(512, 5))
    """

    def __init__(self, weights_path: Optional[str] = None):
        self.model_name = "ResNet-50-InfraStage"
        self.version = "1.0.0-torch"
        self.classes = CONSTRUCTION_STAGES
        self.is_trained = False
        self.model = None

        if weights_path:
            self._load_custom_head(weights_path)

    def _build_model(self):
        try:
            import torch
            import torch.nn as nn
            from torchvision.models import resnet50, ResNet50_Weights

            # Load modern torchvision weights enum
            model = resnet50(weights=ResNet50_Weights.DEFAULT)

            # Freeze convolutional feature extraction backbone
            for param in model.parameters():
                param.requires_grad = False

            # Replace final fully connected classification head
            in_features = model.fc.in_features  # 2048
            model.fc = nn.Sequential(
                nn.Linear(in_features, 512),
                nn.ReLU(inplace=True),
                nn.Dropout(p=0.3),
                nn.Linear(512, len(self.classes))
            )
            return model
        except Exception as e:
            print(f"[ResNet] PyTorch / Torchvision import failed: {e}")
            return None

    def _load_custom_head(self, weights_path: str):
        try:
            import torch
            self.model = self._build_model()
            if self.model:
                state_dict = torch.load(weights_path, map_location="cpu")
                self.model.load_state_dict(state_dict)
                self.model.eval()
                self.is_trained = True
                print(f"[ResNet] Loaded fine-tuned stage classifier weights from {weights_path}")
        except Exception as e:
            print(f"[ResNet] Could not load trained weights: {e}")
            self.is_trained = False

    def predict(self, image_input) -> Dict[str, Any]:
        start_time = time.time()

        if not self.is_trained or self.model is None:
            return {
                "model_name": self.model_name,
                "model_version": self.version,
                "is_trained": False,
                "is_real_inference": False,
                "provenance": "DEMO_MOCK",
                "inference_time_ms": int((time.time() - start_time) * 1000),
                "status_message": "Model not trained yet. Weights not available on host system.",
                "predicted_stage": None,
                "confidence": 0.0,
                "stage_probabilities": {},
            }

        try:
            import torch
            from torchvision import transforms
            from PIL import Image

            if isinstance(image_input, str):
                pil_img = Image.open(image_input).convert("RGB")
            else:
                pil_img = image_input

            preprocess = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])

            tensor = preprocess(pil_img).unsqueeze(0)
            with torch.no_grad():
                logits = self.model(tensor)
                probs = torch.softmax(logits, dim=1).squeeze().tolist()

            max_idx = int(torch.argmax(logits, dim=1).item())
            prob_dict = {self.classes[i]: round(probs[i], 4) for i in range(len(self.classes))}

            return {
                "model_name": self.model_name,
                "model_version": self.version,
                "is_trained": True,
                "is_real_inference": True,
                "provenance": "REAL_INFERENCE",
                "inference_time_ms": int((time.time() - start_time) * 1000),
                "predicted_stage": self.classes[max_idx],
                "confidence": round(probs[max_idx], 4),
                "stage_probabilities": prob_dict,
            }
        except Exception as e:
            return {
                "model_name": self.model_name,
                "model_version": self.version,
                "is_trained": False,
                "is_real_inference": False,
                "provenance": "DEMO_MOCK",
                "inference_time_ms": int((time.time() - start_time) * 1000),
                "error": str(e),
                "predicted_stage": None,
                "confidence": 0.0,
                "stage_probabilities": {},
            }
