import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../../services/auth.service';
import { useAuthStore } from '../../store/useAuthStore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthLoading, setAuth } = useAuthStore();

  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (user && !isAuthLoading) {
      navigate(from, { replace: true });
    }
  }, [user, isAuthLoading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const data = await login(trimmedEmail, password);
      setAuth(data.user, data.token); // sendToken wraps user in data
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md w-full mx-auto mt-10">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Welcome Back</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            required 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            required 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="text-accent hover:underline font-medium">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginForm;
