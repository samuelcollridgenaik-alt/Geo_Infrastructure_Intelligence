/**
 * Header Component
 * Geo Infrastructure Intelligence
 */

import React from 'react';
import {
  Layers,
  MapPin,
  BarChart3,
  Cpu,
  BookOpen,
  FolderKanban,
  Search,
  Sparkles,
  Sun,
  Moon,
  Activity,
  AlertCircle,
  Database,
} from 'lucide-react';
import { MlServiceHealth } from '../types.ts';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  mlHealth: MlServiceHealth;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenQueryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  mlHealth,
  demoMode,
  onToggleDemoMode,
  isDark,
  onToggleTheme,
  onOpenQueryModal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'map', label: 'GIS Map', icon: MapPin },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'inspection', label: 'AI Inspection', icon: Cpu },
    { id: 'analytics', label: 'CV Analytics', icon: Layers },
    { id: 'models', label: 'Model Registry', icon: Database },
    { id: 'docs', label: 'Viva & Docs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      {/* Top Banner: Academic Title & Live Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
            GEO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                GEO INFRASTRUCTURE INTELLIGENCE
              </span>
              <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Academic Research Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">
              Geo-Spatial Visualization & Convolutional Vision Framework for Automated Infrastructure Monitoring
            </p>
          </div>
        </div>

        {/* Right Utility Bar: Status Indicators & Quick Controls */}
        <div className="flex items-center gap-3">
          {/* ML Service Live Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
              mlHealth.status === 'online'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            }`}
            title={mlHealth.message}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mlHealth.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>
              {mlHealth.status === 'online' ? 'Python ML Online' : 'ML Service Standby'}
            </span>
          </div>

          {/* Demo Mode Toggle */}
          <button
            onClick={onToggleDemoMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              demoMode
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle between strict Live ML service requirement and Academic Demo simulation mode"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{demoMode ? 'Demo Mode: ON' : 'Demo Mode: OFF'}</span>
          </button>

          {/* Natural Language Analytics Search */}
          <button
            onClick={onOpenQueryModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Query</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 py-1.5 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
