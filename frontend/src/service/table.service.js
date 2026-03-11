import api from '../lib/axois.js';

export const getTablesApi = () => {
    return api.get('/tables');
};

export const createTableApi = (data) => {
    return api.post('/tables', data);
};

export const updateTableStatusApi = (id, statusId) => {
    return api.put(`/tables/${id}/status`, { statusId });
};
