
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Video, FileText, Download, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Edukasi = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const eduCategories = [
    { id: "all", name: "Semua" },
    { id: "composting", name: "Komposting" },
    { id: "recycling", name: "Daur Ulang" },
    { id: "reduction", name: "Reduksi Sampah" },
    { id: "segregation", name: "Pemilahan" },
    { id: "awareness", name: "Kesadaran" }
  ];
  
  const [activeCategory, setActiveCategory] = useState("all");
  
  const educationContent = [
    {
      id: "1",
      title: "Panduan Pemilahan Sampah Rumah Tangga",
      description: "Cara praktis melakukan pemilahan sampah di rumah dengan metode 3R - Reduce, Reuse, Recycle.",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "segregation",
      type: "article",
      date: "2 Mei 2025"
    },
    {
      id: "2",
      title: "Membuat Kompos dari Sampah Dapur",
      description: "Tutorial lengkap cara membuat kompos dari sisa makanan dan sampah organik rumah tangga.",
      image: "https://images.unsplash.com/photo-1500044863276-9805de0d9a3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "composting",
      type: "video",
      date: "17 April 2025"
    },
    {
      id: "3",
      title: "Inovasi Produk Daur Ulang",
      description: "Mengenal berbagai produk kreatif yang bisa dibuat dari sampah plastik dan bahan daur ulang.",
      image: "https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "recycling",
      type: "article",
      date: "5 April 2025"
    },
    {
      id: "4",
      title: "Mengurangi Sampah Plastik Sekali Pakai",
      description: "Tips praktis untuk mengurangi penggunaan plastik sekali pakai dalam kehidupan sehari-hari.",
      image: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "reduction",
      type: "infographic",
      date: "28 Maret 2025"
    },
    {
      id: "5",
      title: "Bank Sampah: Mengubah Sampah Jadi Rupiah",
      description: "Panduan lengkap tentang cara kerja bank sampah dan bagaimana masyarakat bisa memanfaatkannya.",
      image: "https://images.unsplash.com/photo-1562684600-71d5e47c5321?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "awareness",
      type: "article",
      date: "15 Maret 2025"
    },
    {
      id: "6",
      title: "Workshop Daur Ulang Kertas",
      description: "Video tutorial cara mendaur ulang kertas bekas menjadi kertas baru yang ramah lingkungan.",
      image: "https://images.unsplash.com/photo-1553531370-36204bda640c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      category: "recycling",
      type: "video",
      date: "2 Maret 2025"
    }
  ];
  
  // Filter education content based on active category and search query
  const filteredContent = educationContent.filter(content => {
    const matchesCategory = activeCategory === "all" || content.category === activeCategory;
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Function to get icon based on content type
  const getTypeIcon = (type) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "infographic":
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-peduli-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Edukasi Pengelolaan Sampah</h1>
              <p className="text-lg text-white/90 mb-8">
                Pelajari cara mengelola sampah dengan benar melalui konten edukatif yang kami sediakan.
              </p>
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari materi edukasi..."
                  className="pl-10 bg-white text-gray-900 border-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-peduli-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {eduCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id ? "bg-peduli-600 hover:bg-peduli-700" : ""}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* Education Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContent.map((content) => (
                <Card key={content.id} className="overflow-hidden card-hover border-0 shadow-md">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={content.image} 
                      alt={content.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={`
                        ${content.type === 'article' ? 'bg-blue-500' : ''}
                        ${content.type === 'video' ? 'bg-red-500' : ''}
                        ${content.type === 'infographic' ? 'bg-amber-500' : ''}
                        text-white
                      `}>
                        <span className="flex items-center">
                          {getTypeIcon(content.type)}
                          <span className="ml-1 capitalize">{content.type}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{content.title}</CardTitle>
                    <CardDescription>{content.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{content.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/edukasi/${content.id}`} className="w-full">
                      <Button className="bg-peduli-600 hover:bg-peduli-700 text-white w-full">
                        {content.type === 'video' ? 'Tonton Video' : 'Baca Selengkapnya'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Tidak ada konten yang sesuai dengan filter yang dipilih.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Featured Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Materi Unduhan</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Dapatkan materi edukasi pengelolaan sampah yang dapat diunduh dan dibagikan
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center">
                  <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 mb-4">
                    <FileText className="h-12 w-12 mx-auto text-peduli-600 dark:text-peduli-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Panduan Pengelolaan Sampah #{item}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                    PDF - 2.4 MB
                  </p>
                  <Button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800">
                    <Download className="mr-2 h-4 w-4" />
                    Unduh PDF
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Video Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Video Edukasi Terbaru</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Tonton video edukatif tentang pengelolaan sampah dan praktik ramah lingkungan
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Link to="/edukasi/2" className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-16 w-16 text-gray-400" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                  <h3 className="text-lg font-semibold">Tutorial Komposting di Rumah</h3>
                  <p className="text-sm text-gray-300">Durasi: 12:34 • 1.2K views</p>
                </div>
              </Link>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <Link to={`/edukasi/${item}`} key={item} className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden flex">
                    <div className="bg-gray-200 dark:bg-gray-600 w-1/3 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="p-3 w-2/3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                        Video Tutorial #{item}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        8:12 • 845 views
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button className="bg-peduli-600 hover:bg-peduli-700 text-white">
                Lihat Semua Video
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Edukasi;
