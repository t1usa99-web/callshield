import client from './client.js';

export const getComplaints = async () => {
  const response = await client.get('/complaints');
  return response.data;
};

export const createComplaint = async (data) => {
  const response = await client.post('/complaints', data);
  return response.data;
};

export const getComplaint = async (id) => {
  const response = await client.get(`/complaints/${id}`);
  return response.data;
};
