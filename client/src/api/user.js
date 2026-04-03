import client from './client.js';

export const getProfile = async () => {
  const response = await client.get('/user/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await client.patch('/user/profile', data);
  return response.data;
};
