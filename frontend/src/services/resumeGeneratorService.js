import api from './api.js';

export const generateResume = (data) => api.post('/resume/generate', data);
export const improveResume = (data) => api.post('/resume/improve', data);
export const downloadResumePDF = (data) => api.post('/resume/generate-pdf', data);
export const saveResume = (data) => api.post('/resume/save', data);
export const getSavedResumes = () => api.get('/resume/saved');
export const deleteSavedResume = (id) => api.delete(`/resume/saved/${id}`);
