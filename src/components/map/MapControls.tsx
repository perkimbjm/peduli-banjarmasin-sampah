import { useMap } from "react-leaflet";
import { Layers, Upload, Locate, Home, Maximize, Minimize } from "lucide-react";
import MapButton from "@/components/ui/MapButton";
import { useRef, useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet-easybutton";
import "leaflet-omnivore";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet.locatecontrol";
import { LayerConfig } from './types';

const DEFAULT_CENTER: [number, number] = [-3.3147, 114.5905]; // Banjarmasin
const DEFAULT_ZOOM = 12;

interface MapControlsProps {
  onLayerPanelToggle: () => void;
  onFileUpload: (file: File) => void;
  isLayerPanelOpen: boolean;
}

const MapControls = ({ onLayerPanelToggle, onFileUpload, isLayerPanelOpen }: MapControlsProps) => {
  const map = useMap();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleResetView = () => {
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  };

  // Menerapkan fullscreen dan restore style dengan satu fungsi yang bisa digunakan di mana saja
  const applyFullscreenStyles = useCallback((enter: boolean) => {
    const mapContainer = map.getContainer().parentElement;
    if (!mapContainer) return;
    
    if (enter) {
      // Entering fullscreen - save current styles for restoration
      mapContainer.setAttribute('data-original-position', mapContainer.style.position || '');
      mapContainer.setAttribute('data-original-height', mapContainer.style.height || '');
      mapContainer.setAttribute('data-original-width', mapContainer.style.width || '');
      mapContainer.setAttribute('data-original-zindex', mapContainer.style.zIndex || '');
      
      // Apply fullscreen styles
      mapContainer.style.position = 'fixed';
      mapContainer.style.top = '0';
      mapContainer.style.right = '0';
      mapContainer.style.width = '100vw';
      mapContainer.style.height = '100vh';
      mapContainer.style.margin = 'auto';
      mapContainer.style.zIndex = '9999';
      mapContainer.style.background = 'white';
      // Nonaktifkan scrollbar vertikal saat mode fullscreen
      document.body.style.overflow = 'hidden';
      
      if (document.documentElement.classList.contains('dark')) {
        mapContainer.style.background = '#1f2937'; // bg-gray-800
      }
    } else {
      // Exiting fullscreen - restore original styles
      mapContainer.style.position = mapContainer.getAttribute('data-original-position') || '';
      mapContainer.style.height = mapContainer.getAttribute('data-original-height') || '';
      mapContainer.style.width = mapContainer.getAttribute('data-original-width') || '';
      mapContainer.style.zIndex = mapContainer.getAttribute('data-original-zindex') || '';
      mapContainer.style.top = '';
      mapContainer.style.right = '';
      mapContainer.style.margin = '';
      mapContainer.style.background = '';
      // Kembalikan scrollbar
      document.body.style.overflow = '';
    }
    
    // Wait for the DOM to update
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  // Handler untuk tombol Escape
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      console.log('Escape key pressed, exiting fullscreen');
      setIsFullscreen(false);
      applyFullscreenStyles(false);
    }
  }, [isFullscreen, applyFullscreenStyles]);

  // Toggle fullscreen dengan button
  const toggleFullscreen = useCallback(() => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    applyFullscreenStyles(newState);
  }, [isFullscreen, applyFullscreenStyles]);

  // Set up dan clean up event listener untuk Escape key
  useEffect(() => {
    if (isFullscreen) {
      // Jika mode fullscreen aktif, tambahkan event listener
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      // Jika keluar dari mode fullscreen, hapus event listener
      document.removeEventListener('keydown', handleEscapeKey);
    }
    
    // Clean up saat unmount
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullscreen, handleEscapeKey]);

  useEffect(() => {
    const currentMap = map;
  
    // 1. Remove ALL LocateControl DOM elements
    // (Kadang control tetap nempel di DOM walau sudah remove dari map)
    document.querySelectorAll('.leaflet-control-locate').forEach(el => {
      el.parentNode?.removeChild(el);
    });
  
    // 2. Remove ALL LocateControl from Leaflet controls array (defensive)
    if (currentMap && Array.isArray((currentMap as unknown as { _controls?: unknown[] })._controls)) {
      (currentMap as unknown as { _controls?: unknown[] })._controls = (currentMap as unknown as { _controls?: unknown[] })._controls!.filter((ctrl) => {
        if (ctrl && typeof ctrl === 'object' && ctrl.constructor && ctrl.constructor.name === 'Locate') {
          try { (ctrl as { remove: () => void }).remove(); } catch (e) {
            console.warn('Error removing LocateControl:', e);
          }
          return false;
        }
        return true;
      });
    }

    // 3. Remove ALL controls from map that are instance of Locate
    if (currentMap && (currentMap as unknown as { _controlContainer?: unknown })._controlContainer) {
      currentMap.eachLayer(() => {}); // Force Leaflet to update controls
      const controls = (currentMap as unknown as { _controls?: unknown[] })._controls;
      if (controls) {
        for (const ctrl of [...controls]) {
          if (ctrl && typeof ctrl === 'object' && ctrl.constructor && ctrl.constructor.name === 'Locate') {
            try { (currentMap as L.Map & { removeControl: (ctrl: unknown) => void }).removeControl(ctrl); } catch (e) {
              console.warn('Error removing LocateControl:', e);
            }
          }
        }
      }
    }
  
    // 4. Add new LocateControl
    const locateOptions = {
      position: "topleft" as L.ControlPosition,
      strings: { title: "Tampilkan lokasi saya" },
      locateOptions: { maxZoom: 18, enableHighAccuracy: true },
    };
    const locateControl = new L.Control.Locate(locateOptions);
    locateControl.addTo(currentMap);
  
    // Cleanup
    return () => {
      try {
        // Hapus LocateControl jika masih ada dan _map masih ada
        if (locateControl && typeof locateControl.remove === 'function') {
          // Defensive: patch _map to null before remove (workaround bug in leaflet.locatecontrol)
          const lc = locateControl as unknown as { _map?: L.Map | null, remove: () => void };
          if (lc._map) {
            lc._map = null;
          }
          lc.remove();
        }
      } catch (e) {
        // ignore
      }
      // Bersihkan DOM sisa
      document.querySelectorAll('.leaflet-control-locate').forEach(el => {
        el.parentNode?.removeChild(el);
      });
    };
  }, [map]);

  return (
    <div className="leaflet-control-container">
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control space-y-2 bg-white dark:bg-gray-800 rounded-md shadow-md">
          <MapButton
            icon={Layers}
            onClick={onLayerPanelToggle}
            tooltip="Panel Layer"
            active={isLayerPanelOpen}
            data-layer-toggle="true"
          />
          <MapButton
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
            tooltip="Upload Layer"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".geojson,.json,.shp,.zip,.csv,.kml,.gpx"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>
      </div>
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control py-0 space-y-2 bg-white dark:bg-gray-800 rounded-md shadow-md">
          <MapButton
            icon={Home}
            onClick={handleResetView}
            tooltip="Reset View"
          />

          <MapButton
            icon={isFullscreen ? Minimize : Maximize}
            onClick={toggleFullscreen}
            tooltip={isFullscreen ? "Keluar dari Mode Layar Penuh" : "Mode Layar Penuh"}
          />
        </div>
      </div>
    </div>
  );
};

export default MapControls;