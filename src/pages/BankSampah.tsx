import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Trash, Building, ShoppingCart } from "lucide-react";
import { BankSampahStats } from "@/components/bank-sampah/BankSampahStats";
import { WasteDistribution } from "@/components/bank-sampah/WasteDistribution";
import { MonthlyPerformance } from "@/components/bank-sampah/MonthlyPerformance";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Filter } from "lucide-react";

// Mock data for bank sampah performance
const bankSampahData = [
  { name: 'Bank Sampah Sejahtera', volume: 450, income: 1250000, members: 80 },
  { name: 'Bank Sampah Bersih', volume: 380, income: 980000, members: 65 },
  { name: 'Bank Sampah Mandiri', volume: 520, income: 1450000, members: 95 },
  { name: 'Bank Sampah Lestari', volume: 310, income: 850000, members: 55 },
  { name: 'Bank Sampah Barokah', volume: 400, income: 1100000, members: 70 },
];

// Mock data for monthly performance
const monthlyPerformanceData = [
  { name: 'Jan', organik: 200, anorganik: 150, b3: 30 },
  { name: 'Feb', organik: 220, anorganik: 160, b3: 35 },
  { name: 'Mar', organik: 240, anorganik: 170, b3: 32 },
  { name: 'Apr', organik: 280, anorganik: 190, b3: 38 },
  { name: 'Mei', organik: 250, anorganik: 180, b3: 36 },
  { name: 'Jun', organik: 260, anorganik: 185, b3: 37 },
];

// Mock data for waste type distribution
const wasteTypeData = [
  { name: 'Organik', value: 45 },
  { name: 'Plastik', value: 25 },
  { name: 'Kertas', value: 15 },
  { name: 'Logam', value: 10 },
  { name: 'Kaca', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data for facility recommendations
const facilityRecommendations = [
  {
    id: 1,
    location: "Kecamatan Banjarmasin Timur",
    type: "Bank Sampah",
    priority: "high",
    reason: "Tingkat volume sampah tinggi (3.5 ton/hari) dengan akses ke fasilitas pengolahan terbatas"
  },
  {
    id: 2,
    location: "Kelurahan Sungai Bilu",
    type: "TPS 3R",
    priority: "medium",
    reason: "Kepadatan penduduk tinggi dengan persentase sampah organik 60% yang bisa diolah"
  },
  {
    id: 3,
    location: "Kawasan Industri Banjarmasin Selatan",
    type: "Pusat Daur Ulang",
    priority: "medium",
    reason: "Konsentrasi sampah industri tinggi dengan potensi daur ulang besar"
  },
];

// Mock data for market conditions
const marketData = [
  { id: 1, material: "Plastik PET", price: 5000, trend: "up", demand: "high", supply: "medium" },
  { id: 2, material: "Kertas Kardus", price: 2500, trend: "stable", demand: "medium", supply: "high" },
  { id: 3, material: "Aluminium", price: 14000, trend: "up", demand: "high", supply: "low" },
  { id: 4, material: "Botol Kaca", price: 1000, trend: "down", demand: "low", supply: "high" },
  { id: 5, material: "HDPE", price: 8000, trend: "up", demand: "high", supply: "medium" },
];

// Mock data for TPS 3R
const tps3rData = [
  {
    id: 1,
    name: "TPS 3R Sejahtera",
    location: "Banjarmasin Timur",
    capacity: 5,
    utilization: 85,
    organikProcessed: 3.2,
    recycled: 1.5,
    status: "operational"
  },
  {
    id: 2,
    name: "TPS 3R Bersih",
    location: "Banjarmasin Selatan",
    capacity: 3,
    utilization: 95,
    organikProcessed: 2.1,
    recycled: 0.8,
    status: "operational"
  },
  {
    id: 3,
    name: "TPS 3R Maju",
    location: "Banjarmasin Utara",
    capacity: 4,
    utilization: 60,
    organikProcessed: 1.8,
    recycled: 0.6,
    status: "operational"
  },
];

// Mock data for recycling centers
const recyclingCenters = [
  {
    id: 1,
    name: "Pusat Daur Ulang Banjarmasin",
    location: "Jl. Industri No. 45, Banjarmasin Timur",
    capacity: 10,
    materials: ["Plastik", "Kertas", "Logam"],
    operationalStatus: "active"
  },
  {
    id: 2,
    name: "Pabrik Daur Ulang Mandiri",
    location: "Jl. Sultan Adam No. 23, Banjarmasin Utara",
    capacity: 8,
    materials: ["Plastik", "Organik"],
    operationalStatus: "active"
  },
  {
    id: 3,
    name: "Banjarmasin Recycle Center",
    location: "Jl. Veteran Km. 4.5, Banjarmasin Selatan",
    capacity: 12,
    materials: ["Plastik", "Kertas", "Elektronik"],
    operationalStatus: "maintenance"
  },
];

// Mock data for recycled products
const recycledProducts = [
  {
    id: 1,
    name: "Tas dari Bekas Kemasan",
    category: "Fashion",
    price: 75000,
    material: "Plastik daur ulang",
    stock: 25,
    image: "https://placehold.co/200x200?text=Recycled+Bag"
  },
  {
    id: 2,
    name: "Pot Bunga Daur Ulang",
    category: "Home Decor",
    price: 45000,
    material: "Botol plastik",
    stock: 40,
    image: "https://placehold.co/200x200?text=Recycled+Pot"
  },
  {
    id: 3,
    name: "Pupuk Kompos Premium",
    category: "Gardening",
    price: 35000,
    material: "Sampah organik",
    stock: 100,
    image: "https://placehold.co/200x200?text=Compost"
  },
  {
    id: 4,
    name: "Tempat Pensil Eco",
    category: "Stationery",
    price: 25000,
    material: "Kertas daur ulang",
    stock: 55,
    image: "https://placehold.co/200x200?text=Pencil+Case"
  },
];

const BankSampah = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("bank-sampah");

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Bank Sampah & Fasilitas</h1>
          <p className="text-muted-foreground mt-2">
            Kelola data bank sampah, fasilitas pengelolaan, dan produk hasil daur ulang.
          </p>
        </div>

        <Tabs defaultValue="bank-sampah" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="bank-sampah" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Bank Sampah
            </TabsTrigger>
            <TabsTrigger value="tps3r" className="flex items-center gap-2">
              <Trash className="h-4 w-4" /> TPS 3R
            </TabsTrigger>
            <TabsTrigger value="recycling" className="flex items-center gap-2">
              <Building className="h-4 w-4" /> Pusat Daur Ulang
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank-sampah" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BankSampahStats bankSampahData={bankSampahData} />
              <WasteDistribution wasteTypeData={wasteTypeData} />
              <MonthlyPerformance monthlyData={monthlyPerformanceData} />
              
              {/* Facility Recommendations Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rekomendasi Pengembangan Fasilitas</CardTitle>
                  <CardDescription>Lokasi potensial untuk penambahan fasilitas baru</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Lokasi</th>
                          <th className="text-left p-4">Jenis Fasilitas</th>
                          <th className="text-left p-4">Prioritas</th>
                          <th className="text-left p-4">Alasan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facilityRecommendations.map((rec) => (
                          <tr key={rec.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">{rec.location}</td>
                            <td className="p-4">{rec.type}</td>
                            <td className="p-4">
                              <Badge 
                                variant={
                                  rec.priority === "high" ? "destructive" : 
                                  rec.priority === "medium" ? "default" : "outline"
                                }
                              >
                                {rec.priority === "high" ? "Tinggi" : 
                                 rec.priority === "medium" ? "Menengah" : "Rendah"}
                              </Badge>
                            </td>
                            <td className="p-4">{rec.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Market Data Card */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Data Pasar</CardTitle>
                  <CardDescription>Harga, permintaan, dan ketersediaan</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Material</th>
                          <th className="text-left p-4">Harga (Rp/kg)</th>
                          <th className="text-left p-4">Tren</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketData.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">{item.material}</td>
                            <td className="p-4">{item.price.toLocaleString()}</td>
                            <td className="p-4">
                              <Badge 
                                variant={
                                  item.trend === "up" ? "default" : 
                                  item.trend === "down" ? "destructive" : "outline"
                                }
                              >
                                {item.trend === "up" ? "▲ Naik" : 
                                 item.trend === "down" ? "▼ Turun" : "► Stabil"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TPS 3R Tab */}
          <TabsContent value="tps3r" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari TPS 3R..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="operational">Beroperasi</SelectItem>
                    <SelectItem value="maintenance">Pemeliharaan</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-peduli-600 hover:bg-peduli-700">Tambah TPS 3R</Button>
              </div>
            </div>

            {/* TPS 3R Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tps3rData.map((tps) => (
                <Card key={tps.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{tps.name}</CardTitle>
                      <Badge variant={tps.status === "operational" ? "outline" : "secondary"}>
                        {tps.status === "operational" ? "Beroperasi" : "Pemeliharaan"}
                      </Badge>
                    </div>
                    <CardDescription>{tps.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Utilisasi</span>
                          <span className="font-medium">{tps.utilization}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              tps.utilization > 90 ? 'bg-red-500' : 
                              tps.utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${tps.utilization}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Kapasitas</p>
                          <p className="text-lg font-semibold">{tps.capacity} ton/hari</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Sampah Diproses</p>
                          <p className="text-lg font-semibold">{tps.organikProcessed} ton/hari</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Sampah Didaur Ulang</p>
                          <p className="text-lg font-semibold">{tps.recycled} ton/hari</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Efisiensi</p>
                          <p className="text-lg font-semibold">
                            {Math.round((tps.recycled + tps.organikProcessed) / tps.capacity * 100)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-end">
                        <Button variant="outline" size="sm">Lihat Detail</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recycling Centers Tab */}
          <TabsContent value="recycling" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari pusat daur ulang..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Tambah Pusat Daur Ulang</Button>
            </div>

            {/* Recycling Centers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recyclingCenters.map((center) => (
                <Card key={center.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{center.name}</CardTitle>
                      <Badge variant={center.operationalStatus === "active" ? "outline" : "secondary"}>
                        {center.operationalStatus === "active" ? "Aktif" : "Pemeliharaan"}
                      </Badge>
                    </div>
                    <CardDescription>{center.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Kapasitas</p>
                          <p className="text-lg font-semibold">{center.capacity} ton/hari</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Material</p>
                          <div className="flex flex-wrap gap-1">
                            {center.materials.map((mat, idx) => (
                              <Badge key={idx} variant="outline">{mat}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Laporan</Button>
                        <Button variant="outline" size="sm">Lihat Detail</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari produk daur ulang..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <Button className="bg-peduli-600 hover:bg-peduli-700">Tambah Produk</Button>
            </div>

            {/* Recycled Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recycledProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="w-full h-48 bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <CardDescription>Material: {product.material}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold">Rp {product.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Stok: {product.stock}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="default" size="sm">Lihat Detail</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BankSampah;
