import { useAuth } from '../../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
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

