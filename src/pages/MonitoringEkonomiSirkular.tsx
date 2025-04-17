
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { circularEconomyData } from "@/lib/mock-data";
import { StatCard } from "@/components/ekonomi-sirkular/StatCard";
import { DigitalBankCard } from "@/components/ekonomi-sirkular/DigitalBankCard";
import { WasteCompositionChart } from "@/components/ekonomi-sirkular/WasteCompositionChart";
import { BankSampahTable } from "@/components/ekonomi-sirkular/BankSampahTable";
import { Building, CircleDollarSign, Recycle, Truck, Users } from "lucide-react";

const MonitoringEkonomiSirkular = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("Semua Kecamatan");
  const [selectedDateRange, setSelectedDateRange] = useState("Jan 1, 2025 - Apr 14, 2025");

  // Get data from our mock data
  const { 
    facilityCounts, 
    statistics, 
    wasteComposition, 
    bankSampahData, 
    districts 
  } = circularEconomyData;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Monitoring Ekonomi Sirkular</h1>
        <p className="text-muted-foreground">
          Pantau perkembangan ekonomi sirkular pengelolaan sampah di Kota Banjarmasin
        </p>
      </header>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-400 text-white p-4 rounded-md">
          <label className="block text-sm font-medium mb-1">Kecamatan</label>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="bg-white/20 border-white/20 text-white">
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-amber-400 text-white p-4 rounded-md">
          <label className="block text-sm font-medium mb-1">Rentang Waktu</label>
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="bg-white/20 border-white/20 text-white">
              <SelectValue placeholder="Pilih Rentang Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jan 1, 2025 - Apr 14, 2025">Jan 1, 2025 - Apr 14, 2025</SelectItem>
              <SelectItem value="Jan 1, 2024 - Dec 31, 2024">Jan 1, 2024 - Dec 31, 2024</SelectItem>
              <SelectItem value="Jan 1, 2023 - Dec 31, 2023">Jan 1, 2023 - Dec 31, 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Facility Count Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              TPA Basirih
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <p className="text-2xl font-bold">{facilityCounts.tpa}</p>
            <p className="text-xs text-muted-foreground">Lokasi</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center">
              <Recycle className="h-4 w-4 mr-2" />
              TPS 3R
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <p className="text-2xl font-bold">{facilityCounts.tps3r}</p>
            <p className="text-xs text-muted-foreground">Lokasi</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              TPS Terpadu
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <p className="text-2xl font-bold">{facilityCounts.tpsTerpadu}</p>
            <p className="text-xs text-muted-foreground">Lokasi</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center">
              <Recycle className="h-4 w-4 mr-2" />
              Pusat Daur Ulang
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <p className="text-2xl font-bold">{facilityCounts.pusatDaurUlang}</p>
            <p className="text-xs text-muted-foreground">Lokasi</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Bank Sampah
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <p className="text-2xl font-bold">{facilityCounts.bankSampah}</p>
            <p className="text-xs text-muted-foreground">Lokasi</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Stats and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left - Waste composition chart */}
        <Card className="md:col-span-1">
          <CardContent className="p-4 h-full">
            <WasteCompositionChart data={wasteComposition} />
          </CardContent>
        </Card>

        {/* Middle - Digital bank card */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex items-center justify-center h-full">
            <DigitalBankCard 
              value={statistics.bankSampahDigital.value}
              total={statistics.bankSampahDigital.total}
              percentage={statistics.bankSampahDigital.percentage}
              source={statistics.bankSampahDigital.source}
            />
          </CardContent>
        </Card>

        {/* Right - Stats cards */}
        <div className="space-y-4">
          <StatCard
            title="Sampah Terkelola (Ton)"
            value={statistics.sampahTerkelola.value}
            unit={statistics.sampahTerkelola.unit}
            change={statistics.sampahTerkelola.change}
            period={statistics.sampahTerkelola.period}
            borderColor="border-amber-200"
          />
          
          <StatCard
            title="Circular Economy (Milyar)"
            value={statistics.ekonomiSirkular.value}
            prefix={statistics.ekonomiSirkular.prefix}
            change={statistics.ekonomiSirkular.change}
            period={statistics.ekonomiSirkular.period}
            borderColor="border-green-200"
          />
          
          <StatCard
            title="Partisipasi Masyarakat"
            value={statistics.partisipasiMasyarakat.value}
            subtitle={statistics.partisipasiMasyarakat.label}
            change={statistics.partisipasiMasyarakat.change}
            period={statistics.partisipasiMasyarakat.period}
            borderColor="border-blue-200"
          />
        </div>
      </div>

      {/* Bank Sampah Table Section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold flex items-center">
          <Building className="h-5 w-5 mr-2" /> 
          Data Bank Sampah
        </h2>
        <BankSampahTable data={bankSampahData} />
      </div>

      {/* Footer info */}
      <div className="text-xs text-muted-foreground mt-8 flex justify-between">
        <span>Data Last Updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        <span>Sumber: Dinas Lingkungan Hidup Kota Banjarmasin</span>
      </div>
    </div>
  );
};

export default MonitoringEkonomiSirkular;
