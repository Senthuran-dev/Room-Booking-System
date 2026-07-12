import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/auth.service';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Mail, Lock } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);
    
    try {
      const { name, email, password } = formData;
      const data = await register({ name, email, password });
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="card max-w-md w-full mx-auto mt-10">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Create an Account</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="name" required className="input-field" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" required className="input-field" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" name="confirmPassword" required className="input-field" value={formData.confirmPassword} onChange={handleChange} />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-accent hover:underline font-medium">Log in</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
