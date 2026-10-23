import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RoomGallery from '../components/rooms/RoomGallery';
import StarRating from '../components/shared/StarRating';
import BookingForm from '../components/bookings/BookingForm';
import AmenityIcon from '../components/shared/AmenityIcon';

import { getRoomById } from '../services/room.service';

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(id);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
        setError('Room not found');
      }
    };
    fetchRoom();
  }, [id]);

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  if (!room) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RoomGallery images={room.images} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-[#1b1b1d]">{room.name}</h1>
              <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold">{room.type}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center"><StarRating rating={Math.round(room.averageRating)} readOnly /> <span className="ml-2">({room.averageRating})</span></div>
              <span>•</span>
              <span>Up to {room.capacity} Guests</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-[#1b1b1d] mb-4">About this room</h2>
            <p className="text-[#43474e] leading-relaxed">{room.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1b1b1d] mb-4">Included Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {room.amenities && room.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center p-2.5 rounded-xl bg-slate-50 border border-gray-100 hover:border-blue-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                    <AmenityIcon name={amenity} className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <BookingForm room={room} />
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
