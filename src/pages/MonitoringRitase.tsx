import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Truck, Calendar, FileBarChart, RefreshCw } from "lucide-react";
import { format, subDays } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DateRangePicker } from "@/components/ritase/DateRangePicker";
import { RitaseAreaChart } from "@/components/ritase/RitaseAreaChart";
import { RitaseSummaryCard } from "@/components/ritase/RitaseSummaryCard";

const areas = [
  {
    id: 1,
    name: "Kota Banjarmasin",
    current: 44,
    target: 145,
    percentage: 30.0,
    data: [
      { date: "Apr 01", value: 108 },
      { date: "Apr 02", value: 120 },
      { date: "Apr 03", value: 130 },
      { date: "Apr 04", value: 143 },
      { date: "Apr 05", value: 155 },
      { date: "Apr 06", value: 120 },
    ]
  },
  {
    id: 2,
    name: "Kota Cimahi",
    current: 17,
    target: 20,
    percentage: 85.0,
    data: [
      { date: "Apr 01", value: 15 },
      { date: "Apr 02", value: 19 },
      { date: "Apr 03", value: 19 },
      { date: "Apr 04", value: 16 },
      { date: "Apr 05", value: 17 },
      { date: "Apr 06", value: 18 },
    ]
  },
  {
    id: 3,
    name: "Kabupaten Bandung",
    current: 35,
    target: 40,
    percentage: 86.25,
    data: [
      { date: "Apr 01", value: 28 },
      { date: "Apr 02", value: 36 },
      { date: "Apr 03", value: 42 },
      { date: "Apr 04", value: 31 },
      { date: "Apr 05", value: 45 },
      { date: "Apr 06", value: 31 },
      { date: "Apr 07", value: 35 },
      { date: "Apr 08", value: 54 },
      { date: "Apr 09", value: 72 },
      { date: "Apr 10", value: 36 },
      { date: "Apr 11", value: 34 },
      { date: "Apr 12", value: 35 },
      { date: "Apr 13", value: 30 },
      { date: "Apr 14", value: 33 },
    ]
  },
  {
    id: 4,
    name: "Kabupaten Bandung Barat",
    current: 20,
    target: 17,
    percentage: 114.71,
    data: [
      { date: "Apr 01", value: 8 },
      { date: "Apr 02", value: 7 },
      { date: "Apr 03", value: 11 },
      { date: "Apr 04", value: 18 },
      { date: "Apr 05", value: 13 },
      { date: "Apr 06", value: 18 },
      { date: "Apr 07", value: 20 },
      { date: "Apr 08", value: 21 },
      { date: "Apr 09", value: 25 },
      { date: "Apr 10", value: 20 },
      { date: "Apr 11", value: 23 },
      { date: "Apr 12", value: 20 },
      { date: "Apr 13", value: 15 },
      { date: "Apr 14", value: 12 },
    ]
  }
];

const MonitoringRitase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [includeToday, setIncludeToday] = useState(true);
  const [period, setPeriod] = useState("14days");
  
  const today = new Date();
  const defaultDateFrom = subDays(today, 14);
  const defaultDateTo = today;
  
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    if (range.from) {
      setDateRange({
        from: range.from,
        to: range.to || new Date()
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (period) params.set("period", period);
    if (dateRange.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"));
    params.set("includeToday", includeToday.toString());
    setSearchParams(params);
  }, [period, dateRange, includeToday, setSearchParams]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitoring Ritase</h1>
            <p className="text-muted-foreground">
              Analisis target dan capaian ritase transportasi sampah
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="include-today" checked={includeToday} onCheckedChange={setIncludeToday} />
            <Label htmlFor="include-today">Include today</Label>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-normal text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileBarChart size={18} />
                    <span>Sumber Data: UPTD PSTR. Last Update: {format(today, "yyyy-MM-dd")}</span>
                  </div>
                </CardTitle>
                <DateRangePicker
                  dateRange={dateRange} 
                  onChange={handleDateRangeChange}
                  className="border p-3 rounded-md"
                />
              </div>
            </CardHeader>
          </Card>
          
          <Tabs defaultValue="chart">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="gap-1">
                <RefreshCw size={14} /> Refresh Data
              </Button>
            </div>
            
            <TabsContent value="chart" className="space-y-6">
              {areas.map((area) => (
                <Card key={area.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div className="bg-primary p-2 rounded-md">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl">{area.name}</h3>
                          <p className="text-muted-foreground text-sm">Capaian Ritase vs Target</p>
                        </div>
                      </div>
                      <Badge 
                        variant={area.percentage >= 100 ? "default" : area.percentage >= 70 ? "secondary" : "destructive"}
                        className="ml-auto text-lg h-7 px-3"
                      >
                        {area.current}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="p-6 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className={area.percentage >= 100 ? "text-green-600" : area.percentage >= 70 ? "text-amber-600" : "text-red-600"}>
                            {area.percentage.toFixed(2)}% dari target ritase
                          </p>
                        </div>
                        <p className="text-muted-foreground text-sm">Target: {area.target}</p>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${area.percentage >= 100 ? "bg-green-500" : area.percentage >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${Math.min(area.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="h-64">
                      <RitaseAreaChart data={area.data} target={area.target} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="summary">
              <div className="grid gap-4 md:grid-cols-2">
                {areas.map((area) => (
                  <RitaseSummaryCard key={area.id} area={area} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Ritase adalah istilah yang digunakan dalam industri logistik dan pengangkutan barang di Indonesia untuk menggambarkan proses penjadwalan dan pengkoordinasian rute transportasi serta pengiriman barang
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MonitoringRitase;
