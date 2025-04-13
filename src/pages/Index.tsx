import { ArrowRight, BarChart3, Globe, User,  AlertTriangle, Trash2, ShieldAlert,
  Truck,  Wind,  Biohazard, Phone, Megaphone} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32 relative dark:bg-gradient-to-tr dark:from-[#0b1e32d2] dark:via-[#15314d] dark:to-[#264a6c]">
        <div className="absolute inset-0 dark:bg-[url('/assets/stars.png')] dark:opacity-50 pointer-events-none"></div>
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:to-[#0f172a]/40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-relaxed">
                Aksi Tanggap Darurat Sampah<br />Kota Banjarmasin
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-lg">Banjarmasin Memerlukan Kamu. Yuk Gerak Bareng, Jadi Bagian dari Solusi Cerdas Kelola Sampah dan Buktiin Aksi Nyata Peduli Lingkungan dari Langkah-Langkah Kecil.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" size="lg" className="bg-white dark:bg-gray-800 hover:bg-white/10 dark:hover:bg-green-700 border-white hover:text-white text-peduli-600 dark:text-gray-200 text-lg px-8 py-6 transition-color">
                  <Link to="/register">Gabung Sekarang</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white dark:bg-gray-800 hover:bg-white/10 dark:hover:bg-green-700 border-white hover:text-white text-peduli-600 dark:text-gray-200 text-lg px-8 py-6 transition-color">
                  <Link to="/webgis" className="text-peduli-600">Lihat Peta</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-square rounded-full bg-white/10 absolute inset-0 blur-3xl"></div>
                <img src="/assets/hero.png" alt="Manajemen sampah" className="w-full h-auto object-cover rounded-lg shadow-xl relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Section: TPA Basirih Closure Information */}
      <section className="py-20 relative bg-fixed bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-black/80" style={{ backgroundImage: 'url(/assets/tpa.jpeg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Banjarmasin Darurat Sampah
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Sampah menumpuk, bau, dan berisiko bagi kesehatan kita! Berikut adalah berbagai dampak yang terjadi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
                title: "Belum Beroperasi Normal",
                desc: "TPA Basirih belum beroperasi secara normal, kuota TPA Regional terbatas.",
                bg: "bg-white/10 backdrop-blur-sm",
              },
              {
                icon: <Trash2 className="h-8 w-8 text-green-400" />,
                title: "Timbunan Sampah",
                desc: "Timbunan sampah semakin banyak di berbagai titik di kota.",
                bg: "bg-white/10 backdrop-blur-sm",
              },
              {
                icon: <ShieldAlert className="h-8 w-8 text-gray-300" />,
                title: "Kota Tidak Nyaman",
                desc: "Pemandangan kota menjadi kotor dan tidak nyaman untuk ditinggali.",
                bg: "bg-white/10 backdrop-blur-sm",
              },
              {
                icon: <Truck className="h-8 w-8 text-blue-400" />,
                title: "Pengangkutan Terbatas",
                desc: "Pengangkutan sampah masih sangat terbatas, memerlukan upaya ekstra",
                bg: "bg-white/10 backdrop-blur-sm",
              },
              {
                icon: <Wind className="h-8 w-8 text-orange-400" />,
                title: "Bau Tak Sedap",
                desc: "Bau tak sedap menyebar, mengganggu kesehatan masyarakat.",
                bg: "bg-white/10 backdrop-blur-sm",
              },
              {
                icon: <Biohazard className="h-8 w-8 text-rose-400" />,
                title: "Risiko Penyakit",
                desc: "Risiko penyakit meningkat akibat pencemaran lingkungan yang terjadi.",
                bg: "bg-white/10 backdrop-blur-sm",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.bg} rounded-xl shadow-md p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg group border border-white/20`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/30 flex-shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-200">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Saatnya Bersama Jaga Lingkungan!
            </h3>
            <p className="text-xl text-gray-200 max-w-xl mx-auto mb-6">
              Penutupan TPA Basirih bukan hanya masalah pemerintah—ini adalah panggilan untuk kita semua. Mari ambil peran aktif dalam memilah sampah, mengurangi limbah, dan menjaga kebersihan kota.
            </p>
            <Link
              to="/edukasi"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 mx-3 rounded-xl shadow-md transition-all duration-300"
            >
              Pelajari Cara Mengelola Sampah
            </Link>
            <a
              href="#idea"
              className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 mx-3 rounded-xl shadow-md transition-all duration-300 border border-white/20"
            >
              Sumbang Ide dan Kolaborasi
            </a>
          </div>
        </div>
      </section>
      
      {/* Aksi Nyata Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] relative">
        <div className="absolute inset-0 dark:bg-[url('/assets/stars.png')] dark:opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:to-[#0f172a]/80 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Aksi Nyata Yang Bisa Kita Lakukan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Mari berpartisipasi aktif dalam pengelolaan sampah dengan melakukan aksi-aksi nyata berikut:
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">1</span>
                  <h3 className="text-xl font-semibold text-left">Melakukan Aksi 3R (Reduce, Reuse, Recycle)</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Reduce</h4>
                    <p className="text-gray-600 dark:text-gray-300">Mengurangi penggunaan barang yang berpotensi menjadi sampah</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Reuse</h4>
                    <p className="text-gray-600 dark:text-gray-300">Menggunakan kembali barang yang masih bisa dipakai</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Recycle</h4>
                    <p className="text-gray-600 dark:text-gray-300">Mendaur ulang sampah menjadi barang yang bernilai</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">2</span>
                  <h3 className="text-xl font-semibold text-left">Pilah Sampah dari Sumber</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">Mencampur sampah dapat menyebabkan bau dan membuat sampah sulit didaur ulang!</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src="/assets/organik.png" 
                        alt="Sampah Organik" 
                        loading="lazy"
                        className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Sampah Organik</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sisa makanan, sayuran, buah, dan sebagainya yang mudah basi atau membusuk</p>
                    <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">Simpan di ember tertutup</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src="/assets/anorganik.png" 
                        alt="Sampah Anorganik"
                        loading="lazy" 
                        className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Sampah Anorganik</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Plastik, kaca, kertas, kardus, logam, dan sebagainya</p>
                    <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Bersihkan, keringkan, simpan dalam kantong putih/warna</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src="/assets/residu.png" 
                        alt="Sampah Residu"
                        loading="lazy" 
                        className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Sampah Residu</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Popok, pembalut, tisu, puntung rokok, pembalut, dan sebagainya yang tidak bisa diolah lagi</p>
                    <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-600 rounded-lg">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-300">Simpan dalam kantong hitam</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">3</span>
                  <h3 className="text-xl font-semibold text-left">Olah Sampah di Tempat</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-xl">
                      <img 
                        src="/assets/komposter.jpg" 
                        alt="Komposter"
                        loading="lazy" 
                        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-green-600/20 group-hover:bg-green-600/30 transition-colors duration-300"></div>
                    </div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Sampah Organik</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Olah dengan drum komposter, bata terawang, takakura</p>
                  </div>

                  <div className="relative group">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-xl">
                      <img 
                        src="/assets/bank-sampah.jpg" 
                        alt="Bank Sampah"
                        loading="lazy" 
                        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors duration-300"></div>
                    </div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Sampah Anorganik</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Serahkan ke Bank Sampah terdekat</p>
                  </div>

                  <div className="relative group">
                    <div className="aspect-square relative mb-4 overflow-hidden rounded-xl">
                      <img 
                        src="/assets/tps.jpg" 
                        alt="TPS"
                        loading="lazy" 
                        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gray-600/20 group-hover:bg-gray-600/30 transition-colors duration-300"></div>
                    </div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Sampah Residu</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Serahkan ke "Paman Gerobak" atau TPS terdekat</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dengan melakukan aksi nyata ini, kita berkontribusi dalam menciptakan Banjarmasin yang lebih bersih dan berkelanjutan.
              <br />
              <span className="font-semibold text-green-600 dark:text-green-400">Setiap aksi kecil kita memiliki dampak besar!</span>
            </p>
          </div>
        </div>
      </section>
      
      {/* Larangan Section */}
      <section className="py-20 bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:to-[#1e293b] relative">
        <div className="absolute inset-0 dark:bg-[url('/assets/stars.png')] dark:opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:to-[#0f172a]/80 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Setiap Warga, <span className="text-red-600">DILARANG</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Demi menjaga kebersihan dan ketertiban kota Banjarmasin, setiap warga dilarang melakukan hal-hal berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
                title: "Membuang sampah dalam kondisi tidak terpilah",
                desc: "Pastikan sampah sudah dipilah sesuai jenisnya sebelum dibuang",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: "Membuang sampah dari pukul 06.00 - 20.00 WITA",
                desc: "Buanglah sampah pada waktu yang telah ditentukan",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
                title: "Membakar sampah yang tidak sesuai",
                desc: "Pembakaran sampah harus sesuai dengan persyaratan pengelolaan",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
                title: "Membuang sampah tidak pada tempatnya",
                desc: "Gunakan tempat sampah yang telah disediakan",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
                title: "Membuang sampah tidak menggunakan kemasan yang terbungkus rapi",
                desc: "Pastikan sampah terbungkus rapi sebelum dibuang",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
                title: "Mengais sampah di TPS",
                desc: "Dilarang mengais sampah di TPS yang disediakan Pemerintah Kota",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                title: "Membuang sampah di jalan-jalan",
                desc: "Dilarang membuang sampah di jalan, selokan, saluran air, dan badan air",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                title: "Membuat tempat penampungan sementara ilegal",
                desc: "Dilarang membuat TPS di lokasi yang tidak direkomendasikan",
              },
              {
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
                title: "Mengelola sampah tidak sesuai perizinan",
                desc: "Pengelolaan sampah harus sesuai dengan yang ditetapkan dalam perizinan",
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700 group hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 relative">
                    {item.icon}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-red-600/90 dark:text-red-500/90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
                        <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 ml-16">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pelanggaran terhadap larangan di atas dapat dikenakan sanksi sesuai dengan peraturan yang berlaku.
              <br />
              <span className="font-semibold text-red-600 dark:text-red-400">Mari bersama menjaga kebersihan kota Banjarmasin!</span>
            </p>
          </div>
        </div>
      </section>
      
      {/* New Section: Reporting Contacts */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Laporkan Pelanggaran Sampah
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Lihat pembuangan sampah ilegal? Temukan pelanggaran pengelolaan sampah? Laporkan segera untuk Banjarmasin yang lebih bersih dan sehat!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <a 
              href="https://wa.me/6282111271072" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white mb-4 group-hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 1 1 0V15a.5.5 0 0 1-1 0v-5z"></path><path d="M14 10a.5.5 0 0 1 1 0V15a.5.5 0 0 1-1 0v-5z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Laporkan dengan foto dan lokasi melalui WhatsApp untuk respon cepat dari petugas kami.
              </p>
              <span className="inline-flex items-center text-green-700 dark:text-green-400 font-medium">
                Hubungi via WhatsApp
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </a>
            
            <a 
              href="tel:112" 
              className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500 text-white mb-4 group-hover:bg-red-600">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Nomor Darurat 112</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Untuk situasi darurat terkait sampah yang membahayakan atau mengganggu ketertiban umum.
              </p>
              <span className="inline-flex items-center text-red-700 dark:text-red-400 font-medium">
                Telepon 112
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </a>
            
            <a 
              href="https://www.lapor.go.id/instansi/pemerintah-kota-banjarmasin" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white mb-4 group-hover:bg-blue-600">
                <Megaphone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">E-Lapor</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Platform resmi Pemerintah Kota Banjarmasin untuk melaporkan berbagai masalah termasuk masalah persampahan.
              </p>
              <span className="inline-flex items-center text-blue-700 dark:text-blue-400 font-medium">
                Akses E-Lapor
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </a>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Alamat Kantor Pengaduan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Dinas Lingkungan Hidup Kota Banjarmasin</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Jl. R.E Martadinata No.1 Blok D Lt. II<br />
                  Banjarmasin, Kalimantan Selatan<br />
                  Telp: (0511) 3363811<br />
                  Email: dlhkotabjm@gmail.com<br />
                  Jam Kerja: Senin - Kamis, 08.00 - 16.00 WITA, Jumat 08.00 - 10.30 WITA
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Mari selamatkan <span className="font-bold">Banjarmasin dari Darurat Sampah</span>. Setiap laporan Anda sangat berarti untuk Banjarmasin yang lebih bersih dan berkelanjutan."
              </p>
            </div>
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
      <section id="idea" className="py-20 bg-white dark:bg-gray-800">
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
