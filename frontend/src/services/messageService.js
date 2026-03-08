import api from './api.js';

export const messageService = {
  send: (data) => api.post('/messages', data).then((r) => r.data),
  getAll: () => api.get('/messages').then((r) => r.data),
  markRead: (id) => api.put(`/messages/${id}/read`).then((r) => r.data),
};
