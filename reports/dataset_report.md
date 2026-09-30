# Dataset Audit and Provenance Report

**Project Title:** Geo-Spatial Data Visualization and Convolutional Vision Framework for Automated Monitoring of Public Infrastructure Progress  
**Phase:** Phase 2A — Dataset Discovery & Audit  
**Date:** September 29, 2026  
**Auditor:** Lead System Architect / Data Scientist  

---

## 1. Executive Summary

In Phase 2A, candidate datasets were audited to determine suitability across three core analytical components:
1. **Geospatial & Temporal Analytics**
2. **Convolutional Image Classification (ResNet-50)**
3. **Object Detection (Ultralytics YOLO26)**

The primary candidate dataset audited is **`Outerview/construction-infrastructure-change`** (Hugging Face / Outerview).

---

## 2. Dataset Identification & Licensing

| Attribute | Value |
| :--- | :--- |
| **Dataset Identifier** | `Outerview/construction-infrastructure-change` |
| **Host / Repository** | Hugging Face Hub |
| **License** | Creative Commons Attribution 4.0 International (**CC-BY-4.0**) |
| **Commercial & Academic Rights** | Permitted with attribution; non-restrictive for academic benchmarking |
| **Total Tabular Records** | **55,801** |
| **Total Unique Filenames** | **55,801** |
| **Packaged Sample Images** | **100** (`images-batch-0001.zip`, 27.5 MB) |
| **Corrupt Files** | **0** (all 100 images extracted and validated successfully) |

---

## 3. Annotation Format & Modality Audit

### 3.1 Schema & Columns
The dataset contains 10 tabular attributes:
- `filename`: Unique image identifier (e.g. `construction-site-1220533271737396.jpg`)
- `image_folder`: Relative archive folder (`images/batch-0001`)
- `date`: ISO-8601 capture timestamp (spanning 2012 to 2026)
- `country`, `state`, `city`: Municipal geographic metadata
- `feature`: Categorical scene label matched via semantic visual search
- `latitude`, `longitude`: WGS-84 decimal degree spatial coordinates
- `source`: Attribution (`outerview, Mapillary`)

### 3.2 Label Distribution (Overall: 55,801 records)
- **Pothole**: 20,000 (35.8%)
- **Construction Site**: 12,000 (21.5%)
- **Roadwork**: 12,000 (21.5%)
- **Crane**: 7,983 (14.3%)
- **Excavator**: 3,764 (6.7%)
- **Scaffolding**: 54 (0.1%)

### 3.3 Critical Annotation Finding (No Bounding Boxes)
* **Annotation Type:** Image-level categorical feature match.
* **Finding:** The dataset **DOES NOT CONTAIN BOUNDING BOXES** `[x_center, y_center, width, height]`.
* **Scientific Conclusion:** This dataset **cannot be used for training or mAP evaluation of an object detection model (YOLO)** without manual or synthetic bounding box annotation. Attempting to calculate mAP against this dataset directly would violate academic integrity.

---

## 4. Geographic & Temporal Coverage

- **Valid Coordinates:** 55,801 / 55,801 (100.0% valid WGS-84 coordinates).
- **Latitude Span:** $-54.8019^\circ$ to $+69.4795^\circ$
- **Longitude Span:** $-173.2418^\circ$ to $+153.4569^\circ$
- **Geographic Coverage:** Global with highest density in North America and Western Europe (Top: United States: 49,096, Germany: 1,825, France: 851, Belgium: 717, Canada: 638).
- **Temporal Span:** Strong coverage from 2014 to 2026 (Peak: 2018 with 14,633 records; 2,002 records in 2026).

---

## 5. Component Suitability Matrix

| Component | Suitability | Rationale & Requirements |
| :--- | :--- | :--- |
| **Geospatial Analytics (Phase 2K)** | **EXCELLENT (100% Ready)** | 55,801 authentic WGS-84 coordinates, spatial distributions, municipal density, and regional clustering. |
| **Temporal Analytics (Phase 2J)** | **EXCELLENT (100% Ready)** | Authentic ISO timestamps spanning multiple years allowing longitudinal trajectory analysis. |
| **ResNet-50 Classification (Phase 2F–2H)** | **VALID (Ready for Categorical Head)** | Verified image-level classes corresponding directly to infrastructure scenes (Construction Site, Roadwork, Crane, Excavator, Pothole). |
| **YOLO26 Object Detection (Phase 2B–2E)** | **REQUIRES DUAL-STRATEGY** | YOLO26 baseline inference will run on verified infrastructure imagery from the dataset; for custom training, a validated bounding-box dataset or verified annotated subset is mandatory. |

---

## 6. Recommended Dataset Strategy

1. **For GIS & Temporal Analytics:** Ingest and process the full 55,801 verified records from `Outerview/construction-infrastructure-change` (`data.csv`).
2. **For ResNet-50 Transfer Learning:** Utilize verified image samples categorized by infrastructure visual stages and feature types.
3. **For YOLO26 Object Detection:**
   - Execute pretrained `YOLO26n` baseline inference across fixed benchmark infrastructure test images.
   - For custom YOLO26 training, compile a legitimate public infrastructure bounding-box annotation set with documented train/val/test splits.
