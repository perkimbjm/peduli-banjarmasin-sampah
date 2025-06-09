import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Film,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  Upload,
} from "lucide-react";

interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: string;
  type: string;
  status: string;
  author_id: string;
  author_name?: string;
  thumbnail_url?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

const ManajemenKonten = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data untuk sekarang sampai Supabase types ter-generate
  const mockContent: EducationalContent[] = [
    {
      id: "1",
      title: "Panduan Dasar Pemilahan Sampah",
      content: "Panduan lengkap tentang cara memilah sampah dengan benar untuk mengurangi dampak lingkungan...",
      category: "Artikel",
      type: "Edukasi",
      status: "published",
      author_id: "admin",
      author_name: "Admin",
      views: 245,
      created_at: "2025-04-01T00:00:00Z",
      updated_at: "2025-04-01T00:00:00Z"
    },
    {
      id: "2",
      title: "Manfaat Ekonomi dari Bank Sampah",
      content: "Bank sampah memberikan manfaat ekonomi yang signifikan bagi masyarakat...",
      category: "Artikel",
      type: "Kampanye",
      status: "published",
      author_id: "admin",
      author_name: "Admin",
      views: 189,
      created_at: "2025-04-03T00:00:00Z",
      updated_at: "2025-04-03T00:00:00Z"
    },
    {
      id: "3",
      title: "Tips Mengurangi Sampah Plastik di Rumah",
      content: "Berbagai cara untuk mengurangi penggunaan plastik di rumah...",
      category: "Artikel",
      type: "Edukasi",
      status: "draft",
      author_id: "admin",
      author_name: "Admin",
      views: 0,
      created_at: "2025-04-05T00:00:00Z",
      updated_at: "2025-04-05T00:00:00Z"
    }
  ];

  // Fetch educational content (menggunakan mock data untuk sementara)
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['educational-content'],
    queryFn: async () => {
      // Sementara menggunakan mock data
      return mockContent;
    },
  });

  // Create content mutation (mock untuk sementara)
  const createContentMutation = useMutation({
    mutationFn: async (newContent: Omit<EducationalContent, 'id' | 'created_at' | 'updated_at' | 'views' | 'author_id'>) => {
      // Mock implementation
      const mockNewContent: EducationalContent = {
        id: `${Date.now()}`,
        ...newContent,
        author_id: 'current-user',
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return mockNewContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Konten berhasil ditambahkan",
        description: "Konten edukasi baru telah ditambahkan sebagai draft.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menambahkan konten",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update content mutation (mock untuk sementara)
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EducationalContent> }) => {
      // Mock implementation
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
      toast({
        title: "Konten berhasil diperbarui",
        description: "Perubahan konten telah disimpan.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal memperbarui konten",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete content mutation (mock untuk sementara)
  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      // Mock implementation
      console.log('Deleting content:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
      toast({
        title: "Konten berhasil dihapus",
        description: "Konten edukasi telah dihapus dari sistem.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menghapus konten",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Increment views mutation (mock untuk sementara)
  const incrementViewsMutation = useMutation({
    mutationFn: async (contentId: string) => {
      // Mock implementation
      console.log('Incrementing views for:', contentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educational-content'] });
    },
  });

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddContent = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    
    createContentMutation.mutate({
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      content: formData.get("content") as string,
      status: "draft",
    });
  };

  const handleEditContent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedContent) return;
    
    const formData = new FormData(event.target as HTMLFormElement);
    
    updateContentMutation.mutate({
      id: selectedContent.id,
      updates: {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        type: formData.get("type") as string,
        content: formData.get("content") as string,
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteContentMutation.mutate(id);
  };

  const handlePublish = (id: string) => {
    updateContentMutation.mutate({
      id,
      updates: { status: "published" }
    });
  };

  const handleView = (item: EducationalContent) => {
    setSelectedContent(item);
    setIsViewDialogOpen(true);
    incrementViewsMutation.mutate(item.id);
  };

  const handleEdit = (item: EducationalContent) => {
    setSelectedContent(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Memuat konten...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manajemen Konten Edukasi
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Kelola konten edukasi dan kampanye kesadaran masyarakat
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Konten
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Tambah Konten Edukasi</DialogTitle>
                <DialogDescription>
                  Isi formulir berikut untuk menambahkan konten edukasi baru.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddContent}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input name="title" placeholder="Judul konten" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Artikel">Artikel</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Infografik">Infografik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipe</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Edukasi">Edukasi</SelectItem>
                          <SelectItem value="Kampanye">Kampanye</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Konten</Label>
                    <Textarea
                      name="content"
                      placeholder="Tulis konten edukasi di sini..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="thumbnail">Gambar/Thumbnail</Label>
                    <div className="flex items-center gap-4">
                      <Input type="file" className="max-w-xs" />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={createContentMutation.isPending}>
                    {createContentMutation.isPending ? "Menyimpan..." : "Simpan sebagai Draft"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Daftar Konten Edukasi</CardTitle>
            <CardDescription>
              Kelola dan publikasikan konten edukasi untuk masyarakat
            </CardDescription>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari konten..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="Artikel">Artikel</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Infografik">Infografik</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="published">Dipublikasi</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Judul</TableHead>
                    <TableHead className="w-[15%]">Kategori</TableHead>
                    <TableHead className="w-[15%]">Tipe</TableHead>
                    <TableHead className="w-[12%]">Status</TableHead>
                    <TableHead className="w-[10%]">Views</TableHead>
                    <TableHead className="w-[8%] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length > 0 ? (
                    filteredContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.title}
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString('id-ID')} - {item.author_name || 'Admin'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.category === "Artikel" ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <Film className="h-4 w-4" />
                            )}
                            {item.category}
                          </div>
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "published"
                                ? "default"
                                : "outline"
                            }
                          >
                            {item.status === "published"
                              ? "Dipublikasi"
                              : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.views.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Buka menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleView(item)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Lihat
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {item.status === "draft" && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handlePublish(item.id)}
                                  disabled={updateContentMutation.isPending}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Publikasikan
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => handleDelete(item.id)}
                                disabled={deleteContentMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center"
                      >
                        Tidak ada data yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Content Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedContent?.title}</DialogTitle>
              <DialogDescription>
                {selectedContent?.category} - {selectedContent?.type}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={
                      selectedContent?.status === "published"
                        ? "default"
                        : "outline"
                    }
                    className="ml-2"
                  >
                    {selectedContent?.status === "published"
                      ? "Dipublikasi"
                      : "Draft"}
                  </Badge>
                </div>
                <div>
                  <Label>Konten</Label>
                  <div className="mt-2 p-4 bg-muted rounded-md">
                    <p className="text-sm">{selectedContent?.content}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tanggal</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedContent?.created_at && new Date(selectedContent.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <Label>Views</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedContent?.views?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Content Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Konten</DialogTitle>
              <DialogDescription>
                Perbarui konten edukasi yang sudah ada.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditContent}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Judul</Label>
                  <Input
                    name="title"
                    defaultValue={selectedContent?.title}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Kategori</Label>
                    <Select name="category" defaultValue={selectedContent?.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Artikel">Artikel</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Infografik">Infografik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Tipe</Label>
                    <Select name="type" defaultValue={selectedContent?.type}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Edukasi">Edukasi</SelectItem>
                        <SelectItem value="Kampanye">Kampanye</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Konten</Label>
                  <Textarea
                    name="content"
                    defaultValue={selectedContent?.content}
                    className="min-h-[150px]"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedContent(null);
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={updateContentMutation.isPending}>
                  {updateContentMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManajemenKonten;
