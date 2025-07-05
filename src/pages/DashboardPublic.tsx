import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart, Download, Clock, Filter, Trash2, Building } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KinerjaPengelolaanSampahTab from "@/components/dashboard/KinerjaPengelolaanSampahTab";
import SumberSampahTab from "@/components/dashboard/SumberSampahTab";

const DashboardPublic = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Publik</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Visualisasi data pengelolaan sampah di Banjarmasin
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Unduh Data
              </Button>
            </div>
          </div>
          
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
            <TabsList
              className="mb-6 flex overflow-x-auto whitespace-nowrap flex-nowrap gap-2 px-1 py-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <TabsTrigger value="volume" className="flex items-center min-w-[140px] justify-center px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors focus:outline-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800">
                <BarChart className="h-4 w-4 mr-2" />
                Volume Sampah
              </TabsTrigger>
              <TabsTrigger value="komposisi" className="flex items-center min-w-[140px] justify-center px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors focus:outline-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800">
                <PieChart className="h-4 w-4 mr-2" />
                Komposisi Sampah
              </TabsTrigger>
              <TabsTrigger value="sumber" className="flex items-center min-w-[140px] justify-center px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors focus:outline-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800">
                <Trash2 className="h-4 w-4 mr-2" />
                Sumber Sampah
              </TabsTrigger>
              <TabsTrigger value="tren" className="flex items-center min-w-[140px] justify-center px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors focus:outline-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800">
                <LineChart className="h-4 w-4 mr-2" />
                Tren & Analisis
              </TabsTrigger>
              <TabsTrigger value="kinerja" className="flex items-center min-w-[180px] justify-center px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors focus:outline-none data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800">
                <Building className="h-4 w-4 mr-2" />
                Kinerja Pengelolaan Sampah
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

            <TabsContent value="sumber">
              <SumberSampahTab />
            </TabsContent>
            
            <TabsContent value="komposisi">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Komposisi Sampah</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-center p-4">
                          <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 dark:text-gray-300">
                            Grafik pie akan ditampilkan di sini
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-blue-500 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Organik</span>
                          </div>
                          <span className="font-medium">61%</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-green-500 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Plastik</span>
                          </div>
                          <span className="font-medium">15%</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-yellow-500 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Kertas</span>
                          </div>
                          <span className="font-medium">10%</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-red-500 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Logam</span>
                          </div>
                          <span className="font-medium">6%</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="bg-purple-500 h-3 w-3 rounded-full mr-2"></span>
                            <span className="text-gray-900 dark:text-gray-100">Lainnya</span>
                          </div>
                          <span className="font-medium">8%</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Potensi Pengelolaan Berdasarkan Jenis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b dark:border-gray-700">
                              <th className="text-left py-3 px-4">Jenis Sampah</th>
                              <th className="text-center py-3 px-4">Volume (ton/hari)</th>
                              <th className="text-center py-3 px-4">% Terdaur Ulang</th>
                              <th className="text-center py-3 px-4">Metode Pengelolaan</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b dark:border-gray-700">
                              <td className="py-3 px-4 flex items-center">
                                <span className="bg-blue-500 h-3 w-3 rounded-full mr-2"></span>
                                Organik
                              </td>
                              <td className="text-center py-3 px-4">77.8</td>
                              <td className="text-center py-3 px-4">45%</td>
                              <td className="text-center py-3 px-4">Kompos & Biogas</td>
                            </tr>
                            <tr className="border-b dark:border-gray-700">
                              <td className="py-3 px-4 flex items-center">
                                <span className="bg-green-500 h-3 w-3 rounded-full mr-2"></span>
                                Plastik
                              </td>
                              <td className="text-center py-3 px-4">19.1</td>
                              <td className="text-center py-3 px-4">32%</td>
                              <td className="text-center py-3 px-4">Daur Ulang</td>
                            </tr>
                            <tr className="border-b dark:border-gray-700">
                              <td className="py-3 px-4 flex items-center">
                                <span className="bg-yellow-500 h-3 w-3 rounded-full mr-2"></span>
                                Kertas
                              </td>
                              <td className="text-center py-3 px-4">12.8</td>
                              <td className="text-center py-3 px-4">68%</td>
                              <td className="text-center py-3 px-4">Daur Ulang</td>
                            </tr>
                            <tr className="border-b dark:border-gray-700">
                              <td className="py-3 px-4 flex items-center">
                                <span className="bg-red-500 h-3 w-3 rounded-full mr-2"></span>
                                Logam
                              </td>
                              <td className="text-center py-3 px-4">7.7</td>
                              <td className="text-center py-3 px-4">82%</td>
                              <td className="text-center py-3 px-4">Daur Ulang</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 flex items-center">
                                <span className="bg-purple-500 h-3 w-3 rounded-full mr-2"></span>
                                Lainnya
                              </td>
                              <td className="text-center py-3 px-4">10.1</td>
                              <td className="text-center py-3 px-4">17%</td>
                              <td className="text-center py-3 px-4">TPA & Insinerasi</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Permasalahan Utama</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 flex items-start">
                          <Trash2 className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-red-700 dark:text-red-300">TPS Liar</h4>
                            <p className="text-sm text-red-600/70 dark:text-red-300/70">
                              17 lokasi teridentifikasi di seluruh kota
                            </p>
                          </div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 flex items-start">
                          <Trash2 className="h-5 w-5 text-orange-500 dark:text-orange-400 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-orange-700 dark:text-orange-300">Kapasitas TPA</h4>
                            <p className="text-sm text-orange-600/70 dark:text-orange-300/70">
                              Diperkirakan penuh dalam 2 tahun
                            </p>
                          </div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start">
                          <Trash2 className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Sampah Plastik</h4>
                            <p className="text-sm text-yellow-600/70 dark:text-yellow-300/70">
                              Pertumbuhan 8% per tahun
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
            
            <TabsContent value="kinerja">
              <KinerjaPengelolaanSampahTab />
            </TabsContent>
            
          </Tabs>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardPublic;
