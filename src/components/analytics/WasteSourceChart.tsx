
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, Store, Factory, School } from "lucide-react";

interface WasteSourceChartProps {
  data?: Array<{
    name: string;
    value: number;
    color: string;
    icon: React.ReactNode;
  }>;
}

const defaultData = [
  { 
    name: 'Rumah Tangga', 
    value: 65, 
    color: '#0088FE',
    icon: <Home className="h-4 w-4" />
  },
  { 
    name: 'Komersial', 
    value: 15, 
    color: '#00C49F',
    icon: <Store className="h-4 w-4" />
  },
  { 
    name: 'Industri', 
    value: 10, 
    color: '#FFBB28',
    icon: <Factory className="h-4 w-4" />
  },
  { 
    name: 'Fasilitas Umum', 
    value: 10, 
    color: '#FF8042',
    icon: <School className="h-4 w-4" />
  },
];

const WasteSourceChart = ({ data = defaultData }: WasteSourceChartProps) => {
  // Custom renderer for the legend
  const renderCustomizedLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const { color, value, name } = entry;
          const item = data.find(d => d.name === name);
          return (
            <li key={`item-${index}`} className="flex items-center">
              <div className="flex items-center mr-2">
                <span className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: color }} />
                {item?.icon}
              </div>
              <span className="text-sm">
                {name}: {value}%
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Building className="mr-2 h-5 w-5" />
          Sumber Timbulan Sampah
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
                labelLine={false}
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
              <Legend content={renderCustomizedLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WasteSourceChart;
