import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Trash2 } from "lucide-react";
const KomposisiTab = () => {
  // Data komposisi sampah
  const komposisiData = [{
    name: 'Organik',
    value: 61,
    volume: 77.8,
    color: '#3b82f6'
  }, {
    name: 'Plastik',
    value: 15,
    volume: 19.1,
    color: '#10b981'
  }, {
    name: 'Kertas',
    value: 10,
    volume: 12.8,
    color: '#f59e0b'
  }, {
    name: 'Logam',
    value: 6,
    volume: 7.7,
    color: '#ef4444'
  }, {
    name: 'Lainnya',
    value: 8,
    volume: 10.1,
    color: '#8b5cf6'
  }];

  // Data pengelolaan per jenis
  const pengelolaanData = [{
    jenis: 'Organik',
    volume: 77.8,
    terdaurUlang: 45,
    metode: 'Kompos & Biogas',
    color: '#3b82f6'
  }, {
    jenis: 'Plastik',
    volume: 19.1,
    terdaurUlang: 32,
    metode: 'Daur Ulang',
    color: '#10b981'
  }, {
    jenis: 'Kertas',
    volume: 12.8,
    terdaurUlang: 68,
    metode: 'Daur Ulang',
    color: '#f59e0b'
  }, {
    jenis: 'Logam',
    volume: 7.7,
    terdaurUlang: 82,
    metode: 'Daur Ulang',
    color: '#ef4444'
  }, {
    jenis: 'Lainnya',
    volume: 10.1,
    terdaurUlang: 17,
    metode: 'TPA & Insinerasi',
    color: '#8b5cf6'
  }];
  const CustomTooltip = ({
    active,
    payload
  }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Persentase: <span className="font-medium text-gray-900 dark:text-gray-100">{data.value}%</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Volume: <span className="font-medium text-gray-900 dark:text-gray-100">{data.volume} ton/hari</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const BarChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{payload[0].payload.jenis}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 dark:text-gray-300">
                  {entry.name}:{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {entry.name === 'Volume (ton/hari)' ?
                      `${entry.value} ton/hari` :
                      `${entry.value}%`
                    }
                  </span>
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pie Chart & Komposisi List */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Sampah</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={komposisiData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    name,
                    value
                  }) => `${name} ${value}%`} outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  activeShape={(props) => {
                    const RADIAN = Math.PI / 180;
                    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
                    const sin = Math.sin(-RADIAN * midAngle);
                    const cos = Math.cos(-RADIAN * midAngle);
                    const mx = cx + (outerRadius + 15) * cos;
                    const my = cy + (outerRadius + 15) * sin;
                    return (
                      <g>
                        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                          {payload.name}
                        </text>
                        <text x={mx} y={my} textAnchor={cos >= 0 ? "start" : "end"} fill="#999">
                          {`${value}%`}
                        </text>
                      </g>
                    );
                  }}
                >
                  {komposisiData.map((entry, index) =>
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={2}
                      stroke="#fff"
                    />
                  )}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-2 mt-4">
              {komposisiData.map(item => (
                <li key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="h-3 w-3 rounded-full mr-2" style={{
                      backgroundColor: item.color
                    }}></span>
                    <span className="text-gray-900 dark:text-gray-100">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      {/* Bar Chart & Table */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Potensi Pengelolaan Berdasarkan Jenis</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={pengelolaanData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="jenis" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  content={<BarChartTooltip />}
                  cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  dataKey="volume"
                  fill="#94a3b8"
                  name="Volume (ton/hari)"
                  radius={[4, 4, 0, 0]}
                  activeBar={{ fill: '#64748b' }}
                />
                <Bar
                  dataKey="terdaurUlang"
                  fill="#22c55e"
                  name="% Terdaur Ulang"
                  radius={[4, 4, 0, 0]}
                  activeBar={{ fill: '#15803d' }}
                />
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
                  {pengelolaanData.map(item => (
                    <tr key={item.jenis} className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 flex items-center">
                        <span className="h-3 w-3 rounded-full mr-2" style={{
                          backgroundColor: item.color
                        }}></span>
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
      </div>
    </div>
  );
};
export default KomposisiTab;