import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import TutorDashboardLayout from "../layouts/TutorDashboardLayout";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import ForgotPass from "../pages/Authentication/ForgotPass/ForgotPass";
import ResetPassword from "../pages/Authentication/ResetPassword/ResetPassword";
import VerifyEmail from "../pages/Authentication/VerifyEmail/VerifyEmail";
import Pricing from "../pages/Pricing/Pricing";
import About from "../pages/AboutUs/About";
import Courses from "../pages/Courses/Courses";
import CourseDetail from "../pages/Courses/CourseDetail";
import BecomeTutor from "../pages/BecomeTutor/BecomeTutor";
import TutorRegistration from "../pages/BecomeTutor/TutorRegistration";

// Student Dashboard Pages
import Dashboard from "../pages/StudentDashboard/Dashboard/Dashboard";
import BrowseCourses from "../pages/StudentDashboard/BrowseCourses/BrowseCourses";
import StudentCourseDetail from "../pages/StudentDashboard/BrowseCourses/CourseDetail";
import MyCourses from "../pages/StudentDashboard/MyCourses/MyCourses";
import Schedule from "../pages/StudentDashboard/Schedule/Schedule";
import Homework from "../pages/StudentDashboard/Homework/Homework";
import Profile from "../pages/StudentDashboard/Profile/Profile";
import Notification from "../pages/StudentDashboard/Notification/Notification";

// Tutor Dashboard Pages
import TutorDashboard from "../pages/TutorDashboard/Dashboard/Dashboard";
import TutorMyCourses from "../pages/TutorDashboard/MyCourses/MyCourses";
import TutorCourseDetail from "../pages/TutorDashboard/MyCourses/CourseDetail";
import TutorSchedule from "../pages/TutorDashboard/Schedule/Schedule";
import TutorStudents from "../pages/TutorDashboard/Students/Students";
import TutorHomework from "../pages/TutorDashboard/Homework/Homework";
import TutorEarnings from "../pages/TutorDashboard/Earnings/Earnings";
import TutorProfile from "../pages/TutorDashboard/Profile/Profile";
import TutorNotification from "../pages/TutorDashboard/Notification/Notification";
import TutorCreateCourse from "../pages/TutorDashboard/CreateCourse/CreateCourse";

// Admin Dashboard Pages
import AdminDashboard from "../pages/AdminDashboard/Dashboard/Dashboard";
import AdminStudents from "../pages/AdminDashboard/StudentManagement/StudentManagement";
import AdminTutors from "../pages/AdminDashboard/TutorManagament/TutorManagement";
import AdminCourses from "../pages/AdminDashboard/CourseManagement/CourseManagement";
import AdminAnalytics from "../pages/AdminDashboard/AnalyticsReports/AnalyticsReports";
import AdminFinance from "../pages/AdminDashboard/FinancialManagement/FinancialManagement";
import AdminSettings from "../pages/AdminDashboard/Settings/Settings";

// Not Found Page
import NotFound from "../pages/NotFound/NotFound";
import Test from "../pages/Test/test";

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
        path: "test",
        element: <Test />,
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
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "verify",
        element: <VerifyEmail />,
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
      {
        path: "courses/:id",
        element: <CourseDetail />,
      },
      {
        path: "become-tutor",
        element: <BecomeTutor />,
      },
      {
        path: "register-tutor",
        element: <TutorRegistration />,
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
        path: "courses/:id",
        element: <StudentCourseDetail />,
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
        path: "profile",
        element: <Profile />,
      },
      {
        path: "notifications",
        element: <Notification />,
      },
    ],
  },
  {
    path: "/tutor",
    element: <TutorDashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <TutorDashboard />,
      },
      {
        path: "my-courses",
        element: <TutorMyCourses />,
      },
      {
        path: "courses/:id",
        element: <TutorCourseDetail />,
      },
      {
        path: "create-course",
        element: <TutorCreateCourse />,
      },
      {
        path: "schedule",
        element: <TutorSchedule />,
      },
      {
        path: "students",
        element: <TutorStudents />,
      },
      {
        path: "homework",
        element: <TutorHomework />,
      },
      {
        path: "earnings",
        element: <TutorEarnings />,
      },
      {
        path: "profile",
        element: <TutorProfile />,
      },
      {
        path: "notifications",
        element: <TutorNotification />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "students",
        element: <AdminStudents />,
      },
      {
        path: "tutors",
        element: <AdminTutors />,
      },
      {
        path: "courses",
        element: <AdminCourses />,
      },
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },
      {
        path: "finance",
        element: <AdminFinance />,
      },
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
