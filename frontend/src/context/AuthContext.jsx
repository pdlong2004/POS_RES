import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdminApi } from '../service/authApi.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await loginAdminApi(credentials);
            const { token: authToken, account } = response.data;

            setToken(authToken);
            setUser(account);

            localStorage.setItem('admin_token', authToken);
            localStorage.setItem('admin_user', JSON.stringify(account));

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    };

    const value = {
        user,
        token,
        login,
        logout,
        roleName: (user?.roleId?.name || user?.roleName || '').toString(),
        isAuthenticated: !!token,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
