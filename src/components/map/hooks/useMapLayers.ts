
import { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LayerConfig, LayerGroup, LayerStyle, RTFeature } from '../types';

interface UseMapLayersProps {
  map: L.Map | null;
  layerGroups: LayerGroup[];
  selectedKecamatan: string | null;
  selectedKelurahan: string | null;
  selectedRT: string | null;
}

const useMapLayers = (
  map: L.Map | null,
  layerGroups: LayerGroup[],
  selectedKecamatan: string | null,
  selectedKelurahan: string | null,
  selectedRT: string | null
) => {
  const [layers, setLayers] = useState<{ [id: string]: L.Layer }>({});
  const currentLayersRef = useRef<{ [id: string]: L.Layer }>({});
  const basemapLayersRef = useRef<{ [id: string]: L.TileLayer }>({});

  useEffect(() => {
    currentLayersRef.current = layers;
  }, [layers]);

  // Helper function to get style properties safely
  const getStyleProperty = (style: LayerConfig['style'], property: keyof LayerStyle, defaultValue: any) => {
    if (!style) return defaultValue;
    if (typeof style === 'function') return defaultValue;
    return (style as LayerStyle)[property] ?? defaultValue;
  };

  const createLayer = useCallback((layerConfig: LayerConfig) => {
    if (!map) return null;

    console.log(`Creating layer: ${layerConfig.id}`);

    switch (layerConfig.type) {
      case 'tile':
        const tileLayer = L.tileLayer(layerConfig.url!, {
          attribution: layerConfig.attribution,
          opacity: layerConfig.opacity,
        });
        
        // Store basemap layers separately for proper management
        if (layerConfig.group === 'basemap') {
          basemapLayersRef.current[layerConfig.id] = tileLayer;
        }
        
        return tileLayer;

      case 'geojson':
        if (!layerConfig.data && !layerConfig.url) {
          console.warn(`Layer ${layerConfig.id} memerlukan data atau URL`);
          return null;
        }

        const style = (feature: GeoJSON.Feature) => {
          const layerStyle = layerConfig.style;
          if (typeof layerStyle === 'function') {
            return layerStyle(feature);
          }
          
          return {
            color: getStyleProperty(layerStyle, 'color', '#3388ff'),
            weight: getStyleProperty(layerStyle, 'weight', 2),
            opacity: layerConfig.opacity,
            fillColor: getStyleProperty(layerStyle, 'fillColor', '#3388ff'),
            fillOpacity: getStyleProperty(layerStyle, 'fillOpacity', 0.2),
          };
        };

        let geoJsonLayer: L.GeoJSON;

        if (layerConfig.data) {
          try {
            const geojsonData = JSON.parse(layerConfig.data);
            geoJsonLayer = L.geoJSON(geojsonData, { style });
          } catch (e) {
            console.error(`Error parsing GeoJSON data for ${layerConfig.id}:`, e);
            return null;
          }
        } else if (layerConfig.url) {
          geoJsonLayer = new L.GeoJSON(null, { style });
          fetch(layerConfig.url)
            .then(response => response.json())
            .then(data => {
              geoJsonLayer.addData(data);
            })
            .catch(error => {
              console.error(`Error fetching GeoJSON data for ${layerConfig.id}:`, error);
            });
        } else {
          console.warn(`No data or URL provided for GeoJSON layer ${layerConfig.id}`);
          return null;
        }

        return geoJsonLayer;

      case 'label':
        if (!layerConfig.sourceLayer) {
          console.warn(`Label layer ${layerConfig.id} memerlukan sourceLayer`);
          return null;
        }

        const sourceLayer = currentLayersRef.current[layerConfig.sourceLayer];
        if (!sourceLayer || !('eachLayer' in sourceLayer)) {
          console.warn(`Source layer ${layerConfig.sourceLayer} tidak ditemukan atau bukan GeoJSON layer`);
          return null;
        }

        const labelGroup = L.layerGroup();
        
        (sourceLayer as L.GeoJSON).eachLayer((layer: L.Layer) => {
          if ('feature' in layer && layer.feature) {
            const feature = layer.feature as GeoJSON.Feature;
            const properties = feature.properties;
            
            if (properties && layerConfig.labelProperty && properties[layerConfig.labelProperty]) {
              const labelText = properties[layerConfig.labelProperty];
              
              // Filter labels untuk RT jika layer RT dan ada filter yang aktif
              if (layerConfig.id === 'label-rt' && (selectedKelurahan || selectedRT)) {
                const isValidRTLabel = (!selectedKelurahan || properties.KEL === selectedKelurahan) &&
                                      (!selectedRT || properties.Nama_RT === selectedRT);
                
                if (!isValidRTLabel) return;
              }
              
              // Get centroid of the feature
              let centroid: L.LatLng | null = null;
              
              if ('getBounds' in layer) {
                centroid = (layer as any).getBounds().getCenter();
              } else if ('getLatLng' in layer) {
                centroid = (layer as any).getLatLng();
              } else if (feature.geometry && 'coordinates' in feature.geometry) {
                // Calculate centroid for polygon features
                const coords = feature.geometry.coordinates;
                if (Array.isArray(coords) && coords.length > 0) {
                  const firstRing = Array.isArray(coords[0]) ? coords[0] : coords;
                  if (Array.isArray(firstRing) && firstRing.length > 0) {
                    let totalLat = 0;
                    let totalLng = 0;
                    let count = 0;
                    
                    const processCoords = (coordArray: any) => {
                      if (Array.isArray(coordArray)) {
                        coordArray.forEach((coord: any) => {
                          if (Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                            totalLng += coord[0];
                            totalLat += coord[1];
                            count++;
                          } else if (Array.isArray(coord)) {
                            processCoords(coord);
                          }
                        });
                      }
                    };
                    
                    processCoords(firstRing);
                    
                    if (count > 0) {
                      centroid = L.latLng(totalLat / count, totalLng / count);
                    }
                  }
                }
              }
              
              if (centroid && L.latLng(centroid).lat !== 0 && L.latLng(centroid).lng !== 0) {
                const labelStyle = layerConfig.style as LayerStyle;
                
                // Apply consistent styling for both RT and Kelurahan labels (no background)
                const divIcon = L.divIcon({
                  className: 'custom-label',
                  html: `<span style="
                    font-size: ${getStyleProperty(labelStyle, 'fontSize', '12px')};
                    font-weight: ${getStyleProperty(labelStyle, 'fontWeight', 'normal')};
                    color: ${getStyleProperty(labelStyle, 'color', '#000')};
                    text-shadow: ${getStyleProperty(labelStyle, 'textShadow', '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff')};
                    white-space: nowrap;
                    pointer-events: none;
                    background: transparent;
                    border: none;
                  ">${labelText}</span>`,
                  iconSize: [0, 0],
                  iconAnchor: [0, 0],
                });
                
                const labelMarker = L.marker(centroid, { icon: divIcon });
                labelGroup.addLayer(labelMarker);
              }
            }
          }
        });
        
        return labelGroup;

      default:
        console.warn(`Layer type ${layerConfig.type} tidak didukung`);
        return null;
    }
  }, [map, selectedKelurahan, selectedRT]);

  const updateLayers = useCallback(() => {
    if (!map) return;

    const newLayers: { [id: string]: L.Layer } = {};

    layerGroups.forEach((group) => {
      group.layers.forEach((layerConfig) => {
        const existingLayer = layers[layerConfig.id];

        if (layerConfig.visible) {
          if (existingLayer) {
            // Layer sudah ada, pastikan masih ada di peta
            if (!map.hasLayer(existingLayer)) {
              existingLayer.addTo(map);
            }
            newLayers[layerConfig.id] = existingLayer;
          } else {
            // Layer belum ada, buat dan tambahkan ke peta
            const newLayer = createLayer(layerConfig);
            if (newLayer) {
              // For basemap layers, ensure only one is visible at a time
              if (layerConfig.group === 'basemap') {
                // Remove all other basemap layers first
                Object.values(basemapLayersRef.current).forEach(basemapLayer => {
                  if (map.hasLayer(basemapLayer)) {
                    map.removeLayer(basemapLayer);
                  }
                });
              }
              
              newLayer.addTo(map);
              newLayers[layerConfig.id] = newLayer;
            }
          }
        } else {
          // Layer tidak visible, hapus dari peta jika ada
          if (existingLayer && map.hasLayer(existingLayer)) {
            map.removeLayer(existingLayer);
          }
        }
      });
    });

    setLayers(newLayers);
  }, [map, layerGroups, createLayer, layers]);

  const clearLayers = useCallback(() => {
    Object.values(layers).forEach((layer) => {
      if (map && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    
    // Clear basemap layers too
    Object.values(basemapLayersRef.current).forEach((layer) => {
      if (map && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    
    setLayers({});
  }, [map, layers]);

  useEffect(() => {
    updateLayers();

    return () => {
      clearLayers();
    };
  }, [updateLayers, clearLayers]);

  return { updateLayers, clearLayers };
};

export default useMapLayers;
