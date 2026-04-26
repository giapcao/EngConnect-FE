import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Avatar,
  Chip,
  Progress,
  Skeleton,
  Button,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useThemeColors } from "../../../hooks/useThemeColors";
import {
  ArrowLeft,
  EnvelopeSimple,
  BookOpen,
  CalendarDots,
  TrendUp,
  CaretDown,
  CaretUp,
  CheckCircle,
  Circle,
  Lightning,
  Clock,
  XCircle,
  ArrowSquareOut,
  NotePencil,
  VideoCamera,
  Play,
  FileText,
} from "@phosphor-icons/react";
import { studentApi, coursesApi } from "../../../api";
import LessonDetailModal from "../../../components/LessonDetailModal/LessonDetailModal";
import VideoModal from "../../../components/VideoModal/VideoModal";
import LessonSummaryModal from "../../../components/LessonSummaryModal/LessonSummaryModal";

const CDN_BASE = "https://d20854st1o56hw.cloudfront.net/";
const withCDN = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return CDN_BASE + url;
};

const buildModulesFromLessons = (lessons, moduleInfoMap) => {
  if (!lessons?.length) return [];
  const moduleOrder = [];
  const moduleSessionsMap = {};
  lessons.forEach((lesson) => {
    const { moduleId, sessionId } = lesson;
    if (!moduleId || !sessionId) return;
    if (!moduleSessionsMap[moduleId]) {
      moduleOrder.push(moduleId);
      moduleSessionsMap[moduleId] = { sessionOrder: [], sessionLessonsMap: {} };
    }
    const mod = moduleSessionsMap[moduleId];
    if (!mod.sessionLessonsMap[sessionId]) {
      mod.sessionOrder.push(sessionId);
      mod.sessionLessonsMap[sessionId] = [];
    }
    mod.sessionLessonsMap[sessionId].push(lesson);
  });
  return moduleOrder.map((moduleId) => {
    const info = moduleInfoMap?.[moduleId] || null;
    const modData = moduleSessionsMap[moduleId];
    return {
      moduleId,
      title: info?.title || "",
      sessions: modData.sessionOrder.map((sessionId, sessIdx) => {
        const lessonList = modData.sessionLessonsMap[sessionId];
        const sessionInfo =
          info?.courseSessions?.find((s) => s.courseSessionId === sessionId) || null;
        return {
          sessionId,
          sessionTitle:
            sessionInfo?.sessionTitle || lessonList[0]?.sessionTitle || "",
          sessionNumber: sessionInfo?.sessionNumber ?? sessIdx + 1,
          lessons: lessonList,
        };
      }),
    };
  });
};

const getPrimaryLesson = (lessons) => {
  if (!lessons?.length) return null;
  const completed = lessons.filter((l) => l.status === "Completed");
  if (completed.length > 0) return completed[completed.length - 1];
  const live = lessons.find(
    (l) =>
      l.meetingStatus === "Waiting" ||
      l.meetingStatus === "InProgress" ||
      l.status === "InProgress",
  );
  if (live) return live;
  const upcoming = [...lessons]
    .filter((l) => l.status !== "Cancelled" && new Date(l.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  if (upcoming.length > 0) return upcoming[0];
  return lessons[lessons.length - 1];
};

const canJoinLesson = (lesson) =>
  lesson.meetingStatus === "InProgress" ||
  (lesson.status !== "Completed" &&
    lesson.status !== "NoStudent" &&
    lesson.status !== "NoTutor" &&
    lesson.status !== "Cancelled" &&
    lesson.meetingStatus !== "Ended");

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const colors = useThemeColors();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Per-course lazy learning path
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseLessonsMap, setCourseLessonsMap] = useState({});
  const [courseModuleInfoMap, setCourseModuleInfoMap] = useState({});
  const [loadingCourseMap, setLoadingCourseMap] = useState({});

  // Modals
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onOpenChange: onVideoOpenChange } = useDisclosure();
  const [recordingUrl, setRecordingUrl] = useState(null);
  const { isOpen: isSummaryOpen, onOpen: onSummaryOpen, onClose: onSummaryClose } = useDisclosure();
  const [summaryText, setSummaryText] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoadingStudent(true);
        const res = await studentApi.getStudentById(studentId);
        setStudent(res.data);
      } catch (err) {
        console.error("Failed to fetch student:", err);
      } finally {
        setLoadingStudent(false);
      }
    };

    const fetchEnrollments = async () => {
      try {
        setLoadingEnrollments(true);
        const [inProgressRes, completedRes] = await Promise.all([
          coursesApi.getAllCourseEnrollments({
            StudentId: studentId,
            Status: "InProgress",
            "page-size": 50,
          }),
          coursesApi.getAllCourseEnrollments({
            StudentId: studentId,
            Status: "Completed",
            "page-size": 50,
          }),
        ]);
        setEnrollments([
          ...(inProgressRes?.data?.items || []),
          ...(completedRes?.data?.items || []),
        ]);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
      } finally {
        setLoadingEnrollments(false);
      }
    };

    if (studentId) {
      fetchStudent();
      fetchEnrollments();
    }
  }, [studentId]);

  const toggleCourse = useCallback(
    async (courseId) => {
      if (expandedCourse === courseId) {
        setExpandedCourse(null);
        return;
      }
      setExpandedCourse(courseId);
      if (courseLessonsMap[courseId] !== undefined) return;

      setLoadingCourseMap((prev) => ({ ...prev, [courseId]: true }));
      try {
        const res = await studentApi.getLessons({
          StudentId: studentId,
          CourseId: courseId,
          "page-size": 200,
          "sort-params": "StartTime-asc",
        });
        const lessons = res?.data?.items || [];
        setCourseLessonsMap((prev) => ({ ...prev, [courseId]: lessons }));

        const uniqueModuleIds = [
          ...new Set(lessons.map((l) => l.moduleId).filter(Boolean)),
        ];
        if (uniqueModuleIds.length) {
          const moduleResults = await Promise.all(
            uniqueModuleIds.map((mid) => coursesApi.getCourseModuleById(mid)),
          );
          const modMap = {};
          moduleResults.forEach((r) => {
            const mod = r?.data;
            if (mod?.id) modMap[mod.id] = mod;
          });
          setCourseModuleInfoMap((prev) => ({ ...prev, [courseId]: modMap }));
        }
      } catch (err) {
        console.error("Failed to fetch course lessons:", err);
        setCourseLessonsMap((prev) => ({ ...prev, [courseId]: [] }));
      } finally {
        setLoadingCourseMap((prev) => ({ ...prev, [courseId]: false }));
      }
    },
    [expandedCourse, courseLessonsMap, studentId],
  );

  const getLessonStatusColor = (status) => {
    switch (status) {
      case "Scheduled": return colors.primary.main;
      case "Completed": return colors.state.success;
      case "Cancelled": return colors.state.error;
      case "InProgress": return colors.state.warning;
      case "NoStudent": return colors.state.error;
      case "NoTutor": return colors.state.error;
      default: return colors.text.secondary;
    }
  };

  const getLessonStatusLabel = (status) => {
    switch (status) {
      case "Scheduled": return t("tutorDashboard.schedule.lessonStatus.scheduled");
      case "Completed": return t("tutorDashboard.schedule.lessonStatus.completed");
      case "Cancelled": return t("tutorDashboard.schedule.lessonStatus.cancelled");
      case "InProgress": return t("tutorDashboard.schedule.lessonStatus.inProgress");
      case "NoStudent": return t("tutorDashboard.schedule.lessonStatus.noStudent");
      case "NoTutor": return t("tutorDashboard.schedule.lessonStatus.noTutor");
      default: return status || "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "InProgress":
        return { bg: `${colors.state.warning}20`, text: colors.state.warning };
      case "Completed":
        return { bg: `${colors.state.success}20`, text: colors.state.success };
      default:
        return { bg: `${colors.text.tertiary}20`, text: colors.text.tertiary };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(dateLocale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openDetail = (lesson) => {
    setSelectedLesson(lesson);
    onDetailOpen();
  };

  const openRecording = (lesson) => {
    setRecordingUrl(lesson.lessonRecord?.recordUrl);
    onVideoOpen();
  };

  const openSummary = (lesson) => {
    setSummaryText(lesson.lessonScript?.summarizeText || "");
    setSelectedLesson(lesson);
    onSummaryOpen();
  };

  const inProgressCount = enrollments.filter((e) => e.status === "InProgress").length;
  const completedCount = enrollments.filter((e) => e.status === "Completed").length;

  return (
    <div className="space-y-6">
      <Button
        variant="light"
        startContent={<ArrowLeft size={18} />}
        onPress={() => navigate(-1)}
        style={{ color: colors.text.secondary }}
      >
        {t("common.back")}
      </Button>

      {/* Student info card */}
      {loadingStudent ? (
        <Card shadow="none" className="border-none" style={{ backgroundColor: colors.background.light }}>
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-56 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-lg" />
                <div className="flex gap-4 mt-2">
                  <Skeleton className="h-4 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-28 rounded-lg" />
                  <Skeleton className="h-4 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : student ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          <Card shadow="none" className="border-none" style={{ backgroundColor: colors.background.light }}>
            <CardBody className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar
                  src={withCDN(student.avatar || student.user?.avatarUrl)}
                  name={`${student.user?.firstName || ""} ${student.user?.lastName || ""}`}
                  className="w-24 h-24 text-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text.primary }}>
                    {student.user?.firstName} {student.user?.lastName}
                  </h1>
                  {student.user?.email && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <EnvelopeSimple size={18} style={{ color: colors.primary.main }} />
                      <span className="text-sm" style={{ color: colors.text.secondary }}>
                        {student.user.email}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={18} style={{ color: colors.primary.main }} />
                      <span className="text-sm" style={{ color: colors.text.secondary }}>
                        {enrollments.length} {t("studentProfile.totalCourses")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendUp size={18} style={{ color: colors.state.warning }} />
                      <span className="text-sm" style={{ color: colors.text.secondary }}>
                        {inProgressCount} {t("studentProfile.inProgress")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDots size={18} style={{ color: colors.state.success }} />
                      <span className="text-sm" style={{ color: colors.text.secondary }}>
                        {completedCount} {t("studentProfile.completed")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <Card shadow="none" className="border-none" style={{ backgroundColor: colors.background.light }}>
          <CardBody className="p-8 text-center">
            <p style={{ color: colors.text.secondary }}>{t("studentProfile.notFound")}</p>
          </CardBody>
        </Card>
      )}

      {/* Enrollments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: 0.05 }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
          <BookOpen
            size={22}
            weight="duotone"
            className="inline-block mr-2 -mt-0.5"
            style={{ color: colors.primary.main }}
          />
          {t("studentProfile.enrolledCourses")}
        </h2>

        {loadingEnrollments ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} shadow="none" className="border-none" style={{ backgroundColor: colors.background.light }}>
                <CardBody className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-14 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48 rounded-lg" />
                      <Skeleton className="h-3 w-32 rounded-lg" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <Card shadow="none" className="border-none" style={{ backgroundColor: colors.background.light }}>
            <CardBody className="p-6 text-center">
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {t("studentProfile.noEnrollments")}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => {
              const progress =
                enrollment.numsOfSession > 0
                  ? Math.round(
                      (enrollment.numOfCompleteSession / enrollment.numsOfSession) * 100,
                    )
                  : 0;
              const statusColor = getStatusColor(enrollment.status);
              const courseId = enrollment.courseId;
              const isExpanded = expandedCourse === courseId;
              const isLoading = loadingCourseMap[courseId];
              const lessons = courseLessonsMap[courseId] || [];
              const moduleInfoMap = courseModuleInfoMap[courseId] || {};
              const modules = isExpanded
                ? buildModulesFromLessons(lessons, moduleInfoMap)
                : [];

              return (
                <Card
                  key={enrollment.id}
                  shadow="none"
                  className="border-none overflow-hidden"
                  style={{ backgroundColor: colors.background.light }}
                >
                  {/* Course header row */}
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => toggleCourse(courseId)}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            withCDN(enrollment.course?.thumbnailUrl) ||
                            "https://placehold.co/300x200?text=No+Image"
                          }
                          alt={enrollment.course?.title}
                          className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-semibold truncate" style={{ color: colors.text.primary }}>
                              {enrollment.course?.title}
                            </p>
                            <Chip
                              size="sm"
                              style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                            >
                              {enrollment.status === "InProgress"
                                ? t("studentProfile.inProgress")
                                : enrollment.status === "Completed"
                                  ? t("studentProfile.completed")
                                  : enrollment.status}
                            </Chip>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs" style={{ color: colors.text.tertiary }}>
                              {enrollment.numOfCompleteSession}/{enrollment.numsOfSession}{" "}
                              {t("courses.detail.sessionsCompleted")}
                            </span>
                            {enrollment.enrolledAt && (
                              <span className="text-xs" style={{ color: colors.text.tertiary }}>
                                {new Date(enrollment.enrolledAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress
                              value={progress}
                              size="sm"
                              color={enrollment.status === "Completed" ? "success" : "primary"}
                              className="flex-1"
                            />
                            <span
                              className="text-sm font-semibold min-w-[3rem] text-right"
                              style={{ color: colors.primary.main }}
                            >
                              {progress}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <Tooltip content={t("common.view")} size="sm">
                            <button
                              type="button"
                              className="p-1.5 rounded-md"
                              style={{ color: colors.text.tertiary }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/tutor/courses/${courseId}`);
                              }}
                            >
                              <ArrowSquareOut size={16} />
                            </button>
                          </Tooltip>
                          {isExpanded ? (
                            <CaretUp size={18} style={{ color: colors.text.secondary }} />
                          ) : (
                            <CaretDown size={18} style={{ color: colors.text.secondary }} />
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </button>

                  {/* Expanded learning path */}
                  {isExpanded && (
                    <div
                      className="px-4 pb-5 border-t"
                      style={{ borderColor: colors.border.light }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <Spinner size="sm" color="primary" />
                        </div>
                      ) : modules.length === 0 ? (
                        <p className="text-sm text-center py-6" style={{ color: colors.text.tertiary }}>
                          {t("courses.detail.noSessions")}
                        </p>
                      ) : (
                        <div className="space-y-4 pt-4">
                          {modules.map((mod, modIdx) => (
                            <div key={mod.moduleId}>
                              {/* Module label */}
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                                  style={{ backgroundColor: colors.primary.main, color: "#fff" }}
                                >
                                  {modIdx + 1}
                                </span>
                                <p
                                  className="text-xs uppercase tracking-wider font-semibold"
                                  style={{ color: colors.text.tertiary }}
                                >
                                  {mod.title}
                                </p>
                              </div>

                              {/* Session cards */}
                              <div className="space-y-2 ml-8">
                                {mod.sessions.map((sess) => {
                                  const primary = getPrimaryLesson(sess.lessons);
                                  const statusColor = primary
                                    ? getLessonStatusColor(primary.status)
                                    : colors.text.tertiary;
                                  const hwList = sess.lessons.flatMap(
                                    (l) => l.lessonHomeworks || [],
                                  );
                                  const hasRecording = !!primary?.lessonRecord?.recordUrl;
                                  const hasSummary = !!primary?.lessonScript?.summarizeText;
                                  const joinable = primary && canJoinLesson(primary);

                                  return (
                                    <div
                                      key={sess.sessionId}
                                      className="rounded-xl border overflow-hidden"
                                      style={{
                                        borderColor:
                                          primary?.status === "InProgress" ||
                                          primary?.meetingStatus === "Waiting"
                                            ? statusColor
                                            : colors.border.light,
                                        borderWidth:
                                          primary?.status === "InProgress" ||
                                          primary?.meetingStatus === "Waiting"
                                            ? 2
                                            : 1,
                                      }}
                                    >
                                      {/* Top row: icon + title + status */}
                                      <div
                                        className="flex items-start gap-3 px-4 pt-3 pb-2"
                                        style={{ backgroundColor: colors.background.light }}
                                      >
                                        {/* Status icon */}
                                        <div
                                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                          style={{ backgroundColor: `${statusColor}18` }}
                                        >
                                          {!primary ? (
                                            <Circle
                                              className="w-4 h-4"
                                              style={{ color: colors.text.tertiary }}
                                            />
                                          ) : primary.status === "Completed" ? (
                                            <CheckCircle
                                              weight="fill"
                                              className="w-4 h-4"
                                              style={{ color: statusColor }}
                                            />
                                          ) : primary.status === "InProgress" ||
                                            primary.meetingStatus === "Waiting" ? (
                                            <Lightning
                                              weight="fill"
                                              className="w-4 h-4"
                                              style={{ color: statusColor }}
                                            />
                                          ) : primary.status === "Cancelled" ||
                                            primary.status === "NoStudent" ||
                                            primary.status === "NoTutor" ? (
                                            <XCircle
                                              weight="fill"
                                              className="w-4 h-4"
                                              style={{ color: statusColor }}
                                            />
                                          ) : (
                                            <Clock
                                              weight="duotone"
                                              className="w-4 h-4"
                                              style={{ color: statusColor }}
                                            />
                                          )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <p
                                              className="font-semibold text-sm"
                                              style={{ color: colors.text.primary }}
                                            >
                                              {sess.sessionNumber}. {sess.sessionTitle}
                                            </p>
                                            {primary && (
                                              <Chip
                                                size="sm"
                                                className="h-5 flex-shrink-0"
                                                style={{
                                                  backgroundColor: `${statusColor}20`,
                                                  color: statusColor,
                                                  fontSize: "10px",
                                                }}
                                              >
                                                {getLessonStatusLabel(primary.status)}
                                              </Chip>
                                            )}
                                          </div>

                                          {/* Date/time row */}
                                          {primary?.startTime && (
                                            <div className="flex items-center gap-1.5 mt-1">
                                              <CalendarDots
                                                size={12}
                                                weight="duotone"
                                                style={{ color: statusColor }}
                                              />
                                              <span
                                                className="text-xs"
                                                style={{ color: colors.text.secondary }}
                                              >
                                                {formatDate(primary.startTime)}
                                              </span>
                                              <span style={{ color: colors.text.tertiary }} className="text-xs">·</span>
                                              <span
                                                className="text-xs"
                                                style={{ color: colors.text.secondary }}
                                              >
                                                {formatTime(primary.startTime)} – {formatTime(primary.endTime)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Action row */}
                                      <div
                                        className="flex items-center gap-2 px-4 py-2 flex-wrap"
                                        style={{ backgroundColor: colors.background.gray }}
                                      >
                                        {/* Homework badge */}
                                        {hwList.length > 0 && (
                                          <Chip
                                            size="sm"
                                            className="h-6"
                                            startContent={
                                              <NotePencil
                                                weight="duotone"
                                                className="w-3 h-3 ml-0.5"
                                                style={{ color: colors.primary.main }}
                                              />
                                            }
                                            style={{
                                              backgroundColor: `${colors.primary.main}15`,
                                              color: colors.primary.main,
                                              fontSize: "11px",
                                            }}
                                          >
                                            {hwList.length} {t("studentDashboard.homework.title")}
                                          </Chip>
                                        )}

                                        <div className="flex items-center gap-1.5 ml-auto">
                                          {/* Start / Join button */}
                                          {joinable && primary && (
                                            <Button
                                              size="sm"
                                              startContent={
                                                <VideoCamera weight="fill" className="w-3.5 h-3.5" />
                                              }
                                              style={{
                                                backgroundColor: statusColor,
                                                color: "#fff",
                                              }}
                                              onPress={() =>
                                                navigate(`/meeting/${primary.id}`)
                                              }
                                            >
                                              {t("tutorDashboard.dashboard.startLesson")}
                                            </Button>
                                          )}

                                          {/* View Recording */}
                                          {hasRecording && (
                                            <Tooltip
                                              content={t("tutorDashboard.schedule.watchRecording")}
                                              size="sm"
                                            >
                                              <Button
                                                isIconOnly
                                                size="sm"
                                                variant="flat"
                                                style={{
                                                  backgroundColor: `${colors.state.success}20`,
                                                  color: colors.state.success,
                                                  minWidth: "32px",
                                                  height: "32px",
                                                }}
                                                onPress={() => openRecording(primary)}
                                              >
                                                <Play weight="fill" className="w-3.5 h-3.5" />
                                              </Button>
                                            </Tooltip>
                                          )}

                                          {/* View Summary */}
                                          {hasSummary && (
                                            <Tooltip
                                              content={t("tutorDashboard.schedule.lessonSummary")}
                                              size="sm"
                                            >
                                              <Button
                                                isIconOnly
                                                size="sm"
                                                variant="flat"
                                                style={{
                                                  backgroundColor: `${colors.primary.main}20`,
                                                  color: colors.primary.main,
                                                  minWidth: "32px",
                                                  height: "32px",
                                                }}
                                                onPress={() => openSummary(primary)}
                                              >
                                                <FileText weight="duotone" className="w-3.5 h-3.5" />
                                              </Button>
                                            </Tooltip>
                                          )}

                                          {/* View Detail */}
                                          {primary && (
                                            <Tooltip
                                              content={t("studentDashboard.myCourses.viewDetails")}
                                              size="sm"
                                            >
                                              <Button
                                                isIconOnly
                                                size="sm"
                                                variant="flat"
                                                style={{
                                                  backgroundColor: `${colors.text.tertiary}15`,
                                                  color: colors.text.secondary,
                                                  minWidth: "32px",
                                                  height: "32px",
                                                }}
                                                onPress={() => openDetail(primary)}
                                              >
                                                <ArrowSquareOut className="w-3.5 h-3.5" />
                                              </Button>
                                            </Tooltip>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <LessonDetailModal
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        lesson={selectedLesson}
        role="tutor"
      />

      <VideoModal
        isOpen={isVideoOpen}
        onOpenChange={onVideoOpenChange}
        videoUrl={recordingUrl}
      />

      <LessonSummaryModal
        isOpen={isSummaryOpen}
        onClose={onSummaryClose}
        summarizeText={summaryText}
      />
    </div>
  );
};

export default StudentDetail;
