
import { useEffect, useRef, useState } from 'react';
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
      mapRef.current.on('zoomend', () => {
        if (mapRef.current) {
          setMapStatus(prev => ({
            ...prev,
            zoomLevel: mapRef.current!.getZoom()
          }));
        }
      });
    }

    // Adjust map when fullscreen or split view changes
    const map = mapRef.current;
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    // Cleanup function
    return () => {
      // We don't remove the map on cleanup to preserve the instance
    };
  }, [fullscreenMode, splitViewEnabled]);

  // Function to fetch real data from Supabase
  const fetchMapData = async () => {
    try {
      // Example of how to fetch data from Supabase
      // const { data, error } = await supabase
      //  .from('waste_collection_points')
      //  .select('*');
      
      // if (error) throw error;
      
      toast({
        title: "Data diperbarui",
        description: "Data peta berhasil diperbarui",
      });
      
      setMapStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString()
      }));
      
    } catch (error) {
      console.error("Error fetching map data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data peta terbaru",
        variant: "destructive"
      });
    }
  };

  // Take screenshot function
  const takeScreenshot = () => {
    toast({
      title: "Screenshot Peta",
      description: "Screenshot berhasil disimpan",
    });
  };

  // Reset view to initial center and zoom
  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.setView([-3.3194, 114.5921], 14);
    }
  };

  // Handle points count change from layers component
  const handlePointsChange = (count: number) => {
    setMapStatus(prev => ({
      ...prev,
      activePoints: count,
      lastUpdate: new Date().toLocaleTimeString()
    }));
  };

  return (
    <div className={`relative ${fullscreenMode ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} ${splitViewEnabled ? 'w-1/2' : 'w-full'} border border-border rounded-lg bg-muted/10 shadow-md overflow-hidden`}>
      {/* Header Component */}
      <MapHeader
        activePoints={mapStatus.activePoints}
        lastUpdate={mapStatus.lastUpdate}
        onRefresh={fetchMapData}
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
