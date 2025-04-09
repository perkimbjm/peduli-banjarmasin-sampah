
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Layers, MapPin, Info, Filter } from "lucide-react";

const WebGIS = () => {
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Peta Pengelolaan Sampah</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Visualisasi data spasial pengelolaan sampah di Banjarmasin
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
              >
                <Layers className="h-4 w-4 mr-2" />
                Layer
              </Button>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="btn-primary flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Info
              </Button>
            </div>
          </div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[600px]">
            {/* Map Placeholder - This would be replaced with actual map component */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 text-peduli-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                  Peta akan ditampilkan di sini
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Koneksi ke API peta diperlukan untuk menampilkan peta interaktif Banjarmasin
                </p>
              </div>
            </div>
            
            {/* Layers Panel */}
            {isLayersPanelOpen && (
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Lapisan Peta</h3>
                  <button 
                    onClick={() => setIsLayersPanelOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="tps" className="mr-2" defaultChecked />
                    <label htmlFor="tps" className="text-sm text-gray-700 dark:text-gray-300">
                      Tempat Pembuangan Sampah
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="tps-liar" className="mr-2" defaultChecked />
                    <label htmlFor="tps-liar" className="text-sm text-gray-700 dark:text-gray-300">
                      TPS Liar / Ilegal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="bank-sampah" className="mr-2" defaultChecked />
                    <label htmlFor="bank-sampah" className="text-sm text-gray-700 dark:text-gray-300">
                      Bank Sampah
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="tps3r" className="mr-2" defaultChecked />
                    <label htmlFor="tps3r" className="text-sm text-gray-700 dark:text-gray-300">
                      TPS 3R
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="rute" className="mr-2" />
                    <label htmlFor="rute" className="text-sm text-gray-700 dark:text-gray-300">
                      Rute Pengangkutan
                    </label>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                    Batasan Wilayah
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="kecamatan" className="mr-2" defaultChecked />
                      <label htmlFor="kecamatan" className="text-sm text-gray-700 dark:text-gray-300">
                        Batas Kecamatan
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="kelurahan" className="mr-2" />
                      <label htmlFor="kelurahan" className="text-sm text-gray-700 dark:text-gray-300">
                        Batas Kelurahan
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Total TPS</h3>
              <p className="text-3xl font-bold text-peduli-600 dark:text-peduli-400">24</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Tersebar di 5 kecamatan</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">TPS Liar Teridentifikasi</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">17</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Memerlukan tindak lanjut</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Bank Sampah Aktif</h3>
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">8</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Melayani 12 kelurahan</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WebGIS;
