
import { useState } from 'react';
import { PageHeader } from "@/components/monitoring-sumber/PageHeader";
import { FilterCard } from "@/components/monitoring-sumber/FilterCard";
import { ViewToggle } from "@/components/monitoring-sumber/ViewToggle";
import MapView from "@/components/webgis/MapView";
import { LayerType } from "@/components/webgis/data/mock-map-data";
import { DataTable } from "@/components/monitoring-sumber/DataTable";
import { useWasteSourceData } from '@/hooks/useWasteSourceData';

const MonitoringSumberSampah = () => {
  const [activeLayers, setActiveLayers] = useState<LayerType[]>(['tps', 'tps-liar']);
  const [view, setView] = useState<'map' | 'table'>('map');
  const { data, isLoading, filters, setFilters } = useWasteSourceData();

  const handleLayerToggle = (layer: LayerType) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter(l => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      <PageHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterCard 
            filters={filters}
            setFilters={setFilters}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Data Sumber Sampah</h3>
            <ViewToggle currentView={view} onViewChange={setView} />
          </div>
          
          {view === 'map' ? (
            <MapView 
              activeLayers={activeLayers}
              fullscreenMode={false}
              splitViewEnabled={false}
            />
          ) : (
            <DataTable data={data} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringSumberSampah;
