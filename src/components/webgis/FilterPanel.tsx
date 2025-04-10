
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface FilterPanelProps {
  onClose: () => void;
  onFilterApply: (filters: any) => void;
}

const FilterPanel = ({ onClose, onFilterApply }: FilterPanelProps) => {
  const [wasteTypes, setWasteTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [area, setArea] = useState<string | undefined>(undefined);
  
  const { toast } = useToast();
  
  const handleWasteTypeToggle = (type: string) => {
    if (wasteTypes.includes(type)) {
      setWasteTypes(wasteTypes.filter(t => t !== type));
    } else {
      setWasteTypes([...wasteTypes, type]);
    }
  };

  const handleApplyFilters = () => {
    const filters = {
      wasteTypes,
      status,
      area
    };
    
    onFilterApply(filters);
    
    toast({
      title: "Filter diterapkan",
      description: "Data peta telah difilter sesuai kriteria",
    });
    
    onClose();
  };

  const handleResetFilters = () => {
    setWasteTypes([]);
    setStatus(undefined);
    setArea(undefined);
    
    toast({
      title: "Reset filter",
      description: "Semua filter telah direset",
    });
    
    onFilterApply({});
  };

  return (
    <Card className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-lg p-4 w-80 z-10 backdrop-blur-sm border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filter Data</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="h-6 w-6 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Jenis Tempat</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="type-tps" 
                checked={wasteTypes.includes('TPS')} 
                onCheckedChange={() => handleWasteTypeToggle('TPS')}
              />
              <Label htmlFor="type-tps">TPS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="type-tps-liar" 
                checked={wasteTypes.includes('TPS Liar')} 
                onCheckedChange={() => handleWasteTypeToggle('TPS Liar')}
              />
              <Label htmlFor="type-tps-liar">TPS Liar</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="type-bank" 
                checked={wasteTypes.includes('Bank Sampah')} 
                onCheckedChange={() => handleWasteTypeToggle('Bank Sampah')}
              />
              <Label htmlFor="type-bank">Bank Sampah</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="type-tps3r" 
                checked={wasteTypes.includes('TPS 3R')} 
                onCheckedChange={() => handleWasteTypeToggle('TPS 3R')}
              />
              <Label htmlFor="type-tps3r">TPS 3R</Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status-select">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status-select">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                <SelectItem value="penuh">Hampir Penuh</SelectItem>
                <SelectItem value="perlu-dibersihkan">Perlu Dibersihkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="area-select">Wilayah</Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger id="area-select">
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banjarmasin-utara">Banjarmasin Utara</SelectItem>
                <SelectItem value="banjarmasin-selatan">Banjarmasin Selatan</SelectItem>
                <SelectItem value="banjarmasin-timur">Banjarmasin Timur</SelectItem>
                <SelectItem value="banjarmasin-barat">Banjarmasin Barat</SelectItem>
                <SelectItem value="banjarmasin-tengah">Banjarmasin Tengah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-6">
        <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
          Reset
        </Button>
        <Button className="flex-1" onClick={handleApplyFilters}>
          Terapkan
        </Button>
      </div>
    </Card>
  );
};

export default FilterPanel;
