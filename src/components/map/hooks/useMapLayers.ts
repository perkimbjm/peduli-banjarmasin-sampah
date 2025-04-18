
import { useEffect, useCallback, useState, useRef } from 'react';
import L from 'leaflet';
import { LayerConfig, LayerInstances } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useMapLayers = (map: L.Map | null, layerGroups: LayerConfig[]) => {
  const [layerInstances, setLayerInstances] = useState<LayerInstances>({});
  const [initialized, setInitialized] = useState(false);
  const layerInstancesRef = useRef<LayerInstances>({});
  const { toast } = useToast();

  // Update ref when layerInstances changes
  useEffect(() => {
    layerInstancesRef.current = layerInstances;
    window.mapLayers = layerInstances;
  }, [layerInstances]);

  const updateLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    const layer = layerInstancesRef.current[layerId];
    
    if (layer && map) {
      if (visible) {
        if (!map.hasLayer(layer)) {
          map.addLayer(layer);
        }
      } else {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      }
    }
  }, [map]);

  const updateLayerOpacity = useCallback((layerId: string, opacity: number) => {
    const layer = layerInstancesRef.current[layerId];
    
    if (layer) {
      if ('setOpacity' in layer) {
        (layer as L.TileLayer).setOpacity(opacity);
      } else if ('setStyle' in layer) {
        (layer as L.GeoJSON).setStyle({
          opacity: opacity,
          fillOpacity: opacity * 0.2
        });
      }
    }
  }, []);

  useEffect(() => {
    if (initialized || !map) return;
    
    const loadLayers = async () => {
      const newInstances: LayerInstances = {};
      
      for (const layer of layerGroups) {
        try {
          if (layer.type === "tile") {
            const tileLayer = L.tileLayer(layer.url!, {
              attribution: layer.attribution,
              opacity: layer.opacity,
            });
            newInstances[layer.id] = tileLayer;
          } else if (layer.type === "geojson" && layer.url) {
            const response = await fetch(layer.url);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${layer.url}: ${response.statusText}`);
            }
            
            const data = await response.json();
            const geoJSONLayer = L.geoJSON(data, {
              style: () => ({
                color: layer.style?.color || "#3388ff",
                weight: layer.style?.weight || 3,
                opacity: layer.opacity,
                fillColor: layer.style?.fillColor || "#3388ff",
                fillOpacity: layer.opacity * 0.2,
              }),
              onEachFeature: (feature, layer) => {
                if (feature.properties) {
                  layer.bindPopup(
                    Object.entries(feature.properties)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join("<br>")
                  );
                }
              },
            });
            
            newInstances[layer.id] = geoJSONLayer;
          }
        } catch (error) {
          console.error(`Error loading layer ${layer.id}:`, error);
          toast({
            title: "Error",
            description: `Failed to load layer ${layer.id}`,
            variant: "destructive",
          });
        }
      }
      
      setLayerInstances(newInstances);
      setInitialized(true);
    };
    
    loadLayers();
  }, [map, layerGroups, initialized, toast]);

  return {
    layerInstances,
    initialized,
    updateLayerVisibility,
    updateLayerOpacity
  };
};
