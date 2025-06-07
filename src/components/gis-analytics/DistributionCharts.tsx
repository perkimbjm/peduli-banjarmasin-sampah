
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DistributionCharts = () => {
  // Mock data - in real implementation, this would come from your data context
  const districtData = [
    { name: 'Banjarmasin Utara', tps: 15, tpsLiar: 3, bankSampah: 8, tps3r: 4 },
    { name: 'Banjarmasin Selatan', tps: 22, tpsLiar: 5, bankSampah: 12, tps3r: 6 },
    { name: 'Banjarmasin Timur', tps: 18, tpsLiar: 2, bankSampah: 9, tps3r: 5 },
    { name: 'Banjarmasin Barat', tps: 20, tpsLiar: 4, bankSampah: 11, tps3r: 7 },
    { name: 'Banjarmasin Tengah', tps: 25, tpsLiar: 6, bankSampah: 15, tps3r: 8 },
  ];

  const facilityTypeData = [
    { name: 'TPS Reguler', value: 100, color: '#3b82f6' },
    { name: 'TPS 3R', value: 30, color: '#10b981' },
    { name: 'Bank Sampah', value: 55, color: '#8b5cf6' },
    { name: 'TPS Liar', value: 20, color: '#ef4444' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* District Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            Distribusi Fasilitas per Kecamatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={districtData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tps" fill="#3b82f6" name="TPS Reguler" />
              <Bar dataKey="tps3r" fill="#10b981" name="TPS 3R" />
              <Bar dataKey="bankSampah" fill="#8b5cf6" name="Bank Sampah" />
              <Bar dataKey="tpsLiar" fill="#ef4444" name="TPS Liar" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Facility Type Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
            Komposisi Jenis Fasilitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={facilityTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {facilityTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributionCharts;
