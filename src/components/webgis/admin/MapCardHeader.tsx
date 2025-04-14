
import { Layers } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import MapActions from "./MapActions";

interface MapCardHeaderProps {
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

const MapCardHeader = ({
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
}: MapCardHeaderProps) => {
  return (
    <div className="p-4 border-b bg-muted/50">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="text-lg flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          Peta Pemantauan Pengelolaan Sampah
        </CardTitle>
        
        <MapActions 
          isLayersPanelOpen={isLayersPanelOpen}
          setIsLayersPanelOpen={setIsLayersPanelOpen}
          isFilterPanelOpen={isFilterPanelOpen}
          setIsFilterPanelOpen={setIsFilterPanelOpen}
          isSearchPanelOpen={isSearchPanelOpen}
          setIsSearchPanelOpen={setIsSearchPanelOpen}
          splitViewEnabled={splitViewEnabled}
          setSplitViewEnabled={setSplitViewEnabled}
          fullscreenMode={fullscreenMode}
          setFullscreenMode={setFullscreenMode}
        />
      </div>
    </div>
  );
};

export default MapCardHeader;
