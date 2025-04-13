import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Map as MapIcon, Table, Download, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { mapWasteSourcesData } from "@/lib/mock-data";
import MapView from "@/components/webgis/MapView";
import { LayerType } from "@/components/webgis/FilterPanel";

type WasteSourceType = 'all' | 'sumber-sampah' | 'bank-sampah' | 'tpst' | 'tps-3r' | 'pengolahan-sampah' | 'lainnya';

interface WasteSource {
  id: string;
  name: string;
  type: string; 
  district: string; // kecamatan
  subdistrict: string; // kelurahan
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
}

const mockWasteSources: WasteSource[] = [
  { 
    id: "1", 
    name: "TPS Pasar Baru", 
    type: "TPS", 
    district: "Banjarmasin Tengah", 
    subdistrict: "Teluk Dalam", 
    location: "Jl. Pasar Baru",
    coordinates: [-3.319, 114.592]
  },
  { 
    id: "2", 
    name: "Bank Sampah Bersih", 
    type: "Bank Sampah", 
    district: "Banjarmasin Utara", 
    subdistrict: "Sungai Jingah", 
    location: "Jl. Sungai Jingah",
    coordinates: [-3.310, 114.595]
  },
  { 
    id: "3", 
    name: "TPST Telawang", 
    type: "TPST", 
    district: "Banjarmasin Barat", 
    subdistrict: "Telawang", 
    location: "Jl. Telawang",
    coordinates: [-3.330, 114.580]
  },
  { 
    id: "4", 
    name: "TPS 3R Mantuil", 
    type: "TPS 3R", 
    district: "Banjarmasin Selatan", 
    subdistrict: "Mantuil", 
    location: "Jl. Mantuil",
    coordinates: [-3.340, 114.590]
  },
  { 
    id: "5", 
    name: "Pengolahan Kompos Kayutangi", 
    type: "Pengolahan Sampah Organik", 
    district: "Banjarmasin Timur", 
    subdistrict: "Kayutangi", 
    location: "Jl. Kayutangi",
    coordinates: [-3.320, 114.610]
  }
];

const banjarmasinDistricts = [
  { name: "Banjarmasin Barat", subdistricts: ["Pelambuan", "Belitung Selatan", "Belitung Utara", "Teluk Dalam", "Telawang", "Kuin Cerucuk", "Kuin Selatan", "Basirih", "Basirih Selatan"] },
  { name: "Banjarmasin Selatan", subdistricts: ["Kelayan Barat", "Kelayan Dalam", "Kelayan Timur", "Kelayan Tengah", "Kelayan Selatan", "Murung Raya", "Pekauman", "Pemurus Dalam", "Pemurus Baru", "Tanjung Pagar", "Mantuil", "Basirih Selatan"] },
  { name: "Banjarmasin Tengah", subdistricts: ["Teluk Dalam", "Seberang Mesjid", "Melayu", "Pasar Lama", "Kertak Baru Ilir", "Kertak Baru Ulu", "Gadang", "Kelayan Luar", "Pekapuran Laut", "Sungai Baru", "Antasan Besar", "Kelayan Dalam"] },
  { name: "Banjarmasin Timur", subdistricts: ["Kuripan", "Pengambangan", "Sungai Bilu", "Sungai Lulut", "Kebun Bunga", "Benua Anyar", "Pemurus Luar", "Pekapuran Raya", "Karang Mekar"] },
  { name: "Banjarmasin Utara", subdistricts: ["Alalak Utara", "Alalak Tengah", "Alalak Selatan", "Kuin Utara", "Pangeran", "Sungai Miai", "Antasan Kecil Timur", "Sungai Jingah", "Sungai Andai", "Sungai Mufti"] }
];

const wasteSourceTypes = [
  { value: "all", label: "Semua Jenis" },
  { value: "sumber-sampah", label: "Sumber Sampah" },
  { value: "bank-sampah", label: "Bank Sampah" },
  { value: "tpst", label: "TPST" },
  { value: "tps-3r", label: "TPS 3R" },
  { value: "pengolahan-sampah", label: "Pengolahan Sampah Organik" },
  { value: "lainnya", label: "Lainnya" }
];

const MonitoringSumberSampah = () => {
  const [selectedCity, setSelectedCity] = useState<string>("Banjarmasin");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredSources, setFilteredSources] = useState<WasteSource[]>(mockWasteSources);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [availableSubdistricts, setAvailableSubdistricts] = useState<string[]>([]);
  const [activeLayers, setActiveLayers] = useState<LayerType[]>([
    LayerType.TPS,
    LayerType.BankSampah,
    LayerType.TPS3R
  ]);

  const { toast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    if (selectedDistrict) {
      const district = banjarmasinDistricts.find(d => d.name === selectedDistrict);
      if (district) {
        setAvailableSubdistricts(district.subdistricts);
      } else {
        setAvailableSubdistricts([]);
      }
    } else {
      setAvailableSubdistricts([]);
    }
    setSelectedSubdistrict("");
  }, [selectedDistrict]);

  useEffect(() => {
    let filtered = mockWasteSources;

    if (selectedDistrict) {
      filtered = filtered.filter(source => source.district === selectedDistrict);
    }

    if (selectedSubdistrict) {
      filtered = filtered.filter(source => source.subdistrict === selectedSubdistrict);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(source => source.type.toLowerCase().includes(selectedType.toLowerCase()));
    }

    if (searchInput) {
      const searchLower = searchInput.toLowerCase();
      filtered = filtered.filter(
        source => source.name.toLowerCase().includes(searchLower) || 
                 source.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSources(filtered);
    setCurrentPage(1);
  }, [selectedDistrict, selectedSubdistrict, selectedType, selectedGroup, searchInput]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSources.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data diperbarui",
        description: "Data sumber sampah dan fasilitas telah diperbarui",
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Ekspor Data",
      description: "Mengekspor data ke Excel...",
    });
    
    setTimeout(() => {
      toast({
        title: "Berhasil",
        description: "Data berhasil diekspor ke Excel",
      });
    }, 1500);
  };

  const getActiveLayers = () => {
    return activeLayers;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Monitoring Sumber Sampah dan Fasilitas</h1>
            <p className="text-muted-foreground">
              Pantau dan analisis sebaran sumber sampah dan fasilitas pengelolaan sampah di Banjarmasin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kota/Kabupaten</label>
                <Select value={selectedCity} onValueChange={setSelectedCity} disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kota/Kabupaten" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Banjarmasin">Banjarmasin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Kecamatan</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kecamatan</SelectItem>
                    {banjarmasinDistricts.map((district) => (
                      <SelectItem key={district.name} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Kelurahan</label>
                <Select 
                  value={selectedSubdistrict} 
                  onValueChange={setSelectedSubdistrict}
                  disabled={!selectedDistrict}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kelurahan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kelurahan</SelectItem>
                    {availableSubdistricts.map((subdistrict) => (
                      <SelectItem key={subdistrict} value={subdistrict}>
                        {subdistrict}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Jenis</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteSourceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Kelompok</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kelompok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelompok</SelectItem>
                    <SelectItem value="masyarakat">Masyarakat</SelectItem>
                    <SelectItem value="pemerintah">Pemerintah</SelectItem>
                    <SelectItem value="swasta">Swasta</SelectItem>
                    <SelectItem value="komunitas">Komunitas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Lokasi</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari lokasi..."
                    className="pl-8"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'map' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="h-4 w-4 mr-2" />
            Peta
          </Button>
          <Button
            variant={viewMode === 'table' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="h-4 w-4 mr-2" />
            Tabel
          </Button>
        </div>

        {viewMode === 'map' ? (
          <Card className="border rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[600px]">
                <MapView 
                  activeLayers={getActiveLayers()} 
                  fullscreenMode={false}
                  splitViewEnabled={false}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">No.</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kota/Kabupaten</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kecamatan</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kelurahan</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Jenis</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Lokasi</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {currentItems.map((source, index) => (
                        <tr key={source.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{indexOfFirstItem + index + 1}</td>
                          <td className="p-4 align-middle">Banjarmasin</td>
                          <td className="p-4 align-middle">{source.district}</td>
                          <td className="p-4 align-middle">{source.subdistrict}</td>
                          <td className="p-4 align-middle">{source.type}</td>
                          <td className="p-4 align-middle font-medium">{source.name}</td>
                          <td className="p-4 align-middle">{source.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {totalPages > 0 ? (
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSources.length)} dari {filteredSources.length} data
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous Page</span>
                        </Button>
                        <div className="text-sm font-medium">
                          Halaman {currentPage} dari {totalPages}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next Page</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                      Tidak ada data yang ditemukan
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground flex items-center justify-between border-t pt-2">
          <div>
            Data Last Updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
          <div>
            Sumber Data: Dinas Lingkungan Hidup Kota Banjarmasin
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MonitoringSumberSampah;
