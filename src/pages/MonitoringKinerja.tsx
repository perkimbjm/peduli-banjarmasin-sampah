
import React, { useState, useEffect } from "react";
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
  { value: "kec-1", label: "Banjarmasin Utara" },
  { value: "kec-2", label: "Banjarmasin Selatan" },
  { value: "kec-3", label: "Banjarmasin Tengah" },
  { value: "kec-4", label: "Banjarmasin Timur" },
  { value: "kec-5", label: "Banjarmasin Barat" },
];

const kelurahanMapping = {
  "all": [
    { value: "all", label: "Semua Kelurahan" },
  ],
  "kec-1": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "kel-1", label: "Sungai Jingah" },
    { value: "kel-2", label: "Surgi Mufti" },
    { value: "kel-3", label: "Antasan Kecil Timur" },
    { value: "kel-4", label: "Kuin Utara" },
    { value: "kel-5", label: "Pangeran" },
    { value: "kel-6", label: "Sungai Miai" },
  ],
  "kec-2": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "kel-7", label: "Kelayan Barat" },
    { value: "kel-8", label: "Kelayan Dalam" },
    { value: "kel-9", label: "Kelayan Timur" },
    { value: "kel-10", label: "Kelayan Tengah" },
  ],
  "kec-3": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "kel-11", label: "Teluk Dalam" },
    { value: "kel-12", label: "Seberang Mesjid" },
    { value: "kel-13", label: "Melayu" },
  ],
  "kec-4": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "kel-14", label: "Kuripan" },
    { value: "kel-15", label: "Pengambangan" },
    { value: "kel-16", label: "Sungai Bilu" },
  ],
  "kec-5": [
    { value: "all", label: "Semua Kelurahan" },
    { value: "kel-17", label: "Pelambuan" },
    { value: "kel-18", label: "Belitung Selatan" },
    { value: "kel-19", label: "Belitung Utara" },
  ],
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
  const [availableKelurahan, setAvailableKelurahan] = useState(kelurahanMapping["all"]);

  // Update kelurahan options when kecamatan changes
  useEffect(() => {
    if (selectedKecamatan && kelurahanMapping[selectedKecamatan as keyof typeof kelurahanMapping]) {
      setAvailableKelurahan(kelurahanMapping[selectedKecamatan as keyof typeof kelurahanMapping]);
      setSelectedKelurahan("all"); // Reset kelurahan selection when kecamatan changes
    } else {
      setAvailableKelurahan(kelurahanMapping["all"]);
    }
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
            options={availableKelurahan}
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
