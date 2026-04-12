import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../../store";
import { tutorApi, studentApi } from "../../../api";
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
  Spinner,
  Tooltip,
  Tabs,
  Tab,
} from "@heroui/react";
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
} from "@phosphor-icons/react";
import calendarIllustration from "../../../assets/illustrations/calendar.avif";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
  const [activeView, setActiveView] = useState("schedules");

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

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const todayName =
    WEEKDAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaySchedules = schedules
    .filter((s) => s.weekday === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Handlers
  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setFormWeekday("Monday");
    setFormStartTime("09:00");
    setFormEndTime("10:00");
    setSaveError(null);
    onOpen();
  };

  const handleOpenEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormWeekday(schedule.weekday);
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
      default:
        return status || "";
    }
  };

  // TODO: restore date filter after testing
  const todayLessons = [...lessons].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime),
  );

  const upcomingLessons = lessons
    .filter((l) => new Date(l.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

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

  const CALENDAR_START_HOUR = 6;
  const CALENDAR_END_HOUR = 22;
  const HOUR_HEIGHT = 60; // px per hour

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
        return { bg: "#DCFCE7", border: "#22C55E", text: "#166534" };
      case "InProgress":
        return { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" };
      case "Completed":
        return { bg: "#DBEAFE", border: "#3B82F6", text: "#1E40AF" };
      case "Cancelled":
        return { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B" };
      default:
        return { bg: "#F3F4F6", border: "#9CA3AF", text: "#374151" };
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
        {activeView === "schedules" && (
          <Button
            color="primary"
            startContent={<Plus weight="bold" className="w-5 h-5" />}
            style={{
              backgroundColor: colors.primary.main,
              color: colors.text.white,
            }}
            onPress={handleOpenCreate}
          >
            {t("tutorDashboard.schedule.addSchedule")}
          </Button>
        )}
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
            key="schedules"
            title={
              <div className="flex items-center gap-2">
                <CalendarDots weight="duotone" className="w-5 h-5" />
                <span>{t("tutorDashboard.schedule.scheduleSlots")}</span>
              </div>
            }
          />
          <Tab
            key="lessons"
            title={
              <div className="flex items-center gap-2">
                <BookOpen weight="duotone" className="w-5 h-5" />
                <span>{t("tutorDashboard.schedule.myLessons")}</span>
                {lessons.length > 0 && (
                  <Chip size="sm" variant="flat">
                    {lessons.length}
                  </Chip>
                )}
              </div>
            }
          />
        </Tabs>
      </motion.div>

      {activeView === "schedules" ? (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Weekly Schedule View */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="lg:col-span-2"
            >
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-6">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Spinner size="lg" />
                    </div>
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
                              <span
                                className="text-sm"
                                style={{ color: colors.text.tertiary }}
                              >
                                {daySchedules.length}{" "}
                                {t("tutorDashboard.schedule.slots")}
                              </span>
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
                    style={{ borderColor: colors.border.light }}
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

            {/* Today's Schedule Sidebar */}
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
                    <CalendarDots
                      weight="duotone"
                      className="w-5 h-5 inline-block mr-2"
                      style={{ color: colors.primary.main }}
                    />
                    {t("tutorDashboard.schedule.todaySchedule")}
                  </h2>

                  <div className="space-y-3">
                    {todaySchedules.length > 0 ? (
                      todaySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock
                                weight="duotone"
                                className="w-4 h-4"
                                style={{ color: colors.text.tertiary }}
                              />
                              <span
                                className="font-medium text-sm"
                                style={{ color: colors.text.primary }}
                              >
                                {formatTime(schedule.startTime)} —{" "}
                                {formatTime(schedule.endTime)}
                              </span>
                            </div>
                            <Chip
                              size="sm"
                              style={{
                                backgroundColor: `${getStatusColor(schedule.status)}20`,
                                color: getStatusColor(schedule.status),
                              }}
                            >
                              {t(
                                `tutorDashboard.schedule.status.${schedule.status.toLowerCase()}`,
                              )}
                            </Chip>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        className="text-center"
                        style={{ color: colors.text.tertiary }}
                      >
                        <img
                          src={calendarIllustration}
                          alt="No schedule"
                          className="w-44 h-44 mx-auto object-contain"
                        />
                        <p>{t("tutorDashboard.schedule.noScheduleToday")}</p>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div
                    className="mt-6 pt-4 border-t space-y-3"
                    style={{ borderColor: colors.border.light }}
                  >
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      {t("tutorDashboard.schedule.overview")}
                    </h3>
                    {["Open", "Booked", "Pending", "Inactive"].map((status) => {
                      const count = schedules.filter(
                        (s) => s.status === status,
                      ).length;
                      return (
                        <div
                          key={status}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: getStatusColor(status),
                              }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {t(
                                `tutorDashboard.schedule.status.${status.toLowerCase()}`,
                              )}
                            </span>
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {count}
                          </span>
                        </div>
                      );
                    })}
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
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <img
                src={calendarIllustration}
                alt="No lessons"
                className="w-52 h-52 object-contain"
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
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Calendar Grid */}
              <div className="lg:col-span-3">
                <Card
                  shadow="none"
                  className="border-none"
                  style={{ backgroundColor: colors.background.light }}
                >
                  <CardBody className="p-4">
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4">
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
                          className="text-lg font-semibold min-w-[200px] text-center"
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
                      <div style={{ minWidth: "700px" }}>
                        {/* Day headers */}
                        <div
                          className="grid border-b"
                          style={{
                            gridTemplateColumns: "56px repeat(7, 1fr)",
                            borderColor: colors.border.light,
                          }}
                        >
                          <div className="p-2" />
                          {calendarDays.map((day, idx) => {
                            const dayIsToday = isToday(day);
                            return (
                              <div
                                key={idx}
                                className="p-2 text-center"
                                style={{
                                  backgroundColor: dayIsToday
                                    ? `${colors.primary.main}10`
                                    : "transparent",
                                }}
                              >
                                <p
                                  className="text-xs font-medium"
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
                                  className={`text-lg font-bold mt-0.5 ${
                                    dayIsToday
                                      ? "w-8 h-8 rounded-full flex items-center justify-center mx-auto"
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
                          style={{
                            maxHeight: "600px",
                          }}
                        >
                          <div
                            className="grid"
                            style={{
                              gridTemplateColumns: "56px repeat(7, 1fr)",
                              height: `${(CALENDAR_END_HOUR - CALENDAR_START_HOUR) * HOUR_HEIGHT}px`,
                            }}
                          >
                            {/* Time labels column */}
                            <div className="relative">
                              {Array.from(
                                {
                                  length:
                                    CALENDAR_END_HOUR - CALENDAR_START_HOUR,
                                },
                                (_, i) => CALENDAR_START_HOUR + i,
                              ).map((hour) => (
                                <div
                                  key={hour}
                                  className="absolute right-2 text-right"
                                  style={{
                                    top: `${(hour - CALENDAR_START_HOUR) * HOUR_HEIGHT - 8}px`,
                                    color: colors.text.tertiary,
                                    fontSize: "11px",
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
                                    borderColor: colors.border.light,
                                    backgroundColor: dayIsToday
                                      ? `${colors.primary.main}05`
                                      : "transparent",
                                  }}
                                >
                                  {/* Hour grid lines */}
                                  {Array.from(
                                    {
                                      length:
                                        CALENDAR_END_HOUR - CALENDAR_START_HOUR,
                                    },
                                    (_, i) => i,
                                  ).map((i) => (
                                    <div
                                      key={i}
                                      className="absolute w-full border-t"
                                      style={{
                                        top: `${i * HOUR_HEIGHT}px`,
                                        borderColor: colors.border.light,
                                      }}
                                    />
                                  ))}

                                  {/* Lesson blocks */}
                                  {dayLessons.map((lesson) => {
                                    const pos = getLessonPosition(lesson);
                                    const blockColor = getLessonBlockColor(
                                      lesson.status,
                                    );
                                    return (
                                      <Tooltip
                                        key={lesson.id}
                                        content={
                                          <div className="p-1 text-xs">
                                            <p className="font-semibold">
                                              {lesson.courseName}
                                            </p>
                                            <p>{lesson.sessionTitle}</p>
                                            {lesson.studentName && (
                                              <p>
                                                {t(
                                                  "tutorDashboard.schedule.studentLabel",
                                                )}
                                                : {lesson.studentName}
                                              </p>
                                            )}
                                            <p>
                                              {formatLessonTime(
                                                lesson.startTime,
                                              )}{" "}
                                              —{" "}
                                              {formatLessonTime(lesson.endTime)}
                                            </p>
                                            <p>
                                              {getLessonStatusLabel(
                                                lesson.status,
                                              )}
                                            </p>
                                          </div>
                                        }
                                      >
                                        <div
                                          className="absolute left-0.5 right-0.5 rounded-md px-1.5 py-1 overflow-hidden cursor-pointer transition-opacity hover:opacity-90"
                                          style={{
                                            top: `${pos.top}px`,
                                            height: `${pos.height}px`,
                                            backgroundColor: blockColor.bg,
                                            borderLeft: `3px solid ${blockColor.border}`,
                                            zIndex: 1,
                                          }}
                                        >
                                          <p
                                            className="text-xs font-semibold truncate leading-tight"
                                            style={{ color: blockColor.text }}
                                          >
                                            {lesson.courseName ||
                                              t(
                                                "tutorDashboard.schedule.lessonLabel",
                                              )}
                                          </p>
                                          {pos.height > 36 && (
                                            <p
                                              className="text-xs truncate leading-tight mt-0.5"
                                              style={{
                                                color: blockColor.text,
                                                opacity: 0.8,
                                              }}
                                            >
                                              {lesson.studentName ||
                                                lesson.sessionTitle}
                                            </p>
                                          )}
                                          {pos.height > 52 && (
                                            <p
                                              className="text-xs truncate leading-tight mt-0.5"
                                              style={{
                                                color: blockColor.text,
                                                opacity: 0.7,
                                              }}
                                            >
                                              {formatLessonTime(
                                                lesson.startTime,
                                              )}{" "}
                                              —{" "}
                                              {formatLessonTime(lesson.endTime)}
                                            </p>
                                          )}
                                        </div>
                                      </Tooltip>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div
                      className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t"
                      style={{ borderColor: colors.border.light }}
                    >
                      {[
                        "Scheduled",
                        "InProgress",
                        "Completed",
                        "Cancelled",
                      ].map((status) => (
                        <div key={status} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{
                              backgroundColor:
                                getLessonBlockColor(status).border,
                            }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {getLessonStatusLabel(status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Today's Lessons Sidebar */}
              <div className="lg:col-span-1">
                <Card
                  shadow="none"
                  className="border-none lg:sticky lg:top-40"
                  style={{ backgroundColor: colors.background.light }}
                >
                  <CardBody className="p-4">
                    <h3
                      className="text-base font-semibold mb-4 flex items-center gap-2"
                      style={{ color: colors.text.primary }}
                    >
                      <CalendarDots
                        weight="duotone"
                        className="w-5 h-5"
                        style={{ color: colors.primary.main }}
                      />
                      {t("tutorDashboard.schedule.todayLessons")}
                      {todayLessons.length > 0 && (
                        <Chip size="sm" variant="flat" color="primary">
                          {todayLessons.length}
                        </Chip>
                      )}
                    </h3>

                    {todayLessons.length === 0 ? (
                      <div className="text-center py-6">
                        <img
                          src={calendarIllustration}
                          alt="No lessons today"
                          className="w-32 h-32 mx-auto object-contain mb-2"
                        />
                        <p
                          className="text-sm"
                          style={{ color: colors.text.tertiary }}
                        >
                          {t("tutorDashboard.schedule.noLessonsToday")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todayLessons.map((lesson) => {
                          const blockColor = getLessonBlockColor(lesson.status);
                          const startDate = new Date(lesson.startTime);
                          const endDate = new Date(lesson.endTime);
                          const durationMin = Math.round(
                            (endDate - startDate) / 60000,
                          );
                          return (
                            <div
                              key={lesson.id}
                              className="p-3 rounded-xl"
                              style={{
                                backgroundColor: colors.background.gray,
                                borderLeft: `3px solid ${blockColor.border}`,
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{
                                    backgroundColor: blockColor.bg,
                                  }}
                                >
                                  <User
                                    weight="fill"
                                    className="w-4 h-4"
                                    style={{ color: blockColor.border }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="font-semibold text-sm truncate"
                                    style={{ color: colors.text.primary }}
                                  >
                                    {lesson.studentName ||
                                      lesson.courseName ||
                                      t("tutorDashboard.schedule.lessonLabel")}
                                  </p>
                                  <p
                                    className="text-xs truncate mt-0.5"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    {lesson.courseName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span
                                      className="text-xs flex items-center gap-1"
                                      style={{ color: colors.text.tertiary }}
                                    >
                                      <Clock
                                        weight="duotone"
                                        className="w-3 h-3"
                                      />
                                      {new Date(
                                        lesson.startTime,
                                      ).toLocaleDateString(dateLocale, {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                      })}
                                      {" · "}
                                      {formatLessonTime(
                                        lesson.startTime,
                                      )} — {formatLessonTime(lesson.endTime)}
                                    </span>
                                    <Chip
                                      size="sm"
                                      className="h-5"
                                      style={{
                                        backgroundColor: `${blockColor.border}20`,
                                        color: blockColor.border,
                                        fontSize: "10px",
                                      }}
                                    >
                                      {durationMin}m
                                    </Chip>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="mt-2 w-full"
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
                                {t("tutorDashboard.schedule.joinLesson")}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Upcoming count */}
                    {upcomingLessons.length > 0 && (
                      <div
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: colors.border.light }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("tutorDashboard.schedule.upcomingLessons")}
                          </span>
                          <Chip size="sm" variant="flat">
                            {upcomingLessons.length}
                          </Chip>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
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
    </div>
  );
};

export default Schedule;
