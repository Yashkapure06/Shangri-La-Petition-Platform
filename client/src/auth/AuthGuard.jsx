import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  return (
    <>
      {isAuthenticated ? (
        children
      ) : (
        <Navigate replace to="/auth/login" state={{ from: pathname }} />
      )}
    </>
  );
};

export default AuthGuard;
