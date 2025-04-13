
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RegionProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
  regionName: string;
  regionLogo?: string;
  className?: string;
}

export function RegionProgressBar({
  completed,
  total,
  percentage,
  regionName,
  regionLogo,
  className,
}: RegionProgressBarProps) {
  // Calculate the color based on percentage
  const getColorClass = () => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-4">
        {regionLogo && (
          <div className="h-16 w-16 overflow-hidden rounded-md border">
            <img 
              src={regionLogo} 
              alt={`Logo ${regionName}`}
              className="h-full w-full object-contain" 
            />
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">
              Jumlah {regionName} yang sudah menginputkan data
            </h3>
            <span className="text-2xl font-bold">{completed}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p className={cn(percentage < 25 ? "text-red-500" : "text-muted-foreground")}>
              {percentage.toFixed(2)}% dari {total} {regionName}
            </p>
          </div>
          <Progress 
            value={percentage} 
            className="h-2" 
            indicatorClassName={getColorClass()}
          />
        </div>
      </div>
    </div>
  );
}
