
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AnalyticsSummaryCards from "@/components/gis-analytics/AnalyticsSummaryCards";
import DistributionCharts from "@/components/gis-analytics/DistributionCharts";
import InteractiveHeatmap from "@/components/gis-analytics/InteractiveHeatmap";
import AnomalyDetection from "@/components/gis-analytics/AnomalyDetection";
import TemporalTrends from "@/components/gis-analytics/TemporalTrends";
import PerformanceScoring from "@/components/gis-analytics/PerformanceScoring";
import ServiceCoverage from "@/components/gis-analytics/ServiceCoverage";
import LayerToggle from "@/components/gis-analytics/LayerToggle";
import ExportTools from "@/components/gis-analytics/ExportTools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GisAnalytics = () => {
  const { userRole } = useAuth();
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [activeLayers, setActiveLayers] = useState<string[]>(['tps', 'waste-banks']);

  // Role-based access control
  const hasFullAccess = ['admin', 'leader', 'stakeholder'].includes(userRole || '');
  const hasLimitedAccess = ['user'].includes(userRole || '');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">GIS Analitik</h1>
            <p className="text-muted-foreground">
              Analisis spasial dan insight berbasis lokasi untuk pengelolaan sampah
            </p>
          </div>
          {hasFullAccess && <ExportTools />}
        </div>

        {/* Summary Cards */}
        <AnalyticsSummaryCards userRole={userRole} />

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="performance">Kinerja</TabsTrigger>
            <TabsTrigger value="coverage">Cakupan</TabsTrigger>
            {hasFullAccess && <TabsTrigger value="anomalies">Anomali</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <DistributionCharts />
              <TemporalTrends />
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <div className="flex justify-between items-center">
              <LayerToggle 
                activeLayers={activeLayers}
                onLayerToggle={(layer) => {
                  setActiveLayers(prev => 
                    prev.includes(layer) 
                      ? prev.filter(l => l !== layer)
                      : [...prev, layer]
                  );
                }}
              />
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map((frame) => (
                  <button
                    key={frame}
                    onClick={() => setTimeFrame(frame)}
                    className={`px-3 py-1 rounded text-sm ${
                      timeFrame === frame 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {frame === 'daily' ? 'Harian' : frame === 'weekly' ? 'Mingguan' : 'Bulanan'}
                  </button>
                ))}
              </div>
            </div>
            <InteractiveHeatmap 
              timeFrame={timeFrame}
              activeLayers={activeLayers}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceScoring userRole={userRole} />
          </TabsContent>

          <TabsContent value="coverage" className="space-y-4">
            <ServiceCoverage />
          </TabsContent>

          {hasFullAccess && (
            <TabsContent value="anomalies" className="space-y-4">
              <AnomalyDetection />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default GisAnalytics;
