
import { useState, useEffect } from 'react';
import PageHeader from "@/components/monitoring-sumber/PageHeader";
import FilterCard from "@/components/monitoring-sumber/FilterCard";
import ViewToggle from "@/components/monitoring-sumber/ViewToggle";
import MapView from "@/components/webgis/MapView";
import { LayerType } from "@/components/webgis/data/mock-map-data";
import DataTable from "@/components/monitoring-sumber/DataTable";
import useWasteSourceData from '@/hooks/useWasteSourceData';

const MonitoringSumberSampah = () => {
  const [activeLayers, setActiveLayers] = useState<LayerType[]>(['tps', 'tps-liar']);
  const [view, setView] = useState<'map' | 'table'>('map');
  const { data, isLoading, filters, setFilters } = useWasteSourceData();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this value

  const [isRefreshing, setIsRefreshing] = useState(false);

  const banjarmasinDistricts = [
    { name: "Banjarmasin Barat", subdistricts: ["Pelambuan", "Belitung Selatan", "Belitung Utara", "Teluk Dalam", "Telawang", "Kuin Cerucuk", "Kuin Selatan", "Basirih", "Basirih Selatan"] },
    { name: "Banjarmasin Selatan", subdistricts: ["Kelayan Barat", "Kelayan Dalam", "Kelayan Timur", "Kelayan Tengah", "Kelayan Selatan", "Murung Raya", "Pekauman", "Pemurus Dalam", "Pemurus Baru", "Tanjung Pagar", "Mantuil", "Basirih Selatan"] },
    { name: "Banjarmasin Tengah", subdistricts: ["Teluk Dalam", "Seberang Mesjid", "Melayu", "Pasar Lama", "Kertak Baru Ilir", "Kertak Baru Ulu", "Gadang", "Kelayan Luar", "Pekapuran Laut", "Sungai Baru", "Antasan Besar", "Kelayan Dalam"] },
    { name: "Banjarmasin Timur", subdistricts: ["Kuripan", "Pengambangan", "Sungai Bilu", "Sungai Lulut", "Kebun Bunga", "Benua Anyar", "Pemurus Luar", "Pekapuran Raya", "Karang Mekar"] },
    { name: "Banjarmasin Utara", subdistricts: ["Alalak Utara", "Alalak Tengah", "Alalak Selatan", "Kuin Utara", "Pangeran", "Sungai Miai", "Antasan Kecil Timur", "Sungai Jingah", "Sungai Andai", "Sungai Mufti"] },
    { name: "Semua Kecamatan", subdistricts: [] }
  ];

  // Handle refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulasikan proses refresh
    setTimeout(() => {
      console.log("Data refreshed!");
      setIsRefreshing(false);
    }, 1000);
  };

  // Handle export action
  const handleExport = () => {
    console.log("Data exported!");
  };

  // Handle layer toggle
  const handleLayerToggle = (layer: LayerType) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter(l => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
  };

  // Calculate available subdistricts based on selected district
  const [availableSubdistricts, setAvailableSubdistricts] = useState<string[]>([]);

  useEffect(() => {
    // Find the selected district and get its subdistricts
    const selectedDistrictData = banjarmasinDistricts.find(
      district => district.name === filters.district
    );
    
    // If found and it has subdistricts, set them as available
    if (selectedDistrictData) {
      setAvailableSubdistricts(selectedDistrictData.subdistricts);
    } else {
      // Default: empty array or all subdistricts
      setAvailableSubdistricts([]);
    }
  }, [filters.district]);

  // Calculate pagination values
  const filteredSources = data || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSources.length / itemsPerPage);

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      <PageHeader
        handleRefresh={handleRefresh}
        handleExport={handleExport}
        isRefreshing={isRefreshing}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterCard
            selectedDistrict={filters.district}
            setSelectedDistrict={(val) => setFilters({ ...filters, district: val })}
            selectedSubdistrict={filters.subdistrict}
            setSelectedSubdistrict={(val) => setFilters({ ...filters, subdistrict: val })}
            selectedType={filters.type}
            setSelectedType={(val) => setFilters({ ...filters, type: val })}
            selectedGroup={filters.group}
            setSelectedGroup={(val) => setFilters({ ...filters, group: val })}
            selectedSearch={filters.search}
            setSelectedSearch={(val) => setFilters({ ...filters, search: val })}
            availableSubdistricts={availableSubdistricts}
            banjarmasinDistricts={banjarmasinDistricts}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Data Sumber Sampah</h3>
            <ViewToggle viewMode={view} setViewMode={setView} />
          </div>
          
          {view === 'map' ? (
            <MapView 
              activeLayers={activeLayers}
              fullscreenMode={false}
              splitViewEnabled={false}
            />
          ) : (
            <DataTable 
              currentItems={currentItems}
              currentPage={currentPage}
              totalPages={totalPages}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              filteredSources={filteredSources}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringSumberSampah;
