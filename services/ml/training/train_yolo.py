"""
Ultralytics YOLO Fine-Tuning Script: Infrastructure Object Detection
Geo Infrastructure Intelligence
"""

import os
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Fine-tune Ultralytics YOLO for Public Infrastructure")
    parser.add_argument("--data_yaml", type=str, default="./data/yolo/infra.yaml", help="Path to YOLO data yaml")
    parser.add_argument("--model", type=str, default="yolo11n.pt", help="Base model weights")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    return parser.parse_args()

def train():
    args = parse_args()
    print("=" * 60)
    print("GEO INFRASTRUCTURE INTELLIGENCE - ULTRALYTICS YOLO TRAINING")
    print("=" * 60)
    print(f"Data Config: {args.data_yaml}")
    print(f"Base Model:  {args.model}")
    print(f"Epochs:      {args.epochs}")
    print(f"Image Size:  {args.imgsz}")

    try:
        from ultralytics import YOLO
        if not os.path.exists(args.data_yaml):
            print(f"[ERROR] Data config '{args.data_yaml}' not found.")
            print("[NOTE] Generate synthetic or real annotations using scripts/prepare_yolo_dataset.py.")
            return

        model = YOLO(args.model)
        model.train(data=args.data_yaml, epochs=args.epochs, imgsz=args.imgsz, batch=args.batch)
        print("[SUCCESS] Model training completed.")
    except Exception as e:
        print(f"[INFO] Ultralytics module not currently active in minimal runtime: {e}")
        print("[NOTE] Run in Python virtual environment with ultralytics installed.")

if __name__ == "__main__":
    train()
