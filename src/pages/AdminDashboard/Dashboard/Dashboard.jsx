import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Spinner,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi, coursesApi } from "../../../api";
import {
  Users,
  ChalkboardTeacher,
  BookOpen,
  CurrencyDollar,
  ArrowRight,
  ShoppingCart,
  Star,
  CalendarBlank,
  ArrowSquareOut,
  Wallet,
  Receipt,
  CaretDown,
  CaretUp,
  CheckCircle,
} from "@phosphor-icons/react";

// ---- helpers ----
const toApiDate = (dateStr) => `${dateStr}T00:00:00Z`;

const getDefaultRange = (daysBack = 29) => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - daysBack);
  const fmt = (d) => d.toISOString().split("T")[0];
  return { from: fmt(from), to: fmt(to) };
};

const formatVND = (v) =>
  Math.round(v || 0).toLocaleString("vi-VN") + " ₫";

const Dashboard = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();

  // ---- Summary ----
  const def = getDefaultRange(29);
  const [fromDate, setFromDate] = useState(def.from);
  const [toDate, setToDate] = useState(def.to);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const { isOpen: isDailyOpen, onOpen: onDailyOpen, onClose: onDailyClose } =
    useDisclosure();

  // ---- Pending Approvals ----
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingCoursesCount, setPendingCoursesCount] = useState(0);
  const [courseDetails, setCourseDetails] = useState({});
  const [pendingTutors, setPendingTutors] = useState([]);
  const [pendingTutorsCount, setPendingTutorsCount] = useState(0);
  const [tutorDetails, setTutorDetails] = useState({});

  // ---- Feeds ----
  const [feedsLoading, setFeedsLoading] = useState(true);
  const [feeds, setFeeds] = useState(null);
  const [studentMap, setStudentMap] = useState({});

  // ---- Salary ----
  const now = new Date();
  const [salaryYear, setSalaryYear] = useState(now.getFullYear());
  const [salaryMonth, setSalaryMonth] = useState(now.getMonth() + 1);
  const [salaryYearInput, setSalaryYearInput] = useState(now.getFullYear());
  const [salaryMonthInput, setSalaryMonthInput] = useState(now.getMonth() + 1);
  const [salaryLoading, setSalaryLoading] = useState(true);
  const [salary, setSalary] = useState(null);
  const [expandedTutors, setExpandedTutors] = useState(new Set());

  // ---- Fetch Summary ----
  const applyDateRange = useCallback(async (from, to) => {
    setSummaryLoading(true);
    try {
      const res = await adminApi.getDashboardSummary({
        FromDate: toApiDate(from),
        ToDate: toApiDate(to),
      });
      setSummary(res?.data || null);
    } catch (err) {
      console.error("Summary fetch failed:", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    applyDateRange(fromDate, toDate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setQuickRange = (days) => {
    const r = getDefaultRange(days - 1);
    setFromDate(r.from);
    setToDate(r.to);
    applyDateRange(r.from, r.to);
  };

  // ---- Fetch Feeds ----
  useEffect(() => {
    const fetchFeeds = async () => {
      setFeedsLoading(true);
      try {
        const res = await adminApi.getDashboardFeeds({
          RecentOrderLimit: 10,
          TopCourseLimit: 7,
          RecentReviewLimit: 5,
        });
        const data = res?.data || null;
        setFeeds(data);
        if (data) {
          const ids = [
            ...new Set(
              [
                ...(data.recentOrders || []).map((o) => o.studentId),
                ...(data.recentCourseReviews || [])
                  .filter((r) => !r.isAnonymous)
                  .map((r) => r.studentId),
              ].filter(Boolean),
            ),
          ];
          if (ids.length > 0) {
            const results = await Promise.allSettled(
              ids.map((id) => adminApi.getStudentById(id)),
            );
            const map = {};
            results.forEach((r, i) => {
              if (r.status === "fulfilled")
                map[ids[i]] = r.value?.data || r.value;
            });
            setStudentMap(map);
          }
        }
      } catch (err) {
        console.error("Feeds fetch failed:", err);
      } finally {
        setFeedsLoading(false);
      }
    };
    fetchFeeds();
  }, []);

  // ---- Fetch Salary ----
  const fetchSalary = useCallback(async (year, month) => {
    setSalaryLoading(true);
    try {
      const res = await adminApi.getTutorMonthlySalary({ Year: year, Month: month });
      setSalary(res?.data || null);
    } catch (err) {
      console.error("Salary fetch failed:", err);
    } finally {
      setSalaryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalary(salaryYear, salaryMonth);
  }, [fetchSalary, salaryYear, salaryMonth]);

  // ---- Fetch Pending Approvals ----
  useEffect(() => {
    const fetchPending = async () => {
      setPendingLoading(true);
      try {
        const [courseRes, tutorRes] = await Promise.allSettled([
          coursesApi.getCourseVerificationRequests({
            Status: "Pending",
            "page-size": 5,
            page: 1,
          }),
          adminApi.getVerificationRequests({
            Status: "Pending",
            "page-size": 5,
            page: 1,
          }),
        ]);
        if (courseRes.status === "fulfilled") {
          const items = courseRes.value.data?.items || [];
          setPendingCourses(items);
          setPendingCoursesCount(courseRes.value.data?.totalItems || 0);
          const ids = [
            ...new Set(items.map((r) => r.courseId).filter(Boolean)),
          ];
          if (ids.length > 0) {
            const results = await Promise.allSettled(
              ids.map((id) => coursesApi.getCourseById(id)),
            );
            const details = {};
            results.forEach((r, i) => {
              if (r.status === "fulfilled") details[ids[i]] = r.value.data;
            });
            setCourseDetails(details);
          }
        }
        if (tutorRes.status === "fulfilled") {
          const items = tutorRes.value.data?.items || [];
          setPendingTutors(items);
          setPendingTutorsCount(tutorRes.value.data?.totalItems || 0);
          const ids = [
            ...new Set(items.map((r) => r.tutorId).filter(Boolean)),
          ];
          if (ids.length > 0) {
            const results = await Promise.allSettled(
              ids.map((id) => adminApi.getTutorById(id)),
            );
            const details = {};
            results.forEach((r, i) => {
              if (r.status === "fulfilled") details[ids[i]] = r.value.data;
            });
            setTutorDetails(details);
          }
        }
      } finally {
        setPendingLoading(false);
      }
    };
    fetchPending();
  }, []);

  // ---- Helpers ----
  const getStudentName = (studentId) => {
    const s = studentMap[studentId];
    if (!s) return studentId?.slice(0, 8) + "…";
    const u = s.user || s;
    return `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown";
  };
  const getStudentAvatar = (studentId) => {
    const s = studentMap[studentId];
    return s?.avatar || s?.user?.avatar || null;
  };

  const orderStatusColor = (status) => {
    switch (status) {
      case "Paid": return colors.state.success;
      case "Pending": return colors.state.warning;
      case "Cancelled": return colors.state.error;
      default: return colors.text.tertiary;
    }
  };

  const courseStatusColor = (status) => {
    switch (status) {
      case "Published": return colors.state.success;
      case "Pending": return colors.state.warning;
      default: return colors.text.tertiary;
    }
  };

  const toggleTutor = (tutorId) => {
    setExpandedTutors((prev) => {
      const next = new Set(prev);
      next.has(tutorId) ? next.delete(tutorId) : next.add(tutorId);
      return next;
    });
  };

  const totals = summary?.overallTotals;
  const dailyData = summary?.totalsByDate || [];

  const statCards = totals
    ? [
        {
          label: t("adminDashboard.dashboard.totalUsers"),
          value: totals.totalUsers.toLocaleString(),
          icon: Users,
          color: colors.primary.main,
          bg: colors.background.primaryLight,
        },
        {
          label: t("adminDashboard.dashboard.stats.totalStudents"),
          value: totals.totalStudents.toLocaleString(),
          icon: Users,
          color: "#6366f1",
          bg: "#6366f120",
        },
        {
          label: t("adminDashboard.dashboard.stats.totalTutors"),
          value: totals.totalTutors.toLocaleString(),
          icon: ChalkboardTeacher,
          color: colors.state.success,
          bg: `${colors.state.success}20`,
        },
        {
          label: t("adminDashboard.dashboard.totalOrders"),
          value: totals.totalOrders.toLocaleString(),
          icon: ShoppingCart,
          color: colors.state.warning,
          bg: `${colors.state.warning}20`,
        },
        {
          label: t("adminDashboard.dashboard.totalPaidOrders"),
          value: totals.totalPaidOrders.toLocaleString(),
          icon: CheckCircle,
          color: colors.state.success,
          bg: `${colors.state.success}15`,
        },
        {
          label: t("adminDashboard.dashboard.totalPayments"),
          value: totals.totalPayments.toLocaleString(),
          icon: Receipt,
          color: "#8b5cf6",
          bg: "#8b5cf620",
        },
        {
          label: t("adminDashboard.dashboard.stats.revenue"),
          value: formatVND(totals.totalRevenue),
          icon: CurrencyDollar,
          color: colors.state.error,
          bg: `${colors.state.error}20`,
        },
        {
          label: t("adminDashboard.dashboard.totalCommission"),
          value: formatVND(totals.totalCommission),
          icon: Wallet,
          color: "#f59e0b",
          bg: "#f59e0b20",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-1"
          style={{ color: colors.text.primary }}
        >
          {t("adminDashboard.dashboard.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("adminDashboard.dashboard.subtitle")}
        </p>
      </motion.div>

      {/* ── Platform Summary ── */}
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
          <CardBody className="p-5 space-y-4">
            {/* Title + date range controls */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <h2
                className="font-semibold text-lg"
                style={{ color: colors.text.primary }}
              >
                {t("adminDashboard.dashboard.summary")}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {[7, 30, 90].map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    variant="flat"
                    style={{
                      backgroundColor: colors.background.gray,
                      color: colors.text.secondary,
                    }}
                    onPress={() => setQuickRange(d)}
                  >
                    {d === 7
                      ? t("adminDashboard.dashboard.last7Days")
                      : d === 30
                        ? t("adminDashboard.dashboard.last30Days")
                        : t("adminDashboard.dashboard.last90Days")}
                  </Button>
                ))}
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg text-sm border"
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.primary,
                    borderColor: colors.border.light,
                  }}
                />
                <span style={{ color: colors.text.tertiary }}>→</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg text-sm border"
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.primary,
                    borderColor: colors.border.light,
                  }}
                />
                <Button
                  size="sm"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: "#fff",
                  }}
                  onPress={() => applyDateRange(fromDate, toDate)}
                >
                  {t("adminDashboard.dashboard.apply")}
                </Button>
              </div>
            </div>

            {/* 8 stat cards */}
            {summaryLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statCards.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: s.bg }}
                    >
                      <s.icon
                        className="w-5 h-5"
                        weight="duotone"
                        style={{ color: s.color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-lg font-bold truncate"
                        style={{ color: colors.text.primary }}
                      >
                        {s.value}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: colors.text.secondary }}
                      >
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Daily breakdown button */}
            {!summaryLoading && dailyData.length > 0 && (
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="flat"
                  endContent={<CalendarBlank className="w-3.5 h-3.5" />}
                  style={{
                    backgroundColor: colors.background.primaryLight,
                    color: colors.primary.main,
                  }}
                  onPress={onDailyOpen}
                >
                  {t("adminDashboard.dashboard.viewDailyBreakdown")}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* ── Pending Approvals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Verification */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            shadow="none"
            className="border-none h-full"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen
                    className="w-5 h-5"
                    style={{ color: colors.primary.main }}
                  />
                  <h3
                    className="text-base font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {t("adminDashboard.dashboard.courseVerification")}
                  </h3>
                  <span
                    className="px-1.5 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: colors.primary.main + "20",
                      color: colors.primary.main,
                    }}
                  >
                    {pendingCoursesCount}
                  </span>
                </div>
                <Button
                  variant="light"
                  size="sm"
                  endContent={<ArrowRight className="w-3 h-3" />}
                  style={{ color: colors.primary.main }}
                  onPress={() => navigate("/admin/course-verification")}
                >
                  {t("adminDashboard.dashboard.viewAll")}
                </Button>
              </div>
              {pendingLoading ? (
                <div className="flex justify-center py-3">
                  <Spinner size="sm" />
                </div>
              ) : pendingCourses.length === 0 ? (
                <p
                  className="text-xs text-center py-3"
                  style={{ color: colors.text.tertiary }}
                >
                  {t("adminDashboard.dashboard.noPending")}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {pendingCourses.slice(0, 5).map((item) => {
                    const course = courseDetails[item.courseId];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: colors.background.primaryLight,
                          }}
                        >
                          <BookOpen
                            className="w-3.5 h-3.5"
                            style={{ color: colors.primary.main }}
                          />
                        </div>
                        <p
                          className="text-xs flex-1 truncate"
                          style={{ color: colors.text.primary }}
                        >
                          {course?.title || item.courseId}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Tutor Verification */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            shadow="none"
            className="border-none h-full"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChalkboardTeacher
                    className="w-5 h-5"
                    style={{ color: colors.state.success }}
                  />
                  <h3
                    className="text-base font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {t("adminDashboard.dashboard.tutorVerification")}
                  </h3>
                  <span
                    className="px-1.5 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: colors.state.success + "20",
                      color: colors.state.success,
                    }}
                  >
                    {pendingTutorsCount}
                  </span>
                </div>
                <Button
                  variant="light"
                  size="sm"
                  endContent={<ArrowRight className="w-3 h-3" />}
                  style={{ color: colors.primary.main }}
                  onPress={() => navigate("/admin/verification")}
                >
                  {t("adminDashboard.dashboard.viewAll")}
                </Button>
              </div>
              {pendingLoading ? (
                <div className="flex justify-center py-3">
                  <Spinner size="sm" />
                </div>
              ) : pendingTutors.length === 0 ? (
                <p
                  className="text-xs text-center py-3"
                  style={{ color: colors.text.tertiary }}
                >
                  {t("adminDashboard.dashboard.noPending")}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {pendingTutors.slice(0, 5).map((item) => {
                    const tutor = tutorDetails[item.tutorId];
                    const name = tutor?.user
                      ? `${tutor.user.firstName || ""} ${tutor.user.lastName || ""}`.trim()
                      : "";
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <Avatar
                          src={tutor?.avatar || ""}
                          size="sm"
                          className="w-6 h-6 flex-shrink-0"
                        />
                        <p
                          className="text-xs flex-1 truncate"
                          style={{ color: colors.text.primary }}
                        >
                          {name || item.tutorId}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* ── Activity Feeds ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h2
          className="font-semibold text-lg mb-3"
          style={{ color: colors.text.primary }}
        >
          {t("adminDashboard.dashboard.feeds")}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Orders */}
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Receipt
                  weight="duotone"
                  className="w-5 h-5"
                  style={{ color: colors.state.warning }}
                />
                <h3
                  className="font-semibold text-base"
                  style={{ color: colors.text.primary }}
                >
                  {t("adminDashboard.dashboard.recentOrders")}
                </h3>
              </div>
              {feedsLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner size="sm" />
                </div>
              ) : !feeds?.recentOrders?.length ? (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: colors.text.tertiary }}
                >
                  {t("adminDashboard.dashboard.noOrders")}
                </p>
              ) : (
                <div className="space-y-2">
                  {feeds.recentOrders.map((order) => {
                    const sc = orderStatusColor(order.status);
                    return (
                      <div
                        key={order.orderId}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <Avatar
                          name={getStudentName(order.studentId)}
                          src={getStudentAvatar(order.studentId)}
                          size="sm"
                          className="w-7 h-7 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-medium truncate"
                            style={{ color: colors.text.primary }}
                          >
                            {getStudentName(order.studentId)}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: colors.text.tertiary }}
                          >
                            #{order.orderNo} · {formatVND(order.totalAmount)}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          className="h-5 flex-shrink-0"
                          style={{
                            backgroundColor: `${sc}20`,
                            color: sc,
                            fontSize: "10px",
                          }}
                        >
                          {order.status}
                        </Chip>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Top Courses */}
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen
                  weight="duotone"
                  className="w-5 h-5"
                  style={{ color: colors.primary.main }}
                />
                <h3
                  className="font-semibold text-base"
                  style={{ color: colors.text.primary }}
                >
                  {t("adminDashboard.dashboard.topCourses")}
                </h3>
              </div>
              {feedsLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner size="sm" />
                </div>
              ) : !feeds?.topCourses?.length ? (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: colors.text.tertiary }}
                >
                  {t("adminDashboard.dashboard.noCourses")}
                </p>
              ) : (
                <div className="space-y-2">
                  {feeds.topCourses.map((course, idx) => {
                    const sc = courseStatusColor(course.status);
                    return (
                      <div
                        key={course.courseId}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                          style={{
                            backgroundColor: colors.background.primaryLight,
                            color: colors.primary.main,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-medium truncate"
                            style={{ color: colors.text.primary }}
                          >
                            {course.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {course.numberOfEnrollment}{" "}
                              {t("adminDashboard.dashboard.enrollments")} ·{" "}
                              {formatVND(course.price)}
                            </span>
                            <Chip
                              size="sm"
                              className="h-4"
                              style={{
                                backgroundColor: `${sc}20`,
                                color: sc,
                                fontSize: "9px",
                              }}
                            >
                              {course.status}
                            </Chip>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/courses/${course.courseId}`)
                          }
                          title={t("adminDashboard.dashboard.viewDetail")}
                        >
                          <ArrowSquareOut
                            size={14}
                            style={{ color: colors.primary.main }}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recent Reviews */}
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Star
                  weight="duotone"
                  className="w-5 h-5"
                  style={{ color: "#f59e0b" }}
                />
                <h3
                  className="font-semibold text-base"
                  style={{ color: colors.text.primary }}
                >
                  {t("adminDashboard.dashboard.recentReviews")}
                </h3>
              </div>
              {feedsLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner size="sm" />
                </div>
              ) : !feeds?.recentCourseReviews?.length ? (
                <p
                  className="text-xs text-center py-4"
                  style={{ color: colors.text.tertiary }}
                >
                  {t("adminDashboard.dashboard.noReviews")}
                </p>
              ) : (
                <div className="space-y-3">
                  {feeds.recentCourseReviews.map((review) => {
                    const studentName = review.isAnonymous
                      ? t("adminDashboard.dashboard.anonymous")
                      : getStudentName(review.studentId);
                    return (
                      <div
                        key={review.reviewId}
                        className="p-2.5 rounded-lg space-y-1.5"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        {/* Student + course */}
                        <div className="flex items-center gap-2">
                          {!review.isAnonymous && (
                            <Avatar
                              name={studentName}
                              src={getStudentAvatar(review.studentId)}
                              size="sm"
                              className="w-6 h-6 flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-medium truncate"
                              style={{ color: colors.text.primary }}
                            >
                              {studentName}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: colors.text.tertiary }}
                            >
                              {review.courseTitle}
                            </p>
                          </div>
                          {/* Stars */}
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={11}
                                weight="fill"
                                style={{
                                  color:
                                    s <= review.rating
                                      ? "#f59e0b"
                                      : "rgba(0,0,0,0.15)",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        {/* Comment */}
                        {review.comment && (
                          <p
                            className="text-xs leading-relaxed line-clamp-2"
                            style={{ color: colors.text.secondary }}
                          >
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* ── Tutor Monthly Salary ── */}
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
          <CardBody className="p-5 space-y-4">
            {/* Header + month/year picker */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Wallet
                  weight="duotone"
                  className="w-5 h-5"
                  style={{ color: "#f59e0b" }}
                />
                <h2
                  className="font-semibold text-lg"
                  style={{ color: colors.text.primary }}
                >
                  {t("adminDashboard.dashboard.tutorSalary")}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={salaryMonthInput}
                  onChange={(e) => setSalaryMonthInput(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-lg text-sm border"
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.primary,
                    borderColor: colors.border.light,
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {t("adminDashboard.dashboard.month")} {m}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={salaryYearInput}
                  onChange={(e) => setSalaryYearInput(Number(e.target.value))}
                  min={2020}
                  max={2099}
                  className="px-2.5 py-1.5 rounded-lg text-sm border w-24"
                  style={{
                    backgroundColor: colors.background.gray,
                    color: colors.text.primary,
                    borderColor: colors.border.light,
                  }}
                />
                <Button
                  size="sm"
                  style={{ backgroundColor: colors.primary.main, color: "#fff" }}
                  onPress={() => {
                    setSalaryYear(salaryYearInput);
                    setSalaryMonth(salaryMonthInput);
                  }}
                >
                  {t("adminDashboard.dashboard.apply")}
                </Button>
              </div>
            </div>

            {salaryLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : !salary ? (
              <p
                className="text-sm text-center py-6"
                style={{ color: colors.text.tertiary }}
              >
                {t("adminDashboard.dashboard.noSalaryData")}
              </p>
            ) : (
              <>
                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: t("adminDashboard.dashboard.stats.totalTutors"),
                      value: salary.totalTutors,
                      color: colors.state.success,
                      bg: `${colors.state.success}15`,
                      icon: ChalkboardTeacher,
                    },
                    {
                      label: t("adminDashboard.dashboard.scheduledLessons"),
                      value: salary.totalScheduledLessons,
                      color: colors.primary.main,
                      bg: colors.background.primaryLight,
                      icon: CalendarBlank,
                    },
                    {
                      label: t("adminDashboard.dashboard.totalPayout"),
                      value: formatVND(salary.totalPayoutAmount),
                      color: "#f59e0b",
                      bg: "#f59e0b15",
                      icon: Wallet,
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: s.bg }}
                      >
                        <s.icon
                          className="w-4 h-4"
                          weight="duotone"
                          style={{ color: s.color }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-bold text-base truncate"
                          style={{ color: colors.text.primary }}
                        >
                          {s.value}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: colors.text.secondary }}
                        >
                          {s.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Per-tutor list */}
                <div className="space-y-2">
                  {(salary.tutors || []).map((tutor) => {
                    const isExpanded = expandedTutors.has(tutor.tutorId);
                    return (
                      <div
                        key={tutor.tutorId}
                        className="rounded-xl overflow-hidden border"
                        style={{ borderColor: colors.border.light }}
                      >
                        {/* Tutor header row */}
                        <button
                          type="button"
                          className="w-full flex items-center justify-between p-3 text-left"
                          style={{ backgroundColor: colors.background.gray }}
                          onClick={() => toggleTutor(tutor.tutorId)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar
                              name={tutor.tutorName}
                              size="sm"
                              className="w-8 h-8 flex-shrink-0"
                              style={{ backgroundColor: `${colors.primary.main}30` }}
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-semibold truncate"
                                style={{ color: colors.text.primary }}
                              >
                                {tutor.tutorName}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: colors.text.tertiary }}
                              >
                                {tutor.totalScheduledLessons}{" "}
                                {t("adminDashboard.dashboard.scheduledLessons")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span
                              className="text-sm font-bold"
                              style={{ color: "#f59e0b" }}
                            >
                              {formatVND(tutor.totalAmount)}
                            </span>
                            {isExpanded ? (
                              <CaretUp
                                size={15}
                                style={{ color: colors.text.secondary }}
                              />
                            ) : (
                              <CaretDown
                                size={15}
                                style={{ color: colors.text.secondary }}
                              />
                            )}
                          </div>
                        </button>

                        {/* Enrollment breakdown */}
                        {isExpanded && (
                          <div
                            className="p-3"
                            style={{ backgroundColor: colors.background.light }}
                          >
                            <p
                              className="text-xs uppercase tracking-wide font-semibold mb-2"
                              style={{ color: colors.text.tertiary }}
                            >
                              {t("adminDashboard.dashboard.breakdown")}
                            </p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr>
                                    {[
                                      "Course ID",
                                      t("adminDashboard.dashboard.sessionsMonth"),
                                      t("adminDashboard.dashboard.unitPrice"),
                                      t("adminDashboard.dashboard.payout"),
                                    ].map((h) => (
                                      <th
                                        key={h}
                                        className="text-left pb-1.5 pr-3 font-semibold"
                                        style={{ color: colors.text.tertiary }}
                                      >
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {tutor.enrollmentBreakdowns.map((eb) => (
                                    <tr
                                      key={eb.enrollmentId}
                                      className="border-t"
                                      style={{
                                        borderColor: colors.border.light,
                                      }}
                                    >
                                      <td
                                        className="py-1.5 pr-3"
                                        style={{ color: colors.text.secondary }}
                                      >
                                        <button
                                          type="button"
                                          className="flex items-center gap-1 hover:underline"
                                          style={{ color: colors.primary.main }}
                                          onClick={() =>
                                            navigate(
                                              `/admin/courses/${eb.courseId}`,
                                            )
                                          }
                                        >
                                          {eb.courseId.slice(0, 8)}…
                                          <ArrowSquareOut size={11} />
                                        </button>
                                      </td>
                                      <td
                                        className="py-1.5 pr-3"
                                        style={{ color: colors.text.secondary }}
                                      >
                                        {eb.scheduledLessonsInMonth} /{" "}
                                        {eb.numberOfSessions}
                                      </td>
                                      <td
                                        className="py-1.5 pr-3"
                                        style={{ color: colors.text.secondary }}
                                      >
                                        {formatVND(eb.unitPricePerSession)}
                                      </td>
                                      <td
                                        className="py-1.5 font-semibold"
                                        style={{ color: "#f59e0b" }}
                                      >
                                        {formatVND(eb.amount)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* ── Daily Breakdown Modal ── */}
      <Modal
        isOpen={isDailyOpen}
        onClose={onDailyClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("adminDashboard.dashboard.dailyBreakdown")}
          </ModalHeader>
          <ModalBody className="pb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="rounded-lg"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    {[
                      t("adminDashboard.dashboard.date"),
                      t("adminDashboard.dashboard.totalUsers"),
                      t("adminDashboard.dashboard.stats.totalStudents"),
                      t("adminDashboard.dashboard.stats.totalTutors"),
                      t("adminDashboard.dashboard.totalOrders"),
                      t("adminDashboard.dashboard.totalPaidOrders"),
                      t("adminDashboard.dashboard.stats.revenue"),
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-xs font-semibold first:rounded-l-lg last:rounded-r-lg"
                        style={{ color: colors.text.secondary }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map((row) => {
                    const hasActivity =
                      row.totalUsers > 0 ||
                      row.totalOrders > 0 ||
                      row.totalRevenue > 0;
                    return (
                      <tr
                        key={row.date}
                        style={{
                          backgroundColor: hasActivity
                            ? `${colors.primary.main}08`
                            : "transparent",
                        }}
                      >
                        <td
                          className="px-3 py-2 text-xs font-medium"
                          style={{ color: colors.text.secondary }}
                        >
                          {new Date(row.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        {[
                          { v: row.totalUsers, accent: colors.primary.main },
                          { v: row.totalStudents, accent: "#6366f1" },
                          { v: row.totalTutors, accent: colors.state.success },
                          { v: row.totalOrders, accent: colors.state.warning },
                          {
                            v: row.totalPaidOrders,
                            accent: colors.state.success,
                          },
                        ].map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-3 py-2 text-xs"
                            style={{
                              color: cell.v > 0 ? cell.accent : colors.text.tertiary,
                              fontWeight: cell.v > 0 ? 600 : 400,
                            }}
                          >
                            {cell.v}
                          </td>
                        ))}
                        <td
                          className="px-3 py-2 text-xs"
                          style={{
                            color:
                              row.totalRevenue > 0
                                ? colors.state.error
                                : colors.text.tertiary,
                            fontWeight: row.totalRevenue > 0 ? 600 : 400,
                          }}
                        >
                          {row.totalRevenue > 0
                            ? formatVND(row.totalRevenue)
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
