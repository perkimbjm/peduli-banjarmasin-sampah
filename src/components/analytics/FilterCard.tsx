
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ritase/DateRangePicker";
import { Filter, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterCardProps {
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

// Mock data for regions and subregions
const regions = [
  { id: "all", name: "Seluruh Kota" },
  { id: "banjarmasin-tengah", name: "Banjarmasin Tengah" },
  { id: "banjarmasin-utara", name: "Banjarmasin Utara" },
  { id: "banjarmasin-selatan", name: "Banjarmasin Selatan" },
  { id: "banjarmasin-barat", name: "Banjarmasin Barat" },
  { id: "banjarmasin-timur", name: "Banjarmasin Timur" },
];

const subregions: { [key: string]: Array<{ id: string; name: string }> } = {
  "all": [{ id: "all", name: "Semua Kelurahan" }],
  "banjarmasin-tengah": [
    { id: "all-tengah", name: "Semua Kelurahan" },
    { id: "teluk-dalam", name: "Teluk Dalam" },
    { id: "antasan-besar", name: "Antasan Besar" },
    { id: "seberang-mesjid", name: "Seberang Mesjid" },
    { id: "melayu", name: "Melayu" },
  ],
  "banjarmasin-utara": [
    { id: "all-utara", name: "Semua Kelurahan" },
    { id: "sungai-jingah", name: "Sungai Jingah" },
    { id: "antasan-kecil", name: "Antasan Kecil" },
    { id: "surgi-mufti", name: "Surgi Mufti" },
    { id: "alalak", name: "Alalak" },
  ],
  // Add more subregions for other regions as needed
};

const FilterCard = ({ 
  selectedRegion, 
  setSelectedRegion, 
  selectedSubregion, 
  setSelectedSubregion,
  dateRange,
  setDateRange,
  onApplyFilters,
  onResetFilters
}: FilterCardProps) => {
  
  // Handle region change
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    // Reset subregion to the first option of the new selected region
    setSelectedSubregion(subregions[value][0].id);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Data
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-sm" onClick={onResetFilters}>
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <Download className="h-3.5 w-3.5 mr-1" />
              Ekspor
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <div className="space-y-2">
              <Label htmlFor="region">Kecamatan</Label>
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="space-y-2">
              <Label htmlFor="subregion">Kelurahan</Label>
              <Select 
                value={selectedSubregion} 
                onValueChange={setSelectedSubregion} 
                disabled={!subregions[selectedRegion]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelurahan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subregions[selectedRegion]?.map((subregion) => (
                      <SelectItem key={subregion.id} value={subregion.id}>
                        {subregion.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="md:col-span-4">
            <div className="space-y-2">
              <Label>Rentang Waktu</Label>
              <DateRangePicker 
                dateRange={dateRange}
                setDateRange={setDateRange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="md:col-span-2 flex items-end">
            <Button 
              className="w-full bg-peduli-600 hover:bg-peduli-700 text-white"
              onClick={onApplyFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Terapkan Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard;
