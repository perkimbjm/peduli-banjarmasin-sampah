
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
