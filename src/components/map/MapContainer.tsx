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
import { useRTData } from '../../contexts/RTDataContext';
import { usePersampahanData } from '../../contexts/PersampahanDataContext';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import * as LControlGeocoder from 'leaflet-control-geocoder';

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

// Define the RT GeoJSON feature type - align with context definition
interface RTFeature {
  type: 'Feature';
  properties: {
    KEC: string;
    KEL: string;
    Nama_RT: string;
    Nama_RW: string;
    [key: string]: string | number;
  };
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

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
        id: "google-satellite",
        name: "Google Satellite",
        type: "tile",
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        visible: false,
        opacity: 1,
        group: "basemap",
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
      },
      {
        id: "google-terrain",
        name: "Google Terrain",
        type: "tile",
        url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        visible: false,
        opacity: 1,
        group: "basemap",
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
      },
      {
        id: "carto-dark",
        name: "Carto Dark",
        type: "tile",
        url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
        visible: false,
        opacity: 1,
        group: "basemap",
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
      {
        id: "satellite",
        name: "Esri Satellite",
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
        data: '', // Akan di-inject dari context RT
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
    ],
  },
  {
    id: "infrastruktur",
    name: "Infrastruktur Persampahan",
    data: '',
    layers: [
      {
        id: "tps",
        name: "TPS",
        type: "geojson",
        data: '', // Akan di-inject dari context Persampahan
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
      {
        id: "bank_sampah",
        name: "Bank Sampah",
        type: "geojson",
        url: "/data-map/bank_sampah.geojson",
        visible: false,
        opacity: 1,
        group: "infrastruktur",
        style: {
          color: "#008000",
          weight: 2,
          opacity: 1,
          fillColor: "#008000",
          fillOpacity: 0.5,
        },
      },
      {
        id: "komposting",
        name: "Rumah Kompos",
        type: "geojson",
        url: "/data-map/komposting.geojson",
        visible: false,
        opacity: 1,
        group: "infrastruktur",
        style: {
          color: "#8B4513", // Warna coklat untuk komposting
          weight: 2,
          opacity: 1,
          fillColor: "#8B4513",
          fillOpacity: 0.5,
        },
      },
    ],
  },
  {
    id: "toponimi",
    name: "Toponimi",
    data: '',
    layers: [
      {
        id: "label-kelurahan",
        name: "Nama Kelurahan",
        type: "label",
        sourceLayer: "batas-kelurahan",
        labelProperty: "KELURAHAN",
        visible: false,
        opacity: 1,
        group: "toponimi",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "#000000",
          textShadow: "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff"
        },
      },
      {
        id: "label-rt",
        name: "Label RT",
        type: "label",
        sourceLayer: "batas-rt",
        labelProperty: "Nama_RT",
        visible: false,
        opacity: 1,
        group: "toponimi",
        style: {
          fontSize: "10px",
          fontWeight: "normal",
          color: "#000000",
          textShadow: "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff"
        },
      },
    ],
  },
];

const DEFAULT_CENTER: [number, number] = [-3.3147, 114.5905]; // Banjarmasin
const DEFAULT_ZOOM = 12;

// Styling for z-index toast dan geocoder agar tidak tertindih tombol
const toastStyles = `
  .toast-container {
    z-index: 10000 !important;
  }
  [role="status"].toast {
    z-index: 10001 !important;
  }
  /* Atur posisi dan margin geocoder agar tidak tertindih tombol */
  .leaflet-control-geocoder {
    margin-top: 10px !important;
    max-width: 320px;
  }
  .leaflet-control-geocoder-form input {
    min-width: 180px;
  }
  /* Remove background from custom label icons */
  .custom-label-icon > div {
    background: transparent !important;
    padding: 0 !important;
    border-radius: 0 !important;
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
  const { toast } = useToast();
  const { kelurahanFeatures, loading: kelurahanLoading } = useKelurahanData();
  const { rtFeatures, loading: rtLoading, loadRTData } = useRTData();
  const { persampahanData, bankSampahData, kompostingData, loading: persampahanLoading } = usePersampahanData();

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

  // Trigger loadRTData only when RT layer is activated
  useEffect(() => {
    if (batasRTLayerActive) {
      loadRTData();
    }
  }, [batasRTLayerActive, loadRTData]);

  // Filter RT jika layer aktif dan kelurahan dipilih
  useEffect(() => {
    if (!batasRTLayerActive || !selectedKelurahan) {
      setRtList([]);
      return;
    }
    if (rtLoading) {
      setRtList([]);
      return;
    }
    // Filter RT dari context berdasarkan kelurahan yang dipilih - fix type casting
    const filtered = rtFeatures.filter((f: any) => f.properties.KEL === selectedKelurahan);
    const uniqueRTs = Array.from(new Set(filtered.map((f: any) => f.properties.Nama_RT)))
      .sort((a, b) => parseInt(a) - parseInt(b));
    setRtList(uniqueRTs);
  }, [selectedKelurahan, batasRTLayerActive, rtFeatures, rtLoading]);

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
    // Reset filter state
    setSelectedKecamatan(null);
    setSelectedKelurahan(null);
    setSelectedRT(null);
    // Jangan matikan layer RT, biarkan tetap aktif jika sebelumnya aktif
    toast({
      title: 'Filter direset',
      description: 'Semua filter telah dihapus',
    });
  };

  // Check if RT layer is active whenever layerGroups change
  useEffect(() => {
    // Find the RT layer in the layerGroups
    const rtLayer = mapState.layerGroups
      .flatMap(group => group.layers)
      .find(layer => layer.id === 'batas-rt');
    
    // Update batasRTLayerActive state based on whether the RT layer exists and is visible
    if (rtLayer) {
      setBatasRTLayerActive(rtLayer.visible);
    } else {
      setBatasRTLayerActive(false);
    }
  }, [mapState.layerGroups]);

  // Filtering data kelurahan/RT untuk layer peta:
  const filteredKelurahanFeatures = selectedKecamatan || selectedKelurahan
    ? kelurahanFeatures.filter(f =>
        (!selectedKecamatan || f.properties.KECAMATAN === selectedKecamatan) &&
        (!selectedKelurahan || f.properties.KELURAHAN === selectedKelurahan)
      )
    : kelurahanFeatures;

  // Untuk layer RT: fetch & filter di komponen layer peta, gunakan selectedKelurahan & selectedRT

  // Update layer RT data from context before rendering
  useEffect(() => {
    if (rtFeatures.length > 0) {
      setMapState(prev => {
        const updatedGroups = prev.layerGroups.map(group => ({
          ...group,
          layers: group.layers.map(layer => {
            if (layer.id === 'batas-rt') {
              return {
                ...layer,
                data: JSON.stringify({
                  type: 'FeatureCollection',
                  features: rtFeatures
                })
              };
            }
            return layer;
          })
        }));
        
        return {
          ...prev,
          layerGroups: updatedGroups
        };
      });
    }
  }, [rtFeatures]);

  // Inject data persampahan dari context
  useEffect(() => {
    if (!persampahanLoading && persampahanData) {
      setMapState(prev => {
        const newLayerGroups = prev.layerGroups.map(group => {
          if (group.id !== 'infrastruktur') return group;
          return {
            ...group,
            layers: group.layers.map(layer => {
              if (layer.id !== 'tps') return layer;
              // inject data dari context, hapus url
              return {
                ...layer,
                url: undefined,
                data: JSON.stringify(persampahanData)
              };
            })
          };
        });
        return { ...prev, layerGroups: newLayerGroups };
      });
    }
  }, [persampahanLoading, persampahanData]);

  // Inject data bank sampah dari context
  useEffect(() => {
    if (!persampahanLoading && bankSampahData) {
      setMapState(prev => {
        const newLayerGroups = prev.layerGroups.map(group => {
          if (group.id !== 'infrastruktur') return group;
          return {
            ...group,
            layers: group.layers.map(layer => {
              if (layer.id !== 'bank_sampah') return layer;
              // inject data dari context, hapus url
              return {
                ...layer,
                url: undefined,
                data: JSON.stringify(bankSampahData)
              };
            })
          };
        });
        return { ...prev, layerGroups: newLayerGroups };
      });
    }
  }, [persampahanLoading, bankSampahData]);

  // Inject data komposting dari context
  useEffect(() => {
    if (!persampahanLoading && kompostingData) {
      setMapState(prev => {
        const newLayerGroups = prev.layerGroups.map(group => {
          if (group.id !== 'infrastruktur') return group;
          return {
            ...group,
            layers: group.layers.map(layer => {
              if (layer.id !== 'komposting') return layer;
              // inject data dari context, hapus url
              return {
                ...layer,
                url: undefined,
                data: JSON.stringify(kompostingData)
              };
            })
          };
        });
        return { ...prev, layerGroups: newLayerGroups };
      });
    }
  }, [persampahanLoading, kompostingData]);

  // Apply toast styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = toastStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Simpan map instance
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Inisialisasi plugin geocoder setelah map instance didapat
  const handleMapCreated = (map: L.Map) => {
    mapInstanceRef.current = map;
    // Cegah penambahan ganda
    if (!(map as any)._geocoderControl && (L as any).Control && (L as any).Control.Geocoder) {
      const geocoder = (L as any).Control.Geocoder.nominatim();
      const geocoderControl = (L as any).Control.geocoder({
        defaultMarkGeocode: true,
        geocoder,
        position: 'topleft',
      }).addTo(map);
      (map as any)._geocoderControl = geocoderControl;
    }
  };

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

    // Update batasRTLayerActive state when the RT layer visibility changes
    if (layerId === 'batas-rt') {
      handleToggleBatasRTLayer(!batasRTLayerActive);
    }
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

  useEffect(() => {
    if (!window.L || !window.L.Control || !window.L.Control.Geocoder) {
      // Inisialisasi plugin jika belum
      if (L && (LControlGeocoder as any).Geocoder) {
        (L as any).Control.Geocoder = (LControlGeocoder as any).Geocoder;
      }
    }
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

  return (
    <div className="relative h-full w-full">
      <style>{toastStyles}</style>
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
    </div>
  );
};

export default MapContainer;
