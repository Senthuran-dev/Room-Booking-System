import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  // Search parameters
  checkIn: null,
  checkOut: null,
  guests: 1,
  roomType: '',
  priceRange: [0, 5000],
  
  // Actions to update search parameters
  setSearchCriteria: (criteria) => set((state) => ({ ...state, ...criteria })),
  
  // Reset search
  clearSearch: () => set({ 
    checkIn: null, 
    checkOut: null, 
    guests: 1,
    roomType: '',
    priceRange: [0, 5000]
  })
}));
