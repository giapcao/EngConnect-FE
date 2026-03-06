import { useState } from "react";
import { Card, CardBody, Button, Avatar, Chip, Tabs, Tab } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  CalendarDots,
  Clock,
  VideoCamera,
  CaretLeft,
  CaretRight,
  Plus,
  MapPin,
  User,
} from "@phosphor-icons/react";

const Schedule = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedTab, setSelectedTab] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDays = getWeekDays();

  const lessons = [
    {
      id: 1,
      title: "Business English - Meeting Skills",
      tutor: "Sarah Johnson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
      date: new Date().toDateString(),
      time: "10:00 AM",
      duration: "45 min",
      type: "video",
      status: "upcoming",
    },
    {
      id: 2,
      title: "IELTS Writing Task 2",
      tutor: "Michael Chen",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor2",
      date: new Date().toDateString(),
      time: "2:00 PM",
      duration: "60 min",
      type: "video",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Conversational English",
      tutor: "Emma Wilson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor3",
      date: new Date(Date.now() + 86400000).toDateString(),
      time: "9:00 AM",
      duration: "30 min",
      type: "video",
      status: "scheduled",
    },
    {
      id: 4,
      title: "Grammar Review Session",
      tutor: "David Brown",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor4",
      date: new Date(Date.now() + 172800000).toDateString(),
      time: "11:00 AM",
      duration: "45 min",
      type: "video",
      status: "scheduled",
    },
    {
      id: 5,
      title: "Pronunciation Practice",
      tutor: "Lisa Anderson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor5",
      date: new Date(Date.now() + 259200000).toDateString(),
      time: "3:00 PM",
      duration: "30 min",
      type: "video",
      status: "scheduled",
    },
  ];

  const todayLessons = lessons.filter(
    (lesson) => lesson.date === new Date().toDateString(),
  );

  const upcomingLessons = lessons.filter(
    (lesson) => new Date(lesson.date) > new Date(),
  );

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasLessons = (date) => {
    return lessons.some((lesson) => lesson.date === date.toDateString());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            {t("studentDashboard.schedule.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("studentDashboard.schedule.subtitle")}
          </p>
        </div>
        <Button
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
          startContent={<Plus weight="bold" className="w-5 h-5" />}
        >
          {t("studentDashboard.schedule.bookLesson")}
        </Button>
      </motion.div>

      {/* Calendar Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card
          shadow="none" className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4">
            {/* Month & Navigation */}
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => navigateWeek(-1)}
                >
                  <CaretLeft
                    weight="bold"
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                </Button>
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => setCurrentDate(new Date())}
                >
                  {t("studentDashboard.schedule.today")}
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => navigateWeek(1)}
                >
                  <CaretRight
                    weight="bold"
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                </Button>
              </div>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  className={`p-3 rounded-xl text-center transition-all ${
                    isToday(day) ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: isToday(day)
                      ? colors.background.primaryLight
                      : hasLessons(day)
                        ? colors.background.gray
                        : "transparent",
                    ringColor: colors.primary.main,
                  }}
                  onClick={() => setCurrentDate(day)}
                >
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: colors.text.secondary }}
                  >
                    {daysOfWeek[day.getDay()]}
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isToday(day) ? "" : ""
                    }`}
                    style={{
                      color: isToday(day)
                        ? colors.primary.main
                        : colors.text.primary,
                    }}
                  >
                    {day.getDate()}
                  </p>
                  {hasLessons(day) && (
                    <div
                      className="w-2 h-2 rounded-full mx-auto mt-1"
                      style={{ backgroundColor: colors.primary.main }}
                    />
                  )}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Today's Lessons */}
      {todayLessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            <CalendarDots
              weight="duotone"
              className="w-5 h-5 inline-block mr-2"
              style={{ color: colors.primary.main }}
            />
            {t("studentDashboard.schedule.todayLessons")} ({todayLessons.length}
            )
          </h2>

          <div className="space-y-3">
            {todayLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <Card
                  shadow="none" className="border-none"
                  style={{ backgroundColor: colors.background.light }}
                >
                  <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-xl flex flex-col items-center justify-center"
                          style={{
                            backgroundColor: colors.background.primaryLight,
                          }}
                        >
                          <span
                            className="text-xs"
                            style={{ color: colors.primary.main }}
                          >
                            {lesson.time.split(" ")[1]}
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ color: colors.primary.main }}
                          >
                            {lesson.time.split(" ")[0]}
                          </span>
                        </div>

                        <div>
                          <h3
                            className="font-semibold mb-1"
                            style={{ color: colors.text.primary }}
                          >
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar
                              src={lesson.tutorAvatar}
                              size="sm"
                              className="w-6 h-6"
                            />
                            <span
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {lesson.tutor}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Chip
                              size="sm"
                              variant="flat"
                              startContent={
                                <Clock weight="duotone" className="w-3 h-3" />
                              }
                              style={{
                                backgroundColor: colors.background.gray,
                                color: colors.text.secondary,
                              }}
                            >
                              {lesson.duration}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="flat"
                              startContent={
                                <VideoCamera
                                  weight="duotone"
                                  className="w-3 h-3"
                                />
                              }
                              style={{
                                backgroundColor: colors.background.gray,
                                color: colors.text.secondary,
                              }}
                            >
                              {t("studentDashboard.schedule.videoCall")}
                            </Chip>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="bordered" size="sm">
                          {t("studentDashboard.schedule.reschedule")}
                        </Button>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: colors.primary.main,
                            color: colors.text.white,
                          }}
                          startContent={
                            <VideoCamera weight="fill" className="w-4 h-4" />
                          }
                        >
                          {t("studentDashboard.schedule.joinNow")}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Lessons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: colors.text.primary }}
        >
          <Clock
            weight="duotone"
            className="w-5 h-5 inline-block mr-2"
            style={{ color: colors.state.warning }}
          />
          {t("studentDashboard.schedule.upcomingLessons")}
        </h2>

        <div className="space-y-3">
          {upcomingLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Card
                shadow="none" className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-xl flex flex-col items-center justify-center"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: colors.text.secondary }}
                        >
                          {new Date(lesson.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {new Date(lesson.date).getDate()}
                        </span>
                      </div>

                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar
                            src={lesson.tutorAvatar}
                            size="sm"
                            className="w-6 h-6"
                          />
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {lesson.tutor}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {lesson.time} • {lesson.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="light" size="sm">
                        {t("studentDashboard.schedule.cancel")}
                      </Button>
                      <Button variant="bordered" size="sm">
                        {t("studentDashboard.schedule.reschedule")}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Schedule;
