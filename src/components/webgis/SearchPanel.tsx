
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock search results
const mockLocations = [
  { id: '1', name: 'TPS Pasar Lama', type: 'TPS', area: 'Banjarmasin Tengah', coordinates: [-3.3193, 114.5921] },
  { id: '2', name: 'TPS Jalan Ahmad Yani', type: 'TPS', area: 'Banjarmasin Utara', coordinates: [-3.3280, 114.5891] },
  { id: '3', name: 'TPS Liar Pinggir Sungai', type: 'TPS Liar', area: 'Banjarmasin Selatan', coordinates: [-3.3245, 114.6010] },
  { id: '4', name: 'Bank Sampah Sejahtera', type: 'Bank Sampah', area: 'Banjarmasin Timur', coordinates: [-3.3170, 114.5980] },
  { id: '5', name: 'TPS 3R Banjarmasin Utara', type: 'TPS 3R', area: 'Banjarmasin Utara', coordinates: [-3.3130, 114.5901] },
];

interface SearchPanelProps {
  onClose: () => void;
  onLocationSelect: (coordinates: [number, number]) => void;
}

const SearchPanel = ({ onClose, onLocationSelect }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockLocations>([]);
  const { toast } = useToast();

  const handleSearch = () => {
    // In a real app, this would call an API
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = mockLocations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.area.toLowerCase().includes(query.toLowerCase()) ||
      location.type.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);

    if (filtered.length === 0) {
      toast({
        title: "Pencarian",
        description: "Tidak ada hasil ditemukan",
      });
    }
  };

  const handleSelect = (coordinates: [number, number]) => {
    onLocationSelect(coordinates);
    toast({
      title: "Lokasi dipilih",
      description: "Peta digerakkan ke lokasi yang dipilih",
    });
    onClose();
  };

  return (
    <Card className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-lg p-4 w-80 z-10 backdrop-blur-sm border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Cari Lokasi</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="h-6 w-6 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari lokasi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Cari</Button>
      </div>
      
      {results.length > 0 && (
        <div className="max-h-60 overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-2">{results.length} hasil ditemukan</p>
          <div className="space-y-2">
            {results.map((location) => (
              <div
                key={location.id}
                className="p-2 border rounded-md hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleSelect(location.coordinates as [number, number])}
              >
                <p className="font-medium text-sm">{location.name}</p>
                <p className="text-xs text-muted-foreground">{location.type} - {location.area}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SearchPanel;
