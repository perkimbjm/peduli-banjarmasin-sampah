import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Task, TaskCategory, TaskStatus } from "@/types/task";
import { PlusCircle, Search, Filter, Calendar, MapPin, CheckSquare, Clock, UserRound, BarChart4, ClipboardList } from "lucide-react";

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Pengumpulan sampah area Menteng",
    description: "Pengumpulan sampah rutin di wilayah Menteng, meliputi jalan utama dan taman",
    category: "pengumpulan",
    status: "in-progress",
    area: "Kelurahan Menteng",
    assigned_to: ["1", "4"],
    start_date: "2025-04-10T08:00:00Z",
    end_date: "2025-04-10T14:00:00Z",
    priority: "high",
    progress: 60,
    created_by: "user-1",
    created_at: "2025-04-08T10:00:00Z",
    updated_at: "2025-04-10T09:30:00Z"
  },
  {
    id: "2",
    title: "Pemilahan sampah TPS Cikini",
    description: "Pemilahan sampah organik dan anorganik di TPS Cikini",
    category: "pemilahan",
    status: "planned",
    area: "Kelurahan Cikini",
    assigned_to: ["2", "3"],
    start_date: "2025-04-11T08:00:00Z",
    end_date: "2025-04-11T16:00:00Z",
    priority: "medium",
    progress: 0,
    created_by: "user-1",
    created_at: "2025-04-08T11:00:00Z",
    updated_at: "2025-04-08T11:00:00Z"
  },
  {
    id: "3",
    title: "Evaluasi program 3R di Gondangdia",
    description: "Evaluasi program reduce, reuse, recycle di wilayah Gondangdia",
    category: "evaluasi",
    status: "completed",
    area: "Kelurahan Gondangdia",
    assigned_to: ["5"],
    start_date: "2025-04-05T09:00:00Z",
    end_date: "2025-04-05T15:00:00Z",
    priority: "low",
    progress: 100,
    created_by: "user-2",
    created_at: "2025-04-03T14:00:00Z",
    updated_at: "2025-04-06T08:00:00Z"
  },
  {
    id: "4",
    title: "Pengangkutan sampah ke TPA",
    description: "Pengangkutan sampah dari TPS Menteng ke Tempat Pembuangan Akhir",
    category: "pengangkutan",
    status: "in-progress",
    area: "Kecamatan Menteng",
    assigned_to: ["3"],
    start_date: "2025-04-10T07:00:00Z",
    end_date: "2025-04-10T12:00:00Z",
    priority: "high",
    progress: 75,
    created_by: "user-1",
    created_at: "2025-04-09T16:00:00Z",
    updated_at: "2025-04-10T08:30:00Z"
  },
  {
    id: "5",
    title: "Perencanaan lokasi bank sampah baru",
    description: "Survei dan perencanaan lokasi bank sampah baru di wilayah Menteng Atas",
    category: "perencanaan",
    status: "planned",
    area: "Kelurahan Menteng Atas",
    assigned_to: ["2", "5"],
    start_date: "2025-04-15T09:00:00Z",
    end_date: "2025-04-16T16:00:00Z",
    priority: "medium",
    progress: 0,
    created_by: "user-2",
    created_at: "2025-04-08T13:00:00Z",
    updated_at: "2025-04-08T13:00:00Z"
  }
];

// Mock staff data for assignments
const mockStaff = [
  { id: "1", name: "Budi Santoso" },
  { id: "2", name: "Siti Nurhaliza" },
  { id: "3", name: "Ahmad Riyadi" },
  { id: "4", name: "Dewi Lestari" },
  { id: "5", name: "Joko Widodo" }
];

const ManajemenTugas = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [taskData, setTaskData] = useState<Task[]>(mockTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    category: "perencanaan",
    status: "planned",
    area: "",
    assigned_to: [],
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    priority: "medium",
    progress: 0
  });

  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'in-progress':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getCategoryLabel = (category: TaskCategory) => {
    const labels: Record<TaskCategory, string> = {
      perencanaan: "Perencanaan",
      pemilahan: "Pemilahan",
      pengumpulan: "Pengumpulan",
      pengurangan: "Pengurangan",
      pengangkutan: "Pengangkutan",
      pengolahan: "Pengolahan",
      pengawasan: "Pengawasan",
      pembuangan: "Pembuangan",
      evaluasi: "Evaluasi"
    };
    return labels[category] || category;
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    const statusMap: Record<TaskStatus, string> = {
      'planned': 'Direncanakan',
      'in-progress': 'Sedang Dikerjakan',
      'completed': 'Selesai',
      'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 40) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getAssignedStaff = (staffIds: string[]) => {
    return staffIds.map(id => {
      const staff = mockStaff.find(s => s.id === id);
      return staff ? staff.name : 'Unknown';
    }).join(', ');
  };

  const filteredTasks = taskData.filter(task => {
    // Filter by search query
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status tab
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && task.status === activeTab;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAddTask = () => {
    const id = `${taskData.length + 1}`;
    const now = new Date().toISOString();
    
    const newTaskItem: Task = {
      id,
      title: newTask.title || "Tugas Baru",
      description: newTask.description || "",
      category: (newTask.category as TaskCategory) || "perencanaan",
      status: (newTask.status as TaskStatus) || "planned",
      area: newTask.area || "Belum ditentukan",
      assigned_to: newTask.assigned_to || [],
      start_date: newTask.start_date || now,
      end_date: newTask.end_date || now,
      priority: newTask.priority as 'low' | 'medium' | 'high' || "medium",
      progress: newTask.progress || 0,
      created_by: "current-user",
      created_at: now,
      updated_at: now
    };
    
    setTaskData([...taskData, newTaskItem]);
    setIsAddDialogOpen(false);
    setNewTask({
      title: "",
      description: "",
      category: "perencanaan",
      status: "planned",
      area: "",
      assigned_to: [],
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      priority: "medium",
      progress: 0
    });
    
    toast({
      title: "Tugas baru ditambahkan",
      description: `${newTaskItem.title} telah berhasil ditambahkan.`,
    });
  };

  const tasksStats = {
    planned: taskData.filter(t => t.status === 'planned').length,
    inProgress: taskData.filter(t => t.status === 'in-progress').length,
    completed: taskData.filter(t => t.status === 'completed').length,
    cancelled: taskData.filter(t => t.status === 'cancelled').length,
    highPriority: taskData.filter(t => t.priority === 'high').length
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Tugas</h1>
          <p className="text-muted-foreground">Kelola aktivitas pengelolaan sampah</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Baru</DialogTitle>
              <DialogDescription>
                Buat tugas baru untuk manajemen pengelolaan sampah.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="title">Judul Tugas</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Masukkan judul tugas"
                />
              </div>
              <div className="grid items-center gap-4">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Masukkan deskripsi tugas"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={newTask.category}
                    onValueChange={(value) => setNewTask({...newTask, category: value as TaskCategory})}
                  >
                    <SelectTrigger id="category" className="w-full mt-1">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perencanaan">Perencanaan</SelectItem>
                      <SelectItem value="pemilahan">Pemilahan</SelectItem>
                      <SelectItem value="pengumpulan">Pengumpulan</SelectItem>
                      <SelectItem value="pengurangan">Pengurangan</SelectItem>
                      <SelectItem value="pengangkutan">Pengangkutan</SelectItem>
                      <SelectItem value="pengolahan">Pengolahan</SelectItem>
                      <SelectItem value="pengawasan">Pengawasan</SelectItem>
                      <SelectItem value="pembuangan">Pembuangan</SelectItem>
                      <SelectItem value="evaluasi">Evaluasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value) => setNewTask({...newTask, status: value as TaskStatus})}
                  >
                    <SelectTrigger id="status" className="w-full mt-1">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Direncanakan</SelectItem>
                      <SelectItem value="in-progress">Sedang Dikerjakan</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({...newTask, priority: value as 'low' | 'medium' | 'high'})}
                  >
                    <SelectTrigger id="priority" className="w-full mt-1">
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={newTask.area}
                    onChange={(e) => setNewTask({...newTask, area: e.target.value})}
                    placeholder="Lokasi/area tugas"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Tanggal Mulai</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={newTask.start_date?.toString().slice(0, 16)}
                    onChange={(e) => setNewTask({...newTask, start_date: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Tanggal Selesai</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={newTask.end_date?.toString().slice(0, 16)}
                    onChange={(e) => setNewTask({...newTask, end_date: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="assigned">Petugas yang Ditugaskan</Label>
                <Select
                  onValueChange={(value) => {
                    const assignedTo = [...(newTask.assigned_to || [])];
                    if (!assignedTo.includes(value)) {
                      assignedTo.push(value);
                      setNewTask({...newTask, assigned_to: assignedTo});
                    }
                  }}
                >
                  <SelectTrigger id="assigned" className="w-full mt-1">
                    <SelectValue placeholder="Pilih petugas" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(newTask.assigned_to || []).map(staffId => {
                    const staff = mockStaff.find(s => s.id === staffId);
                    return staff ? (
                      <Badge key={staff.id} variant="secondary" className="flex items-center gap-1">
                        <UserRound className="h-3 w-3" />
                        {staff.name}
                        <button
                          className="ml-1 text-xs"
                          onClick={() => {
                            setNewTask({
                              ...newTask,
                              assigned_to: newTask.assigned_to?.filter(id => id !== staff.id)
                            });
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="progress">Progres ({newTask.progress || 0}%)</Label>
                <Input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={newTask.progress || 0}
                  onChange={(e) => setNewTask({...newTask, progress: parseInt(e.target.value)})}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
              <Button onClick={handleAddTask}>Tambahkan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskData.length}</div>
            <p className="text-xs text-muted-foreground">Tugas tercatat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Direncanakan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksStats.planned}</div>
            <p className="text-xs text-muted-foreground">Belum dimulai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sedang Berjalan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Dalam pengerjaan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksStats.completed}</div>
            <p className="text-xs text-muted-foreground">Tugas terselesaikan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prioritas Tinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksStats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Memerlukan perhatian</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari tugas berdasarkan judul, deskripsi, atau area..." 
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
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="perencanaan">Perencanaan</SelectItem>
              <SelectItem value="pemilahan">Pemilahan</SelectItem>
              <SelectItem value="pengumpulan">Pengumpulan</SelectItem>
              <SelectItem value="pengangkutan">Pengangkutan</SelectItem>
              <SelectItem value="pengolahan">Pengolahan</SelectItem>
              <SelectItem value="evaluasi">Evaluasi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as TaskStatus | 'all')}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="planned">Direncanakan</TabsTrigger>
            <TabsTrigger value="in-progress">Sedang Dikerjakan</TabsTrigger>
            <TabsTrigger value="completed">Selesai</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead className="hidden md:table-cell">Kategori</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Prioritas</TableHead>
                      <TableHead>Progres</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer hover:bg-muted">
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{task.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {task.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> 
                                {formatDate(task.start_date)} - {formatDate(task.end_date)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="whitespace-nowrap">
                              {getCategoryLabel(task.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {task.area}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <UserRound className="h-3 w-3" /> 
                              {getAssignedStaff(task.assigned_to)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeClass(task.status)}>
                              {getStatusLabel(task.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className={getPriorityBadgeClass(task.priority)}>
                              {task.priority === 'high' ? 'Tinggi' : 
                               task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 w-full">
                              <Progress value={task.progress} className={`h-2 ${getProgressColor(task.progress)}`} />
                              <span className="text-xs whitespace-nowrap">{task.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Tidak ada tugas yang ditemukan.</p>
                            <p className="text-sm text-muted-foreground">
                              Coba ubah filter atau buat tugas baru.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planned" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead className="hidden md:table-cell">Kategori</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Prioritas</TableHead>
                      <TableHead>Progres</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer hover:bg-muted">
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{task.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {task.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> 
                                {formatDate(task.start_date)} - {formatDate(task.end_date)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="whitespace-nowrap">
                              {getCategoryLabel(task.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {task.area}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <UserRound className="h-3 w-3" /> 
                              {getAssignedStaff(task.assigned_to)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeClass(task.status)}>
                              {getStatusLabel(task.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className={getPriorityBadgeClass(task.priority)}>
                              {task.priority === 'high' ? 'Tinggi' : 
                               task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 w-full">
                              <Progress value={task.progress} className={`h-2 ${getProgressColor(task.progress)}`} />
                              <span className="text-xs whitespace-nowrap">{task.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Tidak ada tugas yang direncanakan.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-progress" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead className="hidden md:table-cell">Kategori</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Prioritas</TableHead>
                      <TableHead>Progres</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer hover:bg-muted">
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{task.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {task.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> 
                                {formatDate(task.start_date)} - {formatDate(task.end_date)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="whitespace-nowrap">
                              {getCategoryLabel(task.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {task.area}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <UserRound className="h-3 w-3" /> 
                              {getAssignedStaff(task.assigned_to)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeClass(task.status)}>
                              {getStatusLabel(task.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className={getPriorityBadgeClass(task.priority)}>
                              {task.priority === 'high' ? 'Tinggi' : 
                               task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 w-full">
                              <Progress value={task.progress} className={`h-2 ${getProgressColor(task.progress)}`} />
                              <span className="text-xs whitespace-nowrap">{task.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Tidak ada tugas yang sedang dikerjakan.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead className="hidden md:table-cell">Kategori</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Prioritas</TableHead>
                      <TableHead>Progres</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer hover:bg-muted">
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{task.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {task.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> 
                                {formatDate(task.start_date)} - {formatDate(task.end_date)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="whitespace-nowrap">
                              {getCategoryLabel(task.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {task.area}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <UserRound className="h-3 w-3" /> 
                              {getAssignedStaff(task.assigned_to)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeClass(task.status)}>
                              {getStatusLabel(task.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className={getPriorityBadgeClass(task.priority)}>
                              {task.priority === 'high' ? 'Tinggi' : 
                               task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 w-full">
                              <Progress value={task.progress} className={`h-2 ${getProgressColor(task.progress)}`} />
                              <span className="text-xs whitespace-nowrap">{task.progress}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="h-8 w-8 text-muted-foreground mb-2" />
                            <p>Tidak ada tugas yang selesai.</p>
                          </div>
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

export default ManajemenTugas;
