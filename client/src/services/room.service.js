import api from './api';

export const getRooms = async (params) => {
  const response = await api.get('/rooms', { params });
  return response.data;
};

export const getRoomById = async (id) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

// Admin routes
export const createRoom = async (data) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const response = await api.post('/rooms', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const updateRoom = async (id, data) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
  const response = await api.put(`/rooms/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const uploadRoomImages = async (id, formData) => {
  const response = await api.post(`/rooms/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};

export const deleteRoomImage = async (roomId, imgId) => {
  const response = await api.delete(`/rooms/${roomId}/images/${imgId}`);
  return response.data;
};
