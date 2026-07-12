import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/rooms/FilterBar';
import RoomCard from '../components/rooms/RoomCard';
import { getRooms } from '../services/room.service';
import { useBookingStore } from '../store/useBookingStore';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get filter state from store
  const { roomType, guests, checkIn, checkOut, priceRange } = useBookingStore();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        // Construct query params
        const params = new URLSearchParams();
        if (roomType) params.append('type', roomType);
        if (guests > 1) params.append('capacity', guests);
        if (priceRange) {
          params.append('minPrice', priceRange[0]);
          params.append('maxPrice', priceRange[1]);
        }
        if (checkIn && checkOut) {
          params.append('checkIn', new Date(checkIn).toISOString());
          params.append('checkOut', new Date(checkOut).toISOString());
        }

        const res = await getRooms(`?${params.toString()}`);
        setRooms(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    // We should re-fetch if these change, but for now we'll just fetch on mount or when filters change
    fetchRooms();
  }, [roomType, guests, priceRange, checkIn, checkOut]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1b1b1d] mb-6">Browse Rooms</h1>
        <FilterBar />
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading rooms...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
          {rooms.length === 0 && (
            <div className="text-center py-20 text-gray-500">No rooms found matching your criteria.</div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomsPage;
