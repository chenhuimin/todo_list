import axios from 'axios';
import { Todo, TodoCreate, TodoUpdate, TeamMember } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: (data: FormData) => api.post<{ access_token: string; token_type: string }>('/token', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  register: (data: any) => api.post('/register', data),
  getMe: () => api.get('/users/me'),
};

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
