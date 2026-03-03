import { useState } from "react";
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

const MyCourses = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");

  const courses = [
    {
      id: 1,
      title: "Business English Masterclass",
      description: "Complete business English course for professionals",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      students: 45,
      rating: 4.9,
      reviews: 234,
      lessons: 20,
      duration: "10 hours",
      price: 199,
      originalPrice: 299,
      level: "Intermediate",
      status: "published",
      category: "Business",
    },
    {
      id: 2,
      title: "IELTS Preparation Course",
      description: "Comprehensive IELTS preparation for band 7+",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      students: 32,
      rating: 4.8,
      reviews: 189,
      lessons: 24,
      duration: "12 hours",
      price: 249,
      originalPrice: 349,
      level: "Advanced",
      status: "published",
      category: "Exam Prep",
    },
    {
      id: 3,
      title: "Conversational English",
      description: "Improve your daily English conversation skills",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
      students: 28,
      rating: 5.0,
      reviews: 156,
      lessons: 15,
      duration: "8 hours",
      price: 149,
      originalPrice: 249,
      level: "Beginner",
      status: "published",
      category: "Speaking",
    },
    {
      id: 4,
      title: "Academic Writing",
      description: "Master academic writing for university",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      students: 0,
      rating: 0,
      lessons: 12,
      duration: "6 hours",
      price: 179,
      originalPrice: 279,
      level: "Advanced",
      status: "draft",
      category: "Writing",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return colors.state.success;
      case "draft":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (selectedTab === "all") return true;
    return course.status === selectedTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("tutorDashboard.myCourses.searchPlaceholder")}
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
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
                  course.status === "published"
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
    </div>
  );
};

export default MyCourses;
