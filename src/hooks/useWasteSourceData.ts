
import { useState, useEffect } from "react";

interface WasteSource {
  id: string;
  name: string;
  type: string; 
  district: string;
  subdistrict: string;
  location: string;
  coordinates: [number, number];
}

// Mock data
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

const useWasteSourceData = () => {
  const [filteredSources, setFilteredSources] = useState<WasteSource[]>(mockWasteSources);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchInput, setSearchInput] = useState<string>("");
  const [availableSubdistricts, setAvailableSubdistricts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Define districts
  const banjarmasinDistricts = [
    { name: "Banjarmasin Barat", subdistricts: ["Pelambuan", "Belitung Selatan", "Belitung Utara", "Teluk Dalam", "Telawang", "Kuin Cerucuk", "Kuin Selatan", "Basirih", "Basirih Selatan"] },
    { name: "Banjarmasin Selatan", subdistricts: ["Kelayan Barat", "Kelayan Dalam", "Kelayan Timur", "Kelayan Tengah", "Kelayan Selatan", "Murung Raya", "Pekauman", "Pemurus Dalam", "Pemurus Baru", "Tanjung Pagar", "Mantuil", "Basirih Selatan"] },
    { name: "Banjarmasin Tengah", subdistricts: ["Teluk Dalam", "Seberang Mesjid", "Melayu", "Pasar Lama", "Kertak Baru Ilir", "Kertak Baru Ulu", "Gadang", "Kelayan Luar", "Pekapuran Laut", "Sungai Baru", "Antasan Besar", "Kelayan Dalam"] },
    { name: "Banjarmasin Timur", subdistricts: ["Kuripan", "Pengambangan", "Sungai Bilu", "Sungai Lulut", "Kebun Bunga", "Benua Anyar", "Pemurus Luar", "Pekapuran Raya", "Karang Mekar"] },
    { name: "Banjarmasin Utara", subdistricts: ["Alalak Utara", "Alalak Tengah", "Alalak Selatan", "Kuin Utara", "Pangeran", "Sungai Miai", "Antasan Kecil Timur", "Sungai Jingah", "Sungai Andai", "Sungai Mufti"] }
  ];

  // Update available subdistricts when district changes
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

  // Filter sources based on selections
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

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSources.length / itemsPerPage);

  // Pagination functions
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return {
    selectedDistrict,
    setSelectedDistrict,
    selectedSubdistrict,
    setSelectedSubdistrict,
    selectedType,
    setSelectedType,
    selectedGroup,
    setSelectedGroup,
    searchInput,
    setSearchInput,
    availableSubdistricts,
    filteredSources,
    currentPage,
    currentItems,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    goToNextPage,
    goToPrevPage,
  };
};

export default useWasteSourceData;
