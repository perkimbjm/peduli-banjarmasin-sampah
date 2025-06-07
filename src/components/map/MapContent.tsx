import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { useMapLayers } from './hooks/useMapLayers';
import { useFileUpload } from './hooks/useFileUpload';
import MapControls from './MapControls';
import LayerManager from './LayerManager';
import LocateControlCleanup from './LocateControlCleanup';
import { LayerGroup, LayerConfig } from './types';

interface MapContentProps {
  onFileUpload: (file: File, layerConfig: LayerConfig) => void;
  layerGroups: LayerGroup[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  isLayerPanelOpen: boolean;
  onLayerPanelToggle: () => void;
  onRemoveUploadedLayer: (layerId: string) => void;
  selectedKecamatan?: string | null;
  selectedKelurahan?: string | null;
  selectedRT?: string | null;
}

const MapContent = ({
  onFileUpload,
  layerGroups,
  onLayerToggle,
  onLayerOpacityChange,
  isLayerPanelOpen,
  onLayerPanelToggle,
  onRemoveUploadedLayer,
  selectedKecamatan,
  selectedKelurahan,
  selectedRT
}: MapContentProps) => {
  const map = useMap();
  const mapRef = useRef(map);
  const { initialized, updateLayerVisibility, updateLayerOpacity } = useMapLayers(
    map,
    layerGroups.flatMap(group => group.layers),
    { selectedKecamatan, selectedKelurahan, selectedRT }
  );
  const handleFileUpload = useFileUpload(map, onFileUpload);

  useEffect(() => {
    console.log('MapContent: onFileUpload type', typeof onFileUpload);
    console.log('MapContent: MapControls mounted');
  }, [onFileUpload]);

  useEffect(() => {
    if (!initialized) return;

    const layers = layerGroups.flatMap(group => group.layers);
    layers.forEach(layer => {
      updateLayerVisibility(layer.id, layer.visible);
      if (layer.visible) {
        updateLayerOpacity(layer.id, layer.opacity);
      }
    });
  }, [layerGroups, initialized, updateLayerVisibility, updateLayerOpacity]);

  useEffect(() => {
    console.log('LayerGroups di MapContent:', layerGroups);
  }, [layerGroups]);

  useEffect(() => {
    const currentMap = map;
    return () => {
      if (currentMap && typeof currentMap.off === 'function') {
        currentMap.off();
      }
    };
  }, [map]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickOnToggleButton = target.closest('[data-layer-toggle]');
      const isClickInsidePanel = target.closest('[data-layer-panel]');
      
      if (isLayerPanelOpen && !isClickInsidePanel && !isClickOnToggleButton) {
        onLayerPanelToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLayerPanelOpen, onLayerPanelToggle]);

  return (
    <div className="h-full w-full">
      <MapControls 
        onLayerPanelToggle={onLayerPanelToggle} 
        onFileUpload={(file) => handleFileUpload(file)} 
        isLayerPanelOpen={isLayerPanelOpen}
        data-layer-toggle="true"
      />
      <LocateControlCleanup map={map} />
      {isLayerPanelOpen && (
        <div 
          className="absolute top-4 right-4 z-[9999]" 
          data-layer-panel="true"
        >
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