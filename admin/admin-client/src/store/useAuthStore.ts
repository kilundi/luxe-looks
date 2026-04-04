import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/api';

interface User {
  id: number;
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authService.login(username, password);
          localStorage.setItem('admin_token', token);
          set({ token, user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ error: error.response?.data?.error || 'Login failed', isLoading: false });
          return false;
        }
      },

      register: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(username, password);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          set({ error: error.response?.data?.error || 'Registration failed', isLoading: false });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        set({ token: null, user: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
