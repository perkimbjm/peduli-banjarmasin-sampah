import { useEffect } from "react";
import L from "leaflet";

interface LocateControlCleanupProps {
  map: L.Map;
}

const LocateControlCleanup = ({ map }: LocateControlCleanupProps) => {
  useEffect(() => {
    return () => {
      // On unmount, remove ALL LocateControl from map
      const controls = (map as unknown as { _controls?: Array<unknown> })._controls;
      if (controls && Array.isArray(controls)) {
        controls.forEach((ctrl) => {
          // Type guard for LocateControl
          if (ctrl && typeof ctrl === 'object' && 'remove' in ctrl && ctrl.constructor && ctrl.constructor.name === 'Locate') {
            try {
              (ctrl as { remove: () => void }).remove();
            } catch (e) {
              console.warn('Error removing LocateControl:', e);
            }
          }
        });
      }
      // Remove all DOM nodes
      document.querySelectorAll('.leaflet-control-locate').forEach(el => el.parentNode?.removeChild(el));
    };
  }, [map]);
  return null;
};

export default LocateControlCleanup;
