import { useState, useEffect } from "react";
import { Search, Building, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface BankSampah {
  id: string;
  name: string;
  address?: string;
  kelurahan: string;
  kecamatan: string;
  phoneNumber?: string;
  wasteTypes?: string[];
  coordinates?: [number, number]; // [longitude, latitude]
}

// Interface untuk GeoJSON Feature
interface BankSampahFeature {
  type: string;
  properties: {
    ID: number;
    Nama: string;
    KELURAHAN?: string;
    KECAMATAN?: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

// Jenis sampah default sementara (karena tidak ada di GeoJSON)
const defaultWasteTypes = ["Plastik", "Kertas", "Logam"];

const BankSampahSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState<string | null>(null);
  const [results, setResults] = useState<BankSampah[]>([]);
  const [bankSampahData, setBankSampahData] = useState<BankSampah[]>([]);
  const [kelurahanList, setKelurahanList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data dari GeoJSON
  useEffect(() => {
    const fetchBankSampahData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data-map/bank_sampah.geojson');
        const data = await response.json();
        
        // Transformasi data GeoJSON ke format BankSampah
        const bankSampahList = data.features.map((feature: BankSampahFeature) => ({
          id: String(feature.properties.ID),
          name: feature.properties.Nama,
          address: "",
          kelurahan: feature.properties.KELURAHAN || "Tidak diketahui",
          kecamatan: feature.properties.KECAMATAN || "Tidak diketahui",
          phoneNumber: "", // Tidak ada di GeoJSON, bisa ditambahkan nanti
          wasteTypes: defaultWasteTypes, // Default waste types
          coordinates: feature.geometry.coordinates as [number, number]
        }));
        
        setBankSampahData(bankSampahList);
        
        // Ekstrak daftar kelurahan unik
        const uniqueKelurahan = [...new Set(
          bankSampahList
            .map(bank => bank.kelurahan)
            .filter(kelurahan => kelurahan && kelurahan !== "Tidak diketahui")
        )] as string[];
        
        setKelurahanList(uniqueKelurahan.sort());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bank sampah data:", error);
        setIsLoading(false);
      }
    };
    
    fetchBankSampahData();
  }, []);

  // Filter hasil berdasarkan pencarian
  useEffect(() => {
    const filteredResults = selectedKelurahan
      ? bankSampahData.filter(bank => bank.kelurahan.toLowerCase() === selectedKelurahan.toLowerCase())
      : searchTerm 
        ? bankSampahData.filter(bank => 
            bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.kelurahan.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];
    
    setResults(filteredResults);
  }, [searchTerm, selectedKelurahan, bankSampahData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedKelurahan(null);
  };

  const handleKelurahanSelect = (kelurahan: string) => {
    setSelectedKelurahan(kelurahan);
    setSearchTerm(kelurahan);
  };

  // Filter kelurahan list berdasarkan search term untuk autocomplete
  const filteredKelurahan = kelurahanList.filter(
    kelurahan => kelurahan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Temukan Bank Sampah di Sekitar Anda
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Masukkan nama kelurahan Anda untuk melihat bank sampah terdekat dan kontribusi dalam menjaga lingkungan.
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Cari Bank Sampah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="Masukkan nama kelurahan..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled={isLoading}
                />
                {searchTerm && !selectedKelurahan && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border max-h-60 overflow-auto">
                    {filteredKelurahan.length > 0 ? (
                      filteredKelurahan.map((kelurahan) => (
                        <div
                          key={kelurahan}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                          onClick={() => handleKelurahanSelect(kelurahan)}
                        >
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          {kelurahan}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">Tidak ada kelurahan yang cocok</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Memuat data bank sampah...</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-4">
                {results.length > 0 
                  ? `${results.length} Bank Sampah ditemukan ${selectedKelurahan ? `di ${selectedKelurahan}` : ''}`
                  : `Tidak ada Bank Sampah ditemukan ${selectedKelurahan ? `di ${selectedKelurahan}` : ''}`
                }
              </h3>
              
              <div className="grid gap-4">
                {results.map((bank) => (
                  <Card key={bank.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 flex items-center justify-center md:w-16">
                        <Building className="h-8 w-8" />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{bank.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {bank.address ? bank.address + ", " : ""} 
                              Kel. {bank.kelurahan}, Kec. {bank.kecamatan}
                            </p>
                          </div>
                          {bank.phoneNumber && (
                            <div className="mt-2 md:mt-0">
                              <p className="text-sm font-medium">{bank.phoneNumber}</p>
                            </div>
                          )}
                        </div>
                        {bank.wasteTypes && bank.wasteTypes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm mb-1">Jenis Sampah yang Diterima:</p>
                            <div className="flex flex-wrap gap-2">
                              {bank.wasteTypes.map((type, index) => (
                                <Badge key={index} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
                    <CardFooter className="bg-gray-50 dark:bg-gray-800 py-2 px-4 flex justify-end">
                      <Link to={`/bank/${bank.id}`}>
                        <Button variant="link" className="text-green-600 hover:text-green-700 p-0 h-auto flex items-center">
                          Detail <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BankSampahSearch;
