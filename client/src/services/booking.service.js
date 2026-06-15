import api from './api';

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/me');
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.patch(`/bookings/${id}/cancel`);
  return response.data;
};

// Admin routes
export const getAllBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
};
