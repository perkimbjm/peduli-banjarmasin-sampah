
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DigitalBankCardProps {
  value: number;
  total: number;
  percentage: number;
  source: string;
}

export function DigitalBankCard({
  value,
  total,
  percentage,
  source
}: DigitalBankCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-1">
          <h3 className="text-5xl font-bold">{value}</h3>
        </div>
        <p className="text-sm text-center text-muted-foreground mb-4">
          {percentage}% dari {total} Bank Sampah terdaftar di Simba KLHK
        </p>
        
        <div className="space-y-2">
          <Progress value={percentage} className="h-2 bg-gray-200" />
          <p className="text-xs text-center text-muted-foreground">{source}</p>
        </div>
      </CardContent>
    </Card>
  );
}
