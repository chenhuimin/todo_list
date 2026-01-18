export interface TeamMember {
  id: number;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  color: 'blue' | 'purple' | 'yellow' | 'pink' | 'green';
  start_time?: string;
  end_time?: string;
  date?: string;
  assigned_to_id?: number;
  assigned_to?: TeamMember;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
  completed?: boolean;
  color?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  assigned_to_id?: number;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  color?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  assigned_to_id?: number;
}
