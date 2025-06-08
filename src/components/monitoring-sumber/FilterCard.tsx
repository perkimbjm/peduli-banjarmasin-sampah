
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

interface FilterCardProps {
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  selectedSubdistrict: string;
  setSelectedSubdistrict: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  selectedSearch: string;
  setSelectedSearch: (value: string) => void;
  availableSubdistricts: string[];
  banjarmasinDistricts: { name: string, subdistricts: string[] }[];
}

const banjarmasinDistricts = [
  { name: "Banjarmasin Barat", subdistricts: ["Pelambuan", "Belitung Selatan", "Belitung Utara", "Teluk Dalam", "Telawang", "Kuin Cerucuk", "Kuin Selatan", "Basirih", "Basirih Selatan"] },
  { name: "Banjarmasin Selatan", subdistricts: ["Kelayan Barat", "Kelayan Dalam", "Kelayan Timur", "Kelayan Tengah", "Kelayan Selatan", "Murung Raya", "Pekauman", "Pemurus Dalam", "Pemurus Baru", "Tanjung Pagar", "Mantuil", "Basirih Selatan"] },
  { name: "Banjarmasin Tengah", subdistricts: ["Teluk Dalam", "Seberang Mesjid", "Melayu", "Pasar Lama", "Kertak Baru Ilir", "Kertak Baru Ulu", "Gadang", "Kelayan Luar", "Pekapuran Laut", "Sungai Baru", "Antasan Besar", "Kelayan Dalam"] },
  { name: "Banjarmasin Timur", subdistricts: ["Kuripan", "Pengambangan", "Sungai Bilu", "Sungai Lulut", "Kebun Bunga", "Benua Anyar", "Pemurus Luar", "Pekapuran Raya", "Karang Mekar"] },
  { name: "Banjarmasin Utara", subdistricts: ["Alalak Utara", "Alalak Tengah", "Alalak Selatan", "Kuin Utara", "Pangeran", "Sungai Miai", "Antasan Kecil Timur", "Sungai Jingah", "Sungai Andai", "Sungai Mufti"] },
  { name: "Semua Kecamatan", subdistricts: [] }
];

const wasteSourceTypes = [
  { value: "all", label: "Semua Jenis" },
  { value: "sumber-sampah", label: "Sumber Sampah" },
  { value: "bank-sampah", label: "Bank Sampah" },
  { value: "tpst", label: "TPST" },
  { value: "tps-3r", label: "TPS 3R" },
  { value: "pengolahan-sampah", label: "Pengolahan Sampah Organik" },
  { value: "lainnya", label: "Lainnya" }
];

const FilterCard = ({
  selectedDistrict,
  setSelectedDistrict,
  selectedSubdistrict,
  setSelectedSubdistrict,
  selectedType,
  setSelectedType,
  selectedGroup,
  setSelectedGroup,
  selectedSearch,
  setSelectedSearch,
  availableSubdistricts,
  banjarmasinDistricts,
}: FilterCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filter Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Row 1: Kecamatan and Kelurahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Kecamatan
            </label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua-kecamatan">Semua Kecamatan</SelectItem>
                {banjarmasinDistricts.map((district) => (
                  <SelectItem key={district.name} value={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Kelurahan
            </label>
            <Select
              value={selectedSubdistrict}
              onValueChange={setSelectedSubdistrict}
              disabled={!selectedDistrict || selectedDistrict === "semua-kecamatan"}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Kelurahan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua-kelurahan">Semua Kelurahan</SelectItem>
                {availableSubdistricts.map((subdistrict) => (
                  <SelectItem key={subdistrict} value={subdistrict}>
                    {subdistrict}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Jenis and Kelompok */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Jenis
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Jenis" />
              </SelectTrigger>
              <SelectContent>
                {wasteSourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Kelompok
            </label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Kelompok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelompok</SelectItem>
                <SelectItem value="masyarakat">Masyarakat</SelectItem>
                <SelectItem value="pemerintah">Pemerintah</SelectItem>
                <SelectItem value="swasta">Swasta</SelectItem>
                <SelectItem value="komunitas">Komunitas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Cari Lokasi
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama lokasi..."
              className="pl-10 h-10"
              value={selectedSearch}
              onChange={(e) => setSelectedSearch(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterCard;
