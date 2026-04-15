import { useState, useEffect, useCallback, useMemo } from "react";
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
  Avatar,
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
  VideoCamera,
  CaretLeft,
  CaretRight,
  Record,
  Play,
  ChalkboardTeacher,
  BookOpen,
  Timer,
  Circle,
} from "@phosphor-icons/react";
import calendarIllustration from "../../../assets/illustrations/calendar.avif";

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

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("upcoming");

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
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
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

  const formatRecordDuration = (seconds) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m ${seconds % 60}s`;
  };

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

  const pastLessons = useMemo(
    () =>
      lessons
        .filter(
          (l) =>
            new Date(l.endTime) < now &&
            new Date(l.startTime).toDateString() !== todayStr,
        )
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)),
    [lessons, todayStr],
  );

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

  const getMeetingStatusInfo = (lesson) => {
    if (lesson.meetingStatus === "waiting")
      return {
        label: t("studentDashboard.schedule.meetingWaiting"),
        color: colors.state.warning,
      };
    if (lesson.meetingStatus === "Ended")
      return {
        label: t("studentDashboard.schedule.meetingEnded"),
        color: colors.state.success,
      };
    return null;
  };

  const canJoin = (lesson) =>
    lesson.status === "Scheduled" || lesson.status === "InProgress";

  const tutorFullName = (lesson) =>
    [lesson.tutorFirstName, lesson.tutorLastName].filter(Boolean).join(" ");

  // Stats
  const stats = useMemo(
    () => ({
      today: todayLessons.length,
      upcoming: upcomingLessons.length,
      completed: lessons.filter((l) => l.status === "Completed").length,
      total: lessons.length,
    }),
    [lessons, todayLessons, upcomingLessons],
  );

  const renderLessonCard = (lesson, highlight = false) => {
    const meetingInfo = getMeetingStatusInfo(lesson);
    const hasRecording = lesson.lessonRecord?.recordUrl;

    return (
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4">
            <div className="flex flex-col gap-3">
              {/* Top row: date block + course info + status */}
              <div className="flex items-start gap-4">
                {/* Date block */}
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: highlight
                      ? colors.background.primaryLight
                      : colors.background.gray,
                  }}
                >
                  <span
                    className="text-[10px] font-medium uppercase"
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
                    className="text-lg font-bold leading-tight"
                    style={{
                      color: highlight
                        ? colors.primary.main
                        : colors.text.primary,
                    }}
                  >
                    {new Date(lesson.startTime).getDate()}
                  </span>
                </div>

                {/* Course info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-[15px] mb-0.5 truncate"
                    style={{ color: colors.text.primary }}
                  >
                    {lesson.courseTitle ||
                      t("studentDashboard.schedule.lesson")}
                  </h3>
                  {lesson.sessionTitle && (
                    <p
                      className="text-sm truncate mb-1.5"
                      style={{ color: colors.text.secondary }}
                    >
                      {lesson.sessionTitle}
                    </p>
                  )}

                  {/* Tutor info row */}
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={withCDN(lesson.tutorAvatar)}
                      name={tutorFullName(lesson)}
                      size="sm"
                      className="w-6 h-6 text-[10px]"
                    />
                    <span
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {tutorFullName(lesson) ||
                        t("studentDashboard.schedule.tutor")}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
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
                  {meetingInfo && (
                    <span
                      className="text-[11px] flex items-center gap-1"
                      style={{ color: meetingInfo.color }}
                    >
                      <Circle weight="fill" className="w-2 h-2" />
                      {meetingInfo.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom row: time + actions */}
              <div
                className="flex items-center justify-between pt-2 border-t"
                style={{ borderColor: colors.border.light }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={
                      <Clock weight="duotone" className="w-3 h-3" />
                    }
                    style={{
                      backgroundColor: colors.background.gray,
                      color: colors.text.secondary,
                    }}
                  >
                    {formatTime(lesson.startTime)} —{" "}
                    {formatTime(lesson.endTime)}
                  </Chip>
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={
                      <Timer weight="duotone" className="w-3 h-3" />
                    }
                    style={{
                      backgroundColor: colors.background.gray,
                      color: colors.text.secondary,
                    }}
                  >
                    {formatDuration(lesson.startTime, lesson.endTime)}
                  </Chip>
                </div>

                <div className="flex items-center gap-2">
                  {hasRecording && (
                    <Tooltip
                      content={t("studentDashboard.schedule.watchRecording")}
                    >
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        style={{
                          backgroundColor: `${colors.state.success}15`,
                          color: colors.state.success,
                        }}
                        onPress={() =>
                          window.open(lesson.lessonRecord.recordUrl, "_blank")
                        }
                      >
                        <Play weight="fill" className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  )}
                  {canJoin(lesson) && (
                    <Button
                      size="sm"
                      style={{
                        backgroundColor: colors.primary.main,
                        color: colors.text.white,
                      }}
                      startContent={
                        <VideoCamera weight="fill" className="w-4 h-4" />
                      }
                      onPress={() => navigate(`/meeting/${lesson.id}`)}
                    >
                      {t("studentDashboard.schedule.joinNow")}
                    </Button>
                  )}
                </div>
              </div>

              {/* Recording info bar */}
              {hasRecording && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: `${colors.state.success}10` }}
                >
                  <Record
                    weight="fill"
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: colors.state.success }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.state.success }}
                  >
                    {t("studentDashboard.schedule.recordingAvailable")}
                    {lesson.lessonRecord.durationSeconds > 0 &&
                      ` · ${formatRecordDuration(lesson.lessonRecord.durationSeconds)}`}
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  };

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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          {
            label: t("studentDashboard.schedule.todayLessons"),
            value: stats.today,
            color: colors.primary.main,
            icon: CalendarDots,
          },
          {
            label: t("studentDashboard.schedule.upcomingLessons"),
            value: stats.upcoming,
            color: colors.state.warning,
            icon: Clock,
          },
          {
            label: t("studentDashboard.schedule.completed"),
            value: stats.completed,
            color: colors.state.success,
            icon: BookOpen,
          },
          {
            label: t("studentDashboard.schedule.totalLessons"),
            value: stats.total,
            color: colors.text.secondary,
            icon: ChalkboardTeacher,
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon
                    weight="duotone"
                    className="w-5 h-5"
                    style={{ color: stat.color }}
                  />
                </div>
                <div>
                  <p
                    className="text-xl font-bold"
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
              {weekDays.map((day, index) => {
                const dayIsToday = isToday(day);
                const dayHasLessons = hasLessonsOnDay(day);
                const dayLessonCount = lessons.filter(
                  (l) =>
                    new Date(l.startTime).toDateString() === day.toDateString(),
                ).length;

                return (
                  <button
                    key={index}
                    className="p-3 rounded-xl text-center transition-all"
                    style={{
                      backgroundColor: dayIsToday
                        ? colors.background.primaryLight
                        : dayHasLessons
                          ? colors.background.gray
                          : "transparent",
                      boxShadow: dayIsToday
                        ? `inset 0 0 0 2px ${colors.primary.main}`
                        : "none",
                    }}
                    onClick={() => setCurrentDate(day)}
                  >
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: colors.text.secondary }}
                    >
                      {day.toLocaleDateString(dateLocale, {
                        weekday: "short",
                      })}
                    </p>
                    <p
                      className="text-lg font-semibold"
                      style={{
                        color: dayIsToday
                          ? colors.primary.main
                          : colors.text.primary,
                      }}
                    >
                      {day.getDate()}
                    </p>
                    {dayHasLessons && (
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {Array.from(
                          { length: Math.min(dayLessonCount, 3) },
                          (_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: colors.primary.main,
                              }}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
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
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
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
          {/* View mode tabs */}
          <Tabs
            selectedKey={viewMode}
            onSelectionChange={setViewMode}
            color="primary"
            classNames={{ tabList: "gap-2", tab: "px-4" }}
          >
            <Tab
              key="upcoming"
              title={
                <div className="flex items-center gap-2">
                  <Clock weight="duotone" className="w-4 h-4" />
                  <span>{t("studentDashboard.schedule.upcomingTab")}</span>
                  {todayLessons.length + upcomingLessons.length > 0 && (
                    <Chip size="sm" variant="flat">
                      {todayLessons.length + upcomingLessons.length}
                    </Chip>
                  )}
                </div>
              }
            />
            <Tab
              key="past"
              title={
                <div className="flex items-center gap-2">
                  <BookOpen weight="duotone" className="w-4 h-4" />
                  <span>{t("studentDashboard.schedule.pastTab")}</span>
                  {pastLessons.length > 0 && (
                    <Chip size="sm" variant="flat">
                      {pastLessons.length}
                    </Chip>
                  )}
                </div>
              }
            />
          </Tabs>

          {viewMode === "upcoming" ? (
            <>
              {/* Today's Lessons */}
              {todayLessons.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <h2
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: colors.text.primary }}
                  >
                    <CalendarDots
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.primary.main }}
                    />
                    {t("studentDashboard.schedule.todayLessons")}
                    <Chip size="sm" variant="flat" color="primary">
                      {todayLessons.length}
                    </Chip>
                  </h2>
                  <div className="space-y-3">
                    {todayLessons.map((lesson) =>
                      renderLessonCard(lesson, true),
                    )}
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
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    style={{ color: colors.text.primary }}
                  >
                    <Clock
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.state.warning }}
                    />
                    {t("studentDashboard.schedule.upcomingLessons")}
                    <Chip size="sm" variant="flat">
                      {upcomingLessons.length}
                    </Chip>
                  </h2>
                  <div className="space-y-3">
                    {upcomingLessons.map((lesson) => renderLessonCard(lesson))}
                  </div>
                </motion.div>
              )}

              {todayLessons.length === 0 && upcomingLessons.length === 0 && (
                <div className="flex flex-col items-center py-8 gap-3">
                  <img
                    src={calendarIllustration}
                    alt="No upcoming"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-40 h-40 object-contain"
                  />
                  <p style={{ color: colors.text.tertiary }}>
                    {t("studentDashboard.schedule.noUpcoming")}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Past Lessons */}
              {pastLessons.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="space-y-3">
                    {pastLessons.map((lesson) => renderLessonCard(lesson))}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center py-8 gap-3">
                  <img
                    src={calendarIllustration}
                    alt="No past"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-40 h-40 object-contain"
                  />
                  <p style={{ color: colors.text.tertiary }}>
                    {t("studentDashboard.schedule.noPast")}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Schedule;
