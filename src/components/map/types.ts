
export interface LayerConfig {
  id: string;
  name: string;
  type: 'geojson' | 'marker' | 'shapefile' | 'tile';
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
  };
  attribution?: string;
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

// Extend the Window interface to include mapLayers property
declare global {
  interface Window {
    mapLayers?: LayerInstances;
  }
}
