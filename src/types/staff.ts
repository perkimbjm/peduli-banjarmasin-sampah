
export type StaffStatus = 'active' | 'inactive' | 'on-leave';
export type ShiftType = 'morning' | 'afternoon' | 'night';

export interface Staff {
  id: string;
  name: string;
  position: string;
  area: string;
  contact: string;
  status: StaffStatus;
  shift: ShiftType;
  performance: number; // 0-100 score
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: 'new' | 'good' | 'fair' | 'poor';
  location: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WasteBank {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  current_volume?: number;
  manager_name?: string;
  contact?: string;
  operating_hours?: string;
  accepted_materials?: string[];
  created_at: string;
  updated_at: string;
}

export interface WasteTransaction {
  id: string;
  waste_bank_id: string;
  user_id?: string;
  transaction_date: string;
  waste_type: string;
  weight: number;
  points?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  waste_bank?: WasteBank;
  user?: {
    full_name: string | null;
    email: string;
  };
}
