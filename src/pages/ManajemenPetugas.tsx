
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/types/staff";
import { UserPlus, Search, Filter, UserRound, MapPin, Phone, Calendar, BarChart } from "lucide-react";

// Mock data for staff management
const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Budi Santoso",
    position: "Petugas Kebersihan",
    area: "Kelurahan Menteng",
    contact: "081234567890",
    status: "active",
    shift: "morning",
    performance: 90,
    created_at: "2025-01-15T08:00:00Z",
    updated_at: "2025-04-01T09:30:00Z"
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    position: "Koordinator Lapangan",
    area: "Kecamatan Menteng",
    contact: "081298765432",
    status: "active",
    shift: "morning",
    performance: 95,
    created_at: "2024-12-10T08:00:00Z",
    updated_at: "2025-03-28T14:20:00Z"
  },
  {
    id: "3",
    name: "Ahmad Riyadi",
    position: "Petugas Pengangkutan",
    area: "Kelurahan Gondangdia",
    contact: "085712345678",
    status: "on-leave",
    shift: "afternoon",
    performance: 85,
    created_at: "2025-02-05T08:00:00Z",
    updated_at: "2025-04-05T11:45:00Z"
  },
  {
    id: "4",
    name: "Dewi Lestari",
    position: "Petugas Pemilahan",
    area: "Kelurahan Cikini",
    contact: "087812345678",
    status: "active",
    shift: "morning",
    performance: 88,
    created_at: "2025-01-20T08:00:00Z",
    updated_at: "2025-04-02T10:15:00Z"
  },
  {
    id: "5",
    name: "Joko Widodo",
    position: "Pengawas Kebersihan",
    area: "Kecamatan Menteng",
    contact: "081112345678",
    status: "inactive",
    shift: "night",
    performance: 75,
    created_at: "2024-11-15T08:00:00Z",
    updated_at: "2025-03-25T16:30:00Z"
  }
];

const ManajemenPetugas = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [staffData, setStaffData] = useState<Staff[]>(mockStaff);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: "",
    position: "",
    area: "",
    contact: "",
    status: "active",
    shift: "morning",
    performance: 80
  });
  const [activeTab, setActiveTab] = useState("all");

  const filteredStaff = staffData.filter(staff => {
    // Filter by search query
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && staff.status === "active";
    if (activeTab === "inactive") return matchesSearch && staff.status === "inactive";
    if (activeTab === "on-leave") return matchesSearch && staff.status === "on-leave";
    
    return matchesSearch;
  });

  const handleAddStaff = () => {
    const id = `${staffData.length + 1}`;
    const newStaffMember: Staff = {
      id,
      name: newStaff.name || "New Staff",
      position: newStaff.position || "Petugas",
      area: newStaff.area || "Unassigned",
      contact: newStaff.contact || "-",
      status: newStaff.status as 'active' | 'inactive' | 'on-leave' || "active",
      shift: newStaff.shift as 'morning' | 'afternoon' | 'night' || "morning",
      performance: newStaff.performance || 80,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setStaffData([...staffData, newStaffMember]);
    setIsAddDialogOpen(false);
    setNewStaff({
      name: "",
      position: "",
      area: "",
      contact: "",
      status: "active",
      shift: "morning",
      performance: 80
    });
    
    toast({
      title: "Petugas baru ditambahkan",
      description: `${newStaffMember.name} telah berhasil ditambahkan sebagai petugas.`,
    });
  };
  
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "inactive":
        return "bg-red-500 hover:bg-red-600";
      case "on-leave":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Petugas</h1>
          <p className="text-muted-foreground">Kelola data petugas kebersihan</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Tambah Petugas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Petugas Baru</DialogTitle>
              <DialogDescription>
                Lengkapi informasi petugas baru di bawah ini. Klik simpan ketika selesai.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nama</Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">Posisi</Label>
                <Input
                  id="position"
                  className="col-span-3"
                  value={newStaff.position}
                  onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="area" className="text-right">Area</Label>
                <Input
                  id="area"
                  className="col-span-3"
                  value={newStaff.area}
                  onChange={(e) => setNewStaff({...newStaff, area: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">Kontak</Label>
                <Input
                  id="contact"
                  className="col-span-3"
                  value={newStaff.contact}
                  onChange={(e) => setNewStaff({...newStaff, contact: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select
                  onValueChange={(value) => setNewStaff({...newStaff, status: value as any})}
                  defaultValue={newStaff.status}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      <SelectItem value="on-leave">Cuti</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift" className="text-right">Shift</Label>
                <Select
                  onValueChange={(value) => setNewStaff({...newStaff, shift: value as any})}
                  defaultValue={newStaff.shift}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Shift</SelectLabel>
                      <SelectItem value="morning">Pagi</SelectItem>
                      <SelectItem value="afternoon">Siang</SelectItem>
                      <SelectItem value="night">Malam</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="performance" className="text-right">Performa</Label>
                <Input
                  id="performance"
                  type="number"
                  min="0"
                  max="100"
                  className="col-span-3"
                  value={newStaff.performance}
                  onChange={(e) => setNewStaff({...newStaff, performance: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
              <Button onClick={handleAddStaff}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Petugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffData.length}</div>
            <p className="text-xs text-muted-foreground">Petugas terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Petugas Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffData.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Siap bertugas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Petugas Cuti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffData.filter(s => s.status === 'on-leave').length}</div>
            <p className="text-xs text-muted-foreground">Sedang tidak bertugas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performa Rata-rata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(staffData.reduce((acc, staff) => acc + staff.performance, 0) / staffData.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Tingkat performa</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari petugas berdasarkan nama, posisi, atau area..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter berdasarkan</SelectLabel>
                <SelectItem value="all">Semua Area</SelectItem>
                <SelectItem value="menteng">Menteng</SelectItem>
                <SelectItem value="cikini">Cikini</SelectItem>
                <SelectItem value="gondangdia">Gondangdia</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="active">Aktif</TabsTrigger>
            <TabsTrigger value="on-leave">Cuti</TabsTrigger>
            <TabsTrigger value="inactive">Tidak Aktif</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead className="hidden md:table-cell">Kontak</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Shift</TableHead>
                      <TableHead className="text-right">Performa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-5 w-5 text-muted-foreground" />
                              {staff.name}
                            </div>
                          </TableCell>
                          <TableCell>{staff.position}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {staff.area}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {staff.contact}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(staff.status)}>
                              {staff.status === "active" ? "Aktif" : 
                               staff.status === "inactive" ? "Tidak Aktif" : "Cuti"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {staff.shift === "morning" ? "Pagi" : 
                               staff.shift === "afternoon" ? "Siang" : "Malam"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <BarChart className="h-3 w-3 text-muted-foreground" />
                              <span className={getPerformanceColor(staff.performance)}>
                                {staff.performance}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Tidak ada petugas yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  {/* Same table structure as above */}
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead className="hidden md:table-cell">Kontak</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Shift</TableHead>
                      <TableHead className="text-right">Performa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-5 w-5 text-muted-foreground" />
                              {staff.name}
                            </div>
                          </TableCell>
                          <TableCell>{staff.position}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {staff.area}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {staff.contact}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(staff.status)}>
                              {staff.status === "active" ? "Aktif" : 
                               staff.status === "inactive" ? "Tidak Aktif" : "Cuti"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {staff.shift === "morning" ? "Pagi" : 
                               staff.shift === "afternoon" ? "Siang" : "Malam"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <BarChart className="h-3 w-3 text-muted-foreground" />
                              <span className={getPerformanceColor(staff.performance)}>
                                {staff.performance}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Tidak ada petugas aktif yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="on-leave" className="mt-4">
            {/* Same card structure as above */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead className="hidden md:table-cell">Kontak</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Shift</TableHead>
                      <TableHead className="text-right">Performa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-5 w-5 text-muted-foreground" />
                              {staff.name}
                            </div>
                          </TableCell>
                          <TableCell>{staff.position}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {staff.area}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {staff.contact}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(staff.status)}>
                              {staff.status === "active" ? "Aktif" : 
                               staff.status === "inactive" ? "Tidak Aktif" : "Cuti"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {staff.shift === "morning" ? "Pagi" : 
                               staff.shift === "afternoon" ? "Siang" : "Malam"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <BarChart className="h-3 w-3 text-muted-foreground" />
                              <span className={getPerformanceColor(staff.performance)}>
                                {staff.performance}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Tidak ada petugas cuti yang ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inactive" className="mt-4">
            {/* Same card structure as above */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Posisi</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead className="hidden md:table-cell">Kontak</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Shift</TableHead>
                      <TableHead className="text-right">Performa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-5 w-5 text-muted-foreground" />
                              {staff.name}
                            </div>
                          </TableCell>
                          <TableCell>{staff.position}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {staff.area}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {staff.contact}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(staff.status)}>
                              {staff.status === "active" ? "Aktif" : 
                               staff.status === "inactive" ? "Tidak Aktif" : "Cuti"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {staff.shift === "morning" ? "Pagi" : 
                               staff.shift === "afternoon" ? "Siang" : "Malam"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <BarChart className="h-3 w-3 text-muted-foreground" />
                              <span className={getPerformanceColor(staff.performance)}>
                                {staff.performance}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Tidak ada petugas tidak aktif yang ditemukan.
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

export default ManajemenPetugas;
