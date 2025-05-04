// useMapLayers.ts - Perbaikan lengkap

import { useEffect, useCallback, useState, useRef } from 'react';
import L from 'leaflet';
import { LayerConfig, LayerInstances } from '../types';
import { useToast } from '@/hooks/use-toast';

// PATCH: Tambahkan parameter filter ke useMapLayers
export const useMapLayers = (
  map: L.Map | null,
  layerGroups: LayerConfig[],
  filter?: {
    selectedKecamatan?: string | null;
    selectedKelurahan?: string | null;
    selectedRT?: string | null;
  }
) => {
  const [layerInstances, setLayerInstances] = useState<LayerInstances>({});
  const [initialized, setInitialized] = useState(false);
  const layerInstancesRef = useRef<LayerInstances>({});
  const { toast } = useToast();
  
  // Track which layers are currently loading
  const loadingLayersRef = useRef(new Set<string>());
  // Track initialization state
  const initializingRef = useRef(false);
  // Track current filter to detect changes
  const prevFilterRef = useRef(filter);

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

  // Add method to handle uploaded layers - PERBAIKAN
  const addUploadedLayer = useCallback((uploadedLayer: LayerConfig, geojsonData: GeoJSON.GeoJsonObject): boolean => {
    if (!map) return false;
    
    try {
      const geoJSONLayer = L.geoJSON(geojsonData, {
        style: () => ({
          color: uploadedLayer.style?.color || "#ff7800",
          weight: uploadedLayer.style?.weight || 3,
          opacity: uploadedLayer.opacity,
          fillColor: uploadedLayer.style?.fillColor || "#ff7800",
          fillOpacity: uploadedLayer.opacity * 0.2,
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
      
      setLayerInstances(prev => ({
        ...prev,
        [uploadedLayer.id]: geoJSONLayer
      }));
      
      layerInstancesRef.current[uploadedLayer.id] = geoJSONLayer;
      
      if (uploadedLayer.visible) {
        map.addLayer(geoJSONLayer);
      }
      
      return true;
    } catch (error) {
      console.error(`Error adding uploaded layer ${uploadedLayer.id}:`, error);
      toast({
        title: "Error",
        description: `Failed to add uploaded layer ${uploadedLayer.name}`,
        variant: "destructive",
      });
      return false;
    }
  }, [map, toast]);
  
  const removeUploadedLayer = useCallback((layerId: string): boolean => {
    const layer = layerInstancesRef.current[layerId];
    
    if (!layer) {
      console.warn(`Layer ${layerId} not found for removal`);
      return false;
    }
    
    if (map) {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
      
      setLayerInstances(prev => {
        const updated = { ...prev };
        delete updated[layerId];
        return updated;
      });
      
      delete layerInstancesRef.current[layerId];
      
      return true;
    }
    
    return false;
  }, [map]);

  // Load a specific layer with loading state tracking
  const loadLayer = useCallback(async (layer: LayerConfig): Promise<L.Layer | null> => {
    // Mark this layer as loading
    loadingLayersRef.current.add(layer.id);
    try {
      if (layer.type === "tile") {
        const tileLayer = L.tileLayer(layer.url!, {
          attribution: layer.attribution,
          opacity: layer.opacity,
        });
        return tileLayer;
      } else if (layer.type === "geojson") {
        let data: unknown = null;
        if (layer.url) {
          // load from url
          const response = await fetch(layer.url, {
            headers: {
              'Expires': '0'
            }
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch ${layer.url}: ${response.statusText}`);
          }
          data = await response.json();
        } else if (layer.data) {
          // load from inline data (uploaded)
          try {
            data = JSON.parse(layer.data);
          } catch (e) {
            console.error('Invalid GeoJSON data in layerConfig.data', e);
            toast({
              title: 'Error',
              description: `Layer ${layer.id} has invalid GeoJSON data`,
              variant: 'destructive',
            });
            return null;
          }
        } else {
          return null;
        }
        
        // Check if this is the kelurahan layer that needs filtering
        const isKelurahanLayer = layer.id === 'batas-kelurahan' || 
                               (layer.url && layer.url.includes('kelurahan.geojson'));
        
        // Tambahkan komentar pada lokasi error agar developer tahu harus melakukan type assertion atau validasi sebelum casting ke GeoJsonObject
        // Contoh: jika yakin data adalah GeoJSON
        // const geoLayer = L.geoJSON(data as GeoJSON.GeoJsonObject);
        // atau lakukan validasi sebelum casting
        const geoJSONLayer = L.geoJSON(data as GeoJSON.GeoJsonObject, {
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
          filter: (feature: GeoJSON.Feature) => {
            // Only apply filtering to kelurahan layer
            if (!isKelurahanLayer) {
              return true;
            }
            
            // Skip filtering for features without properties
            if (!feature.properties) {
              return true;
            }
            
            if (filter) {
              const { selectedKecamatan, selectedKelurahan, selectedRT } = filter;
              // Use uppercase property names to match the GeoJSON data structure
              if (selectedKecamatan && feature.properties?.KECAMATAN !== selectedKecamatan) return false;
              if (selectedKelurahan && feature.properties?.KELURAHAN !== selectedKelurahan) return false;
              if (selectedRT && feature.properties?.RT !== selectedRT) return false;
            }
            return true;
          },
        });
        return geoJSONLayer;
      }
    } catch (error) {
      console.error(`Error loading layer ${layer.id}:`, error);
      toast({
        title: "Error",
        description: `Failed to load layer ${layer.id}`,
        variant: "destructive",
      });
    } finally {
      // Always remove from loading set when done
      loadingLayersRef.current.delete(layer.id);
    }
    return null;
  }, [toast, filter]);

  // Initial setup when map is ready
  useEffect(() => {
    if (!map || initialized || initializingRef.current) return;
    
    const initialSetup = async () => {
      initializingRef.current = true;
      
      // Only load visible layers initially
      const visibleLayers = layerGroups.filter(layer => layer.visible);
      const newInstances: LayerInstances = {};
      
      for (const layer of visibleLayers) {
        const loadedLayer = await loadLayer(layer);
        if (loadedLayer) {
          newInstances[layer.id] = loadedLayer;
          
          // Add to map if visible
          if (layer.visible) {
            map.addLayer(loadedLayer);
          }
        }
      }
      
      setLayerInstances(newInstances);
      setInitialized(true);
    };
    
    initialSetup();
    
    const currentMap = map;
    return () => {
      if (currentMap !== null && typeof currentMap.off === 'function') {
        // Remove all custom event listeners here
        // Example: currentMap.off('layeradd', onLayerAdd);
        // If you have custom listeners, add guards here
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, loadLayer, layerGroups]);

  // Handle layer visibility and lazy loading
  useEffect(() => {
    if (!initialized || !map) return;

    const handleLayerChanges = async () => {
      const updatedLayers = { ...layerInstancesRef.current };
      let hasUpdates = false;
      
      for (const layerConfig of layerGroups) {
        // First check if we need to load this layer
        if (layerConfig.visible && !updatedLayers[layerConfig.id]) {
          const layer = await loadLayer(layerConfig);
          if (layer) {
            updatedLayers[layerConfig.id] = layer;
            hasUpdates = true;
          }
        }
        
        // Then update visibility if the layer exists
        if (updatedLayers[layerConfig.id]) {
          updateLayerVisibility(layerConfig.id, layerConfig.visible);
          updateLayerOpacity(layerConfig.id, layerConfig.opacity);
        }
      }
      
      // Only update state if new layers were loaded
      if (hasUpdates) {
        setLayerInstances(updatedLayers);
      }
    };
    
    handleLayerChanges();
  }, [layerGroups, initialized, map, loadLayer, updateLayerVisibility, updateLayerOpacity]);

  // Effect to handle filter changes - reload GeoJSON layers when filter changes
  useEffect(() => {
    // Skip if not initialized or no map
    if (!initialized || !map) return;
    
    // Check if filter has changed
    const filterChanged = JSON.stringify(prevFilterRef.current) !== JSON.stringify(filter);
    if (!filterChanged) return;
    
    // Update filter ref
    prevFilterRef.current = filter;
    
    // Find only the kelurahan boundary layer to refresh
    // We only want to apply filters to the kelurahan layer, not other layers like TPS
    const kelurahanLayer = layerGroups.find(layer => 
      layer.id === 'batas-kelurahan' || 
      (layer.type === 'geojson' && layer.url?.includes('kelurahan.geojson'))
    );
    
    if (!kelurahanLayer) return;
    
    const reloadKelurahanLayer = async () => {
      const updatedLayers = { ...layerInstancesRef.current };
      
      // Remove existing kelurahan layer from map if it exists
      if (updatedLayers[kelurahanLayer.id] && map.hasLayer(updatedLayers[kelurahanLayer.id])) {
        map.removeLayer(updatedLayers[kelurahanLayer.id]);
      }
      
      // Reload the kelurahan layer with new filter
      if (kelurahanLayer.visible) {
        const layer = await loadLayer(kelurahanLayer);
        if (layer) {
          updatedLayers[kelurahanLayer.id] = layer;
          map.addLayer(layer);
          
          // Update state
          setLayerInstances(updatedLayers);
        }
      }
    };
    
    reloadKelurahanLayer();
  }, [filter, initialized, map, layerGroups, loadLayer]);

  return {
    initialized,
    updateLayerVisibility,
    updateLayerOpacity,
    addUploadedLayer,
    removeUploadedLayer
  };
};