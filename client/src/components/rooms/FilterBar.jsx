import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, RotateCcw } from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';

const FilterBar = ({ onSearch }) => {
  const { checkIn, checkOut, guests, roomType, setSearchCriteria, clearSearch } = useBookingStore();

  const isFiltered = Boolean(checkIn || checkOut || guests > 1 || roomType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-5 rounded-2xl shadow-level-1 border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check In</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setSearchCriteria({ checkIn: date })}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          className="input-field w-full"
          placeholderText="Select date"
          isClearable
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Check Out</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setSearchCriteria({ checkOut: date })}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          className="input-field w-full"
          placeholderText="Select date"
          isClearable
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Guests</label>
        <select 
          value={guests} 
          onChange={(e) => setSearchCriteria({ guests: parseInt(e.target.value, 10) })}
          className="input-field bg-white h-[42px] w-full"
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Room Type</label>
        <select 
          value={roomType} 
          onChange={(e) => setSearchCriteria({ roomType: e.target.value })}
          className="input-field bg-white h-[42px] w-full"
        >
          <option value="">All Types</option>
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
        </select>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <button type="submit" className="btn-primary flex-1 md:flex-initial h-[42px] px-6 flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        {isFiltered && (
          <button 
            type="button" 
            onClick={clearSearch}
            className="p-2.5 h-[42px] border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default FilterBar;
