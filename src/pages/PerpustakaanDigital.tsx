
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Download,
  Search,
  Eye,
  Calendar,
  User,
  FileText,
  Star,
  TrendingUp,
} from "lucide-react";

interface DigitalBook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  type: string;
  thumbnail: string;
  downloadUrl: string;
  readUrl: string;
  publishDate: string;
  pages: number;
  downloads: number;
  views: number;
  rating: number;
  featured: boolean;
}

const mockBooks: DigitalBook[] = [
  {
    id: "1",
    title: "Panduan Lengkap Pengelolaan Sampah Berkelanjutan",
    author: "Dr. Siti Nurhaliza",
    description: "Buku komprehensif tentang strategi pengelolaan sampah yang berkelanjutan dan ramah lingkungan untuk komunitas modern.",
    category: "Panduan",
    type: "E-Book",
    thumbnail: "/placeholder.svg",
    downloadUrl: "#",
    readUrl: "#",
    publishDate: "2024-01-15",
    pages: 245,
    downloads: 1520,
    views: 3240,
    rating: 4.8,
    featured: true
  },
  {
    id: "2",
    title: "Ekonomi Sirkular dalam Pengelolaan Sampah",
    author: "Prof. Ahmad Wijaya",
    description: "Eksplorasi mendalam tentang penerapan prinsip ekonomi sirkular dalam sistem pengelolaan sampah perkotaan.",
    category: "Penelitian",
    type: "Jurnal",
    thumbnail: "/placeholder.svg",
    downloadUrl: "#",
    readUrl: "#",
    publishDate: "2024-02-20",
    pages: 180,
    downloads: 890,
    views: 1850,
    rating: 4.6,
    featured: true
  },
  {
    id: "3",
    title: "Bank Sampah: Model Bisnis Berkelanjutan",
    author: "Linda Sari, M.Si",
    description: "Panduan praktis membangun dan mengelola bank sampah sebagai model bisnis yang berkelanjutan dan menguntungkan.",
    category: "Bisnis",
    type: "E-Book",
    thumbnail: "/placeholder.svg",
    downloadUrl: "#",
    readUrl: "#",
    publishDate: "2024-03-10",
    pages: 156,
    downloads: 750,
    views: 1420,
    rating: 4.7,
    featured: false
  },
  {
    id: "4",
    title: "Teknologi Pengolahan Sampah Modern",
    author: "Ir. Budi Santoso",
    description: "Overview teknologi terbaru dalam pengolahan sampah, dari composting hingga waste-to-energy systems.",
    category: "Teknologi",
    type: "Dokumen",
    thumbnail: "/placeholder.svg",
    downloadUrl: "#",
    readUrl: "#",
    publishDate: "2024-03-25",
    pages: 200,
    downloads: 650,
    views: 1200,
    rating: 4.5,
    featured: false
  },
  {
    id: "5",
    title: "Kebijakan Pengelolaan Sampah Indonesia",
    author: "Dr. Maria Gonzales",
    description: "Analisis komprehensif kebijakan pengelolaan sampah di Indonesia dan perbandingan dengan praktik global.",
    category: "Kebijakan",
    type: "Jurnal",
    thumbnail: "/placeholder.svg",
    downloadUrl: "#",
    readUrl: "#",
    publishDate: "2024-04-05",
    pages: 320,
    downloads: 920,
    views: 2100,
    rating: 4.9,
    featured: true
  },
  {
    id: "6",
    title: "Komposting untuk Pemula",
    author: "Eko Prasetyo",
    description: "Panduan praktis membuat kompos dari sampah organik rumah tangga dengan teknik sederhana dan efektif.",
    category: "Panduan",
    type: "E-Book",
    thumbnail: "/placeholder.svg",
    downloadUrl: "#",
    readUrl: "#",
    publishDate: "2024-04-12",
    pages: 98,
    downloads: 1200,
    views: 2500,
    rating: 4.4,
    featured: false
  }
];

const PerpustakaanDigital = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const categories = ["all", "Panduan", "Penelitian", "Bisnis", "Teknologi", "Kebijakan"];
  const types = ["all", "E-Book", "Jurnal", "Dokumen"];

  const filteredBooks = mockBooks
    .filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
      const matchesType = typeFilter === "all" || book.type === typeFilter;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case "popular":
          return b.downloads - a.downloads;
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const featuredBooks = mockBooks.filter(book => book.featured);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Perpustakaan Digital
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Akses koleksi lengkap e-book, jurnal, dan dokumen tentang pengelolaan sampah dan lingkungan
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockBooks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Koleksi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Download className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockBooks.reduce((sum, book) => sum + book.downloads, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Unduhan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {mockBooks.reduce((sum, book) => sum + book.views, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Pembaca</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {(mockBooks.reduce((sum, book) => sum + book.rating, 0) / mockBooks.length).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Rating Rata-rata</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Books */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Koleksi Unggulan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/20 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-2">
                      {book.category}
                    </Badge>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {book.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {book.rating}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Baca
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Unduh
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Search and Filter */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Jelajahi Koleksi</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul, penulis, atau kata kunci..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "Semua Kategori" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "Semua Tipe" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="popular">Terpopuler</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
                <SelectItem value="title">Judul A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="p-4">
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {book.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {book.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm leading-tight group-hover:text-primary transition-colors">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {book.author}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(book.publishDate).toLocaleDateString('id-ID')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {book.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{book.pages} halaman</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {book.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {book.downloads}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Baca
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Unduh
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada hasil ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah kata kunci pencarian atau filter yang digunakan
              </p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default PerpustakaanDigital;
