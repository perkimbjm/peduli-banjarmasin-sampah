
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Info, Table as TableIcon, BarChart4, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapContent from "./MapContent";
import DataTable from "@/components/webgis/DataTable";
import StatisticsPanel from "@/components/webgis/StatisticsPanel";
import { LayerType } from "@/components/webgis/data/mock-map-data";

interface DashboardTabsProps {
  activeLayers: LayerType[];
  onLayerToggle: (layer: LayerType) => void;
  fullscreenMode: boolean;
  setFullscreenMode: (value: boolean) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const DashboardTabs = ({
  activeLayers,
  onLayerToggle,
  fullscreenMode,
  setFullscreenMode,
  currentTab,
  setCurrentTab
}: DashboardTabsProps) => {
  return (
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
        <MapContent 
          activeLayers={activeLayers}
          onLayerToggle={onLayerToggle}
          fullscreenMode={fullscreenMode}
          setFullscreenMode={setFullscreenMode}
        />
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
  );
};

export default DashboardTabs;
