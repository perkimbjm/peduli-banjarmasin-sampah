import { useMap } from "react-leaflet";
import { Layers, Upload, Locate, Home, Maximize, Minimize } from "lucide-react";
import MapButton from "@/components/ui/MapButton";
import { useRef, useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet-easybutton";
import "leaflet-omnivore";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet.locatecontrol";

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
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['geojson', 'json', 'shp', 'zip', 'csv', 'kml', 'gpx'];
      
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        onFileUpload(file);
      } else {
        alert('Format file tidak didukung. Silakan gunakan format: ' + allowedExtensions.join(', '));
      }
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
      console.log('Added Escape key event listener');
    } else {
      // Jika keluar dari mode fullscreen, hapus event listener
      document.removeEventListener('keydown', handleEscapeKey);
      console.log('Removed Escape key event listener');
    }
    
    // Clean up saat unmount
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      console.log('Cleaned up Escape key event listener');
    };
  }, [isFullscreen, handleEscapeKey]);

  useEffect(() => {
    // Initialize controls
    const controls: L.Control[] = [];

    // Locate control dengan ikon untuk mode fullscreen dan bukan fullscreen
    const locateOptions = {
      position: "topleft" as L.ControlPosition,
      strings: {
        title: "Tampilkan lokasi saya",
      },
      locateOptions: {
        maxZoom: 18,
        enableHighAccuracy: true,
      },
    };
    
    const locateControl = new L.Control.Locate(locateOptions);
    locateControl.addTo(map);
    controls.push(locateControl);

    // Cleanup function
    return () => {
      controls.forEach((control) => control.remove());
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
          />
          <MapButton
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
            tooltip="Upload Layer"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".geojson,.json,.shp,.zip,.csv,.kml,.gpx"
            className="hidden"
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