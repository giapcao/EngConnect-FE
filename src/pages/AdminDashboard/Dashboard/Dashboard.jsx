import { Card, CardBody, Button, Avatar } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  Users,
  ChalkboardTeacher,
  BookOpen,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  ArrowRight,
  CalendarCheck,
  Clock,
  Star,
} from "@phosphor-icons/react";

const Dashboard = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const stats = [
    {
      icon: Users,
      label: t("adminDashboard.dashboard.stats.totalStudents"),
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: ChalkboardTeacher,
      label: t("adminDashboard.dashboard.stats.totalTutors"),
      value: "458",
      change: "+8.2%",
      trend: "up",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: BookOpen,
      label: t("adminDashboard.dashboard.stats.totalCourses"),
      value: "1,234",
      change: "+15.3%",
      trend: "up",
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: CurrencyDollar,
      label: t("adminDashboard.dashboard.stats.revenue"),
      value: "$128,450",
      change: "+22.4%",
      trend: "up",
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

  const topTutors = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=tutor1",
      specialty: "Business English",
      rating: 4.9,
      students: 234,
      earnings: "$12,450",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?u=tutor2",
      specialty: "IELTS Preparation",
      rating: 4.8,
      students: 189,
      earnings: "$9,830",
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?u=tutor3",
      specialty: "Conversational English",
      rating: 4.9,
      students: 312,
      earnings: "$15,200",
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: "tutor",
      name: "David Brown",
      avatar: "https://i.pravatar.cc/150?u=pending1",
      specialty: "Grammar Expert",
      submitted: "2 days ago",
    },
    {
      id: 2,
      type: "course",
      name: "Advanced TOEFL Strategies",
      tutor: "Lisa Wang",
      submitted: "1 day ago",
    },
    {
      id: 3,
      type: "tutor",
      name: "Anna Martinez",
      avatar: "https://i.pravatar.cc/150?u=pending2",
      specialty: "Academic Writing",
      submitted: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between">
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
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendUp className="w-4 h-4" />
                    ) : (
                      <TrendDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card
            shadow="none"
            className="border-none h-full"
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

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card
            shadow="none"
            className="border-none h-full"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {t("adminDashboard.dashboard.pendingApprovals")}
                </h3>
                <span
                  className="px-2 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: colors.state.warning + "20",
                    color: colors.state.warning,
                  }}
                >
                  {pendingApprovals.length}
                </span>
              </div>
              <div className="space-y-3">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <div className="flex items-start gap-3">
                      {item.avatar ? (
                        <Avatar src={item.avatar} size="sm" />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: colors.background.primaryLight,
                          }}
                        >
                          <BookOpen
                            className="w-4 h-4"
                            style={{ color: colors.primary.main }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.text.secondary }}
                        >
                          {item.specialty || item.tutor}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.text.tertiary }}
                        >
                          {item.submitted}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1"
                        style={{
                          backgroundColor: colors.state.success,
                          color: colors.text.white,
                        }}
                      >
                        {t("adminDashboard.dashboard.approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="flex-1"
                        style={{
                          backgroundColor: colors.state.error + "20",
                          color: colors.state.error,
                        }}
                      >
                        {t("adminDashboard.dashboard.reject")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Top Tutors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
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
                {t("adminDashboard.dashboard.topTutors")}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topTutors.map((tutor, index) => (
                <div
                  key={tutor.id}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={tutor.avatar} size="md" />
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {tutor.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {tutor.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Star
                          className="w-4 h-4"
                          weight="fill"
                          style={{ color: colors.state.warning }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {tutor.rating}
                        </span>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        Rating
                      </p>
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {tutor.students}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        Students
                      </p>
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: colors.state.success }}
                      >
                        {tutor.earnings}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        Earnings
                      </p>
                    </div>
                  </div>
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
