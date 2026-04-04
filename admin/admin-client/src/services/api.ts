import axios from 'axios';
import type { Product, User, DashboardStats, ProductFilters } from '@/types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/login', {
      username,
      password,
    });
    return response.data;
  },

  register: async (username: string, password: string) => {
    const response = await api.post<{ message: string }>('/register', {
      username,
      password,
    });
    return response.data;
  },
};

// Product services
export const productService = {
  getAll: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<Product[]>(`/products?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await api.post<Product>(
      '/products',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  update: async (id: number, formData: FormData) => {
    const response = await api.put<Product>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  },

  bulkDelete: async (ids: number[]) => {
    const response = await api.post<{ message: string }>('/products/bulk-delete', {
      ids,
    });
    return response.data;
  },
};

// Dashboard service
export const dashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};

export default api;
