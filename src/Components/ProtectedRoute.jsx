import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const selector = useSelector((state) => state);
    const location = useLocation();
    
    const isAuthenticated = selector.UserIsLogin?.isLogin;
    
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!requireAuth && isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;