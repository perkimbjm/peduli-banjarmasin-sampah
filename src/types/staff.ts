
export interface Staff {
  id: string;
  name: string;
  position: string;
  area: string;
  contact: string;
  status: 'active' | 'inactive' | 'on-leave';
  shift: 'morning' | 'afternoon' | 'night';
  performance: number; // 0-100 score
  created_at: string;
  updated_at: string;
}
