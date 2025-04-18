
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useMapLayers } from './hooks/useMapLayers';
import { useFileUpload } from './hooks/useFileUpload';
import MapControls from './MapControls';
import { LayerGroup } from './types';

interface MapContentProps {
  onFileUpload: (file: File) => void;
  layerGroups: LayerGroup[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  isLayerPanelOpen: boolean;
  onLayerPanelToggle: () => void;
  onRemoveUploadedLayer: (layerId: string) => void;
}

const MapContent = ({
  onFileUpload,
  layerGroups,
  onLayerToggle,
  onLayerOpacityChange,
  isLayerPanelOpen,
  onLayerPanelToggle,
  onRemoveUploadedLayer
}: MapContentProps) => {
  const map = useMap();
  const { initialized, updateLayerVisibility, updateLayerOpacity } = useMapLayers(
    map,
    layerGroups.flatMap(group => group.layers)
  );
  const handleFileUpload = useFileUpload(map, onFileUpload);

  // Effect for applying visibility and opacity
  useEffect(() => {
    if (!initialized) return;
    
    setTimeout(() => {
      layerGroups.forEach(group => {
        group.layers.forEach(layer => {
          updateLayerVisibility(layer.id, layer.visible);
          updateLayerOpacity(layer.id, layer.opacity);
        });
      });
    }, 100);
  }, [layerGroups, initialized, updateLayerVisibility, updateLayerOpacity]);

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

export default MapContent;
