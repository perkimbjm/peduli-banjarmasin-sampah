import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LayerManager from "./LayerManager";
import MapControls from "./MapControls";
import { LayerConfig, LayerGroup, MapState } from "./types";
import L from "leaflet";
import "leaflet-omnivore";
import { useToast } from "@/hooks/use-toast";

// Memperluas interface Window untuk menyimpan layers
declare global {
  interface Window {
    mapLayers: Record<string, L.Layer>;
  }
}

const DEFAULT_CENTER: [number, number] = [-3.3147, 114.5905]; // Banjarmasin
const DEFAULT_ZOOM = 12;

// Definisi layer default yang akan ditampilkan saat pertama kali
const getInitialLayerGroups = (): LayerGroup[] => [
  {
    id: "basemap",
    name: "Basemap",
    layers: [
      {
        id: "openstreetmap",
        name: "OpenStreetMap",
        type: "tile",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        visible: true,
        opacity: 1,
        group: "basemap",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      {
        id: "satellite",
        name: "Satellite",
        type: "tile",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        visible: false,
        opacity: 1,
        group: "basemap",
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
      },
      {
        id: "topographic",
        name: "Topographic",
        type: "tile",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        visible: false,
        opacity: 1,
        group: "basemap",
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
      },
    ],
  },
  {
    id: "batas-wilayah",
    name: "Batas Wilayah",
    layers: [
      {
        id: "batas-rt",
        name: "Batas RT",
        type: "geojson",
        url: "/data-map/BATAS_RT_AR.geojson",
        visible: false,
        opacity: 0.5,
        group: "batas-wilayah",
        style: {
          color: "#666666",
          weight: 1,
          opacity: 0.5,
          fillColor: "#ffffff",
          fillOpacity: 0.1,
        },
      },
      {
        id: "batas-kelurahan",
        name: "Batas Kelurahan",
        type: "geojson",
        url: "/data-map/kelurahan.geojson",
        visible: true, // Layer batas kelurahan akan ditampilkan secara default
        opacity: 0.7,
        group: "batas-wilayah",
        style: {
          color: "#1a73e8",
          weight: 2,
          opacity: 0.7,
          fillColor: "#ffffff",
          fillOpacity: 0.1,
        },
      },
    ],
  },
  {
    id: "infrastruktur",
    name: "Infrastruktur",
    layers: [
      {
        id: "sungai",
        name: "Sungai",
        type: "geojson",
        url: "/data-map/SUNGAI_LN.geojson",
        visible: false,
        opacity: 0.8,
        group: "infrastruktur",
        style: {
          color: "#1a73e8",
          weight: 2,
          opacity: 0.8,
        },
      },
      {
        id: "tps",
        name: "TPS",
        type: "geojson",
        url: "/data-map/persampahan.geojson",
        visible: true, // Layer TPS akan ditampilkan secara default
        opacity: 1,
        group: "infrastruktur",
        style: {
          color: "#ff0000",
          weight: 2,
          opacity: 1,
          fillColor: "#ff0000",
          fillOpacity: 0.5,
        },
      },
    ],
  },
  // Grup "Layer Diupload" akan ditambahkan dinamis saat ada file yang diupload
];

// Styling untuk z-index toast
const toastStyles = `
  .toast-container {
    z-index: 10000 !important;
  }
  [role="status"].toast {
    z-index: 10001 !important;
  }
`;

interface MapContentProps {
  onFileUpload: (file: File) => void;
  layerGroups: LayerGroup[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  isLayerPanelOpen: boolean;
  onLayerPanelToggle: () => void;
  onRemoveUploadedLayer: (layerId: string) => void;
}

interface LayerInstances {
  [key: string]: L.Layer;
}

const MapContent: React.FC<MapContentProps> = ({
  onFileUpload,
  layerGroups,
  onLayerToggle,
  onLayerOpacityChange,
  isLayerPanelOpen,
  onLayerPanelToggle,
  onRemoveUploadedLayer
}) => {
  const map = useMap();
  const [layerInstances, setLayerInstances] = useState<LayerInstances>({});
  const [initialized, setInitialized] = useState(false);
  const layerInstancesRef = useRef<LayerInstances>({});

  // Update ref ketika layerInstances berubah
  useEffect(() => {
    layerInstancesRef.current = layerInstances;
    window.mapLayers = layerInstances;
  }, [layerInstances]);

  // PERBAIKAN: Fungsi untuk mengelola visibilitas layer
  const updateLayerVisibility = useCallback((layerId: string, visible: boolean) => {
    const layer = layerInstancesRef.current[layerId];
    
    if (layer) {
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

  // PERBAIKAN: Fungsi untuk mengelola opacity layer
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

  // PERBAIKAN: Inisialisasi awal layer
  useEffect(() => {
    if (initialized) return;
    
    const loadLayers = async () => {
      const newInstances: LayerInstances = {};
      
      for (const group of layerGroups) {
        for (const layer of group.layers) {
          try {
            if (layer.type === "tile") {
              // Buat tile layer
              const tileLayer = L.tileLayer(layer.url, {
                attribution: layer.attribution,
                opacity: layer.opacity,
              });
              
              // Tambahkan ke instances
              newInstances[layer.id] = tileLayer;
              
            } else if (layer.type === "geojson" && layer.url) {
              // Load dan parse GeoJSON data
              const response = await fetch(layer.url);
              if (!response.ok) {
                throw new Error(`Failed to fetch ${layer.url}: ${response.statusText}`);
              }
              
              const data = await response.json();
              
              // Buat GeoJSON layer
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
              
              // Tambahkan ke instances
              newInstances[layer.id] = geoJSONLayer;
            }
          } catch (error) {
            console.error(`Error loading layer ${layer.id}:`, error);
          }
        }
      }
      
      // Update state dengan semua layer yang baru dibuat
      setLayerInstances(newInstances);
      setInitialized(true);
    };
    
    loadLayers();
  }, [layerGroups]);

  // PERBAIKAN: Effect untuk menerapkan visibilitas dan opacity
  useEffect(() => {
    if (!initialized) return;
    
    // Buat timeout untuk memastikan map sudah siap
    setTimeout(() => {
      layerGroups.forEach(group => {
        group.layers.forEach(layer => {
          updateLayerVisibility(layer.id, layer.visible);
          updateLayerOpacity(layer.id, layer.opacity);
        });
      });
    }, 100);
  }, [layerGroups, initialized, updateLayerVisibility, updateLayerOpacity]);

  // Upload file handling
  const handleFileUpload = async (file: File) => {
    if (!initialized) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        try {
          const data = JSON.parse(content);
          
          // Buat layer baru
          const geoJSONLayer = L.geoJSON(data, {
            style: {
              color: "#ff7800",
              weight: 2,
              opacity: 0.65,
              fillOpacity: 0.2,
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(
                  Object.entries(feature.properties)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join("<br>")
                );
              }
            }
          });
          
          
          // Tambahkan ke state dan ref
          setLayerInstances(prev => {
            const updated = {
              ...prev,
              [file.name]: geoJSONLayer
            };
            
            // Tambahkan ke peta
            geoJSONLayer.addTo(map);
            
            return updated;
          });
          
          // Notify parent component
          onFileUpload(file);
        } catch (error) {
          console.error("Error parsing GeoJSON:", error);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return (
    <div className="h-full w-full">
      <MapControls 
        onLayerPanelToggle={onLayerPanelToggle} 
        onFileUpload={handleFileUpload}
        isLayerPanelOpen={isLayerPanelOpen}
      />
    </div>
  );
};

const MapContainer = () => {
  const [mapState, setMapState] = useState<MapState>(() => {
    const initialGroups = getInitialLayerGroups();
    return {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      layerGroups: initialGroups,
      activeLayers: initialGroups
        .flatMap((group) => group.layers)
        .filter((layer) => layer.visible)
        .map((layer) => layer.id),
    };
  });
  
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const layerPanelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Meningkatkan z-index toast
  useEffect(() => {
    // Tambahkan style untuk toast ke head dokumen
    const styleElement = document.createElement('style');
    styleElement.textContent = toastStyles;
    document.head.appendChild(styleElement);
    
    // Clean up style saat komponen unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Handle click outside untuk layer panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        layerPanelRef.current &&
        !layerPanelRef.current.contains(event.target as Node)
      ) {
        setIsLayerPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // PERBAIKAN: Toggle visibilitas layer
  const handleLayerToggle = (layerId: string) => {
    setMapState((prev) => {
      // Cari layer dan group dari layerId
      let targetGroup: LayerGroup | undefined;
      let targetLayer: LayerConfig | undefined;
      
      for (const group of prev.layerGroups) {
        const layer = group.layers.find(l => l.id === layerId);
        if (layer) {
          targetGroup = group;
          targetLayer = layer;
          break;
        }
      }
      
      if (!targetGroup || !targetLayer) return prev;
      
      // Toggle nilai visibilitas
      const newVisible = !targetLayer.visible;
      
      let updatedGroups: LayerGroup[];
      
      // Handle differently for basemap layers vs other layers
      if (targetGroup.id === "basemap" && newVisible) {
        // Jika mengaktifkan basemap, pastikan hanya satu yang aktif
        updatedGroups = prev.layerGroups.map(group => {
          if (group.id === "basemap") {
            return {
              ...group,
              layers: group.layers.map(layer => ({
                ...layer,
                visible: layer.id === layerId // aktifkan yang dipilih, nonaktifkan yang lain
              }))
            };
          }
          return group;
        });
      } else {
        // Untuk layer lain atau menonaktifkan basemap, cukup toggle saja
        updatedGroups = prev.layerGroups.map(group => {
          if (group.id === targetGroup!.id) {
            return {
              ...group,
              layers: group.layers.map(layer => 
                layer.id === layerId
                  ? { ...layer, visible: newVisible }
                  : layer
              )
            };
          }
          return group;
        });
      }
      
      // Update active layers
      const activeLayers = updatedGroups
        .flatMap(group => group.layers)
        .filter(layer => layer.visible)
        .map(layer => layer.id);
      
      return {
        ...prev,
        layerGroups: updatedGroups,
        activeLayers
      };
    });
  };

  // PERBAIKAN: Ubah opacity layer
  const handleLayerOpacityChange = (layerId: string, opacity: number) => {
    setMapState((prev) => {
      // Update layer opacity in all groups
      const updatedGroups = prev.layerGroups.map(group => ({
        ...group,
        layers: group.layers.map(layer => 
          layer.id === layerId
            ? { ...layer, opacity }
            : layer
        )
      }));
      
      return {
        ...prev,
        layerGroups: updatedGroups
      };
    });
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    try {
      const layerName = file.name.split('.').slice(0, -1).join('.');
      
      setMapState(prev => {
        // Check if 'uploaded' group exists
        const uploadedGroupExists = prev.layerGroups.some(group => group.id === 'uploaded');
        
        // If not, create a new group
        if (!uploadedGroupExists) {
          const newLayer: LayerConfig = {
            id: file.name,
            name: layerName,
            type: 'geojson',
            visible: true,
            opacity: 0.65,
            group: 'uploaded',
            style: {
              color: "#ff7800",
              weight: 2,
              opacity: 0.65,
            }
          };
          
          const newGroup: LayerGroup = {
            id: 'uploaded',
            name: 'Layer Diupload',
            layers: [newLayer]
          };
          
          return {
            ...prev,
            layerGroups: [...prev.layerGroups, newGroup],
            activeLayers: [...prev.activeLayers, file.name]
          };
        }
        
        // Otherwise add to existing group
        const newLayer: LayerConfig = {
          id: file.name,
          name: layerName,
          type: 'geojson',
          visible: true,
          opacity: 0.65,
          group: 'uploaded',
          style: {
            color: "#ff7800",
            weight: 2,
            opacity: 0.65,
          }
        };
        
        return {
          ...prev,
          layerGroups: prev.layerGroups.map(group => {
            if (group.id === 'uploaded') {
              return {
                ...group,
                layers: [...group.layers, newLayer]
              };
            }
            return group;
          }),
          activeLayers: [...prev.activeLayers, file.name]
        };
      });
      
      // Show success toast
      toast({
        title: "Upload Berhasil",
        description: `File ${layerName} berhasil diupload dan ditampilkan sebagai layer`,
        variant: "default",
      });
      
      // Set layer panel to open so user can see the added layer
      setIsLayerPanelOpen(true);
    } catch (error) {
      console.error("Error adding uploaded layer:", error);
      
      // Show error toast
      toast({
        title: "Upload Gagal",
        description: `Terjadi kesalahan saat mengupload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  // Handle remove uploaded layer
  const handleRemoveUploadedLayer = (layerId: string) => {
    // Remove from map directly
    const mapLayers = window.mapLayers;
    if (mapLayers && mapLayers[layerId]) {
      const layer = mapLayers[layerId];
      if (layer) {
        layer.remove();
      }
    }
    
    // Remove from state
    setMapState(prev => {
      // Find 'uploaded' group
      const uploadedGroup = prev.layerGroups.find(group => group.id === 'uploaded');
      
      if (!uploadedGroup) return prev;
      
      // Remove layer from group
      const remainingLayers = uploadedGroup.layers.filter(layer => layer.id !== layerId);
      
      // Update activeLayers
      const updatedActiveLayers = prev.activeLayers.filter(id => id !== layerId);
      
      // If no layers left, remove the whole group
      if (remainingLayers.length === 0) {
        return {
          ...prev,
          layerGroups: prev.layerGroups.filter(group => group.id !== 'uploaded'),
          activeLayers: updatedActiveLayers
        };
      }
      
      // Otherwise update the group
      return {
        ...prev,
        layerGroups: prev.layerGroups.map(group => {
          if (group.id === 'uploaded') {
            return {
              ...group,
              layers: remainingLayers
            };
          }
          return group;
        }),
        activeLayers: updatedActiveLayers
      };
    });
    
    // Show confirmation toast
    toast({
      title: "Layer Dihapus",
      description: `Layer ${layerId} berhasil dihapus`,
      variant: "default",
    });
  };

  return (
    <div className="relative h-full w-full">
      <LeafletMapContainer
        center={mapState.center}
        zoom={mapState.zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-10" // Atur z-index untuk MapContainer
      >
        <MapContent 
          onFileUpload={handleFileUpload} 
          layerGroups={mapState.layerGroups}
          onLayerToggle={handleLayerToggle}
          onLayerOpacityChange={handleLayerOpacityChange}
          isLayerPanelOpen={isLayerPanelOpen}
          onLayerPanelToggle={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
          onRemoveUploadedLayer={handleRemoveUploadedLayer}
        />
      </LeafletMapContainer>
      {isLayerPanelOpen && (
        <div ref={layerPanelRef} className="absolute top-4 right-4 z-[1000]">
          <LayerManager
            layerGroups={mapState.layerGroups}
            onLayerToggle={handleLayerToggle}
            onLayerOpacityChange={handleLayerOpacityChange}
            onRemoveUploadedLayer={handleRemoveUploadedLayer}
          />
        </div>
      )}
    </div>
  );
};

export default MapContainer;