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
  // PATCH: Kirim filter ke useMapLayers agar fitur terfilter
  const { initialized, updateLayerVisibility, updateLayerOpacity } = useMapLayers(
    map,
    layerGroups.flatMap(group => group.layers),
    { selectedKecamatan, selectedKelurahan, selectedRT }
  );
  // handleFileUpload siap dipass ke MapControls (file: File) => void
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
      updateLayerOpacity(layer.id, layer.opacity);
    });
  }, [layerGroups, initialized, updateLayerVisibility, updateLayerOpacity]);

  useEffect(() => {
    console.log('LayerGroups di MapContent:', layerGroups);
  }, [layerGroups]);

  useEffect(() => {
    const currentMap = map;
    return () => {
      if (currentMap && typeof currentMap.off === 'function') {
        // Remove any event listeners added in MapContent
        // Example: currentMap.off('some-event', handler)
      }
    };
  }, [map]);

  return (
    <div className="h-full w-full">
      <MapControls 
        onLayerPanelToggle={onLayerPanelToggle} 
        onFileUpload={(file) => handleFileUpload(file)} 
        isLayerPanelOpen={isLayerPanelOpen}
      />
      {/* Cleanup component to ensure LocateControl is always removed safely */}
      <LocateControlCleanup map={map} />
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