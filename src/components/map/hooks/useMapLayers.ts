
import { useCallback, useEffect } from 'react';
import L from 'leaflet';
import { LayerConfig, LayerGroup } from '../types';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    mapLayers: { [key: string]: L.Layer };
  }
}

interface UseMapLayersProps {
  map: L.Map | null;
  layerGroups: LayerGroup[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  selectedKecamatan: string | null;
  selectedKelurahan: string | null;
  selectedRT: string | null;
}

export const useMapLayers = ({
  map,
  layerGroups,
  onLayerToggle,
  onLayerOpacityChange,
  selectedKecamatan,
  selectedKelurahan,
  selectedRT
}: UseMapLayersProps) => {
  const { toast } = useToast();

  // Initialize global mapLayers
  useEffect(() => {
    if (!window.mapLayers) {
      window.mapLayers = {};
    }
  }, []);

  const addGeoJSONLayer = useCallback((config: LayerConfig, geoJSONData: any) => {
    if (!map) return null;

    // Filter data based on selections
    let filteredFeatures = geoJSONData.features || [];
    
    if (config.id === 'batas-kelurahan' && (selectedKecamatan || selectedKelurahan)) {
      filteredFeatures = filteredFeatures.filter((feature: any) => {
        if (selectedKelurahan && feature.properties.KELURAHAN !== selectedKelurahan) return false;
        if (selectedKecamatan && feature.properties.KECAMATAN !== selectedKecamatan) return false;
        return true;
      });
    }

    if (config.id === 'batas-rt' && (selectedKelurahan || selectedRT)) {
      filteredFeatures = filteredFeatures.filter((feature: any) => {
        if (selectedKelurahan && feature.properties.KEL !== selectedKelurahan) return false;
        if (selectedRT && feature.properties.Nama_RT !== selectedRT) return false;
        return true;
      });
    }

    const filteredGeoJSON = {
      type: 'FeatureCollection',
      features: filteredFeatures
    };

    // Handle style properly - check if it's a function or object
    let layerStyle;
    if (config.style) {
      if (typeof config.style === 'function') {
        layerStyle = config.style;
      } else {
        // It's an object, so create a function that returns it
        layerStyle = () => ({
          color: config.style?.color || '#000',
          weight: config.style?.weight || 1,
          opacity: config.opacity || 1,
          fillColor: config.style?.fillColor || '#fff',
          fillOpacity: config.style?.fillOpacity || 0.1
        });
      }
    }

    const layer = L.geoJSON(filteredGeoJSON, {
      style: layerStyle,
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          let popupContent = '<div class="popup-content">';
          Object.keys(feature.properties).forEach(key => {
            if (feature.properties[key] !== null && feature.properties[key] !== undefined) {
              popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
            }
          });
          popupContent += '</div>';
          layer.bindPopup(popupContent);
        }
      }
    });

    if (config.visible) {
      layer.addTo(map);
    }

    return layer;
  }, [map, selectedKecamatan, selectedKelurahan, selectedRT]);

  const addLabelLayer = useCallback((config: LayerConfig, sourceLayer: L.Layer | null) => {
    if (!map || !sourceLayer) return null;

    const labelGroup = L.layerGroup();
    
    if (sourceLayer instanceof L.GeoJSON) {
      sourceLayer.eachLayer((layer: any) => {
        if (layer.feature && layer.feature.properties) {
          const labelText = layer.feature.properties[config.labelProperty || 'name'];
          if (labelText) {
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            
            const labelStyle = config.style as any || {};
            const labelIcon = L.divIcon({
              html: `<div style="
                font-size: ${labelStyle.fontSize || '12px'};
                font-weight: ${labelStyle.fontWeight || 'normal'};
                color: ${labelStyle.color || '#000'};
                text-shadow: ${labelStyle.textShadow || 'none'};
                background: transparent;
                border: none;
                text-align: center;
                white-space: nowrap;
              ">${labelText}</div>`,
              className: 'custom-label-icon',
              iconSize: [100, 20],
              iconAnchor: [50, 10]
            });
            
            const labelMarker = L.marker(center, { icon: labelIcon });
            labelGroup.addLayer(labelMarker);
          }
        }
      });
    }

    if (config.visible) {
      labelGroup.addTo(map);
    }

    return labelGroup;
  }, [map]);

  const addTileLayer = useCallback((config: LayerConfig) => {
    if (!map || !config.url) return null;

    const layer = L.tileLayer(config.url, {
      attribution: config.attribution,
      opacity: config.opacity || 1
    });

    if (config.visible) {
      layer.addTo(map);
    }

    return layer;
  }, [map]);

  const loadLayerData = useCallback(async (config: LayerConfig) => {
    if (config.data) {
      try {
        return JSON.parse(config.data);
      } catch (error) {
        console.error('Error parsing layer data:', error);
        return null;
      }
    }

    if (config.url) {
      try {
        const response = await fetch(config.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Error loading layer data from ${config.url}:`, error);
        toast({
          variant: "destructive",
          title: "Error loading layer",
          description: `Failed to load ${config.name}`,
        });
        return null;
      }
    }

    return null;
  }, [toast]);

  const updateLayers = useCallback(async () => {
    if (!map) return;

    // Clear existing layers
    Object.values(window.mapLayers).forEach(layer => {
      if (layer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    window.mapLayers = {};

    // Process all layers
    for (const group of layerGroups) {
      for (const config of group.layers) {
        let layer: L.Layer | null = null;

        if (config.type === 'tile') {
          layer = addTileLayer(config);
        } else if (config.type === 'geojson') {
          const data = await loadLayerData(config);
          if (data) {
            layer = addGeoJSONLayer(config, data);
          }
        } else if (config.type === 'label') {
          const sourceLayer = window.mapLayers[config.sourceLayer || ''];
          layer = addLabelLayer(config, sourceLayer);
        }

        if (layer) {
          window.mapLayers[config.id] = layer;
        }
      }
    }
  }, [map, layerGroups, addTileLayer, addGeoJSONLayer, addLabelLayer, loadLayerData]);

  useEffect(() => {
    updateLayers();
  }, [updateLayers]);

  const toggleLayer = useCallback((layerId: string) => {
    if (!map) return;

    const layer = window.mapLayers[layerId];
    if (!layer) return;

    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    } else {
      layer.addTo(map);
    }

    onLayerToggle(layerId);
  }, [map, onLayerToggle]);

  const changeLayerOpacity = useCallback((layerId: string, opacity: number) => {
    const layer = window.mapLayers[layerId] as any;
    if (!layer) return;

    if (layer.setOpacity) {
      layer.setOpacity(opacity);
    } else if (layer.setStyle) {
      layer.setStyle({ opacity });
    }

    onLayerOpacityChange(layerId, opacity);
  }, [onLayerOpacityChange]);

  return {
    toggleLayer,
    changeLayerOpacity,
    updateLayers
  };
};
