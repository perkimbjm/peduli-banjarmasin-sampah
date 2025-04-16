
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

interface WasteCompositionAnalyticsProps {
  data?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const defaultData = [
  { name: 'Organik', value: 60, color: '#4CAF50' },
  { name: 'Plastik', value: 15, color: '#2196F3' },
  { name: 'Kertas', value: 10, color: '#FFC107' },
  { name: 'Kaca', value: 5, color: '#9C27B0' },
  { name: 'Logam', value: 5, color: '#F44336' },
  { name: 'Lainnya', value: 5, color: '#607D8B' },
];

const WasteCompositionAnalytics = ({ data = defaultData }: WasteCompositionAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Layers className="mr-2 h-5 w-5" />
          Komposisi Sampah
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WasteCompositionAnalytics;
