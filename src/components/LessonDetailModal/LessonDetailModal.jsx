import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Avatar,
  useDisclosure,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  CalendarDots,
  Clock,
  VideoCamera,
  Circle,
  Record,
  Play,
  FileText,
  LinkSimple,
  SpinnerGap,
} from "@phosphor-icons/react";
import { coursesApi } from "../../api";
import VideoModal from "../VideoModal/VideoModal";

const CDN_BASE = "https://d20854st1o56hw.cloudfront.net/";
const withCDN = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return CDN_BASE + url;
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

const LessonDetailModal = ({ isOpen, onClose, lesson, role = "tutor" }) => {
  const { t, i18n } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const dateLocale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const isStudentView = role === "student";

  const [lessonExtra, setLessonExtra] = useState(null);
  const [lessonExtraLoading, setLessonExtraLoading] = useState(false);

  const {
    isOpen: isVideoOpen,
    onOpen: onVideoOpen,
    onOpenChange: onVideoOpenChange,
  } = useDisclosure();
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (!lesson || !isOpen) {
      setLessonExtra(null);
      return;
    }
    if (lesson.moduleId || lesson.sessionId) {
      setLessonExtraLoading(true);
      Promise.all([
        lesson.moduleId
          ? coursesApi.getCourseModuleById(lesson.moduleId)
          : null,
        lesson.sessionId
          ? coursesApi.getCourseSessionById(lesson.sessionId)
          : null,
        lesson.sessionId
          ? coursesApi.getAllCourseResources({
              CourseSessionId: lesson.sessionId,
            })
          : null,
      ])
        .then(([moduleRes, sessionRes, resourcesRes]) => {
          setLessonExtra({
            moduleTitle: moduleRes?.data?.title || null,
            sessionDescription: sessionRes?.data?.description || null,
            resources: resourcesRes?.data?.items || resourcesRes?.data || [],
          });
        })
        .catch(() => setLessonExtra(null))
        .finally(() => setLessonExtraLoading(false));
    }
  }, [lesson, isOpen]);

  const formatLessonTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getMeetingStatusInfo = (l) => {
    if (l.meetingStatus === "waiting")
      return {
        label: t("tutorDashboard.schedule.meetingWaiting"),
        color: colors.state.warning,
      };
    if (l.meetingStatus === "Ended")
      return {
        label: t("tutorDashboard.schedule.meetingEnded"),
        color: colors.state.success,
      };
    return null;
  };

  const canJoinLesson = (l) =>
    l.status === "Scheduled" || l.status === "InProgress";

  const studentFullName = (l) =>
    [l.studentFirstName, l.studentLastName].filter(Boolean).join(" ");

  const tutorFullName = (l) =>
    [l.tutorFirstName, l.tutorLastName].filter(Boolean).join(" ");

  const personName = isStudentView
    ? tutorFullName(lesson || {})
    : studentFullName(lesson || {});
  const personAvatar = isStudentView
    ? lesson?.tutorAvatar
    : lesson?.studentAvatar;
  const personLabel = isStudentView
    ? t("studentDashboard.schedule.tutor")
    : t("tutorDashboard.schedule.studentLabel");
  const courseLink = isStudentView
    ? `/student/courses/${lesson?.courseId}`
    : `/tutor/courses/${lesson?.courseId}`;

  if (!lesson) return null;

  const blockColor = getLessonBlockColor(lesson.status);
  const startDate = new Date(lesson.startTime);
  const endDate = new Date(lesson.endTime);
  const durationMin = Math.round((endDate - startDate) / 60000);
  const meetingInfo = getMeetingStatusInfo(lesson);
  const hasRecording = lesson.lessonRecord?.recordUrl;
  const recordDuration = lesson.lessonRecord?.durationSeconds;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <>
            <ModalHeader
              className="flex items-center gap-3 pb-2"
              style={{ color: colors.text.primary }}
            >
              <div
                className="w-1.5 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: blockColor.border }}
              />
              <div className="min-w-0 flex-1">
                {lesson.courseId ? (
                  <Link
                    to={courseLink}
                    className="text-lg font-bold truncate hover:underline block"
                    style={{ color: colors.primary.main }}
                    onClick={onClose}
                  >
                    {lesson.courseTitle ||
                      t("tutorDashboard.schedule.lessonLabel")}
                  </Link>
                ) : (
                  <p className="text-lg font-bold truncate">
                    {lesson.courseTitle ||
                      t("tutorDashboard.schedule.lessonLabel")}
                  </p>
                )}
                {lessonExtra?.moduleTitle && (
                  <p
                    className="text-sm truncate mt-0.5"
                    style={{ color: colors.text.tertiary }}
                  >
                    <span className="font-medium">
                      {t("tutorDashboard.schedule.moduleLabel")}:
                    </span>{" "}
                    {lessonExtra.moduleTitle}
                  </p>
                )}
                {lesson.sessionTitle && (
                  <p
                    className="text-sm truncate"
                    style={{ color: colors.text.tertiary }}
                  >
                    <span className="font-medium">
                      {t("tutorDashboard.schedule.sessionLabel")}:
                    </span>{" "}
                    {lesson.sessionTitle}
                  </p>
                )}
              </div>
              <Chip
                size="sm"
                style={{
                  backgroundColor: `${blockColor.border}20`,
                  color: blockColor.border,
                }}
              >
                {getLessonStatusLabel(lesson.status)}
              </Chip>
            </ModalHeader>
            <ModalBody className="space-y-4 pt-0">
              {/* Person info */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: colors.background.gray }}
              >
                <Avatar
                  src={withCDN(personAvatar)}
                  name={personName}
                  size="md"
                  className="w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {personName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    {personLabel}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <p
                    className="text-[11px] font-medium mb-1"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("tutorDashboard.schedule.dateLabel")}
                  </p>
                  <p
                    className="text-sm font-semibold flex items-center gap-1.5"
                    style={{ color: colors.text.primary }}
                  >
                    <CalendarDots
                      weight="duotone"
                      className="w-4 h-4"
                      style={{ color: colors.primary.main }}
                    />
                    {startDate.toLocaleDateString(dateLocale, {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <p
                    className="text-[11px] font-medium mb-1"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("tutorDashboard.schedule.timeLabel")}
                  </p>
                  <p
                    className="text-sm font-semibold flex items-center gap-1.5"
                    style={{ color: colors.text.primary }}
                  >
                    <Clock
                      weight="duotone"
                      className="w-4 h-4"
                      style={{ color: colors.primary.main }}
                    />
                    {formatLessonTime(lesson.startTime)} —{" "}
                    {formatLessonTime(lesson.endTime)}
                    <Chip
                      size="sm"
                      className="h-5 ml-1"
                      style={{
                        backgroundColor: `${colors.primary.main}15`,
                        color: colors.primary.main,
                        fontSize: "10px",
                      }}
                    >
                      {durationMin}m
                    </Chip>
                  </p>
                </div>
              </div>

              {/* Session Description & Resources */}
              {lessonExtraLoading ? (
                <div className="flex items-center justify-center gap-2 py-2">
                  <SpinnerGap
                    className="w-4 h-4 animate-spin"
                    style={{ color: colors.text.tertiary }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("tutorDashboard.schedule.loadingDetails")}
                  </span>
                </div>
              ) : (
                lessonExtra && (
                  <div className="space-y-3">
                    {lessonExtra.sessionDescription && (
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-xs font-semibold mb-1.5 flex items-center gap-1.5"
                          style={{ color: colors.text.tertiary }}
                        >
                          <FileText weight="duotone" className="w-3.5 h-3.5" />
                          {t("tutorDashboard.schedule.sessionDescription")}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {lessonExtra.sessionDescription}
                        </p>
                      </div>
                    )}

                    {Array.isArray(lessonExtra.resources) &&
                      lessonExtra.resources.length > 0 && (
                        <div
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <p
                            className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                            style={{ color: colors.text.tertiary }}
                          >
                            <LinkSimple
                              weight="duotone"
                              className="w-3.5 h-3.5"
                            />
                            {t("tutorDashboard.schedule.resources")}
                          </p>
                          <div className="space-y-1.5">
                            {lessonExtra.resources.map((r) => (
                              <a
                                key={r.id}
                                href={
                                  r.url?.startsWith("http")
                                    ? r.url
                                    : `${CDN_BASE}${r.url}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm hover:underline"
                                style={{ color: colors.primary.main }}
                              >
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                {r.title || r.resourceTitle || r.resourceUrl}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )
              )}

              {/* Meeting status */}
              {meetingInfo && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl"
                  style={{
                    backgroundColor: `${meetingInfo.color}10`,
                    border: `1px solid ${meetingInfo.color}30`,
                  }}
                >
                  <Circle
                    weight="fill"
                    className="w-2.5 h-2.5"
                    style={{ color: meetingInfo.color }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: meetingInfo.color }}
                  >
                    {meetingInfo.label}
                  </span>
                  {lesson.meetingStartedAt && (
                    <span
                      className="text-xs ml-auto"
                      style={{ color: colors.text.tertiary }}
                    >
                      {new Date(lesson.meetingStartedAt).toLocaleTimeString(
                        dateLocale,
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                      {lesson.meetingEndedAt && (
                        <>
                          {" "}
                          —{" "}
                          {new Date(lesson.meetingEndedAt).toLocaleTimeString(
                            dateLocale,
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </>
                      )}
                    </span>
                  )}
                </div>
              )}

              {/* Recording */}
              {hasRecording && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: `${colors.state.success}10`,
                    border: `1px solid ${colors.state.success}25`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.state.success}20` }}
                  >
                    <Record
                      weight="fill"
                      className="w-4 h-4"
                      style={{ color: colors.state.success }}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      {t("tutorDashboard.schedule.recordingAvailable")}
                    </p>
                    {recordDuration && (
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        {Math.floor(recordDuration / 60)}:
                        {String(recordDuration % 60).padStart(2, "0")} min
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: colors.state.success,
                      color: "#fff",
                    }}
                    startContent={
                      <Play weight="fill" className="w-3.5 h-3.5" />
                    }
                    onPress={() => {
                      setVideoUrl(lesson.lessonRecord.recordUrl);
                      onVideoOpen();
                    }}
                  >
                    {t("tutorDashboard.schedule.watchRecording")}
                  </Button>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                {t("tutorDashboard.schedule.cancel")}
              </Button>
              {canJoinLesson(lesson) && (
                <Button
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  startContent={
                    <VideoCamera weight="fill" className="w-4 h-4" />
                  }
                  onPress={() => {
                    onClose();
                    navigate(`/meeting/${lesson.id}`);
                  }}
                >
                  {t("tutorDashboard.schedule.joinLesson")}
                </Button>
              )}
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <VideoModal
        isOpen={isVideoOpen}
        onOpenChange={onVideoOpenChange}
        videoUrl={videoUrl}
      />
    </>
  );
};

export default LessonDetailModal;
