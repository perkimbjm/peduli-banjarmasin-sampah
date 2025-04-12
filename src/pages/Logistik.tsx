import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Download, Search, Filter, Truck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for fleet overview
const fleetOverviewData = [
  { name: 'Truk Compactor', total: 15, operational: 12, maintenance: 3 },
  { name: 'Truk Arm Roll', total: 10, operational: 8, maintenance: 2 },
  { name: 'Pick Up', total: 8, operational: 7, maintenance: 1 },
  { name: 'Motor Sampah', total: 25, operational: 22, maintenance: 3 },
];

// Mock data for monthly fleet usage
const monthlyFleetData = [
  { name: 'Jan', trips: 425, tonnage: 850 },
  { name: 'Feb', trips: 440, tonnage: 880 },
  { name: 'Mar', trips: 455, tonnage: 910 },
  { name: 'Apr', trips: 480, tonnage: 960 },
  { name: 'Mei', trips: 465, tonnage: 930 },
  { name: 'Jun', trips: 490, tonnage: 980 },
];

// Mock data for waste collection areas
const wasteTypeDistribution = [
  { name: 'Domestik', value: 65 },
  { name: 'Komersial', value: 20 },
  { name: 'Industri', value: 10 },
  { name: 'Fasilitas Publik', value: 5 },
];

// Mock data for fleet vehicles
const fleetVehicles = [
  {
    id: 1,
    plateNumber: "DA 1234 XY",
    type: "Truk Compactor",
    capacity: "8 ton",
    driver: "Ahmad Fauzi",
    status: "active",
    lastMaintenance: "2025-03-15",
    currentLocation: "Banjarmasin Timur",
    fuelEfficiency: "8 km/l"
  },
  {
    id: 2,
    plateNumber: "DA 5678 AB",
    type: "Truk Arm Roll",
    capacity: "6 ton",
    driver: "Budi Santoso",
    status: "active",
    lastMaintenance: "2025-03-28",
    currentLocation: "Banjarmasin Selatan",
    fuelEfficiency: "7 km/l"
  },
  {
    id: 3,
    plateNumber: "DA 9012 CD",
    type: "Pick Up",
    capacity: "1.5 ton",
    driver: "Dewi Lestari",
    status: "maintenance",
    lastMaintenance: "2025-04-10",
    currentLocation: "Bengkel Kota",
    fuelEfficiency: "11 km/l"
  },
  {
    id: 4,
    plateNumber: "DA 3456 EF",
    type: "Motor Sampah",
    capacity: "0.3 ton",
    driver: "Siti Aminah",
    status: "active",
    lastMaintenance: "2025-04-01",
    currentLocation: "Banjarmasin Barat",
    fuelEfficiency: "25 km/l"
  },
];

// Mock data for priority locations
const priorityLocations = [
  {
    id: 1,
    name: "Pasar Lama",
    address: "Jl. Pasar Lama, Banjarmasin Tengah",
    coordinates: "-3.324561, 114.589754",
    wasteVolume: "2.5 ton/hari",
    priority: "high",
    requestedVehicle: "Truk Compactor",
    notes: "Area pasar dengan volume sampah tinggi, perlu pengangkutan dua kali sehari."
  },
  {
    id: 2,
    name: "Perumahan Bumi Indah",
    address: "Jl. Sultan Adam, Banjarmasin Utara",
    coordinates: "-3.302456, 114.593210",
    wasteVolume: "1.2 ton/hari",
    priority: "medium",
    requestedVehicle: "Pick Up",
    notes: "Kompleks perumahan dengan akses jalan sempit, gunakan kendaraan ukuran kecil."
  },
  {
    id: 3,
    name: "Tumpukan Sampah Liar Sungai Martapura",
    address: "Tepi Sungai Martapura, Banjarmasin Selatan",
    coordinates: "-3.336789, 114.602345",
    wasteVolume: "1.8 ton",
    priority: "high",
    requestedVehicle: "Truk Arm Roll",
    notes: "Tumpukan sampah liar yang perlu dibersihkan segera untuk mencegah pencemaran sungai."
  },
  {
    id: 4,
    name: "Kawasan Wisata Siring",
    address: "Siring Sungai Martapura, Banjarmasin",
    coordinates: "-3.319876, 114.595432",
    wasteVolume: "0.8 ton/hari",
    priority: "medium",
    requestedVehicle: "Pick Up",
    notes: "Area wisata dengan kebutuhan pembersihan pagi dan sore hari."
  },
];

// Mock data for collection routes
const collectionRoutes = [
  {
    id: 1,
    name: "Rute Banjarmasin Timur A",
    vehicle: "Truk Compactor DA 1234 XY",
    driver: "Ahmad Fauzi",
    startTime: "06:00",
    endTime: "12:00",
    stops: 15,
    distance: "28 km",
    status: "completed",
    completedStops: 15
  },
  {
    id: 2,
    name: "Rute Banjarmasin Selatan B",
    vehicle: "Truk Arm Roll DA 5678 AB",
    driver: "Budi Santoso",
    startTime: "07:30",
    endTime: "13:30",
    stops: 12,
    distance: "22 km",
    status: "in-progress",
    completedStops: 8
  },
  {
    id: 3,
    name: "Rute Banjarmasin Barat C",
    vehicle: "Motor Sampah DA 3456 EF",
    driver: "Siti Aminah",
    startTime: "08:00",
    endTime: "14:00",
    stops: 18,
    distance: "15 km",
    status: "scheduled",
    completedStops: 0
  },
  {
    id: 4,
    name: "Rute Banjarmasin Utara D",
    vehicle: "Pick Up DA 1357 GH",
    driver: "Rahman Abdullah",
    startTime: "06:30",
    endTime: "12:30",
    stops: 14,
    distance: "25 km",
    status: "completed",
    completedStops: 14
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Logistik = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Logistik</h1>
          <p className="text-muted-foreground mt-2">
            Pantau armada pengangkutan sampah dan kelola rute pengangkutan.
          </p>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Dashboard Armada
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Kendaraan
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Pengangkutan & Lokasi Prioritas
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Kendaraan</CardTitle>
                  <CardDescription>Jumlah kendaraan pengangkut sampah</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">58</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 5%</span> dibanding bulan lalu
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Kendaraan Operasional</CardTitle>
                  <CardDescription>Kendaraan yang beroperasi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">49</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">84%</span> dari total armada
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Rata-rata Jarak</CardTitle>
                  <CardDescription>Jarak tempuh rata-rata per hari</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">23 km</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 2 km</span> dibanding bulan lalu
                  </p>
                </CardContent>
              </Card>

              {/* Fleet Overview Chart */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Ringkasan Armada</CardTitle>
                    <CardDescription>Status operasional kendaraan berdasarkan jenis</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Ekspor Data
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={fleetOverviewData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="operational" name="Operasional" fill="#82ca9d" />
                      <Bar dataKey="maintenance" name="Pemeliharaan" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Waste Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Sumber Sampah</CardTitle>
                  <CardDescription>Persentase berdasarkan sumber</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={wasteTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {wasteTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Performance Chart */}
              <Card className="md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Performa Bulanan</CardTitle>
                    <CardDescription>Tren pengangkutan sampah 6 bulan terakhir</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Ekspor Data
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={monthlyFleetData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="trips" name="Jumlah Trip" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="tonnage" name="Tonase (ton)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari kendaraan..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="maintenance">Pemeliharaan</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-peduli-600 hover:bg-peduli-700">Tambah Kendaraan</Button>
              </div>
            </div>

            {/* Vehicles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fleetVehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {vehicle.plateNumber}
                          <Badge 
                            variant={vehicle.status === "active" ? "outline" : "secondary"}
                          >
                            {vehicle.status === "active" ? "Aktif" : "Pemeliharaan"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{vehicle.type}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">Lacak</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Kapasitas</p>
                        <p className="font-medium">{vehicle.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lokasi Saat Ini</p>
                        <p className="font-medium">{vehicle.currentLocation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pengemudi</p>
                        <p className="font-medium">{vehicle.driver}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pemeliharaan Terakhir</p>
                        <p className="font-medium">{vehicle.lastMaintenance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Efisiensi Bahan Bakar</p>
                        <p className="font-medium">{vehicle.fuelEfficiency}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">Riwayat</Button>
                      <Button variant="outline" size="sm">Lihat Detail</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-6">
            <div className="flex flex-col gap-6">
              {/* Priority Locations Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Lokasi Prioritas</h2>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex gap-4">
                    <Input placeholder="Cari lokasi..." className="w-full md:w-80" />
                    <Button>Cari</Button>
                  </div>
                  <Button className="bg-peduli-600 hover:bg-peduli-700">Tambah Lokasi Prioritas</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {priorityLocations.map((location) => (
                    <Card key={location.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {location.name}
                              <Badge 
                                variant={
                                  location.priority === "high" ? "destructive" : 
                                  location.priority === "medium" ? "default" : "outline"
                                }
                              >
                                {location.priority === "high" ? "Prioritas Tinggi" : 
                                 location.priority === "medium" ? "Prioritas Menengah" : "Prioritas Rendah"}
                              </Badge>
                            </CardTitle>
                            <CardDescription>{location.address}</CardDescription>
                          </div>
                          <Button variant="outline" size="sm">Lihat Peta</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Koordinat</p>
                            <p className="font-medium">{location.coordinates}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Volume Sampah</p>
                            <p className="font-medium">{location.wasteVolume}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Kendaraan Dibutuhkan</p>
                            <p className="font-medium">{location.requestedVehicle}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">Catatan</p>
                          <p className="font-medium">{location.notes}</p>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">Atur Pengangkutan</Button>
                          <Button variant="default" size="sm">Tetapkan Kendaraan</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Collection Routes Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Rute Pengangkutan Hari Ini</h2>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex gap-4">
                    <Input placeholder="Cari rute..." className="w-full md:w-80" />
                    <Button>Cari</Button>
                  </div>
                  <Button className="bg-peduli-600 hover:bg-peduli-700">Tambah Rute</Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Nama Rute</th>
                        <th className="text-left py-3 px-4">Kendaraan</th>
                        <th className="text-left py-3 px-4">Pengemudi</th>
                        <th className="text-left py-3 px-4">Waktu</th>
                        <th className="text-left py-3 px-4">Progress</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionRoutes.map((route) => (
                        <tr key={route.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{route.name}</td>
                          <td className="py-3 px-4">{route.vehicle}</td>
                          <td className="py-3 px-4">{route.driver}</td>
                          <td className="py-3 px-4">
                            {route.startTime} - {route.endTime}
                          </td>
                          <td className="py-3 px-4 w-40">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-peduli-600" 
                                  style={{ width: `${Math.round(route.completedStops / parseInt(route.stops.toString()) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {route.completedStops}/{route.stops}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={
                                route.status === "completed" ? "outline" : 
                                route.status === "in-progress" ? "default" : "secondary"
                              }
                            >
                              {route.status === "completed" ? "Selesai" : 
                               route.status === "in-progress" ? "Berlangsung" : "Terjadwal"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">Lihat Detail</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Logistik;
