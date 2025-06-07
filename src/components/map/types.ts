
import { LucideIcon } from 'lucide-react';

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

export interface LayerConfig {
  id: string;
  name: string;
  type: 'geojson' | 'tile' | 'label';
  url?: string;
  data?: string;
  visible: boolean;
  opacity: number;
  style?: LayerStyle | ((feature: any) => LayerStyle);
  attribution?: string;
  sourceLayer?: string;
  labelProperty?: string;
  group?: string; // Add group property
}

export interface LayerGroup {
  id: string;
  name: string;
  data?: string; // Add data property
  layers: LayerConfig[];
}

export interface MapState {
  center: [number, number];
  zoom: number;
  basemap: string; // Add basemap property
  layerGroups: LayerGroup[]; // Add layerGroups property
  activeLayers: string[]; // Add activeLayers property
}

export interface SearchResult {
  id: string;
  name: string;
  coordinates: [number, number];
  type: string;
}

export interface FilterState {
  kecamatan: string | null;
  kelurahan: string | null;
  rt: string | null;
  category: string | null;
}

export interface MapControlsProps {
  onExportPNG: () => void;
  onExportCSV: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export interface StatisticsData {
  totalFeatures: number;
  categories: { [key: string]: number };
  coverage: number;
}
