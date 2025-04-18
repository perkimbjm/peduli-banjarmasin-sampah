
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BankSampahStatsProps {
  bankSampahData: Array<{
    name: string;
    volume: number;
    income: number;
    members: number;
  }>;
}

export const BankSampahStats = ({ bankSampahData }: BankSampahStatsProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Performa Bank Sampah</CardTitle>
        <CardDescription>Data volume dan pendapatan dari semua bank sampah</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={bankSampahData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="volume" name="Volume (kg)" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="members" name="Anggota" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
