
export type Schedule = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Participant = {
  id: string;
  schedule_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "declined";
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string | null;
    email: string;
  };
};
