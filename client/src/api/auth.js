import client from './client.js';

export const registerUser = async (data) => {
  const response = await client.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await client.post('/auth/login', data);
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await client.post('/auth/refresh', { refreshToken });
  return response.data;
};
