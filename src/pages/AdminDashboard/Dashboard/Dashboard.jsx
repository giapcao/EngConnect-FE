import { useState, useEffect } from "react";
import { Card, CardBody, Button, Avatar, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi, coursesApi } from "../../../api";
import {
  Users,
  ChalkboardTeacher,
  BookOpen,
  CurrencyDollar,
  ArrowRight,
} from "@phosphor-icons/react";

const Dashboard = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();

  const [statsLoading, setStatsLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTutors, setTotalTutors] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);

  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingCoursesCount, setPendingCoursesCount] = useState(0);
  const [courseDetails, setCourseDetails] = useState({});
  const [pendingTutors, setPendingTutors] = useState([]);
  const [pendingTutorsCount, setPendingTutorsCount] = useState(0);
  const [tutorDetails, setTutorDetails] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, tutorsRes, coursesRes] = await Promise.allSettled([
          adminApi.getAllStudents({ "page-size": 1, page: 1 }),
          adminApi.getAllTutors({ "page-size": 1, page: 1 }),
          adminApi.getAllCoursesAdmin({ "page-size": 1, page: 1 }),
        ]);
        if (studentsRes.status === "fulfilled")
          setTotalStudents(studentsRes.value.data?.totalItems || 0);
        if (tutorsRes.status === "fulfilled")
          setTotalTutors(tutorsRes.value.data?.totalItems || 0);
        if (coursesRes.status === "fulfilled")
          setTotalCourses(coursesRes.value.data?.totalItems || 0);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchPending = async () => {
      setPendingLoading(true);
      try {
        const [courseRes, tutorRes] = await Promise.allSettled([
          coursesApi.getCourseVerificationRequests({
            Status: "Pending",
            "page-size": 5,
            page: 1,
          }),
          adminApi.getVerificationRequests({
            Status: "Pending",
            "page-size": 5,
            page: 1,
          }),
        ]);

        if (courseRes.status === "fulfilled") {
          const items = courseRes.value.data?.items || [];
          setPendingCourses(items);
          setPendingCoursesCount(courseRes.value.data?.totalItems || 0);
          const ids = [
            ...new Set(items.map((r) => r.courseId).filter(Boolean)),
          ];
          if (ids.length > 0) {
            const results = await Promise.allSettled(
              ids.map((id) => coursesApi.getCourseById(id)),
            );
            const details = {};
            results.forEach((r, i) => {
              if (r.status === "fulfilled") details[ids[i]] = r.value.data;
            });
            setCourseDetails(details);
          }
        }

        if (tutorRes.status === "fulfilled") {
          const items = tutorRes.value.data?.items || [];
          setPendingTutors(items);
          setPendingTutorsCount(tutorRes.value.data?.totalItems || 0);
          const ids = [...new Set(items.map((r) => r.tutorId).filter(Boolean))];
          if (ids.length > 0) {
            const results = await Promise.allSettled(
              ids.map((id) => adminApi.getTutorById(id)),
            );
            const details = {};
            results.forEach((r, i) => {
              if (r.status === "fulfilled") details[ids[i]] = r.value.data;
            });
            setTutorDetails(details);
          }
        }
      } catch (err) {
        console.error("Failed to fetch pending approvals:", err);
      } finally {
        setPendingLoading(false);
      }
    };
    fetchPending();
  }, []);

  const stats = [
    {
      icon: Users,
      label: t("adminDashboard.dashboard.stats.totalStudents"),
      value: statsLoading ? "..." : totalStudents.toLocaleString(),
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: ChalkboardTeacher,
      label: t("adminDashboard.dashboard.stats.totalTutors"),
      value: statsLoading ? "..." : totalTutors.toLocaleString(),
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: BookOpen,
      label: t("adminDashboard.dashboard.stats.totalCourses"),
      value: statsLoading ? "..." : totalCourses.toLocaleString(),
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: CurrencyDollar,
      label: t("adminDashboard.dashboard.stats.revenue"),
      value: "$128,450",
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "student",
      action: "New student registration",
      user: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=student1",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "tutor",
      action: "Tutor application submitted",
      user: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=tutor1",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "course",
      action: "New course published",
      user: "Business English Pro",
      avatar: null,
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "payment",
      action: "Payment received",
      user: "$450.00",
      avatar: null,
      time: "2 hours ago",
    },
    {
      id: 5,
      type: "student",
      action: "Course enrollment",
      user: "Emily Chen",
      avatar: "https://i.pravatar.cc/150?u=student2",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-1"
          style={{ color: colors.text.primary }}
        >
          {t("adminDashboard.dashboard.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("adminDashboard.dashboard.subtitle")}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon
                    className="w-6 h-6"
                    weight="duotone"
                    style={{ color: stat.color }}
                  />
                </div>
                <div className="mt-4">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.text.secondary }}
                  >
                    {stat.label}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pending Approvals — 2 separate cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Verification card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            shadow="none"
            className="border-none h-full"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen
                    className="w-5 h-5"
                    style={{ color: colors.primary.main }}
                  />
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {t("adminDashboard.dashboard.courseVerification")}
                  </h3>
                  <span
                    className="px-1.5 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: colors.primary.main + "20",
                      color: colors.primary.main,
                    }}
                  >
                    {pendingCoursesCount}
                  </span>
                </div>
                <Button
                  variant="light"
                  size="sm"
                  endContent={<ArrowRight className="w-3 h-3" />}
                  style={{ color: colors.primary.main }}
                  onPress={() => navigate("/admin/course-verification")}
                >
                  {t("adminDashboard.dashboard.viewAll")}
                </Button>
              </div>
              {pendingLoading ? (
                <div className="flex justify-center py-3">
                  <Spinner size="sm" />
                </div>
              ) : pendingCourses.length === 0 ? (
                <p
                  className="text-xs text-center py-3"
                  style={{ color: colors.text.tertiary }}
                >
                  {t("adminDashboard.dashboard.noPending")}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {pendingCourses.slice(0, 5).map((item) => {
                    const course = courseDetails[item.courseId];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: colors.background.primaryLight,
                          }}
                        >
                          <BookOpen
                            className="w-3.5 h-3.5"
                            style={{ color: colors.primary.main }}
                          />
                        </div>
                        <p
                          className="text-xs flex-1 truncate"
                          style={{ color: colors.text.primary }}
                        >
                          {course?.title || item.courseId}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Tutor Verification card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            shadow="none"
            className="border-none h-full"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChalkboardTeacher
                    className="w-5 h-5"
                    style={{ color: colors.state.success }}
                  />
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {t("adminDashboard.dashboard.tutorVerification")}
                  </h3>
                  <span
                    className="px-1.5 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: colors.state.success + "20",
                      color: colors.state.success,
                    }}
                  >
                    {pendingTutorsCount}
                  </span>
                </div>
                <Button
                  variant="light"
                  size="sm"
                  endContent={<ArrowRight className="w-3 h-3" />}
                  style={{ color: colors.primary.main }}
                  onPress={() => navigate("/admin/verification")}
                >
                  {t("adminDashboard.dashboard.viewAll")}
                </Button>
              </div>
              {pendingLoading ? (
                <div className="flex justify-center py-3">
                  <Spinner size="sm" />
                </div>
              ) : pendingTutors.length === 0 ? (
                <p
                  className="text-xs text-center py-3"
                  style={{ color: colors.text.tertiary }}
                >
                  {t("adminDashboard.dashboard.noPending")}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {pendingTutors.slice(0, 5).map((item) => {
                    const tutor = tutorDetails[item.tutorId];
                    const name = tutor?.user
                      ? `${tutor.user.firstName || ""} ${tutor.user.lastName || ""}`.trim()
                      : "";
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <Avatar
                          src={tutor?.avatar || ""}
                          size="sm"
                          className="w-6 h-6 flex-shrink-0"
                        />
                        <p
                          className="text-xs flex-1 truncate"
                          style={{ color: colors.text.primary }}
                        >
                          {name || item.tutorId}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.dashboard.recentActivities")}
              </h3>
              <Button
                variant="light"
                size="sm"
                endContent={<ArrowRight className="w-4 h-4" />}
                style={{ color: colors.primary.main }}
              >
                {t("adminDashboard.dashboard.viewAll")}
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  {activity.avatar ? (
                    <Avatar src={activity.avatar} size="sm" />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: colors.background.primaryLight,
                      }}
                    >
                      {activity.type === "course" ? (
                        <BookOpen
                          className="w-4 h-4"
                          style={{ color: colors.primary.main }}
                        />
                      ) : (
                        <CurrencyDollar
                          className="w-4 h-4"
                          style={{ color: colors.state.success }}
                        />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {activity.action}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {activity.user}
                    </p>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
