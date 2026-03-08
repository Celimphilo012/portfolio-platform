import api from './api.js';

export const analyticsService = {
  track: (eventType, resourceId = null, resourceSlug = null) =>
    api.post('/analytics/track', { eventType, resourceId, resourceSlug }).catch(() => {}),
  getSummary: () => api.get('/analytics/summary').then((r) => r.data),
};
