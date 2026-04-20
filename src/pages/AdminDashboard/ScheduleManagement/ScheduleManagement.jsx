import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
  Tabs,
  Tab,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import useTableStyles from "../../../hooks/useTableStyles";
import { motion } from "framer-motion";
import { studentApi, tutorApi, adminApi } from "../../../api";
import {
  MagnifyingGlass,
  Funnel,
  CalendarDots,
  Clock,
  BookOpen,
  VideoCamera,
  Eye,
  Export,
  CheckCircle,
  XCircle,
  Hourglass,
  CalendarCheck,
} from "@phosphor-icons/react";

const CDN_BASE = "https://d20854st1o56hw.cloudfront.net/";
const withCDN = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return CDN_BASE + url;
};

const ScheduleManagement = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const { tableCardStyle, tableClassNames } = useTableStyles();
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";

  const [activeTab, setActiveTab] = useState("lessons");

  // ─── Lessons state ───
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonSearch, setLessonSearch] = useState("");
  const [debouncedLessonSearch, setDebouncedLessonSearch] = useState("");
  const [lessonStatusFilter, setLessonStatusFilter] = useState("all");
  const [lessonPage, setLessonPage] = useState(1);
  const [lessonTotalPages, setLessonTotalPages] = useState(1);
  const lessonPageSize = 10;

  // Lesson stats
  const [totalLessons, setTotalLessons] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);

  // Lesson detail modal
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
  const [selectedLesson, setSelectedLesson] = useState(null);

  // ─── Tutor Schedules state ───
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [debouncedScheduleSearch, setDebouncedScheduleSearch] = useState("");
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState("all");
  const [schedulePage, setSchedulePage] = useState(1);
  const [scheduleTotalPages, setScheduleTotalPages] = useState(1);
  const schedulePageSize = 10;
  const [tutorMap, setTutorMap] = useState({});

  // Debounce lesson search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLessonSearch(lessonSearch);
      setLessonPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [lessonSearch]);

  // Debounce schedule search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedScheduleSearch(scheduleSearch);
      setSchedulePage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [scheduleSearch]);

  // Fetch lessons
  const fetchLessons = useCallback(async () => {
    setLessonsLoading(true);
    try {
      const params = {
        page: lessonPage,
        "page-size": lessonPageSize,
      };
      if (lessonStatusFilter !== "all") params.Status = lessonStatusFilter;
      if (debouncedLessonSearch) params["search-term"] = debouncedLessonSearch;

      const res = await studentApi.getLessons(params);
      const data = res?.data;
      setLessons(data?.items || []);
      setLessonTotalPages(data?.totalPages || 1);
    } catch {
      setLessons([]);
    } finally {
      setLessonsLoading(false);
    }
  }, [lessonPage, lessonPageSize, lessonStatusFilter, debouncedLessonSearch]);

  useEffect(() => {
    if (activeTab === "lessons") fetchLessons();
  }, [fetchLessons, activeTab]);

  // Fetch lesson stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allRes, scheduledRes, completedRes, cancelledRes] =
          await Promise.all([
            studentApi.getLessons({ "page-size": 1, page: 1 }),
            studentApi.getLessons({
              Status: "Scheduled",
              "page-size": 1,
              page: 1,
            }),
            studentApi.getLessons({
              Status: "Completed",
              "page-size": 1,
              page: 1,
            }),
            studentApi.getLessons({
              Status: "Cancelled",
              "page-size": 1,
              page: 1,
            }),
          ]);
        setTotalLessons(allRes?.data?.totalItems || 0);
        setScheduledCount(scheduledRes?.data?.totalItems || 0);
        setCompletedCount(completedRes?.data?.totalItems || 0);
        setCancelledCount(cancelledRes?.data?.totalItems || 0);
      } catch {
        // stats non-critical
      }
    };
    fetchStats();
  }, []);

  // Fetch tutor schedules
  const fetchSchedules = useCallback(async () => {
    setSchedulesLoading(true);
    try {
      const params = {
        page: schedulePage,
        "page-size": schedulePageSize,
      };
      if (scheduleStatusFilter !== "all") params.Status = scheduleStatusFilter;
      if (debouncedScheduleSearch)
        params["search-term"] = debouncedScheduleSearch;

      const res = await tutorApi.getTutorSchedules(params);
      const data = res?.data;
      const items = data?.items || [];
      setSchedules(items);
      setScheduleTotalPages(data?.totalPages || 1);

      // Fetch tutor details for unique tutorIds
      const uniqueTutorIds = [
        ...new Set(items.map((s) => s.tutorId).filter(Boolean)),
      ];
      const tutorResults = await Promise.allSettled(
        uniqueTutorIds.map((id) => adminApi.getTutorById(id)),
      );
      const map = {};
      tutorResults.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          map[uniqueTutorIds[idx]] = result.value?.data;
        }
      });
      setTutorMap((prev) => ({ ...prev, ...map }));
    } catch {
      setSchedules([]);
    } finally {
      setSchedulesLoading(false);
    }
  }, [
    schedulePage,
    schedulePageSize,
    scheduleStatusFilter,
    debouncedScheduleSearch,
  ]);

  useEffect(() => {
    if (activeTab === "schedules") fetchSchedules();
  }, [fetchSchedules, activeTab]);

  // ─── Helpers ───
  const getLessonStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "primary";
      case "InProgress":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      case "NoStudent":
        return "danger";
      case "NoTutor":
        return "danger";
      default:
        return "default";
    }
  };

  const getScheduleStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "success";
      case "Booked":
        return "primary";
      case "Pending":
        return "warning";
      case "Inactive":
        return "default";
      default:
        return "default";
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "";

  const formatDuration = (startStr, endStr) => {
    if (!startStr || !endStr) return "";
    const mins = Math.round((new Date(endStr) - new Date(startStr)) / 60000);
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const studentFullName = (lesson) =>
    [lesson.studentFirstName, lesson.studentLastName]
      .filter(Boolean)
      .join(" ") || t("adminDashboard.schedule.nA");

  const tutorFullName = (lesson) =>
    [lesson.tutorFirstName, lesson.tutorLastName].filter(Boolean).join(" ") ||
    t("adminDashboard.schedule.nA");

  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
    onDetailOpen();
  };

  // Stats
  const lessonStats = [
    {
      icon: CalendarDots,
      label: t("adminDashboard.schedule.stats.totalLessons"),
      value: totalLessons.toLocaleString(),
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: Hourglass,
      label: t("adminDashboard.schedule.stats.scheduled"),
      value: scheduledCount.toLocaleString(),
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: CheckCircle,
      label: t("adminDashboard.schedule.stats.completed"),
      value: completedCount.toLocaleString(),
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: XCircle,
      label: t("adminDashboard.schedule.stats.cancelled"),
      value: cancelledCount.toLocaleString(),
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold mb-1"
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.schedule.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("adminDashboard.schedule.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Export className="w-4 h-4" />}
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.schedule.export")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {lessonStats.map((stat, index) => (
          <motion.div
            key={index}
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
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bg }}
                  >
                    <stat.icon
                      className="w-5 h-5"
                      weight="duotone"
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
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          color="primary"
          classNames={{ tabList: "gap-2", tab: "px-4" }}
        >
          <Tab
            key="lessons"
            title={
              <div className="flex items-center gap-2">
                <BookOpen weight="duotone" className="w-5 h-5" />
                <span>{t("adminDashboard.schedule.lessonsTab")}</span>
              </div>
            }
          />
          <Tab
            key="schedules"
            title={
              <div className="flex items-center gap-2">
                <CalendarDots weight="duotone" className="w-5 h-5" />
                <span>{t("adminDashboard.schedule.schedulesTab")}</span>
              </div>
            }
          />
        </Tabs>
      </motion.div>

      {/* ════════════ LESSONS TAB ════════════ */}
      {activeTab === "lessons" && (
        <>
          {/* Filters */}
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder={t(
                      "adminDashboard.schedule.searchLessonPlaceholder",
                    )}
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    startContent={
                      <MagnifyingGlass
                        className="w-4 h-4"
                        style={{ color: colors.text.secondary }}
                      />
                    }
                    classNames={inputClassNames}
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="flat"
                          startContent={<Funnel className="w-4 h-4" />}
                        >
                          {t("adminDashboard.schedule.status")}:{" "}
                          {lessonStatusFilter === "all"
                            ? t("adminDashboard.schedule.all")
                            : t(
                                `adminDashboard.schedule.lessonStatuses.${lessonStatusFilter}`,
                              )}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Lesson status filter"
                        onAction={(key) => {
                          setLessonStatusFilter(key);
                          setLessonPage(1);
                        }}
                        selectedKeys={[lessonStatusFilter]}
                        selectionMode="single"
                      >
                        <DropdownItem key="all">
                          {t("adminDashboard.schedule.all")}
                        </DropdownItem>
                        <DropdownItem key="Scheduled">
                          {t(
                            "adminDashboard.schedule.lessonStatuses.Scheduled",
                          )}
                        </DropdownItem>
                        <DropdownItem key="InProgress">
                          {t(
                            "adminDashboard.schedule.lessonStatuses.InProgress",
                          )}
                        </DropdownItem>
                        <DropdownItem key="Completed">
                          {t(
                            "adminDashboard.schedule.lessonStatuses.Completed",
                          )}
                        </DropdownItem>
                        <DropdownItem key="Cancelled">
                          {t(
                            "adminDashboard.schedule.lessonStatuses.Cancelled",
                          )}
                        </DropdownItem>
                        <DropdownItem key="NoStudent">
                          {t(
                            "adminDashboard.schedule.lessonStatuses.NoStudent",
                          )}
                        </DropdownItem>
                        <DropdownItem key="NoTutor">
                          {t("adminDashboard.schedule.lessonStatuses.NoTutor")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Lessons Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card shadow="none" className="border-none" style={tableCardStyle}>
              <CardBody className="p-0">
                <Table
                  aria-label="Lessons table"
                  classNames={tableClassNames}
                  bottomContent={
                    lessonTotalPages > 1 ? (
                      <div className="flex w-full justify-center py-4">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          color="primary"
                          page={lessonPage}
                          total={lessonTotalPages}
                          onChange={(p) => setLessonPage(p)}
                        />
                      </div>
                    ) : null
                  }
                >
                  <TableHeader>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.course")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.tutor")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.student")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.dateTime")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.duration")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.status")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.actions")}
                    </TableColumn>
                  </TableHeader>
                  <TableBody
                    isLoading={lessonsLoading}
                    loadingContent={<Spinner size="lg" />}
                    emptyContent={t("adminDashboard.schedule.noLessons")}
                  >
                    {lessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell>
                          <p
                            className="font-medium text-sm line-clamp-1"
                            style={{ color: colors.text.primary }}
                          >
                            {lesson.courseTitle ||
                              t("adminDashboard.schedule.nA")}
                          </p>
                          {lesson.sessionTitle && (
                            <p
                              className="text-xs line-clamp-1"
                              style={{ color: colors.text.secondary }}
                            >
                              {lesson.sessionTitle}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={withCDN(lesson.tutorAvatar)}
                              size="sm"
                              className="flex-shrink-0"
                            />
                            <p
                              className="text-sm line-clamp-1"
                              style={{ color: colors.text.primary }}
                            >
                              {tutorFullName(lesson)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={withCDN(lesson.studentAvatar)}
                              size="sm"
                              className="flex-shrink-0"
                            />
                            <p
                              className="text-sm line-clamp-1"
                              style={{ color: colors.text.primary }}
                            >
                              {studentFullName(lesson)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p
                            className="text-sm"
                            style={{ color: colors.text.primary }}
                          >
                            {formatDateTime(lesson.startTime)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {formatDuration(lesson.startTime, lesson.endTime)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getLessonStatusColor(lesson.status)}
                            variant="flat"
                          >
                            {t(
                              `adminDashboard.schedule.lessonStatuses.${lesson.status}`,
                            ) || lesson.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onPress={() => handleViewLesson(lesson)}
                          >
                            <Eye
                              className="w-5 h-5"
                              style={{ color: colors.text.secondary }}
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </motion.div>
        </>
      )}

      {/* ════════════ SCHEDULES TAB ════════════ */}
      {activeTab === "schedules" && (
        <>
          {/* Filters */}
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder={t(
                      "adminDashboard.schedule.searchSchedulePlaceholder",
                    )}
                    value={scheduleSearch}
                    onChange={(e) => setScheduleSearch(e.target.value)}
                    startContent={
                      <MagnifyingGlass
                        className="w-4 h-4"
                        style={{ color: colors.text.secondary }}
                      />
                    }
                    classNames={inputClassNames}
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="flat"
                          startContent={<Funnel className="w-4 h-4" />}
                        >
                          {t("adminDashboard.schedule.status")}:{" "}
                          {scheduleStatusFilter === "all"
                            ? t("adminDashboard.schedule.all")
                            : t(
                                `adminDashboard.schedule.scheduleStatuses.${scheduleStatusFilter}`,
                              )}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Schedule status filter"
                        onAction={(key) => {
                          setScheduleStatusFilter(key);
                          setSchedulePage(1);
                        }}
                        selectedKeys={[scheduleStatusFilter]}
                        selectionMode="single"
                      >
                        <DropdownItem key="all">
                          {t("adminDashboard.schedule.all")}
                        </DropdownItem>
                        <DropdownItem key="Open">
                          {t("adminDashboard.schedule.scheduleStatuses.Open")}
                        </DropdownItem>
                        <DropdownItem key="Booked">
                          {t("adminDashboard.schedule.scheduleStatuses.Booked")}
                        </DropdownItem>
                        <DropdownItem key="Pending">
                          {t(
                            "adminDashboard.schedule.scheduleStatuses.Pending",
                          )}
                        </DropdownItem>
                        <DropdownItem key="Inactive">
                          {t(
                            "adminDashboard.schedule.scheduleStatuses.Inactive",
                          )}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Schedules Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card shadow="none" className="border-none" style={tableCardStyle}>
              <CardBody className="p-0">
                <Table
                  aria-label="Tutor schedules table"
                  classNames={tableClassNames}
                  bottomContent={
                    scheduleTotalPages > 1 ? (
                      <div className="flex w-full justify-center py-4">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          color="primary"
                          page={schedulePage}
                          total={scheduleTotalPages}
                          onChange={(p) => setSchedulePage(p)}
                        />
                      </div>
                    ) : null
                  }
                >
                  <TableHeader>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.tutor")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.weekday")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.time")}
                    </TableColumn>
                    <TableColumn>
                      {t("adminDashboard.schedule.table.status")}
                    </TableColumn>
                  </TableHeader>
                  <TableBody
                    isLoading={schedulesLoading}
                    loadingContent={<Spinner size="lg" />}
                    emptyContent={t("adminDashboard.schedule.noSchedules")}
                  >
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={withCDN(tutorMap[schedule.tutorId]?.avatar)}
                              size="sm"
                              className="flex-shrink-0"
                            />
                            <div>
                              <p
                                className="font-medium text-sm"
                                style={{ color: colors.text.primary }}
                              >
                                {[
                                  tutorMap[schedule.tutorId]?.user?.firstName,
                                  tutorMap[schedule.tutorId]?.user?.lastName,
                                ]
                                  .filter(Boolean)
                                  .join(" ") || t("adminDashboard.schedule.nA")}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span style={{ color: colors.text.primary }}>
                            {schedule.weekday
                              ? t(
                                  `adminDashboard.schedule.days.${schedule.weekday.toLowerCase()}`,
                                )
                              : t("adminDashboard.schedule.nA")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock
                              className="w-4 h-4"
                              style={{ color: colors.text.secondary }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: colors.text.primary }}
                            >
                              {formatTime(schedule.startTime)} —{" "}
                              {formatTime(schedule.endTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getScheduleStatusColor(schedule.status)}
                            variant="flat"
                          >
                            {t(
                              `adminDashboard.schedule.scheduleStatuses.${schedule.status}`,
                            ) || schedule.status}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </motion.div>
        </>
      )}

      {/* ════════════ Lesson Detail Modal ════════════ */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="xl">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {() => {
            if (!selectedLesson) return null;
            const lesson = selectedLesson;
            const startDate = new Date(lesson.startTime);
            const endDate = new Date(lesson.endTime);
            const durationMin = Math.round((endDate - startDate) / 60000);

            return (
              <>
                <ModalHeader
                  className="flex items-center gap-2"
                  style={{ color: colors.text.primary }}
                >
                  <BookOpen weight="duotone" className="w-5 h-5" />
                  {t("adminDashboard.schedule.lessonDetail")}
                </ModalHeader>
                <ModalBody className="pb-6">
                  <div className="space-y-5">
                    {/* Course info */}
                    <div
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <p
                        className="font-semibold mb-1"
                        style={{ color: colors.text.primary }}
                      >
                        {lesson.courseTitle || t("adminDashboard.schedule.nA")}
                      </p>
                      {lesson.sessionTitle && (
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {lesson.sessionTitle}
                        </p>
                      )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-xs font-semibold flex items-center gap-1 mb-1"
                          style={{ color: colors.text.secondary }}
                        >
                          <CalendarDots className="w-3.5 h-3.5" />
                          {t("adminDashboard.schedule.detail.date")}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {startDate.toLocaleDateString(dateLocale, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-xs font-semibold flex items-center gap-1 mb-1"
                          style={{ color: colors.text.secondary }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {t("adminDashboard.schedule.detail.time")}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {startDate.toLocaleTimeString(dateLocale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          —{" "}
                          {endDate.toLocaleTimeString(dateLocale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          ({durationMin}m)
                        </p>
                      </div>
                    </div>

                    {/* Status & Meeting */}
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("adminDashboard.schedule.detail.lessonStatus")}
                        </p>
                        <Chip
                          size="sm"
                          color={getLessonStatusColor(lesson.status)}
                          variant="flat"
                        >
                          {t(
                            `adminDashboard.schedule.lessonStatuses.${lesson.status}`,
                          ) || lesson.status}
                        </Chip>
                      </div>
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("adminDashboard.schedule.detail.meetingStatus")}
                        </p>
                        <Chip
                          size="sm"
                          color={
                            lesson.meetingStatus === "InProgress"
                              ? "success"
                              : lesson.meetingStatus === "Waiting"
                                ? "warning"
                                : lesson.meetingStatus === "Ended"
                                  ? "primary"
                                  : "default"
                          }
                          variant="flat"
                        >
                          {lesson.meetingStatus ||
                            t("adminDashboard.schedule.nA")}
                        </Chip>
                      </div>
                    </div>

                    {/* Tutor & Student */}
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: colors.background.gray }}
                        onClick={() => {
                          if (lesson.tutorId) {
                            onDetailClose();
                            navigate(`/admin/tutors/${lesson.tutorId}`);
                          }
                        }}
                      >
                        <Avatar src={withCDN(lesson.tutorAvatar)} size="sm" />
                        <div>
                          <p
                            className="text-xs font-semibold"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.schedule.detail.tutor")}
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {tutorFullName(lesson)}
                          </p>
                        </div>
                      </div>
                      <div
                        className="p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: colors.background.gray }}
                        onClick={() => {
                          if (lesson.studentId) {
                            onDetailClose();
                            navigate(`/admin/students/${lesson.studentId}`);
                          }
                        }}
                      >
                        <Avatar src={withCDN(lesson.studentAvatar)} size="sm" />
                        <div>
                          <p
                            className="text-xs font-semibold"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.schedule.detail.student")}
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {studentFullName(lesson)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recording */}
                    {lesson.lessonRecord?.recordUrl && (
                      <div
                        className="p-3 rounded-xl flex items-center gap-3"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <VideoCamera
                          weight="duotone"
                          className="w-5 h-5"
                          style={{ color: colors.primary.main }}
                        />
                        <div className="flex-1">
                          <p
                            className="text-xs font-semibold"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.schedule.detail.recording")}
                          </p>
                          {lesson.lessonRecord.durationSeconds && (
                            <p
                              className="text-sm"
                              style={{ color: colors.text.primary }}
                            >
                              {Math.floor(
                                lesson.lessonRecord.durationSeconds / 60,
                              )}
                              m {lesson.lessonRecord.durationSeconds % 60}s
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Navigate to course */}
                    {lesson.courseId && (
                      <Button
                        variant="flat"
                        className="w-full"
                        startContent={<BookOpen className="w-4 h-4" />}
                        onPress={() => {
                          onDetailClose();
                          navigate(`/admin/courses/${lesson.courseId}`);
                        }}
                        style={{ color: colors.primary.main }}
                      >
                        {t("adminDashboard.schedule.detail.viewCourse")}
                      </Button>
                    )}
                  </div>
                </ModalBody>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;
