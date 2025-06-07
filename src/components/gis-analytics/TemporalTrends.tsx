
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TemporalTrends = () => {
  // Mock temporal data
  const trendsData = [
    { month: 'Jan', tps: 95, bankSampah: 48, tps3r: 25, tpsLiar: 15 },
    { month: 'Feb', tps: 98, bankSampah: 50, tps3r: 26, tpsLiar: 12 },
    { month: 'Mar', tps: 100, bankSampah: 52, tps3r: 28, tpsLiar: 10 },
    { month: 'Apr', tps: 102, bankSampah: 53, tps3r: 29, tpsLiar: 8 },
    { month: 'Mei', tps: 100, bankSampah: 55, tps3r: 30, tpsLiar: 6 },
    { month: 'Jun', tps: 105, bankSampah: 58, tps3r: 32, tpsLiar: 5 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          Tren Perkembangan Fasilitas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tps" stroke="#3b82f6" name="TPS Reguler" strokeWidth={2} />
            <Line type="monotone" dataKey="bankSampah" stroke="#8b5cf6" name="Bank Sampah" strokeWidth={2} />
            <Line type="monotone" dataKey="tps3r" stroke="#10b981" name="TPS 3R" strokeWidth={2} />
            <Line type="monotone" dataKey="tpsLiar" stroke="#ef4444" name="TPS Liar" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TemporalTrends;
