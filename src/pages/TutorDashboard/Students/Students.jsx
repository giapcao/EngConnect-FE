import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Input,
  Progress,
  Chip,
  Tabs,
  Tab,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { coursesApi } from "../../../api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0 },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
import {
  MagnifyingGlass,
  DotsThree,
  Eye,
  CalendarCheck,
} from "@phosphor-icons/react";

const Students = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const params = { "page-size": 50, page: 1 };
        params.Status =
          selectedTab === "all" ? "InProgress,Completed" : selectedTab;
        if (searchQuery.trim()) params["search-term"] = searchQuery.trim();
        const data = await coursesApi.getMyStudentEnrollments(params);
        setEnrollments(data?.data?.items ?? []);
      } catch {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [selectedTab, searchQuery]);

  const getStatusColor = (status) => {
    if (status === "InProgress") return colors.state.success;
    if (status === "Completed") return colors.primary.main;
    return colors.text.secondary;
  };

  const getStatusLabel = (status) => {
    if (status === "InProgress") return t("tutorDashboard.students.inProgress");
    if (status === "Completed") return t("tutorDashboard.students.completed");
    return status;
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalInProgress = enrollments.filter(
    (e) => e.status === "InProgress",
  ).length;
  const totalCompleted = enrollments.filter(
    (e) => e.status === "Completed",
  ).length;

  const stats = [
    {
      label: t("tutorDashboard.students.totalStudents"),
      value: loading ? "..." : enrollments.length,
      color: colors.primary.main,
    },
    {
      label: t("tutorDashboard.students.activeStudents"),
      value: loading ? "..." : totalInProgress,
      color: colors.state.success,
    },
    {
      label: t("tutorDashboard.students.completedCourses"),
      value: loading ? "..." : totalCompleted,
      color: colors.primary.main,
    },
  ];

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
          {t("tutorDashboard.students.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("tutorDashboard.students.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="grid grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {stat.label}
              </p>
            </CardBody>
          </Card>
        ))}
      </motion.div> */}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("tutorDashboard.students.searchPlaceholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <MagnifyingGlass
              className="w-5 h-5"
              style={{ color: colors.text.tertiary }}
            />
          }
          classNames={{
            inputWrapper: "shadow-none",
          }}
          style={{
            backgroundColor: colors.background.light,
          }}
          className="max-w-xs"
        />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          variant="light"
          classNames={{
            tabList: "gap-2",
            tab: "px-4",
          }}
        >
          <Tab key="all" title={t("tutorDashboard.students.all")} />
          <Tab
            key="InProgress"
            title={t("tutorDashboard.students.inProgress")}
          />
          <Tab key="Completed" title={t("tutorDashboard.students.completed")} />
        </Tabs>
      </motion.div>

      {/* Students List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="flex justify-center py-12">
          <p style={{ color: colors.text.tertiary }}>
            {t("tutorDashboard.students.noStudents")}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {enrollments.map((enrollment) => {
            const progress =
              enrollment.numsOfSession > 0
                ? Math.round(
                    (enrollment.numOfCompleteSession /
                      enrollment.numsOfSession) *
                      100,
                  )
                : 0;

            return (
              <motion.div key={enrollment.id} variants={itemVariants}>
                <Card
                  shadow="none"
                  className="border-none"
                  style={{ backgroundColor: colors.background.light }}
                >
                  <CardBody className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Student Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar
                          src={enrollment.studentAvatar}
                          size="lg"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="font-semibold"
                              style={{ color: colors.text.primary }}
                            >
                              {enrollment.studentName}
                            </h3>
                            <Chip
                              size="sm"
                              style={{
                                backgroundColor: `${getStatusColor(enrollment.status)}20`,
                                color: getStatusColor(enrollment.status),
                              }}
                            >
                              {getStatusLabel(enrollment.status)}
                            </Chip>
                          </div>
                          <p
                            className="text-sm cursor-pointer hover:underline"
                            style={{ color: colors.primary.main }}
                            onClick={() =>
                              navigate(`/tutor/courses/${enrollment.courseId}`)
                            }
                          >
                            {enrollment.courseName}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: colors.text.tertiary }}
                          >
                            {t("tutorDashboard.students.enrolledAt")}:{" "}
                            {formatDate(enrollment.enrolledAt)}
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="flex-1 lg:max-w-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("tutorDashboard.students.progress")}
                          </span>
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {enrollment.numOfCompleteSession}/
                            {enrollment.numsOfSession}{" "}
                            {t("tutorDashboard.students.lessons")}
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          size="sm"
                          classNames={{
                            indicator: "bg-primary",
                          }}
                          style={{
                            backgroundColor: colors.background.gray,
                          }}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              variant="flat"
                              size="sm"
                              style={{
                                backgroundColor: colors.background.gray,
                                color: colors.text.secondary,
                              }}
                            >
                              <DotsThree weight="bold" className="w-5 h-5" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            onAction={(key) => {
                              if (key === "view")
                                navigate(
                                  `/tutor/students/${enrollment.studentId}`,
                                );
                              if (key === "schedule")
                                navigate(
                                  `/tutor/schedule?studentId=${enrollment.studentId}&courseId=${enrollment.courseId}`,
                                );
                            }}
                          >
                            <DropdownItem
                              key="view"
                              startContent={<Eye className="w-4 h-4" />}
                            >
                              {t("tutorDashboard.students.viewProfile")}
                            </DropdownItem>
                            <DropdownItem
                              key="schedule"
                              startContent={
                                <CalendarCheck className="w-4 h-4" />
                              }
                            >
                              {t("tutorDashboard.students.scheduleLesson")}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Students;
