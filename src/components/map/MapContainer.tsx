
import { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LayerManager from "./LayerManager";
import MapContent from "./MapContent";
import { LayerConfig, LayerGroup, MapState } from "./types";
import "leaflet-omnivore";
import { useToast } from "@/hooks/use-toast";

// Define initial layer groups
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

  const handleFileUpload = (file: File) => {
    try {
      const layerName = file.name.split('.').slice(0, -1).join('.');
      
      setMapState(prev => {
        const uploadedGroupExists = prev.layerGroups.some(group => group.id === 'uploaded');
        
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
      
      setIsLayerPanelOpen(true);
      
      toast({
        title: "Upload Berhasil",
        description: `File ${layerName} berhasil diupload dan ditampilkan sebagai layer`,
      });
    } catch (error) {
      console.error("Error adding uploaded layer:", error);
      toast({
        title: "Upload Gagal",
        description: `Terjadi kesalahan saat mengupload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveUploadedLayer = (layerId: string) => {
    if (window.mapLayers && window.mapLayers[layerId]) {
      const layer = window.mapLayers[layerId];
      if (layer) {
        layer.remove();
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
