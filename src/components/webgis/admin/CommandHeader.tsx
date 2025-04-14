
import { Clock, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommandHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const CommandHeader = ({ onRefresh, isRefreshing }: CommandHeaderProps) => {
  return (
    <div className="bg-slate-900 text-white rounded-lg shadow-md border border-slate-700 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <h1 className="text-2xl font-bold tracking-tight">Monitoring Dashboard</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Sistem Informasi Geografis Pengelolaan Sampah Kota Banjarmasin
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="text-right text-sm">
            <div className="text-slate-400">Update Terakhir</div>
            <div className="font-mono font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommandHeader;
