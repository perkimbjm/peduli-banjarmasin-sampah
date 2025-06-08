
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarIcon } from "lucide-react";

// Districts in Banjarmasin
const banjarmasinDistricts = [
  "Banjarmasin Utara",
  "Banjarmasin Selatan", 
  "Banjarmasin Timur",
  "Banjarmasin Barat",
  "Banjarmasin Tengah"
];

const data = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Aug", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Sep", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Oct", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Nov", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Dec", uv: 1890, pv: 4800, amt: 2181 },
];

const MonitoringRitase = () => {
  const [selectedRegion, setSelectedRegion] = useState("Banjarmasin Utara");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });
  const [truckId, setTruckId] = useState("");

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Pilih tanggal";
    if (!range.to) return range.from.toLocaleDateString("id-ID");
    return `${range.from.toLocaleDateString("id-ID")} - ${range.to.toLocaleDateString("id-ID")}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Monitoring Ritase</h1>
        <p className="text-muted-foreground">
          Pantau ritase kendaraan pengangkut sampah di Kota Banjarmasin
        </p>
      </header>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="region">Wilayah</Label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Pilih wilayah" />
              </SelectTrigger>
              <SelectContent>
                {banjarmasinDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Periode Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange(dateRange)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="truck-id">ID Kendaraan</Label>
            <Input 
              id="truck-id" 
              placeholder="Masukkan ID Kendaraan" 
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button className="w-full">Cari</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Ritase</CardTitle>
            <CardDescription>Jumlah total ritase yang tercatat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">125</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jarak Tempuh Total</CardTitle>
            <CardDescription>Total jarak yang ditempuh kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3,500 KM</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waktu Operasional</CardTitle>
            <CardDescription>Total waktu operasional kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">240 Jam</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grafik Ritase Harian</CardTitle>
          <CardDescription>Visualisasi ritase harian</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="pv" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringRitase;
