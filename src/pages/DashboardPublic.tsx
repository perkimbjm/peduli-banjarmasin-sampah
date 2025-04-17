
import { useState } from "react";
import { DateRange } from "react-day-picker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, Download, Clock, Filter, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WasteSourceChart from "@/components/analytics/WasteSourceChart";
import WasteCompositionAnalytics from "@/components/analytics/WasteCompositionAnalytics";
import WasteCharacteristicsCard from "@/components/analytics/WasteCharacteristicsCard";
import FilterCard from "@/components/analytics/FilterCard";

const DashboardPublic = () => {
  // State for filters
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSubregion, setSelectedSubregion] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 14)),
    to: new Date(),
  });

  // Apply filters function - in a real app this would fetch new data
  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      region: selectedRegion,
      subregion: selectedSubregion,
      dateRange,
    });
    // In a real app, you would fetch new data here
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedRegion("all");
    setSelectedSubregion("all");
    setDateRange({
      from: new Date(new Date().setDate(new Date().getDate() - 14)),
      to: new Date(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Publik</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Visualisasi data pengelolaan sampah di Banjarmasin
            </p>
          </div>
          
          {/* Filter Card */}
          <FilterCard
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedSubregion={selectedSubregion}
            setSelectedSubregion={setSelectedSubregion}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Produksi Sampah Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  127,5 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">ton/hari</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2">
                  <span className="inline-block mr-1">↓</span> 3,2% dibanding bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Kapasitas Pengelolaan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  105,8 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">ton/hari</span>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-2">
                  <span className="inline-block mr-1">!</span> 83% dari total produksi
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Waktu Update Terakhir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <span>3 jam yang lalu</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  6 Juni 2025, 14:30 WITA
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="volume">
            <TabsList className="mb-6">
              <TabsTrigger value="volume" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Volume Sampah
              </TabsTrigger>
              <TabsTrigger value="komposisi" className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Komposisi Sampah
              </TabsTrigger>
              <TabsTrigger value="tren" className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Tren & Analisis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="volume">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Volume Sampah Harian per Kecamatan</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-300">
                            Grafik bar akan ditampilkan di sini
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Kecamatan dengan Volume Tertinggi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-peduli-600 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Banjarmasin Tengah</span>
                          </div>
                          <span className="font-bold">43.2 ton</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-peduli-500 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Banjarmasin Utara</span>
                          </div>
                          <span className="font-bold">31.7 ton</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-peduli-400 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Banjarmasin Barat</span>
                          </div>
                          <span className="font-bold">24.3 ton</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-peduli-300 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Banjarmasin Selatan</span>
                          </div>
                          <span className="font-bold">18.9 ton</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-peduli-200 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Banjarmasin Timur</span>
                          </div>
                          <span className="font-bold">9.4 ton</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="komposisi">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <WasteSourceChart />
                <WasteCompositionAnalytics />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <WasteCharacteristicsCard />
              </div>
            </TabsContent>
            
            <TabsContent value="tren">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tren Volume Sampah (6 Bulan Terakhir)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center p-4">
                        <LineChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-300">
                          Grafik line akan ditampilkan di sini
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Perbandingan Produksi vs Kapasitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-300">
                            Grafik perbandingan akan ditampilkan di sini
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Proyeksi Produksi Sampah</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <LineChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-300">
                            Grafik proyeksi akan ditampilkan di sini
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardPublic;
