"""
Evaluation Metrics & Confusion Matrix Computations
Geo Infrastructure Intelligence Academic Research
"""

from typing import List, Dict, Any
import numpy as np

def compute_classification_metrics(y_true: List[str], y_pred: List[str], classes: List[str]) -> Dict[str, Any]:
    """
    Computes real classification metrics using scikit-learn or pure numpy.
    Includes Precision, Recall, F1, Accuracy, and Confusion Matrix.
    """
    try:
        from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
        acc = float(accuracy_score(y_true, y_pred))
        report = classification_report(y_true, y_pred, labels=classes, output_dict=True, zero_division=0)
        cm = confusion_matrix(y_true, y_pred, labels=classes).tolist()

        return {
            "accuracy": round(acc, 4),
            "macro_avg": {
                "precision": round(report["macro avg"]["precision"], 4),
                "recall": round(report["macro avg"]["recall"], 4),
                "f1_score": round(report["macro avg"]["f1-score"], 4),
            },
            "per_class": {
                cls_name: {
                    "precision": round(report[cls_name]["precision"], 4),
                    "recall": round(report[cls_name]["recall"], 4),
                    "f1_score": round(report[cls_name]["f1-score"], 4),
                    "support": report[cls_name]["support"],
                }
                for cls_name in classes if cls_name in report
            },
            "confusion_matrix": cm,
            "classes": classes,
        }
    except Exception as e:
        # Fallback pure-python computation
        total = len(y_true)
        if total == 0:
            return {"error": "Empty ground truth dataset"}
        
        correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)
        return {
            "accuracy": round(correct / total, 4),
            "classes": classes,
            "note": f"Computed via pure python fallback ({e})"
        }
