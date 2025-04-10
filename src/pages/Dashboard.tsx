import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Activity, Layers, Map, Users, FileBarChart, PieChart, Truck, Building } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Mock data for the charts
const dailyWasteData = [
  { day: 'Senin', volume: 250 },
  { day: 'Selasa', volume: 320 },
  { day: 'Rabu', volume: 280 },
  { day: 'Kamis', volume: 300 },
  { day: 'Jumat', volume: 350 },
  { day: 'Sabtu', volume: 400 },
  { day: 'Minggu', volume: 270 }
];

const wasteCompositionData = [
  { name: 'Organik', value: 40 },
  { name: 'Plastik', value: 25 },
  { name: 'Kertas', value: 15 },
  { name: 'Kaca', value: 10 },
  { name: 'Logam', value: 5 },
  { name: 'Lainnya', value: 5 }
];

const wasteSourceData = [
  { name: 'Rumah Tangga', value: 60 },
  { name: 'Komersial', value: 20 },
  { name: 'Industri', value: 10 },
  { name: 'Fasilitas Umum', value: 10 }
];

const collectionStatusData = [
  { name: 'Terkumpul', value: 75 },
  { name: 'Belum Terkumpul', value: 25 }
];

const processingCapacityData = [
  { location: 'TPS A', capacity: 200, used: 180 },
  { location: 'TPS B', capacity: 150, used: 120 },
  { location: 'TPS C', capacity: 300, used: 250 },
  { location: 'TPS D', capacity: 250, used: 200 },
  { location: 'TPS E', capacity: 180, used: 170 }
];

const wasteTrendData = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(0, i).toLocaleString('id-ID', { month: 'short' });
  return {
    month,
    waste: Math.floor(Math.random() * 200) + 150,
    growth: Math.floor(Math.random() * 20) - 5
  };
});

const wasteManagementComparisonData = [
  { month: 'Jan', waste: 400, capacity: 500 },
  { month: 'Feb', waste: 450, capacity: 500 },
  { month: 'Mar', waste: 420, capacity: 500 },
  { month: 'Apr', waste: 470, capacity: 500 },
  { month: 'Mei', waste: 450, capacity: 550 },
  { month: 'Jun', waste: 480, capacity: 550 },
  { month: 'Jul', waste: 500, capacity: 550 },
  { month: 'Agt', waste: 520, capacity: 550 },
  { month: 'Sep', waste: 510, capacity: 600 },
  { month: 'Okt', waste: 530, capacity: 600 },
  { month: 'Nov', waste: 550, capacity: 600 },
  { month: 'Des', waste: 570, capacity: 600 }
];

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const { userRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Ringkasan data pengelolaan sampah
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Tabs defaultValue="week" value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList>
                <TabsTrigger value="day">Hari</TabsTrigger>
                <TabsTrigger value="week">Minggu</TabsTrigger>
                <TabsTrigger value="month">Bulan</TabsTrigger>
                <TabsTrigger value="year">Tahun</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline">
              <FileBarChart className="mr-2 h-4 w-4" />
              Ekspor Data
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume Sampah</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,500 kg</div>
              <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lokasi TPS</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 lokasi baru</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jenis Sampah</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">5 dapat didaur ulang</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Relawan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">+10% dari bulan lalu</p>
            </CardContent>
          </Card>
        </div>

        {/* Volume sampah harian & Komposisi sampah */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Volume Sampah Harian
              </CardTitle>
              <CardDescription>
                Data volume sampah dalam 7 hari terakhir (kg)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <BarChart width={500} height={300} data={dailyWasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="volume" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Komposisi Sampah
              </CardTitle>
              <CardDescription>
                Berdasarkan jenis sampah yang dikumpulkan (%)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <RechartsPieChart width={500} height={300}>
                  <Pie
                    data={wasteCompositionData}
                    cx={250}
                    cy={150}
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {wasteCompositionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Legend />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sumber timbulan sampah & Status pengumpulan */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Sumber Timbulan Sampah
              </CardTitle>
              <CardDescription>
                Berdasarkan sumber penghasil sampah (%)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <RechartsPieChart width={500} height={300}>
                  <Pie
                    data={wasteSourceData}
                    cx={250}
                    cy={150}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {wasteSourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Legend />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Status Pengumpulan
              </CardTitle>
              <CardDescription>
                Persentase sampah terkumpul vs belum terkumpul
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <RechartsPieChart width={500} height={300}>
                  <Pie
                    data={collectionStatusData}
                    cx={250}
                    cy={150}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Legend />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Kapasitas pengolahan & Tren pertumbuhan */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Kapasitas Pengolahan per Lokasi
              </CardTitle>
              <CardDescription>
                Perbandingan kapasitas dan penggunaan (kg)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <BarChart width={500} height={300} data={processingCapacityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="location" type="category" width={80} />
                  <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Legend />
                  <Bar dataKey="capacity" fill="#8884d8" name="Kapasitas" />
                  <Bar dataKey="used" fill="#82ca9d" name="Terpakai" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Tren Pertumbuhan Sampah
              </CardTitle>
              <CardDescription>
                Tren volume sampah dalam 12 bulan terakhir
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <AreaChart width={500} height={300} data={wasteTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                  <Area type="monotone" dataKey="waste" stroke="#10B981" fill="#10B98180" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Perbandingan sampah vs kapasitas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              Perbandingan Sampah vs Kapasitas Pengelolaan
            </CardTitle>
            <CardDescription>
              Data volume sampah dan kapasitas pengelolaan dalam 12 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{}}>
              <LineChart width={800} height={300} data={wasteManagementComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                <Legend />
                <Line type="monotone" dataKey="waste" stroke="#EF4444" name="Volume Sampah" strokeWidth={2} />
                <Line type="monotone" dataKey="capacity" stroke="#10B981" name="Kapasitas Pengelolaan" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
