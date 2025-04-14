
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import CommandHeader from "@/components/webgis/admin/CommandHeader";
import AlertsTicker from "@/components/webgis/admin/AlertsTicker";
import DashboardStats from "@/components/webgis/admin/DashboardStats";
import DashboardTabs from "@/components/webgis/admin/DashboardTabs";
import { useToast } from "@/hooks/use-toast";
import { LayerType } from "@/components/webgis/data/mock-map-data";

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
  const [activeLayers, setActiveLayers] = useState<LayerType[]>(['tps', 'tps-liar', 'bank-sampah', 'tps3r']);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [currentTab, setCurrentTab] = useState("view");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleLayerToggle = (layer: LayerType) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter(l => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
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
        <CommandHeader
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        
        {/* Live alerts ticker */}
        <AlertsTicker alerts={mockAlerts} />
        
        {/* Dashboard Quick Stats */}
        <DashboardStats stats={mockDashboardStats} />
        
        {/* Main Dashboard Tabs */}
        <DashboardTabs
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          fullscreenMode={fullscreenMode}
          setFullscreenMode={setFullscreenMode}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
    </DashboardLayout>
  );
};

export default WebGisAdmin;
