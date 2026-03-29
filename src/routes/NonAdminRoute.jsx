import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";

const NonAdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (isAuthenticated) {
    const isAdmin = user?.roles?.includes("Admin");
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  }

  return children || <Outlet />;
};

export default NonAdminRoute;
