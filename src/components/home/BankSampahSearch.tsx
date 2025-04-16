
import { useState } from "react";
import { Search, Building, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface BankSampah {
  id: string;
  name: string;
  address: string;
  kelurahan: string;
  phoneNumber: string;
  wasteTypes: string[];
}

// Mock data - in a real app this would come from an API or database
const bankSampahMockData: BankSampah[] = [
  {
    id: "bs-001",
    name: "Bank Sampah Mekar Sari",
    address: "Jl. Raya Banjar No. 123",
    kelurahan: "Sungai Jingah",
    phoneNumber: "0812-3456-7890",
    wasteTypes: ["Plastik", "Kertas", "Logam"]
  },
  {
    id: "bs-002",
    name: "Bank Sampah Bersih Banjarmasin",
    address: "Jl. Belitung Darat No. 45",
    kelurahan: "Belitung Selatan",
    phoneNumber: "0812-8765-4321",
    wasteTypes: ["Plastik", "Elektronik"]
  },
  {
    id: "bs-003",
    name: "Bank Sampah Sejahtera",
    address: "Jl. Veteran No. 78",
    kelurahan: "Sungai Miai",
    phoneNumber: "0877-1234-5678",
    wasteTypes: ["Plastik", "Kertas", "Kaca"]
  },
  {
    id: "bs-004",
    name: "Bank Sampah Maju Jaya",
    address: "Jl. Ahmad Yani Km 4",
    kelurahan: "Pemurus Dalam",
    phoneNumber: "0857-8765-4321",
    wasteTypes: ["Plastik", "Kertas", "Organik"]
  },
  {
    id: "bs-005",
    name: "Bank Sampah Cahaya Bersih",
    address: "Jl. Pramuka No. 56",
    kelurahan: "Sungai Miai",
    phoneNumber: "0821-2345-6789",
    wasteTypes: ["Plastik", "Logam", "Elektronik"]
  }
];

// List of all kelurahan in Banjarmasin
const kelurahanList = [
  "Sungai Jingah", "Surgi Mufti", "Antasan Kecil Timur", "Kuin Utara", 
  "Pangeran", "Sungai Miai", "Kelayan Barat", "Kelayan Dalam", "Kelayan Timur", 
  "Kelayan Tengah", "Pemurus Dalam", "Pemurus Baru", "Teluk Dalam", "Belitung Selatan",
  "Belitung Utara", "Kuin Cerucuk", "Kuin Selatan", "Basirih", "Basirih Selatan"
];

const BankSampahSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState<string | null>(null);
  const [results, setResults] = useState<BankSampah[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    // Filter bank sampah based on selected kelurahan
    const filteredResults = selectedKelurahan
      ? bankSampahMockData.filter(bank => bank.kelurahan.toLowerCase() === selectedKelurahan.toLowerCase())
      : searchTerm 
        ? bankSampahMockData.filter(bank => 
            bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bank.kelurahan.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];
    
    setResults(filteredResults);
    setHasSearched(true);
  };

  // Filter kelurahan list based on search term for autocomplete
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                {searchTerm && !selectedKelurahan && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border max-h-60 overflow-auto">
                    {filteredKelurahan.length > 0 ? (
                      filteredKelurahan.map((kelurahan) => (
                        <div
                          key={kelurahan}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                          onClick={() => {
                            setSelectedKelurahan(kelurahan);
                            setSearchTerm(kelurahan);
                          }}
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
              <Button onClick={handleSearch} className="shrink-0">
                Cari Bank Sampah
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {hasSearched && (
          <div className="mt-8">
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
                            {bank.address}, Kel. {bank.kelurahan}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <p className="text-sm font-medium">{bank.phoneNumber}</p>
                        </div>
                      </div>
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
                    </CardContent>
                  </div>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800 py-2 px-4 flex justify-end">
                    <Link to={`/bank-sampah/${bank.id}`}>
                      <Button variant="link" className="text-green-600 hover:text-green-700 p-0 h-auto flex items-center">
                        Detail <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BankSampahSearch;
