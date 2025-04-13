
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
  AlertCircle,
  Bell,
  RefreshCw,
  Clock,
  BarChart4,
  PieChart,
  Database,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LayersPanel from "@/components/webgis/LayersPanel";
import MapView, { LayerType } from "@/components/webgis/MapView";
import DataTable from "@/components/webgis/DataTable";
import StatisticsPanel from "@/components/webgis/StatisticsPanel";
import FilterPanel from "@/components/webgis/FilterPanel";
import SearchPanel from "@/components/webgis/SearchPanel";
import { useToast } from "@/hooks/use-toast";

// Mock alerts for the command center
const mockAlerts = [
  { id: 1, type: "warning", message: "TPS Pasar Lama hampir penuh (85%)", time: "14:30" },
  { id: 2, type: "danger", message: "TPS Liar baru terdeteksi di Jalan Belitung", time: "13:45" },
  { id: 3, type: "info", message: "Jadwal pengangkutan sampah telah diperbarui", time: "12:20" },
];

// Mock stats for dashboard
const mockDashboardStats = {
  collectionToday: "32.5 ton",
  capacityUsage: "68%",
  activeCollectionPoints: 24,
  wasteProcessed: "128.3 ton",
  routesActive: 8,
  staffOnDuty: 42,
};

const WebGisAdmin = () => {
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState<LayerType[]>(['tps', 'tps-liar', 'bank-sampah', 'tps3r']);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [splitViewEnabled, setSplitViewEnabled] = useState(false);
  const [currentTab, setCurrentTab] = useState("view");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data diperbarui",
        description: "Dashboard telah diperbarui dengan data terbaru",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Command Center Header */}
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
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Live alerts ticker */}
          <div className="bg-slate-800 border-t border-slate-700 py-1 px-4 flex items-center overflow-hidden">
            
            <div className="overflow-hidden whitespace-nowrap animate-marquee">
              {mockAlerts.map((alert) => (
                <span key={alert.id} className="mx-4 text-sm">
                  <span className="text-slate-400">{alert.time}</span> • {alert.message}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pengumpulan Hari Ini</p>
                  <p className="text-2xl font-bold">{mockDashboardStats.collectionToday}</p>
                </div>
                <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <BarChart4 className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Kapasitas Terpakai</p>
                  <p className="text-2xl font-bold">{mockDashboardStats.capacityUsage}</p>
                </div>
                <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Titik Pengumpulan</p>
                  <p className="text-2xl font-bold">{mockDashboardStats.activeCollectionPoints}</p>
                </div>
                <div className="h-10 w-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Sampah Diproses</p>
                  <p className="text-2xl font-bold">{mockDashboardStats.wasteProcessed}</p>
                </div>
                <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Database className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-200/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Rute Aktif</p>
                  <p className="text-2xl font-bold">{mockDashboardStats.routesActive}</p>
                </div>
                <div className="h-10 w-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Layers className="h-5 w-5 text-cyan-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Petugas Bertugas</p>
                  <p className="text-2xl font-bold">{mockDashboardStats.staffOnDuty}</p>
                </div>
                <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="view" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="w-full grid grid-cols-3 lg:w-auto lg:inline-flex border border-border bg-slate-800/50">
            <TabsTrigger value="view" className="data-[state=active]:bg-blue-600">
              <MapPin className="h-4 w-4 mr-2" />
              Peta
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-blue-600">
              <Info className="h-4 w-4 mr-2" />
              Statistik
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-blue-600">
              <TableIcon className="h-4 w-4 mr-2" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view">
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
            <Card className="border border-border bg-gradient-to-b from-slate-800/5 to-slate-900/10">
              <CardHeader className="border-b bg-muted/50 p-4">
                <CardTitle className="flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-blue-500" />
                  Statistik & Analitik Pengelolaan Sampah
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-x-auto p-4">
                <StatisticsPanel />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="border border-border bg-gradient-to-b from-slate-800/5 to-slate-900/10">
              <CardHeader className="border-b bg-muted/50 p-4">
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-500" />
                  Database Pengelolaan Sampah
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-4">
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
