import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@store/auth";

const ProtectedRoutes = () => {
  const { auth } = useAuthStore();

  if (auth) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
