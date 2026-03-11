import api from '../lib/axois.js';

export const loginByQRCodeApi = (tableId) => {
    return api.post('/table-auth/login-qr', { tableId });
};
