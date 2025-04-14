
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { LayerType } from "@/components/webgis/MapView";
import useWasteSourceData from "@/hooks/useWasteSourceData";

// Import the new components
import PageHeader from "@/components/monitoring-sumber/PageHeader";
import FilterCard from "@/components/monitoring-sumber/FilterCard";
import ViewToggle from "@/components/monitoring-sumber/ViewToggle";
import MapDisplay from "@/components/monitoring-sumber/MapDisplay";
import DataTable from "@/components/monitoring-sumber/DataTable";

const MonitoringSumberSampah = () => {
  const [selectedCity, setSelectedCity] = useState<string>("Banjarmasin");
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeLayers, setActiveLayers] = useState<LayerType[]>([
    'tps',
    'bank-sampah',
    'tps3r'
  ]);

  const {
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
  } = useWasteSourceData();

  const { toast } = useToast();

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

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Page Header Component */}
        <PageHeader 
          handleRefresh={handleRefresh}
          handleExport={handleExport}
          isRefreshing={isRefreshing}
        />

        {/* Filter Card Component */}
        <FilterCard
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedSubdistrict={selectedSubdistrict}
          setSelectedSubdistrict={setSelectedSubdistrict}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          availableSubdistricts={availableSubdistricts}
        />

        {/* View Toggle Component */}
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

        {/* Map or Table Display */}
        {viewMode === 'map' ? (
          <MapDisplay activeLayers={activeLayers} />
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
