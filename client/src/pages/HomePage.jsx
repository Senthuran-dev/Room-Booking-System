import React from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '../components/rooms/FilterBar';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/rooms');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative bg-primary h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1542314831-c6a4d27d66f6?auto=format&fit=crop&q=80" alt="Hero" className="w-full h-full object-cover opacity-30" />
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
        <div className="text-center">
          <Link to="/rooms" className="btn-secondary inline-block">View All Rooms</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
