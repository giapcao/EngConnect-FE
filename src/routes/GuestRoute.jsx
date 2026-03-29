import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";

const GuestRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated) return children;

  const isAdmin = user?.roles?.includes("Admin");
  return <Navigate to={isAdmin ? "/admin/dashboard" : "/courses"} replace />;
};

export default GuestRoute;
