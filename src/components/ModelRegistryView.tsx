/**
 * Model Registry Component
 * Geo Infrastructure Intelligence
 *
 * MLOps model catalog adhering to strict academic integrity standards.
 */

import React, { useEffect, useState } from 'react';
import {
  Database,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ModelRegistryEntry } from '../types.ts';

export const ModelRegistryView: React.FC = () => {
  const [models, setModels] = useState<ModelRegistryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load models:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Academic Machine Learning Model Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered convolutional backbones, transfer learning weights, and evaluation metrics
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          MLOps Registry v1.0 · PyTorch & Ultralytics
        </div>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400 text-sm">
            Querying model repository metadata...
          </div>
        ) : (
          models.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Status & Framework Header */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-slate-400">{m.framework}</span>
                  <span
                    className={`font-semibold capitalize ${
                      m.status === 'pretrained'
                        ? 'text-blue-600 dark:text-blue-400'
                        : m.status === 'custom_trained'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {m.name}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Version: <span className="font-mono">{m.version}</span> · Task:{' '}
                  <span className="capitalize">{m.task.replace('_', ' ')}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  {m.notes}
                </p>

                {/* Backbone Architecture */}
                <div className="mt-3 p-2.5 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="text-slate-500">Backbone Architecture:</div>
                  <div className="font-mono text-slate-800 dark:text-slate-200">{m.backboneArchitecture}</div>
                </div>

                {/* Target Classes List */}
                <div className="mt-3">
                  <span className="text-[11px] text-slate-400">Class Taxonomy ({m.classes.length}):</span>
                  <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                    {m.classes.slice(0, 8).map((cls) => (
                      <span key={cls} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {cls}
                      </span>
                    ))}
                    {m.classes.length > 8 && (
                      <span className="text-slate-400">+{m.classes.length - 8} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Evaluation Metrics */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400 text-[11px] font-medium">Evaluation Performance Metrics:</div>
                {m.status === 'evaluation_pending' && !m.isRealModelAvailable ? (
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Model not trained yet on local dataset</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {m.metrics.accuracy !== undefined && (
                      <div>
                        <span className="text-slate-400">Accuracy:</span>{' '}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {Math.round(m.metrics.accuracy * 100)}%
                        </span>
                      </div>
                    )}
                    {m.metrics.precision !== undefined && (
                      <div>
                        <span className="text-slate-400">Precision:</span>{' '}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {Math.round(m.metrics.precision * 100)}%
                        </span>
                      </div>
                    )}
                    {m.metrics.mAP50 !== undefined && (
                      <div>
                        <span className="text-slate-400">mAP@50:</span>{' '}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {m.metrics.mAP50}
                        </span>
                      </div>
                    )}
                    {m.metrics.mAP50_95 !== undefined && (
                      <div>
                        <span className="text-slate-400">mAP@50-95:</span>{' '}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {m.metrics.mAP50_95}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Updated: {m.lastUpdated}</span>
                  <span>{m.trainingDatasetSize ? `${m.trainingDatasetSize} samples` : 'Foundation'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
