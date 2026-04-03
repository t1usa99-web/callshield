import client from './client.js';

export const getCalls = async () => {
  const response = await client.get('/calls');
  return response.data;
};

export const createCall = async (data) => {
  const response = await client.post('/calls', data);
  return response.data;
};

export const getCall = async (id) => {
  const response = await client.get(`/calls/${id}`);
  return response.data;
};

export const updateCall = async (id, data) => {
  const response = await client.patch(`/calls/${id}`, data);
  return response.data;
};

export const deleteCall = async (id) => {
  const response = await client.delete(`/calls/${id}`);
  return response.data;
};

export const updateCallStatus = async (id, status) => {
  const response = await client.patch(`/calls/${id}/status`, { status });
  return response.data;
};
