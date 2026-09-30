/**
 * Projects Directory Component
 * Geo Infrastructure Intelligence
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { InfrastructureProject, InfrastructureType, ProjectStatus, ConditionRating } from '../types.ts';

interface ProjectsViewProps {
  projects: InfrastructureProject[];
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenNewProjectModal,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search
  const filtered = projects.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.contractor.toLowerCase().includes(q) ||
        p.location.district.toLowerCase().includes(q) ||
        p.location.state.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (typeFilter !== 'all' && p.infrastructureType !== typeFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (conditionFilter !== 'all' && p.conditionRating !== conditionFilter) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    let diff = 0;
    if (sortBy === 'name') diff = a.name.localeCompare(b.name);
    else if (sortBy === 'progress') diff = a.currentProgressPercent - b.currentProgressPercent;
    else diff = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    return sortOrder === 'desc' ? -diff : diff;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: 'name' | 'progress' | 'updatedAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const typeLabels: Record<string, string> = {
    highway_road: 'Highway / Road',
    bridge_flyover: 'Bridge / Flyover',
    metro_rail: 'Metro Rail',
    water_drainage: 'Stormwater / Drainage',
    urban_building: 'Urban Terminal',
    energy_grid: 'Energy Grid',
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Public Works Infrastructure Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered public civil engineering assets with geo-spatial coordinates and automated visual milestones
          </p>
        </div>
        <button
          onClick={onOpenNewProjectModal}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Project</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, name, contractor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="all">All Infrastructure Types</option>
          <option value="highway_road">Highway & Road</option>
          <option value="bridge_flyover">Bridge & Flyover</option>
          <option value="metro_rail">Metro Rail</option>
          <option value="water_drainage">Water & Drainage</option>
          <option value="urban_building">Urban Terminal</option>
          <option value="energy_grid">Energy Grid</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="all">All Operational Statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="delayed">Delayed</option>
          <option value="completed">Completed</option>
          <option value="planned">Planned</option>
        </select>

        <select
          value={conditionFilter}
          onChange={(e) => {
            setConditionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="all">All Structural Conditions</option>
          <option value="good">Good Condition</option>
          <option value="moderate">Moderate Condition</option>
          <option value="poor">Poor Condition</option>
          <option value="critical">Critical Condition</option>
        </select>
      </div>

      {/* Projects Table */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-medium">
                <th className="py-2.5 px-3.5">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                  >
                    <span>Project Identifier & Title</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3">Asset Class</th>
                <th className="py-2.5 px-3">Location (GIS)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">
                  <button
                    onClick={() => toggleSort('progress')}
                    className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                  >
                    <span>Estimated Progress</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Last Survey</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No infrastructure projects matched the active search filters.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => {
                  const variance = Math.round((p.plannedProgressPercent - p.currentProgressPercent) * 10) / 10;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProject(p.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span>{p.code}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-sans text-slate-500">{p.contractor}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {typeLabels[p.infrastructureType] || p.infrastructureType}
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-800 dark:text-slate-200">
                          {p.location.district}, {p.location.state}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {p.location.latitude.toFixed(3)}°N, {p.location.longitude.toFixed(3)}°E
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`capitalize font-medium ${
                            p.status === 'completed'
                              ? 'text-blue-600 dark:text-blue-400'
                              : p.status === 'delayed'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {p.currentProgressPercent}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (Plan: {p.plannedProgressPercent}%)
                          </span>
                        </div>
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              variance > 10 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${p.currentProgressPercent}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`capitalize font-medium ${
                            p.conditionRating === 'good'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : p.conditionRating === 'moderate'
                              ? 'text-slate-600 dark:text-slate-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {p.conditionRating}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {p.lastInspectionDate || p.createdAt.slice(0, 10)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(p.id);
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs text-slate-500">
          <div>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} projects
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
