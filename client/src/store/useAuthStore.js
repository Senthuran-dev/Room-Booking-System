import { create } from 'zustand';
import { getMe } from '../services/auth.service';

const initialToken = localStorage.getItem('token') || null;

export const useAuthStore = create((set) => ({
  user: null,
  token: initialToken,
  isAuthLoading: !!initialToken,
  
  // Set user and token upon login/register
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    set({ user, token, isAuthLoading: false });
  },
  
  // Clear data upon logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthLoading: false });
  },

  // Rehydrate session on refresh
  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthLoading: false });
      return;
    }
    try {
      const data = await getMe();
      set({ user: data.data, token, isAuthLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthLoading: false });
    }
  }
}));
