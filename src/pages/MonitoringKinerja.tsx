import React, { useState, useMemo } from "react";
import { 
  Building, 
  Building2, 
  BarChart3, 
  Recycle,
  MapPin,
  Users,
  BarChart,
  PieChart
} from "lucide-react";
import { DateRangeSelector } from "@/components/kinerja/DateRangeSelector";
import { RegionSelector } from "@/components/kinerja/RegionSelector";
import { PerformanceStatCard } from "@/components/kinerja/PerformanceStatCard";
import { RegionProgressBar } from "@/components/kinerja/RegionProgressBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const kecamatanOptions = [
  { value: "all", label: "Semua Kecamatan" },
  { value: "utara", label: "Banjarmasin Utara" },
  { value: "selatan", label: "Banjarmasin Selatan" },
  { value: "tengah", label: "Banjarmasin Tengah" },
  { value: "timur", label: "Banjarmasin Timur" },
  { value: "barat", label: "Banjarmasin Barat" },
];

// Real kelurahan data based on kecamatan
const kelurahanData = {
  "utara": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "alalak-utara", label: "Alalak Utara" },
    { value: "alalak-selatan", label: "Alalak Selatan" },
    { value: "alalak-tengah", label: "Alalak Tengah" },
    { value: "kuin-utara", label: "Kuin Utara" },
    { value: "kuin-selatan", label: "Kuin Selatan" },
    { value: "sungai-miai", label: "Sungai Miai" },
    { value: "pangeran", label: "Pangeran" },
    { value: "sungai-jingah", label: "Sungai Jingah" },
    { value: "surgi-mufti", label: "Surgi Mufti" },
  ],
  "selatan": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "basirih", label: "Basirih" },
    { value: "basirih-selatan", label: "Basirih Selatan" },
    { value: "kelayan-barat", label: "Kelayan Barat" },
    { value: "kelayan-selatan", label: "Kelayan Selatan" },
    { value: "kelayan-tengah", label: "Kelayan Tengah" },
    { value: "kelayan-timur", label: "Kelayan Timur" },
    { value: "murung-raya", label: "Murung Raya" },
    { value: "pekauman", label: "Pekauman" },
    { value: "pemurus-baru", label: "Pemurus Baru" },
    { value: "pemurus-dalam", label: "Pemurus Dalam" },
    { value: "tanjung-pagar", label: "Tanjung Pagar" },
  ],
  "tengah": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "antasan-kecil-timur", label: "Antasan Kecil Timur" },
    { value: "gadang", label: "Gadang" },
    { value: "kelayan-dalam", label: "Kelayan Dalam" },
    { value: "kertak-baru-ilir", label: "Kertak Baru Ilir" },
    { value: "kertak-baru-ulu", label: "Kertak Baru Ulu" },
    { value: "mawar", label: "Mawar" },
    { value: "melayu", label: "Melayu" },
    { value: "pasar-lama", label: "Pasar Lama" },
    { value: "seberang-masjid", label: "Seberang Masjid" },
    { value: "sungai-baru", label: "Sungai Baru" },
    { value: "telawang", label: "Telawang" },
    { value: "teluk-dalam", label: "Teluk Dalam" },
  ],
  "timur": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "karang-mekar", label: "Karang Mekar" },
    { value: "kebun-bunga", label: "Kebun Bunga" },
    { value: "kuripan", label: "Kuripan" },
    { value: "pekapuran-raya", label: "Pekapuran Raya" },
    { value: "pengambangan", label: "Pengambangan" },
    { value: "sungai-bilu", label: "Sungai Bilu" },
    { value: "sungai-lulut", label: "Sungai Lulut" },
  ],
  "barat": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "belitung-selatan", label: "Belitung Selatan" },
    { value: "belitung-utara", label: "Belitung Utara" },
    { value: "kuin-cerucuk", label: "Kuin Cerucuk" },
    { value: "pelambuan", label: "Pelambuan" },
    { value: "telaga-biru", label: "Telaga Biru" },
    { value: "teluk-tiram", label: "Teluk Tiram" },
  ]
};

// Mock data for the regions
const regionData = [
  {
    id: "bandung",
    name: "Kota Bandung",
    logo: "/lovable-uploads/1245d5e8-34dc-4410-a413-56fdb5ac7030.png",
    type: "kelurahan",
    completed: 123,
    total: 151,
    percentage: 81.46,
    waste: {
      generated: 23885.38,
      processed: 31188.26,
      generatedChange: 628.10,
      processedChange: 1002.23,
      lastUpdate: "11 Apr 2025",
    }
  },
  {
    id: "cimahi",
    name: "Kota Cimahi",
    logo: "/lovable-uploads/1245d5e8-34dc-4410-a413-56fdb5ac7030.png",
    type: "kelurahan",
    completed: 1,
    total: 15,
    percentage: 6.67,
    waste: {
      generated: 0,
      processed: 0,
      generatedChange: 0,
      processedChange: 0,
      lastUpdate: "No data",
    }
  },
  {
    id: "kab-bandung",
    name: "Kabupaten Bandung",
    logo: "/lovable-uploads/1245d5e8-34dc-4410-a413-56fdb5ac7030.png",
    type: "kecamatan",
    completed: 9,
    total: 31,
    percentage: 29.03,
    waste: {
      generated: 3168.82,
      processed: 2910.36,
      generatedChange: null,
      processedChange: null,
      lastUpdate: "27 Mar 2025",
    }
  },
  {
    id: "bandung-barat",
    name: "Kab. Bandung Barat",
    logo: "/lovable-uploads/1245d5e8-34dc-4410-a413-56fdb5ac7030.png",
    type: "desa",
    completed: 0,
    total: 165,
    percentage: 0,
    waste: {
      generated: 0,
      processed: 0,
      generatedChange: 0,
      processedChange: 0,
      lastUpdate: "No data",
    }
  },
];

// Analytics data for additional metrics
const additionalMetrics = {
  bankSampah: 35,
  bankSampahChange: 16.7,
  sosialisasi: 124,
  sosialisasiChange: 8.3,
  lahanTersedia: 18,
  lahanChange: 5.9,
  komunitas: 42,
  komunitasChange: 10.5
};

export default function MonitoringKinerja() {
  const [dateRange, setDateRange] = useState("30d");
  const [viewMode, setViewMode] = useState("overview");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [selectedKelurahan, setSelectedKelurahan] = useState("all");

  // Get kelurahan options based on selected kecamatan
  const kelurahanOptions = useMemo(() => {
    if (selectedKecamatan === "all") {
      return [{ value: "all", label: "Semua Kelurahan" }];
    }
    return kelurahanData[selectedKecamatan as keyof typeof kelurahanData] || [{ value: "all", label: "Semua Kelurahan" }];
  }, [selectedKecamatan]);

  // Reset kelurahan when kecamatan changes
  React.useEffect(() => {
    setSelectedKelurahan("all");
  }, [selectedKecamatan]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Kinerja Kewilayahan</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <DateRangeSelector 
            dateRange={dateRange} 
            onChangeDateRange={setDateRange} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <RegionSelector
            value={selectedKecamatan}
            onChange={setSelectedKecamatan}
            options={kecamatanOptions}
            placeholder="Kecamatan"
            className="w-full md:w-auto"
          />
          <RegionSelector
            value={selectedKelurahan}
            onChange={setSelectedKelurahan}
            options={kelurahanOptions}
            placeholder="Kelurahan"
            className="w-full md:w-auto"
          />
        </div>

        <Tabs defaultValue="kinerja" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="kinerja">Kinerja Input Data</TabsTrigger>
            <TabsTrigger value="sampah">Pengelolaan Sampah</TabsTrigger>
            <TabsTrigger value="fasilitas">Fasilitas & Sosialisasi</TabsTrigger>
          </TabsList>

          <TabsContent value="kinerja" className="space-y-6 mt-6">
            {regionData.map((region) => (
              <div key={region.id} className="border rounded-lg p-6 bg-white dark:bg-gray-950">
                <RegionProgressBar
                  completed={region.completed}
                  total={region.total}
                  percentage={region.percentage}
                  regionName={region.type === "kelurahan" ? "Kelurahan" : region.type === "kecamatan" ? "Kecamatan" : "Desa"}
                  regionLogo={region.logo}
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="sampah" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {regionData.map((region) => (
                <div key={`waste-${region.id}`} className="border rounded-lg p-6 bg-white dark:bg-gray-950">
                  <h3 className="text-lg font-semibold mb-4">{region.name}</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <PerformanceStatCard
                      title="Timbulan Sampah (Ton)"
                      value={region.waste.generated.toLocaleString()}
                      changePercentage={region.waste.generatedChange || 0}
                      lastUpdate={region.waste.lastUpdate}
                      icon={<BarChart className="h-8 w-8" />}
                    />
                    <PerformanceStatCard
                      title="Sampah Terolah (Ton)"
                      value={region.waste.processed.toLocaleString()}
                      changePercentage={region.waste.processedChange || 0}
                      lastUpdate={region.waste.lastUpdate}
                      icon={<Recycle className="h-8 w-8" />}
                      valueColor="text-green-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fasilitas" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <PerformanceStatCard
                title="Bank Sampah"
                value={additionalMetrics.bankSampah}
                changePercentage={additionalMetrics.bankSampahChange}
                icon={<Building2 className="h-8 w-8" />}
              />
              <PerformanceStatCard
                title="Sosialisasi"
                value={additionalMetrics.sosialisasi}
                subtitle="kegiatan"
                changePercentage={additionalMetrics.sosialisasiChange}
                icon={<Users className="h-8 w-8" />}
              />
              <PerformanceStatCard
                title="Lahan Disediakan"
                value={additionalMetrics.lahanTersedia}
                subtitle="lokasi"
                changePercentage={additionalMetrics.lahanChange}
                icon={<MapPin className="h-8 w-8" />}
              />
              <PerformanceStatCard
                title="Komunitas Aktif"
                value={additionalMetrics.komunitas}
                subtitle="komunitas"
                changePercentage={additionalMetrics.komunitasChange}
                icon={<Users className="h-8 w-8" />}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
