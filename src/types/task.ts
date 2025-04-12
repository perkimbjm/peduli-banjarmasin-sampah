
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
  assigned_to: string[];
  start_date: string;
  end_date: string;
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100 percentage
  created_at: string;
  updated_at: string;
}
