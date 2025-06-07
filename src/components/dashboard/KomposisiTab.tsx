
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Trash2 } from "lucide-react";

const KomposisiTab = () => {
  // Data komposisi sampah
  const komposisiData = [
    { name: 'Organik', value: 61, volume: 77.8, color: '#3b82f6' },
    { name: 'Plastik', value: 15, volume: 19.1, color: '#10b981' },
    { name: 'Kertas', value: 10, volume: 12.8, color: '#f59e0b' },
    { name: 'Logam', value: 6, volume: 7.7, color: '#ef4444' },
    { name: 'Lainnya', value: 8, volume: 10.1, color: '#8b5cf6' }
  ];

  // Data pengelolaan per jenis
  const pengelolaanData = [
    { 
      jenis: 'Organik', 
      volume: 77.8, 
      terdaurUlang: 45, 
      metode: 'Kompos & Biogas',
      color: '#3b82f6'
    },
    { 
      jenis: 'Plastik', 
      volume: 19.1, 
      terdaurUlang: 32, 
      metode: 'Daur Ulang',
      color: '#10b981'
    },
    { 
      jenis: 'Kertas', 
      volume: 12.8, 
      terdaurUlang: 68, 
      metode: 'Daur Ulang',
      color: '#f59e0b'
    },
    { 
      jenis: 'Logam', 
      volume: 7.7, 
      terdaurUlang: 82, 
      metode: 'Daur Ulang',
      color: '#ef4444'
    },
    { 
      jenis: 'Lainnya', 
      volume: 10.1, 
      terdaurUlang: 17, 
      metode: 'TPA & Insinerasi',
      color: '#8b5cf6'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">Persentase: {data.value}%</p>
          <p className="text-sm">Volume: {data.volume} ton/hari</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Sampah</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={komposisiData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {komposisiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2 mt-4">
              {komposisiData.map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span 
                      className="h-3 w-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-gray-900 dark:text-gray-100">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Potensi Pengelolaan Berdasarkan Jenis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pengelolaanData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jenis" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'volume' ? `${value} ton/hari` : `${value}%`,
                    name === 'volume' ? 'Volume' : '% Terdaur Ulang'
                  ]}
                />
                <Legend />
                <Bar dataKey="volume" fill="#94a3b8" name="Volume (ton/hari)" />
                <Bar dataKey="terdaurUlang" fill="#22c55e" name="% Terdaur Ulang" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4">Jenis Sampah</th>
                    <th className="text-center py-3 px-4">Volume (ton/hari)</th>
                    <th className="text-center py-3 px-4">% Terdaur Ulang</th>
                    <th className="text-center py-3 px-4">Metode Pengelolaan</th>
                  </tr>
                </thead>
                <tbody>
                  {pengelolaanData.map((item) => (
                    <tr key={item.jenis} className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 flex items-center">
                        <span 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></span>
                        {item.jenis}
                      </td>
                      <td className="text-center py-3 px-4">{item.volume}</td>
                      <td className="text-center py-3 px-4">{item.terdaurUlang}%</td>
                      <td className="text-center py-3 px-4">{item.metode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Permasalahan Utama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 flex items-start">
                <Trash2 className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-300">TPS Liar</h4>
                  <p className="text-sm text-red-600/70 dark:text-red-300/70">
                    17 lokasi teridentifikasi di seluruh kota
                  </p>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 flex items-start">
                <Trash2 className="h-5 w-5 text-orange-500 dark:text-orange-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-700 dark:text-orange-300">Kapasitas TPA</h4>
                  <p className="text-sm text-orange-600/70 dark:text-orange-300/70">
                    Diperkirakan penuh dalam 2 tahun
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start">
                <Trash2 className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Sampah Plastik</h4>
                  <p className="text-sm text-yellow-600/70 dark:text-yellow-300/70">
                    Pertumbuhan 8% per tahun
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KomposisiTab;
