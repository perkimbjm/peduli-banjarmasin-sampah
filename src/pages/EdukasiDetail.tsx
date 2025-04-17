
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  ThumbsUp, 
  BookOpen, 
  Calendar, 
  User, 
  FileText, 
  Image as ImageIcon
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - in a real application, this would be fetched from an API
const educationContent = [
  {
    id: "1",
    title: "Panduan Pemilahan Sampah Rumah Tangga",
    author: "Tim Edukasi DLH",
    authorImage: "https://i.pravatar.cc/150?u=tim_dlh",
    date: "2 Mei 2025",
    category: "segregation",
    type: "article",
    coverImage: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    content: `
      <h2>Mengapa Pemilahan Sampah Penting?</h2>
      <p>Pemilahan sampah adalah langkah awal yang sangat penting dalam pengelolaan sampah berkelanjutan. Dengan memilah sampah, kita dapat memaksimalkan daur ulang, mengurangi jumlah sampah yang berakhir di TPA, dan mengurangi dampak lingkungan.</p>
      
      <h2>Langkah-langkah Pemilahan Sampah</h2>
      <ol>
        <li>Siapkan minimal 3 wadah berbeda untuk organik, anorganik yang dapat didaur ulang, dan residu</li>
        <li>Pisahkan sampah organik seperti sisa makanan dan daun</li>
        <li>Kumpulkan sampah anorganik yang dapat didaur ulang seperti kertas, plastik, logam, dan kaca</li>
        <li>Sisihkan sampah residu yang tidak dapat didaur ulang</li>
      </ol>
      
      <h2>Tips Praktis</h2>
      <ul>
        <li>Bilas wadah bekas makanan untuk menghindari bau tidak sedap</li>
        <li>Pipihkan kardus dan botol plastik untuk menghemat ruang</li>
        <li>Pisahkan tutup botol plastik karena terbuat dari jenis plastik yang berbeda</li>
        <li>Gunakan kantong berbeda warna untuk memudahkan identifikasi</li>
      </ul>
      
      <figure>
        <img src="https://images.unsplash.com/photo-1591193686104-fddba4cb0539?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Contoh pemilahan sampah" />
        <figcaption>Contoh pemilahan sampah dengan wadah berbeda warna</figcaption>
      </figure>
    `,
    relatedResources: [
      { title: "Video Tutorial Pemilahan Sampah", type: "video", url: "#" },
      { title: "Infografis Jenis-jenis Plastik", type: "infographic", url: "#" },
      { title: "Buku Panduan Lengkap", type: "document", url: "#" }
    ]
  },
  {
    id: "2",
    title: "Membuat Kompos dari Sampah Dapur",
    author: "Dr. Lingkungan",
    authorImage: "https://i.pravatar.cc/150?u=dr_enviro",
    date: "17 April 2025",
    category: "composting",
    type: "video",
    coverImage: "https://images.unsplash.com/photo-1500044863276-9805de0d9a3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    content: `
      <div class="video-container">
        <div class="placeholder-video">
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <ImageIcon class="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p class="text-gray-600">Video pembelajaran akan ditampilkan di sini</p>
            </div>
          </div>
        </div>
      </div>
      
      <h2>Bahan-bahan yang Dibutuhkan</h2>
      <ul>
        <li>Sampah organik dapur (sisa sayur, buah, ampas kopi)</li>
        <li>Wadah komposter</li>
        <li>Tanah kompos atau activator</li>
        <li>Alat pengaduk</li>
      </ul>
      
      <h2>Langkah-langkah Pembuatan Kompos</h2>
      <ol>
        <li>Siapkan wadah komposter dengan lubang ventilasi</li>
        <li>Masukkan lapisan tanah kompos atau activator</li>
        <li>Tambahkan sampah organik yang telah dipotong kecil-kecil</li>
        <li>Tutup dengan lapisan tanah tipis</li>
        <li>Aduk secara berkala dan jaga kelembaban</li>
      </ol>
      
      <figure>
        <img src="https://images.unsplash.com/photo-1581961356154-5082d61d7573?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Proses pembuatan kompos" />
        <figcaption>Proses pembuatan kompos dari sampah dapur</figcaption>
      </figure>
    `,
    relatedResources: [
      { title: "Panduan Lengkap Komposting", type: "article", url: "#" },
      { title: "Infografis Jenis Sampah untuk Kompos", type: "infographic", url: "#" }
    ]
  },
  {
    id: "3",
    title: "Inovasi Produk Daur Ulang",
    author: "Tim Kreativitas",
    authorImage: "https://i.pravatar.cc/150?u=tim_creative",
    date: "5 April 2025",
    category: "recycling",
    type: "article",
    coverImage: "https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    content: `
      <h2>Revolusi Daur Ulang</h2>
      <p>Produk daur ulang telah mengalami revolusi dalam beberapa tahun terakhir. Dari sekadar barang kerajinan tangan, kini produk daur ulang telah berevolusi menjadi barang bernilai ekonomi tinggi dengan kualitas setara produk baru.</p>
      
      <figure class="infographic">
        <img src="https://images.unsplash.com/photo-1562684600-71d5e47c5321?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Contoh produk daur ulang" />
        <figcaption>Berbagai produk daur ulang berkualitas tinggi</figcaption>
      </figure>
      
      <h2>Kategori Produk Daur Ulang</h2>
      <h3>1. Fashion dan Aksesori</h3>
      <p>Tas, dompet, dan perhiasan dari bahan daur ulang seperti ban bekas, bungkus plastik, dan tutup botol.</p>
      
      <h3>2. Furnitur</h3>
      <p>Meja, kursi, dan rak dari kayu palet bekas atau bahan konstruksi daur ulang.</p>
      
      <h3>3. Perlengkapan Rumah Tangga</h3>
      <p>Peralatan makan, vas bunga, dan dekorasi rumah dari botol kaca atau kaleng bekas.</p>
      
      <h3>4. Material Bangunan</h3>
      <p>Papan komposit, ubin, dan material konstruksi dari plastik daur ulang dan agregat daur ulang.</p>
      
      <figure>
        <img src="https://images.unsplash.com/photo-1582408921715-18e7806365c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Furnitur daur ulang" />
        <figcaption>Furnitur dari bahan daur ulang yang stylish</figcaption>
      </figure>
    `,
    relatedResources: [
      { title: "Katalog Produk Daur Ulang", type: "document", url: "#" },
      { title: "Video Proses Pembuatan", type: "video", url: "#" }
    ]
  },
  {
    id: "4",
    title: "Mengurangi Sampah Plastik Sekali Pakai",
    author: "Komunitas Zero Waste",
    authorImage: "https://i.pravatar.cc/150?u=zero_waste",
    date: "28 Maret 2025",
    category: "reduction",
    type: "infographic",
    coverImage: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    content: `
      <div class="infographic-container">
        <img src="https://images.unsplash.com/photo-1597106776019-7a0792228427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Infografis sampah plastik" class="w-full rounded-lg" />
      </div>
      
      <h2>Fakta Tentang Sampah Plastik</h2>
      <ul class="stats-list">
        <li><strong>8 juta ton</strong> sampah plastik masuk ke lautan setiap tahun</li>
        <li><strong>400 tahun</strong> waktu yang dibutuhkan plastik untuk terurai</li>
        <li><strong>91%</strong> plastik tidak didaur ulang</li>
        <li><strong>500 miliar</strong> kantong plastik digunakan di seluruh dunia setiap tahun</li>
      </ul>
      
      <h2>Alternatif Pengganti Plastik Sekali Pakai</h2>
      <div class="alternatives-grid">
        <div class="alternative-item">
          <h3>Sedotan Plastik</h3>
          <p>Diganti dengan sedotan stainless steel, bambu, atau kertas</p>
        </div>
        <div class="alternative-item">
          <h3>Kantong Plastik</h3>
          <p>Diganti dengan tas belanja kain yang dapat digunakan berkali-kali</p>
        </div>
        <div class="alternative-item">
          <h3>Botol Plastik</h3>
          <p>Diganti dengan tumbler atau botol minum yang dapat dipakai ulang</p>
        </div>
        <div class="alternative-item">
          <h3>Wadah Makanan</h3>
          <p>Diganti dengan kotak makan dari stainless steel atau kaca</p>
        </div>
      </div>
      
      <figure>
        <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Alternatif plastik sekali pakai" />
        <figcaption>Berbagai alternatif pengganti produk plastik sekali pakai</figcaption>
      </figure>
    `,
    relatedResources: [
      { title: "Panduan Gaya Hidup Zero Waste", type: "article", url: "#" },
      { title: "Direktori Toko Ramah Lingkungan", type: "document", url: "#" }
    ]
  }
];

const EdukasiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchContent = () => {
      const foundContent = educationContent.find(item => item.id === id);
      setContent(foundContent || null);
    };
    
    fetchContent();
  }, [id]);

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">Materi edukasi tidak ditemukan.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-5 w-5" />;
      case "video":
        return <ImageIcon className="h-5 w-5" />;
      case "infographic":
        return <FileText className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "article":
        return "bg-blue-500";
      case "video":
        return "bg-red-500";
      case "infographic":
        return "bg-amber-500";
      case "document":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header/Hero Section */}
        <header className="relative overflow-hidden h-[50vh] max-h-[500px] min-h-[300px]">
          <div className="absolute inset-0 z-0">
            <img 
              src={content.coverImage} 
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <Link to="/edukasi" className="inline-flex items-center text-white mb-4 hover:text-white/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Edukasi
              </Link>
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className={`${getBadgeColor(content.type)} text-white`}>
                  <span className="flex items-center">
                    {getTypeIcon(content.type)}
                    <span className="ml-1 capitalize">{content.type}</span>
                  </span>
                </Badge>
                
                <Badge variant="outline" className="bg-white/10 text-white border-transparent">
                  {content.category.charAt(0).toUpperCase() + content.category.slice(1)}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {content.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80 text-sm">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={content.authorImage} alt={content.author} />
                    <AvatarFallback>{content.author[0]}</AvatarFallback>
                  </Avatar>
                  <span>{content.author}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{content.date}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Article Content */}
            <div className="lg:col-span-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:p-10">
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-peduli-600 dark:prose-a:text-peduli-400"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
                
                <div className="flex flex-wrap items-center gap-4 mt-12 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <Button variant="outline" className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    <span>Bermanfaat</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    <span>Bagikan</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center ml-auto">
                    <Download className="h-4 w-4 mr-2" />
                    <span>Unduh Materi</span>
                  </Button>
                </div>
              </div>
              
              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={content.authorImage} alt={content.author} />
                      <AvatarFallback>{content.author[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">{content.author}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Penulis konten edukasi pengelolaan sampah dengan pengalaman lebih dari 5 tahun
                        di bidang lingkungan hidup dan pengelolaan limbah.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4">
              {/* Related Content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Materi Terkait</h3>
                <div className="space-y-4">
                  {content.relatedResources.map((resource: any, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-2">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{resource.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <Button className="w-full" variant="outline">Lihat Semua Materi</Button>
              </div>
              
              {/* Popular Content */}
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Materi Populer</h3>
                <div className="space-y-3">
                  {educationContent.slice(0, 3).map((item) => (
                    <Link to={`/edukasi/${item.id}`} key={item.id} className="flex gap-3 group">
                      <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0">
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-peduli-600">{item.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {item.author}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Subscribe Box */}
              <div className="mt-8 bg-peduli-50 dark:bg-peduli-900/20 rounded-xl p-6 border border-peduli-100 dark:border-peduli-800">
                <h3 className="text-lg font-medium mb-2">Dapatkan Pembaruan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Langganan untuk mendapatkan materi edukasi terbaru.
                </p>
                <form>
                  <input 
                    type="email"
                    placeholder="Alamat email Anda"
                    className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 mb-3"
                  />
                  <Button className="w-full bg-peduli-600 hover:bg-peduli-700 text-white">
                    Langganan
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
        
        {/* Related Articles Section */}
        <section className="bg-gray-100 dark:bg-gray-800/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Artikel Serupa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {educationContent.filter(item => item.id !== id).slice(0, 3).map(item => (
                <Link to={`/edukasi/${item.id}`} key={item.id} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.coverImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center mb-3">
                        <Badge className={`${getBadgeColor(item.type)} text-white`}>
                          <span className="flex items-center text-xs">
                            {getTypeIcon(item.type)}
                            <span className="ml-1 capitalize">{item.type}</span>
                          </span>
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{item.date}</span>
                      </div>
                      
                      <h3 className="font-bold mb-2 group-hover:text-peduli-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={item.authorImage} alt={item.author} />
                          <AvatarFallback>{item.author[0]}</AvatarFallback>
                        </Avatar>
                        <span>{item.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default EdukasiDetail;
