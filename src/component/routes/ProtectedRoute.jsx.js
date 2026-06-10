import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  
  // Check multiple possible authentication keys
  const isAuthenticated = 
    localStorage.getItem('isAuthenticated') === 'true' ||
    localStorage.getItem('token') ||
    localStorage.getItem('user');
  
  const user = localStorage.getItem('user');
  
  console.log("[PROTECTED ROUTE CHECK]:", {
    isAuthenticated,
    hasUser: !!user,
    currentPath: location.pathname
  });
  
  if (!isAuthenticated) {
    console.log("[REDIRECTING TO LOGIN]: Not authenticated");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("[ACCESS GRANTED]: User authenticated");
  return <Outlet />;
};

export default ProtectedRoute;