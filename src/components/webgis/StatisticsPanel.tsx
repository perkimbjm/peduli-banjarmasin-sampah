import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart, LineChart, Pie, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Mock data for statistics
const wasteTypeData = [
  { name: 'Organik', value: 40 },
  { name: 'Plastik', value: 25 },
  { name: 'Kertas', value: 15 },
  { name: 'Logam', value: 10 },
  { name: 'Lainnya', value: 10 },
];

const locationData = [
  { name: 'Banjarmasin Utara', value: 15 },
  { name: 'Banjarmasin Selatan', value: 20 },
  { name: 'Banjarmasin Timur', value: 12 },
  { name: 'Banjarmasin Barat', value: 18 },
  { name: 'Banjarmasin Tengah', value: 25 },
];

const monthlyData = [
  { month: 'Jan', volume: 320 },
  { month: 'Feb', volume: 340 },
  { month: 'Mar', volume: 380 },
  { month: 'Apr', volume: 350 },
  { month: 'Mei', volume: 390 },
  { month: 'Jun', volume: 410 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatisticsPanel = () => {
  return (
    <div className="space-y-6">
      {/* Quick stats grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total TPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 dari bulan lalu</p>
          </CardContent>
        </Card>
        {/* More stat cards */}
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribusi Jenis TPS</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {wasteTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tren Volume Sampah</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Map stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik per Wilayah</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] caption-bottom text-sm">
              <thead>
                <tr>
                  <th>Wilayah</th>
                  <th>Volume Sampah (kg)</th>
                </tr>
              </thead>
              <tbody>
                {locationData.map((location, index) => (
                  <tr key={index}>
                    <td>{location.name}</td>
                    <td>{location.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;
