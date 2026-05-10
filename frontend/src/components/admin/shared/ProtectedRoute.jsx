import { useAuth } from '../../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import AdminLoading from './AdminLoading';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return <AdminLoading fullScreen message="Đang xác thực tài khoản..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
    }

    if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const roleName = (user?.roleId?.name || user?.roleName || '').toString().trim().toLowerCase();
        const normalizedAllowed = allowedRoles.map((r) => String(r).trim().toLowerCase());
        if (!normalizedAllowed.includes(roleName)) {
            return <Navigate to="/admin/unauthorized" replace state={{ from: location.pathname }} />;
        }
    }

    return children;
};

export default ProtectedRoute;

