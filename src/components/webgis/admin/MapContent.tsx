
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Layers, 
  Filter as FilterIcon, 
  Search as SearchIcon, 
  LayoutPanelLeft, 
  Maximize2, 
  Minimize2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MapView from "@/components/webgis/MapView";
import LayersPanel from "@/components/webgis/LayersPanel";
import FilterPanel from "@/components/webgis/FilterPanel";
import SearchPanel from "@/components/webgis/SearchPanel";
import DataTable from "@/components/webgis/DataTable";
import { LayerType } from "@/components/webgis/data/mock-map-data";

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

  const handleLocationSelect = (coordinates: [number, number]) => {
    console.log("Selected location coordinates:", coordinates);
  };

  const handleFilterApply = (filters: any) => {
    console.log("Applied filters:", filters);
  };

  return (
    <Card className="border border-border bg-gradient-to-b from-slate-800/5 to-slate-900/10">
      <CardHeader className="p-4 border-b bg-muted/50">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            Peta Pemantauan Pengelolaan Sampah
          </CardTitle>
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
        </div>
      </CardHeader>
      <CardContent className={`p-0 relative ${fullscreenMode ? 'fixed inset-0 z-50 bg-background' : 'h-[300px] md:h-[700px]'}`}>
        {fullscreenMode && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-sm p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              WebGIS Command Center (Mode Fullscreen)
            </h3>
            <Button
              variant="outline" 
              size="sm" 
              className="ml-auto bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              onClick={() => setFullscreenMode(false)}
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Keluar Fullscreen
            </Button>
          </div>
        )}
        
        <div className={`flex h-full ${fullscreenMode ? 'pt-16' : ''}`}>
          <MapView 
            activeLayers={activeLayers} 
            fullscreenMode={fullscreenMode} 
            splitViewEnabled={splitViewEnabled}
          />
          
          {splitViewEnabled && (
            <div className={`${fullscreenMode ? 'h-[calc(100vh-4rem)]' : 'h-[700px]'} w-1/2 border-l border-border overflow-auto bg-slate-900/5`}>
              <div className="p-4 bg-slate-900/40 border-b border-border">
                <h3 className="font-semibold text-sm">Data Terperinci</h3>
              </div>
              <div className="p-4">
                <DataTable />
              </div>
            </div>
          )}
          
          {isLayersPanelOpen && (
            <LayersPanel 
              activeLayers={activeLayers} 
              onLayerToggle={onLayerToggle}
              onClose={() => setIsLayersPanelOpen(false)} 
            />
          )}
          
          {isFilterPanelOpen && (
            <FilterPanel 
              onClose={() => setIsFilterPanelOpen(false)}
              onFilterApply={handleFilterApply} 
            />
          )}
          
          {isSearchPanelOpen && (
            <SearchPanel 
              onClose={() => setIsSearchPanelOpen(false)}
              onLocationSelect={handleLocationSelect} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapContent;
