
import { ReactNode } from 'react';
import MapView from "@/components/webgis/MapView";
import DataTable from "@/components/webgis/DataTable";
import LayersPanel from "@/components/webgis/LayersPanel";
import FilterPanel from "@/components/webgis/FilterPanel";
import SearchPanel from "@/components/webgis/SearchPanel";
import { LayerType } from "@/components/webgis/data/mock-map-data";

interface MapContainerProps {
  activeLayers: LayerType[];
  onLayerToggle: (layer: LayerType) => void;
  fullscreenMode: boolean;
  splitViewEnabled: boolean;
  isLayersPanelOpen: boolean;
  setIsLayersPanelOpen: (value: boolean) => void;
  isFilterPanelOpen: boolean;
  setIsFilterPanelOpen: (value: boolean) => void;
  isSearchPanelOpen: boolean;
  setIsSearchPanelOpen: (value: boolean) => void;
  children?: ReactNode;
}

const MapContainer = ({
  activeLayers,
  onLayerToggle,
  fullscreenMode,
  splitViewEnabled,
  isLayersPanelOpen,
  setIsLayersPanelOpen,
  isFilterPanelOpen,
  setIsFilterPanelOpen,
  isSearchPanelOpen,
  setIsSearchPanelOpen,
  children
}: MapContainerProps) => {
  
  const handleLocationSelect = (coordinates: [number, number]) => {
    console.log("Selected location coordinates:", coordinates);
  };

  const handleFilterApply = (filters: any) => {
    console.log("Applied filters:", filters);
  };

  return (
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
      
      {children}
    </div>
  );
};

export default MapContainer;
