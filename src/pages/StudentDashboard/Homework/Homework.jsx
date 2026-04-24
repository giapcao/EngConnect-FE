import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Avatar,
  Progress,
  addToast,
} from "@heroui/react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  Clock,
  CheckCircle,
  FileArrowDown,
  ArrowSquareOut,
  Star,
  Warning,
  PaperPlaneTilt,
  CloudArrowUp,
  X,
  FilePdf,
  FileImage,
  FileZip,
  FileDoc,
  File as FileIcon,
  CaretRight,
  GraduationCap,
  Calendar,
  Target,
  Hourglass,
} from "@phosphor-icons/react";
import { lessonHomeworkApi } from "../../../api";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import toDoIllustration from "../../../assets/illustrations/to-do.avif";
import chillIllustration from "../../../assets/illustrations/chill.avif";

const CDN_BASE = "https://d20854st1o56hw.cloudfront.net/";
const withCDN = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return CDN_BASE + url;
};

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|bmp|svg)$/i;
const PDF_EXT_RE = /\.pdf$/i;
const DOC_EXT_RE = /\.docx?$/i;
const ZIP_EXT_RE = /\.(zip|rar|7z|tar|gz)$/i;

const formatDate = (iso, locale) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFileSize = (bytes) => {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileBaseName = (url) => {
  if (!url) return "";
  const clean = url.split("?")[0];
  const seg = clean.split("/").pop() || "";
  return decodeURIComponent(seg);
};

const getFileTypeIcon = (url, className, style) => {
  const name = getFileBaseName(url || "");
  if (IMAGE_EXT_RE.test(name))
    return <FileImage weight="duotone" className={className} style={style} />;
  if (PDF_EXT_RE.test(name))
    return <FilePdf weight="duotone" className={className} style={style} />;
  if (DOC_EXT_RE.test(name))
    return <FileDoc weight="duotone" className={className} style={style} />;
  if (ZIP_EXT_RE.test(name))
    return <FileZip weight="duotone" className={className} style={style} />;
  return <FileIcon weight="duotone" className={className} style={style} />;
};

const computeDueInfo = (dueAt, t) => {
  if (!dueAt)
    return { label: t("studentDashboard.homework.noDueDate"), tone: "neutral" };
  const due = new Date(dueAt);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffMs < 0)
    return { label: t("studentDashboard.homework.overdue"), tone: "danger" };
  if (diffDays === 0)
    return { label: t("studentDashboard.homework.dueToday"), tone: "danger" };
  if (diffDays === 1)
    return {
      label: t("studentDashboard.homework.dueTomorrow"),
      tone: "warning",
    };
  if (diffDays <= 3)
    return {
      label: `${diffDays} ${t("studentDashboard.homework.daysLeft")}`,
      tone: "warning",
    };
  return {
    label: `${diffDays} ${t("studentDashboard.homework.daysLeft")}`,
    tone: "success",
  };
};

const Homework = () => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const navigate = useNavigate();
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const user = useSelector(selectUser);

  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedHw, setSelectedHw] = useState(null);

  // Submit modal state
  const submitDisclosure = useDisclosure();
  const [submitFile, setSubmitFile] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const detailDisclosure = useDisclosure();

  const fetchHomeworks = useCallback(async () => {
    if (!user?.studentId) return;
    try {
      setLoading(true);
      const params = {
        StudentId: user.studentId,
        "page-size": 100,
      };
      if (searchQuery.trim()) params["search-term"] = searchQuery.trim();
      const res = await lessonHomeworkApi.getHomeworks(params);
      const items = res?.data?.items || [];
      // Never show NotStarted (tutor draft) to student
      setHomeworks(items.filter((h) => h.status !== "NotStarted"));
    } catch (err) {
      console.error("Failed to fetch homeworks:", err);
      setHomeworks([]);
    } finally {
      setLoading(false);
    }
  }, [user?.studentId, searchQuery]);

  useEffect(() => {
    fetchHomeworks();
  }, [fetchHomeworks]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = Date.now();
    let toDo = 0;
    let submitted = 0;
    let scored = 0;
    let overdue = 0;
    for (const h of homeworks) {
      if (h.status === "Assigned") {
        toDo += 1;
        if (h.dueAt && new Date(h.dueAt).getTime() < now) overdue += 1;
      } else if (h.status === "Submitted") submitted += 1;
      else if (h.status === "Scored") scored += 1;
    }
    return { toDo, submitted, scored, overdue };
  }, [homeworks]);

  // ── Filtered view ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const map = {
      assigned: "Assigned",
      submitted: "Submitted",
      scored: "Scored",
    };
    if (selectedTab === "all") return homeworks;
    return homeworks.filter((h) => h.status === map[selectedTab]);
  }, [homeworks, selectedTab]);

  const statusChipProps = useCallback(
    (status) => {
      switch (status) {
        case "Assigned":
          return {
            bg: `${colors.state.warning}20`,
            color: colors.state.warning,
            label: t("studentDashboard.homework.status.assigned"),
          };
        case "Submitted":
          return {
            bg: `${colors.primary.main}20`,
            color: colors.primary.main,
            label: t("studentDashboard.homework.status.submitted"),
          };
        case "Scored":
          return {
            bg: `${colors.state.success}20`,
            color: colors.state.success,
            label: t("studentDashboard.homework.status.scored"),
          };
        default:
          return {
            bg: `${colors.text.tertiary}20`,
            color: colors.text.tertiary,
            label: status,
          };
      }
    },
    [colors, t],
  );

  const openDetail = (hw) => {
    setSelectedHw(hw);
    detailDisclosure.onOpen();
  };

  const openSubmit = (hw) => {
    setSelectedHw(hw);
    setSubmitFile(null);
    setSubmitError("");
    submitDisclosure.onOpen();
  };

  const onFileSelected = (file) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setSubmitError(t("studentDashboard.homework.fileTooLarge"));
      setSubmitFile(null);
      return;
    }
    setSubmitError("");
    setSubmitFile(file);
  };

  const handleSubmit = async () => {
    if (!submitFile) {
      setSubmitError(t("studentDashboard.homework.fileRequired"));
      return;
    }
    try {
      setSubmitting(true);
      await lessonHomeworkApi.submitHomework(selectedHw.id, submitFile);
      addToast({
        title: t("studentDashboard.homework.submitSuccess"),
        color: "success",
        timeout: 3000,
      });
      submitDisclosure.onClose();
      detailDisclosure.onClose();
      fetchHomeworks();
    } catch (err) {
      console.error("Failed to submit homework:", err);
      addToast({
        title: t("studentDashboard.homework.submitError"),
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const chipPropsSelected = useMemo(
    () => (selectedHw ? statusChipProps(selectedHw.status) : null),
    [selectedHw, statusChipProps],
  );

  // ── Small components ──────────────────────────────────────────────────────
  const StatCard = ({ icon: Icon, label, value, accent, alert }) => (
    <Card
      shadow="none"
      style={{ backgroundColor: colors.background.light }}
      className={alert ? "ring-2" : ""}
    >
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: colors.text.tertiary }}
            >
              {label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {value}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accent}15` }}
          >
            <Icon
              weight="duotone"
              className="w-5 h-5"
              style={{ color: accent }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const Breadcrumb = ({ hw, size = "sm", onCourseClick }) => {
    const items = [hw.courseTitle, hw.moduleTitle, hw.sessionTitle].filter(
      Boolean,
    );
    if (items.length === 0) return null;
    const cls = size === "sm" ? "text-xs" : "text-sm";
    return (
      <div
        className={`flex items-center gap-1 flex-wrap ${cls}`}
        style={{ color: colors.text.tertiary }}
      >
        {items.map((item, idx) => (
          <span
            key={`${idx}-${item}`}
            className="flex items-center gap-1 min-w-0"
          >
            {idx > 0 && (
              <CaretRight
                weight="bold"
                className="w-3 h-3 shrink-0 opacity-50"
              />
            )}
            {idx === 0 && onCourseClick ? (
              <button
                type="button"
                onClick={onCourseClick}
                className="truncate hover:underline transition-opacity"
                style={{ color: colors.primary.main }}
              >
                {item}
              </button>
            ) : (
              <span
                className={
                  idx === items.length - 1 ? "font-medium truncate" : "truncate"
                }
                style={
                  idx === items.length - 1
                    ? { color: colors.text.secondary }
                    : undefined
                }
              >
                {item}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {t("studentDashboard.homework.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("studentDashboard.homework.subtitle")}
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <StatCard
          icon={Hourglass}
          label={t("studentDashboard.homework.stats.toDo")}
          value={stats.toDo}
          accent={colors.state.warning}
        />
        <StatCard
          icon={PaperPlaneTilt}
          label={t("studentDashboard.homework.stats.submitted")}
          value={stats.submitted}
          accent={colors.primary.main}
        />
        <StatCard
          icon={CheckCircle}
          label={t("studentDashboard.homework.stats.scored")}
          value={stats.scored}
          accent={colors.state.success}
        />
        <StatCard
          icon={Warning}
          label={t("studentDashboard.homework.stats.overdue")}
          value={stats.overdue}
          accent={colors.state.error}
          alert={stats.overdue > 0}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("studentDashboard.homework.searchPlaceholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <MagnifyingGlass
              className="w-5 h-5"
              style={{ color: colors.text.tertiary }}
            />
          }
          classNames={{ inputWrapper: "shadow-none", ...inputClassNames }}
          className="max-w-xs"
        />
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          variant="light"
          classNames={{ tabList: "gap-2", tab: "px-4" }}
        >
          <Tab key="all" title={t("studentDashboard.homework.filter.all")} />
          <Tab
            key="assigned"
            title={`${t("studentDashboard.homework.filter.assigned")} (${stats.toDo})`}
          />
          <Tab
            key="submitted"
            title={`${t("studentDashboard.homework.filter.submitted")} (${stats.submitted})`}
          />
          <Tab
            key="scored"
            title={`${t("studentDashboard.homework.filter.scored")} (${stats.scored})`}
          />
        </Tabs>
      </motion.div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <img
            src={homeworks.length === 0 ? toDoIllustration : chillIllustration}
            alt="Empty"
            draggable={false}
            className="w-48 h-48 object-contain opacity-90"
          />
          <h3
            className="text-lg font-semibold"
            style={{ color: colors.text.primary }}
          >
            {homeworks.length === 0
              ? t("studentDashboard.homework.empty")
              : t("studentDashboard.homework.emptyFilter")}
          </h3>
          <p
            className="text-sm text-center max-w-sm"
            style={{ color: colors.text.secondary }}
          >
            {homeworks.length === 0
              ? t("studentDashboard.homework.emptyDesc")
              : ""}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {filtered.map((hw) => {
            const chip = statusChipProps(hw.status);
            const due = computeDueInfo(hw.dueAt, t);
            const dueColor =
              due.tone === "danger"
                ? colors.state.error
                : due.tone === "warning"
                  ? colors.state.warning
                  : due.tone === "success"
                    ? colors.state.success
                    : colors.text.tertiary;

            const tutorName = hw.tutor
              ? `${hw.tutor.firstName || ""} ${hw.tutor.lastName || ""}`.trim()
              : null;

            const scorePct =
              hw.status === "Scored" && hw.maxScore
                ? Math.round((hw.score / hw.maxScore) * 100)
                : 0;

            return (
              <Card
                key={hw.id}
                shadow="none"
                isPressable
                onPress={() => openDetail(hw)}
                className="text-left w-full"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-4 space-y-2">
                  {/* chip + due */}
                  <div className="flex items-center justify-between">
                    <Chip
                      size="sm"
                      style={{ backgroundColor: chip.bg, color: chip.color }}
                    >
                      {chip.label}
                    </Chip>
                    <div className="flex items-center gap-1.5">
                      <Clock
                        weight="bold"
                        className="w-3.5 h-3.5"
                        style={{ color: dueColor }}
                      />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: dueColor }}
                      >
                        {due.label}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-semibold text-sm line-clamp-1"
                    style={{ color: colors.text.primary }}
                  >
                    {hw.title ||
                      hw.sessionTitle ||
                      t("studentDashboard.homework.title")}
                  </h3>

                  {/* Breadcrumb */}
                  <Breadcrumb hw={hw} />

                  {/* Bottom row: tutor + action/score */}
                  <div
                    className="flex items-center justify-between gap-2 pt-2 border-t"
                    style={{ borderColor: colors.border.medium }}
                  >
                    {tutorName ? (
                      <div className="flex items-center gap-1.5 min-w-0 pb-1">
                        <Avatar
                          src={withCDN(hw.tutor?.avatar)}
                          name={tutorName}
                          size="sm"
                          className="w-8 h-8 shrink-0 text-[8px]"
                        />
                        <span
                          className="text-xs truncate"
                          style={{ color: colors.text.secondary }}
                        >
                          {tutorName}
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}
                    {hw.status === "Scored" ? (
                      <span
                        className="text-sm font-bold shrink-0"
                        style={{ color: colors.state.success }}
                      >
                        {hw.score}/{hw.maxScore}
                      </span>
                    ) : hw.status === "Assigned" ? (
                      <Button
                        size="sm"
                        startContent={
                          <PaperPlaneTilt weight="bold" className="w-4 h-4" />
                        }
                        onPress={(e) => {
                          e?.stopPropagation?.();
                          openSubmit(hw);
                        }}
                        style={{
                          backgroundColor: colors.primary.main,
                          color: colors.text.white,
                        }}
                      >
                        {t("studentDashboard.homework.submit")}
                      </Button>
                    ) : (
                      <span
                        className="text-xs italic shrink-0"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("studentDashboard.homework.notGraded")}
                      </span>
                    )}
                  </div>

                  {/* Score bar for Scored items */}
                  {hw.status === "Scored" && (
                    <Progress
                      aria-label="Score"
                      value={scorePct}
                      size="sm"
                      color="success"
                    />
                  )}
                </CardBody>
              </Card>
            );
          })}
        </motion.div>
      )}

      {/* ==================== DETAIL MODAL ==================== */}
      <Modal
        isOpen={detailDisclosure.isOpen}
        onClose={detailDisclosure.onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {chipPropsSelected && (
                <Chip
                  size="sm"
                  style={{
                    backgroundColor: chipPropsSelected.bg,
                    color: chipPropsSelected.color,
                  }}
                >
                  {chipPropsSelected.label}
                </Chip>
              )}
              {selectedHw?.dueAt &&
                (() => {
                  const due = computeDueInfo(selectedHw.dueAt, t);
                  const dueColor =
                    due.tone === "danger"
                      ? colors.state.error
                      : due.tone === "warning"
                        ? colors.state.warning
                        : colors.text.tertiary;
                  return (
                    <div
                      className="flex items-center gap-1"
                      style={{ color: dueColor }}
                    >
                      <Clock weight="bold" className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">{due.label}</span>
                    </div>
                  );
                })()}
            </div>
            <span
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              {selectedHw?.title}
            </span>
            {selectedHw && (
              <Breadcrumb
                hw={selectedHw}
                size="md"
                onCourseClick={() => {
                  detailDisclosure.onClose();
                  navigate(`/student/courses/${selectedHw.courseId}`);
                }}
              />
            )}
          </ModalHeader>
          <ModalBody className="space-y-5 pb-2">
            {selectedHw && (
              <>
                {/* Tutor */}
                {selectedHw.tutor && (
                  <button
                    type="button"
                    onClick={() => {
                      detailDisclosure.onClose();
                      navigate(`/tutor-profile/${selectedHw.tutorId}`);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl w-full hover:opacity-80 transition-opacity text-left"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <Avatar src={withCDN(selectedHw.tutor.avatar)} size="md" />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] uppercase tracking-wide font-semibold"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("studentDashboard.homework.yourTutor")}
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {`${selectedHw.tutor.firstName || ""} ${selectedHw.tutor.lastName || ""}`.trim()}
                      </p>
                    </div>
                    <ArrowSquareOut
                      className="w-4 h-4 shrink-0"
                      style={{ color: colors.primary.main }}
                    />
                  </button>
                )}

                {/* Description */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("studentDashboard.homework.description")}
                  </p>
                  <p
                    className="text-sm whitespace-pre-wrap"
                    style={{ color: colors.text.primary }}
                  >
                    {selectedHw.description}
                  </p>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar
                        className="w-3.5 h-3.5"
                        style={{ color: colors.text.tertiary }}
                      />
                      <p
                        className="text-[11px] uppercase tracking-wide font-semibold"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("studentDashboard.homework.dueDate")}
                      </p>
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {formatDate(selectedHw.dueAt, locale) ||
                        t("studentDashboard.homework.noDueDate")}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target
                        className="w-3.5 h-3.5"
                        style={{ color: colors.text.tertiary }}
                      />
                      <p
                        className="text-[11px] uppercase tracking-wide font-semibold"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("studentDashboard.homework.maxScore")}
                      </p>
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedHw.maxScore ?? "—"}
                    </p>
                  </div>
                  {selectedHw.assignedAt && (
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <p
                        className="text-[11px] uppercase tracking-wide font-semibold mb-1"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("studentDashboard.homework.assignedAt")}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {formatDate(selectedHw.assignedAt, locale)}
                      </p>
                    </div>
                  )}
                  {selectedHw.submittedAt && (
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <p
                        className="text-[11px] uppercase tracking-wide font-semibold mb-1"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("studentDashboard.homework.submittedAt")}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {formatDate(selectedHw.submittedAt, locale)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Resource */}
                {selectedHw.resourceUrl && (
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: colors.text.tertiary }}
                    >
                      {t("studentDashboard.homework.resource")}
                    </p>
                    <a
                      href={withCDN(selectedHw.resourceUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: `${colors.primary.main}12` }}
                    >
                      {getFileTypeIcon(
                        selectedHw.resourceUrl,
                        "w-9 h-9 shrink-0",
                        { color: colors.primary.main },
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: colors.primary.main }}
                        >
                          {getFileBaseName(selectedHw.resourceUrl) ||
                            t("studentDashboard.homework.downloadResource")}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.text.tertiary }}
                        >
                          {t("studentDashboard.homework.downloadResource")}
                        </p>
                      </div>
                      <ArrowSquareOut
                        className="w-4 h-4 shrink-0"
                        style={{ color: colors.primary.main }}
                      />
                    </a>
                  </div>
                )}

                {/* Submission */}
                {selectedHw.submissionUrl && (
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: colors.text.tertiary }}
                    >
                      {t("studentDashboard.homework.mySubmission")}
                    </p>
                    {IMAGE_EXT_RE.test(
                      getFileBaseName(selectedHw.submissionUrl),
                    ) ? (
                      <a
                        href={withCDN(selectedHw.submissionUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <img
                          src={withCDN(selectedHw.submissionUrl)}
                          alt="Submission"
                          className="w-full max-h-80 object-contain"
                        />
                        <div className="p-3 flex items-center justify-between">
                          <span
                            className="text-xs truncate"
                            style={{ color: colors.text.secondary }}
                          >
                            {getFileBaseName(selectedHw.submissionUrl)}
                          </span>
                          <FileArrowDown
                            className="w-4 h-4 shrink-0"
                            style={{ color: colors.primary.main }}
                          />
                        </div>
                      </a>
                    ) : (
                      <a
                        href={withCDN(selectedHw.submissionUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: `${colors.state.success}12` }}
                      >
                        {getFileTypeIcon(
                          selectedHw.submissionUrl,
                          "w-9 h-9 shrink-0",
                          { color: colors.state.success },
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold truncate"
                            style={{ color: colors.state.success }}
                          >
                            {getFileBaseName(selectedHw.submissionUrl)}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.tertiary }}
                          >
                            {t("studentDashboard.homework.viewSubmission")}
                          </p>
                        </div>
                        <ArrowSquareOut
                          className="w-4 h-4 shrink-0"
                          style={{ color: colors.state.success }}
                        />
                      </a>
                    )}
                  </div>
                )}

                {/* Score + Feedback */}
                {selectedHw.status === "Scored" && (
                  <div
                    className="p-5 rounded-xl space-y-4"
                    style={{
                      backgroundColor: `${colors.state.success}10`,
                      border: `1px solid ${colors.state.success}30`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${colors.state.success}25`,
                          }}
                        >
                          <GraduationCap
                            weight="fill"
                            className="w-5 h-5"
                            style={{ color: colors.state.success }}
                          />
                        </div>
                        <div>
                          <p
                            className="text-xs uppercase tracking-wide font-semibold"
                            style={{ color: colors.text.tertiary }}
                          >
                            {t("studentDashboard.homework.score")}
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {t("studentDashboard.homework.scoreProgress", {
                              score: selectedHw.score,
                              max: selectedHw.maxScore,
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-3xl font-bold"
                        style={{ color: colors.state.success }}
                      >
                        {selectedHw.score}
                        <span
                          className="text-base font-normal"
                          style={{ color: colors.text.tertiary }}
                        >
                          /{selectedHw.maxScore}
                        </span>
                      </span>
                    </div>
                    <Progress
                      aria-label="Score progress"
                      value={
                        selectedHw.maxScore
                          ? (selectedHw.score / selectedHw.maxScore) * 100
                          : 0
                      }
                      size="md"
                      color="success"
                    />
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("studentDashboard.homework.tutorFeedback")}
                      </p>
                      <p
                        className="text-sm whitespace-pre-wrap"
                        style={{ color: colors.text.primary }}
                      >
                        {selectedHw.tutorFeedback ||
                          t("studentDashboard.homework.noFeedback")}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={detailDisclosure.onClose}>
              {t("studentDashboard.homework.close")}
            </Button>
            {selectedHw?.status === "Assigned" && (
              <Button
                startContent={
                  <PaperPlaneTilt weight="bold" className="w-4 h-4" />
                }
                onPress={() => {
                  detailDisclosure.onClose();
                  openSubmit(selectedHw);
                }}
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.white,
                }}
              >
                {t("studentDashboard.homework.submit")}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ==================== SUBMIT MODAL ==================== */}
      <Modal
        isOpen={submitDisclosure.isOpen}
        onClose={submitDisclosure.onClose}
        size="lg"
        isDismissable={!submitting}
      >
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("studentDashboard.homework.submitModalTitle")}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {selectedHw && (
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <p
                    className="text-xs uppercase tracking-wide font-semibold mb-1"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("studentDashboard.homework.title")}
                  </p>
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: colors.text.primary }}
                  >
                    {selectedHw.title}
                  </p>
                  <Breadcrumb hw={selectedHw} />
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  onFileSelected(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />

              {!submitFile ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      fileInputRef.current?.click();
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    onFileSelected(e.dataTransfer.files?.[0]);
                  }}
                  className="rounded-2xl p-8 text-center cursor-pointer transition-all outline-none focus-visible:ring-2"
                  style={{
                    border: `2px dashed ${isDragging ? colors.primary.main : colors.border.main}`,
                    backgroundColor: isDragging
                      ? `${colors.primary.main}10`
                      : colors.background.gray,
                  }}
                >
                  <CloudArrowUp
                    weight="duotone"
                    className="w-12 h-12 mx-auto mb-3"
                    style={{ color: colors.primary.main }}
                  />
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: colors.text.primary }}
                  >
                    {isDragging
                      ? t("studentDashboard.homework.dropFile")
                      : t("studentDashboard.homework.dragDropHint")}
                  </p>
                  {!isDragging && (
                    <p
                      className="text-sm mb-2"
                      style={{ color: colors.primary.main }}
                    >
                      {t("studentDashboard.homework.browseFile")}
                    </p>
                  )}
                  <p
                    className="text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("studentDashboard.homework.supportedFormats")}
                  </p>
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ backgroundColor: `${colors.primary.main}12` }}
                >
                  {submitFile.type?.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(submitFile)}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                      onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                    />
                  ) : (
                    getFileTypeIcon(submitFile.name, "w-10 h-10 shrink-0", {
                      color: colors.primary.main,
                    })
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs uppercase tracking-wide font-semibold mb-0.5"
                      style={{ color: colors.text.tertiary }}
                    >
                      {t("studentDashboard.homework.fileSelected")}
                    </p>
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: colors.text.primary }}
                    >
                      {submitFile.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.tertiary }}
                    >
                      {formatFileSize(submitFile.size)}
                    </p>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setSubmitFile(null)}
                    isDisabled={submitting}
                    aria-label={t("studentDashboard.homework.removeFile")}
                  >
                    <X weight="bold" className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {submitError && (
                <div
                  className="flex items-center gap-2 p-2.5 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${colors.state.error}15`,
                    color: colors.state.error,
                  }}
                >
                  <Warning weight="fill" className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Re-submission notice */}
              {selectedHw?.submissionUrl && (
                <div
                  className="flex items-start gap-2 p-3 rounded-xl"
                  style={{ backgroundColor: `${colors.state.warning}12` }}
                >
                  <Warning
                    weight="fill"
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: colors.state.warning }}
                  />
                  <p
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("studentDashboard.homework.resubmit")}
                  </p>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={submitDisclosure.onClose}
              isDisabled={submitting}
            >
              {t("studentDashboard.homework.cancel")}
            </Button>
            <Button
              onPress={handleSubmit}
              isLoading={submitting}
              isDisabled={!submitFile}
              startContent={
                !submitting && (
                  <PaperPlaneTilt weight="bold" className="w-4 h-4" />
                )
              }
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
            >
              {submitting
                ? t("studentDashboard.homework.submitting")
                : t("studentDashboard.homework.submitBtn")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Homework;
