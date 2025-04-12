import { ArrowRight, BarChart3, Globe, User,  AlertTriangle, Trash2, ShieldAlert,
  Truck,  Wind,  Biohazard,} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-relaxed">
                Aksi Tanggap Darurat Sampah, <br />Kota Banjarmasin
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-lg">Banjarmasin Memerlukan Kamu. Yuk Gerak Bareng,  Jadi Bagian dari Solusi Cerdas Kelola Sampah dan Buktiin Aksi Nyata Peduli Lingkungan dari Langkah-Langkah Kecil.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" size="lg" className="bg-white hover:bg-white/10 border-white hover:text-white text-peduli-600 text-lg px-8 py-6 transition-color">
                  <Link to="/register">Gabung Sekarang</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white hover:text-white hover:bg-white/10 text-lg px-8 py-6 transition-color dark:bg-gray-200 dark:border-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                  <Link to="/webgis" className="text-peduli-600">Lihat Peta</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-square rounded-full bg-white/10 absolute inset-0 blur-3xl"></div>
                <img src="/hero.png" alt="Manajemen sampah" className="w-full h-auto object-cover rounded-lg shadow-xl relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* New Section: TPA Basirih Closure Information */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    TPA Basirih Ditutup
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Sampah menumpuk, bau, dan berisiko bagi kesehatan kita! Berikut adalah dampak dari penutupan TPA Basirih sejak 1 Februari 2025.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <AlertTriangle className="h-8 w-8 text-yellow-500 dark:text-yellow-400 mb-4" />,
                      title: "Belum Beroperasi Normal",
                      desc: "TPA Basirih belum beroperasi secara normal, menyebabkan penumpukan sampah.",
                      bg: "bg-red-50 dark:bg-red-900/20",
                    },
                    {
                      icon: <Trash2 className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />,
                      title: "Timbunan Sampah",
                      desc: "Timbunan sampah semakin banyak di berbagai titik di kota.",
                      bg: "bg-yellow-50 dark:bg-yellow-900/20",
                    },
                    {
                      icon: <ShieldAlert className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-4" />,
                      title: "Kota Tidak Nyaman",
                      desc: "Pemandangan kota menjadi kotor dan tidak nyaman untuk ditinggali.",
                      bg: "bg-orange-50 dark:bg-orange-900/20",
                    },
                    {
                      icon: <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />,
                      title: "Pengangkutan Terbatas",
                      desc: "Pengangkutan sampah masih sangat terbatas, memperburuk situasi.",
                      bg: "bg-blue-50 dark:bg-blue-900/20",
                    },
                    {
                      icon: <Wind className="h-8 w-8 text-red-600 dark:text-red-400 mb-4" />,
                      title: "Bau Tak Sedap",
                      desc: "Bau tak sedap menyebar, mengganggu kesehatan masyarakat.",
                      bg: "bg-green-50 dark:bg-green-900/20",
                    },
                    {
                      icon: <Biohazard className="h-8 w-8 text-rose-600 dark:text-rose-400 mb-4" />,
                      title: "Risiko Penyakit",
                      desc: "Risiko penyakit meningkat akibat pencemaran lingkungan yang terjadi.",
                      bg: "bg-purple-50 dark:bg-purple-900/20",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`${item.bg} rounded-xl shadow-md p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg group`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-white dark:bg-white/10">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Saatnya Bersama Jaga Lingkungan!
                  </h3>
                  <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
                    Penutupan TPA Basirih bukan hanya masalah pemerintah—ini adalah panggilan untuk kita semua. Mari ambil peran aktif dalam memilah sampah, mengurangi limbah, dan menjaga kebersihan kota.
                  </p>
                  <Link
                    to="/edukasi"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-300"
                  >
                    Pelajari Cara Mengelola Sampah
                  </Link>
                </div>
              </div>
            </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              PeduliSampah hadir dengan berbagai fitur modern untuk mendukung pengelolaan sampah di Banjarmasin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
              <div className="h-12 w-12 bg-peduli-100 dark:bg-peduli-900 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-peduli-600 dark:text-peduli-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">WebGIS Interaktif</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Peta interaktif yang menampilkan data spasial pengelolaan sampah di seluruh Banjarmasin.
              </p>
              <Link to="/webgis" className="text-peduli-600 dark:text-peduli-400 font-medium inline-flex items-center">
                Jelajahi Peta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Analitik Publik</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Visualisasi data dan statistik pengelolaan sampah yang transparan dan mudah diakses.
              </p>
              <Link to="/dashboard-publik" className="text-teal-600 dark:text-teal-400 font-medium inline-flex items-center">
                Lihat Analitik
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Portal Kolaborasi</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Platform untuk berkolaborasi antara masyarakat, pemerintah, dan pemangku kepentingan.
              </p>
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center">
                Bergabung
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      


      {/* Contact Us Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Kirimkan Ide & Kolaborasi
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Kami terbuka untuk kolaborasi dan ide-ide segar. Bersama-sama, kita bisa menciptakan solusi pengelolaan sampah yang lebih baik untuk Banjarmasin.
              </p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Lengkap
                    </label>
                    <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Masukkan nama lengkap Anda" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Alamat email Anda" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subjek
                  </label>
                  <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Subjek pesan Anda" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pesan
                  </label>
                  <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-peduli-500 focus:border-peduli-500 dark:bg-gray-700 dark:text-white" placeholder="Uraikan ide atau kolaborasi yang Anda inginkan" />
                </div>
                <Button type="submit" className="btn-primary">
                  Kirim Pesan
                </Button>
              </form>
            </div>
            <div className="bg-peduli-50 dark:bg-gray-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Pertanyaan Umum
              </h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">Bagaimana cara bergabung dengan PeduliSampah?</AccordionTrigger>
                  <AccordionContent>
                    Anda dapat mendaftar secara gratis melalui halaman pendaftaran. Setelah mendaftar, Anda akan memiliki akses ke semua fitur sesuai dengan peran yang diberikan.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Apa saja peran yang tersedia di PeduliSampah?</AccordionTrigger>
                  <AccordionContent>
                    Terdapat 4 peran: Admin, Leader, Stakeholder, dan Volunteer. Masing-masing memiliki akses dan kemampuan yang berbeda dalam sistem.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Bagaimana cara melaporkan pembuangan sampah ilegal?</AccordionTrigger>
                  <AccordionContent>
                    Setelah login, Anda dapat mengakses fitur Pelaporan Masyarakat di dasbor. Di sana Anda dapat mengirimkan laporan lengkap dengan foto dan lokasi.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Bagaimana data sampah dikumpulkan?</AccordionTrigger>
                  <AccordionContent>
                    Data dikumpulkan melalui laporan masyarakat, pengukuran langsung dari TPS, dan integrasi dengan sistem pengelolaan sampah yang ada di Banjarmasin.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Apakah aplikasi ini gratis?</AccordionTrigger>
                  <AccordionContent>
                    Ya, PeduliSampah dapat diakses secara gratis oleh seluruh masyarakat Banjarmasin. Fitur-fitur dasar tersedia untuk semua pengguna yang terdaftar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Index;