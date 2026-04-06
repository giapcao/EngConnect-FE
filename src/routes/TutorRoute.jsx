import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/authSlice";

// Blocks access if the user already has the Tutor role
const TutorRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isTutor = user?.roles?.includes("Tutor");

  if (isTutor) return <Navigate to="/tutor/dashboard" replace />;
  return children;
};

export default TutorRoute;
