/**
 * Academic Documentation & Viva Defense Guide
 * Geo Infrastructure Intelligence
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Layers,
  Cpu,
  Database,
  Code,
  CheckCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const AcademicDocsView: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'architecture' | 'cv_pipeline' | 'analytics_formula' | 'viva_qa'>('architecture');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Academic Viva Examination & Technical Documentation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Core MCA / Data Analytics / Computer Vision theoretical underpinnings and oral defense materials
          </p>
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
          MCA Evaluation Ready · Project Code: GEO-INFRA-2026
        </div>
      </div>

      {/* Topic Switcher Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTopic('architecture')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTopic === 'architecture'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          System Architecture & GIS
        </button>
        <button
          onClick={() => setActiveTopic('cv_pipeline')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTopic === 'cv_pipeline'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          YOLO & ResNet ConvNet Pipeline
        </button>
        <button
          onClick={() => setActiveTopic('analytics_formula')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTopic === 'analytics_formula'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Progress Formulation & Math
        </button>
        <button
          onClick={() => setActiveTopic('viva_qa')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTopic === 'viva_qa'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Viva Oral Q&A Defense Cards
        </button>
      </div>

      {/* Content Sections */}
      {activeTopic === 'architecture' && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              1. Multi-Tier Full-Stack Architectural Topology
            </h2>
            <p>
              The system operates as an asynchronous, decoupled multi-tier architecture adhering to academic engineering separation of concerns:
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded font-mono text-[11px] text-slate-800 dark:text-slate-200 space-y-1">
              <div>[Browser Client: React 19 + TypeScript + Vite + Tailwind CSS]</div>
              <div className="pl-4">↓ HTTP REST / GeoJSON Layer</div>
              <div>[Application API Server: Node.js + Express + Repository Abstraction]</div>
              <div className="pl-4">↓ IPC / HTTP Proxy (Port 8000)</div>
              <div>[Machine Learning Engine: Python 3 + FastAPI + PyTorch + Ultralytics YOLO]</div>
              <div className="pl-4">↓ Storage</div>
              <div>[Normalized Relational Storage: SQLite / JSON with PostGIS migration schema]</div>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              2. Geospatial (GIS) Data Modeling
            </h2>
            <p>
              Geospatial queries conform to RFC 7946 GeoJSON FeatureCollection specifications. Each registered infrastructure entity contains coordinate pairs in standard WGS 84 (EPSG:4326) coordinate reference system:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong>Coordinates:</strong> [Longitude, Latitude] in strict accordance with standard GIS Cartesian order.</li>
              <li><strong>Spatial Indexing:</strong> Allows Euclidean distance boundary queries, bounding box spatial filtering, and district-level aggregations.</li>
              <li><strong>Map Tile Engine:</strong> Leaflet integration supporting OpenStreetMap and CartoDB dark matter GIS layers with client-side marker clustering.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTopic === 'cv_pipeline' && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Convolutional Vision Pipeline: Object Detection & Classification
            </h2>
            <p>
              The vision framework decomposes public infrastructure analysis into two complementary convolutional neural network (CNN) tasks:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Ultralytics YOLO (Object Detection)
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Single-stage anchor-free object detector with CSPDarknet backbone, Path Aggregation Network (PANet) neck, and decoupled detection heads. Accurately isolates heavy machinery (excavators, cranes, trucks), structural components (piers, bridge decks), and safety personnel.
                </p>
              </div>

              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  ResNet-50 (Stage Classification)
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Deep Residual Network with identity skip connections that mitigate the vanishing gradient problem. Operates via transfer learning with frozen ImageNet feature extractors and a fine-tuned 5-class linear classification head for public works phases.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTopic === 'analytics_formula' && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Mathematical Progress Estimation Formulation
            </h2>
            <p>
              Rather than making spurious claims that image classification alone determines exact construction percentages, the platform uses a formal weighted multi-factor analytical model:
            </p>
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-md space-y-1">
              <div>Progress Estimate E = (W_m × S_milestone) + (W_v × S_visual_stage) + (W_c × S_components) + (W_h × S_historical_velocity) + (W_e × S_equipment)</div>
              <div className="text-slate-400 text-[11px] pt-2"># Normalized Weight Constraint:</div>
              <div className="text-slate-300">W_m + W_v + W_c + W_h + W_e = 1.0 (Default: 0.35, 0.25, 0.15, 0.15, 0.10)</div>
              <div className="text-slate-400 text-[11px] pt-1"># Bounded Domain:</div>
              <div className="text-slate-300">0.0 &lt;= E &lt;= 100.0%</div>
            </div>
          </div>
        </div>
      )}

      {activeTopic === 'viva_qa' && (
        <div className="space-y-4">
          {[
            {
              q: 'Q1: What is the fundamental difference between Object Detection and Image Classification in this project?',
              a: 'Image classification (ResNet-50) predicts a single categorical visual stage for the overall scene (e.g. early_construction, mid_construction), whereas Object Detection (YOLO) identifies multiple discrete physical objects with spatial coordinates (bounding boxes [x, y, w, h]) and class confidences for machinery, workers, and structural components.',
            },
            {
              q: 'Q2: Why use a Residual Network (ResNet) instead of a standard vanilla CNN like AlexNet or VGG?',
              a: 'Standard deep CNNs suffer from degradation and vanishing gradients as depth increases. ResNet introduces skip/residual connections: F(x) + x, enabling gradients to backpropagate directly through the identity mappings, facilitating effective training of deep 50+ layer architectures.',
            },
            {
              q: 'Q3: How is Mean Average Precision (mAP@50) calculated for the YOLO detector?',
              a: 'For each class, detections are sorted by confidence. Intersection over Union (IoU) with ground truth bounding boxes determines true/false positives at a 0.50 IoU threshold. Precision-recall curves are computed, Average Precision (AP) is integrated as the area under the PR curve, and mAP is the mean AP across all classes.',
            },
            {
              q: 'Q4: How does the system handle AI model unavailability or offline states?',
              a: 'In accordance with strict academic integrity, if the Python ML service is offline, the interface explicitly reports "Computer Vision Service Offline" rather than fabricating fake predictions. A Demo Mode switch is provided for presentations, clearly watermarked with [DEMO_MOCK].',
            },
            {
              q: 'Q5: How does the analytical progress formula prevent single-point visual failure?',
              a: 'Visual classification is bounded to a 25% weight factor. Milestone progress (35%), detected structural parts (15%), historical elapsed days velocity (15%), and equipment activity (10%) are combined linearly with confidence intervals, preventing visual occlusion from causing drastic false shifts.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-start gap-2 font-bold text-slate-900 dark:text-slate-100">
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{item.q}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
