
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

const useMapLayers = () => {
  const [layers, setLayers] = useState<MapLayer[]>([]);

  const addLayer = useCallback((layerConfig: Omit<MapLayer, 'id'>) => {
    const id = `layer_${Date.now()}_${Math.random()}`;
    const newLayer: MapLayer = {
      ...layerConfig,
      id,
    };
    
    setLayers(prev => [...prev, newLayer]);
    return id;
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  }, []);

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === id 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  }, []);

  const getVisibleLayers = useCallback(() => {
    return layers.filter(layer => layer.visible);
  }, [layers]);

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

  return {
    layers,
    addLayer,
    removeLayer,
    toggleLayer,
    getVisibleLayers,
    createStyledLayer,
  };
};

export default useMapLayers;
