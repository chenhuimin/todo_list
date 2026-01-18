import axios from 'axios';
import { Todo, TodoCreate, TodoUpdate, TeamMember } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Todo API
export const todoApi = {
  getAll: (params?: {
    completed?: boolean;
    date?: string;
    assigned_to_id?: number;
    search?: string;
  }) => api.get<Todo[]>('/todos', { params }),
  
  getOne: (id: number) => api.get<Todo>(`/todos/${id}`),
  
  create: (data: TodoCreate) => api.post<Todo>('/todos', data),
  
  update: (id: number, data: TodoUpdate) => api.put<Todo>(`/todos/${id}`, data),
  
  delete: (id: number) => api.delete(`/todos/${id}`),
};

// Team Member API
export const teamMemberApi = {
  getAll: () => api.get<TeamMember[]>('/team-members'),
  
  getOne: (id: number) => api.get<TeamMember>(`/team-members/${id}`),
  
  create: (data: { name: string; avatar?: string }) => 
    api.post<TeamMember>('/team-members', data),
  
  update: (id: number, data: { name: string; avatar?: string }) => 
    api.put<TeamMember>(`/team-members/${id}`, data),
  
  delete: (id: number) => api.delete(`/team-members/${id}`),
};

export default api;
