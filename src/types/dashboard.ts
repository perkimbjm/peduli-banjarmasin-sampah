
// Define types used across the dashboard
export type ChartDataPoint = {
  name: string;
  value: number;
};

export type DailyWasteData = {
  day: string;
  volume: number;
};

export type ProcessingCapacityData = {
  location: string;
  capacity: number;
  used: number;
};

export type WasteTrendData = {
  month: string;
  waste: number;
  growth: number;
};

export type ComparisonData = {
  month: string;
  waste: number;
  capacity: number;
};

export type Participant = {
  id: string;
  schedule_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "declined";
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name?: string;
    email?: string;
  };
};
