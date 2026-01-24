import { Card, CardBody, Button, Avatar, Progress, Image } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  CurrencyDollar,
  CalendarCheck,
  VideoCamera,
  ArrowRight,
  Star,
  TrendUp,
  Users,
  ChartLine,
} from "@phosphor-icons/react";
import IllustrationImage from "../../../assets/illustrations/wait.avif";

const Dashboard = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const stats = [
    {
      icon: Users,
      label: t("tutorDashboard.dashboard.stats.totalStudents"),
      value: "24",
      change: "+3",
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: BookOpen,
      label: t("tutorDashboard.dashboard.stats.activeCourses"),
      value: "5",
      change: "+1",
      color: colors.state.info,
      bg: `${colors.state.info}20`,
    },
    {
      icon: Clock,
      label: t("tutorDashboard.dashboard.stats.hoursTeached"),
      value: "128",
      change: "+12",
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: CurrencyDollar,
      label: t("tutorDashboard.dashboard.stats.monthlyEarnings"),
      value: "$2,450",
      change: "+18%",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: "Business English - Meeting Skills",
      student: "Nguyen Van A",
      studentAvatar: "https://i.pravatar.cc/150?u=student1",
      time: "10:00 AM",
      date: "Today",
      duration: "45 min",
    },
    {
      id: 2,
      title: "IELTS Writing Task 2",
      student: "Tran Thi B",
      studentAvatar: "https://i.pravatar.cc/150?u=student2",
      time: "2:00 PM",
      date: "Today",
      duration: "60 min",
    },
    {
      id: 3,
      title: "Conversational English",
      student: "Le Van C",
      studentAvatar: "https://i.pravatar.cc/150?u=student3",
      time: "9:00 AM",
      date: "Tomorrow",
      duration: "30 min",
    },
  ];

  const recentStudents = [
    {
      id: 1,
      name: "Nguyen Van A",
      avatar: "https://i.pravatar.cc/150?u=student1",
      course: "Business English",
      progress: 65,
      lastLesson: "2 hours ago",
    },
    {
      id: 2,
      name: "Tran Thi B",
      avatar: "https://i.pravatar.cc/150?u=student2",
      course: "IELTS Preparation",
      progress: 40,
      lastLesson: "Yesterday",
    },
    {
      id: 3,
      name: "Le Van C",
      avatar: "https://i.pravatar.cc/150?u=student3",
      course: "Conversational English",
      progress: 85,
      lastLesson: "3 days ago",
    },
  ];

  const recentReviews = [
    {
      id: 1,
      student: "Nguyen Van A",
      avatar: "https://i.pravatar.cc/150?u=student1",
      rating: 5,
      comment: "Excellent teacher! Very patient and clear explanations.",
      date: "2 days ago",
    },
    {
      id: 2,
      student: "Tran Thi B",
      avatar: "https://i.pravatar.cc/150?u=student2",
      rating: 5,
      comment: "Great lesson structure and helpful feedback.",
      date: "1 week ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          shadow="none"
          className="border-none overflow-hidden"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-0">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="p-6 md:p-8 flex-1">
                <h1
                  className="text-2xl lg:text-3xl font-bold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorDashboard.dashboard.welcome")}, Sarah! 👋
                </h1>
                <p className="mb-4" style={{ color: colors.text.secondary }}>
                  {t("tutorDashboard.dashboard.welcomeSubtitle")}
                </p>
                <Button
                  color="primary"
                  endContent={<VideoCamera weight="fill" className="w-4 h-4" />}
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("tutorDashboard.dashboard.startLesson")}
                </Button>
              </div>
              <div className="hidden md:block w-48 lg:w-64 h-40 lg:h-48 relative">
                <Image
                  src={IllustrationImage}
                  alt="Welcome illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon
                    weight="duotone"
                    className="w-6 h-6"
                    style={{ color: stat.color }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {stat.label}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${colors.state.success}20`,
                    color: colors.state.success,
                  }}
                >
                  {stat.change}
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Lessons */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Lessons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    <CalendarCheck
                      weight="duotone"
                      className="w-5 h-5 inline-block mr-2"
                      style={{ color: colors.primary.main }}
                    />
                    {t("tutorDashboard.dashboard.upcomingLessons")}
                  </h2>
                  <Button
                    variant="light"
                    size="sm"
                    endContent={<ArrowRight className="w-4 h-4" />}
                    style={{ color: colors.primary.main }}
                  >
                    {t("tutorDashboard.dashboard.viewAll")}
                  </Button>
                </div>

                <div className="space-y-3">
                  {upcomingLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={lesson.studentAvatar}
                          size="md"
                          className="flex-shrink-0"
                        />
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {lesson.title}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {lesson.student} • {lesson.date}, {lesson.time}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        radius="full"
                        style={{
                          backgroundColor: colors.primary.main,
                          color: colors.text.white,
                        }}
                        startContent={
                          <VideoCamera weight="fill" className="w-4 h-4" />
                        }
                      >
                        {t("tutorDashboard.dashboard.join")}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Recent Students */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    <Users
                      weight="duotone"
                      className="w-5 h-5 inline-block mr-2"
                      style={{ color: colors.primary.main }}
                    />
                    {t("tutorDashboard.dashboard.recentStudents")}
                  </h2>
                  <Button
                    variant="light"
                    size="sm"
                    endContent={<ArrowRight className="w-4 h-4" />}
                    style={{ color: colors.primary.main }}
                  >
                    {t("tutorDashboard.dashboard.viewAll")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-4">
                      <Avatar
                        src={student.avatar}
                        size="md"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {student.name}
                          </p>
                          <span
                            className="text-xs"
                            style={{ color: colors.text.tertiary }}
                          >
                            {student.lastLesson}
                          </span>
                        </div>
                        <p
                          className="text-sm mb-2"
                          style={{ color: colors.text.secondary }}
                        >
                          {student.course}
                        </p>
                        <Progress
                          value={student.progress}
                          size="sm"
                          classNames={{
                            indicator: "bg-primary",
                          }}
                          style={{
                            backgroundColor: colors.background.gray,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Reviews & Quick Stats */}
        <div className="space-y-6">
          {/* Rating Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  <Star
                    weight="duotone"
                    className="w-5 h-5 inline-block mr-2"
                    style={{ color: colors.state.warning }}
                  />
                  {t("tutorDashboard.dashboard.yourRating")}
                </h2>

                <div className="text-center mb-4">
                  <p
                    className="text-5xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    4.9
                  </p>
                  <div className="flex items-center justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        weight="fill"
                        className="w-5 h-5"
                        style={{ color: colors.state.warning }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("tutorDashboard.dashboard.basedOn")} 48{" "}
                    {t("tutorDashboard.dashboard.reviews")}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Recent Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorDashboard.dashboard.recentReviews")}
                </h2>

                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar src={review.avatar} size="sm" />
                        <div className="flex-1">
                          <p
                            className="font-medium text-sm"
                            style={{ color: colors.text.primary }}
                          >
                            {review.student}
                          </p>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                weight="fill"
                                className="w-3 h-3"
                                style={{ color: colors.state.warning }}
                              />
                            ))}
                          </div>
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: colors.text.tertiary }}
                        >
                          {review.date}
                        </span>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
