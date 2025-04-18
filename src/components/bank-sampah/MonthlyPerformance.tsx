
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface MonthlyPerformanceProps {
  monthlyData: Array<{
    name: string;
    organik: number;
    anorganik: number;
    b3: number;
  }>;
}

export const MonthlyPerformance = ({ monthlyData }: MonthlyPerformanceProps) => {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Performa Bulanan</CardTitle>
          <CardDescription>Tren volume sampah yang dikelola per bulan</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Ekspor Data
        </Button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="organik" name="Sampah Organik (kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="anorganik" name="Sampah Anorganik (kg)" stroke="#82ca9d" />
            <Line type="monotone" dataKey="b3" name="Sampah B3 (kg)" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
