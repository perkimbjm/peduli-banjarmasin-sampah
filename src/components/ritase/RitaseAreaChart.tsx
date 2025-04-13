
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface RitaseAreaChartProps {
  data: DataPoint[];
  target: number;
}

export const RitaseAreaChart = ({ data, target }: RitaseAreaChartProps) => {
  const maxValue = Math.max(...data.map(item => item.value), target) * 1.2;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis 
          domain={[0, maxValue]} 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#FFF', 
            borderRadius: '0.375rem', 
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '0.25rem' }}
        />
        <ReferenceLine 
          y={target} 
          label={{ 
            value: `Target (${target})`,
            position: 'top',
            fill: '#6B7280',
            fontSize: 12, 
          }} 
          stroke="#6B7280" 
          strokeDasharray="3 3" 
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
