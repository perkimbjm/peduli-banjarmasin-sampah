import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const VolumeTab = () => {
  // Data volume sampah harian per kecamatan
  const volumeData = [
    { kecamatan: 'Banjarmasin Tengah', volume: 43.2, target: 45.0, percentage: 96, color: "#2E8B57" },  // bg-peduli-600
    { kecamatan: 'Banjarmasin Utara', volume: 31.7, target: 35.0, percentage: 91, color: "#42964f" },   // bg-peduli-500
    { kecamatan: 'Banjarmasin Barat', volume: 24.3, target: 28.0, percentage: 87, color: "#5eb06b" },   // bg-peduli-400
    { kecamatan: 'Banjarmasin Selatan', volume: 18.9, target: 22.0, percentage: 86, color: "#8ecd97" }, // bg-peduli-300
    { kecamatan: 'Banjarmasin Timur', volume: 9.4, target: 12.0, percentage: 78, color: "#bae2bf" }     // bg-peduli-200
  ];

  const formatKecamatan = (value: string) => {
    return value.replace('Banjarmasin ', '');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ background: item.dataKey === "volume" ? volumeData.find(d => d.kecamatan === label)?.color : "#e5e7eb" }}
              />
              <span>{item.name}:</span>
              <span className="font-medium">{item.value} ton</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Volume Sampah Harian per Kecamatan</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 overflow-x-auto">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={volumeData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="kecamatan" 
                  tickFormatter={formatKecamatan}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="#6b7280"
                />
                <YAxis 
                  label={{ value: 'Volume (ton)', angle: -90, position: 'insideLeft' }} 
                  stroke="#6b7280"
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(46, 139, 87, 0.1)' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Bar 
                  dataKey="volume" 
                  name="Volume Aktual" 
                  radius={[4, 4, 0, 0]}
                  fill="#2E8B57"
                >
                  {volumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Bar 
                  dataKey="target" 
                  fill="#e5e7eb" 
                  name="Target" 
                  radius={[4, 4, 0, 0]}
                  activeBar={{ fill: '#d1d5db' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolumeTab;