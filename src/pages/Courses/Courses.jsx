import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Divider,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import {
  MagnifyingGlass,
  Star,
  Clock,
  Users,
  BookOpen,
  GraduationCap,
  Briefcase,
  ChatsCircle,
  PencilSimpleLine,
  Certificate,
  TrendUp,
  Target,
  Lightning,
  Check,
  VideoCamera,
  FileText,
  DeviceMobile,
  Infinity,
} from "@phosphor-icons/react";
import readingImage from "../../assets/illustrations/boy-and-laptop.avif";
import { col } from "framer-motion/client";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const Courses = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    onOpen();
  };

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
                <Card
                  className="h-full shadow-none"
                  style={{ backgroundColor: colors.background.card }}
                >
                  <div className="relative p-3">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    {course.isBestseller && (
                      <Chip
                        size="sm"
                        className="absolute top-5 left-5"
                        style={{
                          backgroundColor: colors.primary.main,
                          color: colors.text.white,
                        }}
                      >
                        {t("courses.bestseller")}
                      </Chip>
                    )}
                  </div>
                  <CardBody className="p-4 pt-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Chip
                        size="sm"
                        variant="flat"
                        style={{
                          backgroundColor: colors.background.primaryLight,
                          color: colors.primary.main,
                        }}
                      >
                        {course.level}
                      </Chip>
                    </div>
                    <h3
                      className="font-semibold mb-2 line-clamp-2 min-h-[48px]"
                      style={{ color: colors.text.primary }}
                    >
                      {course.title}
                    </h3>
                    <p
                      className="text-sm mb-3"
                      style={{ color: colors.text.secondary }}
                    >
                      {course.tutor}
                    </p>
                    <div
                      className="flex items-center gap-3 text-sm mb-3"
                      style={{ color: colors.text.secondary }}
                    >
                      <span className="flex items-center gap-1">
                        <Star
                          size={14}
                          weight="fill"
                          style={{ color: "#F59E0B" }}
                        />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} weight="duotone" />
                        {course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} weight="duotone" />
                        {course.duration}
                      </span>
                    </div>
                  </CardBody>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div>
                      <span
                        className="text-lg font-bold"
                        style={{ color: colors.primary.main }}
                      >
                        ${course.price}
                      </span>
                      <span
                        className="text-sm line-through ml-2"
                        style={{ color: colors.text.secondary }}
                      >
                        ${course.originalPrice}
                      </span>
                    </div>
                    <Button
                      size="md"
                      style={{
                        fontWeight: "600",
                        backgroundColor: colors.button.primaryLight.background,
                        color: colors.button.primaryLight.text,
                      }}
                      onPress={() => handleViewDetails(course)}
                    >
                      {t("courses.viewDetails")}
                    </Button>
                  </CardFooter>
                </Card>
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
                <Card
                  className="h-full shadow-none"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <div className="relative p-3">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    {course.isBestseller && (
                      <Chip
                        size="sm"
                        className="absolute top-5 left-5"
                        style={{
                          backgroundColor: colors.primary.main,
                          color: colors.text.white,
                        }}
                      >
                        {t("courses.bestseller")}
                      </Chip>
                    )}
                  </div>
                  <CardBody className="p-4 pt-0 flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Chip
                        size="sm"
                        variant="flat"
                        style={{
                          backgroundColor: colors.background.primaryLight,
                          color: colors.primary.main,
                        }}
                      >
                        {course.level}
                      </Chip>
                      <Chip
                        size="sm"
                        variant="flat"
                        style={{
                          backgroundColor: colors.background.gray,
                          color: colors.text.secondary,
                        }}
                      >
                        {course.category}
                      </Chip>
                    </div>
                    <h3
                      className="font-semibold mb-2 line-clamp-2 min-h-[48px]"
                      style={{ color: colors.text.primary }}
                    >
                      {course.title}
                    </h3>
                    <p
                      className="text-sm mb-3"
                      style={{ color: colors.text.secondary }}
                    >
                      {course.tutor}
                    </p>
                    <div
                      className="flex items-center gap-3 text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      <span className="flex items-center gap-1">
                        <Star
                          size={14}
                          weight="fill"
                          style={{ color: "#F59E0B" }}
                        />
                        {course.rating} ({course.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} weight="duotone" />
                        {course.lessons} {t("courses.lessons")}
                      </span>
                    </div>
                  </CardBody>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
                    <div>
                      <span
                        className="text-lg font-bold"
                        style={{ color: colors.primary.main }}
                      >
                        ${course.price}
                      </span>
                      <span
                        className="text-sm line-through ml-2"
                        style={{ color: colors.text.secondary }}
                      >
                        ${course.originalPrice}
                      </span>
                    </div>
                    <Button
                      size="md"
                      style={{
                        fontWeight: "600",
                        backgroundColor: colors.button.primaryLight.background,
                        color: colors.button.primaryLight.text,
                      }}
                      onPress={() => handleViewDetails(course)}
                    >
                      {t("courses.viewDetails")}
                    </Button>
                  </CardFooter>
                </Card>
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

      {/* Course Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "max-h-[90vh]",
        }}
      >
        <ModalContent style={{ backgroundColor: colors.background.card }}>
          {(onClose) => (
            <>
              <ModalHeader className="p-0 flex-col">
                {/* Course Image */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-t-xl">
                  <img
                    src={selectedCourse?.image}
                    alt={selectedCourse?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {selectedCourse?.isBestseller && (
                    <Chip
                      size="sm"
                      className="absolute top-4 left-4"
                      style={{
                        backgroundColor: colors.primary.main,
                        color: colors.text.white,
                      }}
                    >
                      {t("courses.bestseller")}
                    </Chip>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {selectedCourse?.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "#fff",
                        }}
                      >
                        {selectedCourse?.level}
                      </Chip>
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "#fff",
                        }}
                      >
                        {selectedCourse?.category}
                      </Chip>
                    </div>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="px-6 py-5">
                {/* Instructor Info */}
                <div
                  className="flex items-center gap-4 p-4 rounded-xl mb-5"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <Avatar
                    src={selectedCourse?.tutorAvatar}
                    size="lg"
                    isBordered
                    color="primary"
                  />
                  <div className="flex-1">
                    <p
                      className="font-semibold text-lg"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedCourse?.tutor}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.modal.instructor")} •{" "}
                      {t("courses.modal.verified")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      size={18}
                      weight="fill"
                      style={{ color: "#F59E0B" }}
                    />
                    <span
                      className="font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedCourse?.rating}
                    </span>
                  </div>
                </div>

                {/* Course Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <Star
                      size={28}
                      weight="fill"
                      style={{ color: "#F59E0B" }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedCourse?.rating}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {selectedCourse?.reviews} {t("courses.modal.reviews")}
                    </p>
                  </div>
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <Users
                      size={28}
                      weight="duotone"
                      style={{ color: colors.primary.main }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedCourse?.students?.toLocaleString()}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.modal.students")}
                    </p>
                  </div>
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <BookOpen
                      size={28}
                      weight="duotone"
                      style={{ color: "#10B981" }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedCourse?.lessons}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.lessons")}
                    </p>
                  </div>
                  <div
                    className="text-center p-4 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <Clock
                      size={28}
                      weight="duotone"
                      style={{ color: "#8B5CF6" }}
                      className="mx-auto mb-2"
                    />
                    <p
                      className="font-bold text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedCourse?.duration}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("courses.modal.duration")}
                    </p>
                  </div>
                </div>

                {/* Course Description */}
                <div className="mb-5">
                  <h3
                    className="font-semibold text-lg mb-3"
                    style={{ color: colors.text.primary }}
                  >
                    {t("courses.modal.aboutCourse")}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("courses.modal.description")}
                  </p>
                </div>

                <Divider className="my-4" />

                {/* What You'll Learn */}
                <div className="mb-5">
                  <h3
                    className="font-semibold text-lg mb-3"
                    style={{ color: colors.text.primary }}
                  >
                    {t("courses.modal.whatYouLearn")}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      t("courses.modal.learn1"),
                      t("courses.modal.learn2"),
                      t("courses.modal.learn3"),
                      t("courses.modal.learn4"),
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            backgroundColor: colors.background.primaryLight,
                          }}
                        >
                          <Check
                            size={12}
                            weight="bold"
                            style={{ color: colors.primary.main }}
                          />
                        </div>
                        <span style={{ color: colors.text.secondary }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Course Includes */}
                <div className="mb-5">
                  <h3
                    className="font-semibold text-lg mb-3"
                    style={{ color: colors.text.primary }}
                  >
                    {t("courses.modal.courseIncludes")}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                      <VideoCamera
                        size={20}
                        style={{ color: colors.primary.main }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {selectedCourse?.duration}{" "}
                        {t("courses.modal.onDemandVideo")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText
                        size={20}
                        style={{ color: colors.primary.main }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {t("courses.modal.downloadableResources")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DeviceMobile
                        size={20}
                        style={{ color: colors.primary.main }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {t("courses.modal.mobileAccess")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Certificate
                        size={20}
                        style={{ color: colors.primary.main }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {t("courses.modal.certificateCompletion")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Infinity
                        size={20}
                        style={{ color: colors.primary.main }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {t("courses.modal.lifetimeAccess")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ChatsCircle
                        size={20}
                        style={{ color: colors.primary.main }}
                      />
                      <span style={{ color: colors.text.secondary }}>
                        {t("courses.modal.communityAccess")}
                      </span>
                    </div>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Price Section */}
                <div
                  className="p-5 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-4xl font-bold"
                          style={{ color: colors.primary.main }}
                        >
                          ${selectedCourse?.price}
                        </span>
                        <span
                          className="text-xl line-through"
                          style={{ color: colors.text.secondary }}
                        >
                          ${selectedCourse?.originalPrice}
                        </span>
                        <Chip
                          size="sm"
                          style={{
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            color: "#10B981",
                          }}
                        >
                          {Math.round(
                            ((selectedCourse?.originalPrice -
                              selectedCourse?.price) /
                              selectedCourse?.originalPrice) *
                              100,
                          )}
                          % {t("courses.modal.off")}
                        </Chip>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("courses.modal.moneyBackGuarantee")}
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="px-6 py-4 gap-3">
                <Button
                  variant="flat"
                  size="lg"
                  onPress={onClose}
                  className="flex-1 font-semibold"
                  style={{ color: colors.text.secondary }}
                >
                  {t("courses.modal.close")}
                </Button>
                <Button
                  color="primary"
                  size="lg"
                  className="flex-1 font-semibold"
                  onPress={() => {
                    onClose();
                    navigate("/register");
                  }}
                >
                  {t("courses.modal.enrollNow")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Footer />
    </div>
  );
};

export default Courses;
