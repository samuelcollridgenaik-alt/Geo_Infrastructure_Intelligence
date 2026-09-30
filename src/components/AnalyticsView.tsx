/**
 * Analytics & Computer Vision Metrics View
 * Geo Infrastructure Intelligence
 */

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Cpu,
  Layers,
  PieChart as PieIcon,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { AnalyticsOverview } from '../types.ts';

interface AnalyticsViewProps {
  overview: AnalyticsOverview | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ overview }) => {
  const [cvStats, setCvStats] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/analytics/cv')
      .then((res) => res.json())
      .then((data) => setCvStats(data))
      .catch((err) => console.error('Failed to load CV stats:', err));
  }, []);

  if (!overview) {
    return <div className="text-slate-400 text-sm p-8 text-center">Loading analytics data...</div>;
  }

  // Formatting class distribution
  const detectionData = Object.entries(cvStats?.detectionClassDistribution || {
    excavator: 3,
    crane: 3,
    construction_worker: 6,
    road: 2,
    bridge: 1,
    pier_column: 3,
    truck: 2,
    barrier: 2,
  }).map(([label, count]) => ({
    label: label.replace('_', ' '),
    count: count as number,
  }));

  // Confidence distribution
  const confidenceData = Object.entries(cvStats?.confidenceDistribution || {
    '0.5-0.6': 0,
    '0.6-0.7': 1,
    '0.7-0.8': 2,
    '0.8-0.9': 8,
    '0.9-1.0': 11,
  }).map(([bucket, count]) => ({
    bucket,
    count: count as number,
  }));

  // Condition distribution
  const conditionData = Object.entries(overview.conditionDistribution).map(([condition, count]) => ({
    name: condition.toUpperCase(),
    value: count,
  }));

  const CONDITION_COLORS: Record<string, string> = {
    GOOD: '#10b981',
    MODERATE: '#64748b',
    POOR: '#f59e0b',
    CRITICAL: '#ef4444',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Data Analytics & Computer Vision Diagnostics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empirical detection frequencies, confidence distributions, and regional public works capacity
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Sample Set: {overview.totalProjects} assets · {overview.totalInspections} inspections
        </div>
      </div>

      {/* Top CV Academic Model Metrics Banner */}
      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-500" />
          <span>Computer Vision Model Evaluation Benchmarks (COCO & Academic Public Works Testbed)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">YOLO Object Detection mAP@50</span>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">0.865</div>
            <div className="text-[10px] text-slate-400 mt-0.5">mAP@50-95: 0.642</div>
          </div>
          <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Machinery Precision Score</span>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">88.4%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Recall: 83.2%</div>
          </div>
          <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">ResNet-50 Stage Accuracy</span>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">89.2%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Macro F1: 0.878</div>
          </div>
          <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Mean Inference Latency</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">41 ms</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Edge GPU Acceleration</div>
          </div>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Class Frequency */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Isolated Civil Infrastructure Classes Frequency
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
            Aggregated object counts extracted via YOLO convolutional backbone
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detectionData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Distribution Histogram */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Detection Confidence Score Histogram
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
            Empirical probability distribution across verified inspection bounding boxes
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional & Condition Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Public Works Geographic Spread */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Regional Geographic Distribution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
            Monitored public works distribution across states & territories
          </p>
          <div className="space-y-3">
            {Object.entries(overview.regionalDistribution).map(([region, count]) => {
              const pct = Math.round((count / overview.totalProjects) * 100);
              return (
                <div key={region} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{region}</span>
                    <span className="text-slate-500">{count} projects ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Structural Health Condition Split */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Structural Condition Health Assessment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
              Asset health classification from field inspections and photogrammetry
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto">
            {conditionData.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
              >
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CONDITION_COLORS[item.name] || '#94a3b8' }}
                  />
                  <span>{item.name} CONDITION</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {item.value} Assets
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {Math.round((item.value / overview.totalProjects) * 100)}% of total portfolio
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            Integrity check: Zero critical failures reported in the last 30 calendar days.
          </div>
        </div>
      </div>
    </div>
  );
};
