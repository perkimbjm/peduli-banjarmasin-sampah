
export type TaskStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled';
export type TaskCategory = 
  | 'perencanaan' 
  | 'pemilahan' 
  | 'pengumpulan' 
  | 'pengurangan' 
  | 'pengangkutan' 
  | 'pengolahan' 
  | 'pengawasan' 
  | 'pembuangan' 
  | 'evaluasi';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  area: string;
  assigned_to?: string[]; // For UI convenience
  staff?: Staff[]; // When fetched from database with join
  start_date: string;
  end_date: string;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100 percentage
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  staff_id: string;
  assigned_at: string;
  staff?: Staff;
}
