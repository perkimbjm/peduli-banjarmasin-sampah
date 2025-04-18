import { useState, useEffect, useRef } from "react";
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
import { ToastProvider } from "@/components/ui/toast";

// Memperluas interface Window untuk menyimpan layers
declare global {
  interface Window {
    mapLayers: Record<string, L.Layer>;
  }
}

const DEFAULT_CENTER: [number, number] = [-3.3147, 114.5905]; // Banjarmasin
const DEFAULT_ZOOM = 12;

const initialLayerGroups: LayerGroup[] = [
  {
    id: "basemap",
    name: "Basemap",
    layers: [
      {
        id: "openstreetmap",
        name: "OpenStreetMap",
        type: "tile",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        visible: false,
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
        visible: false,
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
        visible: false,
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


const MapContent = ({ 
  onFileUpload, 
  layerGroups,
  onLayerToggle,
  onLayerOpacityChange,
  isLayerPanelOpen,
  onLayerPanelToggle,
  onRemoveUploadedLayer
}: { 
  onFileUpload: (file: File) => void;
  layerGroups: LayerGroup[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  isLayerPanelOpen: boolean;
  onLayerPanelToggle: () => void;
  onRemoveUploadedLayer: (layerId: string) => void;
}) => {
  const map = useMap();
  const [layers, setLayers] = useState<{ [key: string]: L.Layer }>({});

  // Provide a way for parent components to access layer references
  useEffect(() => {
    // Make the uploaded layers accessible to parent components via a global window property
    window.mapLayers = layers;
  }, [layers]);

  useEffect(() => {
    // Update layer visibility and opacity
    layerGroups.forEach(group => {
      group.layers.forEach(layer => {
        const existingLayer = layers[layer.id];
        if (existingLayer) {
          if (layer.type === 'tile') {
            // Memastikan opacity berfungsi untuk semua basemap termasuk OpenStreetMap
            (existingLayer as L.TileLayer).setOpacity(layer.opacity);
            if (layer.visible) {
              existingLayer.addTo(map);
            } else {
              existingLayer.remove();
            }
          } else {
            const geoJSONLayer = existingLayer as L.GeoJSON;
            geoJSONLayer.setStyle({
              ...layer.style,
              opacity: layer.opacity,
              fillOpacity: layer.opacity,
            });
            if (layer.visible) {
              geoJSONLayer.addTo(map);
            } else {
              geoJSONLayer.remove();
            }
          }
        }
      });
    });
  }, [map, layerGroups, layers]);

  useEffect(() => {
    // Load initial layers
    const loadLayers = async () => {
      const newLayers: { [key: string]: L.Layer } = {};
      
      for (const group of layerGroups) {
        for (const layer of group.layers) {
          if (layer.url) {
            try {
              if (layer.type === "tile") {
                const tileLayer = L.tileLayer(layer.url, {
                  attribution: layer.attribution,
                  opacity: layer.opacity,
                });
                if (layer.visible) {
                  tileLayer.addTo(map);
                }
                newLayers[layer.id] = tileLayer;
              } else if (layer.type === "geojson") {
                const response = await fetch(layer.url);
                const data = await response.json();
                const geoJSONLayer = L.geoJSON(data, {
                  style: layer.style,
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
                if (layer.visible) {
                  geoJSONLayer.addTo(map);
                }
                newLayers[layer.id] = geoJSONLayer;
              }
            } catch (error) {
              console.error(`Error loading layer ${layer.id}:`, error);
            }
          }
        }
      }
      
      setLayers(newLayers);
    };

    loadLayers();
  }, [map]);

  const handleFileUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        try {
          const data = JSON.parse(content);
          const layer = L.geoJSON(data, {
            style: {
              color: "#ff7800",
              weight: 2,
              opacity: 0.65,
            },
          });
          layer.addTo(map);
          
          // Store the layer reference
          setLayers(prev => ({
            ...prev,
            [file.name]: layer
          }));
          
          // Pass to parent
          onFileUpload(file);
        } catch (error) {
          console.error("Error processing GeoJSON data:", error);
          onFileUploadError(file.name, "Error processing data");
        }
      };
      reader.onerror = () => {
        onFileUploadError(file.name, "Error reading file");
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      onFileUploadError(file.name, "Error uploading file");
    }
  };

  const onFileUploadError = (fileName: string, errorMsg: string) => {
    // Notify parent component about error
    console.error(`Failed to upload ${fileName}: ${errorMsg}`);
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
  const [mapState, setMapState] = useState<MapState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    layerGroups: initialLayerGroups,
    activeLayers: initialLayerGroups
      .flatMap((group) => group.layers)
      .filter((layer) => layer.visible)
      .map((layer) => layer.id),
  });
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const layerPanelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      
      // Jika tidak menemukan layer, kembalikan state tanpa perubahan
      if (!targetGroup || !targetLayer) return prev;
      
      const updatedGroups = prev.layerGroups.map((group) => {
        // Jika ini adalah grup basemap dan layer yang diklik sedang tidak visible,
        // kita perlu mengaktifkannya dan menonaktifkan semua basemap lainnya
        if (group.id === "basemap" && targetGroup.id === "basemap" && !targetLayer.visible) {
          return {
            ...group,
            layers: group.layers.map((layer) => {
              // Aktifkan layer yang dipilih
              if (layer.id === layerId) {
                return { ...layer, visible: true };
              }
              // Nonaktifkan semua layer basemap lainnya
              return { ...layer, visible: false };
            }),
          };
        } else if (group.id === targetGroup.id) {
          // Untuk layer non-basemap atau basemap yang akan dinonaktifkan,
          // cukup toggle visibilitas layer yang dipilih
          return {
            ...group,
            layers: group.layers.map((layer) => {
              if (layer.id === layerId) {
                return { ...layer, visible: !layer.visible };
              }
              return layer;
            }),
          };
        }
        return group;
      });

      return {
        ...prev,
        layerGroups: updatedGroups,
        activeLayers: updatedGroups
          .flatMap((group) => group.layers)
          .filter((layer) => layer.visible)
          .map((layer) => layer.id),
      };
    });
  };

  const handleLayerOpacityChange = (layerId: string, opacity: number) => {
    setMapState((prev) => ({
      ...prev,
      layerGroups: prev.layerGroups.map((group) => ({
        ...group,
        layers: group.layers.map((layer) =>
          layer.id === layerId ? { ...layer, opacity } : layer
        ),
      })),
    }));
  };

  const handleFileUpload = (file: File) => {
    try {
      const layerName = file.name.split('.').slice(0, -1).join('.');
      
      setMapState(prev => {
        // Cek apakah grup 'uploaded' sudah ada
        const uploadedGroupExists = prev.layerGroups.some(group => group.id === 'uploaded');
        
        // Jika grup 'uploaded' belum ada, buat grup baru
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
            layerGroups: [...prev.layerGroups, newGroup]
          };
        }
        
        // Jika grup 'uploaded' sudah ada, tambahkan layer baru ke grup tersebut
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
          })
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

  const handleRemoveUploadedLayer = (layerId: string) => {
    // Hapus layer dari peta
    const mapLayers = window.mapLayers;
    if (mapLayers && mapLayers[layerId]) {
      const layer = mapLayers[layerId];
      if (layer) {
        // Pastikan layer sudah dihapus dari map
        layer.remove();
      }
    }
    
    // Hapus dari state dan periksa apakah grup 'uploaded' masih memiliki layer
    setMapState(prev => {
      // Cari grup 'uploaded'
      const uploadedGroup = prev.layerGroups.find(group => group.id === 'uploaded');
      
      // Jika tidak ada grup 'uploaded', tidak ada yang perlu dilakukan
      if (!uploadedGroup) return prev;
      
      // Filter layer yang akan dihapus
      const remainingLayers = uploadedGroup.layers.filter(layer => layer.id !== layerId);
      
      // Jika tidak ada layer tersisa, hapus seluruh grup 'uploaded'
      if (remainingLayers.length === 0) {
        return {
          ...prev,
          layerGroups: prev.layerGroups.filter(group => group.id !== 'uploaded')
        };
      }
      
      // Jika masih ada layer tersisa, update grup 'uploaded'
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
        })
      };
    });
    
    // Show toast when layer is removed
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