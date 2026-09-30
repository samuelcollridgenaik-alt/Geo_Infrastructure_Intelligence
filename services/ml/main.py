"""
FastAPI Machine Learning Microservice
Geo Infrastructure Intelligence
Port: 8000
"""

import io
import time
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.yolo_detector import InfraYoloDetector
from models.resnet_classifier import ResNetStageClassifier
from preprocessing.pipeline import letterbox_image, enhance_contrast_clahe

app = FastAPI(
    title="Geo Infrastructure Intelligence - Computer Vision API",
    description="Academic prototype API for YOLO public works detection and ResNet construction stage classification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
yolo_detector = InfraYoloDetector()
resnet_classifier = ResNetStageClassifier()

class HealthResponse(BaseModel):
    status: str
    yolo_model_ready: bool
    resnet_model_ready: bool
    device: str
    timestamp: float

@app.get("/", tags=["Root"])
def root():
    return {
        "service": "Geo Infrastructure Intelligence ML Service",
        "role": "Computer Vision & Stage Analytics Backend",
        "yolo_detector": yolo_detector.model_name,
        "yolo_loaded": yolo_detector.is_loaded,
        "resnet_classifier": resnet_classifier.model_name,
        "resnet_trained": resnet_classifier.is_trained,
        "docs_url": "/docs",
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    import torch
    device_name = "cuda" if torch.cuda.is_available() else "cpu"
    return {
        "status": "online",
        "yolo_model_ready": yolo_detector.is_loaded,
        "resnet_model_ready": resnet_classifier.is_trained,
        "device": device_name,
        "timestamp": time.time(),
    }

@app.post("/predict/yolo", tags=["Inference"])
async def predict_yolo(
    file: UploadFile = File(...),
    confidence: float = Query(0.25, ge=0.1, le=0.99)
):
    try:
        from PIL import Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        return yolo_detector.predict(image, conf_threshold=confidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/resnet", tags=["Inference"])
async def predict_resnet(file: UploadFile = File(...)):
    try:
        from PIL import Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        return resnet_classifier.predict(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/pipeline", tags=["Pipeline"])
async def full_cv_pipeline(
    file: UploadFile = File(...),
    confidence: float = Query(0.25, ge=0.1, le=0.99),
    milestone_score: float = Query(50.0, ge=0.0, le=100.0)
):
    """
    Executes complete end-to-end CV pipeline:
    Image -> YOLO Detection -> ResNet Classification -> Progress Analytics
    """
    try:
        from PIL import Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        yolo_res = yolo_detector.predict(image, conf_threshold=confidence)
        resnet_res = resnet_classifier.predict(image)

        return {
            "object_detection": yolo_res,
            "stage_classification": resnet_res,
            "pipeline_timestamp": time.time(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
