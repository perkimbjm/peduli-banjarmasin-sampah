
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  prefix?: string;
  subtitle?: string;
  change?: number;
  period?: string;
  className?: string;
  borderColor?: string;
}

export function StatCard({
  title,
  value,
  unit,
  prefix,
  subtitle,
  change,
  period,
  className,
  borderColor = "border-primary/20",
}: StatCardProps) {
  // Format the value with comma for thousands
  const formattedValue = value.toLocaleString();
  
  // Determine if change is positive, negative, or neutral
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div 
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
        borderColor,
        className
      )}
    >
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </div>
      <div className="text-3xl font-bold">
        {prefix && <span>{prefix}</span>}
        {formattedValue}
        {unit && <span className="text-xl ml-1">{unit}</span>}
      </div>
      
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      )}
      
      {change !== undefined && (
        <div className={cn(
          "flex items-center mt-2 text-sm",
          isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground"
        )}>
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : isNegative ? (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          ) : null}
          <span>
            {isPositive ? "+" : ""}{change.toFixed(2)}% {period}
          </span>
        </div>
      )}
    </div>
  );
}
