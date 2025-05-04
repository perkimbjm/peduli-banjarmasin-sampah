
// useMapLayers.ts - Perbaikan bug label RT

import { useEffect, useCallback, useState, useRef } from 'react';
import L from 'leaflet';
import { LayerConfig, LayerInstances } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useRTData } from '@/contexts/RTDataContext';

interface LabelOptions {
  style: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textShadow?: string;
  }
}

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
  const { rtFeatures } = useRTData(); // Ambil data RT dari context
  
  // Track which layers are currently loading
  const loadingLayersRef = useRef(new Set<string>());
  // Track initialization state
  const initializingRef = useRef(false);
  // Track current filter to detect changes
  const prevFilterRef = useRef(filter);
  // Cache untuk menyimpan data fitur dari layer yang sudah dimuat
  const featureCacheRef = useRef<Record<string, GeoJSON.FeatureCollection>>({});
  // Cache untuk menyimpan layer label yang sudah dibuat
  const labelLayersRef = useRef<Record<string, L.LayerGroup>>({});

  // Update ref when layerInstances changes
  useEffect(() => {
    layerInstancesRef.current = layerInstances;
    window.mapLayers = layerInstances;
  }, [layerInstances]);

  // Update layer visibility (show/hide on map)
  const updateLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    const layer = layerInstancesRef.current[layerId];
    if (!layer || !map) return;
    
    if (visible) {
      if (!map.hasLayer(layer)) {
        map.addLayer(layer);
      }
    } else {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  }, [map]);

  const updateLayerOpacity = useCallback((layerId: string, opacity: number) => {
    const layer = layerInstancesRef.current[layerId];
    
    if (layer) {
      if ('setOpacity' in layer) {
        // Untuk tile layer
        (layer as L.TileLayer).setOpacity(opacity);
      } else if ('setStyle' in layer) {
        // Untuk GeoJSON layer
        const geoJSONLayer = layer as L.GeoJSON;
        
        // Dapatkan style asli dari layer
        const originalStyle = geoJSONLayer.options.style;
        let newStyle: L.PathOptions;
        
        if (typeof originalStyle === 'function') {
          // Jika style adalah fungsi, panggil dengan feature kosong untuk mendapatkan style default
          newStyle = originalStyle({} as GeoJSON.Feature);
        } else if (originalStyle) {
          // Jika style adalah objek, gunakan style tersebut
          newStyle = { ...originalStyle };
        } else {
          // Style default jika tidak ada style asli
          newStyle = {
            color: "#ff7800",
            weight: 3,
            fillColor: "#ff7800"
          };
        }
        
        // Update opacity sambil mempertahankan style lainnya
        newStyle.opacity = opacity;
        newStyle.fillOpacity = opacity * 0.2;
        
        // Terapkan style baru ke semua fitur
        geoJSONLayer.setStyle((feature) => {
          const featureStyle = typeof originalStyle === 'function' 
            ? originalStyle(feature as GeoJSON.Feature)
            : { ...newStyle };
            
          return {
            ...featureStyle,
            opacity: opacity,
            fillOpacity: opacity * 0.2
          };
        });
      } else if (layer instanceof L.LayerGroup) {
        // Untuk layer group (seperti layer label)
        const labelGroup = layer as L.LayerGroup;
        labelGroup.eachLayer((marker) => {
          if (marker instanceof L.Marker && marker.getElement()) {
            const iconElement = marker.getElement();
            if (iconElement) {
              iconElement.style.opacity = opacity.toString();
            }
          }
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

  // PERBAIKAN: Buat atau perbarui label layer dengan memperhatikan filter
  const createLabelLayer = useCallback((layer: LayerConfig): L.LayerGroup | null => {
    if (!layer.sourceLayer || !layer.labelProperty) {
      console.error('Label layer requires sourceLayer and labelProperty', layer);
      return null;
    }
    
    // Cari data dari layer sumber (cache atau instance)
    const sourceData = featureCacheRef.current[layer.sourceLayer];
    if (!sourceData || !sourceData.features || !sourceData.features.length) {
      console.warn(`Source data for ${layer.sourceLayer} not found, label layer ${layer.id} will be created later`);
      return null;
    }
    
    // Buat layer group baru atau gunakan yang sudah ada
    let labelGroup = labelLayersRef.current[layer.id] || L.layerGroup();
    
    // Kosongkan layer group jika sudah ada sebelumnya
    if (labelLayersRef.current[layer.id]) {
      labelGroup.clearLayers();
    }
    
    // Tentukan apakah ini label untuk RT
    const isRTLabel = layer.id === 'label-rt';
    
    // Buat label untuk setiap fitur dengan memperhatikan filter
    sourceData.features.forEach(feature => {
      // Skip jika tidak memiliki properti yang dibutuhkan
      if (!feature.properties || !feature.properties[layer.labelProperty]) return;
      
      // Apply filtering untuk label RT
      if (isRTLabel && filter) {
        // Jika filter kelurahan aktif, filter berdasarkan KEL
        if (filter.selectedKelurahan && 
            feature.properties.KEL && 
            feature.properties.KEL !== filter.selectedKelurahan) {
          return;
        }
        
        // Jika filter RT aktif, filter berdasarkan Nama_RT
        if (filter.selectedRT && 
            feature.properties.Nama_RT && 
            feature.properties.Nama_RT !== filter.selectedRT) {
          return;
        }
      }
      
      // Dapatkan label text dari properti
      const labelText = feature.properties[layer.labelProperty];
      
      // PERBAIKAN: Hitung centroid dari geometri untuk penempatan label dengan pengecekan ekstra
      let center: [number, number] | null = null;
      
      try {
        if (feature.geometry && feature.geometry.coordinates) {
          if (feature.geometry.type === 'Polygon') {
            // Untuk polygon, gunakan pusat bounding box
            const polygon = L.polygon(
              (feature.geometry.coordinates[0] as [number, number][]).map(
                coord => [coord[1], coord[0]] as [number, number]
              )
            );
            const bounds = polygon.getBounds();
            center = [bounds.getCenter().lat, bounds.getCenter().lng];
          } else if (feature.geometry.type === 'MultiPolygon') {
            // Untuk multiPolygon, gunakan pusat bounding box dari polygon pertama
            if (feature.geometry.coordinates[0] && feature.geometry.coordinates[0][0]) {
              const polygon = L.polygon(
                (feature.geometry.coordinates[0][0] as [number, number][]).map(
                  coord => [coord[1], coord[0]] as [number, number]
                )
              );
              const bounds = polygon.getBounds();
              center = [bounds.getCenter().lat, bounds.getCenter().lng];
            }
          } else if (feature.geometry.type === 'Point') {
            // Untuk point, gunakan koordinat point
            center = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as [number, number];
          }
        }
      } catch (error) {
        console.warn(`Error calculating centroid for ${layer.id}:`, error);
        return; // Skip this feature
      }
      
      // PERBAIKAN: Jangan buat marker jika tidak ada center yang valid
      if (!center || center[0] === undefined || center[1] === undefined) {
        console.warn(`Invalid center coordinates for ${layer.labelProperty}:${labelText}`, feature);
        return;
      }
      
      // Buat div icon dengan style dari layer config
      const icon = L.divIcon({
        className: 'custom-label-icon',
        html: `<div style="
          font-size: ${layer.style?.fontSize || '12px'};
          font-weight: ${layer.style?.fontWeight || 'normal'};
          color: ${layer.style?.color || '#000'};
          text-shadow: ${layer.style?.textShadow || 'none'};
          text-align: center;
          white-space: nowrap;
          padding: 3px;
          background-color: rgba(255,255,255,0.5);
          border-radius: 3px;
          ">${labelText}</div>`,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      });
      
      // Buat marker dengan div icon
      const marker = L.marker(center, { icon });
      
      // Tambahkan ke group
      labelGroup.addLayer(marker);
    });
    
    // Simpan referensi labelGroup untuk pembaruan selanjutnya
    labelLayersRef.current[layer.id] = labelGroup;
    
    return labelGroup;
  }, [filter]);

  // Load a specific layer with loading state tracking
  const loadLayer = useCallback(async (layer: LayerConfig): Promise<L.Layer | null> => {
    // Mark this layer as loading
    loadingLayersRef.current.add(layer.id);
    try {
      // Handle tile layers
      if (layer.type === "tile") {
        const tileLayer = L.tileLayer(layer.url!, {
          attribution: layer.attribution,
          opacity: layer.opacity,
        });
        return tileLayer;
      } 
      // Handle label layers
      else if (layer.type === "label") {
        // Try to create a label layer
        const labelLayer = createLabelLayer(layer);
        if (labelLayer) {
          return labelLayer;
        }
        
        // If we can't create it now (source data not loaded yet),
        // schedule it for later when data becomes available
        return null;
      }
      // Handle geojson layers
      else if (layer.type === "geojson") {
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
        
        // Jika ini adalah layer RT dan tidak ada data dari URL/data property, gunakan data dari context
        if (layer.id === 'batas-rt' && !data && rtFeatures.length > 0) {
          data = {
            type: 'FeatureCollection',
            features: rtFeatures
          };
        }
        
        // Check if this is the kelurahan layer that needs filtering
        const isKelurahanLayer = layer.id === 'batas-kelurahan' || 
                               (layer.url && layer.url.includes('kelurahan.geojson'));
                               
        // Check if this is the RT layer that needs filtering
        const isRTLayer = layer.id === 'batas-rt';
        
        // Check if this is the TPS layer
        const isTPSLayer = layer.id === 'tps';
        
        // Store a copy of the GeoJSON data in the cache for label layers to use
        if (data && typeof data === 'object' && 'features' in data) {
          // Clone data sebelum disimpan di cache
          featureCacheRef.current[layer.id] = JSON.parse(JSON.stringify(data));
        }
        
        const geoJSONLayer = L.geoJSON(data as GeoJSON.GeoJsonObject, {
          style: (feature) => {
            // Khusus untuk layer TPS
            if (isTPSLayer) {
              return {
                color: "#ff0000",
                weight: 2,
                opacity: layer.opacity,
                fillColor: "#ff0000",
                fillOpacity: layer.opacity * 0.5
              };
            }
            
            // Untuk layer lainnya
            return {
              color: layer.style?.color || "#3388ff",
              weight: layer.style?.weight || 3,
              opacity: layer.opacity,
              fillColor: layer.style?.fillColor || "#3388ff",
              fillOpacity: layer.opacity * 0.2,
            };
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              // Menentukan jenis layer berdasarkan properti fitur
              if (feature.properties.nama && feature.properties.KELURAHAN) {
                // Popup khusus untuk layer komposting
                layer.bindPopup(`
                  <div class="p-2">
                    <h3 class="font-bold text-amber-800">${feature.properties.nama}</h3>
                    <p class="text-sm mt-1">Alamat: ${feature.properties.alamat || '-'}</p>
                    <p class="text-sm">Kelurahan: ${feature.properties.KELURAHAN || '-'}</p>
                    <p class="text-sm">Kecamatan: ${feature.properties.KECAMATAN || '-'}</p>
                  </div>
                `);
              } else if (feature.properties.Nama && feature.properties.KELURAHAN) {
                // Popup khusus untuk layer bank sampah
                layer.bindPopup(`
                  <div class="p-2">
                    <h3 class="font-bold text-green-600">${feature.properties.Nama}</h3>
                    <p class="text-sm mt-1">ID: ${feature.properties.ID || '-'}</p>
                    <p class="text-sm">Kelurahan: ${feature.properties.KELURAHAN || '-'}</p>
                    <p class="text-sm">Kecamatan: ${feature.properties.KECAMATAN || '-'}</p>
                  </div>
                `);
              } else {
                // Default popup untuk layer lainnya
                layer.bindPopup(
                  Object.entries(feature.properties)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join("<br>")
                );
              }
            }
          },
          filter: (feature: GeoJSON.Feature) => {
            // Only apply filtering to kelurahan layer
            if (isKelurahanLayer) {
              // Skip filtering for features without properties
              if (!feature.properties) {
                return true;
              }
              
              if (filter) {
                const { selectedKecamatan, selectedKelurahan } = filter;
                // Use uppercase property names to match the GeoJSON data structure
                if (selectedKecamatan && feature.properties?.KECAMATAN !== selectedKecamatan) return false;
                if (selectedKelurahan && feature.properties?.KELURAHAN !== selectedKelurahan) return false;
              }
              return true;
            }
            
            // Apply filtering to RT layer
            if (isRTLayer) {
              // Skip filtering for features without properties
              if (!feature.properties) {
                return true;
              }
              
              if (filter) {
                const { selectedKelurahan, selectedRT } = filter;
                // RT layer uses "KEL" property instead of "KELURAHAN"
                if (selectedKelurahan && feature.properties?.KEL !== selectedKelurahan) return false;
                if (selectedRT && feature.properties?.Nama_RT !== selectedRT) return false;
              }
              return true;
            }
            
            // For all other layers, don't apply filtering
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
  }, [toast, filter, rtFeatures, createLabelLayer]);

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
        // Remove all custom event listeners here if needed
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
      
      // Create any label layers that depend on data that was just loaded
      const labelLayers = layerGroups.filter(
        layer => layer.type === 'label' && !updatedLayers[layer.id] && layer.visible
      );
      
      for (const labelConfig of labelLayers) {
        const labelLayer = createLabelLayer(labelConfig);
        if (labelLayer) {
          updatedLayers[labelConfig.id] = labelLayer;
          // Add to map if visible
          if (labelConfig.visible) {
            map.addLayer(labelLayer);
          }
          hasUpdates = true;
        }
      }
      
      // Only update state if new layers were loaded
      if (hasUpdates) {
        setLayerInstances(updatedLayers);
      }
    };
    
    handleLayerChanges();
  }, [layerGroups, initialized, map, loadLayer, updateLayerVisibility, updateLayerOpacity, createLabelLayer]);

  // PERBAIKAN: Update label layers saat filter berubah
  useEffect(() => {
    if (!initialized || !map) return;

    // Check if filter changed
    const filterChanged = JSON.stringify(prevFilterRef.current) !== JSON.stringify(filter);
    if (!filterChanged) return;

    prevFilterRef.current = filter;

    // Cari semua layer label
    const labelLayers = layerGroups.filter(layer => 
      layer.type === 'label' &&
      layer.visible &&
      layerInstancesRef.current[layer.id]
    );

    // Perbarui setiap layer label yang sudah ada
    labelLayers.forEach(layerConfig => {
      // Hapus layer lama dari peta
      const existingLayer = layerInstancesRef.current[layerConfig.id];
      if (existingLayer && map.hasLayer(existingLayer)) {
        map.removeLayer(existingLayer);
      }

      // Buat ulang layer dengan filter baru
      const newLabelLayer = createLabelLayer(layerConfig);
      if (newLabelLayer) {
        // Update referensi di layerInstances
        layerInstancesRef.current[layerConfig.id] = newLabelLayer;
        
        // Tambahkan ke peta jika visible
        if (layerConfig.visible) {
          map.addLayer(newLabelLayer);
        }
      }
    });

    // Update state dengan referensi layer yang diperbarui
    setLayerInstances({...layerInstancesRef.current});

  }, [filter, initialized, map, layerGroups, createLabelLayer]);

  // Update cache when RT or kelurahan data changes
  useEffect(() => {
    if (rtFeatures.length > 0) {
      // Simpan data RT di cache untuk digunakan oleh label layer
      featureCacheRef.current['batas-rt'] = {
        type: 'FeatureCollection',
        features: rtFeatures.map(feature => ({
          ...feature,
          type: 'Feature',
          geometry: {
            ...feature.geometry,
            type: 'MultiPolygon' as const
          }
        }))
      };
      
      // Jika label layer RT sudah dimuat, perbarui
      const rtLabelLayer = layerInstancesRef.current['label-rt'];
      if (rtLabelLayer && initialized && filter) {
        // Temukan konfigurasi label RT
        const rtLabelConfig = layerGroups.find(layer => layer.id === 'label-rt');
        if (rtLabelConfig) {
          // Buat layer label baru dengan data dan filter terbaru
          const newLabelLayer = createLabelLayer(rtLabelConfig);
          if (newLabelLayer) {
            // Hapus layer lama dari peta
            if (map && map.hasLayer(rtLabelLayer)) {
              map.removeLayer(rtLabelLayer);
            }
            
            // Update referensi
            layerInstancesRef.current['label-rt'] = newLabelLayer;
            
            // Tambahkan ke peta jika layer visible
            if (rtLabelConfig.visible && map) {
              map.addLayer(newLabelLayer);
            }
            
            // Update state
            setLayerInstances({...layerInstancesRef.current});
          }
        }
      }
    }
  }, [rtFeatures, createLabelLayer, layerGroups, map, filter, initialized]);

  // Perbarui layer RT dan kelurahan saat filter, visibilitas, atau data berubah
  useEffect(() => {
    if (!map || !initialized) return;
    // ---- RT LAYER ----
    const rtLayer = layerInstancesRef.current['batas-rt'];
    // Temukan config layer RT untuk cek visibility
    const rtLayerConfig = layerGroups.find(layer => layer.id === 'batas-rt');
    const rtVisible = rtLayerConfig && rtLayerConfig.visible && rtLayer && map.hasLayer(rtLayer);
    if (rtLayer && rtLayer instanceof L.GeoJSON) {
      // Selalu refresh fitur, baik layer visible maupun tidak
      rtLayer.clearLayers();
      let features = rtFeatures;
      if (filter && (filter.selectedKelurahan || filter.selectedRT)) {
        features = rtFeatures.filter(feature => {
          if (!feature.properties) return true;
          if (filter.selectedKelurahan && feature.properties.KEL !== filter.selectedKelurahan) return false;
          if (filter.selectedRT && feature.properties.Nama_RT !== filter.selectedRT) return false;
          return true;
        });
      }
      const geoJSON = {
        type: 'FeatureCollection',
        features
      };
      rtLayer.addData(geoJSON as GeoJSON.GeoJsonObject);
    }
    // ---- END RT LAYER ----
  }, [map, initialized, filter, rtFeatures, layerGroups]);

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
