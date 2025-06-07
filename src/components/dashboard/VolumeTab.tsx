
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VolumeTab = () => {
  // Data volume sampah harian per kecamatan
  const volumeData = [
    { kecamatan: 'Banjarmasin Tengah', volume: 43.2, target: 45.0, percentage: 96 },
    { kecamatan: 'Banjarmasin Utara', volume: 31.7, target: 35.0, percentage: 91 },
    { kecamatan: 'Banjarmasin Barat', volume: 24.3, target: 28.0, percentage: 87 },
    { kecamatan: 'Banjarmasin Selatan', volume: 18.9, target: 22.0, percentage: 86 },
    { kecamatan: 'Banjarmasin Timur', volume: 9.4, target: 12.0, percentage: 78 }
  ];

  const formatKecamatan = (value: string) => {
    return value.replace('Banjarmasin ', '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Volume Sampah Harian per Kecamatan</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={volumeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="kecamatan" 
                  tickFormatter={formatKecamatan}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis label={{ value: 'Volume (ton)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value} ton`, 
                    name === 'volume' ? 'Volume Aktual' : 'Target'
                  ]}
                  labelFormatter={(label) => `Kecamatan ${label}`}
                />
                <Legend />
                <Bar dataKey="volume" fill="#3b82f6" name="Volume Aktual" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#e5e7eb" name="Target" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Kecamatan dengan Volume Tertinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {volumeData.map((item, index) => (
                <li key={item.kecamatan} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span 
                      className={`h-3 w-3 rounded-full mr-2 ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-blue-400' :
                        index === 3 ? 'bg-blue-300' : 'bg-blue-200'
                      }`}
                    ></span>
                    <span className="text-gray-900 dark:text-gray-100 text-sm">
                      {formatKecamatan(item.kecamatan)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{item.volume} ton</span>
                    <div className="text-xs text-gray-500">
                      {item.percentage}% dari target
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Ringkasan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Volume Harian:</span>
                <span className="font-medium">127.5 ton</span>
              </div>
              <div className="flex justify-between">
                <span>Target Total:</span>
                <span className="font-medium">142.0 ton</span>
              </div>
              <div className="flex justify-between">
                <span>Pencapaian:</span>
                <span className="font-medium text-orange-600">89.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VolumeTab;
