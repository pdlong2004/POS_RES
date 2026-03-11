import api from '../lib/axois.js';

export const loginAdminApi = (payload) => {
    return api.post('/auth/login', payload);
};
