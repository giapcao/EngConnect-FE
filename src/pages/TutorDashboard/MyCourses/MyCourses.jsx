import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  Plus,
  MagnifyingGlass,
  DotsThree,
  PencilSimple,
  Trash,
  Eye,
} from "@phosphor-icons/react";
import CourseCard from "../../../components/CourseCard/CourseCard";
import CourseCardSkeleton from "../../../components/CourseCardSkeleton/CourseCardSkeleton";
import { coursesApi } from "../../../api";

const MyCourses = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await coursesApi.getMyCourses({ "page-size": 50 });
        setCourses(res?.data?.items || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return colors.state.success;
      case "draft":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      selectedTab === "all" || course.status?.toLowerCase() === selectedTab;
    const matchesSearch =
      !searchQuery ||
      course.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {t("tutorDashboard.myCourses.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("tutorDashboard.myCourses.subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus weight="bold" className="w-5 h-5" />}
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
          onPress={() => navigate("/tutor/create-course")}
        >
          {t("tutorDashboard.myCourses.createCourse")}
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("tutorDashboard.myCourses.searchPlaceholder")}
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
          <Tab key="all" title={t("tutorDashboard.myCourses.all")} />
          <Tab
            key="published"
            title={t("tutorDashboard.myCourses.published")}
          />
          <Tab key="draft" title={t("tutorDashboard.myCourses.draft")} />
        </Tabs>
      </motion.div>

      {/* Courses Grid */}
      {loading ? (
        <CourseCardSkeleton
          count={8}
          gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          cardBgColor={colors.background.light}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCourses.map((course) => (
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
                showTutorInfo={false}
                variant="compact"
                basePath="/tutor/courses"
                statusBadge={{
                  label:
                    course.status?.toLowerCase() === "published"
                      ? t("tutorDashboard.myCourses.published")
                      : t("tutorDashboard.myCourses.draft"),
                  color: getStatusColor(course.status),
                }}
                topRightAction={
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                      >
                        <DotsThree weight="bold" className="w-5 h-5" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="view"
                        startContent={<Eye className="w-4 h-4" />}
                      >
                        {t("tutorDashboard.myCourses.viewCourse")}
                      </DropdownItem>
                      <DropdownItem
                        key="edit"
                        startContent={<PencilSimple className="w-4 h-4" />}
                      >
                        {t("tutorDashboard.myCourses.editCourse")}
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        startContent={<Trash className="w-4 h-4" />}
                      >
                        {t("tutorDashboard.myCourses.deleteCourse")}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
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
