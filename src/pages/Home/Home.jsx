import { useState, useEffect } from "react";
import { Button, Card, CardBody, Image, Chip } from "@heroui/react";
import CourseCardSkeleton from "../../components/CourseCardSkeleton/CourseCardSkeleton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Award,
  Calendar,
  BookOpen,
  Users,
  Star,
  ArrowRight,
  Globe,
  // Clock,
  TrendingUp,
  Sparkles,
  User,
} from "lucide-react";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import { coursesApi } from "../../api";
import {
  IdentificationBadge,
  CalendarDots,
  BookOpenUser,
  Tag,
  UserList,
  Clock,
  Laptop,
} from "@phosphor-icons/react";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// Import images
import heroImage from "../../assets/images/poster.png";
import avatarDylan from "../../assets/images/avatar-dylan.png";
import avatarKaius from "../../assets/images/avatar-kaius.png";
import avatarEira from "../../assets/images/avatar-eira.png";
import avatarZane from "../../assets/images/avatar-zane.png";
import avatarSelene from "../../assets/images/avatar-selene.png";
import avatarTalon from "../../assets/images/avatar-talon.png";
import tutorProfile1 from "../../assets/images/tutor-profile-1.png";
import tutorProfile2 from "../../assets/images/tutor-profile-2.png";
import tutorProfile3 from "../../assets/images/tutor-profile-3.png";
import aiImage from "../../assets/illustrations/ai.avif";
import videoImage from "../../assets/illustrations/video.avif";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    coursesApi
      .getAllCourses({ Status: "Published", "page-size": 4 })
      .then((res) => setFeaturedCourses(res?.data?.items || []))
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Dylan Field",
      role: "CEO at Figma",
      quote:
        "EngConnect transformed my English learning journey. The tutors are incredibly patient and the lessons are perfectly tailored to my needs.",
      avatar: avatarDylan,
      rating: 5,
    },
    {
      id: 2,
      name: "Kaius Moreau",
      role: "Marketing Specialist",
      quote:
        "The flexibility and quality of tutors are unmatched. I can learn anytime that fits my busy schedule.",
      avatar: avatarKaius,
      rating: 5,
    },
    {
      id: 3,
      name: "Eira Nolan",
      role: "Freelance Writer",
      quote:
        "I achieved my language goals faster than expected. The AI-powered feedback is a game changer!",
      avatar: avatarEira,
      rating: 5,
    },
    {
      id: 4,
      name: "Zane Thorne",
      role: "Project Manager",
      quote:
        "A truly personalized learning journey. Every lesson feels like it was made just for me.",
      avatar: avatarZane,
      rating: 5,
    },
    {
      id: 5,
      name: "Selene Hart",
      role: "Graphic Designer",
      quote:
        "Highly recommend for anyone serious about learning. The platform is intuitive and the results speak for themselves.",
      avatar: avatarSelene,
      rating: 5,
    },
    {
      id: 6,
      name: "Talon Rowe",
      role: "Accountant",
      quote:
        "Exceptional value for the quality of education. Best investment I've made in myself.",
      avatar: avatarTalon,
      rating: 5,
    },
  ];

  const features = [
    {
      icon: (props) => <IdentificationBadge weight="duotone" {...props} />,
      title: t("home.features.expertTutors.title"),
      description: t("home.features.expertTutors.description"),
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      icon: (props) => <CalendarDots weight="duotone" {...props} />,
      title: t("home.features.flexibleSchedule.title"),
      description: t("home.features.flexibleSchedule.description"),
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      icon: (props) => <BookOpenUser weight="duotone" {...props} />,
      title: t("home.features.customCurriculum.title"),
      description: t("home.features.customCurriculum.description"),
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      icon: (props) => <Tag weight="duotone" {...props} />,
      title: t("home.features.affordablePricing.title"),
      description: t("home.features.affordablePricing.description"),
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{
                  backgroundColor: colors.background.primaryLight,
                  color: colors.primary.main,
                }}
              >
                <Sparkles className="inline-block mr-2 w-4 h-4" />
                {t("home.hero.badge")}
              </span>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("home.hero.title")}{" "}
                <span style={{ color: colors.primary.main }}>
                  {t("home.hero.titleHighlight")}
                </span>
              </h1>

              <p
                className="text-lg mb-8 max-w-xl leading-relaxed"
                style={{ color: colors.text.secondary }}
              >
                {t("home.hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  size="lg"
                  radius="full"
                  className="font-semibold text-lg px-8 h-14"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => navigate("/register")}
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  {t("home.hero.startLearning")}
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <Image
                isBlurred
                src={heroImage}
                alt="Online learning interface"
                className="w-full h-auto rounded-2xl m-3"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              {t("home.features.title")}{" "}
              <span style={{ color: colors.primary.main }}>EngConnect?</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              {t("home.features.description")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className="h-full hover:border-primary transition-colors shadow-none"
                  style={{
                    backgroundColor: colors.background.gray,
                  }}
                >
                  <CardBody className="p-6 text-center flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: feature.bgColor,
                      }}
                    >
                      <feature.icon
                        className="w-7 h-7"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: colors.text.primary }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: colors.text.secondary }}>
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 1-on-1 Video Learning Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("home.videoSection.title")}{" "}
                <span
                  style={{ color: colors.primary.main }}
                  className="whitespace-pre-line"
                >
                  {t("home.videoSection.titleHighlight")}
                </span>
              </h2>
              <p
                className="text-lg mb-6 leading-relaxed"
                style={{ color: colors.text.secondary }}
              >
                {t("home.videoSection.description")}
              </p>
              <ul className="space-y-4">
                {[
                  {
                    icon: (props) => <Laptop weight="duotone" {...props} />,
                    text: t("home.videoSection.feature1"),
                    color: "#3B82F6",
                  },
                  {
                    icon: (props) => <Clock weight="duotone" {...props} />,
                    text: t("home.videoSection.feature2"),
                    color: "#10B981",
                  },
                  {
                    icon: (props) => <UserList weight="duotone" {...props} />,
                    text: t("home.videoSection.feature3"),
                    color: "#F59E0B",
                  },
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${feature.color}15`,
                      }}
                    >
                      {feature.icon({
                        className: "w-5 h-5",
                        style: { color: feature.color },
                      })}
                    </div>
                    <span style={{ color: colors.text.secondary }}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <img
                src={videoImage}
                alt="1-on-1 video learning"
                className="w-full max-w-md h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI-Powered Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="hidden lg:flex justify-center"
            >
              <img
                src={aiImage}
                alt="AI-powered learning"
                className="w-full max-w-md h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t("home.aiSection.title")}{" "}
                <span style={{ color: colors.primary.main }}>
                  {t("home.aiSection.titleHighlight")}
                </span>
              </h2>
              <p
                className="text-lg mb-6 leading-relaxed"
                style={{ color: colors.text.secondary }}
              >
                {t("home.aiSection.description")}
              </p>
              <ul className="space-y-4">
                {[
                  t("home.aiSection.feature1"),
                  t("home.aiSection.feature2"),
                  t("home.aiSection.feature3"),
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: colors.background.primaryLight,
                      }}
                    >
                      <Sparkles
                        className="w-4 h-4"
                        style={{ color: colors.primary.main }}
                      />
                    </div>
                    <span style={{ color: colors.text.secondary }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              {t("home.courses.title")}{" "}
              <span style={{ color: colors.primary.main }}>
                {t("home.courses.titleHighlight")}
              </span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              {t("home.courses.description")}
            </p>
          </motion.div>

          {coursesLoading ? (
            <CourseCardSkeleton
              count={4}
              cardBgColor={colors.background.light}
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredCourses.map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <CourseCard course={course} showTutorInfo={false} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Button
              size="lg"
              radius="full"
              className="font-semibold px-8"
              style={{
                borderColor: colors.primary.main,
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              endContent={<ArrowRight className="w-5 h-5" />}
              onPress={() => navigate("/courses")}
            >
              {t("home.courses.viewAll")}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ backgroundColor: colors.background.light }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              {t("home.tutors.title")}{" "}
              <span style={{ color: colors.primary.main }}>
                {t("home.tutors.titleHighlight")}
              </span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              {t("home.tutors.description")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {[
              {
                name: "Sarah Chen",
                specialty: "Business English",
                rating: 5,
                lessons: 1200,
                image: tutorProfile1,
              },
              {
                name: "James Wilson",
                specialty: "IELTS Preparation",
                rating: 4.9,
                lessons: 980,
                image: tutorProfile2,
              },
              {
                name: "Emma Taylor",
                specialty: "Conversational English",
                rating: 5,
                lessons: 1500,
                image: tutorProfile3,
              },
              {
                name: "Michael Brown",
                specialty: "Academic Writing",
                rating: 4.9,
                lessons: 850,
                image: tutorProfile1,
              },
              {
                name: "Lisa Anderson",
                specialty: "Pronunciation Coach",
                rating: 5,
                lessons: 1100,
                image: tutorProfile3,
              },
            ].map((tutor) => (
              <motion.div key={tutor.name} variants={itemVariants}>
                <Card
                  className="shadow-none"
                  style={{
                    backgroundColor: colors.background.gray,
                  }}
                >
                  <CardBody className="p-0">
                    <div className="relative p-3">
                      <div className="relative aspect-square overflow-hidden rounded-xl">
                        <img
                          src={tutor.image}
                          alt={tutor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-4 pt-0 text-center">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: colors.text.primary }}
                      >
                        {tutor.name}
                      </h3>
                      <Chip
                        size="sm"
                        variant="flat"
                        className="mb-6 text-xs"
                        style={{
                          backgroundColor: colors.background.primaryLight,
                          color: colors.primary.main,
                        }}
                      >
                        {tutor.specialty}
                      </Chip>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star
                            className="w-4 h-4"
                            fill={colors.state.warning}
                            color={colors.state.warning}
                          />
                          <span
                            className="font-semibold text-sm"
                            style={{ color: colors.text.primary }}
                          >
                            {tutor.rating}
                          </span>
                        </div>
                        <span
                          style={{ color: colors.text.secondary }}
                          className="text-sm"
                        >
                          {tutor.lessons}+ {t("home.tutors.lessons")}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 px-6 md:px-12 overflow-hidden"
        style={{ backgroundColor: colors.background.gray }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              {t("home.testimonials.title")}{" "}
              <span style={{ color: colors.primary.main }}>
                {t("home.testimonials.titleHighlight")}
              </span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              {t("home.testimonials.description")}
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex-shrink-0 w-80"
                >
                  <Card
                    className="h-full shadow-none"
                    style={{
                      backgroundColor: colors.background.light,
                      borderColor: colors.border.light,
                    }}
                  >
                    <CardBody className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }, (_, i) => (
                          <Star
                            key={`rating-star-${testimonial.id}-${i}`}
                            className="w-4 h-4"
                            fill={colors.state.warning}
                            color={colors.state.warning}
                          />
                        ))}
                      </div>
                      <p
                        className="leading-relaxed mb-6"
                        style={{ color: colors.text.secondary }}
                      >
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: colors.text.primary }}
                          >
                            {testimonial.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((testimonial, index) => (
              <button
                key={`dot-${testimonial.id}`}
                onClick={() => setActiveTestimonial(index)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor:
                    index === activeTestimonial
                      ? colors.primary.main
                      : colors.border.medium,
                  width: index === activeTestimonial ? "24px" : "8px",
                }}
              />
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
              {t("home.cta.title")}
            </h2>
            <p
              className="text-lg mb-10 max-w-2xl mx-auto opacity-90"
              style={{ color: colors.text.white }}
            >
              {t("home.cta.description")}
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
                {t("home.cta.button")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
