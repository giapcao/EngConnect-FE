import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Alert,
  Avatar,
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
  Certificate,
  ArrowLeft,
  PencilSimple,
  CaretDown,
  CaretUp,
  ListNumbers,
  Play,
  WarningCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { coursesApi, tutorApi } from "../../../api";

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

const TutorCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [tutorInfo, setTutorInfo] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const instructorRef = useRef(null);

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
        // All modules start collapsed
      } catch (err) {
        console.error("Failed to fetch course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
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
          onPress={() => navigate("/tutor/my-courses")}
        >
          {t("courses.detail.backToCourses")}
        </Button>
      </div>
    );
  }

  const duration = formatDuration(course.estimatedTimeLesson);
  const allCategories = course.courseCategories || [];
  const outcomes = course.outcomes
    ? course.outcomes
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const statusLower = course.status?.toLowerCase();
  const modules = (course.courseCourseModules || []).sort(
    (a, b) => a.moduleNumber - b.moduleNumber,
  );
  const totalSessions = modules.reduce(
    (sum, m) => sum + (m.courseModuleCourseSessions?.length || 0),
    0,
  );

  // Detect incomplete course
  const isIncomplete = modules.length === 0 || totalSessions === 0;
  const incompleteReason =
    modules.length === 0
      ? t("courses.detail.incompleteNoModules")
      : totalSessions === 0
        ? t("courses.detail.incompleteNoSessions")
        : "";

  // Only Draft and Inactive courses can be edited
  const canEdit = statusLower === "draft" || statusLower === "inactive";

  return (
    <div className="space-y-6">
      {/* Back + Edit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="light"
          startContent={<ArrowLeft size={18} />}
          onPress={() => navigate("/tutor/my-courses")}
          style={{ color: colors.text.secondary }}
        >
          {t("courses.detail.backToCourses")}
        </Button>
        {canEdit ? (
          isIncomplete ? (
            <Button
              color="warning"
              variant="flat"
              startContent={<ArrowRight size={18} />}
              onPress={() => navigate(`/tutor/create-course/${course.id}`)}
            >
              {t("courses.detail.continueCourse")}
            </Button>
          ) : (
            <Button
              color="primary"
              startContent={<PencilSimple size={18} />}
              onPress={() => navigate(`/tutor/create-course/${course.id}`)}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
            >
              {t("tutorDashboard.myCourses.editCourse")}
            </Button>
          )
        ) : null}
      </motion.div>

      {/* Incomplete course alert */}
      {canEdit && isIncomplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Alert
            color="warning"
            variant="flat"
            title={t("courses.detail.incompleteTitle")}
            description={incompleteReason}
          />
        </motion.div>
      )}

      {/* Non-editable status alert */}
      {!canEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Alert
            color={statusLower === "pending" ? "warning" : "primary"}
            variant="flat"
            title={
              statusLower === "pending"
                ? t("courses.detail.pendingEditLocked")
                : t("courses.detail.publishedEditLocked")
            }
          />
        </motion.div>
      )}

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
                  {course.status && (
                    <Chip
                      size="sm"
                      className="font-semibold"
                      style={{
                        backgroundColor:
                          statusLower === "published"
                            ? colors.state.success
                            : colors.state.warning,
                        color: "#fff",
                      }}
                    >
                      {statusLower === "published"
                        ? t("tutorDashboard.myCourses.published")
                        : t("tutorDashboard.myCourses.draft")}
                    </Chip>
                  )}
                  <Chip
                    size="sm"
                    style={{
                      backgroundColor: colors.background.primaryLight,
                      color: colors.primary.main,
                    }}
                  >
                    {course.level}
                  </Chip>
                  {course.isCertificate && (
                    <Chip
                      size="sm"
                      style={{
                        backgroundColor: "#D1FAE5",
                        color: "#059669",
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <Certificate size={14} />{" "}
                        {t("courses.detail.certificate")}
                      </span>
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
                  className="text-base mb-4 leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  {course.shortDescription}
                </p>

                {/* Categories */}
                {allCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {allCategories.map((cat) => (
                      <Chip
                        key={cat.id}
                        size="sm"
                        variant="flat"
                        style={{
                          backgroundColor: colors.background.gray,
                          color: colors.text.secondary,
                        }}
                      >
                        {cat.categoryName}
                      </Chip>
                    ))}
                  </div>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-5 flex-wrap">
                  {course.ratingAverage > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            weight="fill"
                            style={{
                              color:
                                i < Math.floor(course.ratingAverage)
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
                        {course.ratingAverage}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        ({course.ratingCount?.toLocaleString() || 0})
                      </span>
                    </div>
                  )}
                  <span
                    className="text-sm flex items-center gap-1.5"
                    style={{ color: colors.text.secondary }}
                  >
                    <Users size={16} weight="duotone" />
                    {course.numberOfEnrollment?.toLocaleString() || 0}{" "}
                    {t("courses.detail.students")}
                  </span>
                  <span
                    className="text-sm flex items-center gap-1.5"
                    style={{ color: colors.text.secondary }}
                  >
                    <BookOpen size={16} weight="duotone" />
                    {modules.length} {t("courses.detail.modules")} ·{" "}
                    {totalSessions} {t("courses.detail.sessions")}
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

              {/* Empty for sticky card overlap */}
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
          {outcomes.length > 0 && (
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
                  <div className="grid sm:grid-cols-2 gap-3">
                    {outcomes.map((item, index) => (
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
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* ═══ Course Curriculum ═══ */}
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

                {modules.length === 0 ? (
                  <p
                    className="text-sm text-center py-8"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("courses.detail.noModules")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {modules.map((mod, idx) => {
                      const isExpanded = expandedModules[mod.id];
                      const sessions = (
                        mod.courseModuleCourseSessions || []
                      ).sort((a, b) => a.sessionNumber - b.sessionNumber);
                      const moduleOutcomes = mod.moduleOutcomes
                        ? mod.moduleOutcomes
                            .split(";")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : [];

                      return (
                        <div
                          key={mod.id}
                          className="rounded-xl overflow-hidden border"
                          style={{ borderColor: colors.border.light }}
                        >
                          {/* Module header */}
                          <button
                            type="button"
                            className="w-full flex items-center justify-between p-4 text-left"
                            style={{ backgroundColor: colors.background.gray }}
                            onClick={() => toggleModule(mod.id)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: colors.primary.main,
                                  color: colors.text.white,
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

                          {/* Expanded content */}
                          {isExpanded && (
                            <div
                              className="px-4 pb-4 pt-2"
                              style={{
                                backgroundColor: colors.background.light,
                              }}
                            >
                              {/* Module description */}
                              {mod.moduleDescription && (
                                <p
                                  className="text-sm mb-3 leading-relaxed"
                                  style={{ color: colors.text.secondary }}
                                >
                                  {mod.moduleDescription}
                                </p>
                              )}

                              {/* Sessions list */}
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

        {/* Right Column - Sticky Card */}
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
              {/* Thumbnail */}
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
                {/* Price */}
                <div>
                  <span
                    className="text-3xl font-bold"
                    style={{ color: colors.primary.main }}
                  >
                    {formatPrice(course.price, course.currency)}
                  </span>
                </div>

                <Divider />

                {/* Course overview info */}
                <div className="space-y-3">
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
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <ListNumbers size={16} weight="duotone" />
                      {t("courses.detail.modules")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {modules.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <Play size={16} weight="duotone" />
                      {t("courses.detail.sessions")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {totalSessions}
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

export default TutorCourseDetail;
