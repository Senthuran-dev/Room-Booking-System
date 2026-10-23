import React, { useState, useEffect } from 'react';
import FilterBar from '../components/rooms/FilterBar';
import RoomCard from '../components/rooms/RoomCard';
import { getRooms } from '../services/room.service';
import { useBookingStore } from '../store/useBookingStore';
import { RotateCcw, BedDouble, AlertCircle, Loader2 } from 'lucide-react';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get filter state from store
  const { roomType, guests, checkIn, checkOut, priceRange, clearSearch } = useBookingStore();

  const isFiltered = Boolean(
    roomType || 
    (guests && guests > 1) || 
    checkIn || 
    checkOut || 
    (priceRange && (priceRange[0] > 0 || priceRange[1] < 5000))
  );

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct query params
        const params = new URLSearchParams();
        if (roomType && roomType !== 'All') {
          params.append('type', roomType);
        }
        if (guests && Number(guests) > 1) {
          params.append('capacity', guests);
        }
        if (priceRange && (priceRange[0] > 0 || priceRange[1] < 5000)) {
          if (priceRange[0] > 0) params.append('minPrice', priceRange[0]);
          if (priceRange[1] < 5000) params.append('maxPrice', priceRange[1]);
        }
        if (checkIn && checkOut) {
          params.append('checkIn', new Date(checkIn).toISOString());
          params.append('checkOut', new Date(checkOut).toISOString());
        }

        const queryString = params.toString();
        const res = await getRooms(queryString ? `?${queryString}` : '');
        setRooms(res.data || []);
      } catch (err) {
        console.error('Failed to load rooms:', err);
        setError('Failed to load rooms. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, [roomType, guests, priceRange, checkIn, checkOut]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1b1b1d] tracking-tight">Browse Rooms</h1>
            <p className="text-sm text-gray-500 mt-1">
              Find luxury suites and comfortable rooms tailored to your stay.
            </p>
          </div>
          {!loading && !error && (
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{rooms.length}</span> {rooms.length === 1 ? 'room' : 'rooms'}
            </div>
          )}
        </div>

        <FilterBar />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Finding available rooms...</p>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto text-center py-16 px-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-red-800 mb-1">Could not load rooms</h3>
          <p className="text-xs text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-2xl border border-gray-100 shadow-level-1 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <BedDouble className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No rooms found matching your criteria</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Try adjusting your dates, reducing the guest count, or selecting "All Types".
          </p>
          {isFiltered && (
            <button 
              onClick={clearSearch}
              className="btn-primary py-2 px-5 text-sm inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
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

