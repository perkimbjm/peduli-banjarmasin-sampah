import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useMapLayers } from './hooks/useMapLayers';
import { useFileUpload } from './hooks/useFileUpload';
import MapControls from './MapControls';
import LayerManager from './LayerManager';
import { LayerGroup, LayerConfig } from './types';

interface MapContentProps {
  onFileUpload: (file: File, layerConfig: LayerConfig) => void;
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
  // handleFileUpload siap dipass ke MapControls (file: File) => void
  const handleFileUpload = useFileUpload(map, onFileUpload);

  useEffect(() => {
    console.log('MapContent: onFileUpload type', typeof onFileUpload);
  }, [onFileUpload]);

  useEffect(() => {
    if (!initialized) return;

    const layers = layerGroups.flatMap(group => group.layers);
    layers.forEach(layer => {
      updateLayerVisibility(layer.id, layer.visible);
      updateLayerOpacity(layer.id, layer.opacity);
    });
  }, [layerGroups, initialized, updateLayerVisibility, updateLayerOpacity]);

  useEffect(() => {
    console.log('LayerGroups di MapContent:', layerGroups);
  }, [layerGroups]);

  return (
    <div className="h-full w-full">
      <MapControls 
        onLayerPanelToggle={onLayerPanelToggle} 
        onFileUpload={handleFileUpload}
        isLayerPanelOpen={isLayerPanelOpen}
      />
      {isLayerPanelOpen && (
        <div className="absolute top-4 right-4 z-[1000]">
          <LayerManager
            layerGroups={layerGroups}
            onLayerToggle={onLayerToggle}
            onLayerOpacityChange={onLayerOpacityChange}
            onRemoveUploadedLayer={onRemoveUploadedLayer}
          />
        </div>
      )}
    </div>
  );
};

export default MapContent;