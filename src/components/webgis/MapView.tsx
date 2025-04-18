import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getBaseMaps, createLegendControl } from './utils/leaflet-config';
import MapHeader from './MapHeader';
import MapControls from './MapControls';
import MapLayers from './MapLayers';
import { LayerType } from './data/mock-map-data';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';

interface MapViewProps {
  activeLayers: LayerType[];
  fullscreenMode: boolean;
  splitViewEnabled: boolean;
}

const MapView = ({ activeLayers, fullscreenMode, splitViewEnabled }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerGroupRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const { toast } = useToast();

  const [mapStatus, setMapStatus] = useState({
    activePoints: 0,
    lastUpdate: new Date().toLocaleTimeString(),
    zoomLevel: 14,
  });

  const handlePointsChange = useCallback((count: number) => {
    setMapStatus(prev => ({
      ...prev,
      activePoints: count,
      lastUpdate: new Date().toLocaleTimeString()
    }));
  }, []);

  const handleZoomChange = useCallback(() => {
    if (mapRef.current) {
      setMapStatus(prev => ({
        ...prev,
        zoomLevel: mapRef.current!.getZoom()
      }));
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([-3.3194, 114.5921], 14);
      
      // Add base tile layers
      const baseMaps = getBaseMaps();
      baseMaps["Street"].addTo(mapRef.current);
      
      // Add layer control
      L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(mapRef.current);
      
      // Add zoom control in a specific position
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      
      // Add scale control
      L.control.scale({ position: 'bottomleft', imperial: false }).addTo(mapRef.current);

      // Add attribution control
      L.control.attribution({ position: 'bottomleft' }).addTo(mapRef.current);
      
      // Add custom legend control
      const legend = createLegendControl();
      legend.addTo(mapRef.current);

      // Add layer group
      layerGroupRef.current.addTo(mapRef.current);

      // Event listener for zoom changes
      mapRef.current.on('zoomend', handleZoomChange);
    }

    // Adjust map when fullscreen or split view changes
    const map = mapRef.current;
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off('zoomend', handleZoomChange);
      }
    };
  }, [fullscreenMode, splitViewEnabled, handleZoomChange]);

  const resetMapView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView([-3.3194, 114.5921], 14);
    }
  }, []);

  const takeScreenshot = useCallback(() => {
    if (mapRef.current) {
      // Implementation for taking screenshot
      toast({
        title: "Screenshot",
        description: "Fitur screenshot belum diimplementasikan.",
      });
    }
  }, [toast]);

  return (
    <div className={`relative ${fullscreenMode ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} ${splitViewEnabled ? 'w-1/2' : 'w-full'} border border-border rounded-lg bg-muted/10 shadow-md overflow-hidden`}>
      {/* Header Component */}
      <MapHeader
        activePoints={mapStatus.activePoints}
        lastUpdate={mapStatus.lastUpdate}
        onRefresh={() => {}}
      />
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Controls Component */}
      <MapControls
        zoomLevel={mapStatus.zoomLevel}
        onResetView={resetMapView}
        onScreenshot={takeScreenshot}
      />
      
      {/* Layers Component (non-visual) */}
      <MapLayers
        map={mapRef.current}
        layerGroup={layerGroupRef.current}
        activeLayers={activeLayers}
        onPointsChange={handlePointsChange}
      />
    </div>
  );
};

export default MapView;
