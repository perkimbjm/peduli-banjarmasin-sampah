
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Table } from "lucide-react";

interface ViewToggleProps {
  viewMode: 'map' | 'table';
  setViewMode: (mode: 'map' | 'table') => void;
}


const ViewToggle = ({ viewMode, setViewMode }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === 'map' ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode('map')}
      >
        <MapIcon className="h-4 w-4 mr-2" />
        Peta
      </Button>
      <Button
        variant={viewMode === 'table' ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode('table')}
      >
        <Table className="h-4 w-4 mr-2" />
        Tabel
      </Button>
    </div>
  );
};

export default ViewToggle;
