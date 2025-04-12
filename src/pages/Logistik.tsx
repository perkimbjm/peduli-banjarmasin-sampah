
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Truck, MapPin, Calendar, UserRound, PlusCircle, FilePenLine } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock vehicle data
const vehicles = [
  { 
    id: "1", 
    name: "Truk Pengangkut A", 
    type: "Truk Sampah Compactor", 
    area: "Menteng", 
    capacity: "5 ton",
    status: "operational",
    lastMaintenance: "2025-03-20",
    nextMaintenance: "2025-06-20",
    driver: "Budi Santoso",
    licensePlate: "B 1234 ABC"
  },
  { 
    id: "2", 
    name: "Truk Pengangkut B", 
    type: "Truk Sampah Arm Roll", 
    area: "Gondangdia", 
    capacity: "8 ton",
    status: "maintenance",
    lastMaintenance: "2025-04-05",
    nextMaintenance: "2025-07-05",
    driver: "Ahmad Riyadi",
    licensePlate: "B 5678 DEF"
  },
  { 
    id: "3", 
    name: "Truk Pengangkut C", 
    type: "Truk Sampah Compactor", 
    area: "Cikini", 
    capacity: "5 ton",
    status: "operational",
    lastMaintenance: "2025-02-15",
    nextMaintenance: "2025-05-15",
    driver: "Joko Widodo",
    licensePlate: "B 9101 GHI"
  },
  { 
    id: "4", 
    name: "Motor Roda Tiga A", 
    type: "Motor Roda Tiga", 
    area: "Menteng Atas", 
    capacity: "500 kg",
    status: "operational",
    lastMaintenance: "2025-03-10",
    nextMaintenance: "2025-06-10",
    driver: "Dewi Lestari",
    licensePlate: "B 1234 XYZ"
  },
  { 
    id: "5", 
    name: "Truk Pengangkut D", 
    type: "Truk Sampah Dump Truck", 
    area: "Pegangsaan", 
    capacity: "10 ton",
    status: "breakdown",
    lastMaintenance: "2025-01-25",
    nextMaintenance: "2025-04-25",
    driver: "Unassigned",
    licensePlate: "B 5678 JKL"
  },
];

// Mock route data
const routes = [
  {
    id: "1",
    vehicleId: "1",
    name: "Rute Pengumpulan Menteng A",
    driver: "Budi Santoso",
    area: "Kelurahan Menteng",
    startTime: "2025-04-12T07:00:00Z",
    endTime: "2025-04-12T11:30:00Z",
    stopPoints: 12,
    status: "in-progress",
    completedStops: 5,
    totalWeight: "2.3 ton",
    progress: 42
  },
  {
    id: "2",
    vehicleId: "3",
    name: "Rute Pengumpulan Cikini B",
    driver: "Joko Widodo",
    area: "Kelurahan Cikini",
    startTime: "2025-04-12T08:00:00Z",
    endTime: "2025-04-12T12:00:00Z",
    stopPoints: 10,
    status: "in-progress",
    completedStops: 8,
    totalWeight: "3.1 ton",
    progress: 80
  },
  {
    id: "3",
    vehicleId: "4",
    name: "Rute Pengumpulan Menteng Atas C",
    driver: "Dewi Lestari",
    area: "Kelurahan Menteng Atas",
    startTime: "2025-04-12T07:30:00Z",
    endTime: "2025-04-12T10:30:00Z",
    stopPoints: 8,
    status: "completed",
    completedStops: 8,
    totalWeight: "0.45 ton",
    progress: 100
  },
  {
    id: "4",
    vehicleId: "1",
    name: "Rute Pengangkutan ke TPA",
    driver: "Budi Santoso",
    area: "Menteng - TPA",
    startTime: "2025-04-12T13:00:00Z",
    endTime: "2025-04-12T15:00:00Z",
    stopPoints: 1,
    status: "scheduled",
    completedStops: 0,
    totalWeight: "0 ton",
    progress: 0
  },
  {
    id: "5",
    vehicleId: "3",
    name: "Rute Pengangkutan ke TPA",
    driver: "Joko Widodo",
    area: "Cikini - TPA",
    startTime: "2025-04-12T13:30:00Z",
    endTime: "2025-04-12T15:30:00Z",
    stopPoints: 1,
    status: "scheduled",
    completedStops: 0,
    totalWeight: "0 ton",
    progress: 0
  }
];

// Mock incidents
const incidents = [
  {
    id: "1",
    type: "breakdown",
    vehicleId: "5",
    driver: "Rahmat Hidayat",
    location: "Jalan Cikini Raya",
    reportTime: "2025-04-11T14:30:00Z",
    status: "under_repair",
    description: "Mesin mogok dan tidak bisa dihidupkan kembali",
    estimatedRepairTime: "2025-04-13T10:00:00Z"
  },
  {
    id: "2",
    type: "accident",
    vehicleId: "2",
    driver: "Ahmad Riyadi",
    location: "Persimpangan Jalan Menteng",
    reportTime: "2025-04-10T09:15:00Z",
    status: "under_repair",
    description: "Kecelakaan ringan, bagian depan kendaraan rusak",
    estimatedRepairTime: "2025-04-15T10:00:00Z"
  }
];

// Mock locations for waste disposal points
const wasteDisposalPoints = [
  {
    id: "1",
    name: "TPS Menteng",
    type: "TPS",
    capacity: "15 ton",
    currentFill: "7.5 ton",
    fillPercentage: 50,
    lastCollection: "2025-04-11T10:00:00Z",
    nextCollection: "2025-04-12T10:00:00Z",
    status: "operational"
  },
  {
    id: "2",
    name: "TPS Cikini",
    type: "TPS",
    capacity: "10 ton",
    currentFill: "8 ton",
    fillPercentage: 80,
    lastCollection: "2025-04-11T11:30:00Z",
    nextCollection: "2025-04-12T11:30:00Z",
    status: "operational"
  },
  {
    id: "3",
    name: "TPS Gondangdia",
    type: "TPS",
    capacity: "12 ton",
    currentFill: "3 ton",
    fillPercentage: 25,
    lastCollection: "2025-04-11T09:00:00Z",
    nextCollection: "2025-04-13T09:00:00Z",
    status: "operational"
  },
  {
    id: "4",
    name: "TPA Bantar Gebang",
    type: "TPA",
    capacity: "1000 ton",
    currentFill: "650 ton",
    fillPercentage: 65,
    lastCollection: "N/A",
    nextCollection: "N/A",
    status: "operational"
  }
];

const Logistik = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("vehicles");
  const [isAddRouteDialogOpen, setIsAddRouteDialogOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    vehicleId: "",
    name: "",
    area: "",
    startTime: "",
    endTime: "",
    stopPoints: "0"
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500 hover:bg-green-600">Operasional</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pemeliharaan</Badge>;
      case "breakdown":
        return <Badge className="bg-red-500 hover:bg-red-600">Rusak</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Sedang Berjalan</Badge>;
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Terjadwal</Badge>;
      case "under_repair":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Dalam Perbaikan</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };
  
  const getIncidentTypeBadge = (type: string) => {
    switch (type) {
      case "breakdown":
        return <Badge className="bg-red-500 hover:bg-red-600">Kerusakan</Badge>;
      case "accident":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Kecelakaan</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{type}</Badge>;
    }
  };
  
  const getFillLevelBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge className="bg-red-500 hover:bg-red-600">{percentage}% Penuh</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">{percentage}% Penuh</Badge>;
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600">{percentage}% Penuh</Badge>;
    }
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 40) return "bg-yellow-600";
    return "bg-red-600";
  };

  const handleAddRoute = () => {
    // Simulate adding a new route
    const id = (routes.length + 1).toString();
    const vehicle = vehicles.find(v => v.id === newRoute.vehicleId);
    
    const newRouteItem = {
      id,
      vehicleId: newRoute.vehicleId,
      name: newRoute.name,
      driver: vehicle?.driver || "Unassigned",
      area: newRoute.area,
      startTime: newRoute.startTime,
      endTime: newRoute.endTime,
      stopPoints: parseInt(newRoute.stopPoints, 10),
      status: "scheduled",
      completedStops: 0,
      totalWeight: "0 ton",
      progress: 0
    };
    
    // In a real app, you would save this to your backend
    console.log("Adding new route:", newRouteItem);
    
    toast({
      title: "Rute baru ditambahkan",
      description: `${newRoute.name} telah berhasil ditambahkan.`,
    });
    
    setIsAddRouteDialogOpen(false);
    setNewRoute({
      vehicleId: "",
      name: "",
      area: "",
      startTime: "",
      endTime: "",
      stopPoints: "0"
    });
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredIncidents = incidents.filter((incident) =>
    incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDisposalPoints = wasteDisposalPoints.filter((point) =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Logistik</h1>
          <p className="text-muted-foreground">Kelola armada dan pengangkutan sampah</p>
        </div>
        <Dialog open={isAddRouteDialogOpen} onOpenChange={setIsAddRouteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Rute
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Rute Baru</DialogTitle>
              <DialogDescription>
                Buat rute pengumpulan atau pengangkutan sampah baru.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="routeName">Nama Rute</Label>
                <Input
                  id="routeName"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                  placeholder="Contoh: Rute Pengumpulan Menteng A"
                />
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="vehicleSelect">Pilih Kendaraan</Label>
                <Select 
                  value={newRoute.vehicleId} 
                  onValueChange={(value) => setNewRoute({...newRoute, vehicleId: value})}
                >
                  <SelectTrigger id="vehicleSelect">
                    <SelectValue placeholder="Pilih kendaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles
                      .filter(v => v.status === "operational")
                      .map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.licensePlate})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={newRoute.area}
                  onChange={(e) => setNewRoute({...newRoute, area: e.target.value})}
                  placeholder="Area atau lokasi rute"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Waktu Mulai</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={newRoute.startTime}
                    onChange={(e) => setNewRoute({...newRoute, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Waktu Selesai</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={newRoute.endTime}
                    onChange={(e) => setNewRoute({...newRoute, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="stopPoints">Jumlah Titik Berhenti</Label>
                <Input
                  id="stopPoints"
                  type="number"
                  min="1"
                  value={newRoute.stopPoints}
                  onChange={(e) => setNewRoute({...newRoute, stopPoints: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRouteDialogOpen(false)}>Batal</Button>
              <Button onClick={handleAddRoute}>Tambahkan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Kendaraan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">Unit tersedia</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kendaraan Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.filter(v => v.status === "operational").length}</div>
            <p className="text-xs text-muted-foreground">Siap digunakan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rute Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.filter(r => r.status === "in-progress").length}</div>
            <p className="text-xs text-muted-foreground">Sedang berjalan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Insiden Terbuka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">Memerlukan penanganan</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari berdasarkan nama, area, atau pengemudi..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="vehicles" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vehicles">Kendaraan</TabsTrigger>
            <TabsTrigger value="routes">Rute</TabsTrigger>
            <TabsTrigger value="incidents">Insiden</TabsTrigger>
            <TabsTrigger value="disposal">Titik Pembuangan</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Kendaraan</CardTitle>
                <CardDescription>
                  Informasi lengkap armada pengangkut sampah
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead>Pengemudi</TableHead>
                      <TableHead className="hidden md:table-cell">Kapasitas</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Truck className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div>{vehicle.name}</div>
                                <div className="text-xs text-muted-foreground">{vehicle.licensePlate}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.type}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {vehicle.area}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <UserRound className="h-3 w-3 text-muted-foreground" />
                              {vehicle.driver}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{vehicle.capacity}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Tidak ada kendaraan yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Rute Pengangkutan</CardTitle>
                <CardDescription>
                  Rute pengangkutan dan pengumpulan sampah
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Rute</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead className="hidden md:table-cell">Pengemudi</TableHead>
                      <TableHead className="hidden md:table-cell">Waktu</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progres</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoutes.length > 0 ? (
                      filteredRoutes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div>
                                <div>{route.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {route.completedStops}/{route.stopPoints} titik, {route.totalWeight}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {route.area}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <UserRound className="h-3 w-3 text-muted-foreground" />
                              {route.driver}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDate(route.startTime)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(route.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 w-full">
                              <Progress value={route.progress} className={`h-2 ${getProgressColor(route.progress)}`} />
                              <span className="text-xs">{route.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Tidak ada rute yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Insiden</CardTitle>
                <CardDescription>
                  Laporan insiden kendaraan pengangkutan
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe Insiden</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead className="hidden md:table-cell">Pengemudi</TableHead>
                      <TableHead className="hidden md:table-cell">Waktu Laporan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Est. Perbaikan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.length > 0 ? (
                      filteredIncidents.map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell>
                            {getIncidentTypeBadge(incident.type)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {incident.location}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <UserRound className="h-3 w-3 text-muted-foreground" />
                              {incident.driver}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDate(incident.reportTime)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(incident.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-xs">
                              {formatDate(incident.estimatedRepairTime)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Tidak ada insiden yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disposal Points Tab */}
          <TabsContent value="disposal" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Titik Pembuangan</CardTitle>
                <CardDescription>
                  Status TPS dan TPA
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Kapasitas</TableHead>
                      <TableHead className="hidden md:table-cell">Terisi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Pengumpulan Berikutnya</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisposalPoints.length > 0 ? (
                      filteredDisposalPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">
                            {point.name}
                          </TableCell>
                          <TableCell>{point.type}</TableCell>
                          <TableCell>{point.capacity}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col gap-1">
                              <div>{point.currentFill}</div>
                              <Progress value={point.fillPercentage} className={`h-2 ${
                                point.fillPercentage > 80 ? "bg-red-600" : 
                                point.fillPercentage > 50 ? "bg-yellow-600" : 
                                "bg-green-600"
                              }`} />
                            </div>
                          </TableCell>
                          <TableCell>{getFillLevelBadge(point.fillPercentage)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {point.nextCollection !== "N/A" ? (
                              <div className="flex items-center gap-1 text-xs">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{formatDate(point.nextCollection)}</span>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Tidak ada titik pembuangan yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Logistik;
