import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBookingStore } from '../store/useBookingStore';

const FilterBar = ({ onSearch }) => {
  const { checkIn, checkOut, guests, roomType, setSearchCriteria } = useBookingStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-card shadow-level-1 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check In</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setSearchCriteria({ checkIn: date })}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          className="input-field"
          placeholderText="Select date"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check Out</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setSearchCriteria({ checkOut: date })}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          className="input-field"
          placeholderText="Select date"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Guests</label>
        <select 
          value={guests} 
          onChange={(e) => setSearchCriteria({ guests: parseInt(e.target.value) })}
          className="input-field bg-white h-[42px]"
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Room Type</label>
        <select 
          value={roomType} 
          onChange={(e) => setSearchCriteria({ roomType: e.target.value })}
          className="input-field bg-white h-[42px]"
        >
          <option value="">All Types</option>
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <button type="submit" className="btn-primary w-full h-[42px]">
          Search
        </button>
      </div>
    </form>
  );
};

export default FilterBar;
