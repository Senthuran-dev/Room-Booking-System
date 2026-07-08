import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { createBooking } from '../../services/booking.service';
import { Calendar, Users } from 'lucide-react';

const BookingForm = ({ room }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut) return;

    navigate(`/rooms/${room._id}/book`, {
      state: {
        room,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        total: calculateTotal()
      }
    });
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * room.pricePerNight;
  };

  return (
    <div className="card sticky top-24">
      <h3 className="text-2xl font-bold text-primary mb-1">${room.pricePerNight} <span className="text-sm font-normal text-gray-500">/ night</span></h3>
      
      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            className="input-field"
            placeholderText="Select date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn || new Date()}
            className="input-field"
            placeholderText="Select date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input-field bg-white">
            {[...Array(room.capacity)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1} {i+1 === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>
      </div>

      {checkIn && checkOut && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between mb-2 text-gray-600">
            <span>${room.pricePerNight} x {Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24))} nights</span>
            <span>${calculateTotal()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-[#1b1b1d] mt-4">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      )}

      <button 
        onClick={handleBooking} 
        disabled={loading || !checkIn || !checkOut} 
        className="btn-primary w-full mt-6"
      >
        {loading ? 'Processing...' : 'Reserve'}
      </button>
      <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>
    </div>
  );
};

export default BookingForm;
