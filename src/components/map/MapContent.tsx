
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import useMapLayers from './hooks/useMapLayers';
import { useFileUpload } from './hooks/useFileUpload';
import MapControls from './MapControls';
import LayerManager from './LayerManager';
import LocateControlCleanup from './LocateControlCleanup';
import { LayerGroup, LayerConfig } from './types';
import L from 'leaflet';

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
  
  // Use the hook correctly with default export
  useMapLayers(
    map,
    layerGroups,
    selectedKecamatan,
    selectedKelurahan,
    selectedRT
  );
  
  const handleFileUpload = useFileUpload(map, onFileUpload);

  // Initialize geocoder plugin
  useEffect(() => {
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

    return () => {
      // Cleanup geocoder on unmount
      if ((map as any)._geocoderControl) {
        try {
          map.removeControl((map as any)._geocoderControl);
          (map as any)._geocoderControl = null;
        } catch (e) {
          console.warn('Error removing geocoder control:', e);
        }
      }
    };
  }, [map]);

  // Add custom CSS for label styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-label {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      .custom-label .leaflet-div-icon {
        background: transparent !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    console.log('MapContent: onFileUpload type', typeof onFileUpload);
    console.log('MapContent: MapControls mounted');
  }, [onFileUpload]);

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
