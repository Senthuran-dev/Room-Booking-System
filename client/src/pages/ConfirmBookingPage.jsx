import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { createBooking } from '../services/booking.service';
import { CreditCard, Calendar, Users, MapPin, CheckCircle } from 'lucide-react';

const ConfirmBookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!state || !state.room) {
    return <Navigate to="/rooms" />;
  }

  const { room, checkIn, checkOut, guests, total } = state;
  const taxes = total * 0.15;
  const finalTotal = total + taxes;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createBooking({
        room: room._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to create booking');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-primary mb-4">Booking Confirmed!</h1>
        <p className="text-[#43474e] max-w-md mb-8">
          Your reservation for {room.name} has been successfully processed. We're redirecting you to your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Confirm Your Booking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-in</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(checkIn).toDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Check-out</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(checkOut).toDateString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Guests</p>
                <p className="font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="p-4 border rounded-md border-primary bg-primary/5 flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">Pay at Property</p>
                <p className="text-sm text-gray-500">No credit card required right now.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card sticky top-24">
            <div className="flex gap-4 mb-6">
              <img src={room.images?.[0]?.url || 'https://via.placeholder.com/150'} alt={room.name} className="w-24 h-24 object-cover rounded-md" />
              <div>
                <h3 className="font-semibold text-lg line-clamp-2">{room.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> StayEase Property
                </p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>${room.pricePerNight} x {Math.ceil(Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes (15%)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-[#1b1b1d] pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              disabled={loading}
              className="btn-primary w-full mt-8 py-3 flex justify-center items-center gap-2"
            >
              {loading ? 'Confirming...' : 'Complete Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingPage;
