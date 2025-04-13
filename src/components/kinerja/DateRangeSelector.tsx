
import React from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateRangeSelectorProps {
  dateRange: string;
  onChangeDateRange: (range: string) => void;
}

export function DateRangeSelector({
  dateRange,
  onChangeDateRange,
}: DateRangeSelectorProps) {
  const currentMonthName = format(new Date(), "MMM yyyy");
  const currentYear = new Date().getFullYear().toString();

  // Pre-defined date ranges
  const predefinedDateRanges = [
    {
      label: "Last 7 days",
      value: "7d",
    },
    {
      label: "Last 30 days",
      value: "30d",
    },
    {
      label: "This month",
      value: "this-month",
    },
    {
      label: "Last 3 months",
      value: "3m",
    },
    {
      label: "This year",
      value: "this-year",
    },
    {
      label: "Custom range",
      value: "custom",
    },
  ];

  const getDisplayText = () => {
    switch (dateRange) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "this-month":
        return `This month (${currentMonthName})`;
      case "3m":
        return "Last 3 months";
      case "this-year":
        return `This year (${currentYear})`;
      case "custom":
        return "Custom range";
      default:
        return dateRange;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[240px] justify-between">
          <span>{getDisplayText()}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Ranges</TabsTrigger>
            <TabsTrigger value="months">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="preset" className="p-4 space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {predefinedDateRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={dateRange === range.value ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => onChangeDateRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="months" className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date(new Date().getFullYear(), i, 1);
                const monthName = format(date, "MMM");
                const value = `month-${i + 1}`;
                
                return (
                  <Button
                    key={value}
                    variant={dateRange === value ? "default" : "outline"}
                    className="w-full"
                    onClick={() => onChangeDateRange(value)}
                  >
                    {monthName}
                  </Button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
