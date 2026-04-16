import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  CaretDown,
  CaretUp,
  FunnelSimple,
  X,
} from "@phosphor-icons/react";
import readingImage from "../../assets/illustrations/boy-and-laptop.avif";
import searchImage from "../../assets/illustrations/search.avif";

// eslint-disable-next-line no-unused-vars
const { motion, AnimatePresence } = MotionLib;

const LEVELS = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced",
];

const Courses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const initialQ = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQ);
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { inputClassNames, selectClassNames } = useInputStyles();

  // Sidebar collapse states
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [levelOpen, setLevelOpen] = useState(true);
  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch categories once on mount
  useEffect(() => {
    coursesApi
      .getCategories({ "page-size": 50 })
      .then((res) => setCategories(res?.data?.items || []))
      .catch(() => {});
  }, []);

  // Fetch courses whenever searchQuery changes (uses API search-term)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = { Status: "Published", "page-size": 50 };
        if (searchQuery.trim()) params["search-term"] = searchQuery.trim();
        const res = await coursesApi.getAllCourses(params);
        const items = res?.data?.items || [];
        setCourses(items);
        // Keep unfiltered snapshot for sidebar counts (no search-term)
        if (!searchQuery.trim()) setAllCourses(items);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [searchQuery]);

  // Count courses per category (based on unfiltered allCourses for sidebar)
  const categoryCounts = useMemo(() => {
    const counts = {};
    allCourses.forEach((c) => {
      c.courseCategories?.forEach((cat) => {
        counts[cat.categoryId] = (counts[cat.categoryId] || 0) + 1;
      });
    });
    return counts;
  }, [allCourses]);

  // Count courses per level (based on unfiltered allCourses for sidebar)
  const levelCounts = useMemo(() => {
    const counts = {};
    allCourses.forEach((c) => {
      if (c.level) counts[c.level] = (counts[c.level] || 0) + 1;
    });
    return counts;
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      const categoryMatch =
        selectedCategory === "all" ||
        course.courseCategories?.some(
          (cat) => cat.categoryId === selectedCategory,
        );
      const levelMatch = !selectedLevel || course.level === selectedLevel;
      return categoryMatch && levelMatch;
    });

    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0),
      );
    } else if (sortBy === "popular") {
      result = [...result].sort(
        (a, b) => (b.totalStudents || 0) - (a.totalStudents || 0),
      );
    } else if (sortBy === "priceAsc") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceDesc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [courses, selectedCategory, selectedLevel, sortBy]);

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

  const hasActiveFilters =
    selectedCategory !== "all" || selectedLevel !== "" || searchQuery !== "";

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <div className="space-y-1">
      {/* Category Section */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.background.gray }}
      >
        <button
          className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          <span
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: colors.text.primary }}
          >
            {t("courses.categories.category")}
          </span>
          {categoryOpen ? (
            <CaretUp size={16} style={{ color: colors.text.secondary }} />
          ) : (
            <CaretDown size={16} style={{ color: colors.text.secondary }} />
          )}
        </button>
        {categoryOpen && (
          <div className="px-2 pb-3 space-y-0.5">
            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors"
              style={{
                backgroundColor:
                  selectedCategory === "all"
                    ? `${colors.primary.main}15`
                    : "transparent",
                color:
                  selectedCategory === "all"
                    ? colors.primary.main
                    : colors.text.secondary,
              }}
              onClick={() => setSelectedCategory("all")}
            >
              <span className="text-sm font-medium">
                {t("courses.categories.all")}
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors"
                style={{
                  backgroundColor:
                    selectedCategory === cat.id
                      ? `${colors.primary.main}15`
                      : "transparent",
                  color:
                    selectedCategory === cat.id
                      ? colors.primary.main
                      : colors.text.secondary,
                }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Level Section */}
      <div
        className="rounded-xl overflow-hidden mt-4"
        style={{ backgroundColor: colors.background.gray }}
      >
        <button
          className="w-full flex items-center justify-between p-4 transition-colors hover:opacity-80"
          onClick={() => setLevelOpen(!levelOpen)}
        >
          <span
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: colors.text.primary }}
          >
            {t("courses.categories.level")}
          </span>
          {levelOpen ? (
            <CaretUp size={16} style={{ color: colors.text.secondary }} />
          ) : (
            <CaretDown size={16} style={{ color: colors.text.secondary }} />
          )}
        </button>
        {levelOpen && (
          <div className="px-2 pb-3 space-y-0.5">
            <button
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors"
              style={{
                backgroundColor: !selectedLevel
                  ? `${colors.primary.main}15`
                  : "transparent",
                color: !selectedLevel
                  ? colors.primary.main
                  : colors.text.secondary,
              }}
              onClick={() => setSelectedLevel("")}
            >
              <span className="text-sm font-medium">
                {t("courses.categories.allLevels")}
              </span>
            </button>
            {LEVELS.map((level) => (
              <button
                key={level}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors"
                style={{
                  backgroundColor:
                    selectedLevel === level
                      ? `${colors.primary.main}15`
                      : "transparent",
                  color:
                    selectedLevel === level
                      ? colors.primary.main
                      : colors.text.secondary,
                }}
                onClick={() => setSelectedLevel(level)}
              >
                <span className="text-sm font-medium">{level}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear all filters */}
      {hasActiveFilters && (
        <Button
          size="sm"
          variant="flat"
          className="w-full"
          style={{ color: colors.state.error }}
          startContent={<X size={14} />}
          onPress={() => {
            setSelectedCategory("all");
            setSelectedLevel("");
          }}
        >
          {t("courses.search.clearFilters")}
        </Button>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.light }}
    >
      <Header />

      {/* Hero Section — compact */}
      <section
        className="py-12 px-6 md:px-12"
        style={{
          background:
            theme === "dark"
              ? colors.background.page
              : "linear-gradient(to bottom, #FFFFFF, #DBEAFE)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  backgroundColor: colors.background.primaryLight,
                  color: colors.primary.main,
                }}
              >
                {t("courses.hero.badge")}
              </span>
              <h1
                className="text-4xl sm:text-5xl font-bold mb-3"
                style={{ color: colors.text.primary }}
              >
                {t("courses.hero.title")}{" "}
                <span style={{ color: colors.primary.main }}>
                  {t("courses.hero.titleHighlight")}
                </span>
              </h1>
              <p
                className="text-base max-w-xl mb-6"
                style={{ color: colors.text.secondary }}
              >
                {t("courses.hero.description")}
              </p>
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
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full max-w-sm h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content — Sidebar + Courses Grid */}
      <section
        className="py-8 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top bar: search + sort + mobile filter toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder={t("courses.search.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSearchQuery(searchInput.trim());
                }}
                startContent={
                  <MagnifyingGlass
                    size={18}
                    style={{ color: colors.text.secondary }}
                  />
                }
                endContent={
                  searchInput ? (
                    <button
                      onClick={() => {
                        setSearchInput("");
                        setSearchQuery("");
                      }}
                      className="hover:opacity-70"
                    >
                      <X size={16} style={{ color: colors.text.tertiary }} />
                    </button>
                  ) : null
                }
                classNames={inputClassNames}
                size="md"
              />
            </div>

            <div className="flex gap-2">
              <div className="w-48">
                <Select
                  aria-label={t("courses.categories.sortBy")}
                  selectedKeys={new Set([sortBy])}
                  onSelectionChange={(keys) =>
                    setSortBy([...keys][0] ?? "newest")
                  }
                  classNames={selectClassNames}
                  size="md"
                >
                  <SelectItem key="newest">
                    {t("courses.categories.sortNewest")}
                  </SelectItem>
                  <SelectItem key="popular">
                    {t("courses.categories.sortPopular")}
                  </SelectItem>
                  <SelectItem key="priceAsc">
                    {t("courses.categories.sortPriceAsc")}
                  </SelectItem>
                  <SelectItem key="priceDesc">
                    {t("courses.categories.sortPriceDesc")}
                  </SelectItem>
                </Select>
              </div>

              {/* Mobile filter toggle */}
              <Button
                isIconOnly
                variant="flat"
                className="lg:hidden"
                style={{
                  backgroundColor: sidebarOpen
                    ? `${colors.primary.main}20`
                    : colors.background.card,
                  color: sidebarOpen
                    ? colors.primary.main
                    : colors.text.secondary,
                }}
                onPress={() => setSidebarOpen(!sidebarOpen)}
              >
                <FunnelSimple size={20} weight="bold" />
              </Button>
            </div>
          </div>

          {/* Results count + active filter chips */}
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <p className="text-sm" style={{ color: colors.text.tertiary }}>
              {t("courses.categories.resultsFound", {
                count: filteredCourses.length,
              })}
            </p>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory !== "all" && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${colors.primary.main}15`,
                      color: colors.primary.main,
                    }}
                  >
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-0.5 hover:opacity-70"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedLevel && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${colors.primary.main}15`,
                      color: colors.primary.main,
                    }}
                  >
                    {selectedLevel}
                    <button
                      onClick={() => setSelectedLevel("")}
                      className="ml-0.5 hover:opacity-70"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${colors.primary.main}15`,
                      color: colors.primary.main,
                    }}
                  >
                    &ldquo;{searchQuery}&rdquo;
                    <button
                      onClick={() => {
                        setSearchInput("");
                        setSearchQuery("");
                      }}
                      className="ml-0.5 hover:opacity-70"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Mobile sidebar (collapsible) */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden overflow-hidden mb-6"
              >
                {sidebarContent}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">{sidebarContent}</div>
            </aside>

            {/* Courses Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <CourseCardSkeleton
                  count={9}
                  gridClassName="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  cardBgColor={colors.background.gray}
                />
              ) : filteredCourses.length === 0 ? (
                <div
                  className="text-center py-16 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <img
                    src={searchImage}
                    alt="No results"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-68 h-auto mx-auto opacity-80"
                  />
                  <p
                    className="text-lg font-semibold mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("courses.search.noResults")}
                  </p>
                  <p
                    className="text-sm mb-6 max-w-md mx-auto"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("courses.search.noResultsDesc")}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="flat"
                      style={{
                        backgroundColor: `${colors.primary.main}15`,
                        color: colors.primary.main,
                      }}
                      onPress={() => {
                        setSelectedCategory("all");
                        setSelectedLevel("");
                        setSearchInput("");
                        setSearchQuery("");
                      }}
                    >
                      {t("courses.search.clearFilters")}
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  key={selectedCategory + selectedLevel + searchQuery + sortBy}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filteredCourses.map((course, i) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      whileHover={{
                        y: -6,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        },
                      }}
                    >
                      <CourseCard
                        course={course}
                        showCategory={true}
                        showTutorInfo={false}
                        style={{ backgroundColor: colors.background.gray }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
          </div>
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
