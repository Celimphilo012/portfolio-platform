import api from './api.js';

export const skillService = {
  getAll: () => api.get('/skills').then((r) => r.data),
  create: (data) => api.post('/skills', data).then((r) => r.data),
  update: (id, data) => api.put(`/skills/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/skills/${id}`).then((r) => r.data),
};
