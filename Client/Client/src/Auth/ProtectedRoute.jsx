import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
   
    return <Navigate to="/" replace />;
  }

  // Allowed
  return <Outlet />;
};

export default ProtectedRoute;