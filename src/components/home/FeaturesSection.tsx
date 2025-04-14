
import { Link } from "react-router-dom";
import { ArrowRight, Globe, BarChart3, User } from "lucide-react";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
