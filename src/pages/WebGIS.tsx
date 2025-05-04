import { useState } from "react";
import Navbar from "@/components/Navbar";
import MapContainer from "@/components/map/MapContainer";
import { KelurahanDataProvider } from "@/contexts/KelurahanDataContext";
import { RTDataProvider } from "@/contexts/RTDataContext";
import { PersampahanDataProvider, usePersampahanData } from "@/contexts/PersampahanDataContext";

const WebGISContent = () => {
  const { stats, loading } = usePersampahanData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div id="data-board" className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Total TPS</h3>
              <p className="text-3xl font-bold text-peduli-600 dark:text-peduli-400">
                {loading ? '...' : stats.totalAll}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {!loading && stats.totalTPS3R > 0 && (
                  <span className="text-sm block mt-1">
                    <span className="font-medium">{stats.totalTPS3R}</span> di antaranya adalah TPS3R
                  </span>
                )}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">TPS Liar Teridentifikasi</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">17</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Memerlukan tindak lanjut</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Bank Sampah</h3>
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                {loading ? '...' : stats.totalBankSampah}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Melayani {loading ? '...' : stats.kelurahanBankSampah} kelurahan
              </p>
            </div>
          </div>
          
          <div className="my-8 relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[65vh] md:h-[68vh] lg:h-[72vh] xl:h-[80vh] 2xl:h-[85vh]">
            <MapContainer />
          </div>
          
        </div>
      </div>
      
     </div>
  );
};

const WebGIS = () => {
  return (
    <PersampahanDataProvider>
      <KelurahanDataProvider>
        <RTDataProvider>
          <WebGISContent />
        </RTDataProvider>
      </KelurahanDataProvider>
    </PersampahanDataProvider>
  );
};

export default WebGIS;
