/**
 * Project Detail Dossier View
 * Geo Infrastructure Intelligence
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  Camera,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { InfrastructureProject, InspectionRecord, InspectionImage } from '../types.ts';

interface ProjectDetailViewProps {
  project: InfrastructureProject;
  onBack: () => void;
  onStartInspection: (projectId: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onStartInspection,
}) => {
  const [selectedImage, setSelectedImage] = useState<InspectionImage | null>(
    project.inspections?.[0]?.images?.[0] || null
  );
  const [geminiReport, setGeminiReport] = useState<any | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Generate historical progress chart data from inspections
  const progressHistory = (project.inspections || []).map((insp, idx) => ({
    date: insp.inspectionDate,
    observed: insp.estimatedProgressPercent,
    planned: insp.plannedProgressPercent,
    stage: insp.visualStage,
  }));

  // If inspections are few, ensure baseline start point exists
  if (progressHistory.length > 0 && progressHistory[0].date !== project.startDate) {
    progressHistory.unshift({
      date: project.startDate,
      observed: 0,
      planned: 0,
      stage: 'early_construction' as any,
    });
  }

  // Request Grounded Gemini Inspection Synthesis
  const handleGenerateGeminiReport = async () => {
    setIsGeneratingReport(true);
    try {
      const latestInsp = project.inspections?.[project.inspections.length - 1];
      const res = await fetch('/api/gemini/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          infrastructureType: project.infrastructureType,
          visualStage: latestInsp?.visualStage || 'mid_construction',
          conditionRating: project.conditionRating,
          estimatedProgress: project.currentProgressPercent,
          detectedObjects: latestInsp?.images?.[0]?.detectionResults?.detectedClassesCount || {
            excavator: 1,
            worker: 2,
            pier: 3,
          },
          notes: latestInsp?.notes || project.description,
        }),
      });
      const data = await res.json();
      setGeminiReport(data);
    } catch (err) {
      console.error('Failed to generate summary report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>{project.code}</span>
              <span className="text-slate-400 font-sans" aria-hidden="true">·</span>
              <span className="font-sans capitalize text-slate-500">{project.infrastructureType.replace('_', ' ')}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              {project.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartInspection(project.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Launch CV Inspection</span>
          </button>
        </div>
      </div>

      {/* Grid: Project Parameters & Location Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Core Attributes */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="text-xs font-medium text-slate-400">Execution Governance</div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500">Contractor:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{project.contractor}</div>
            </div>
            <div>
              <span className="text-slate-500">Supervising Agency:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{project.supervisingAgency}</div>
            </div>
            <div>
              <span className="text-slate-500">Condition Evaluation:</span>
              <div className="font-semibold capitalize text-emerald-600 dark:text-emerald-400 mt-0.5">
                {project.conditionRating}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Capital */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="text-xs font-medium text-slate-400">Financial Allocation</div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500">Sanctioned Budget:</span>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                {project.budget.currency} {(project.budget.allocated / 10000000).toFixed(2)} Cr
              </div>
            </div>
            <div>
              <span className="text-slate-500">Expended Capital:</span>
              <div className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {project.budget.currency} {(project.budget.spent / 10000000).toFixed(2)} Cr ({Math.round((project.budget.spent / project.budget.allocated) * 100)}%)
              </div>
            </div>
            <div>
              <span className="text-slate-500">Operational Status:</span>
              <div className="font-semibold capitalize text-slate-800 dark:text-slate-200 mt-0.5">
                {project.status.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Coordinates */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="text-xs font-medium text-slate-400">GIS Coordinates</div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500">Jurisdiction:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {project.location.district}, {project.location.state}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Spatial Benchmark:</span>
              <div className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                {project.location.latitude.toFixed(4)}°N, {project.location.longitude.toFixed(4)}°E
              </div>
            </div>
            <div>
              <span className="text-slate-500">Datum Elevation:</span>
              <div className="text-slate-700 dark:text-slate-300 mt-0.5">
                {project.location.elevationMeters || 45} meters MSL
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Schedule */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="text-xs font-medium text-slate-400">Schedule Milestones</div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500">Commencement Date:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{project.startDate}</div>
            </div>
            <div>
              <span className="text-slate-500">Scheduled Target:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{project.targetCompletionDate}</div>
            </div>
            <div>
              <span className="text-slate-500">Projected Clearance:</span>
              <div className="font-semibold text-amber-600 dark:text-amber-400 mt-0.5">{project.estimatedEndDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Telemetry: Planned vs Observed History Curve */}
      <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Longitudinal Progress Milestone Curve
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empirical convolutional inspection estimates vs baseline engineering schedule
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-slate-400 dark:bg-slate-500" />
              <span className="text-slate-600 dark:text-slate-400">Contractual Schedule</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">CV Estimated Progress</span>
            </div>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressHistory} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#f8fafc',
                }}
              />
              <Line
                type="monotone"
                dataKey="planned"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="observed"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Grounded Summary Generation Section */}
      <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Automated Multimodal Inspection Synthesis
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Grounded generative audit report synthesizing visual detections, schedule delta, and civil risk factors
            </p>
          </div>
          <button
            onClick={handleGenerateGeminiReport}
            disabled={isGeneratingReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingReport ? 'Synthesizing...' : 'Generate AI Audit Report'}</span>
          </button>
        </div>

        {geminiReport && (
          <div className="p-4 rounded-md bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3 text-xs">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Executive Audit Synthesis:
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{geminiReport.summary}</p>
            </div>

            {geminiReport.keyObservations && (
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Key Field Observations:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  {geminiReport.keyObservations.map((obs: string, i: number) => (
                    <li key={i}>{obs}</li>
                  ))}
                </ul>
              </div>
            )}

            {geminiReport.recommendedActions && (
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Recommended Engineering Verifications:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  {geminiReport.recommendedActions.map((act: string, i: number) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-purple-200/40 dark:border-purple-900/40">
              Source: {geminiReport.source} · Grounded Fact Engine
            </div>
          </div>
        )}
      </div>

      {/* Field Inspection History & Photographic Overlays */}
      <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Field Survey Records & Computer Vision Detections
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chronological log of verified site observations and annotated bounding box coordinates
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {project.inspections?.length || 0} Surveys Logged
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inspection Log List */}
          <div className="space-y-3">
            {(project.inspections || []).map((insp) => (
              <div
                key={insp.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    Survey #{insp.id.split('-').pop()} · {insp.inspectionDate}
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {insp.estimatedProgressPercent}% Est.
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-normal">{insp.notes}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span>Inspector: {insp.inspectorName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{insp.visualStage.replace('_', ' ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{insp.provenance}</span>
                </div>

                {/* Thumbnail strip */}
                {insp.images && insp.images.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    {insp.images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className={`relative rounded overflow-hidden border-2 transition-all ${
                          selectedImage?.id === img.id
                            ? 'border-emerald-500 scale-105'
                            : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.caption} className="w-16 h-12 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Photographic Visualizer with Bounding Boxes */}
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex flex-col justify-between">
            {selectedImage ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold">{selectedImage.caption}</span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    {selectedImage.detectionResults?.modelName || 'YOLOv11-Infra'}
                  </span>
                </div>

                {/* Image Container with SVG Bounding Box Overlays */}
                <div className="relative rounded overflow-hidden bg-black flex items-center justify-center max-h-[320px]">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.caption}
                    className="w-full h-auto object-contain block"
                  />
                  {/* Bounding Box Overlay SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {selectedImage.detectionResults?.boxes?.map((box) => (
                      <g key={box.id}>
                        <rect
                          x={`${box.x * 100}%`}
                          y={`${box.y * 100}%`}
                          width={`${box.width * 100}%`}
                          height={`${box.height * 100}%`}
                          fill="none"
                          stroke={box.category === 'equipment' ? '#3b82f6' : '#10b981'}
                          strokeWidth="2"
                        />
                        <text
                          x={`${box.x * 100 + 1}%`}
                          y={`${box.y * 100 + 12}%`}
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                          className="bg-black"
                        >
                          {box.label} ({Math.round(box.confidence * 100)}%)
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Detection Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400">Detected Components:</span>
                    <div className="text-slate-200 mt-0.5">
                      {selectedImage.detectionResults?.boxes
                        ? `${selectedImage.detectionResults.boxes.length} structural objects`
                        : 'No objects isolated'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Provenance:</span>
                    <div className="font-mono text-indigo-400 mt-0.5">
                      {selectedImage.detectionResults?.provenance || 'DEMO_MOCK'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-xs">
                <Camera className="w-8 h-8 mb-2 opacity-50" />
                <span>Select an inspection record to examine computer vision overlays</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
