import { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LayerManager from "./LayerManager";
import MapContent from "./MapContent";
import Sidebar from "./Sidebar";
import { LayerConfig, LayerGroup, MapState } from "./types";
import "leaflet-omnivore";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";
import { useKelurahanData } from '../../contexts/KelurahanDataContext';

// Define the GeoJSON feature type
interface KelurahanFeature {
  type: string;
  properties: {
    KODE_KEL: string;
    KELURAHAN: string;
    KECAMATAN: string;
    [key: string]: string | number;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

console.log("MapContainer rendered!");

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
  const { kelurahanFeatures, loading: kelurahanLoading } = useKelurahanData();

  // State untuk data kelurahan dan filter
  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [kelurahanList, setKelurahanList] = useState<string[]>([]);
  const [rtList, setRtList] = useState<string[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
  const [selectedKelurahan, setSelectedKelurahan] = useState<string | null>(null);
  const [selectedRT, setSelectedRT] = useState<string | null>(null);
  const [batasRTLayerActive, setBatasRTLayerActive] = useState<boolean>(false);

  // Inisialisasi kecamatanList dan kelurahanList ketika data context sudah siap
  useEffect(() => {
    if (!kelurahanLoading && kelurahanFeatures.length > 0) {
      const kecamatanSet = new Set<string>();
      kelurahanFeatures.forEach((f: KelurahanFeature) => {
        if (f.properties && f.properties.KECAMATAN) kecamatanSet.add(f.properties.KECAMATAN);
      });
      setKecamatanList(Array.from(kecamatanSet));
      setKelurahanList(kelurahanFeatures.map((f: KelurahanFeature) => f.properties.KELURAHAN));
    }
  }, [kelurahanLoading, kelurahanFeatures]);

  // Filter kelurahan by kecamatan
  useEffect(() => {
    if (!selectedKecamatan) {
      setKelurahanList(kelurahanFeatures.map((f: KelurahanFeature) => f.properties.KELURAHAN));
    } else {
      setKelurahanList(
        kelurahanFeatures.filter((f: KelurahanFeature) => f.properties.KECAMATAN === selectedKecamatan)
          .map((f: KelurahanFeature) => f.properties.KELURAHAN)
      );
    }
    setSelectedKelurahan(null); // Reset kelurahan saat kecamatan berubah
    setSelectedRT(null); // Reset RT juga
  }, [selectedKecamatan, kelurahanFeatures]);

  // Filter RT jika layer aktif dan kelurahan dipilih
  useEffect(() => {
    if (!batasRTLayerActive || !selectedKelurahan) {
      setRtList([]);
      return;
    }
    fetch('/data-map/BATAS_RT_AR.geojson')
      .then(res => res.json())
      .then(data => {
        const filtered = data.features.filter((f: any) => f.properties.KEL === selectedKelurahan);
        setRtList(filtered.map((f: any) => f.properties.Nama_RT));
      });
  }, [selectedKelurahan, batasRTLayerActive]);

  // Handler untuk toggle layer batas RT (misal dari kontrol peta)
  const handleToggleBatasRTLayer = (active: boolean) => {
    setBatasRTLayerActive(active);
    if (!active) setSelectedRT(null);
  };

  // Handler filter untuk Sidebar
  const handleKecamatanChange = (v: string) => setSelectedKecamatan(v || null);
  const handleKelurahanChange = (v: string) => setSelectedKelurahan(v || null);
  const handleRTChange = (v: string) => setSelectedRT(v || null);

  // Handler untuk reset semua filter
  const handleResetFilters = () => {
    setSelectedKecamatan(null);
    setSelectedKelurahan(null);
    setSelectedRT(null);
    toast({
      title: 'Filter direset',
      description: 'Semua filter telah dihapus',
    });
  };

  // Filtering data kelurahan/RT untuk layer peta:
  const filteredKelurahanFeatures = selectedKecamatan || selectedKelurahan
    ? kelurahanFeatures.filter(f =>
        (!selectedKecamatan || f.properties.KECAMATAN === selectedKecamatan) &&
        (!selectedKelurahan || f.properties.KELURAHAN === selectedKelurahan)
      )
    : kelurahanFeatures;

  // Untuk layer RT: fetch & filter di komponen layer peta, gunakan selectedKelurahan & selectedRT

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

  // Ubah layerGroups agar layer 'batas-kelurahan' mengambil data dari context, bukan url
  useEffect(() => {
    if (!kelurahanLoading && kelurahanFeatures.length > 0) {
      setMapState(prev => {
        const newLayerGroups = prev.layerGroups.map(group => {
          if (group.id !== 'batas-wilayah') return group;
          return {
            ...group,
            layers: group.layers.map(layer => {
              if (layer.id !== 'batas-kelurahan') return layer;
              // inject data dari context, hapus url
              return {
                ...layer,
                url: undefined,
                data: JSON.stringify({ type: 'FeatureCollection', features: kelurahanFeatures })
              };
            })
          };
        });
        return { ...prev, layerGroups: newLayerGroups };
      });
    }
  }, [kelurahanLoading, kelurahanFeatures]);

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
      <Sidebar
        kecamatanList={kecamatanList}
        kelurahanList={kelurahanList}
        rtList={rtList}
        selectedKecamatan={selectedKecamatan}
        selectedKelurahan={selectedKelurahan}
        selectedRT={selectedRT}
        onKecamatanChange={handleKecamatanChange}
        onKelurahanChange={handleKelurahanChange}
        onRTChange={handleRTChange}
        batasRTLayerActive={batasRTLayerActive}
        loading={kelurahanLoading}
        onResetFilters={handleResetFilters}
      />
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
          selectedKecamatan={selectedKecamatan}
          selectedKelurahan={selectedKelurahan}
          selectedRT={selectedRT}
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
