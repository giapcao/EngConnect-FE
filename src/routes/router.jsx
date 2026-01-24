import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import ForgotPass from "../pages/Authentication/ForgotPass/ForgotPass";
import Pricing from "../pages/Pricing/Pricing";
import About from "../pages/AboutUs/About";
import Courses from "../pages/Courses/Courses";

// Student Dashboard Pages
import Dashboard from "../pages/StudentDashboard/Dashboard/Dashboard";
import BrowseCourses from "../pages/StudentDashboard/BrowseCourses/BrowseCourses";
import MyCourses from "../pages/StudentDashboard/MyCourses/MyCourses";
import Schedule from "../pages/StudentDashboard/Schedule/Schedule";
import Homework from "../pages/StudentDashboard/Homework/Homework";
import Community from "../pages/StudentDashboard/Community/Community";
import Profile from "../pages/StudentDashboard/Profile/Profile";
import Notification from "../pages/StudentDashboard/Notification/Notification";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPass />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
    ],
  },
  {
    path: "/student",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "browse-courses",
        element: <BrowseCourses />,
      },
      {
        path: "my-courses",
        element: <MyCourses />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "homework",
        element: <Homework />,
      },
      {
        path: "community",
        element: <Community />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "notifications",
        element: <Notification />,
      },
    ],
  },
]);
