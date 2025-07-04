
export interface LayerConfig {
  id: string;
  name: string;
  type: 'geojson' | 'marker' | 'shapefile' | 'tile' | 'label';
  url?: string;
  visible: boolean;
  data?: string; // <-- make optional and for GeoJSON string
  opacity: number;
  group: string;
  style?: {
    color?: string;
    weight?: number;
    opacity?: number;
    fillColor?: string;
    fillOpacity?: number;
    fontSize?: string;
    fontWeight?: string;
    textShadow?: string;
  } | ((feature: GeoJSON.Feature) => {
    color?: string;
    weight?: number;
    opacity?: number;
    fillColor?: string;
    fillOpacity?: number;
  });
  attribution?: string;
  sourceLayer?: string; // Layer ID sumber data (untuk layer label)
  labelProperty?: string; // Properti yang akan digunakan sebagai teks label
}

export interface LayerGroup {
  id: string;
  name: string;
  data: string;
  layers: LayerConfig[];
}

export interface MapState {
  center: [number, number];
  zoom: number;
  activeLayers: string[];
  layerGroups: LayerGroup[];
}

export interface MapControlProps {
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  onFileUpload: (file: File) => void;
} 

// Add the LayerInstances interface
export interface LayerInstances {
  [key: string]: L.Layer;
}

// Define proper GeoJSON types for RT features
export interface RTFeature extends GeoJSON.Feature {
  type: 'Feature';
  properties: {
    KEC: string;
    KEL: string;
    Nama_RT: string;
    Nama_RW: string;
    [key: string]: string | number;
  };
  geometry: GeoJSON.MultiPolygon;
}

// Extend the Window interface to include mapLayers property
declare global {
  interface Window {
    mapLayers?: LayerInstances;
  }
}
