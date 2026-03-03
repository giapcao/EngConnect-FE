import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";
import * as MotionLib from "framer-motion";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTheme } from "../../../contexts/ThemeContext";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Check,
  VideoCamera,
  FileText,
  DeviceMobile,
  Certificate,
  Infinity,
  ChatsCircle,
  ArrowLeft,
  PencilSimple,
} from "@phosphor-icons/react";

// Temporary mock data - will be replaced with API call
const coursesData = [
  {
    id: 1,
    title: "Business English Masterclass",
    tutor: "Sarah Johnson",
    tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
    tutorBio:
      "Experienced business English instructor with 10+ years in corporate training.",
    rating: 4.9,
    reviews: 234,
    students: 1250,
    lessons: 20,
    duration: "10 hours",
    price: 199,
    originalPrice: 299,
    level: "Intermediate",
    category: "Business",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    status: "published",
  },
  {
    id: 2,
    title: "IELTS Preparation Course",
    tutor: "Sarah Johnson",
    tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
    tutorBio: "IELTS examiner and preparation specialist with proven results.",
    rating: 4.8,
    reviews: 189,
    students: 980,
    lessons: 24,
    duration: "12 hours",
    price: 249,
    originalPrice: 349,
    level: "Advanced",
    category: "Exam Prep",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    status: "published",
  },
  {
    id: 3,
    title: "Conversational English",
    tutor: "Sarah Johnson",
    tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
    tutorBio:
      "Native speaker focused on building natural conversational fluency.",
    rating: 5.0,
    reviews: 156,
    students: 28,
    lessons: 15,
    duration: "8 hours",
    price: 149,
    originalPrice: 249,
    level: "Beginner",
    category: "Speaking",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    status: "published",
  },
  {
    id: 4,
    title: "Academic Writing",
    tutor: "Sarah Johnson",
    tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
    tutorBio:
      "Published author and academic writing coach for international students.",
    rating: 0,
    reviews: 0,
    students: 0,
    lessons: 12,
    duration: "6 hours",
    price: 179,
    originalPrice: 279,
    level: "Advanced",
    category: "Writing",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    status: "draft",
  },
];

const TutorCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();

  const course = coursesData.find((c) => c.id === parseInt(id));

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          {t("courses.detail.notFound")}
        </h2>
        <Button
          color="primary"
          variant="flat"
          startContent={<ArrowLeft size={18} />}
          onPress={() => navigate("/tutor/my-courses")}
        >
          {t("courses.detail.backToCourses")}
        </Button>
      </div>
    );
  }

  const discountPercent = course.originalPrice
    ? Math.round(
        ((course.originalPrice - course.price) / course.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="light"
          startContent={<ArrowLeft size={18} />}
          onPress={() => navigate("/tutor/my-courses")}
          style={{ color: colors.text.secondary }}
        >
          {t("courses.detail.backToCourses")}
        </Button>
        <Button
          color="primary"
          startContent={<PencilSimple size={18} />}
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
        >
          {t("tutorDashboard.myCourses.editCourse")}
        </Button>
      </motion.div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          shadow="none"
          className="border-none overflow-hidden"
          style={{
            background: theme === "dark" ? colors.background.light : "#DBEAFE",
          }}
        >
          <CardBody className="p-6 md:p-8 lg:pb-16">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {course.status && (
                    <Chip
                      size="sm"
                      className="font-semibold"
                      style={{
                        backgroundColor:
                          course.status === "published"
                            ? colors.state.success
                            : colors.state.warning,
                        color: "#fff",
                      }}
                    >
                      {course.status === "published"
                        ? t("tutorDashboard.myCourses.published")
                        : t("tutorDashboard.myCourses.draft")}
                    </Chip>
                  )}
                  <Chip
                    size="sm"
                    style={{
                      backgroundColor: colors.background.primaryLight,
                      color: colors.primary.main,
                    }}
                  >
                    {course.level}
                  </Chip>
                  <Chip
                    size="sm"
                    style={{
                      backgroundColor: colors.background.primaryLight,
                      color: colors.primary.main,
                    }}
                  >
                    {course.category}
                  </Chip>
                </div>

                <h1
                  className="text-2xl lg:text-3xl font-bold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  {course.title}
                </h1>

                <p
                  className="text-base mb-5 leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  {t("courses.detail.description")}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 flex-wrap">
                  {course.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            weight="fill"
                            style={{
                              color:
                                i < Math.floor(course.rating)
                                  ? "#F59E0B"
                                  : "rgba(0,0,0,0.1)",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {course.rating}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        ({course.reviews?.toLocaleString()}{" "}
                        {t("courses.detail.ratings")})
                      </span>
                    </div>
                  )}
                  <span
                    className="text-sm flex items-center gap-1.5"
                    style={{ color: colors.text.secondary }}
                  >
                    <Users size={16} weight="duotone" />
                    {course.students?.toLocaleString()}{" "}
                    {t("courses.detail.students")}
                  </span>
                </div>
              </div>

              {/* Empty space for sticky card overlap */}
              <div className="hidden lg:block" />
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="text-center p-5">
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
                  {course.rating || "N/A"}
                </p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  {course.reviews} {t("courses.detail.reviews")}
                </p>
              </CardBody>
            </Card>
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="text-center p-5">
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
                  {course.students?.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  {t("courses.detail.students")}
                </p>
              </CardBody>
            </Card>
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="text-center p-5">
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
                  {course.lessons}
                </p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  {t("courses.lessons")}
                </p>
              </CardBody>
            </Card>
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="text-center p-5">
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
                  {course.duration}
                </p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  {t("courses.detail.duration")}
                </p>
              </CardBody>
            </Card>
          </motion.div>

          {/* About This Course */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <h2
                  className="font-semibold text-xl mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("courses.detail.aboutCourse")}
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  {t("courses.detail.description")}
                </p>
              </CardBody>
            </Card>
          </motion.div>

          {/* What You'll Learn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <h2
                  className="font-semibold text-xl mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("courses.detail.whatYouLearn")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    t("courses.detail.learn1"),
                    t("courses.detail.learn2"),
                    t("courses.detail.learn3"),
                    t("courses.detail.learn4"),
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: colors.background.primaryLight,
                        }}
                      >
                        <Check
                          size={14}
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
              </CardBody>
            </Card>
          </motion.div>

          {/* Course Includes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                <h2
                  className="font-semibold text-xl mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("courses.detail.courseIncludes")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <VideoCamera
                      size={22}
                      style={{ color: colors.primary.main }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {course.duration} {t("courses.detail.onDemandVideo")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText
                      size={22}
                      style={{ color: colors.primary.main }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {t("courses.detail.downloadableResources")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DeviceMobile
                      size={22}
                      style={{ color: colors.primary.main }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {t("courses.detail.mobileAccess")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Certificate
                      size={22}
                      style={{ color: colors.primary.main }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {t("courses.detail.certificateCompletion")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Infinity
                      size={22}
                      style={{ color: colors.primary.main }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {t("courses.detail.lifetimeAccess")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ChatsCircle
                      size={22}
                      style={{ color: colors.primary.main }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {t("courses.detail.communityAccess")}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Sticky Price Card (overlaps banner) */}
        <div className="lg:col-span-1 lg:-mt-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:sticky lg:top-40"
          >
            <Card
              className="shadow-lg overflow-hidden"
              style={{ backgroundColor: colors.background.light }}
            >
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardBody className="p-6 space-y-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: colors.primary.main }}
                    >
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <>
                        <span
                          className="text-lg line-through"
                          style={{ color: colors.text.secondary }}
                        >
                          ${course.originalPrice}
                        </span>
                        {discountPercent > 0 && (
                          <Chip
                            size="sm"
                            style={{
                              backgroundColor: "rgba(16, 185, 129, 0.1)",
                              color: "#10B981",
                            }}
                          >
                            {discountPercent}% {t("courses.detail.off")}
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <Divider />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <Clock size={16} weight="duotone" />
                      {t("courses.detail.duration")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <BookOpen size={16} weight="duotone" />
                      {t("courses.detail.level")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <Users size={16} weight="duotone" />
                      {t("courses.detail.studentsEnrolled")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {course.students?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="flex items-center gap-2"
                      style={{ color: colors.text.secondary }}
                    >
                      <BookOpen size={16} weight="duotone" />
                      {t("courses.lessons")}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {course.lessons}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TutorCourseDetail;
