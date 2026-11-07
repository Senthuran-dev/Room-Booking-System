import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach JWT token
api.interceptors.request.use(
  (config) => {
    // Read directly from Zustand state
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isLoginOrRegister = url.includes('/auth/login') || url.includes('/auth/register');
    const isGetMe = url.includes('/auth/me');

    if (error.response?.status === 401) {
      // Don't interfere with login/register credential error handling in forms
      if (!isLoginOrRegister) {
        useAuthStore.getState().logout();
        // Avoid redirecting during session rehydration or if already on login page
        if (!isGetMe && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
