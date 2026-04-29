import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { loginAdminApi } from '../service/authApi.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('admin_token');
        const storedUser = sessionStorage.getItem('admin_user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (credentials) => {
        try {
            const response = await loginAdminApi(credentials);
            const { token: authToken, account } = response.data;

            setToken(authToken);
            setUser(account);

            sessionStorage.setItem('admin_token', authToken);
            sessionStorage.setItem('admin_user', JSON.stringify(account));

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            throw new Error(message);
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
    }, []);

    // 🚀 Performance: Memoize the context value to prevent unnecessary cascade re-renders
    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        roleName: (user?.roleId?.name || user?.roleName || '').toString(),
        isAuthenticated: !!token,
        loading,
    }), [user, token, login, logout, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

