/**
 * New Project Registration Modal
 * Geo Infrastructure Intelligence
 */

import React, { useState } from 'react';
import { X, Building2, MapPin, DollarSign, Calendar, Plus } from 'lucide-react';
import { InfrastructureType } from '../types.ts';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [infrastructureType, setInfrastructureType] = useState<InfrastructureType>('highway_road');
  const [description, setDescription] = useState('');
  const [contractor, setContractor] = useState('');
  const [supervisingAgency, setSupervisingAgency] = useState('National Highways Authority');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [latitude, setLatitude] = useState('18.5204');
  const [longitude, setLongitude] = useState('73.8567');
  const [allocatedBudget, setAllocatedBudget] = useState('450000000');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [targetDate, setTargetDate] = useState('2027-03-31');
  const [plannedProgress, setPlannedProgress] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          code,
          infrastructureType,
          description,
          contractor,
          supervisingAgency,
          startDate,
          targetCompletionDate: targetDate,
          plannedProgressPercent: parseFloat(plannedProgress),
          currentProgressPercent: 0,
          location: {
            name: `${district} Sector`,
            district,
            state,
            country: 'India',
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
          budget: {
            allocated: parseFloat(allocatedBudget),
            spent: 0,
            currency: 'INR',
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to register project');
      }

      onProjectCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Register New Infrastructure Project
            </h2>
            <p className="text-[11px] text-slate-500">
              Enroll public works asset for GIS tracking and computer vision monitoring
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
          {error && (
            <div className="p-2.5 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded border border-rose-200 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Project Code Identifier *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. INFRA-EXPR-09"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Infrastructure Asset Class *
              </label>
              <select
                value={infrastructureType}
                onChange={(e) => setInfrastructureType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs cursor-pointer"
              >
                <option value="highway_road">Highway & Road</option>
                <option value="bridge_flyover">Bridge & Flyover</option>
                <option value="metro_rail">Metro Rail</option>
                <option value="water_drainage">Water & Drainage</option>
                <option value="urban_building">Urban Terminal</option>
                <option value="energy_grid">Energy Grid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              Project Name / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pune Outer Ring Road Phase-I"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              Scope of Work / Description
            </label>
            <textarea
              rows={2}
              placeholder="Detailed engineering scope of civil works..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Prime Contractor
              </label>
              <input
                type="text"
                placeholder="e.g. Larsen & Toubro"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Supervising Bureau / Authority
              </label>
              <input
                type="text"
                value={supervisingAgency}
                onChange={(e) => setSupervisingAgency(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* GIS Location */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              GIS Coordinates (WGS 84)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Latitude (°N)</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Longitude (°E)</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Budget (INR)
              </label>
              <input
                type="number"
                value={allocatedBudget}
                onChange={(e) => setAllocatedBudget(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
