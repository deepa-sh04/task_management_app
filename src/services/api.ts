import axios from 'axios';

const BASE_URL = 'https://685013d7e7c42cfd17974a33.mockapi.io';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const taxesAPI = {
  getAll: () => api.get('/taxes'),
  getById: (id: string) => api.get(`/taxes/${id}`),
  update: (id: string, data: any) => api.put(`/taxes/${id}`, data),
  create: (data: any) => api.post('/taxes', data),
  delete: (id: string) => api.delete(`/taxes/${id}`),
};

export const countriesAPI = {
  getAll: () => api.get('/countries'),
};