import api from './api.js';

export const resumeService = {
  get: () => api.get('/resume').then((r) => r.data),
  download: () => `${import.meta.env.VITE_API_URL}/resume/download`,
  upload: (form) =>
    api
      .post('/resume', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
};
