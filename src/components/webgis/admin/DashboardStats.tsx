
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart4, 
  PieChart, 
  MapPin, 
  Database, 
  Layers,
  Bell
} from "lucide-react";

interface DashboardStatsProps {
  stats: {
    collectionToday: string;
    capacityUsage: string;
    activeCollectionPoints: number;
    wasteProcessed: string;
    routesActive: number;
    staffOnDuty: number;
  }
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pengumpulan Hari Ini</p>
              <p className="text-2xl font-bold">{stats.collectionToday}</p>
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
              <p className="text-2xl font-bold">{stats.capacityUsage}</p>
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
              <p className="text-2xl font-bold">{stats.activeCollectionPoints}</p>
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
              <p className="text-2xl font-bold">{stats.wasteProcessed}</p>
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
              <p className="text-2xl font-bold">{stats.routesActive}</p>
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
              <p className="text-2xl font-bold">{stats.staffOnDuty}</p>
            </div>
            <div className="h-10 w-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
