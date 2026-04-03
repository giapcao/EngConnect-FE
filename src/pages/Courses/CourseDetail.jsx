import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CourseDetailSkeleton from "../../components/CourseDetailSkeleton/CourseDetailSkeleton";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Check,
  VideoCamera,
  FileText,
  DeviceMobile,
  Certificate,
  Infinity,
  ChatsCircle,
  ArrowLeft,
  CaretDown,
  CaretUp,
  Play,
} from "@phosphor-icons/react";
import { coursesApi } from "../../api";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const formatDuration = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length !== 3) return timeStr;
  const h = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  if (h > 0 && m > 0) return `${h}h${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return timeStr;
};

const formatPrice = (price, currency) => {
  if (currency === "VND" || !currency) {
    return price?.toLocaleString("vi-VN") + "₫";
  }
  return "$" + price;
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getCourseById(id);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background.light }}
      >
        <Header />
        <CourseDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: colors.background.light }}
      >
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            {t("courses.detail.notFound")}
          </h2>
          <Button
            color="primary"
            variant="flat"
            startContent={<ArrowLeft size={18} />}
            onPress={() => navigate("/courses")}
          >
            {t("courses.detail.backToCourses")}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const duration = formatDuration(course.estimatedTimeLesson);
  const category = course.courseCategories?.[0]?.categoryName;
  const outcomes = course.outcomes
    ? course.outcomes
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const modules = (course.courseCourseModules || []).sort(
    (a, b) => a.moduleNumber - b.moduleNumber,
  );
  const totalSessions = modules.reduce(
    (sum, m) => sum + (m.courseModuleCourseSessions?.length || 0),
    0,
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.light }}
    >
      <Header />

      {/* Hero Banner */}
      <section
        className="relative pb-32 lg:pb-16 pt-10 px-6 md:px-12"
        style={{
          background:
            theme === "dark"
              ? colors.background.page
              : "linear-gradient(to bottom, #FFFFFF, #DBEAFE)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Chip
                  size="sm"
                  style={{
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(59, 130, 246, 0.1)",
                    color: theme === "dark" ? "#fff" : colors.primary.main,
                  }}
                >
                  {course.level}
                </Chip>
                {category && (
                  <Chip
                    size="sm"
                    style={{
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(59, 130, 246, 0.1)",
                      color: theme === "dark" ? "#fff" : colors.primary.main,
                    }}
                  >
                    {category}
                  </Chip>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
                style={{
                  color: theme === "dark" ? "#fff" : colors.text.primary,
                }}
              >
                {course.title}
              </h1>

              {/* Description */}
              <p
                className="text-base mb-6 max-w-2xl leading-relaxed"
                style={{
                  color:
                    theme === "dark"
                      ? "rgba(255,255,255,0.8)"
                      : colors.text.secondary,
                }}
              >
                {course.shortDescription}
              </p>

              {/* Rating + Stats */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        weight="fill"
                        style={{
                          color:
                            i < Math.floor(course.ratingAverage || 0)
                              ? "#F59E0B"
                              : theme === "dark"
                                ? "rgba(255,255,255,0.3)"
                                : "rgba(0,0,0,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="font-semibold text-sm"
                    style={{
                      color: theme === "dark" ? "#fff" : colors.text.primary,
                    }}
                  >
                    {course.ratingAverage || 0}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color:
                        theme === "dark"
                          ? "rgba(255,255,255,0.6)"
                          : colors.text.secondary,
                    }}
                  >
                    ({course.ratingCount?.toLocaleString() || 0}{" "}
                    {t("courses.detail.ratings")})
                  </span>
                </div>
                <span
                  className="text-sm flex items-center gap-1.5"
                  style={{
                    color:
                      theme === "dark"
                        ? "rgba(255,255,255,0.6)"
                        : colors.text.secondary,
                  }}
                >
                  <Users size={16} weight="duotone" />
                  {course.numberOfEnrollment?.toLocaleString() || 0}{" "}
                  {t("courses.detail.students")}
                </span>
              </div>
            </div>

            {/* Right: empty space for the sticky card to overlap */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section
        className="px-6 md:px-12 pb-10"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2 space-y-8 pt-10">
              {/* Course Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <Card
                  className="shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="text-center p-5">
                    <Star
                      size={28}
                      weight="fill"
                      style={{ color: "#F59E0B" }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {course.ratingAverage || 0}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {course.ratingCount || 0} {t("courses.detail.reviews")}
                    </p>
                  </CardBody>
                </Card>
                <Card
                  className="shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="text-center p-5">
                    <Users
                      size={28}
                      weight="duotone"
                      style={{ color: colors.primary.main }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {course.numberOfEnrollment?.toLocaleString() || 0}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.detail.students")}
                    </p>
                  </CardBody>
                </Card>
                <Card
                  className="shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="text-center p-5">
                    <BookOpen
                      size={28}
                      weight="duotone"
                      style={{ color: "#10B981" }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {course.numberOfSessions}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.lessons")}
                    </p>
                  </CardBody>
                </Card>
                <Card
                  className="shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="text-center p-5">
                    <Clock
                      size={28}
                      weight="duotone"
                      style={{ color: "#8B5CF6" }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {duration}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.detail.duration")}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>

              {/* About This Course */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card
                  className="shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="p-6">
                    <h2
                      className="font-semibold text-xl mb-4"
                      style={{ color: colors.text.primary }}
                    >
                      {t("courses.detail.aboutCourse")}
                    </h2>
                    <p
                      className="leading-relaxed"
                      style={{ color: colors.text.secondary }}
                    >
                      {course.fullDescription || course.shortDescription}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>

              {/* What You'll Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card
                  className="shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="p-6">
                    <h2
                      className="font-semibold text-xl mb-4"
                      style={{ color: colors.text.primary }}
                    >
                      {t("courses.detail.whatYouLearn")}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {outcomes.length > 0
                        ? outcomes.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{
                                  backgroundColor:
                                    colors.background.primaryLight,
                                }}
                              >
                                <Check
                                  size={14}
                                  weight="bold"
                                  style={{ color: colors.primary.main }}
                                />
                              </div>
                              <span style={{ color: colors.text.secondary }}>
                                {item}
                              </span>
                            </div>
                          ))
                        : [
                            t("courses.detail.learn1"),
                            t("courses.detail.learn2"),
                            t("courses.detail.learn3"),
                            t("courses.detail.learn4"),
                          ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{
                                  backgroundColor:
                                    colors.background.primaryLight,
                                }}
                              >
                                <Check
                                  size={14}
                                  weight="bold"
                                  style={{ color: colors.primary.main }}
                                />
                              </div>
                              <span style={{ color: colors.text.secondary }}>
                                {item}
                              </span>
                            </div>
                          ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Course Curriculum */}
              {modules.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <Card
                    className="shadow-none"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h2
                          className="font-semibold text-xl"
                          style={{ color: colors.text.primary }}
                        >
                          {t("courses.detail.courseCurriculum")}
                        </h2>
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {modules.length} {t("courses.detail.modules")} ·{" "}
                          {totalSessions} {t("courses.detail.sessions")}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {modules.map((mod) => {
                          const isExpanded = expandedModules[mod.id];
                          const sessions = (
                            mod.courseModuleCourseSessions || []
                          ).sort((a, b) => a.sessionNumber - b.sessionNumber);
                          return (
                            <div
                              key={mod.id}
                              className="rounded-xl overflow-hidden border"
                              style={{ borderColor: colors.border.light }}
                            >
                              <button
                                type="button"
                                className="w-full flex items-center justify-between p-4 text-left"
                                style={{
                                  backgroundColor: colors.background.light,
                                }}
                                onClick={() => toggleModule(mod.id)}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{
                                      backgroundColor: colors.primary.main,
                                      color: "#fff",
                                    }}
                                  >
                                    <span className="text-sm font-bold">
                                      {mod.moduleNumber}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="font-semibold text-sm truncate"
                                      style={{ color: colors.text.primary }}
                                    >
                                      {mod.moduleTitle}
                                    </p>
                                    <p
                                      className="text-xs mt-0.5"
                                      style={{ color: colors.text.tertiary }}
                                    >
                                      {sessions.length}{" "}
                                      {t("courses.detail.sessions")}
                                    </p>
                                  </div>
                                </div>
                                {isExpanded ? (
                                  <CaretUp
                                    size={18}
                                    weight="bold"
                                    style={{ color: colors.text.secondary }}
                                  />
                                ) : (
                                  <CaretDown
                                    size={18}
                                    weight="bold"
                                    style={{ color: colors.text.secondary }}
                                  />
                                )}
                              </button>
                              {isExpanded && (
                                <div
                                  className="px-4 pb-4 pt-2"
                                  style={{
                                    backgroundColor: colors.background.light,
                                  }}
                                >
                                  {mod.moduleDescription && (
                                    <p
                                      className="text-sm mb-3 leading-relaxed"
                                      style={{ color: colors.text.secondary }}
                                    >
                                      {mod.moduleDescription}
                                    </p>
                                  )}
                                  {sessions.length === 0 ? (
                                    <p
                                      className="text-xs text-center py-3"
                                      style={{ color: colors.text.tertiary }}
                                    >
                                      {t("courses.detail.noSessions")}
                                    </p>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {sessions.map((sess) => (
                                        <div
                                          key={sess.id}
                                          className="rounded-lg p-3"
                                          style={{
                                            backgroundColor:
                                              colors.background.gray,
                                          }}
                                        >
                                          <div className="flex items-start gap-3">
                                            <div
                                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                              style={{
                                                backgroundColor:
                                                  colors.background
                                                    .primaryLight,
                                              }}
                                            >
                                              <Play
                                                size={12}
                                                weight="fill"
                                                style={{
                                                  color: colors.primary.main,
                                                }}
                                              />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p
                                                className="font-medium text-sm"
                                                style={{
                                                  color: colors.text.primary,
                                                }}
                                              >
                                                {sess.sessionNumber}.{" "}
                                                {sess.sessionTitle}
                                              </p>
                                              {sess.sessionDescription && (
                                                <p
                                                  className="text-xs mt-1 leading-relaxed"
                                                  style={{
                                                    color:
                                                      colors.text.secondary,
                                                  }}
                                                >
                                                  {sess.sessionDescription}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              )}

              {/* Course Includes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card
                  className="shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <CardBody className="p-6">
                    <h2
                      className="font-semibold text-xl mb-4"
                      style={{ color: colors.text.primary }}
                    >
                      {t("courses.detail.courseIncludes")}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <VideoCamera
                          size={22}
                          style={{ color: colors.primary.main }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {duration} {t("courses.detail.onDemandVideo")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText
                          size={22}
                          style={{ color: colors.primary.main }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {t("courses.detail.downloadableResources")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DeviceMobile
                          size={22}
                          style={{ color: colors.primary.main }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {t("courses.detail.mobileAccess")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Certificate
                          size={22}
                          style={{ color: colors.primary.main }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {t("courses.detail.certificateCompletion")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Infinity
                          size={22}
                          style={{ color: colors.primary.main }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {t("courses.detail.lifetimeAccess")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ChatsCircle
                          size={22}
                          style={{ color: colors.primary.main }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {t("courses.detail.communityAccess")}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Sticky Price Card (overlaps banner) */}
            <div className="lg:col-span-1 lg:-mt-56">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:sticky lg:top-24"
              >
                <Card
                  className="shadow-lg overflow-hidden"
                  style={{
                    background:
                      theme === "dark"
                        ? colors.background.gray
                        : colors.background.card,
                  }}
                >
                  {/* Course image preview */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={
                        course.thumbnailUrl ||
                        "https://placehold.co/400x200?text=No+Image"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardBody className="p-6 space-y-5">
                    {/* Price */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-4xl font-bold"
                          style={{ color: colors.primary.main }}
                        >
                          {formatPrice(course.price, course.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <Button
                      color="primary"
                      size="lg"
                      className="w-full font-semibold text-base"
                      onPress={() => navigate("/register")}
                    >
                      {t("courses.detail.enrollNow")}
                    </Button>

                    <p
                      className="text-xs text-center"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.detail.moneyBackGuarantee")}
                    </p>

                    <Divider />

                    {/* Quick Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className="flex items-center gap-2"
                          style={{ color: colors.text.secondary }}
                        >
                          <Clock size={16} weight="duotone" />
                          {t("courses.detail.duration")}
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className="flex items-center gap-2"
                          style={{ color: colors.text.secondary }}
                        >
                          <BookOpen size={16} weight="duotone" />
                          {t("courses.detail.level")}
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {course.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className="flex items-center gap-2"
                          style={{ color: colors.text.secondary }}
                        >
                          <Users size={16} weight="duotone" />
                          {t("courses.detail.studentsEnrolled")}
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {course.numberOfEnrollment?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className="flex items-center gap-2"
                          style={{ color: colors.text.secondary }}
                        >
                          <BookOpen size={16} weight="duotone" />
                          {t("courses.lessons")}
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {course.numberOfSessions}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;
