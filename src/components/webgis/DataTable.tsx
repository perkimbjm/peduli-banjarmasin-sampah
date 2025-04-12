import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";

interface DataPoint {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  lastUpdated: string;
}

const mockData: DataPoint[] = [
  { id: '1', name: 'TPS Pasar Lama', type: 'TPS', location: 'Banjarmasin Tengah', status: 'Aktif', lastUpdated: '2025-04-08' },
  { id: '2', name: 'TPS Jalan Ahmad Yani', type: 'TPS', location: 'Banjarmasin Utara', status: 'Aktif', lastUpdated: '2025-04-07' },
  { id: '3', name: 'TPS Liar Pinggir Sungai', type: 'TPS Liar', location: 'Banjarmasin Selatan', status: 'Perlu Dibersihkan', lastUpdated: '2025-04-06' },
  { id: '4', name: 'Bank Sampah Sejahtera', type: 'Bank Sampah', location: 'Banjarmasin Timur', status: 'Aktif', lastUpdated: '2025-04-09' },
  { id: '5', name: 'TPS 3R Banjarmasin Utara', type: 'TPS 3R', location: 'Banjarmasin Utara', status: 'Aktif', lastUpdated: '2025-04-05' },
];

interface DataTableProps {
  selectedType?: string;
}

const DataTable = ({ selectedType }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search term and selected type
  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Sort data based on sort column and direction
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortBy as keyof DataPoint] < b[sortBy as keyof DataPoint]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortBy as keyof DataPoint] > b[sortBy as keyof DataPoint]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-border overflow-hidden">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] caption-bottom text-sm my-4 overflow-x-hidden">
          <thead>
            <tr className="border-b">
              <th className="h-12 px-4 text-left align-middle font-medium">Nama</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Tipe</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Lokasi</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Terakhir Diupdate</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 my-2">
                  <td className="font-medium px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.type}</td>
                  <td className="px-4 py-2">{item.location}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{item.lastUpdated}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
