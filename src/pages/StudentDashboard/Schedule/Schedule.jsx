import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../../store";
import { studentApi } from "../../../api";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  CalendarDots,
  Clock,
  VideoCamera,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import calendarIllustration from "../../../assets/illustrations/calendar.avif";

const Schedule = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { selectClassNames } = useInputStyles();
  const user = useSelector(selectUser);

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchLessons = useCallback(async () => {
    if (!user?.studentId) return;
    try {
      setLoading(true);
      const params = {
        StudentId: user.studentId,
        "page-size": 200,
      };
      if (statusFilter !== "all") params.Status = statusFilter;
      const res = await studentApi.getLessons(params);
      setLessons(res?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.studentId, statusFilter]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays();

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  const hasLessonsOnDay = (date) =>
    lessons.some(
      (l) => new Date(l.startTime).toDateString() === date.toDateString(),
    );

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return "";
    const ms = new Date(end) - new Date(start);
    const mins = Math.round(ms / 60000);
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m`;
  };

  // TODO: restore date filter after testing
  const todayLessons = [...lessons].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime),
  );

  const upcomingLessons = lessons
    .filter((l) => new Date(l.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const getStatusColor = (status) => {
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

  const getStatusLabel = (status) => {
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

  const renderLessonCard = (lesson, highlight = false) => (
    <Card
      key={lesson.id}
      shadow="none"
      className="border-none"
      style={{ backgroundColor: colors.background.light }}
    >
      <CardBody className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: highlight
                  ? colors.background.primaryLight
                  : colors.background.gray,
              }}
            >
              <span
                className="text-xs"
                style={{
                  color: highlight
                    ? colors.primary.main
                    : colors.text.secondary,
                }}
              >
                {new Date(lesson.startTime).toLocaleDateString(dateLocale, {
                  weekday: "short",
                })}
              </span>
              <span
                className="text-lg font-bold"
                style={{
                  color: highlight ? colors.primary.main : colors.text.primary,
                }}
              >
                {new Date(lesson.startTime).getDate()}
              </span>
            </div>

            <div>
              <h3
                className="font-semibold mb-1"
                style={{ color: colors.text.primary }}
              >
                {lesson.courseName || t("studentDashboard.schedule.lesson")}
              </h3>
              {lesson.sessionTitle && (
                <p
                  className="text-sm mb-1"
                  style={{ color: colors.text.secondary }}
                >
                  {lesson.sessionTitle}
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <Chip
                  size="sm"
                  variant="flat"
                  startContent={<Clock weight="duotone" className="w-3 h-3" />}
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.secondary,
                  }}
                >
                  {formatTime(lesson.startTime)} — {formatTime(lesson.endTime)}
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  style={{
                    backgroundColor: `${getStatusColor(lesson.status)}20`,
                    color: getStatusColor(lesson.status),
                  }}
                >
                  {getStatusLabel(lesson.status)}
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
            startContent={<VideoCamera weight="fill" className="w-4 h-4" />}
            onPress={() => navigate(`/meeting/${lesson.id}`)}
          >
            {t("studentDashboard.schedule.joinNow")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            {t("studentDashboard.schedule.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("studentDashboard.schedule.subtitle")}
          </p>
        </div>
        <Select
          label={t("studentDashboard.schedule.filterStatus")}
          selectedKeys={[statusFilter]}
          classNames={selectClassNames}
          className="max-w-[180px]"
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0];
            if (val) setStatusFilter(val);
          }}
        >
          <SelectItem key="all">
            {t("studentDashboard.schedule.all")}
          </SelectItem>
          <SelectItem key="Scheduled">
            {t("studentDashboard.schedule.scheduled")}
          </SelectItem>
          <SelectItem key="Completed">
            {t("studentDashboard.schedule.completed")}
          </SelectItem>
          <SelectItem key="Cancelled">
            {t("studentDashboard.schedule.cancelled")}
          </SelectItem>
        </Select>
      </motion.div>

      {/* Calendar Navigation */}
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
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {currentDate.toLocaleDateString(dateLocale, {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => navigateWeek(-1)}
                >
                  <CaretLeft
                    weight="bold"
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                </Button>
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => setCurrentDate(new Date())}
                >
                  {t("studentDashboard.schedule.today")}
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => navigateWeek(1)}
                >
                  <CaretRight
                    weight="bold"
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-xl text-center transition-all ${
                    isToday(day) ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: isToday(day)
                      ? colors.background.primaryLight
                      : hasLessonsOnDay(day)
                        ? colors.background.gray
                        : "transparent",
                    ringColor: colors.primary.main,
                  }}
                  onClick={() => setCurrentDate(day)}
                >
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: colors.text.secondary }}
                  >
                    {day.toLocaleDateString(dateLocale, { weekday: "short" })}
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{
                      color: isToday(day)
                        ? colors.primary.main
                        : colors.text.primary,
                    }}
                  >
                    {day.getDate()}
                  </p>
                  {hasLessonsOnDay(day) && (
                    <div
                      className="w-2 h-2 rounded-full mx-auto mt-1"
                      style={{ backgroundColor: colors.primary.main }}
                    />
                  )}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : lessons.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col items-center justify-center gap-4 py-8"
        >
          <img
            src={calendarIllustration}
            alt="No lessons"
            className="w-52 h-52 object-contain"
          />
          <h3
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            {t("studentDashboard.schedule.noLessons")}
          </h3>
          <p
            className="text-center max-w-sm"
            style={{ color: colors.text.secondary }}
          >
            {t("studentDashboard.schedule.noLessonsDesc")}
          </p>
        </motion.div>
      ) : (
        <>
          {/* Today's Lessons */}
          {todayLessons.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: colors.text.primary }}
              >
                <CalendarDots
                  weight="duotone"
                  className="w-5 h-5 inline-block mr-2"
                  style={{ color: colors.primary.main }}
                />
                {t("studentDashboard.schedule.todayLessons")} (
                {todayLessons.length})
              </h2>
              <div className="space-y-3">
                {todayLessons.map((lesson) => renderLessonCard(lesson, true))}
              </div>
            </motion.div>
          )}

          {/* Upcoming Lessons */}
          {upcomingLessons.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: colors.text.primary }}
              >
                <Clock
                  weight="duotone"
                  className="w-5 h-5 inline-block mr-2"
                  style={{ color: colors.state.warning }}
                />
                {t("studentDashboard.schedule.upcomingLessons")} (
                {upcomingLessons.length})
              </h2>
              <div className="space-y-3">
                {upcomingLessons.map((lesson) => renderLessonCard(lesson))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Schedule;
