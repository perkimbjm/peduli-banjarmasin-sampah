
import { useState, useCallback } from 'react';
import L from 'leaflet';
import { LayerType } from '../../../components/webgis/data/mock-map-data';

export interface MapLayer {
  id: string;
  name: string;
  type: LayerType;
  layer: L.Layer;
  visible: boolean;
}

export const useMapLayers = (
  map?: L.Map,
  layers?: any[],
  options?: { selectedKecamatan?: string | null; selectedKelurahan?: string | null; selectedRT?: string | null }
) => {
  const [layerState, setLayerState] = useState<MapLayer[]>([]);
  const [initialized, setInitialized] = useState(false);

  const addLayer = useCallback((layerConfig: Omit<MapLayer, 'id'>) => {
    const id = `layer_${Date.now()}_${Math.random()}`;
    const newLayer: MapLayer = {
      ...layerConfig,
      id,
    };
    
    setLayerState(prev => [...prev, newLayer]);
    return id;
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayerState(prev => prev.filter(layer => layer.id !== id));
  }, []);

  const toggleLayer = useCallback((id: string) => {
    setLayerState(prev => 
      prev.map(layer => 
        layer.id === id 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  }, []);

  const getVisibleLayers = useCallback(() => {
    return layerState.filter(layer => layer.visible);
  }, [layerState]);

  const updateLayerVisibility = useCallback((id: string, visible: boolean) => {
    setLayerState(prev => 
      prev.map(layer => 
        layer.id === id 
          ? { ...layer, visible }
          : layer
      )
    );
  }, []);

  const updateLayerOpacity = useCallback((id: string, opacity: number) => {
    // Implementation for opacity update
    console.log('Updating layer opacity:', id, opacity);
  }, []);

  // Helper function to create styled layers
  const createStyledLayer = useCallback((
    data: any,
    style: L.PathOptions | ((feature: any) => L.PathOptions)
  ) => {
    if (typeof style === 'function') {
      return L.geoJSON(data, {
        style: style,
      });
    } else {
      return L.geoJSON(data, {
        style: () => style,
      });
    }
  }, []);

  // Set initialized state
  useState(() => {
    if (map && !initialized) {
      setInitialized(true);
    }
  });

  return {
    layers: layerState,
    addLayer,
    removeLayer,
    toggleLayer,
    getVisibleLayers,
    createStyledLayer,
    initialized,
    updateLayerVisibility,
    updateLayerOpacity,
  };
};

export default useMapLayers;
