import { useEffect, useState } from 'react';
import BookingCard from '../components/bookings/BookingCard';
import { getMyBookings, cancelBooking } from '../services/booking.service';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      fetchBookings(); // refresh the list
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#1b1b1d] mb-8">My Bookings</h1>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-card shadow-sm">You have no bookings yet.</div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
