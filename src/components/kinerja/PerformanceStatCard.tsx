
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PerformanceStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  changePercentage?: number;
  lastUpdate?: string;
  icon?: React.ReactNode;
  className?: string;
  valueColor?: string;
}

export function PerformanceStatCard({
  title,
  value,
  subtitle,
  changePercentage,
  lastUpdate,
  icon,
  className,
  valueColor = "text-foreground",
}: PerformanceStatCardProps) {
  const isPositiveChange = typeof changePercentage === 'number' && changePercentage > 0;
  const isNegativeChange = typeof changePercentage === 'number' && changePercentage < 0;
  const hasChange = typeof changePercentage === 'number';

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className={cn("text-4xl font-bold tracking-tight", valueColor)}>
                {value}
              </h3>
              {hasChange && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    isPositiveChange && "text-green-500",
                    isNegativeChange && "text-red-500"
                  )}
                >
                  {isPositiveChange && "▲"} 
                  {isNegativeChange && "▼"} 
                  {Math.abs(changePercentage).toFixed(2)}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            {lastUpdate && (
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                Laporan Terakhir: {lastUpdate}
              </div>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
