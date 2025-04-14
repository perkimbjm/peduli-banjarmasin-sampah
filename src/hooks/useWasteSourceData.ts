import { useState, useEffect, useMemo } from "react";

interface WasteSource {
  id: string;
  name: string;
  type: string;
  district: string;
  subdistrict: string;
  location: string;
  coordinates: [number, number];
}

// Mocked data source
const mockWasteSources: WasteSource[] = [
  // ...data kamu tetap di sini
];

// Static district config
const banjarmasinDistricts = [
  { name: "Banjarmasin Barat", subdistricts: ["Pelambuan", "Belitung Selatan", "Belitung Utara", "Teluk Dalam", "Telawang", "Kuin Cerucuk", "Kuin Selatan", "Basirih", "Basirih Selatan"] },
  { name: "Banjarmasin Selatan", subdistricts: ["Kelayan Barat", "Kelayan Dalam", "Kelayan Timur", "Kelayan Tengah", "Kelayan Selatan", "Murung Raya", "Pekauman", "Pemurus Dalam", "Pemurus Baru", "Tanjung Pagar", "Mantuil", "Basirih Selatan"] },
  { name: "Banjarmasin Tengah", subdistricts: ["Teluk Dalam", "Seberang Mesjid", "Melayu", "Pasar Lama", "Kertak Baru Ilir", "Kertak Baru Ulu", "Gadang", "Kelayan Luar", "Pekapuran Laut", "Sungai Baru", "Antasan Besar", "Kelayan Dalam"] },
  { name: "Banjarmasin Timur", subdistricts: ["Kuripan", "Pengambangan", "Sungai Bilu", "Sungai Lulut", "Kebun Bunga", "Benua Anyar", "Pemurus Luar", "Pekapuran Raya", "Karang Mekar"] },
  { name: "Banjarmasin Utara", subdistricts: ["Alalak Utara", "Alalak Tengah", "Alalak Selatan", "Kuin Utara", "Pangeran", "Sungai Miai", "Antasan Kecil Timur", "Sungai Jingah", "Sungai Andai", "Sungai Mufti"] }
];

const useWasteSourceData = () => {
  // Filters
  const [filters, setFilters] = useState({
    district: "",
    subdistrict: "",
    type: "all",
    group: "all",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Subdistricts available
  const availableSubdistricts = useMemo(() => {
    const district = banjarmasinDistricts.find(d => d.name === filters.district);
    return district ? district.subdistricts : [];
  }, [filters.district]);

  // Apply filtering
  const filteredSources = useMemo(() => {
    return mockWasteSources.filter(source => {
      const matchDistrict = filters.district ? source.district === filters.district : true;
      const matchSubdistrict = filters.subdistrict ? source.subdistrict === filters.subdistrict : true;
      const matchType = filters.type !== "all" ? source.type.toLowerCase().includes(filters.type.toLowerCase()) : true;
      const matchSearch = filters.search
        ? source.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          source.location.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      return matchDistrict && matchSubdistrict && matchType && matchSearch;
    });
  }, [filters]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSources]);

  const totalPages = Math.ceil(filteredSources.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredSources.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return {
    data: currentItems,
    isLoading: false, // bisa ganti true kalau fetch API
    filters,
    setFilters,
    availableSubdistricts,
    pagination: {
      currentPage,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem,
      goToNextPage,
      goToPrevPage
    }
  };
};

export default useWasteSourceData;