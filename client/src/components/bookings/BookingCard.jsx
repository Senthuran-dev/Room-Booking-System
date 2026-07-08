import { useState } from 'react';
import ReviewModal from '../shared/ReviewModal';

const BookingCard = ({ booking, onCancel }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card flex flex-col md:flex-row gap-6 mb-4">
      <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
        <img 
          src={booking.room?.images?.[0]?.url || 'https://via.placeholder.com/300'} 
          alt={booking.room?.name || 'Room'} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-[#1b1b1d]">{booking.room?.name || 'Unknown Room'}</h3>
            <p className="text-sm text-gray-500 mt-1">Booking ID: {booking._id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Check-in</p>
            <p className="font-medium text-[#1b1b1d]">{new Date(booking.checkIn).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Check-out</p>
            <p className="font-medium text-[#1b1b1d]">{new Date(booking.checkOut).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Guests</p>
            <p className="font-medium text-[#1b1b1d]">{booking.guests}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Total Price</p>
            <p className="font-medium text-primary">${booking.totalPrice}</p>
          </div>
        </div>

        {booking.status === 'confirmed' && onCancel && (
          <div className="mt-auto pt-4 flex justify-end">
            <button 
              onClick={() => onCancel(booking._id)}
              className="btn-secondary py-1.5 px-4 text-sm text-red-600 border-red-200 hover:bg-red-50"
            >
              Cancel Booking
            </button>
          </div>
        )}
        
        {booking.status === 'completed' && (
          <div className="mt-auto pt-4 flex justify-end">
            <button 
              onClick={() => setIsReviewOpen(true)}
              className="btn-primary py-1.5 px-4 text-sm"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        roomId={booking.room?._id}
        roomName={booking.room?.name}
        onSuccess={() => alert('Review submitted successfully!')}
      />
    </div>
  );
};

export default BookingCard;
