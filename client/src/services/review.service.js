import api from './api';

export const createReview = async (roomId, reviewData) => {
  const response = await api.post(`/rooms/${roomId}/reviews`, reviewData);
  return response.data;
};
