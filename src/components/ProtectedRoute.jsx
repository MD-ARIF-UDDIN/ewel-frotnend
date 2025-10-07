import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to appropriate login page based on the route being accessed
        if (location.pathname.startsWith('/dashboard/superadmin')) {
            return <Navigate to="/login-superadmin" replace />;
        } else if (location.pathname.startsWith('/dashboard/hcs')) {
            return <Navigate to="/login-admin" replace />;
        } else {
            return <Navigate to="/login-customer" replace />;
        }
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;