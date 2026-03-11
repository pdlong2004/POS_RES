import api from '../lib/axois.js';

export const getRolesApi = () => api.get('/roles');
export const createRoleApi = (payload) => api.post('/roles', payload);
export const updateRoleApi = (id, payload) => api.put(`/roles/${id}`, payload);
export const deleteRoleApi = (id) => api.delete(`/roles/${id}`);

export const getAllPermissionsApi = () => api.get('/roles/permissions/all');
export const upsertPermissionApi = (payload) => api.post('/roles/permissions', payload);

export const getRolePermissionsApi = (roleId) => api.get(`/roles/${roleId}/permissions`);
export const setRolePermissionsApi = (roleId, payload) => api.put(`/roles/${roleId}/permissions`, payload);

