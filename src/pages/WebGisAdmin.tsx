
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
  LayoutSplit,
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

  // Close all panels when switching to fullscreen mode
  useEffect(() => {
    if (fullscreenMode) {
      setIsLayersPanelOpen(false);
      setIsFilterPanelOpen(false);
      setIsSearchPanelOpen(false);
    }
  }, [fullscreenMode]);

  // Handle layer toggle
  const handleLayerToggle = (layer: LayerType) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter(l => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
  };

  // Handle location select from search
  const handleLocationSelect = (coordinates: [number, number]) => {
    // In an actual implementation, this would pan the map to the coordinates
    console.log("Selected location coordinates:", coordinates);
  };

  // Handle applying filters
  const handleFilterApply = (filters: any) => {
    console.log("Applied filters:", filters);
    // In a real application, we would filter the map data here
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">WebGIS Interaktif</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Visualisasi data spasial pengelolaan sampah di Banjarmasin
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={currentTab === "view" ? "default" : "outline"} 
              className="flex items-center"
              onClick={() => setCurrentTab("view")}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Peta
            </Button>
            <Button 
              variant={currentTab === "stats" ? "default" : "outline"} 
              className="flex items-center"
              onClick={() => setCurrentTab("stats")}
            >
              <Info className="h-4 w-4 mr-2" />
              Statistik
            </Button>
            <Button 
              variant={currentTab === "data" ? "default" : "outline"} 
              className="flex items-center"
              onClick={() => setCurrentTab("data")}
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Data
            </Button>
          </div>
        </div>
        
        <TabsContent value="view" className={`mt-0 ${currentTab === "view" ? "" : "hidden"}`}>
          <Card className="border">
            <CardHeader className="p-4 border-b bg-muted/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
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
                    <LayoutSplit className="h-4 w-4 mr-2" />
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
            <CardContent className={`p-0 relative ${fullscreenMode ? 'fixed inset-0 z-50 bg-background' : 'h-[600px]'}`}>
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
        
        <TabsContent value="stats" className={`mt-0 ${currentTab === "stats" ? "" : "hidden"}`}>
          <Card>
            <CardHeader>
              <CardTitle>Statistik Pengelolaan Sampah</CardTitle>
            </CardHeader>
            <CardContent>
              <StatisticsPanel />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className={`mt-0 ${currentTab === "data" ? "" : "hidden"}`}>
          <Card>
            <CardHeader>
              <CardTitle>Data Pengelolaan Sampah</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable />
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </DashboardLayout>
  );
};

export default WebGisAdmin;
