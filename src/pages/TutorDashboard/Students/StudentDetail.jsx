import { useState, useEffect } from "react";
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
} from "@heroui/react";
import { motion } from "framer-motion";
import { useThemeColors } from "../../../hooks/useThemeColors";
import {
  ArrowLeft,
  EnvelopeSimple,
  BookOpen,
  CalendarDots,
  TrendUp,
} from "@phosphor-icons/react";
import { studentApi, coursesApi } from "../../../api";

const CDN_BASE = "https://d20854st1o56hw.cloudfront.net/";
const withCDN = (url) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return CDN_BASE + url;
};

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

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
        const merged = [
          ...(inProgressRes?.data?.items || []),
          ...(completedRes?.data?.items || []),
        ];
        setEnrollments(merged);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "InProgress":
        return { bg: `${colors.state.warning}20`, text: colors.state.warning };
      case "Completed":
        return { bg: `${colors.state.success}20`, text: colors.state.success };
      default:
        return {
          bg: `${colors.text.tertiary}20`,
          text: colors.text.tertiary,
        };
    }
  };

  const inProgressCount = enrollments.filter(
    (e) => e.status === "InProgress",
  ).length;
  const completedCount = enrollments.filter(
    (e) => e.status === "Completed",
  ).length;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="light"
        startContent={<ArrowLeft size={18} />}
        onPress={() => navigate(-1)}
        style={{ color: colors.text.secondary }}
      >
        {t("common.back")}
      </Button>

      {/* Student info */}
      {loadingStudent ? (
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
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
            <CardBody className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar
                  src={withCDN(student.avatar || student.user?.avatarUrl)}
                  name={`${student.user?.firstName || ""} ${student.user?.lastName || ""}`}
                  className="w-24 h-24 text-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h1
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.text.primary }}
                  >
                    {student.user?.firstName} {student.user?.lastName}
                  </h1>

                  {student.user?.email && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <EnvelopeSimple
                        size={18}
                        style={{ color: colors.primary.main }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {student.user.email}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen
                        size={18}
                        style={{ color: colors.primary.main }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {enrollments.length} {t("studentProfile.totalCourses")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendUp
                        size={18}
                        style={{ color: colors.state.warning }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {inProgressCount} {t("studentProfile.inProgress")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDots
                        size={18}
                        style={{ color: colors.state.success }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
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
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-8 text-center">
            <p style={{ color: colors.text.secondary }}>
              {t("studentProfile.notFound")}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Enrollments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: 0.05 }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          <BookOpen
            size={22}
            weight="duotone"
            className="inline-block mr-2 -mt-0.5"
            style={{ color: colors.primary.main }}
          />
          {t("studentProfile.enrolledCourses")}
        </h2>

        {loadingEnrollments ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-14 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-40 rounded-lg" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6 text-center">
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {t("studentProfile.noEnrollments")}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((enrollment) => {
              const progress =
                enrollment.numsOfSession > 0
                  ? Math.round(
                      (enrollment.numOfCompleteSession /
                        enrollment.numsOfSession) *
                        100,
                    )
                  : 0;
              const statusColor = getStatusColor(enrollment.status);

              return (
                <Card
                  key={enrollment.id}
                  shadow="none"
                  className="border-none cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: colors.background.light }}
                  isPressable
                  onPress={() =>
                    navigate(`/tutor/courses/${enrollment.courseId}`)
                  }
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
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className="font-semibold truncate"
                            style={{ color: colors.text.primary }}
                          >
                            {enrollment.course?.title}
                          </p>
                          <Chip
                            size="sm"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            {enrollment.status === "InProgress"
                              ? t("studentProfile.inProgress")
                              : enrollment.status === "Completed"
                                ? t("studentProfile.completed")
                                : enrollment.status}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="text-xs"
                            style={{ color: colors.text.tertiary }}
                          >
                            {enrollment.numOfCompleteSession}/
                            {enrollment.numsOfSession}{" "}
                            {t("courses.detail.sessionsCompleted")}
                          </span>
                          {enrollment.enrolledAt && (
                            <span
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {new Date(
                                enrollment.enrolledAt,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={progress}
                            size="sm"
                            color={
                              enrollment.status === "Completed"
                                ? "success"
                                : "primary"
                            }
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
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentDetail;
