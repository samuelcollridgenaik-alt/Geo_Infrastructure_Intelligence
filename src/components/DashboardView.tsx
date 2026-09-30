/**
 * Dashboard View
 * Geo Infrastructure Intelligence
 */

import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ArrowRight,
  ShieldAlert,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { AnalyticsOverview, InfrastructureProject } from '../types.ts';

interface DashboardViewProps {
  overview: AnalyticsOverview | null;
  projects: InfrastructureProject[];
  onSelectProject: (projectId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overview,
  projects,
  onSelectProject,
  onNavigateTab,
}) => {
  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 text-sm">Loading infrastructure analytics...</div>
      </div>
    );
  }

  // Sample trend data for analytical visualization
  const trendData = [
    { month: 'Apr 25', planned: 28, observed: 25 },
    { month: 'Jun 25', planned: 38, observed: 34 },
    { month: 'Aug 25', planned: 47, observed: 44 },
    { month: 'Oct 25', planned: 55, observed: 51 },
    { month: 'Dec 25', planned: 63, observed: 58 },
    { month: 'Feb 26', planned: 71, observed: 67 },
    { month: 'Apr 26', planned: 78, observed: 71 },
    { month: 'Jun 26', planned: 84, observed: 75 },
    { month: 'Sep 26', planned: 89, observed: 78 },
  ];

  const typeLabels: Record<string, string> = {
    highway_road: 'Highway & Roads',
    bridge_flyover: 'Bridges & Flyovers',
    metro_rail: 'Metro & Rail',
    water_drainage: 'Stormwater & Drainage',
    urban_building: 'Transit Terminals',
    energy_grid: 'Substations & Grids',
  };

  const typeData = Object.entries(overview.infrastructureTypeDistribution).map(([key, count]) => ({
    type: typeLabels[key] || key,
    count,
  }));

  const TYPE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'];

  // Identify delayed or critical projects
  const attentionProjects = projects.filter(
    (p) => p.status === 'delayed' || p.conditionRating === 'poor' || p.conditionRating === 'critical'
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Infrastructure Monitoring Executive Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, convolutional stage assessment, and GIS coordinates across active public works
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Telemetry Cycle: Active</span>
          <span aria-hidden="true">·</span>
          <span>Sample Frequency: Bi-weekly</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Registered</span>
            <FolderKanban className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{overview.totalProjects}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Active public works assets
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Active In-Progress</span>
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{overview.activeProjects}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Ongoing field operations
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Completed Assets</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{overview.completedProjects}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Commissioned to public
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Delayed Projects</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{overview.delayedProjects}</div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
            Variance &gt; 15% planned
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Mean Progress</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {overview.averageProgress}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Planned avg: {overview.averagePlannedProgress}%
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Inspections (Month)</span>
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {overview.inspectionsThisMonth}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Total logged: {overview.totalInspections}
          </div>
        </div>
      </div>

      {/* Analytical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Longitudinal Progress Trend */}
        <div className="lg:col-span-2 p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Longitudinal Progress Trajectory (Planned vs Observed)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Aggregate multi-project velocity curves across consecutive inspection milestones
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 dark:bg-slate-600" />
                <span className="text-slate-600 dark:text-slate-400">Planned Schedule</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">Observed (CV Estimated)</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorObserved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#f8fafc',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  fill="none"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="observed"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorObserved)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Infrastructure Type Distribution */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Infrastructure Asset Class Distribution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Portfolio split by civil engineering taxonomy
            </p>
          </div>
          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 10, left: 35, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {typeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between">
            <span>Critical Assets Requiring Attention</span>
            <span className="font-semibold text-amber-600">{overview.criticalConditionCount} assets</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Attention Needed vs Recent Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Requiring Attention */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Projects Requiring Attention & Audit
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {attentionProjects.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No delayed or critical infrastructure projects recorded. All timelines operational.
              </div>
            ) : (
              attentionProjects.map((p) => {
                const variance = Math.round((p.plannedProgressPercent - p.currentProgressPercent) * 10) / 10;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="p-3 rounded-md border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <span>{p.code}</span>
                          <span aria-hidden="true">·</span>
                          <span>{p.location.district}, {p.location.state}</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{p.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          {variance > 0 ? `-${variance}% Behind` : 'Critical Condition'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Obs: {p.currentProgressPercent}% / Plan: {p.plannedProgressPercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Field Inspections */}
        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Latest Public Works Site Observations
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('inspection')}
              className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium"
            >
              <span>New Inspection</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((p) => {
              const latestInsp = p.inspections?.[p.inspections.length - 1];
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="p-3 rounded-md border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {p.currentProgressPercent}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                    {latestInsp?.notes || 'Routine structural condition survey registered.'}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                    <span>Survey Date: {latestInsp?.inspectionDate || p.updatedAt.slice(0, 10)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Inspector: {latestInsp?.inspectorName || 'District QA Engineer'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {latestInsp?.provenance || 'CALCULATED_ANALYTIC'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
