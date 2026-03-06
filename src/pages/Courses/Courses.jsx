import { useState } from "react";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import {
  MagnifyingGlass,
  BookOpen,
  Briefcase,
  ChatsCircle,
  PencilSimpleLine,
  Certificate,
  TrendUp,
  Target,
  Lightning,
  GraduationCap,
} from "@phosphor-icons/react";
import readingImage from "../../assets/illustrations/boy-and-laptop.avif";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const Courses = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    {
      key: "all",
      label: t("courses.categories.all"),
      icon: (props) => <BookOpen weight="duotone" {...props} />,
    },
    {
      key: "business",
      label: t("courses.categories.business"),
      icon: (props) => <Briefcase weight="duotone" {...props} />,
    },
    {
      key: "ielts",
      label: t("courses.categories.ielts"),
      icon: (props) => <Certificate weight="duotone" {...props} />,
    },
    {
      key: "toefl",
      label: t("courses.categories.toefl"),
      icon: (props) => <GraduationCap weight="duotone" {...props} />,
    },
    {
      key: "conversation",
      label: t("courses.categories.conversation"),
      icon: (props) => <ChatsCircle weight="duotone" {...props} />,
    },
    {
      key: "grammar",
      label: t("courses.categories.grammar"),
      icon: (props) => <PencilSimpleLine weight="duotone" {...props} />,
    },
  ];

  const featuredCourses = [
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
  ];

  const allCourses = [
    ...featuredCourses,
    {
      id: 5,
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
    {
      id: 7,
      title: "Academic Writing Skills",
      tutor: "Dr. Amanda Foster",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor7",
      rating: 4.8,
      reviews: 198,
      students: 720,
      lessons: 22,
      duration: "11 hours",
      price: 54.99,
      originalPrice: 99.99,
      level: "Advanced",
      category: "Writing",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
      isBestseller: false,
    },
    {
      id: 8,
      title: "English Pronunciation Mastery",
      tutor: "Rachel Green",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor8",
      rating: 4.9,
      reviews: 276,
      students: 1100,
      lessons: 16,
      duration: "8 hours",
      price: 34.99,
      originalPrice: 69.99,
      level: "Beginner",
      category: "Speaking",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400",
      isBestseller: true,
    },
  ];

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

  const filteredCourses =
    selectedCategory === "all"
      ? allCourses
      : allCourses.filter(
          (course) =>
            course.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const searchedCourses = searchQuery
    ? filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tutor.toLowerCase().includes(searchQuery.toLowerCase()),
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
                  placeholder={t("courses.hero.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <motion.div key={category.key} variants={itemVariants}>
                <Button
                  variant={selectedCategory === category.key ? "solid" : "flat"}
                  color={
                    selectedCategory === category.key ? "primary" : "default"
                  }
                  className={`px-6 py-3 ${
                    selectedCategory !== category.key ? "shadow-none" : ""
                  }`}
                  startContent={category.icon({ size: 20 })}
                  onPress={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              </motion.div>
            ))}
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
                  style={{ backgroundColor: colors.background.gray }}
                />
              </motion.div>
            ))}
          </motion.div>
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
              <Button
                size="lg"
                radius="full"
                variant="bordered"
                className="font-semibold text-lg px-10 h-14"
                style={{
                  borderColor: colors.text.white,
                  color: colors.text.white,
                }}
                onPress={() => navigate("/pricing")}
              >
                {t("courses.cta.viewPricing")}
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
