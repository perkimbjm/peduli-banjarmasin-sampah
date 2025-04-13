
import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Area {
  id: number;
  name: string;
  current: number;
  target: number;
  percentage: number;
  data: { date: string; value: number }[];
}

interface RitaseSummaryCardProps {
  area: Area;
}

export const RitaseSummaryCard = ({ area }: RitaseSummaryCardProps) => {
  // Calculate statistics
  const values = area.data.map(item => item.value);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  return (
    <Card>
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold">{area.name}</h3>
          </div>
          <Badge 
            variant={area.percentage >= 100 ? "default" : area.percentage >= 70 ? "secondary" : "destructive"}
          >
            {area.percentage.toFixed(0)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Capaian</p>
            <p className="text-2xl font-bold">{area.current}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-2xl font-bold">{area.target}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Rata-rata</p>
            <p className="text-xl font-medium">{average.toFixed(1)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Min / Max</p>
            <p className="text-xl font-medium">{min} / {max}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-sm font-medium">{area.percentage.toFixed(0)}%</p>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${area.percentage >= 100 ? "bg-green-500" : area.percentage >= 70 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(area.percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
