import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, Button, Avatar, Progress, Image } from "@heroui/react";
import UpcomingLessonsSkeleton from "../../../components/UpcomingLessonsSkeleton/UpcomingLessonsSkeleton";
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
import calendarIllustration from "../../../assets/illustrations/calendar.avif";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../../api";

const CDN_BASE = "https://d20854st1o56hw.cloudfront.net/";
const withCDN = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return CDN_BASE + url;
};

const Dashboard = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  const fetchUpcomingLessons = useCallback(async () => {
    if (!user?.studentId) return;
    try {
      setLessonsLoading(true);
      const res = await studentApi.getLessons({
        StudentId: user.studentId,
        Status: "Scheduled",
        "page-size": 5,
        "sort-params": "StartTime",
      });
      setUpcomingLessons(res?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch upcoming lessons:", err);
    } finally {
      setLessonsLoading(false);
    }
  }, [user?.studentId]);

  useEffect(() => {
    fetchUpcomingLessons();
  }, [fetchUpcomingLessons]);

  const formatLessonTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatLessonDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === now.toDateString())
      return t("studentDashboard.dashboard.today");
    if (d.toDateString() === tomorrow.toDateString())
      return t("studentDashboard.dashboard.tomorrow");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

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
                  {lessonsLoading ? (
                    <UpcomingLessonsSkeleton />
                  ) : upcomingLessons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <img
                        src={calendarIllustration}
                        alt="No lessons"
                        draggable={false}
                        className="w-48 h-38 object-contain"
                      />
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("studentDashboard.dashboard.noUpcomingLessons")}
                      </p>
                    </div>
                  ) : (
                    upcomingLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar
                            src={withCDN(lesson.tutorAvatar)}
                            name={[lesson.tutorFirstName, lesson.tutorLastName]
                              .filter(Boolean)
                              .join(" ")}
                            size="md"
                            className="flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p
                              className="font-medium truncate"
                              style={{ color: colors.text.primary }}
                            >
                              {lesson.courseTitle || lesson.sessionTitle}
                            </p>
                            <p
                              className="text-sm truncate"
                              style={{ color: colors.text.secondary }}
                            >
                              {[lesson.tutorFirstName, lesson.tutorLastName]
                                .filter(Boolean)
                                .join(" ")}{" "}
                              • {formatLessonDate(lesson.startTime)},{" "}
                              {formatLessonTime(lesson.startTime)}
                            </p>
                          </div>
                        </div>
                        {lesson.meetingStatus === "Waiting" && (
                          <Button
                            isIconOnly
                            radius="full"
                            style={{
                              backgroundColor: colors.primary.main,
                              color: colors.text.white,
                            }}
                            onPress={() => navigate(`/meeting/${lesson.id}`)}
                          >
                            <Play weight="fill" className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
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
