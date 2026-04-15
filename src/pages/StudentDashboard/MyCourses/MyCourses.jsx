import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store";
import { studentApi } from "../../../api";
import { Input, Spinner, Chip, Tabs, Tab } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";
import CourseCard from "../../../components/CourseCard/CourseCard";
import CourseCardSkeleton from "../../../components/CourseCardSkeleton/CourseCardSkeleton";
import searchIllustration from "../../../assets/illustrations/search.avif";

const MyCourses = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = { "page-size": 50 };
      if (searchQuery.trim()) params["search-term"] = searchQuery.trim();
      if (selectedTab !== "all") params.Status = selectedTab;
      const res = await studentApi.getMyCoursesStudent(params);
      setCourses(res?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTab]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return colors.state.success;
      case "completed":
        return colors.state.info;
      case "pending":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return t("studentDashboard.myCourses.active");
      case "completed":
        return t("studentDashboard.myCourses.completed");
      case "pending":
        return t("studentDashboard.myCourses.pending");
      default:
        return status || "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          {t("studentDashboard.myCourses.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("studentDashboard.myCourses.subtitle")}
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("studentDashboard.myCourses.searchPlaceholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <MagnifyingGlass
              className="w-5 h-5"
              style={{ color: colors.text.tertiary }}
            />
          }
          classNames={{ inputWrapper: "shadow-none" }}
          style={{ backgroundColor: colors.background.light }}
          className="max-w-xs"
        />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          color="primary"
          classNames={{ tabList: "gap-2", tab: "px-4" }}
        >
          <Tab key="all" title={t("studentDashboard.myCourses.all")} />
          <Tab key="Active" title={t("studentDashboard.myCourses.active")} />
          <Tab
            key="Completed"
            title={t("studentDashboard.myCourses.completed")}
          />
        </Tabs>
      </motion.div>

      {/* Course Grid */}
      {loading ? (
        <CourseCardSkeleton
          count={8}
          gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          cardBgColor={colors.background.light}
        />
      ) : courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col items-center justify-center gap-4 py-12"
        >
          <img
            src={searchIllustration}
            alt="No courses"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className="w-52 h-52 object-contain"
          />
          <h3
            className="text-xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            {t("studentDashboard.myCourses.emptyTitle")}
          </h3>
          <p
            className="text-center max-w-sm"
            style={{ color: colors.text.secondary }}
          >
            {t("studentDashboard.myCourses.emptySubtitle")}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
            >
              <CourseCard
                course={course}
                showCategory={true}
                variant="compact"
                basePath="/student/courses"
                statusBadge={
                  course.status
                    ? {
                        label: getStatusLabel(course.status),
                        color: getStatusColor(course.status),
                      }
                    : null
                }
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyCourses;
