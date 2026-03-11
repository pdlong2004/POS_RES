import api from '../lib/axois.js';

export const getRevenueStatsApi = (params) => api.get('/stats/revenue', { params });
