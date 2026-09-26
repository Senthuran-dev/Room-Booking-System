import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './store/useAuthStore';

import api from './services/api';

function App() {
  const initAuth = useAuthStore(state => state.initAuth);

  useEffect(() => {
    initAuth();
    
    // Ping the backend on load to wake up Render free tier
    api.get('/health').catch(() => {
      // Ignore errors, the goal is just to trigger a wake-up
    });
  }, [initAuth]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
