
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Maximize2 } from 'lucide-react';

interface MapControlsProps {
  zoomLevel: number;
  onResetView: () => void;
  onScreenshot: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  zoomLevel, 
  onResetView,
  onScreenshot 
}) => {
  return (
    <>
      {/* Map Controls */}
      <div className="absolute top-12 right-4 flex flex-col gap-2 z-10">
        <div className="bg-white/90 dark:bg-slate-800/90 rounded-md shadow-md border border-gray-200 dark:border-gray-700 p-1 backdrop-blur-sm">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={onResetView}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Zoom Level Indicator */}
      <div className="absolute bottom-12 right-4 bg-white/90 dark:bg-slate-800/90 py-1 px-3 rounded shadow text-xs font-mono border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        Zoom: {zoomLevel}x
      </div>
      
      {/* Screenshot button */}
      <div className="absolute bottom-4 right-20 flex gap-2">
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-white/90 hover:bg-white shadow-md text-xs h-7 px-2 flex items-center gap-1"
          onClick={onScreenshot}
        >
          <Download className="h-3 w-3" />
          Screenshot
        </Button>
      </div>
    </>
  );
};

export default MapControls;
