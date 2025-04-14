
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MapHeaderProps {
  activePoints: number;
  lastUpdate: string;
  onRefresh: () => void;
}

const MapHeader: React.FC<MapHeaderProps> = ({ activePoints, lastUpdate, onRefresh }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-sm text-white p-2 text-xs border-b border-slate-700 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="font-medium text-slate-300">
          {activePoints} titik aktif
        </div>
        <div className="text-slate-400">
          Terakhir diperbarui: {lastUpdate}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          className="h-6 text-xs bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
          onClick={onRefresh}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default MapHeader;
