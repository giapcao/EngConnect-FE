import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";

const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const isAdmin = user?.roles?.includes("Admin");
  if (!isAdmin) return <Navigate to="/courses" replace />;

  return children || <Outlet />;
};

export default AdminRoute;
