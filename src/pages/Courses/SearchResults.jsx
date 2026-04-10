import { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import { coursesApi } from "../../api";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import CourseCardSkeleton from "../../components/CourseCardSkeleton/CourseCardSkeleton";
import {
  MagnifyingGlass,
  ArrowLeft,
  FunnelSimple,
} from "@phosphor-icons/react";
import searchImage from "../../assets/illustrations/search.avif";

const SearchResults = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || "all";
  const levelFromUrl = searchParams.get("level") || "";

  const [searchInput, setSearchInput] = useState(queryFromUrl);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedLevel, setSelectedLevel] = useState(levelFromUrl);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const LEVELS = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Upper-Intermediate",
    "Advanced",
  ];

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await coursesApi.getCategories({ "page-size": 50 });
        setCategories(res?.data?.items || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses when search query or category changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {
          Status: "Published",
          "page-size": 50,
        };
        if (queryFromUrl.trim()) {
          params["search-term"] = queryFromUrl.trim();
        }
        if (categoryFromUrl && categoryFromUrl !== "all") {
          params.CategoryId = categoryFromUrl;
        }
        if (levelFromUrl) {
          params.Level = levelFromUrl;
        }
        const res = await coursesApi.getAllCourses(params);
        setCourses(res?.data?.items || []);
      } catch (err) {
        console.error("Failed to search courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [queryFromUrl, categoryFromUrl, levelFromUrl]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchInput.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchInput.trim());
      if (selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }
      if (selectedLevel) {
        params.set("level", selectedLevel);
      }
      setSearchParams(params);
    }
  };

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const params = new URLSearchParams();
    if (queryFromUrl.trim()) {
      params.set("q", queryFromUrl.trim());
    }
    if (categoryKey !== "all") {
      params.set("category", categoryKey);
    }
    if (selectedLevel) {
      params.set("level", selectedLevel);
    }
    setSearchParams(params);
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    const params = new URLSearchParams();
    if (queryFromUrl.trim()) {
      params.set("q", queryFromUrl.trim());
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (level) {
      params.set("level", level);
    }
    setSearchParams(params);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.light }}
    >
      <Header />

      {/* Search Header */}
      <section
        className="py-8 px-6 md:px-12"
        style={{
          backgroundColor:
            theme === "dark" ? colors.background.page : colors.background.gray,
        }}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <Button
            variant="light"
            startContent={<ArrowLeft className="w-4 h-4" />}
            onPress={() => navigate("/courses")}
            size="sm"
            style={{ color: colors.text.secondary }}
          >
            {t("courses.search.backToCourses")}
          </Button>

          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold mb-1"
              style={{ color: colors.text.primary }}
            >
              {queryFromUrl
                ? t("courses.search.resultsFor", { query: queryFromUrl })
                : t("courses.search.allResults")}
            </h1>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {loading
                ? t("courses.search.searching")
                : t("courses.search.found", { count: courses.length })}
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl">
            <Input
              placeholder={t("courses.search.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
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
        </div>
      </section>

      {/* Category filter + results */}
      <section className="py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Category + Level filters */}
          {!loadingCategories && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FunnelSimple
                  className="w-4 h-4"
                  style={{ color: colors.text.secondary }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  {t("courses.search.filterByCategory")}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                {categories.length > 0 && (
                  <div className="w-72">
                    <Select
                      label={t("courses.search.filterByCategory")}
                      selectedKeys={new Set([selectedCategory])}
                      onSelectionChange={(keys) =>
                        handleCategoryChange([...keys][0] ?? "all")
                      }
                      classNames={{ trigger: "shadow-none" }}
                    >
                      <SelectItem key="all">
                        {t("courses.categories.all")}
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
                <div className="w-72">
                  <Select
                    label={t("courses.search.filterByLevel")}
                    selectedKeys={
                      selectedLevel ? new Set([selectedLevel]) : new Set()
                    }
                    onSelectionChange={(keys) =>
                      handleLevelChange([...keys][0] ?? "")
                    }
                    classNames={{ trigger: "shadow-none" }}
                  >
                    <SelectItem key="">
                      {t("courses.categories.allLevels")}
                    </SelectItem>
                    {LEVELS.map((level) => (
                      <SelectItem key={level}>{level}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <CourseCardSkeleton
              count={8}
              gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              cardBgColor={colors.background.gray}
            />
          ) : courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant="compact"
                  showCategory={true}
                  showTutorInfo={false}
                  style={{ backgroundColor: colors.background.gray }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <img
                src={searchImage}
                alt="No results"
                className="w-64 h-auto mb-6 opacity-80"
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                {t("courses.search.noResults")}
              </h3>
              <p
                className="text-sm max-w-md mb-6"
                style={{ color: colors.text.secondary }}
              >
                {t("courses.search.noResultsDesc")}
              </p>
              <Button
                color="primary"
                variant="flat"
                onPress={() => {
                  setSearchInput("");
                  setSearchParams({});
                  setSelectedCategory("all");
                  setSelectedLevel("");
                }}
              >
                {t("courses.search.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchResults;
