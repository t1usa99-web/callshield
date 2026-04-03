import client from './client.js';

export const getClaims = async () => {
  const response = await client.get('/claims');
  return response.data;
};

export const createClaim = async (data) => {
  const response = await client.post('/claims', data);
  return response.data;
};

export const getClaim = async (id) => {
  const response = await client.get(`/claims/${id}`);
  return response.data;
};

export const updateClaim = async (id, data) => {
  const response = await client.patch(`/claims/${id}`, data);
  return response.data;
};
