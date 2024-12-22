import { Navigate } from "react-router-dom";

const AuthGuard = ({ children, role }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");
    return token && userRole === role;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
