import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import NonAdminRoute from "./NonAdminRoute";
import TutorRoute from "./TutorRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import TutorDashboardLayout from "../layouts/TutorDashboardLayout";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import ForgotPass from "../pages/Authentication/ForgotPass/ForgotPass";
import ResetPassword from "../pages/Authentication/ResetPassword/ResetPassword";
import VerifyEmail from "../pages/Authentication/VerifyEmail/VerifyEmail";
import GoogleAuthVerify from "../pages/Authentication/GoogleAuthVerify/GoogleAuthVerify";
import LoginFailed from "../pages/Authentication/LoginFailed/LoginFailed";
import About from "../pages/AboutUs/About";
import Courses from "../pages/Courses/Courses";
import CourseDetail from "../pages/Courses/CourseDetail";
import BecomeTutor from "../pages/BecomeTutor/BecomeTutor";
import TutorRegistration from "../pages/BecomeTutor/TutorRegistration";
import TutorOnboarding from "../pages/TutorDashboard/Onboarding/TutorOnboarding";

// Student Dashboard Pages
import Dashboard from "../pages/StudentDashboard/Dashboard/Dashboard";
import BrowseCourses from "../pages/StudentDashboard/BrowseCourses/BrowseCourses";
import StudentCourseDetail from "../pages/StudentDashboard/BrowseCourses/CourseDetail";
import MyCourses from "../pages/StudentDashboard/MyCourses/MyCourses";
import Schedule from "../pages/StudentDashboard/Schedule/Schedule";
import Profile from "../pages/StudentDashboard/Profile/Profile";
import Notification from "../pages/StudentDashboard/Notification/Notification";

// Tutor Dashboard Pages
import TutorDashboard from "../pages/TutorDashboard/Dashboard/Dashboard";
import TutorMyCourses from "../pages/TutorDashboard/MyCourses/MyCourses";
import TutorCourseDetail from "../pages/TutorDashboard/MyCourses/CourseDetail";
import TutorSchedule from "../pages/TutorDashboard/Schedule/Schedule";
import TutorStudents from "../pages/TutorDashboard/Students/Students";
import TutorEarnings from "../pages/TutorDashboard/Earnings/Earnings";
import TutorProfile from "../pages/TutorDashboard/Profile/Profile";
import TutorNotification from "../pages/TutorDashboard/Notification/Notification";
import TutorCreateCourse from "../pages/TutorDashboard/CreateCourse/CreateCourse";

// Admin Dashboard Pages
import AdminDashboard from "../pages/AdminDashboard/Dashboard/Dashboard";
import AdminStudents from "../pages/AdminDashboard/StudentManagement/StudentManagement";
import AdminTutors from "../pages/AdminDashboard/TutorManagament/TutorManagement";
import AdminVerification from "../pages/AdminDashboard/TutorManagament/TutorVerification";
import AdminCourses from "../pages/AdminDashboard/CourseManagement/CourseManagement";
import AdminCourseVerification from "../pages/AdminDashboard/CourseManagement/CourseVerification";
import AdminCategories from "../pages/AdminDashboard/CourseManagement/CategoryManagement";
import AdminAnalytics from "../pages/AdminDashboard/AnalyticsReports/AnalyticsReports";
import AdminFinance from "../pages/AdminDashboard/FinancialManagement/FinancialManagement";
import AdminSettings from "../pages/AdminDashboard/Settings/Settings";
import AdminSupportTickets from "../pages/AdminDashboard/SupportTickets/SupportTickets";

// Help & Support (shared by student/tutor)
import HelpSupport from "../pages/HelpSupport/HelpSupport";

// Not Found Page
import NotFound from "../pages/NotFound/NotFound";
import Test from "../pages/Test/test";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NonAdminRoute>
        <MainLayout />
      </NonAdminRoute>
    ),
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
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <GuestRoute>
            <ForgotPass />
          </GuestRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        ),
      },
      {
        path: "verify",
        element: (
          <GuestRoute>
            <VerifyEmail />
          </GuestRoute>
        ),
      },
      {
        path: "auth/verify",
        element: <GoogleAuthVerify />,
      },
      {
        path: "auth/login-failed",
        element: <LoginFailed />,
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
        element: (
          <TutorRoute>
            <TutorRegistration />
          </TutorRoute>
        ),
      },
      {
        path: "tutor/onboarding",
        element: <TutorOnboarding />,
      },
      {
        path: "help-support",
        element: <HelpSupport />,
      },
    ],
  },
  {
    path: "/student",
    element: (
      <NonAdminRoute>
        <DashboardLayout />
      </NonAdminRoute>
    ),
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
    element: (
      <NonAdminRoute>
        <TutorDashboardLayout />
      </NonAdminRoute>
    ),
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
        path: "create-course/:courseId",
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
    element: (
      <AdminRoute>
        <AdminDashboardLayout />
      </AdminRoute>
    ),
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
        path: "verification",
        element: <AdminVerification />,
      },
      {
        path: "courses",
        element: <AdminCourses />,
      },
      {
        path: "course-verification",
        element: <AdminCourseVerification />,
      },
      {
        path: "categories",
        element: <AdminCategories />,
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
      {
        path: "support-tickets",
        element: <AdminSupportTickets />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
