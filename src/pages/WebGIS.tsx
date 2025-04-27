import { useState } from "react";
import Navbar from "@/components/Navbar";
import MapContainer from "@/components/map/MapContainer";

const WebGIS = () => {
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
          </div>
          
          <div id="data-board" className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Total TPS</h3>
              <p className="text-3xl font-bold text-peduli-600 dark:text-peduli-400">24</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Tersebar di 5 kecamatan</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">TPS Liar Teridentifikasi</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">17</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Memerlukan tindak lanjut</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Bank Sampah Aktif</h3>
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">8</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Melayani 12 kelurahan</p>
            </div>
          </div>

         
          <div className="my-8 relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[600px]">
            <MapContainer />
          </div>
          
        </div>
      </div>
      
     </div>
  );
};

export default WebGIS;
