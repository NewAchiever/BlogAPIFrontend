import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { PATHS } from './routes.config';
const ProtectedRoute = () => {
    const { isLoggedIn, setIsAuthLoading } = useAuth();
    setIsAuthLoading(false);
    if (!isLoggedIn) {
        return <Navigate to={PATHS.LOGIN} replace />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;