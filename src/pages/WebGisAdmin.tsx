import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Layers,
  MapPin,
  Info,
  Filter as FilterIcon,
  Search as SearchIcon,
  Maximize2,
  Minimize2,
  Table as TableIcon,
  LayoutPanelLeft,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LayersPanel from "@/components/webgis/LayersPanel";
import MapView, { LayerType } from "@/components/webgis/MapView";
import DataTable from "@/components/webgis/DataTable";
import StatisticsPanel from "@/components/webgis/StatisticsPanel";
import FilterPanel from "@/components/webgis/FilterPanel";
import SearchPanel from "@/components/webgis/SearchPanel";

const WebGisAdmin = () => {
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState<LayerType[]>(['tps', 'tps-liar', 'bank-sampah', 'tps3r']);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [splitViewEnabled, setSplitViewEnabled] = useState(false);
  const [currentTab, setCurrentTab] = useState("view");

  useEffect(() => {
    if (fullscreenMode) {
      setIsLayersPanelOpen(false);
      setIsFilterPanelOpen(false);
      setIsSearchPanelOpen(false);
    }
  }, [fullscreenMode]);

  const handleLayerToggle = (layer: LayerType) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter(l => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
  };

  const handleLocationSelect = (coordinates: [number, number]) => {
    console.log("Selected location coordinates:", coordinates);
  };

  const handleFilterApply = (filters: any) => {
    console.log("Applied filters:", filters);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">WebGIS Interaktif</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Visualisasi data spasial pengelolaan sampah di Banjarmasin
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="view" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="w-full grid grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="view">
              <MapPin className="h-4 w-4 mr-2" />
              Peta
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Info className="h-4 w-4 mr-2" />
              Statistik
            </TabsTrigger>
            <TabsTrigger value="data">
              <TableIcon className="h-4 w-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <Card className="border">
              <CardHeader className="p-4 border-b bg-muted/50">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <CardTitle className="text-lg">Peta Pengelolaan Sampah</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Layer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    >
                      <FilterIcon className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => setIsSearchPanelOpen(!isSearchPanelOpen)}
                    >
                      <SearchIcon className="h-4 w-4 mr-2" />
                      Cari
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => setSplitViewEnabled(!splitViewEnabled)}
                    >
                      <LayoutPanelLeft className="h-4 w-4 mr-2" />
                      {splitViewEnabled ? "Single View" : "Split View"}
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
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
              <CardContent className={`p-0 relative ${fullscreenMode ? 'fixed inset-0 z-50 bg-background' : 'h-[300px] md:h-[600px]'}`}>
                {fullscreenMode && (
                  <div className="absolute top-0 left-0 right-0 z-10 bg-muted/90 backdrop-blur-sm p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold">WebGIS Pengelolaan Sampah (Mode Fullscreen)</h3>
                    <Button
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
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
                    <div className={`${fullscreenMode ? 'h-[calc(100vh-4rem)]' : 'h-[600px]'} w-1/2 border-l border-border overflow-auto`}>
                      <DataTable />
                    </div>
                  )}
                  
                  {isLayersPanelOpen && (
                    <LayersPanel 
                      activeLayers={activeLayers} 
                      onLayerToggle={handleLayerToggle}
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
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader className="space-y-4 md:space-y-0">
                <CardTitle>Statistik Pengelolaan Sampah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-x-auto">
                <StatisticsPanel />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader className="space-y-4 md:space-y-0">
                <CardTitle>Data Pengelolaan Sampah</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <DataTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WebGisAdmin;
