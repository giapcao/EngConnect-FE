import { useState } from "react";
import { Input, Chip, Select, SelectItem } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import { MagnifyingGlass } from "@phosphor-icons/react";
import CourseCard from "../../../components/CourseCard/CourseCard";

const BrowseCourses = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const categories = [
    { key: "all", label: t("studentDashboard.browseCourses.categories.all") },
    {
      key: "business",
      label: t("studentDashboard.browseCourses.categories.business"),
    },
    {
      key: "ielts",
      label: t("studentDashboard.browseCourses.categories.ielts"),
    },
    {
      key: "toefl",
      label: t("studentDashboard.browseCourses.categories.toefl"),
    },
    {
      key: "conversation",
      label: t("studentDashboard.browseCourses.categories.conversation"),
    },
    {
      key: "grammar",
      label: t("studentDashboard.browseCourses.categories.grammar"),
    },
  ];

  const levels = [
    { key: "all", label: t("studentDashboard.browseCourses.levels.all") },
    {
      key: "beginner",
      label: t("studentDashboard.browseCourses.levels.beginner"),
    },
    {
      key: "intermediate",
      label: t("studentDashboard.browseCourses.levels.intermediate"),
    },
    {
      key: "advanced",
      label: t("studentDashboard.browseCourses.levels.advanced"),
    },
  ];

  const courses = [
    {
      id: 1,
      title: "Business English Masterclass",
      tutor: "Sarah Johnson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
      rating: 4.9,
      reviews: 234,
      students: 1250,
      lessons: 20,
      duration: "10 hours",
      price: 49.99,
      originalPrice: 99.99,
      level: "Intermediate",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      isBestseller: true,
    },
    {
      id: 2,
      title: "IELTS Band 7+ Preparation",
      tutor: "Michael Chen",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor2",
      rating: 4.8,
      reviews: 189,
      students: 980,
      lessons: 30,
      duration: "15 hours",
      price: 79.99,
      originalPrice: 149.99,
      level: "Advanced",
      category: "IELTS",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      isBestseller: true,
    },
    {
      id: 3,
      title: "English for Beginners",
      tutor: "Emma Wilson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor3",
      rating: 4.7,
      reviews: 456,
      students: 2100,
      lessons: 25,
      duration: "12 hours",
      price: 29.99,
      originalPrice: 59.99,
      level: "Beginner",
      category: "General",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
      isBestseller: false,
    },
    {
      id: 4,
      title: "Advanced Grammar Workshop",
      tutor: "David Brown",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor4",
      rating: 4.6,
      reviews: 123,
      students: 650,
      lessons: 15,
      duration: "8 hours",
      price: 39.99,
      originalPrice: 79.99,
      level: "Advanced",
      category: "Grammar",
      image:
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400",
      isBestseller: false,
    },
    {
      id: 5,
      title: "Conversational English Fluency",
      tutor: "Lisa Anderson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor5",
      rating: 4.9,
      reviews: 312,
      students: 1500,
      lessons: 18,
      duration: "9 hours",
      price: 44.99,
      originalPrice: 89.99,
      level: "Intermediate",
      category: "Conversation",
      image:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400",
      isBestseller: true,
    },
    {
      id: 6,
      title: "TOEFL Complete Guide",
      tutor: "James Wilson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor6",
      rating: 4.7,
      reviews: 167,
      students: 890,
      lessons: 28,
      duration: "14 hours",
      price: 69.99,
      originalPrice: 129.99,
      level: "Intermediate",
      category: "TOEFL",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      isBestseller: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          {t("studentDashboard.browseCourses.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("studentDashboard.browseCourses.subtitle")}
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <Input
          placeholder={t("studentDashboard.browseCourses.searchPlaceholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <MagnifyingGlass
              className="w-5 h-5"
              style={{ color: colors.text.secondary }}
            />
          }
          classNames={{
            inputWrapper: `bg-white dark:bg-slate-900`,
          }}
          className="flex-1"
        />

        <div className="flex gap-3">
          <Select
            placeholder={t("studentDashboard.browseCourses.category")}
            selectedKeys={[selectedCategory]}
            onSelectionChange={(keys) => setSelectedCategory([...keys][0])}
            className="w-40"
            classNames={{
              trigger: "bg-white dark:bg-slate-900",
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={cat.key}>{cat.label}</SelectItem>
            ))}
          </Select>

          <Select
            placeholder={t("studentDashboard.browseCourses.level")}
            selectedKeys={[selectedLevel]}
            onSelectionChange={(keys) => setSelectedLevel([...keys][0])}
            className="w-40"
            classNames={{
              trigger: "bg-white dark:bg-slate-800",
            }}
          >
            {levels.map((level) => (
              <SelectItem key={level.key}>{level.label}</SelectItem>
            ))}
          </Select>
        </div>
      </motion.div>

      {/* Category Chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((cat) => (
          <Chip
            key={cat.key}
            variant={selectedCategory === cat.key ? "solid" : "flat"}
            className="cursor-pointer"
            style={{
              backgroundColor:
                selectedCategory === cat.key
                  ? colors.primary.main
                  : colors.background.light,
              color:
                selectedCategory === cat.key
                  ? colors.text.white
                  : colors.text.primary,
            }}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </Chip>
        ))}
      </motion.div>

      {/* Course Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {courses.map((course, index) => (
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
              variant="compact"
              basePath="/student/courses"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BrowseCourses;
