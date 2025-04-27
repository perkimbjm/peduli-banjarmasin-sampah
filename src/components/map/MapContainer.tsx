import { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LayerManager from "./LayerManager";
import MapContent from "./MapContent";
import { LayerConfig, LayerGroup, MapState } from "./types";
import "leaflet-omnivore";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";

// Define initial layer groups
const getInitialLayerGroups = (): LayerGroup[] => [
  {
    id: "basemap",
    name: "Basemap",
    data: '',
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
    data: '',
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
        visible: true,
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
    data: '',
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
        visible: true,
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
];

const DEFAULT_CENTER: [number, number] = [-3.3147, 114.5905]; // Banjarmasin
const DEFAULT_ZOOM = 12;

// Styling for z-index toast
const toastStyles = `
  .toast-container {
    z-index: 10000 !important;
  }
  [role="status"].toast {
    z-index: 10001 !important;
  }
`;

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
  
  // Apply toast styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = toastStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Handle click outside for layer panel
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

  // Defensive: Remove all controls before map is destroyed (unmount)
  useEffect(() => {
    return () => {
      // Only use global map instance array (do NOT try to re-instantiate map)
      const mapInstances = (window as unknown as { L?: { Map?: { _instances?: unknown[] } } }).L?.Map?._instances;
      let map: unknown = null;
      if (Array.isArray(mapInstances) && mapInstances.length > 0) {
        map = mapInstances[0];
      }
      if (
        map &&
        typeof map === 'object' &&
        '_controls' in map &&
        Array.isArray((map as { _controls: unknown[] })._controls)
      ) {
        const controls = (map as { _controls: unknown[] })._controls;
        controls.forEach((control) => {
          if (control && typeof control === 'object' && 'remove' in control && typeof (control as { remove: unknown }).remove === 'function') {
            try {
              (control as { remove: () => void }).remove();
            } catch (e) {
              // ignore or log
            }
          }
        });
      }
    };
  }, []);

  const handleLayerToggle = (layerId: string) => {
    setMapState((prev) => {
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
      
      const newVisible = !targetLayer.visible;
      let updatedGroups: LayerGroup[];
      
      if (targetGroup.id === "basemap" && newVisible) {
        updatedGroups = prev.layerGroups.map(group => {
          if (group.id === "basemap") {
            return {
              ...group,
              layers: group.layers.map(layer => ({
                ...layer,
                visible: layer.id === layerId
              }))
            };
          }
          return group;
        });
      } else {
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

  const handleLayerOpacityChange = (layerId: string, opacity: number) => {
    setMapState((prev) => {
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

  const handleFileUpload = (file: File, layerConfig: LayerConfig) => {
    setMapState(prev => {
      // Cari grup uploaded
      const uploadedGroup = prev.layerGroups.find(group => group.id === 'uploaded');
      if (!uploadedGroup) {
        // Buat grup baru jika belum ada
        return {
          ...prev,
          layerGroups: [
            ...prev.layerGroups,
            {
              id: 'uploaded',
              name: 'Layer yang diupload',
              data: '',
              layers: [{ ...layerConfig }],
            }
          ],
          activeLayers: [...prev.activeLayers, layerConfig.id]
        };
      }
      // Cek jika layer sudah ada
      const exists = uploadedGroup.layers.some(l => l.id === layerConfig.id);
      if (exists) {
        // Update layer jika sudah ada (replace)
        return {
          ...prev,
          layerGroups: prev.layerGroups.map(group => {
            if (group.id === 'uploaded') {
              return {
                ...group,
                layers: group.layers.map(l => l.id === layerConfig.id ? { ...layerConfig } : l)
              };
            }
            return group;
          }),
          activeLayers: [...new Set([...prev.activeLayers, layerConfig.id])]
        };
      }
      // Tambahkan layer baru
      return {
        ...prev,
        layerGroups: prev.layerGroups.map(group => {
          if (group.id === 'uploaded') {
            return {
              ...group,
              layers: [...group.layers, { ...layerConfig }]
            };
          }
          return group;
        }),
        activeLayers: [...prev.activeLayers, layerConfig.id]
      };
    });
    setIsLayerPanelOpen(true);
    toast({
      title: 'Upload Berhasil',
      description: `File ${layerConfig.name} berhasil diupload dan ditampilkan sebagai layer`,
    });
  };

  const handleRemoveUploadedLayer = (layerId: string) => {
    if (window.mapLayers && window.mapLayers[layerId]) {
      const layer = window.mapLayers[layerId];
      if (layer && layer.remove && typeof layer.remove === 'function') {
        try {
          layer.remove();
        } catch (e) {
          // layer might already be removed
          console.warn('Layer removal error:', e);
        }
      }
    }
    
    setMapState(prev => {
      const uploadedGroup = prev.layerGroups.find(group => group.id === 'uploaded');
      
      if (!uploadedGroup) return prev;
      
      const remainingLayers = uploadedGroup.layers.filter(layer => layer.id !== layerId);
      const updatedActiveLayers = prev.activeLayers.filter(id => id !== layerId);
      
      if (remainingLayers.length === 0) {
        return {
          ...prev,
          layerGroups: prev.layerGroups.filter(group => group.id !== 'uploaded'),
          activeLayers: updatedActiveLayers
        };
      }
      
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
    
    toast({
      title: "Layer Dihapus",
      description: `Layer ${layerId} berhasil dihapus`,
    });
  };

  return (
    <div className="relative h-full w-full">
      <LeafletMapContainer

        id="leaflet-map"
        center={mapState.center}
        zoom={mapState.zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
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
