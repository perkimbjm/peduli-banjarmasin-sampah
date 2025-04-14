
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
} from "@/components/ui/card";
import { LayerType } from "@/components/webgis/data/mock-map-data";
import MapCardHeader from "./MapCardHeader";
import FullscreenHeader from "./FullscreenHeader";
import MapContainer from "./MapContainer";

interface MapContentProps {
  activeLayers: LayerType[];
  onLayerToggle: (layer: LayerType) => void;
  fullscreenMode: boolean;
  setFullscreenMode: (value: boolean) => void;
}

const MapContent = ({ 
  activeLayers, 
  onLayerToggle, 
  fullscreenMode, 
  setFullscreenMode 
}: MapContentProps) => {
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [splitViewEnabled, setSplitViewEnabled] = useState(false);

  useEffect(() => {
    if (fullscreenMode) {
      setIsLayersPanelOpen(false);
      setIsFilterPanelOpen(false);
      setIsSearchPanelOpen(false);
    }
  }, [fullscreenMode]);

  return (
    <Card className="border border-border bg-gradient-to-b from-slate-800/5 to-slate-900/10">
      <CardHeader className="p-0 border-b bg-muted/50">
        <MapCardHeader 
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
      </CardHeader>
      <CardContent className={`p-0 relative ${fullscreenMode ? 'fixed inset-0 z-50 bg-background' : 'h-[300px] md:h-[700px]'}`}>
        {fullscreenMode && (
          <FullscreenHeader setFullscreenMode={setFullscreenMode} />
        )}
        
        <MapContainer
          activeLayers={activeLayers}
          onLayerToggle={onLayerToggle}
          fullscreenMode={fullscreenMode}
          splitViewEnabled={splitViewEnabled}
          isLayersPanelOpen={isLayersPanelOpen}
          setIsLayersPanelOpen={setIsLayersPanelOpen}
          isFilterPanelOpen={isFilterPanelOpen}
          setIsFilterPanelOpen={setIsFilterPanelOpen}
          isSearchPanelOpen={isSearchPanelOpen}
          setIsSearchPanelOpen={setIsSearchPanelOpen}
        />
      </CardContent>
    </Card>
  );
};

export default MapContent;
