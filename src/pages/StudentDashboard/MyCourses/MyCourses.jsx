import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Progress,
  Chip,
  Tabs,
  Tab,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  ArrowRight,
  Trophy,
  Star,
} from "@phosphor-icons/react";

const MyCourses = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedTab, setSelectedTab] = useState("in-progress");

  const courses = {
    "in-progress": [
      {
        id: 1,
        title: "Business English Masterclass",
        tutor: "Sarah Johnson",
        progress: 65,
        lessonsCompleted: 13,
        totalLessons: 20,
        nextLesson: "Meeting Skills - Part 2",
        lastAccessed: "2 hours ago",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      },
      {
        id: 2,
        title: "IELTS Band 7+ Preparation",
        tutor: "Michael Chen",
        progress: 40,
        lessonsCompleted: 12,
        totalLessons: 30,
        nextLesson: "Writing Task 2 - Opinion Essays",
        lastAccessed: "1 day ago",
        image:
          "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      },
      {
        id: 3,
        title: "English for Beginners",
        tutor: "Emma Wilson",
        progress: 90,
        lessonsCompleted: 22,
        totalLessons: 25,
        nextLesson: "Past Tense Review",
        lastAccessed: "3 hours ago",
        image:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
      },
    ],
    completed: [
      {
        id: 4,
        title: "English Grammar Basics",
        tutor: "David Brown",
        progress: 100,
        lessonsCompleted: 15,
        totalLessons: 15,
        completedDate: "Nov 15, 2024",
        certificate: true,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400",
      },
      {
        id: 5,
        title: "Pronunciation Workshop",
        tutor: "Lisa Anderson",
        progress: 100,
        lessonsCompleted: 10,
        totalLessons: 10,
        completedDate: "Oct 28, 2024",
        certificate: true,
        rating: 4,
        image:
          "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400",
      },
    ],
    wishlist: [
      {
        id: 6,
        title: "Advanced Business Writing",
        tutor: "James Wilson",
        price: 59.99,
        originalPrice: 99.99,
        rating: 4.8,
        students: 890,
        image:
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      },
      {
        id: 7,
        title: "Public Speaking in English",
        tutor: "Anna Martinez",
        price: 44.99,
        originalPrice: 79.99,
        rating: 4.7,
        students: 1200,
        image:
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
      },
    ],
  };

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
          {t("studentDashboard.myCourses.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("studentDashboard.myCourses.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4 text-center">
            <p
              className="text-3xl font-bold"
              style={{ color: colors.primary.main }}
            >
              {courses["in-progress"].length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {t("studentDashboard.myCourses.inProgress")}
            </p>
          </CardBody>
        </Card>
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4 text-center">
            <p
              className="text-3xl font-bold"
              style={{ color: colors.state.success }}
            >
              {courses.completed.length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {t("studentDashboard.myCourses.completed")}
            </p>
          </CardBody>
        </Card>
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4 text-center">
            <p
              className="text-3xl font-bold"
              style={{ color: colors.state.warning }}
            >
              {courses.wishlist.length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {t("studentDashboard.myCourses.wishlist")}
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          variant="underlined"
          classNames={{
            tabList: "gap-6",
            cursor: `bg-[${colors.primary.main}]`,
            tab: "px-0 h-12",
          }}
        >
          <Tab
            key="in-progress"
            title={
              <div className="flex items-center gap-2">
                <BookOpen weight="duotone" className="w-5 h-5" />
                <span>{t("studentDashboard.myCourses.inProgress")}</span>
                <Chip size="sm" variant="flat">
                  {courses["in-progress"].length}
                </Chip>
              </div>
            }
          />
          <Tab
            key="completed"
            title={
              <div className="flex items-center gap-2">
                <CheckCircle weight="duotone" className="w-5 h-5" />
                <span>{t("studentDashboard.myCourses.completed")}</span>
                <Chip size="sm" variant="flat">
                  {courses.completed.length}
                </Chip>
              </div>
            }
          />
          <Tab
            key="wishlist"
            title={
              <div className="flex items-center gap-2">
                <Star weight="duotone" className="w-5 h-5" />
                <span>{t("studentDashboard.myCourses.wishlist")}</span>
                <Chip size="sm" variant="flat">
                  {courses.wishlist.length}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </motion.div>

      {/* Course List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {selectedTab === "in-progress" &&
          courses["in-progress"].map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full md:w-48 h-32 object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className="text-lg font-semibold mb-1"
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

                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Clock
                                weight="duotone"
                                className="w-4 h-4"
                                style={{ color: colors.text.secondary }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: colors.text.secondary }}
                              >
                                {course.lastAccessed}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen
                                weight="duotone"
                                className="w-4 h-4"
                                style={{ color: colors.text.secondary }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: colors.text.secondary }}
                              >
                                {course.lessonsCompleted}/{course.totalLessons}{" "}
                                {t("studentDashboard.myCourses.lessons")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Progress
                              value={course.progress}
                              size="sm"
                              color="primary"
                              className="flex-1 max-w-xs"
                            />
                            <span
                              className="text-sm font-semibold"
                              style={{ color: colors.primary.main }}
                            >
                              {course.progress}%
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            style={{
                              backgroundColor: colors.primary.main,
                              color: colors.text.white,
                            }}
                            startContent={
                              <Play weight="fill" className="w-4 h-4" />
                            }
                          >
                            {t("studentDashboard.myCourses.continue")}
                          </Button>
                          <p
                            className="text-xs text-center"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("studentDashboard.myCourses.nextLesson")}:{" "}
                            {course.nextLesson}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}

        {selectedTab === "completed" &&
          courses.completed.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full md:w-48 h-32 object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        <CheckCircle
                          weight="fill"
                          className="w-12 h-12"
                          style={{ color: colors.state.success }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className="text-lg font-semibold"
                              style={{ color: colors.text.primary }}
                            >
                              {course.title}
                            </h3>
                            {course.certificate && (
                              <Trophy
                                weight="duotone"
                                className="w-5 h-5"
                                style={{ color: colors.state.warning }}
                              />
                            )}
                          </div>
                          <p
                            className="text-sm mb-3"
                            style={{ color: colors.text.secondary }}
                          >
                            {course.tutor}
                          </p>

                          <div className="flex items-center gap-4">
                            <Chip
                              size="sm"
                              variant="flat"
                              startContent={
                                <CheckCircle
                                  weight="fill"
                                  className="w-4 h-4"
                                  style={{ color: colors.state.success }}
                                />
                              }
                              style={{
                                backgroundColor: `${colors.state.success}20`,
                                color: colors.state.success,
                              }}
                            >
                              {t("studentDashboard.myCourses.completedOn")}{" "}
                              {course.completedDate}
                            </Chip>

                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  weight={
                                    i < course.rating ? "fill" : "regular"
                                  }
                                  className="w-4 h-4"
                                  style={{
                                    color:
                                      i < course.rating
                                        ? colors.state.warning
                                        : colors.text.secondary,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {course.certificate && (
                            <Button
                              variant="bordered"
                              startContent={
                                <Trophy weight="duotone" className="w-4 h-4" />
                              }
                            >
                              {t("studentDashboard.myCourses.viewCertificate")}
                            </Button>
                          )}
                          <Button
                            variant="light"
                            endContent={<ArrowRight className="w-4 h-4" />}
                            style={{ color: colors.primary.main }}
                          >
                            {t("studentDashboard.myCourses.reviewCourse")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}

        {selectedTab === "wishlist" &&
          courses.wishlist.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full md:w-48 h-32 object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className="text-lg font-semibold mb-1"
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

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star
                                weight="fill"
                                className="w-4 h-4"
                                style={{ color: colors.state.warning }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                {course.rating}
                              </span>
                            </div>
                            <span
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {course.students.toLocaleString()}{" "}
                              {t("studentDashboard.myCourses.students")}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className="text-xl font-bold"
                              style={{ color: colors.primary.main }}
                            >
                              ${course.price}
                            </p>
                            <p
                              className="text-sm line-through"
                              style={{ color: colors.text.secondary }}
                            >
                              ${course.originalPrice}
                            </p>
                          </div>
                          <Button
                            style={{
                              backgroundColor: colors.primary.main,
                              color: colors.text.white,
                            }}
                          >
                            {t("studentDashboard.myCourses.enrollNow")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default MyCourses;
