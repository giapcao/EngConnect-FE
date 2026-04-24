import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";

// Blocks access to tutor routes if the user does not have the Tutor role
const RequireTutorRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isTutor = user?.roles?.includes("Tutor");
  if (!isTutor) return <Navigate to="/student/dashboard" replace />;

  return children || <Outlet />;
};

export default RequireTutorRoute;
