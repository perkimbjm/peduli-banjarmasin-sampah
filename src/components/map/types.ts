
export interface LayerConfig {
  id: string;
  name: string;
  type: 'geojson' | 'marker' | 'shapefile' | 'tile' | 'label';
  url?: string;
  visible: boolean;
  data?: string;
  opacity: number;
  group: string;
  style?: LayerStyle | LayerStyleFunction;
  attribution?: string;
  sourceLayer?: string;
  labelProperty?: string;
}

// Separate interfaces for static and function styles
export interface LayerStyle {
  color?: string;
  weight?: number;
  opacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  fontSize?: string;
  fontWeight?: string;
  textShadow?: string;
}

export interface LayerStyleFunction {
  (feature: GeoJSON.Feature): {
    color?: string;
    weight?: number;
    opacity?: number;
    fillColor?: string;
    fillOpacity?: number;
  };
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

export interface LayerInstances {
  [key: string]: L.Layer;
}

// Consistent RT Feature interface
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

declare global {
  interface Window {
    mapLayers?: LayerInstances;
  }
}
