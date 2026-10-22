import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-level-1 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <Logo size={36} variant="dark" />
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/rooms" className="text-[#1b1b1d] hover:text-primary px-3 py-2 text-sm font-medium transition-colors">Rooms</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-sm font-medium text-accent hover:text-primary transition-colors">Admin Dashboard</Link>
                )}
                <Link to="/profile" className="flex items-center text-sm font-medium text-[#1b1b1d] hover:text-primary">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover mr-2" />
                  ) : (
                    <User className="h-5 w-5 mr-1" />
                  )}
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="text-[#1b1b1d] hover:text-red-600 transition-colors ml-2">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[#1b1b1d] hover:text-primary">Log in</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm ml-4">Sign up</Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#1b1b1d]">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/rooms" className="block px-3 py-2 text-base font-medium text-[#1b1b1d] hover:bg-slate-50 rounded-md">Rooms</Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block px-3 py-2 text-base font-medium text-accent hover:bg-slate-50 rounded-md">Admin Dashboard</Link>
                )}
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-[#1b1b1d] hover:bg-slate-50 rounded-md">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-base font-medium text-[#1b1b1d] hover:bg-slate-50 rounded-md">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-[#1b1b1d] hover:bg-slate-50 rounded-md">Log in</Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary hover:bg-slate-50 rounded-md">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
