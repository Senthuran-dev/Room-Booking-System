import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initAuth = useAuthStore(state => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
