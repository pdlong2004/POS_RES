import axios from 'axios';

const BaseURL = import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api';

const api = axios.create({
    baseURL: BaseURL,
});

api.interceptors.request.use(
    (config) => {
        const path = window.location?.pathname || '';
        const isAdminApp = path.startsWith('/admin');
        const isTableAuth = config.url?.includes('table-auth');

        const adminToken = sessionStorage.getItem('admin_token');
        const tableToken = sessionStorage.getItem('tableToken');
        const legacyToken = localStorage.getItem('token');

        const tokenToUse = isTableAuth ? tableToken : isAdminApp ? adminToken : tableToken || legacyToken || adminToken;

        if (tokenToUse) config.headers.Authorization = `Bearer ${tokenToUse}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = window.location?.pathname || '';
            const isAdminApp = path.startsWith('/admin');
            const isTableAuth = error.config?.url?.includes('table-auth');
            const isAdminLogin = error.config?.url?.includes('/auth/login');

            if (!isTableAuth && !isAdminLogin) {
                if (isAdminApp) {
                    sessionStorage.removeItem('admin_token');
                    sessionStorage.removeItem('admin_user');
                    window.location.href = '/admin';
                } else {
                    sessionStorage.removeItem('tableToken');
                }
            }
        }
        return Promise.reject(error);
    },
);

export default api;
