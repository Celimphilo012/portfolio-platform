import api from './api.js';

export const projectService = {
  getAll: () => api.get('/projects').then((r) => r.data),
  getBySlug: (slug) => api.get(`/projects/${slug}`).then((r) => r.data),
  create: (data) => api.post('/projects', data).then((r) => r.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data),
  uploadImage: (id, form) =>
    api
      .post(`/projects/${id}/image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
};
