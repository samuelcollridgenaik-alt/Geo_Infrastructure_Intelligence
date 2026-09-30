/**
 * Geo Infrastructure Intelligence - Main Application
 * Academic Research Prototype
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { MapView } from './components/MapView.tsx';
import { ProjectsView } from './components/ProjectsView.tsx';
import { ProjectDetailView } from './components/ProjectDetailView.tsx';
import { AiInspectionView } from './components/AiInspectionView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { ModelRegistryView } from './components/ModelRegistryView.tsx';
import { AcademicDocsView } from './components/AcademicDocsView.tsx';
import { NewProjectModal } from './components/NewProjectModal.tsx';
import { NaturalLanguageQueryModal } from './components/NaturalLanguageQueryModal.tsx';
import { InfrastructureProject, AnalyticsOverview, MlServiceHealth } from './types.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<InfrastructureProject[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ML Service Health status & Demo Mode switch
  const [mlHealth, setMlHealth] = useState<MlServiceHealth>({
    status: 'offline',
    url: 'http://localhost:8000',
    yoloModelReady: false,
    resnetModelReady: false,
    device: 'cpu',
    message: 'Checking ML service...',
  });
  const [demoMode, setDemoMode] = useState<boolean>(true); // Default ON for reliable academic prototype presentation
  const [isDark, setIsDark] = useState<boolean>(false);

  // Modals
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState<boolean>(false);

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [projRes, overRes, mlRes] = await Promise.all([
        fetch('/api/projects?limit=100'),
        fetch('/api/analytics/overview'),
        fetch('/api/health/ml'),
      ]);

      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }

      if (overRes.ok) {
        const overData = await overRes.json();
        setOverview(overData);
      }

      if (mlRes.ok) {
        const mlData = await mlRes.json();
        setMlHealth({
          status: mlData.status === 'online' ? 'online' : 'offline',
          url: mlData.url || 'http://localhost:8000',
          yoloModelReady: mlData.details?.yolo_model_ready || false,
          resnetModelReady: mlData.details?.resnet_model_ready || false,
          device: mlData.details?.device || 'cpu',
          message: mlData.message,
        });
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll ML service health periodically
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/health/ml');
        if (res.ok) {
          const mlData = await res.json();
          setMlHealth((prev) => ({
            ...prev,
            status: mlData.status === 'online' ? 'online' : 'offline',
            message: mlData.message,
          }));
        }
      } catch {
        // keep current state
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentTab('project_detail');
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'project_detail') {
            setSelectedProjectId(null);
          }
        }}
        mlHealth={mlHealth}
        demoMode={demoMode}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenQueryModal={() => setIsQueryModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 text-xs space-y-2">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to Geo Infrastructure Intelligence Platform...</span>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                overview={overview}
                projects={projects}
                onSelectProject={handleSelectProject}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'map' && (
              <MapView
                projects={projects}
                onSelectProject={handleSelectProject}
                isDark={isDark}
              />
            )}

            {currentTab === 'projects' && (
              <ProjectsView
                projects={projects}
                onSelectProject={handleSelectProject}
                onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
              />
            )}

            {currentTab === 'project_detail' && selectedProject && (
              <ProjectDetailView
                project={selectedProject}
                onBack={() => setCurrentTab('projects')}
                onStartInspection={(pId) => {
                  setSelectedProjectId(pId);
                  setCurrentTab('inspection');
                }}
              />
            )}

            {currentTab === 'inspection' && (
              <AiInspectionView
                projects={projects}
                selectedProjectId={selectedProjectId || undefined}
                mlHealth={mlHealth}
                demoMode={demoMode}
                onToggleDemoMode={() => setDemoMode(!demoMode)}
                onInspectionSaved={() => {
                  fetchData();
                }}
              />
            )}

            {currentTab === 'analytics' && <AnalyticsView overview={overview} />}

            {currentTab === 'models' && <ModelRegistryView />}

            {currentTab === 'docs' && <AcademicDocsView />}
          </>
        )}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreated={() => fetchData()}
      />

      {/* Natural Language Query Modal */}
      <NaturalLanguageQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        onSelectProject={handleSelectProject}
      />

      {/* Footer: Academic Project Information */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              GEO INFRASTRUCTURE INTELLIGENCE
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Master of Computer Applications (MCA) Academic Research Prototype</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>ConvNet: Ultralytics YOLO & ResNet-50</span>
            <span aria-hidden="true">·</span>
            <span>GIS Engine: WGS 84 / Leaflet</span>
            <span aria-hidden="true">·</span>
            <span>Grounding: Gemini-3.8-Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
