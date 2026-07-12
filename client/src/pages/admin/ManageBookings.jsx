import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus, cancelBooking } from '../../services/booking.service';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1b1b1d]">Manage Bookings</h1>
      </div>
      
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.room?.name || 'Unknown'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.user?.email || 'Unknown'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status !== 'Cancelled' && (
                    <button onClick={() => handleCancel(booking._id)} className="text-red-600 hover:text-red-900">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
