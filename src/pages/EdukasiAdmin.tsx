import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Film,
  MoreVertical,
  PenSquare,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for education content
const mockArticles = [
  {
    id: "1",
    title: "Panduan Dasar Pemilahan Sampah",
    category: "Artikel",
    status: "published",
    type: "Edukasi",
    author: "Admin",
    date: "2025-04-01",
    views: 245,
  },
  {
    id: "2",
    title: "Manfaat Ekonomi dari Bank Sampah",
    category: "Artikel",
    status: "published",
    type: "Kampanye",
    author: "Admin",
    date: "2025-04-03",
    views: 189,
  },
  {
    id: "3",
    title: "Tips Mengurangi Sampah Plastik di Rumah",
    category: "Artikel",
    status: "draft",
    type: "Edukasi",
    author: "Admin",
    date: "2025-04-05",
    views: 0,
  },
  {
    id: "4",
    title: "Kisah Sukses Bank Sampah di Banjarmasin",
    category: "Video",
    status: "published",
    type: "Kampanye",
    author: "Admin",
    date: "2025-04-02",
    views: 325,
  },
  {
    id: "5",
    title: "Workshop Online: Daur Ulang Plastik",
    category: "Video",
    status: "published",
    type: "Edukasi",
    author: "Admin",
    date: "2025-04-04",
    views: 215,
  },
];

// Mock data for campaigns
const mockCampaigns = [
  {
    id: "1",
    title: "Bersih-bersih Sungai Martapura",
    status: "active",
    startDate: "2025-04-15",
    endDate: "2025-05-15",
    participants: 45,
    target: "Masyarakat umum",
  },
  {
    id: "2",
    title: "Bank Sampah untuk Sekolah",
    status: "active",
    startDate: "2025-04-10",
    endDate: "2025-06-10",
    participants: 12,
    target: "Sekolah",
  },
  {
    id: "3",
    title: "Kurangi Penggunaan Plastik Sekali Pakai",
    status: "upcoming",
    startDate: "2025-05-01",
    endDate: "2025-06-01",
    participants: 0,
    target: "Masyarakat umum",
  },
  {
    id: "4",
    title: "Lomba Karya Daur Ulang",
    status: "finished",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    participants: 67,
    target: "Pelajar",
  },
];

const EdukasiAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || article.category === categoryFilter;
    const matchesStatus = !statusFilter || article.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddContent = (event: React.FormEvent) => {
    event.preventDefault();
    setIsAddDialogOpen(false);
    toast({
      title: "Konten berhasil ditambahkan",
      description: "Konten edukasi baru telah ditambahkan ke sistem.",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Konten berhasil dihapus",
      description: "Konten edukasi telah dihapus dari sistem.",
    });
  };

  const handlePublish = (id: string) => {
    toast({
      title: "Konten berhasil dipublikasikan",
      description: "Konten edukasi telah dipublikasikan ke website.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manajemen Edukasi & Kampanye
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
                  Isi formulir berikut untuk menambahkan konten edukasi atau
                  kampanye baru.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddContent}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input id="title" placeholder="Judul konten" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select>
                        <SelectTrigger id="category">
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
                      <Select>
                        <SelectTrigger id="type">
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
                      id="content"
                      placeholder="Tulis konten edukasi di sini..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="thumbnail">Gambar/Thumbnail</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="thumbnail"
                        type="file"
                        className="max-w-xs"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unggah gambar dengan ukuran maksimum 2MB dalam format JPG,
                      PNG, atau WebP.
                    </p>
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
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="content">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="content">Konten Edukasi</TabsTrigger>
            <TabsTrigger value="campaigns">Kampanye Kesadaran</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
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
                        <SelectItem value="artikel">Artikel</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="infografik">Infografik</SelectItem>
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
                        <SelectItem value="draft">Draf</SelectItem>
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
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">
                              {article.title}
                              <div className="text-xs text-muted-foreground mt-1">
                                {article.date} - {article.author}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {article.category === "Artikel" ? (
                                  <FileText className="h-4 w-4" />
                                ) : (
                                  <Film className="h-4 w-4" />
                                )}
                                {article.category}
                              </div>
                            </TableCell>
                            <TableCell>{article.type}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  article.status === "published"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {article.status === "published"
                                  ? "Dipublikasi"
                                  : "Draf"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {article.views.toLocaleString()}
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
                                    onClick={() => {
                                      /* View action */
                                    }}
                                  >
                                    Lihat
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      /* Edit action */
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  {article.status === "draft" && (
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handlePublish(article.id)
                                      }
                                    >
                                      Publikasikan
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => handleDelete(article.id)}
                                  >
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
              <CardFooter>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Daftar Kampanye Kesadaran</CardTitle>
                <CardDescription>
                  Kelola kampanye untuk meningkatkan kesadaran pengelolaan sampah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Judul Kampanye</TableHead>
                        <TableHead className="w-[15%]">Target</TableHead>
                        <TableHead className="w-[15%]">Periode</TableHead>
                        <TableHead className="w-[12%]">Status</TableHead>
                        <TableHead className="w-[10%]">Partisipan</TableHead>
                        <TableHead className="w-[8%] text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">
                            {campaign.title}
                          </TableCell>
                          <TableCell>{campaign.target}</TableCell>
                          <TableCell>
                            {campaign.startDate} s/d {campaign.endDate}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                campaign.status === "active"
                                  ? "default"
                                  : campaign.status === "upcoming"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {campaign.status === "active"
                                ? "Aktif"
                                : campaign.status === "upcoming"
                                ? "Akan Datang"
                                : "Selesai"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {campaign.participants.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Buka menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">
                                  Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Laporan
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                  onClick={() => handleDelete(campaign.id)}
                                >
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenSquare className="h-5 w-5" />
                    Formulir Kampanye Baru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="campaign-title">Judul Kampanye</Label>
                      <Input
                        id="campaign-title"
                        placeholder="Masukkan judul kampanye"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="campaign-desc">Deskripsi</Label>
                      <Textarea
                        id="campaign-desc"
                        placeholder="Deskripsi kampanye"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-date">Tanggal Mulai</Label>
                        <Input id="start-date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-date">Tanggal Selesai</Label>
                        <Input id="end-date" type="date" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="target">Target Partisipan</Label>
                      <Select>
                        <SelectTrigger id="target">
                          <SelectValue placeholder="Pilih target" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="umum">Masyarakat Umum</SelectItem>
                          <SelectItem value="pelajar">Pelajar</SelectItem>
                          <SelectItem value="sekolah">Sekolah</SelectItem>
                          <SelectItem value="komunitas">Komunitas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Simpan Kampanye</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistik Kampanye</CardTitle>
                  <CardDescription>
                    Data statistik dari kampanye kesadaran
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm">
                        Total Kampanye
                      </p>
                      <p className="text-3xl font-bold">4</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-muted-foreground text-sm">
                        Kampanye Aktif
                      </p>
                      <p className="text-3xl font-bold">2</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Kampanye Teratas
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">
                          Bersih-bersih Sungai Martapura
                        </p>
                        <Badge variant="secondary">45 partisipan</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">
                          Lomba Karya Daur Ulang
                        </p>
                        <Badge variant="secondary">67 partisipan</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Partisipasi Berdasarkan Target
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Masyarakat umum</span>
                          <span className="text-sm">45%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: "45%" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Pelajar</span>
                          <span className="text-sm">35%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: "35%" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Sekolah</span>
                          <span className="text-sm">20%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: "20%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EdukasiAdmin;
