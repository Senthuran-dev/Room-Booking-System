import { Routes, Route } from 'react-router-dom';

import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';

import HomePage from '../pages/HomePage';
import RoomsPage from '../pages/RoomsPage';
import RoomDetailPage from '../pages/RoomDetailPage';
import BookingPage from '../pages/BookingPage';
import ProfilePage from '../pages/ProfilePage';

import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

import AdminDashboard from '../pages/AdminDashboard';
import ManageRooms from '../pages/ManageRooms';
import ManageBookings from '../pages/ManageBookings';

import ProtectedRoute from '../components/ProtectedRoute';

const AppRouter = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-[#f4f7fb]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/login" element={
            <div className="max-w-7xl mx-auto px-4 py-12"><LoginForm /></div>
          } />
          <Route path="/register" element={
            <div className="max-w-7xl mx-auto px-4 py-12"><RegisterForm /></div>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/rooms" element={
            <ProtectedRoute adminOnly>
              <ManageRooms />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute adminOnly>
              <ManageBookings />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRouter;
