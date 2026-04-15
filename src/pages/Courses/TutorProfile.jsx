import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Card, CardBody, Chip, Spinner } from "@heroui/react";
import * as MotionLib from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import CourseCardSkeleton from "../../components/CourseCardSkeleton/CourseCardSkeleton";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  ArrowLeft,
  GraduationCap,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { tutorApi, coursesApi } from "../../api";
import searchIllustration from "../../assets/illustrations/search.avif";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const TutorProfile = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();

  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingTutor, setLoadingTutor] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoadingTutor(true);
        const res = await tutorApi.getTutorById(tutorId);
        setTutor(res.data);
      } catch (err) {
        console.error("Failed to fetch tutor:", err);
      } finally {
        setLoadingTutor(false);
      }
    };

    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await coursesApi.getAllCourses({
          TutorId: tutorId,
          Status: "Published",
          "page-size": 50,
        });
        setCourses(res.data?.items || []);
      } catch (err) {
        console.error("Failed to fetch tutor courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (tutorId) {
      fetchTutor();
      fetchCourses();
    }
  }, [tutorId]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.light }}
    >
      <Header />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        {/* Tutor info section */}
        {loadingTutor ? (
          <Card
            className="shadow-none mb-8"
            style={{ backgroundColor: colors.background.gray }}
          >
            <CardBody className="p-8 flex items-center justify-center min-h-[200px]">
              <Spinner size="lg" color="success" />
            </CardBody>
          </Card>
        ) : tutor ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="shadow-none mb-8"
              style={{ backgroundColor: colors.background.gray }}
            >
              <CardBody className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <Avatar
                    src={tutor.avatar}
                    name={`${tutor.user?.firstName} ${tutor.user?.lastName}`}
                    className="w-24 h-24 text-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h1
                      className="text-2xl font-bold mb-1"
                      style={{ color: colors.text.primary }}
                    >
                      {tutor.user?.firstName} {tutor.user?.lastName}
                    </h1>
                    {tutor.headline && (
                      <p
                        className="text-base mb-4"
                        style={{ color: colors.text.secondary }}
                      >
                        {tutor.headline}
                      </p>
                    )}

                    {tutor.user?.email && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <EnvelopeSimple
                          size={18}
                          style={{ color: colors.primary.main }}
                        />
                        <a
                          href={`mailto:${tutor.user.email}`}
                          className="text-sm hover:underline"
                          style={{ color: colors.text.secondary }}
                        >
                          {tutor.user.email}
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Star
                          size={18}
                          weight="fill"
                          style={{ color: "#f59e0b" }}
                        />
                        <span
                          className="font-semibold text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {tutor.ratingAverage?.toFixed(1) || "0.0"}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: colors.text.tertiary }}
                        >
                          ({tutor.ratingCount || 0}{" "}
                          {t("courses.detail.reviews")})
                        </span>
                      </div>
                      {tutor.monthExperience > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Clock
                            size={18}
                            style={{ color: colors.primary.main }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {tutor.monthExperience}{" "}
                            {t("courses.detail.monthsExperience")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <BookOpen
                          size={18}
                          style={{ color: colors.primary.main }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {courses.length} {t("tutorProfile.courses")}
                        </span>
                      </div>
                    </div>

                    {tutor.bio && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: colors.text.secondary }}
                      >
                        {tutor.bio}
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ) : (
          <Card
            className="shadow-none mb-8"
            style={{ backgroundColor: colors.background.gray }}
          >
            <CardBody className="p-8 text-center">
              <p style={{ color: colors.text.secondary }}>
                {t("tutorProfile.notFound")}
              </p>
            </CardBody>
          </Card>
        )}

        {/* Courses section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2
            className="text-xl font-bold mb-6"
            style={{ color: colors.text.primary }}
          >
            <GraduationCap
              size={24}
              weight="duotone"
              className="inline-block mr-2 -mt-0.5"
              style={{ color: colors.primary.main }}
            />
            {t("tutorProfile.coursesBy", {
              name: tutor
                ? `${tutor.user?.firstName} ${tutor.user?.lastName}`
                : "",
            })}
          </h2>

          {loadingCourses ? (
            <CourseCardSkeleton
              count={4}
              cardBgColor={colors.background.gray}
            />
          ) : courses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showCategory
                  style={{ backgroundColor: colors.background.gray }}
                />
              ))}
            </div>
          ) : (
            <Card
              className="shadow-none"
              style={{ backgroundColor: colors.background.gray }}
            >
              <CardBody className="flex flex-col items-center justify-center py-12">
                <img
                  src={searchIllustration}
                  alt="No courses"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-36 h-36 object-contain mb-4 opacity-80"
                />
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  {t("tutorProfile.noCourses")}
                </p>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TutorProfile;
