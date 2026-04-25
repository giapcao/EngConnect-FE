import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { selectUser } from "../../../store";
import { tutorApi, studentApi, coursesApi } from "../../../api";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Tooltip,
  Tabs,
  Tab,
  Avatar,
} from "@heroui/react";
import ScheduleSkeleton from "../../../components/ScheduleSkeleton/ScheduleSkeleton";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  CalendarDots,
  Clock,
  Plus,
  PencilSimple,
  Trash,
  Warning,
  VideoCamera,
  BookOpen,
  CaretLeft,
  CaretRight,
  User,
  Record,
  Play,
  Circle,
  Eye,
  FileText,
  LinkSimple,
  SpinnerGap,
} from "@phosphor-icons/react";
import calendarIllustration from "../../../assets/illustrations/calendar.avif";
import VideoModal from "../../../components/VideoModal/VideoModal";
import LessonDetailModal from "../../../components/LessonDetailModal/LessonDetailModal";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CDN_BASE = "https://d20854st1o56hw.cloudfront.net/";
const withCDN = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return CDN_BASE + url;
};

const Schedule = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { selectClassNames } = useInputStyles();
  const user = useSelector(selectUser);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lessons
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [activeView, setActiveView] = useState("lessons");

  // Calendar week navigation
  const [calendarWeekStart, setCalendarWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday-based
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() + diff);
    return monday;
  });

  // Add/Edit modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formWeekday, setFormWeekday] = useState("Monday");
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("10:00");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [weekdayLocked, setWeekdayLocked] = useState(false);

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Lesson detail modal
  const {
    isOpen: isLessonDetailOpen,
    onOpen: onLessonDetailOpen,
    onClose: onLessonDetailClose,
  } = useDisclosure();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sidebarView, setSidebarView] = useState("today");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Video recording modal
  const {
    isOpen: isVideoOpen,
    onOpen: onVideoOpen,
    onOpenChange: onVideoOpenChange,
  } = useDisclosure();
  const [videoUrl, setVideoUrl] = useState("");

  const allTimeOptions = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      allTimeOptions.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }

  const fetchSchedules = useCallback(async () => {
    if (!user?.tutorId) return;
    try {
      setLoading(true);
      const res = await tutorApi.getTutorSchedules({
        TutorId: user.tutorId,
        "page-size": 200,
      });
      if (res.isSuccess) {
        setSchedules(res.data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.tutorId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const fetchLessons = useCallback(async () => {
    if (!user?.tutorId) return;
    try {
      setLessonsLoading(true);
      const res = await studentApi.getLessons({
        TutorId: user.tutorId,
        "page-size": 200,
      });
      setLessons(res?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
    } finally {
      setLessonsLoading(false);
    }
  }, [user?.tutorId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const todayName =
    WEEKDAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaySchedules = schedules
    .filter((s) => s.weekday === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Handlers
  const handleOpenCreate = (weekday = "Monday") => {
    setEditingSchedule(null);
    setFormWeekday(weekday);
    setWeekdayLocked(true);
    setFormStartTime("09:00");
    setFormEndTime("10:00");
    setSaveError(null);
    onOpen();
  };

  const handleOpenEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormWeekday(schedule.weekday);
    setWeekdayLocked(false);
    setFormStartTime(schedule.startTime.slice(0, 5));
    setFormEndTime(schedule.endTime.slice(0, 5));
    setSaveError(null);
    onOpen();
  };

  const handleOpenDelete = (schedule) => {
    setDeletingSchedule(schedule);
    onDeleteOpen();
  };

  const handleSave = async () => {
    if (!user?.tutorId) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (editingSchedule) {
        await tutorApi.updateTutorSchedule(editingSchedule.id, {
          request: {
            id: editingSchedule.id,
            tutorId: user.tutorId,
            weekday: formWeekday,
            startTime: formStartTime + ":00",
            endTime: formEndTime + ":00",
          },
        });
      } else {
        await tutorApi.createTutorSchedule({
          request: {
            tutorId: user.tutorId,
            weekday: formWeekday,
            startTime: formStartTime + ":00",
            endTime: formEndTime + ":00",
          },
        });
      }
      onClose();
      fetchSchedules();
    } catch (err) {
      const code = err?.response?.data?.error?.code;
      if (code === "Schedule.TutorSchedule.Conflict") {
        setSaveError(t("tutorDashboard.schedule.errorConflict"));
      } else {
        console.error("Failed to save schedule:", err);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSchedule) return;
    setDeleting(true);
    try {
      await tutorApi.deleteTutorSchedule(deletingSchedule.id);
      onDeleteClose();
      setDeletingSchedule(null);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return colors.state.success;
      case "Booked":
        return colors.primary.main;
      case "Pending":
        return colors.state.warning;
      case "Inactive":
        return colors.text.tertiary;
      default:
        return colors.text.secondary;
    }
  };

  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";

  const formatLessonTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
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
      case "NoStudent":
        return colors.state.error;
      case "NoTutor":
        return colors.state.error;
      default:
        return colors.text.secondary;
    }
  };

  const getLessonStatusLabel = (status) => {
    switch (status) {
      case "Scheduled":
        return t("tutorDashboard.schedule.lessonStatus.scheduled");
      case "Completed":
        return t("tutorDashboard.schedule.lessonStatus.completed");
      case "Cancelled":
        return t("tutorDashboard.schedule.lessonStatus.cancelled");
      case "InProgress":
        return t("tutorDashboard.schedule.lessonStatus.inProgress");
      case "NoStudent":
        return t("tutorDashboard.schedule.lessonStatus.noStudent");
      case "NoTutor":
        return t("tutorDashboard.schedule.lessonStatus.noTutor");
      default:
        return status || "";
    }
  };

  // TODO: restore date filter after testing
  const now = new Date();
  const todayStr = now.toDateString();

  const todayLessons = useMemo(
    () =>
      lessons
        .filter((l) => new Date(l.startTime).toDateString() === todayStr)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [lessons, todayStr],
  );

  const upcomingLessons = useMemo(
    () =>
      lessons
        .filter(
          (l) =>
            new Date(l.startTime) > now &&
            new Date(l.startTime).toDateString() !== todayStr,
        )
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    [lessons, todayStr],
  );

  const studentFullName = (lesson) =>
    [lesson.studentFirstName, lesson.studentLastName].filter(Boolean).join(" ");

  const canJoinLesson = (lesson) =>
    lesson.meetingStatus === "InProgress" ||
    (lesson.status !== "Completed" &&
      lesson.status !== "NoStudent" &&
      lesson.status !== "NoTutor" &&
      lesson.status !== "Cancelled" &&
      lesson.meetingStatus !== "Ended");

  const handleOpenLessonDetail = (lesson) => {
    setSelectedLesson(lesson);
    onLessonDetailOpen();
  };

  const getMeetingStatusInfo = (lesson) => {
    if (lesson.meetingStatus === "Waiting")
      return {
        label: t("tutorDashboard.schedule.meetingWaiting"),
        color: colors.state.warning,
      };
    if (lesson.meetingStatus === "InProgress")
      return {
        label: t("tutorDashboard.schedule.meetingInProgress"),
        color: colors.state.success,
      };
    if (lesson.meetingStatus === "Ended")
      return {
        label: t("tutorDashboard.schedule.meetingEnded"),
        color: colors.state.success,
      };
    return null;
  };

  const formatRecordDuration = (seconds) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  // Calendar helpers
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(calendarWeekStart);
    d.setDate(calendarWeekStart.getDate() + i);
    return d;
  });

  const calendarWeekEnd = new Date(calendarWeekStart);
  calendarWeekEnd.setDate(calendarWeekStart.getDate() + 6);

  const goToPrevWeek = () => {
    const prev = new Date(calendarWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCalendarWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(calendarWeekStart);
    next.setDate(next.getDate() + 7);
    setCalendarWeekStart(next);
  };

  const goToCurrentWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() + diff);
    setCalendarWeekStart(monday);
  };

  const CALENDAR_START_HOUR = 7;
  const CALENDAR_END_HOUR = 22;
  const HOUR_HEIGHT = 48; // px per hour — compact

  // Current time indicator position
  const currentTimeTop = useMemo(() => {
    const h = currentTime.getHours();
    const m = currentTime.getMinutes();
    if (h < CALENDAR_START_HOUR || h >= CALENDAR_END_HOUR) return null;
    return (((h - CALENDAR_START_HOUR) * 60 + m) / 60) * HOUR_HEIGHT;
  }, [currentTime]);

  const getLessonsForDay = (dayDate) => {
    return lessons.filter((l) => {
      const lessonDate = new Date(l.startTime);
      return lessonDate.toDateString() === dayDate.toDateString();
    });
  };

  const getLessonPosition = (lesson) => {
    const start = new Date(lesson.startTime);
    const end = new Date(lesson.endTime);
    const startMinutes =
      (start.getHours() - CALENDAR_START_HOUR) * 60 + start.getMinutes();
    const endMinutes =
      (end.getHours() - CALENDAR_START_HOUR) * 60 + end.getMinutes();
    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max(
      ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT,
      28,
    );
    return { top, height };
  };

  const getLessonBlockColor = (status) => {
    switch (status) {
      case "Scheduled":
        return { bg: `${colors.state.success}25`, border: colors.state.success, text: colors.state.success };
      case "InProgress":
        return { bg: `${colors.state.warning}25`, border: colors.state.warning, text: colors.state.warning };
      case "Completed":
        return { bg: `${colors.primary.main}25`, border: colors.primary.main, text: colors.primary.main };
      case "Cancelled":
      case "NoStudent":
      case "NoTutor":
        return { bg: `${colors.state.error}25`, border: colors.state.error, text: colors.state.error };
      default:
        return { bg: colors.background.gray, border: colors.border.medium, text: colors.text.secondary };
    }
  };

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  const formatWeekRange = () => {
    const startMonth = calendarWeekStart.toLocaleDateString(dateLocale, {
      month: "short",
    });
    const endMonth = calendarWeekEnd.toLocaleDateString(dateLocale, {
      month: "short",
    });
    const startDay = calendarWeekStart.getDate();
    const endDay = calendarWeekEnd.getDate();
    const year = calendarWeekEnd.getFullYear();
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {t("tutorDashboard.schedule.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("tutorDashboard.schedule.subtitle")}
          </p>
        </div>
      </motion.div>

      {/* Tabs: Schedules / Lessons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Tabs
          selectedKey={activeView}
          onSelectionChange={setActiveView}
          color="primary"
          classNames={{ tabList: "gap-2", tab: "px-4" }}
        >
          <Tab
            key="lessons"
            title={
              <div className="flex items-center gap-2">
                <BookOpen weight="duotone" className="w-5 h-5" />
                <span>{t("tutorDashboard.schedule.myLessons")}</span>
              </div>
            }
          />
          <Tab
            key="schedules"
            title={
              <div className="flex items-center gap-2">
                <CalendarDots weight="duotone" className="w-5 h-5" />
                <span>{t("tutorDashboard.schedule.scheduleSlots")}</span>
              </div>
            }
          />
        </Tabs>
      </motion.div>

      {activeView === "schedules" ? (
        <>
          <div className="grid gap-6">
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
                  {loading ? (
                    <ScheduleSkeleton />
                  ) : (
                    <div className="space-y-4">
                      {WEEKDAYS.map((day) => {
                        const daySchedules = schedules
                          .filter((s) => s.weekday === day)
                          .sort((a, b) =>
                            a.startTime.localeCompare(b.startTime),
                          );
                        const isToday = day === todayName;

                        return (
                          <div
                            key={day}
                            className="p-4 rounded-xl"
                            style={{
                              backgroundColor: isToday
                                ? colors.background.primaryLight
                                : colors.background.gray,
                              border: isToday
                                ? `1px solid ${colors.primary.main}30`
                                : "none",
                            }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <h3
                                  className="font-semibold"
                                  style={{ color: colors.text.primary }}
                                >
                                  {t(
                                    `tutorDashboard.schedule.days.${day.toLowerCase()}`,
                                  )}
                                </h3>
                                {isToday && (
                                  <Chip
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                  >
                                    {t("tutorDashboard.schedule.today")}
                                  </Chip>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-sm"
                                  style={{ color: colors.text.tertiary }}
                                >
                                  {daySchedules.length}{" "}
                                  {t("tutorDashboard.schedule.slots")}
                                </span>
                                <Button
                                  size="sm"
                                  color="primary"
                                  startContent={<Plus />}
                                  style={{
                                    backgroundColor: colors.primary.main,
                                    color: colors.text.white,
                                  }}
                                  onPress={() => handleOpenCreate(day)}
                                >
                                  {t("tutorDashboard.schedule.addSchedule")}
                                </Button>
                              </div>
                            </div>

                            {daySchedules.length === 0 ? (
                              <p
                                className="text-sm py-2"
                                style={{ color: colors.text.tertiary }}
                              >
                                {t("tutorDashboard.schedule.noSlots")}
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {daySchedules.map((schedule) => (
                                  <div
                                    key={schedule.id}
                                    className="flex items-center justify-between p-3 rounded-lg"
                                    style={{
                                      backgroundColor: colors.background.light,
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Clock
                                        weight="duotone"
                                        className="w-4 h-4"
                                        style={{
                                          color: getStatusColor(
                                            schedule.status,
                                          ),
                                        }}
                                      />
                                      <span
                                        className="font-medium text-sm"
                                        style={{ color: colors.text.primary }}
                                      >
                                        {formatTime(schedule.startTime)} —{" "}
                                        {formatTime(schedule.endTime)}
                                      </span>
                                      <Chip
                                        size="sm"
                                        style={{
                                          backgroundColor: `${getStatusColor(schedule.status)}20`,
                                          color: getStatusColor(
                                            schedule.status,
                                          ),
                                        }}
                                      >
                                        {t(
                                          `tutorDashboard.schedule.status.${schedule.status.toLowerCase()}`,
                                        )}
                                      </Chip>
                                    </div>
                                    {schedule.status === "Open" && (
                                      <div className="flex items-center gap-1">
                                        <Tooltip
                                          content={t(
                                            "tutorDashboard.schedule.edit",
                                          )}
                                        >
                                          <Button
                                            size="sm"
                                            isIconOnly
                                            variant="light"
                                            onPress={() =>
                                              handleOpenEdit(schedule)
                                            }
                                          >
                                            <PencilSimple
                                              weight="duotone"
                                              className="w-4 h-4"
                                              style={{
                                                color: colors.primary.main,
                                              }}
                                            />
                                          </Button>
                                        </Tooltip>
                                        <Tooltip
                                          content={t(
                                            "tutorDashboard.schedule.delete",
                                          )}
                                        >
                                          <Button
                                            size="sm"
                                            isIconOnly
                                            variant="light"
                                            onPress={() =>
                                              handleOpenDelete(schedule)
                                            }
                                          >
                                            <Trash
                                              weight="duotone"
                                              className="w-4 h-4"
                                              style={{
                                                color: colors.state.error,
                                              }}
                                            />
                                          </Button>
                                        </Tooltip>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Legend */}
                  <div
                    className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t"
                    style={{ borderColor: colors.border.medium }}
                  >
                    {["Open", "Booked", "Pending", "Inactive"].map((status) => (
                      <div key={status} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: getStatusColor(status) }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: colors.text.secondary }}
                        >
                          {t(
                            `tutorDashboard.schedule.status.${status.toLowerCase()}`,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </>
      ) : (
        /* Lessons View — Weekly Calendar */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {lessonsLoading ? (
            <ScheduleSkeleton />
          ) : lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <img
                src={calendarIllustration}
                alt="No lessons"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className="w-68 h-68 object-contain"
              />
              <h3
                className="text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.schedule.noLessons")}
              </h3>
              <p
                className="text-center max-w-sm"
                style={{ color: colors.text.secondary }}
              >
                {t("tutorDashboard.schedule.noLessonsDesc")}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_460px]">
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-4">
                  {/* Week Navigation */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={goToPrevWeek}
                      >
                        <CaretLeft
                          weight="bold"
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                      </Button>
                      <h2
                        className="text-base font-semibold min-w-[180px] text-center"
                        style={{ color: colors.text.primary }}
                      >
                        {formatWeekRange()}
                      </h2>
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={goToNextWeek}
                      >
                        <CaretRight
                          weight="bold"
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={goToCurrentWeek}
                    >
                      {t("tutorDashboard.schedule.today")}
                    </Button>
                  </div>

                  {/* Calendar */}
                  <div className="overflow-x-auto">
                    <div style={{ minWidth: "640px" }}>
                      {/* Day headers */}
                      <div
                        className="grid border-b"
                        style={{
                          gridTemplateColumns: "44px repeat(7, 1fr)",
                          borderColor: colors.border.medium,
                        }}
                      >
                        <div className="p-1" />
                        {calendarDays.map((day, idx) => {
                          const dayIsToday = isToday(day);
                          return (
                            <div
                              key={idx}
                              className="py-2 px-1 text-center"
                              style={{
                                backgroundColor: dayIsToday
                                  ? `${colors.primary.main}10`
                                  : "transparent",
                              }}
                            >
                              <p
                                className="text-[11px] font-medium"
                                style={{
                                  color: dayIsToday
                                    ? colors.primary.main
                                    : colors.text.tertiary,
                                }}
                              >
                                {t(
                                  `tutorDashboard.schedule.days.${WEEKDAYS[idx].toLowerCase()}`,
                                ).slice(0, 3)}
                              </p>
                              <p
                                className={`text-base font-bold mt-0.5 ${
                                  dayIsToday
                                    ? "w-7 h-7 rounded-full flex items-center justify-center mx-auto text-sm"
                                    : ""
                                }`}
                                style={{
                                  color: dayIsToday
                                    ? "#fff"
                                    : colors.text.primary,
                                  backgroundColor: dayIsToday
                                    ? colors.primary.main
                                    : "transparent",
                                }}
                              >
                                {day.getDate()}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Time grid */}
                      <div
                        className="relative overflow-y-auto"
                        style={{ maxHeight: "520px" }}
                      >
                        <div
                          className="grid"
                          style={{
                            gridTemplateColumns: "44px repeat(7, 1fr)",
                            height: `${(CALENDAR_END_HOUR - CALENDAR_START_HOUR) * HOUR_HEIGHT}px`,
                          }}
                        >
                          {/* Time labels column */}
                          <div className="relative">
                            {Array.from(
                              {
                                length: CALENDAR_END_HOUR - CALENDAR_START_HOUR,
                              },
                              (_, i) => CALENDAR_START_HOUR + i,
                            ).map((hour) => (
                              <div
                                key={hour}
                                className="absolute right-1.5 text-right"
                                style={{
                                  top: `${(hour - CALENDAR_START_HOUR) * HOUR_HEIGHT - 6}px`,
                                  color: colors.text.tertiary,
                                  fontSize: "10px",
                                }}
                              >
                                {`${String(hour).padStart(2, "0")}:00`}
                              </div>
                            ))}
                          </div>

                          {/* Day columns */}
                          {calendarDays.map((day, dayIdx) => {
                            const dayLessons = getLessonsForDay(day);
                            const dayIsToday = isToday(day);
                            return (
                              <div
                                key={dayIdx}
                                className="relative border-l"
                                style={{
                                  borderColor: colors.border.medium,
                                  backgroundColor: dayIsToday
                                    ? `${colors.primary.main}05`
                                    : "transparent",
                                }}
                              >
                                {/* Hour grid lines + half-hour lines */}
                                {Array.from(
                                  {
                                    length:
                                      CALENDAR_END_HOUR - CALENDAR_START_HOUR,
                                  },
                                  (_, i) => i,
                                ).map((i) => (
                                  <div key={i}>
                                    <div
                                      className="absolute w-full border-t"
                                      style={{
                                        top: `${i * HOUR_HEIGHT}px`,
                                        borderColor: colors.border.medium,
                                      }}
                                    />
                                    <div
                                      className="absolute w-full border-t border-dashed"
                                      style={{
                                        top: `${i * HOUR_HEIGHT + HOUR_HEIGHT / 2}px`,
                                        borderColor: `${colors.border.medium}80`,
                                      }}
                                    />
                                  </div>
                                ))}

                                {/* Lesson blocks */}
                                {dayLessons.map((lesson) => {
                                  const pos = getLessonPosition(lesson);
                                  const blockColor = getLessonBlockColor(
                                    lesson.status,
                                  );
                                  return (
                                    <div
                                      key={lesson.id}
                                      className="absolute left-0.5 right-0.5 rounded-md px-1.5 py-0.5 overflow-hidden cursor-pointer transition-all hover:opacity-80 hover:shadow-md"
                                      style={{
                                        top: `${pos.top}px`,
                                        height: `${Math.max(pos.height, 22)}px`,
                                        backgroundColor: blockColor.bg,
                                        borderLeft: `3px solid ${blockColor.border}`,
                                        zIndex: 2,
                                      }}
                                      onClick={() =>
                                        handleOpenLessonDetail(lesson)
                                      }
                                    >
                                      <p
                                        className="text-[11px] font-semibold truncate leading-tight"
                                        style={{ color: blockColor.text }}
                                      >
                                        {lesson.courseTitle ||
                                          t(
                                            "tutorDashboard.schedule.lessonLabel",
                                          )}
                                      </p>
                                      {pos.height > 30 && (
                                        <p
                                          className="text-[10px] truncate leading-tight mt-0.5"
                                          style={{
                                            color: blockColor.text,
                                            opacity: 0.8,
                                          }}
                                        >
                                          {studentFullName(lesson) ||
                                            lesson.sessionTitle}
                                        </p>
                                      )}
                                      {pos.height > 44 && (
                                        <p
                                          className="text-[10px] truncate leading-tight mt-0.5"
                                          style={{
                                            color: blockColor.text,
                                            opacity: 0.7,
                                          }}
                                        >
                                          {formatLessonTime(lesson.startTime)} —{" "}
                                          {formatLessonTime(lesson.endTime)}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Current time indicator */}
                                {dayIsToday && currentTimeTop !== null && (
                                  <div
                                    className="absolute left-0 right-0 pointer-events-none"
                                    style={{
                                      top: `${currentTimeTop}px`,
                                      zIndex: 3,
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{
                                          backgroundColor: colors.state.error,
                                          marginLeft: "-4px",
                                        }}
                                      />
                                      <div
                                        className="flex-1 h-[1.5px]"
                                        style={{
                                          backgroundColor: colors.state.error,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div
                    className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t"
                    style={{ borderColor: colors.border.medium }}
                  >
                    {[
                      "Scheduled",
                      "InProgress",
                      "Completed",
                      "NoStudent",
                      "NoTutor",
                    ].map((status) => (
                      <div key={status} className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded"
                          style={{
                            backgroundColor: getLessonBlockColor(status).border,
                          }}
                        />
                        <span
                          className="text-[11px]"
                          style={{ color: colors.text.secondary }}
                        >
                          {getLessonStatusLabel(status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Sidebar — Today / Upcoming toggle */}
              <Card
                shadow="none"
                className="border-none hidden lg:block lg:sticky lg:top-40 self-start"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-4">
                  {/* Sidebar tabs */}
                  <Tabs
                    selectedKey={sidebarView}
                    onSelectionChange={setSidebarView}
                    variant="solid"
                    fullWidth
                    className="mb-4"
                  >
                    <Tab
                      key="today"
                      title={
                        <div className="flex items-center gap-1.5 text-xs">
                          <CalendarDots
                            weight="duotone"
                            className="w-3.5 h-3.5"
                          />
                          <span>{t("tutorDashboard.schedule.today")}</span>
                          {todayLessons.length > 0 && (
                            <Chip
                              size="sm"
                              variant="flat"
                              className="h-4 min-w-4 text-[10px]"
                            >
                              {todayLessons.length}
                            </Chip>
                          )}
                        </div>
                      }
                    />
                    <Tab
                      key="upcoming"
                      title={
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock weight="duotone" className="w-3.5 h-3.5" />
                          <span>
                            {t("tutorDashboard.schedule.upcomingSidebarTab")}
                          </span>
                          {upcomingLessons.length > 0 && (
                            <Chip
                              size="sm"
                              variant="flat"
                              className="h-4 min-w-4 text-[10px]"
                            >
                              {upcomingLessons.length}
                            </Chip>
                          )}
                        </div>
                      }
                    />
                  </Tabs>

                  {/* Sidebar content */}
                  {(() => {
                    const sidebarLessons =
                      sidebarView === "today" ? todayLessons : upcomingLessons;
                    const emptyMessage =
                      sidebarView === "today"
                        ? t("tutorDashboard.schedule.noLessonsToday")
                        : t("tutorDashboard.schedule.noUpcoming");

                    if (sidebarLessons.length === 0) {
                      return (
                        <div className="text-center py-6">
                          <img
                            src={calendarIllustration}
                            alt="No lessons"
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                            className="w-48 h-48 mx-auto object-contain"
                          />
                          <p
                            className="text-sm"
                            style={{ color: colors.text.tertiary }}
                          >
                            {emptyMessage}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {sidebarLessons.map((lesson) => {
                          const blockColor = getLessonBlockColor(lesson.status);
                          const startDate = new Date(lesson.startTime);
                          const endDate = new Date(lesson.endTime);
                          const durationMin = Math.round(
                            (endDate - startDate) / 60000,
                          );
                          const meetingInfo = getMeetingStatusInfo(lesson);
                          const hasRecording = lesson.lessonRecord?.recordUrl;
                          return (
                            <div
                              key={lesson.id}
                              className="p-3 rounded-xl"
                              style={{
                                backgroundColor: colors.background.gray,
                              }}
                            >
                              <div className="flex items-start gap-2.5">
                                <Avatar
                                  src={withCDN(lesson.studentAvatar)}
                                  name={studentFullName(lesson)}
                                  size="sm"
                                  className="w-8 h-8 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="font-semibold text-sm truncate"
                                    style={{ color: colors.text.primary }}
                                  >
                                    {studentFullName(lesson) ||
                                      t("tutorDashboard.schedule.lessonLabel")}
                                  </p>
                                  <p
                                    className="text-xs truncate mt-0.5"
                                    style={{
                                      color: colors.text.secondary,
                                    }}
                                  >
                                    {lesson.courseTitle}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span
                                      className="text-[11px] flex items-center gap-1"
                                      style={{
                                        color: colors.text.tertiary,
                                      }}
                                    >
                                      <Clock
                                        weight="duotone"
                                        className="w-3 h-3"
                                      />
                                      {sidebarView === "upcoming" &&
                                        new Date(
                                          lesson.startTime,
                                        ).toLocaleDateString(dateLocale, {
                                          day: "numeric",
                                          month: "short",
                                        }) + " · "}
                                      {formatLessonTime(lesson.startTime)} —{" "}
                                      {formatLessonTime(lesson.endTime)}
                                    </span>
                                    <Chip
                                      size="sm"
                                      className="h-4"
                                      style={{
                                        backgroundColor: `${blockColor.border}20`,
                                        color: blockColor.border,
                                        fontSize: "10px",
                                      }}
                                    >
                                      {durationMin}m
                                    </Chip>
                                  </div>
                                  {meetingInfo && (
                                    <span
                                      className="text-[11px] flex items-center gap-1 mt-1"
                                      style={{ color: meetingInfo.color }}
                                    >
                                      <Circle
                                        weight="fill"
                                        className="w-2 h-2"
                                      />
                                      {meetingInfo.label}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  className="flex-1"
                                  startContent={<Eye className="w-3.5 h-3.5" />}
                                  onPress={(e) => {
                                    e.stopPropagation?.();
                                    handleOpenLessonDetail(lesson);
                                  }}
                                >
                                  {t("tutorDashboard.schedule.viewDetail")}
                                </Button>
                                {canJoinLesson(lesson) && (
                                  <Button
                                    size="sm"
                                    className="flex-1"
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
                                    onPress={(e) => {
                                      e.stopPropagation?.();
                                      navigate(`/meeting/${lesson.id}`);
                                    }}
                                  >
                                    {lesson.meetingStatus === "InProgress"
                                      ? t("tutorDashboard.schedule.joinBack")
                                      : t("tutorDashboard.schedule.joinLesson")}
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardBody>
              </Card>

              {/* Mobile Today/Upcoming — visible on sm/md, hidden on lg+ */}
              <Card
                shadow="none"
                className="border-none lg:hidden"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-4">
                  <Tabs
                    selectedKey={sidebarView}
                    onSelectionChange={setSidebarView}
                    variant="solid"
                    fullWidth
                    className="mb-4"
                  >
                    <Tab
                      key="today"
                      title={
                        <div className="flex items-center gap-1.5 text-xs">
                          <CalendarDots weight="duotone" className="w-3.5 h-3.5" />
                          <span>{t("tutorDashboard.schedule.today")}</span>
                          {todayLessons.length > 0 && (
                            <Chip size="sm" variant="flat" className="h-4 min-w-4 text-[10px]">
                              {todayLessons.length}
                            </Chip>
                          )}
                        </div>
                      }
                    />
                    <Tab
                      key="upcoming"
                      title={
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock weight="duotone" className="w-3.5 h-3.5" />
                          <span>{t("tutorDashboard.schedule.upcomingSidebarTab")}</span>
                          {upcomingLessons.length > 0 && (
                            <Chip size="sm" variant="flat" className="h-4 min-w-4 text-[10px]">
                              {upcomingLessons.length}
                            </Chip>
                          )}
                        </div>
                      }
                    />
                  </Tabs>
                  {(() => {
                    const list = sidebarView === "today" ? todayLessons : upcomingLessons;
                    const emptyMsg = sidebarView === "today"
                      ? t("tutorDashboard.schedule.noLessonsToday")
                      : t("tutorDashboard.schedule.noUpcoming");
                    if (list.length === 0) {
                      return (
                        <p className="text-sm text-center py-6" style={{ color: colors.text.tertiary }}>
                          {emptyMsg}
                        </p>
                      );
                    }
                    return (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {list.map((lesson) => {
                          const blockColor = getLessonBlockColor(lesson.status);
                          const durationMin = Math.round(
                            (new Date(lesson.endTime) - new Date(lesson.startTime)) / 60000,
                          );
                          const meetingInfo = getMeetingStatusInfo(lesson);
                          return (
                            <div
                              key={lesson.id}
                              className="p-3 rounded-xl"
                              style={{ backgroundColor: colors.background.gray }}
                            >
                              <div className="flex items-start gap-2.5">
                                <Avatar
                                  src={withCDN(lesson.studentAvatar)}
                                  name={studentFullName(lesson)}
                                  size="sm"
                                  className="w-8 h-8 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate" style={{ color: colors.text.primary }}>
                                    {studentFullName(lesson) || t("tutorDashboard.schedule.lessonLabel")}
                                  </p>
                                  <p className="text-xs truncate mt-0.5" style={{ color: colors.text.secondary }}>
                                    {lesson.courseTitle}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span className="text-[11px] flex items-center gap-1" style={{ color: colors.text.tertiary }}>
                                      <Clock weight="duotone" className="w-3 h-3" />
                                      {sidebarView === "upcoming" &&
                                        new Date(lesson.startTime).toLocaleDateString(dateLocale, { day: "numeric", month: "short" }) + " · "}
                                      {formatLessonTime(lesson.startTime)} — {formatLessonTime(lesson.endTime)}
                                    </span>
                                    <Chip size="sm" className="h-4" style={{ backgroundColor: `${blockColor.border}20`, color: blockColor.border, fontSize: "10px" }}>
                                      {durationMin}m
                                    </Chip>
                                  </div>
                                  {meetingInfo && (
                                    <span className="text-[11px] flex items-center gap-1 mt-1" style={{ color: meetingInfo.color }}>
                                      <Circle weight="fill" className="w-2 h-2" />
                                      {meetingInfo.label}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  className="flex-1"
                                  startContent={<Eye className="w-3.5 h-3.5" />}
                                  onPress={() => handleOpenLessonDetail(lesson)}
                                >
                                  {t("tutorDashboard.schedule.viewDetail")}
                                </Button>
                                {canJoinLesson(lesson) && (
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    style={{ backgroundColor: colors.primary.main, color: colors.text.white }}
                                    startContent={<VideoCamera weight="fill" className="w-3.5 h-3.5" />}
                                    onPress={() => navigate(`/meeting/${lesson.id}`)}
                                  >
                                    {lesson.meetingStatus === "InProgress"
                                      ? t("tutorDashboard.schedule.joinBack")
                                      : t("tutorDashboard.schedule.joinLesson")}
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardBody>
              </Card>
            </div>
          )}
        </motion.div>
      )}

      {/* Add/Edit Schedule Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {editingSchedule
              ? t("tutorDashboard.schedule.editSchedule")
              : t("tutorDashboard.schedule.addSchedule")}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {saveError && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${colors.state.error}15`,
                    color: colors.state.error,
                    border: `1px solid ${colors.state.error}30`,
                  }}
                >
                  <Warning weight="fill" className="w-4 h-4 flex-shrink-0" />
                  {saveError}
                </div>
              )}
              <Select
                label={t("tutorDashboard.schedule.weekday")}
                selectedKeys={[formWeekday]}
                classNames={selectClassNames}
                isDisabled={weekdayLocked}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0];
                  if (val) setFormWeekday(val);
                }}
              >
                {WEEKDAYS.map((day) => (
                  <SelectItem key={day}>
                    {t(`tutorDashboard.schedule.days.${day.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </Select>

              <div className="flex items-center gap-3">
                <Select
                  label={t("tutorDashboard.schedule.startTime")}
                  selectedKeys={[formStartTime]}
                  classNames={selectClassNames}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0];
                    if (val) setFormStartTime(val);
                  }}
                >
                  {allTimeOptions.map((time) => (
                    <SelectItem key={time}>{time}</SelectItem>
                  ))}
                </Select>
                <span
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  —
                </span>
                <Select
                  label={t("tutorDashboard.schedule.endTime")}
                  selectedKeys={[formEndTime]}
                  classNames={selectClassNames}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0];
                    if (val) setFormEndTime(val);
                  }}
                >
                  {allTimeOptions
                    .filter((time) => time > formStartTime)
                    .map((time) => (
                      <SelectItem key={time}>{time}</SelectItem>
                    ))}
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {t("tutorDashboard.schedule.cancel")}
            </Button>
            <Button
              isLoading={saving}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              onPress={handleSave}
            >
              {t("tutorDashboard.schedule.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("tutorDashboard.schedule.confirmDelete")}
          </ModalHeader>
          <ModalBody>
            <div className="flex items-start gap-3">
              <Warning
                weight="fill"
                className="w-6 h-6 flex-shrink-0"
                style={{ color: colors.state.warning }}
              />
              <p style={{ color: colors.text.secondary }}>
                {t("tutorDashboard.schedule.deleteMessage")}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              {t("tutorDashboard.schedule.cancel")}
            </Button>
            <Button
              color="danger"
              isLoading={deleting}
              onPress={handleConfirmDelete}
            >
              {t("tutorDashboard.schedule.delete")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Lesson Detail Modal */}
      <LessonDetailModal
        isOpen={isLessonDetailOpen}
        onClose={onLessonDetailClose}
        lesson={selectedLesson}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onOpenChange={onVideoOpenChange}
        videoUrl={videoUrl}
      />
    </div>
  );
};

export default Schedule;
