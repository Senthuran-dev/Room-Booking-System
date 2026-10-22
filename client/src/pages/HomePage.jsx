import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/rooms/FilterBar';
import { useNavigate } from 'react-router-dom';
import { getRooms } from '../services/room.service';
import RoomCard from '../components/rooms/RoomCard';
import heroImg from '../assets/hero-landing.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        setFeaturedRooms(res.data?.slice(0, 3) || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = () => {
    navigate('/rooms');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative bg-primary h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroImg} alt="Luxury hotel with ocean view" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Find Your Perfect Stay</h1>
          <p className="text-xl text-[#a9c9f2] mb-10">Experience luxury and comfort in our handpicked premium rooms.</p>
          <div className="max-w-4xl mx-auto text-left">
            <FilterBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-[#1b1b1d] mb-8 text-center">Featured Rooms</h2>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading featured rooms...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredRooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/rooms" className="btn-secondary inline-block">View All Rooms</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
