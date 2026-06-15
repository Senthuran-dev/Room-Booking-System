import { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import RoomCard from '../components/RoomCard';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setRooms([
          { _id: '1', name: 'Deluxe Ocean View', type: 'Deluxe', capacity: 2, pricePerNight: 250, averageRating: 4.8 },
          { _id: '2', name: 'Executive Suite', type: 'Suite', capacity: 4, pricePerNight: 450, averageRating: 5.0 },
          { _id: '3', name: 'Standard Double Room', type: 'Standard', capacity: 2, pricePerNight: 120, averageRating: 4.2 },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1b1b1d] mb-6">Browse Rooms</h1>
        <FilterBar />
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading rooms...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
