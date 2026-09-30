"""
Image Preprocessing Pipeline
Geo Infrastructure Intelligence
"""

from typing import Tuple, Optional
import numpy as np

def letterbox_image(image: np.ndarray, target_size: Tuple[int, int] = (640, 640)) -> Tuple[np.ndarray, float, Tuple[int, int]]:
    """
    Resize image with aspect-ratio preserving padding (letterboxing).
    Returns (padded_image, scale_ratio, (pad_w, pad_h))
    """
    try:
        import cv2
        h, w = image.shape[:2]
        target_w, target_h = target_size
        scale = min(target_w / w, target_h / h)
        new_w, new_h = int(w * scale), int(h * scale)
        
        resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
        canvas = np.full((target_h, target_w, 3), 114, dtype=np.uint8)
        
        pad_x = (target_w - new_w) // 2
        pad_y = (target_h - new_h) // 2
        
        canvas[pad_y:pad_y + new_h, pad_x:pad_x + new_w] = resized
        return canvas, scale, (pad_x, pad_y)
    except Exception:
        # Fallback if cv2 not available
        return image, 1.0, (0, 0)

def enhance_contrast_clahe(image: np.ndarray) -> np.ndarray:
    """
    Contrast Limited Adaptive Histogram Equalization for overcast/low-light inspection photos.
    """
    try:
        import cv2
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    except Exception:
        return image
