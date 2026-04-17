import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Avatar,
  Divider,
  Spinner,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTheme } from "../../../contexts/ThemeContext";
import CourseDetailSkeleton from "../../../components/CourseDetailSkeleton/CourseDetailSkeleton";
import VideoModal from "../../../components/VideoModal/VideoModal";
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Check,
  ArrowLeft,
  CaretDown,
  CaretUp,
  Play,
  Certificate,
  FileText,
  FilePdf,
  VideoCamera,
  Link as LinkIcon,
  ArrowSquareOut,
  CalendarDots,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { coursesApi, tutorApi, studentApi } from "../../../api";

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

const getResourceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "pdf":
      return <FilePdf size={14} weight="fill" style={{ color: "#EF4444" }} />;
    case "video":
      return (
        <VideoCamera size={14} weight="fill" style={{ color: "#8B5CF6" }} />
      );
    case "link":
      return <LinkIcon size={14} weight="fill" style={{ color: "#3B82F6" }} />;
    default:
      return <FileText size={14} weight="fill" style={{ color: "#6B7280" }} />;
  }
};

const StudentMyCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const colors = useThemeColors();
  const { theme } = useTheme();
  const user = useSelector(selectUser);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [tutorInfo, setTutorInfo] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const instructorRef = useRef(null);

  // Resources state
  const [expandedSessions, setExpandedSessions] = useState({});
  const [sessionResources, setSessionResources] = useState({});
  const [loadingResources, setLoadingResources] = useState({});

  // Lessons state
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const toggleSessionResources = useCallback(
    async (sessionId) => {
      setExpandedSessions((prev) => ({
        ...prev,
        [sessionId]: !prev[sessionId],
      }));
      if (!sessionResources[sessionId] && !loadingResources[sessionId]) {
        try {
          setLoadingResources((prev) => ({ ...prev, [sessionId]: true }));
          const res = await coursesApi.getAllCourseResources({
            CourseSessionId: sessionId,
            "page-size": 100,
          });
          setSessionResources((prev) => ({
            ...prev,
            [sessionId]: res?.data?.items || [],
          }));
        } catch (err) {
          console.error("Failed to fetch resources:", err);
        } finally {
          setLoadingResources((prev) => ({ ...prev, [sessionId]: false }));
        }
      }
    },
    [sessionResources, loadingResources],
  );

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.getCourseById(id);
        setCourse(res.data);
        if (res.data?.tutorId) {
          try {
            const tutorRes = await tutorApi.getTutorById(res.data.tutorId);
            setTutorInfo(tutorRes.data);
          } catch (tutorErr) {
            console.error("Failed to fetch tutor:", tutorErr);
          }
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user?.studentId || !id) return;
      try {
        setLessonsLoading(true);
        const res = await studentApi.getLessons({
          StudentId: user.studentId,
          CourseId: id,
          "page-size": 200,
        });
        setLessons(res?.data?.items || []);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLessonsLoading(false);
      }
    };
    fetchLessons();
  }, [user?.studentId, id]);

  const formatLessonTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLessonDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(dateLocale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getLessonStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return colors.primary.main;
      case "Completed":
        return colors.state.success;
      case "Cancelled":
        return colors.state.error;
      case "InProgress":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const getLessonStatusLabel = (status) => {
    switch (status) {
      case "Scheduled":
        return t("studentDashboard.schedule.scheduled");
      case "Completed":
        return t("studentDashboard.schedule.completed");
      case "Cancelled":
        return t("studentDashboard.schedule.cancelled");
      case "InProgress":
        return t("studentDashboard.schedule.inProgress");
      default:
        return status || "";
    }
  };

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
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
          onPress={() => navigate("/student/my-courses")}
        >
          {t("studentDashboard.myCourses.backToMyCourses")}
        </Button>
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

  const upcomingLessons = lessons
    .filter(
      (l) => new Date(l.startTime) >= new Date() && l.status !== "Cancelled",
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const pastLessons = lessons
    .filter(
      (l) => new Date(l.startTime) < new Date() || l.status === "Completed",
    )
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Button
          variant="light"
          startContent={<ArrowLeft size={18} />}
          onPress={() => navigate("/student/my-courses")}
          style={{ color: colors.text.secondary }}
        >
          {t("studentDashboard.myCourses.backToMyCourses")}
        </Button>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card
          shadow="none"
          className="border-none overflow-hidden"
          style={{
            background: theme === "dark" ? colors.background.light : "#DBEAFE",
          }}
        >
          <CardBody className="p-6 md:p-8 lg:pb-16">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Chip
                    size="sm"
                    style={{
                      backgroundColor: colors.background.primaryLight,
                      color: colors.primary.main,
                    }}
                  >
                    {course.level}
                  </Chip>
                  {category && (
                    <Chip
                      size="sm"
                      style={{
                        backgroundColor: colors.background.primaryLight,
                        color: colors.primary.main,
                      }}
                    >
                      {category}
                    </Chip>
                  )}
                </div>

                <h1
                  className="text-2xl lg:text-3xl font-bold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  {course.title}
                </h1>

                <p
                  className="text-base mb-5 leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  {course.shortDescription}
                </p>

                {/* Stats */}
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
                                : "rgba(0,0,0,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: colors.text.primary }}
                    >
                      {course.ratingAverage || 0}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      ({course.ratingCount?.toLocaleString() || 0}{" "}
                      {t("courses.detail.ratings")})
                    </span>
                  </div>
                  <span
                    className="text-sm flex items-center gap-1.5"
                    style={{ color: colors.text.secondary }}
                  >
                    <Users size={16} weight="duotone" />
                    {course.numberOfEnrollment?.toLocaleString() || 0}{" "}
                    {t("courses.detail.students")}
                  </span>
                </div>

                {/* Instructor name */}
                {tutorInfo && (
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.detail.instructor")}:
                    </span>
                    <button
                      type="button"
                      className="text-sm font-medium hover:underline"
                      style={{ color: colors.primary.main }}
                      onClick={() =>
                        instructorRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    >
                      {tutorInfo.user?.firstName} {tutorInfo.user?.lastName}
                    </button>
                  </div>
                )}
              </div>

              {/* Empty space for sticky card overlap */}
              <div className="hidden lg:block" />
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About This Course */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
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
                              backgroundColor: colors.background.primaryLight,
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
                              backgroundColor: colors.background.primaryLight,
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

          {/* Course Curriculum with Resources */}
          {modules.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Card
                className="shadow-none"
                style={{ backgroundColor: colors.background.light }}
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
                    {modules.map((mod, idx) => {
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
                              backgroundColor: colors.background.gray,
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
                                  {idx + 1}
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
                                  {sessions.map((sess) => {
                                    const sessId = sess.courseSessionId;
                                    const isResExpanded =
                                      expandedSessions[sessId];
                                    const resources =
                                      sessionResources[sessId] || [];
                                    const isResLoading =
                                      loadingResources[sessId];
                                    return (
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
                                                colors.background.primaryLight,
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
                                                  color: colors.text.secondary,
                                                }}
                                              >
                                                {sess.sessionDescription}
                                              </p>
                                            )}
                                            {sess.sessionOutcomes && (
                                              <div className="mt-1.5">
                                                <p
                                                  className="text-xs font-medium mb-1"
                                                  style={{
                                                    color: colors.text.primary,
                                                  }}
                                                ></p>
                                                <div className="flex flex-col gap-0.5">
                                                  {sess.sessionOutcomes
                                                    .split(";")
                                                    .filter((o) => o.trim())
                                                    .map((outcome, i) => (
                                                      <div
                                                        key={i}
                                                        className="flex items-start gap-1"
                                                      >
                                                        <ArrowRightIcon
                                                          size={10}
                                                          weight="fill"
                                                          className="flex-shrink-0 mt-0.5"
                                                          style={{
                                                            color:
                                                              colors.state
                                                                .success,
                                                          }}
                                                        />
                                                        <span
                                                          className="text-xs"
                                                          style={{
                                                            color:
                                                              colors.text
                                                                .secondary,
                                                          }}
                                                        >
                                                          {outcome.trim()}
                                                        </span>
                                                      </div>
                                                    ))}
                                                </div>
                                              </div>
                                            )}
                                            {/* Resources toggle */}
                                            {sessId && (
                                              <div className="mt-2">
                                                <button
                                                  type="button"
                                                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
                                                  style={{
                                                    color: colors.primary.main,
                                                    backgroundColor:
                                                      colors.background
                                                        .primaryLight,
                                                  }}
                                                  onClick={() =>
                                                    toggleSessionResources(
                                                      sessId,
                                                    )
                                                  }
                                                >
                                                  <FileText
                                                    size={13}
                                                    weight="fill"
                                                  />
                                                  {t(
                                                    "courses.detail.resources.label",
                                                  )}
                                                  {isResExpanded ? (
                                                    <CaretUp
                                                      size={11}
                                                      weight="bold"
                                                    />
                                                  ) : (
                                                    <CaretDown
                                                      size={11}
                                                      weight="bold"
                                                    />
                                                  )}
                                                </button>

                                                {isResExpanded && (
                                                  <div className="mt-2 space-y-1.5">
                                                    {isResLoading ? (
                                                      <div className="flex items-center gap-2 py-1">
                                                        <Spinner size="sm" />
                                                        <span
                                                          className="text-xs"
                                                          style={{
                                                            color:
                                                              colors.text
                                                                .tertiary,
                                                          }}
                                                        >
                                                          {t(
                                                            "courses.detail.resources.loading",
                                                          )}
                                                        </span>
                                                      </div>
                                                    ) : resources.length ===
                                                      0 ? (
                                                      <p
                                                        className="text-xs py-1"
                                                        style={{
                                                          color:
                                                            colors.text
                                                              .tertiary,
                                                        }}
                                                      >
                                                        {t(
                                                          "courses.detail.resources.empty",
                                                        )}
                                                      </p>
                                                    ) : (
                                                      resources.map((res) => (
                                                        <div
                                                          key={res.id}
                                                          className="flex items-center gap-2 px-2 py-1.5 rounded-md"
                                                          style={{
                                                            backgroundColor:
                                                              colors.background
                                                                .light,
                                                          }}
                                                        >
                                                          <span className="flex-shrink-0">
                                                            {getResourceIcon(
                                                              res.resourceType,
                                                            )}
                                                          </span>
                                                          <span
                                                            className="flex-1 text-xs font-medium truncate"
                                                            style={{
                                                              color:
                                                                colors.text
                                                                  .primary,
                                                            }}
                                                          >
                                                            {res.title}
                                                          </span>
                                                          <Chip
                                                            size="sm"
                                                            variant="flat"
                                                            className="text-xs h-5 px-1"
                                                            style={{
                                                              fontSize: "10px",
                                                            }}
                                                          >
                                                            {res.resourceType}
                                                          </Chip>
                                                          <a
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title={t(
                                                              "courses.detail.resources.open",
                                                            )}
                                                          >
                                                            <ArrowSquareOut
                                                              size={14}
                                                              style={{
                                                                color:
                                                                  colors.primary
                                                                    .main,
                                                              }}
                                                            />
                                                          </a>
                                                        </div>
                                                      ))
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
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

          {/* Lesson Schedule */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <h2
                  className="font-semibold text-xl mb-4 flex items-center gap-2"
                  style={{ color: colors.text.primary }}
                >
                  <CalendarDots
                    weight="duotone"
                    className="w-5 h-5"
                    style={{ color: colors.primary.main }}
                  />
                  {t("studentDashboard.myCourses.lessonSchedule")}
                </h2>

                {lessonsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : lessons.length === 0 ? (
                  <p
                    className="text-sm text-center py-6"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("studentDashboard.myCourses.noLessonsYet")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Upcoming */}
                    {upcomingLessons.length > 0 && (
                      <div>
                        <h3
                          className="text-sm font-semibold mb-2 flex items-center gap-2"
                          style={{ color: colors.primary.main }}
                        >
                          <Clock weight="duotone" className="w-4 h-4" />
                          {t("studentDashboard.schedule.upcomingLessons")} (
                          {upcomingLessons.length})
                        </h3>
                        <div className="space-y-2">
                          {upcomingLessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 rounded-lg"
                              style={{
                                backgroundColor: colors.background.gray,
                              }}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className="w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      colors.background.primaryLight,
                                  }}
                                >
                                  <span
                                    className="text-sm font-bold"
                                    style={{ color: colors.primary.main }}
                                  >
                                    {new Date(lesson.startTime).getDate()}
                                  </span>
                                  <span
                                    className="text-sm"
                                    style={{
                                      color: colors.primary.main,
                                      fontSize: "10px",
                                    }}
                                  >
                                    {new Date(
                                      lesson.startTime,
                                    ).toLocaleDateString(dateLocale, {
                                      month: "short",
                                    })}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="font-medium text-sm truncate"
                                    style={{ color: colors.text.primary }}
                                  >
                                    {lesson.sessionTitle ||
                                      t("studentDashboard.schedule.lesson")}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span
                                      className="text-xs"
                                      style={{ color: colors.text.tertiary }}
                                    >
                                      {formatLessonTime(lesson.startTime)} —{" "}
                                      {formatLessonTime(lesson.endTime)}
                                    </span>
                                    <Chip
                                      size="sm"
                                      className="h-4"
                                      style={{
                                        backgroundColor: `${getLessonStatusColor(lesson.status)}20`,
                                        color: getLessonStatusColor(
                                          lesson.status,
                                        ),
                                        fontSize: "10px",
                                      }}
                                    >
                                      {getLessonStatusLabel(lesson.status)}
                                    </Chip>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                style={{
                                  backgroundColor: colors.primary.main,
                                  color: colors.text.white,
                                }}
                                startContent={
                                  <VideoCamera
                                    weight="fill"
                                    className="w-3.5 h-3.5"
                                  />
                                }
                                onPress={() =>
                                  navigate(`/meeting/${lesson.id}`)
                                }
                              >
                                {t("studentDashboard.schedule.joinNow")}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Past Lessons */}
                    {pastLessons.length > 0 && (
                      <div>
                        <h3
                          className="text-sm font-semibold mb-2 flex items-center gap-2"
                          style={{ color: colors.text.tertiary }}
                        >
                          {t("studentDashboard.myCourses.pastLessons")} (
                          {pastLessons.length})
                        </h3>
                        <div className="space-y-2">
                          {pastLessons.slice(0, 5).map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 rounded-lg"
                              style={{
                                backgroundColor: colors.background.gray,
                                opacity: 0.7,
                              }}
                            >
                              <div
                                className="w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: colors.background.gray,
                                }}
                              >
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: colors.text.secondary }}
                                >
                                  {new Date(lesson.startTime).getDate()}
                                </span>
                                <span
                                  className="text-xs"
                                  style={{
                                    color: colors.text.tertiary,
                                    fontSize: "9px",
                                  }}
                                >
                                  {new Date(
                                    lesson.startTime,
                                  ).toLocaleDateString(dateLocale, {
                                    month: "short",
                                  })}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className="font-medium text-sm truncate"
                                  style={{ color: colors.text.primary }}
                                >
                                  {lesson.sessionTitle ||
                                    t("studentDashboard.schedule.lesson")}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span
                                    className="text-xs"
                                    style={{ color: colors.text.tertiary }}
                                  >
                                    {formatLessonDate(lesson.startTime)}
                                  </span>
                                  <Chip
                                    size="sm"
                                    className="h-4"
                                    style={{
                                      backgroundColor: `${getLessonStatusColor(lesson.status)}20`,
                                      color: getLessonStatusColor(
                                        lesson.status,
                                      ),
                                      fontSize: "10px",
                                    }}
                                  >
                                    {getLessonStatusLabel(lesson.status)}
                                  </Chip>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* About the Instructor */}
          {tutorInfo && (
            <motion.div
              ref={instructorRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Card
                className="shadow-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-6">
                  <h2
                    className="font-semibold text-xl mb-4"
                    style={{ color: colors.text.primary }}
                  >
                    {t("courses.detail.aboutInstructor")}
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      src={tutorInfo.avatar}
                      name={`${tutorInfo.user?.firstName} ${tutorInfo.user?.lastName}`}
                      size="lg"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-lg"
                        style={{ color: colors.text.primary }}
                      >
                        {tutorInfo.user?.firstName} {tutorInfo.user?.lastName}
                      </p>
                      {tutorInfo.headline && (
                        <p
                          className="text-sm mt-0.5"
                          style={{ color: colors.text.secondary }}
                        >
                          {tutorInfo.headline}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star
                        size={18}
                        weight="fill"
                        style={{ color: "#f59e0b" }}
                      />
                      <span
                        className="font-semibold text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {tutorInfo.ratingAverage?.toFixed(1) || "0.0"}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: colors.text.tertiary }}
                      >
                        ({tutorInfo.ratingCount || 0}{" "}
                        {t("courses.detail.reviews")})
                      </span>
                    </div>
                    {tutorInfo.monthExperience > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock
                          size={18}
                          style={{ color: colors.primary.main }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {tutorInfo.monthExperience}{" "}
                          {t("courses.detail.monthsExperience")}
                        </span>
                      </div>
                    )}
                  </div>
                  {tutorInfo.bio && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: colors.text.secondary }}
                    >
                      {tutorInfo.bio}
                    </p>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column — Course Info Card */}
        <div className="lg:col-span-1 lg:-mt-64">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="lg:sticky lg:top-40"
          >
            <Card
              className="shadow-lg overflow-hidden"
              style={{ backgroundColor: colors.background.light }}
            >
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={
                    course.thumbnailUrl ||
                    "https://placehold.co/400x200?text=No+Image"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.demoVideoUrl && (
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play
                        size={24}
                        weight="fill"
                        style={{ color: colors.primary.main }}
                      />
                    </div>
                  </button>
                )}
              </div>

              <CardBody className="p-6 space-y-5">
                {/* Enrollment status */}
                <Chip
                  size="lg"
                  className="w-full flex justify-center font-semibold"
                  style={{
                    backgroundColor: `${colors.state.success}20`,
                    color: colors.state.success,
                  }}
                >
                  {t("studentDashboard.myCourses.enrolled")}
                </Chip>

                <Divider />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <Clock size={16} weight="duotone" />
                      {t("courses.detail.totalDuration")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {formatDuration(course.estimatedTime) || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <Clock size={16} weight="duotone" />
                      {t("courses.detail.timePerLesson")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {duration || "—"}
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
                  {course.numsSessionInWeek > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className="flex items-center gap-2"
                        style={{ color: colors.text.secondary }}
                      >
                        <Clock size={16} weight="duotone" />
                        {t("courses.detail.sessionsPerWeek")}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {course.numsSessionInWeek}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <CalendarDots size={16} weight="duotone" />
                      {t("studentDashboard.myCourses.totalLessons")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {lessons.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <Certificate size={16} weight="duotone" />
                      {t("courses.detail.certificate")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {course.isCertificate
                        ? t("courses.detail.yes")
                        : t("courses.detail.no")}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      <VideoModal
        isOpen={videoOpen}
        onOpenChange={setVideoOpen}
        videoUrl={course?.demoVideoUrl}
      />
    </div>
  );
};

export default StudentMyCourseDetail;
