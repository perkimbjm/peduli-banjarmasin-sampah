
import { useState, useEffect } from 'react';
import * as L from 'leaflet';
import { LayerConfig, MapState } from '../types';

export const useMapLayers = () => {
  const [mapState, setMapState] = useState<MapState>({
    activeLayers: [],
    selectedFeature: null,
    filterCriteria: {},
    isLoading: false
  });

  const [layerConfigs] = useState<LayerConfig[]>([
    {
      id: 'districts',
      name: 'Batas Kecamatan',
      type: 'geojson',
      url: '/data-map/kelurahan.geojson',
      visible: true,
      style: {
        color: '#3388ff',
        weight: 2,
        opacity: 0.6,
        fillColor: '#3388ff',
        fillOpacity: 0.1
      }
    },
    {
      id: 'persampahan',
      name: 'Fasilitas Persampahan',
      type: 'geojson',
      url: '/data-map/persampahan.geojson',
      visible: true,
      style: {
        color: '#ff7800',
        weight: 3,
        opacity: 0.8,
        fillColor: '#ff7800',
        fillOpacity: 0.6
      }
    }
  ]);

  const toggleLayer = (layerId: string) => {
    setMapState(prev => ({
      ...prev,
      activeLayers: prev.activeLayers.includes(layerId)
        ? prev.activeLayers.filter(id => id !== layerId)
        : [...prev.activeLayers, layerId]
    }));
  };

  const selectFeature = (feature: any) => {
    setMapState(prev => ({
      ...prev,
      selectedFeature: feature
    }));
  };

  const updateFilter = (criteria: Record<string, any>) => {
    setMapState(prev => ({
      ...prev,
      filterCriteria: { ...prev.filterCriteria, ...criteria }
    }));
  };

  const createLayerStyle = (config: LayerConfig, feature?: any) => {
    if (typeof config.style === 'function') {
      return config.style(feature);
    }
    return config.style || {
      color: '#3388ff',
      weight: 2,
      opacity: 0.6,
      fillColor: '#3388ff',
      fillOpacity: 0.1
    };
  };

  return {
    mapState,
    layerConfigs,
    toggleLayer,
    selectFeature,
    updateFilter,
    createLayerStyle
  };
};
