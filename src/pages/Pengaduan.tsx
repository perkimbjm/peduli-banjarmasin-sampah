
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Download, Search, Filter, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for pengaduan stats
const complaintMonthlyData = [
  { name: 'Jan', total: 45, resolved: 38, pending: 7 },
  { name: 'Feb', total: 52, resolved: 40, pending: 12 },
  { name: 'Mar', total: 48, resolved: 35, pending: 13 },
  { name: 'Apr', total: 60, resolved: 42, pending: 18 },
  { name: 'Mei', total: 55, resolved: 40, pending: 15 },
  { name: 'Jun', total: 68, resolved: 48, pending: 20 },
];

// Mock data for complaint categories
const complaintCategoriesData = [
  { name: 'Sampah Tidak Terangkut', value: 32 },
  { name: 'Tumpukan Sampah Liar', value: 24 },
  { name: 'Fasilitas Rusak', value: 18 },
  { name: 'Jadwal Pengangkutan', value: 15 },
  { name: 'Lainnya', value: 11 },
];

// Mock data for resolution time
const resolutionTimeData = [
  { name: '< 1 hari', count: 12 },
  { name: '1-3 hari', count: 30 },
  { name: '4-7 hari', count: 15 },
  { name: '> 7 hari', count: 8 },
];

// Mock data for complaints
const complaints = [
  {
    id: 1,
    title: "Tumpukan sampah di Pasar Lama",
    description: "Sudah tiga hari sampah di sekitar Pasar Lama tidak diangkut dan menimbulkan bau tidak sedap.",
    location: "Pasar Lama, Banjarmasin Tengah",
    coordinates: "-3.324561, 114.589754",
    category: "Sampah Tidak Terangkut",
    status: "pending",
    priority: "high",
    reporter: "Ahmad Fauzi",
    reportDate: "2025-04-08T09:15:00Z",
    photos: ["https://placehold.co/400x300?text=Sampah+Pasar"]
  },
  {
    id: 2,
    title: "Tempat sampah rusak di Taman Kota",
    description: "Beberapa tempat sampah di Taman Kota rusak dan perlu diperbaiki atau diganti.",
    location: "Taman Kota, Banjarmasin Utara",
    coordinates: "-3.302456, 114.593210",
    category: "Fasilitas Rusak",
    status: "in-progress",
    priority: "medium",
    reporter: "Siti Aminah",
    reportDate: "2025-04-06T14:30:00Z",
    photos: ["https://placehold.co/400x300?text=Tempat+Sampah+Rusak"]
  },
  {
    id: 3,
    title: "Jadwal pengangkutan sampah tidak konsisten",
    description: "Jadwal pengangkutan sampah di kompleks perumahan kami tidak konsisten dan sering terlambat.",
    location: "Perumahan Bumi Indah, Banjarmasin Timur",
    coordinates: "-3.328912, 114.612345",
    category: "Jadwal Pengangkutan",
    status: "resolved",
    priority: "medium",
    reporter: "Budi Santoso",
    reportDate: "2025-04-01T11:00:00Z",
    resolvedDate: "2025-04-04T15:45:00Z",
    resolution: "Jadwal pengangkutan telah disesuaikan dan petugas telah diinstruksikan untuk lebih tepat waktu.",
    photos: []
  },
  {
    id: 4,
    title: "Tumpukan sampah di tepi sungai",
    description: "Ada tumpukan sampah di tepi Sungai Martapura yang perlu segera dibersihkan untuk mencegah pencemaran.",
    location: "Tepi Sungai Martapura, Banjarmasin Selatan",
    coordinates: "-3.336789, 114.602345",
    category: "Tumpukan Sampah Liar",
    status: "resolved",
    priority: "high",
    reporter: "Dewi Lestari",
    reportDate: "2025-03-28T13:20:00Z",
    resolvedDate: "2025-03-31T10:15:00Z",
    resolution: "Tim pembersihan telah ditugaskan dan sampah telah diangkut. Area akan dipantau secara berkala.",
    photos: ["https://placehold.co/400x300?text=Sampah+Sungai"]
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Pengaduan = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter complaints based on status
  const filteredComplaints = complaints.filter(complaint => 
    filterStatus === "all" || complaint.status === filterStatus
  );

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengaduan</h1>
          <p className="text-muted-foreground mt-2">
            Pantau dan kelola laporan pengaduan dari masyarakat terkait permasalahan sampah.
          </p>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Dashboard Pengaduan
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Daftar Pengaduan
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Pengaduan</CardTitle>
                  <CardDescription>Total pengaduan bulan ini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">68</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 13.3%</span> dibanding bulan lalu
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pengaduan Selesai</CardTitle>
                  <CardDescription>Pengaduan yang telah diselesaikan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">48</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↑ 20%</span> dibanding bulan lalu
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Waktu Penyelesaian</CardTitle>
                  <CardDescription>Rata-rata waktu penyelesaian</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">2.8 hari</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="text-green-500">↓ 0.5 hari</span> dibanding bulan lalu
                  </p>
                </CardContent>
              </Card>

              {/* Monthly Trend Chart */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tren Bulanan Pengaduan</CardTitle>
                    <CardDescription>Data pengaduan 6 bulan terakhir</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Ekspor Data
                  </Button>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={complaintMonthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" name="Total Pengaduan" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="resolved" name="Diselesaikan" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="pending" name="Menunggu" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Categories Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Kategori Pengaduan</CardTitle>
                  <CardDescription>Distribusi kategori pengaduan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={complaintCategoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {complaintCategoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Resolution Time Chart */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Waktu Penyelesaian Pengaduan</CardTitle>
                  <CardDescription>Distribusi waktu penyelesaian pengaduan</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={resolutionTimeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Jumlah Pengaduan" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Complaints List Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <Input placeholder="Cari pengaduan..." className="w-full md:w-80" />
                <Button>Cari</Button>
              </div>
              <div className="flex gap-2">
                <Select defaultValue={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="in-progress">Diproses</SelectItem>
                    <SelectItem value="resolved">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Complaints List */}
            <div className="grid gap-4">
              {filteredComplaints.map((complaint) => (
                <Card key={complaint.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                          <h3 className="text-lg font-semibold">{complaint.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                complaint.status === "pending" ? "secondary" : 
                                complaint.status === "in-progress" ? "default" : "outline"
                              }
                            >
                              {complaint.status === "pending" ? "Menunggu" : 
                               complaint.status === "in-progress" ? "Diproses" : "Selesai"}
                            </Badge>
                            <Badge 
                              variant={
                                complaint.priority === "high" ? "destructive" : 
                                complaint.priority === "medium" ? "default" : "outline"
                              }
                            >
                              {complaint.priority === "high" ? "Prioritas Tinggi" : 
                               complaint.priority === "medium" ? "Prioritas Menengah" : "Prioritas Rendah"}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{complaint.description}</p>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Lokasi:</span>
                            <span>{complaint.location}</span>
                          </div>
                          <span className="hidden md:inline">•</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Kategori:</span>
                            <span>{complaint.category}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Pelapor:</span>
                            <span>{complaint.reporter}</span>
                          </div>
                          <span className="hidden md:inline">•</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Tanggal:</span>
                            <span>{formatDate(complaint.reportDate)}</span>
                          </div>
                        </div>
                        
                        {complaint.status === "resolved" && (
                          <div className="border-t pt-2 mt-2">
                            <p className="font-medium">Penyelesaian:</p>
                            <p className="text-muted-foreground">{complaint.resolution}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Diselesaikan pada:</span> {formatDate(complaint.resolvedDate as string)}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {complaint.photos.length > 0 && (
                        <div className="w-full md:w-64 shrink-0">
                          <img 
                            src={complaint.photos[0]} 
                            alt={complaint.title} 
                            className="w-full h-auto rounded-md"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      {complaint.status !== "resolved" && (
                        <>
                          <Button variant="outline">Tanggapi</Button>
                          <Button variant="default">Selesaikan</Button>
                        </>
                      )}
                      <Button variant="outline">Lihat Detail</Button>
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

export default Pengaduan;
