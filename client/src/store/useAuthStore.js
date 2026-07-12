import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  
  // Set user and token upon login/register
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    set({ user, token });
  },
  
  // Clear data upon logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Rehydrate session on refresh
  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { getMe } = await import('../services/auth.service');
      const data = await getMe();
      set({ user: data.data, token });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  }
}));
