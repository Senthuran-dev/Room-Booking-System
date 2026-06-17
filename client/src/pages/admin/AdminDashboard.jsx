import { Link } from 'react-router-dom';
import { Users, Home, Calendar, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#1b1b1d] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Calendar className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Today's Bookings</p><p className="text-2xl font-bold text-[#1b1b1d]">12</p></div>
        </div>
        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><TrendingUp className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Monthly Revenue</p><p className="text-2xl font-bold text-[#1b1b1d]">$14,500</p></div>
        </div>
        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Home className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Occupancy Rate</p><p className="text-2xl font-bold text-[#1b1b1d]">78%</p></div>
        </div>
        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Users className="h-6 w-6" /></div>
          <div><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold text-[#1b1b1d]">256</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold text-[#1b1b1d] mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/admin/rooms" className="flex items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <Home className="h-5 w-5 text-primary mr-3" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#1b1b1d]">Manage Rooms</h3>
                <p className="text-sm text-gray-500">Add, edit, or remove properties</p>
              </div>
            </Link>
            <Link to="/admin/bookings" className="flex items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <Calendar className="h-5 w-5 text-primary mr-3" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#1b1b1d]">Manage Bookings</h3>
                <p className="text-sm text-gray-500">View and moderate all reservations</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
