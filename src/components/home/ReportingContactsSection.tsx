
import { ArrowRight, Phone, Megaphone } from "lucide-react";

const ReportingContactsSection = () => {
  return (
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
  );
};

export default ReportingContactsSection;
