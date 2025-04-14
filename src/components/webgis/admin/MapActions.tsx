
import { 
  Layers, 
  Filter as FilterIcon, 
  Search as SearchIcon, 
  LayoutPanelLeft, 
  Maximize2, 
  Minimize2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LayerType } from "@/components/webgis/data/mock-map-data";

interface MapActionsProps {
  isLayersPanelOpen: boolean;
  setIsLayersPanelOpen: (value: boolean) => void;
  isFilterPanelOpen: boolean;
  setIsFilterPanelOpen: (value: boolean) => void;
  isSearchPanelOpen: boolean;
  setIsSearchPanelOpen: (value: boolean) => void;
  splitViewEnabled: boolean;
  setSplitViewEnabled: (value: boolean) => void;
  fullscreenMode: boolean;
  setFullscreenMode: (value: boolean) => void;
}

const MapActions = ({
  isLayersPanelOpen,
  setIsLayersPanelOpen,
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  isSearchPanelOpen,
  setIsSearchPanelOpen,
  splitViewEnabled,
  setSplitViewEnabled,
  fullscreenMode,
  setFullscreenMode
}: MapActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700"
        onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
      >
        <Layers className="h-4 w-4 mr-2" />
        Layer
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700"
        onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
      >
        <FilterIcon className="h-4 w-4 mr-2" />
        Filter
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700"
        onClick={() => setIsSearchPanelOpen(!isSearchPanelOpen)}
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        Cari
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700"
        onClick={() => setSplitViewEnabled(!splitViewEnabled)}
      >
        <LayoutPanelLeft className="h-4 w-4 mr-2" />
        {splitViewEnabled ? "Single View" : "Split View"}
      </Button>
      <Button
        variant="outline" 
        size="sm" 
        className="flex items-center bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700"
        onClick={() => setFullscreenMode(!fullscreenMode)}
      >
        {fullscreenMode ? (
          <><Minimize2 className="h-4 w-4 mr-2" />Keluar Fullscreen</>
        ) : (
          <><Maximize2 className="h-4 w-4 mr-2" />Fullscreen</>
        )}
      </Button>
    </div>
  );
};

export default MapActions;
