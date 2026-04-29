import api from '../lib/axois.js';

export const getStaffApi = () => api.get('/staff');

export const createStaffApi = (data) => api.post('/staff', data);

export const updateStaffApi = (id, data) => api.put(`/staff/${id}`, data);

export const deleteStaffApi = (id) => api.delete(`/staff/${id}`);

export const getLogsApi = (params) => api.get('/logs', { params });

// Shift APIs
export const getShiftsApi = () => api.get('/shifts');
export const createShiftApi = (data) => api.post('/shifts', data);
export const getScheduleApi = (params) => api.get('/shifts/schedule', { params });
export const assignShiftApi = (data) => api.post('/shifts/assign', data);
export const autoScheduleApi = (data) => api.post('/shifts/auto-generate', data);
export const checkInApi = (assignmentId) => api.post(`/shifts/check-in/${assignmentId}`);
export const checkOutApi = (assignmentId) => api.post(`/shifts/check-out/${assignmentId}`);
