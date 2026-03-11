import api from '../lib/axois.js';

export const getStatusTablesApi = () => {
    return api.get('/status-tables');
};

export const createStatusTableApi = (data) => {
    return api.post('/status-tables', data);
};
