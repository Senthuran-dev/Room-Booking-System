import { useEffect, useState } from 'react';
import BookingCard from '../components/bookings/BookingCard';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setBookings([
      {
        _id: 'bk_12345',
        status: 'Confirmed',
        checkIn: new Date(Date.now() + 86400000 * 5),
        checkOut: new Date(Date.now() + 86400000 * 8),
        guests: 2,
        totalPrice: 450,
        room: { name: 'Standard Double Room', images: [{ url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80' }] }
      }
    ]);
    setLoading(false);
  }, []);

  const handleCancel = (id) => {
    setBookings(bookings.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
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
