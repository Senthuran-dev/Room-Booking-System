import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user, setAuth, token } = useAuthStore();
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setAuth({ ...user, name: formData.name }, token);
      setLoading(false);
      alert('Profile updated successfully (Mocked)');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card">
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-100">
          <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1b1b1d]">{user?.name}</h1>
            <p className="text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Guest'}</p>
            <button className="mt-2 text-sm text-primary font-medium hover:underline">Change Photo</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Read Only)</label>
            <input 
              type="email" 
              className="input-field bg-gray-50 text-gray-500" 
              value={formData.email} 
              readOnly 
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
