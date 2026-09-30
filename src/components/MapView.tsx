/**
 * Interactive GIS Infrastructure Map Component
 * Geo Infrastructure Intelligence
 *
 * Utilizes Leaflet with OpenStreetMap & CartoDB tile layers,
 * custom SVG markers color-coded by condition and progress,
 * filtering, popups, and detail inspector drawer.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Layers,
  Filter,
  Eye,
  Maximize2,
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { InfrastructureProject, InfrastructureType, ProjectStatus } from '../types.ts';

interface MapViewProps {
  projects: InfrastructureProject[];
  onSelectProject: (projectId: string) => void;
  isDark: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ projects, onSelectProject, isDark }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<InfrastructureProject | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<'streets' | 'carto_dark' | 'topo'>('streets');

  // Filter projects based on current selections
  const filteredProjects = projects.filter((p) => {
    if (selectedType !== 'all' && p.infrastructureType !== selectedType) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');

      if (isCancelled || !mapContainerRef.current) return;

      // Center around India geospatial center or mean of coordinates
      const defaultCenter: [number, number] = [20.5937, 78.9629];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 5,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Base tile layers
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when Dark mode or active layer changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (activeTileLayer === 'carto_dark' || (activeTileLayer === 'streets' && isDark)) {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (activeTileLayer === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }

    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof (window as any).L?.TileLayer || layer._url) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    import('leaflet').then((L) => {
      L.tileLayer(tileUrl, {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);
    });
  }, [isDark, activeTileLayer]);

  // Update Markers when filteredProjects changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import('leaflet').then((L) => {
      markersLayerRef.current.clearLayers();

      const bounds = L.latLngBounds([]);

      filteredProjects.forEach((proj) => {
        const { latitude, longitude } = proj.location;
        if (!latitude || !longitude) return;

        bounds.extend([latitude, longitude]);

        // Marker color based on condition / status
        let pinColor = '#10b981'; // green for good
        if (proj.status === 'delayed' || proj.conditionRating === 'poor') pinColor = '#f59e0b';
        if (proj.conditionRating === 'critical') pinColor = '#ef4444';
        if (proj.status === 'completed') pinColor = '#3b82f6';

        const customIcon = L.divIcon({
          className: 'custom-geo-marker',
          html: `
            <div style="
              background: ${pinColor};
              width: 26px;
              height: 26px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              ${Math.round(proj.currentProgressPercent)}%
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([latitude, longitude], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-slate-800 text-xs font-sans';
        popupContent.innerHTML = `
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${proj.name}</div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">${proj.code} · ${proj.location.district}</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Estimated Progress:</span>
            <span style="font-weight: bold; color: ${pinColor};">${proj.currentProgressPercent}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Status:</span>
            <span style="text-transform: capitalize; font-weight: 500;">${proj.status}</span>
          </div>
          <button id="btn-inspect-${proj.id}" style="
            width: 100%;
            background: #0f172a;
            color: #ffffff;
            border: none;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            Open Project Details →
          </button>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          setSelectedProject(proj);
          const btn = document.getElementById(`btn-inspect-${proj.id}`);
          if (btn) {
            btn.onclick = () => onSelectProject(proj.id);
          }
        });

        marker.on('click', () => {
          setSelectedProject(proj);
        });

        markersLayerRef.current.addLayer(marker);
      });

      if (filteredProjects.length > 0 && bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    });
  }, [filteredProjects, onSelectProject]);

  return (
    <div className="relative h-[calc(100vh-140px)] min-h-[550px] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
      {/* Top Map Toolbar: Filters & Layers */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Filter Bar */}
        <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md pointer-events-auto text-xs">
          <div className="flex items-center gap-1.5 px-2 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded px-2 py-1 text-xs border-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded px-2 py-1 text-xs border-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="delayed">Delayed</option>
            <option value="completed">Completed</option>
            <option value="planned">Planned</option>
          </select>
        </div>

        {/* Right Layer Switcher */}
        <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md pointer-events-auto text-xs">
          <button
            onClick={() => setActiveTileLayer('streets')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTileLayer === 'streets'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Standard GIS
          </button>
          <button
            onClick={() => setActiveTileLayer('carto_dark')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTileLayer === 'carto_dark'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Dark Carto
          </button>
          <button
            onClick={() => setActiveTileLayer('topo')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTileLayer === 'topo'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Topographic
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Viewport */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Bottom Floating Inspector Drawer if a project is selected */}
      {selectedProject && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-96 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl transition-all">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {selectedProject.code}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">
                {selectedProject.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold px-1"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">
              {selectedProject.location.district}, {selectedProject.location.state}
            </span>
            <span aria-hidden="true">·</span>
            <span>{selectedProject.location.latitude.toFixed(4)}°N, {selectedProject.location.longitude.toFixed(4)}°E</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">Estimated Progress</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {selectedProject.currentProgressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${selectedProject.currentProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Contractor: <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{selectedProject.contractor}</span>
            </div>
            <button
              onClick={() => onSelectProject(selectedProject.id)}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors"
            >
              <span>View Dossier</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
