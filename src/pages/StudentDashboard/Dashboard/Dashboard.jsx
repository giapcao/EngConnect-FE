import { Card, CardBody, Button, Avatar, Progress, Image } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Trophy,
  CalendarCheck,
  Play,
  ArrowRight,
  Fire,
  Target,
  TrendUp,
  Star,
} from "@phosphor-icons/react";
import IllustrationImage from "../../../assets/illustrations/morning.avif";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const stats = [
    {
      icon: BookOpen,
      label: t("studentDashboard.dashboard.stats.coursesEnrolled"),
      value: "5",
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: Clock,
      label: t("studentDashboard.dashboard.stats.hoursLearned"),
      value: "48",
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: Trophy,
      label: t("studentDashboard.dashboard.stats.certificatesEarned"),
      value: "2",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: Fire,
      label: t("studentDashboard.dashboard.stats.streak"),
      value: "7",
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: "Business English - Meeting Skills",
      tutor: "Sarah Johnson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
      time: "10:00 AM",
      date: "Today",
      duration: "45 min",
    },
    {
      id: 2,
      title: "IELTS Writing Task 2",
      tutor: "Michael Chen",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor2",
      time: "2:00 PM",
      date: "Today",
      duration: "60 min",
    },
    {
      id: 3,
      title: "Conversational English",
      tutor: "Emma Wilson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor3",
      time: "9:00 AM",
      date: "Tomorrow",
      duration: "30 min",
    },
  ];

  const coursesInProgress = [
    {
      id: 1,
      title: "Business English Masterclass",
      progress: 65,
      lessonsCompleted: 13,
      totalLessons: 20,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300",
    },
    {
      id: 2,
      title: "IELTS Preparation Course",
      progress: 40,
      lessonsCompleted: 8,
      totalLessons: 20,
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300",
    },
    {
      id: 3,
      title: "English for Beginners",
      progress: 90,
      lessonsCompleted: 18,
      totalLessons: 20,
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300",
    },
  ];

  const recentAchievements = [
    {
      id: 1,
      title: "First Lesson",
      description: "Completed your first lesson",
      icon: Star,
      date: "2 days ago",
    },
    {
      id: 2,
      title: "7 Day Streak",
      description: "Learned for 7 days in a row",
      icon: Fire,
      date: "Today",
    },
    {
      id: 3,
      title: "Quiz Master",
      description: "Scored 100% on a quiz",
      icon: Target,
      date: "Yesterday",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card
          shadow="none"
          className="border-none overflow-hidden"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="p-6 md:p-8 flex-1">
                <h1
                  className="text-2xl lg:text-3xl font-bold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("studentDashboard.dashboard.welcome")}, {user?.firstName}!
                  👋
                </h1>
                <p className="mb-4" style={{ color: colors.text.secondary }}>
                  {t("studentDashboard.dashboard.welcomeSubtitle")}
                </p>
                <Button
                  color="primary"
                  endContent={<Play weight="fill" className="w-4 h-4" />}
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => navigate("/student/schedule")}
                >
                  {t("studentDashboard.dashboard.continueLearn")}
                </Button>
              </div>
              <div className="hidden md:block w-48 lg:w-64 h-40 lg:h-48 relative">
                <Image
                  src={IllustrationImage}
                  alt="Welcome illustration"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
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
                <div>
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
              </div>
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Lessons & Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Lessons */}
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
                    {t("studentDashboard.dashboard.upcomingLessons")}
                  </h2>
                  <Button
                    variant="light"
                    size="sm"
                    endContent={<ArrowRight className="w-4 h-4" />}
                    style={{ color: colors.primary.main }}
                  >
                    {t("studentDashboard.dashboard.viewAll")}
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
                          src={lesson.tutorAvatar}
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
                            {lesson.tutor} • {lesson.date}, {lesson.time}
                          </p>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        radius="full"
                        style={{
                          backgroundColor: colors.primary.main,
                          color: colors.text.white,
                        }}
                      >
                        <Play weight="fill" className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Courses In Progress */}
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
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    <TrendUp
                      weight="duotone"
                      className="w-5 h-5 inline-block mr-2"
                      style={{ color: colors.state.success }}
                    />
                    {t("studentDashboard.dashboard.coursesInProgress")}
                  </h2>
                  <Button
                    variant="light"
                    size="sm"
                    endContent={<ArrowRight className="w-4 h-4" />}
                    style={{ color: colors.primary.main }}
                  >
                    {t("studentDashboard.dashboard.viewAll")}
                  </Button>
                </div>

                <div className="space-y-4">
                  {coursesInProgress.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium truncate"
                          style={{ color: colors.text.primary }}
                        >
                          {course.title}
                        </p>
                        <p
                          className="text-sm mb-2"
                          style={{ color: colors.text.secondary }}
                        >
                          {course.lessonsCompleted}/{course.totalLessons}{" "}
                          {t("studentDashboard.dashboard.lessonsCompleted")}
                        </p>
                        <Progress
                          value={course.progress}
                          size="sm"
                          color="primary"
                          className="max-w-full"
                        />
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primary.main }}
                      >
                        {course.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Achievements & Quick Actions */}
        <div className="space-y-6">
          {/* Weekly Goal */}
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
              <CardBody className="p-6">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  <Target
                    weight="duotone"
                    className="w-5 h-5 inline-block mr-2"
                    style={{ color: colors.state.warning }}
                  />
                  {t("studentDashboard.dashboard.weeklyGoal")}
                </h2>

                <div className="text-center mb-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={colors.background.gray}
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={colors.primary.main}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(5 / 7) * 352} 352`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className="text-3xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        5/7
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("studentDashboard.dashboard.daysCompleted")}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  className="text-center text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {t("studentDashboard.dashboard.keepItUp")}
                </p>
              </CardBody>
            </Card>
          </motion.div>

          {/* Recent Achievements */}
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
              <CardBody className="p-6">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  <Trophy
                    weight="duotone"
                    className="w-5 h-5 inline-block mr-2"
                    style={{ color: colors.state.warning }}
                  />
                  {t("studentDashboard.dashboard.recentAchievements")}
                </h2>

                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${colors.state.warning}20`,
                        }}
                      >
                        <achievement.icon
                          weight="duotone"
                          className="w-5 h-5"
                          style={{ color: colors.state.warning }}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className="font-medium text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {achievement.title}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.text.secondary }}
                        >
                          {achievement.date}
                        </p>
                      </div>
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
