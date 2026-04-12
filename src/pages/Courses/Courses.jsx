import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as MotionLib from "framer-motion";
import CourseCardSkeleton from "../../components/CourseCardSkeleton/CourseCardSkeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import useInputStyles from "../../hooks/useInputStyles";
import { coursesApi } from "../../api";
import {
  MagnifyingGlass,
  Target,
  Lightning,
  TrendUp,
  Certificate,
} from "@phosphor-icons/react";
import readingImage from "../../assets/illustrations/boy-and-laptop.avif";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Courses = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectClassNames } = useInputStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, categoriesRes] = await Promise.allSettled([
          coursesApi.getAllCourses({ Status: "Published", "page-size": 50 }),
          coursesApi.getCategories({ "page-size": 50 }),
        ]);
        if (coursesRes.status === "fulfilled") {
          setCourses(coursesRes.value?.data?.items || []);
        }
        if (categoriesRes.status === "fulfilled") {
          setCategories(categoriesRes.value?.data?.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredCourses = courses.slice(0, 4);

  const benefits = [
    {
      icon: (props) => <Target weight="duotone" {...props} />,
      title: t("courses.benefits.personalized.title"),
      description: t("courses.benefits.personalized.description"),
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      icon: (props) => <Lightning weight="duotone" {...props} />,
      title: t("courses.benefits.practical.title"),
      description: t("courses.benefits.practical.description"),
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      icon: (props) => <TrendUp weight="duotone" {...props} />,
      title: t("courses.benefits.progress.title"),
      description: t("courses.benefits.progress.description"),
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      icon: (props) => <Certificate weight="duotone" {...props} />,
      title: t("courses.benefits.certificate.title"),
      description: t("courses.benefits.certificate.description"),
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
  ];

  const LEVELS = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper-Intermediate",
    "Advanced",
  ];

  const filteredCourses = courses.filter((course) => {
    const categoryMatch =
      selectedCategory === "all" ||
      course.courseCategories?.some(
        (cat) => cat.categoryId === selectedCategory,
      );
    const levelMatch = !selectedLevel || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const searchedCourses = searchQuery
    ? filteredCourses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredCourses;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.light }}
    >
      <Header />

      {/* Hero Section */}
      <section
        className="py-16 px-6 md:px-12"
        style={{
          background:
            theme === "dark"
              ? colors.background.page
              : "linear-gradient(to bottom, #FFFFFF, #DBEAFE)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{
                  backgroundColor: colors.background.primaryLight,
                  color: colors.primary.main,
                }}
              >
                {t("courses.hero.badge")}
              </span>
              <h1
                className="text-4xl sm:text-5xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t("courses.hero.title")}{" "}
                <span style={{ color: colors.primary.main }}>
                  {t("courses.hero.titleHighlight")}
                </span>
              </h1>
              <p
                className="text-lg max-w-xl mb-8"
                style={{ color: colors.text.secondary }}
              >
                {t("courses.hero.description")}
              </p>

              {/* Search Bar */}
              <div className="max-w-xl">
                <Input
                  placeholder={t("courses.search.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate(
                        `/courses/search?q=${encodeURIComponent(searchQuery.trim())}`,
                      );
                    }
                  }}
                  startContent={
                    <MagnifyingGlass
                      size={20}
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={{
                    input: "text-base",
                    inputWrapper: `shadow-none ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`,
                  }}
                  size="lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <img
                src={readingImage}
                alt="Learning courses"
                className="w-full max-w-md h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        className="py-12 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-8"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: colors.text.primary }}
            >
              {t("courses.categories.title")}
            </h2>
            <p style={{ color: colors.text.secondary }}>
              {t("courses.categories.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div variants={itemVariants} className="w-72">
              <Select
                label={t("courses.search.filterByCategory")}
                selectedKeys={new Set([selectedCategory])}
                onSelectionChange={(keys) =>
                  setSelectedCategory([...keys][0] ?? "all")
                }
                classNames={selectClassNames}
              >
                <SelectItem key="all">{t("courses.categories.all")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id}>{cat.name}</SelectItem>
                ))}
              </Select>
            </motion.div>

            <motion.div variants={itemVariants} className="w-72">
              <Select
                label={t("courses.search.filterByLevel")}
                selectedKeys={
                  selectedLevel ? new Set([selectedLevel]) : new Set()
                }
                onSelectionChange={(keys) =>
                  setSelectedLevel([...keys][0] ?? "")
                }
                classNames={selectClassNames}
              >
                <SelectItem key="">
                  {t("courses.categories.allLevels")}
                </SelectItem>
                {LEVELS.map((level) => (
                  <SelectItem key={level}>{level}</SelectItem>
                ))}
              </Select>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section
        className="py-12 px-6 md:px-12"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: colors.text.primary }}
            >
              {t("courses.featured.title")}{" "}
              <span style={{ color: colors.primary.main }}>
                {t("courses.featured.titleHighlight")}
              </span>
            </h2>
            <p style={{ color: colors.text.secondary }}>
              {t("courses.featured.subtitle")}
            </p>
          </motion.div>

          {loading ? (
            <CourseCardSkeleton
              count={4}
              cardBgColor={colors.background.light}
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                >
                  <CourseCard course={course} showTutorInfo={false} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* All Courses Section */}
      <section
        className="py-12 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-between items-center mb-10"
          >
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: colors.text.primary }}
              >
                {t("courses.allCourses.title")}
              </h2>
              <p style={{ color: colors.text.secondary }}>
                {t("courses.allCourses.subtitle")} ({searchedCourses.length}{" "}
                {t("courses.allCourses.coursesFound")})
              </p>
            </div>
          </motion.div>

          {loading ? (
            <CourseCardSkeleton
              count={8}
              gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              cardBgColor={colors.background.gray}
            />
          ) : (
            <motion.div
              key={selectedCategory + selectedLevel + searchQuery}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {searchedCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                >
                  <CourseCard
                    course={course}
                    variant="compact"
                    showCategory={true}
                    showTutorInfo={false}
                    style={{ backgroundColor: colors.background.gray }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section
        className="py-16 px-6 md:px-12"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: colors.text.primary }}
            >
              {t("courses.benefits.title")}{" "}
              <span style={{ color: colors.primary.main }}>
                {t("courses.benefits.titleHighlight")}
              </span>
            </h2>
            <p style={{ color: colors.text.secondary }}>
              {t("courses.benefits.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className="h-full shadow-none text-center p-6"
                  style={{ backgroundColor: colors.background.card }}
                >
                  <CardBody className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: benefit.bgColor }}
                    >
                      {benefit.icon({
                        size: 32,
                        style: { color: benefit.color },
                      })}
                    </div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: colors.text.primary }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {benefit.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.primary.main }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{ color: colors.text.white }}
            >
              {t("courses.cta.title")}
            </h2>
            <p
              className="text-lg mb-10 max-w-2xl mx-auto opacity-90"
              style={{ color: colors.text.white }}
            >
              {t("courses.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                radius="full"
                className="font-semibold text-lg px-10 h-14"
                style={{
                  backgroundColor: colors.background.light,
                  color: colors.primary.main,
                }}
                onPress={() => navigate("/register")}
              >
                {t("courses.cta.button")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
