import api from './api.js';

export const aboutService = {
  get: () => api.get('/about').then((r) => r.data),
  update: (data) => api.put('/about', data).then((r) => r.data),
};
