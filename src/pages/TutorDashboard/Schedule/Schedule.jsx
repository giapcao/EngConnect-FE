import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Chip,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  CalendarDots,
  Clock,
  VideoCamera,
  CaretLeft,
  CaretRight,
  Plus,
  X,
} from "@phosphor-icons/react";

const Schedule = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { selectClassNames } = useInputStyles();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);

  const days = [
    { name: "Mon", date: "20", fullName: "Monday" },
    { name: "Tue", date: "21", fullName: "Tuesday" },
    { name: "Wed", date: "22", fullName: "Wednesday" },
    { name: "Thu", date: "23", fullName: "Thursday" },
    { name: "Fri", date: "24", fullName: "Friday" },
    { name: "Sat", date: "25", fullName: "Saturday" },
    { name: "Sun", date: "26", fullName: "Sunday" },
  ];

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const scheduledLessons = [
    {
      id: 1,
      day: 0,
      time: "10:00",
      duration: 60,
      student: "Nguyen Van A",
      studentAvatar: "https://i.pravatar.cc/150?u=student1",
      course: "Business English",
      status: "confirmed",
    },
    {
      id: 2,
      day: 0,
      time: "14:00",
      duration: 45,
      student: "Tran Thi B",
      studentAvatar: "https://i.pravatar.cc/150?u=student2",
      course: "IELTS Preparation",
      status: "confirmed",
    },
    {
      id: 3,
      day: 1,
      time: "09:00",
      duration: 60,
      student: "Le Van C",
      studentAvatar: "https://i.pravatar.cc/150?u=student3",
      course: "Conversational English",
      status: "pending",
    },
    {
      id: 4,
      day: 2,
      time: "15:00",
      duration: 45,
      student: "Pham Thi D",
      studentAvatar: "https://i.pravatar.cc/150?u=student4",
      course: "Business English",
      status: "confirmed",
    },
    {
      id: 5,
      day: 3,
      time: "11:00",
      duration: 60,
      student: "Hoang Van E",
      studentAvatar: "https://i.pravatar.cc/150?u=student5",
      course: "IELTS Preparation",
      status: "confirmed",
    },
  ];

  const [availability, setAvailability] = useState({
    0: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
    1: [{ start: "08:00", end: "12:00" }],
    2: [{ start: "14:00", end: "19:00" }],
    3: [
      { start: "10:00", end: "12:00" },
      { start: "14:00", end: "16:00" },
    ],
    4: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "16:00" },
    ],
    5: [],
    6: [],
  });

  const [tempAvailability, setTempAvailability] = useState(null);

  const allTimeOptions = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      allTimeOptions.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }

  const handleOpenModal = () => {
    setTempAvailability(structuredClone(availability));
    onOpen();
  };

  const handleToggleDay = (dayIndex) => {
    setTempAvailability((prev) => ({
      ...prev,
      [dayIndex]:
        prev[dayIndex].length > 0 ? [] : [{ start: "09:00", end: "17:00" }],
    }));
  };

  const handleAddSlot = (dayIndex) => {
    setTempAvailability((prev) => ({
      ...prev,
      [dayIndex]: [...prev[dayIndex], { start: "09:00", end: "17:00" }],
    }));
  };

  const handleRemoveSlot = (dayIndex, slotIndex) => {
    setTempAvailability((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].filter((_, i) => i !== slotIndex),
    }));
  };

  const handleSlotChange = (dayIndex, slotIndex, field, value) => {
    setTempAvailability((prev) => ({
      ...prev,
      [dayIndex]: prev[dayIndex].map((slot, i) =>
        i === slotIndex ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  const handleSaveAvailability = () => {
    setAvailability(tempAvailability);
    onClose();
  };

  const getSlotPosition = (time, dayIndex) => {
    const slots = availability[dayIndex] || [];
    for (const slot of slots) {
      if (time >= slot.start && time < slot.end) {
        const timeIdx = timeSlots.indexOf(time);
        const prevTime = timeSlots[timeIdx - 1];
        const nextTime = timeSlots[timeIdx + 1];
        const isFirst = !prevTime || prevTime < slot.start;
        const isLast = !nextTime || nextTime >= slot.end;
        if (isFirst && isLast) return "single";
        if (isFirst) return "start";
        if (isLast) return "end";
        return "middle";
      }
    }
    return "none";
  };

  const getSlotRadius = (position) => {
    switch (position) {
      case "start":
        return "8px 8px 0 0";
      case "end":
        return "0 0 8px 8px";
      case "single":
        return "8px";
      default:
        return "0";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return colors.state.success;
      case "pending":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const upcomingToday = scheduledLessons.filter((lesson) => lesson.day === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {t("tutorDashboard.schedule.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("tutorDashboard.schedule.subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus weight="bold" className="w-5 h-5" />}
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
          onPress={handleOpenModal}
        >
          {t("tutorDashboard.schedule.setAvailability")}
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="lg:col-span-2"
        >
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              {/* Week Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setCurrentWeek(currentWeek - 1)}
                >
                  <CaretLeft className="w-5 h-5" />
                </Button>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  January 20 - 26, 2026
                </h2>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setCurrentWeek(currentWeek + 1)}
                >
                  <CaretRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {days.map((day, index) => (
                  <div
                    key={day.name}
                    className={`text-center p-2 rounded-xl cursor-pointer transition-all ${
                      selectedDay === index ? "ring-2" : ""
                    }`}
                    style={{
                      backgroundColor:
                        selectedDay === index
                          ? colors.background.primaryLight
                          : colors.background.gray,
                      color:
                        selectedDay === index
                          ? colors.primary.main
                          : colors.text.primary,
                      ringColor: colors.primary.main,
                    }}
                    onClick={() => setSelectedDay(index)}
                  >
                    <p className="text-xs font-medium">{day.name}</p>
                    <p className="text-lg font-bold">{day.date}</p>
                  </div>
                ))}
              </div>

              {/* Schedule Grid */}
              <div className="max-h-[400px] overflow-y-auto">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="grid grid-cols-8 gap-x-2 items-center"
                  >
                    <span
                      className="text-sm font-medium h-10 flex items-center"
                      style={{ color: colors.text.tertiary }}
                    >
                      {time}
                    </span>
                    {days.map((_, dayIndex) => {
                      const lesson = scheduledLessons.find(
                        (l) => l.day === dayIndex && l.time === time,
                      );
                      const position = getSlotPosition(time, dayIndex);
                      const isAvailable = position !== "none";

                      if (lesson) {
                        return (
                          <div
                            key={`${dayIndex}-${time}`}
                            className="p-2 text-xs h-10 flex items-center"
                            style={{
                              backgroundColor: `${getStatusColor(lesson.status)}20`,
                              borderLeft: `3px solid ${getStatusColor(lesson.status)}`,
                              borderRadius: getSlotRadius(
                                isAvailable ? position : "single",
                              ),
                            }}
                          >
                            <p
                              className="font-medium truncate"
                              style={{ color: colors.text.primary }}
                            >
                              {lesson.student.split(" ")[0]}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`${dayIndex}-${time}`}
                          className="h-10"
                          style={{
                            backgroundColor: isAvailable
                              ? `${colors.state.success}15`
                              : colors.background.gray,
                            borderRadius: getSlotRadius(position),
                            borderLeft: isAvailable
                              ? `3px solid ${colors.state.success}40`
                              : "none",
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div
                className="flex items-center gap-4 mt-4 pt-4 border-t"
                style={{ borderColor: colors.border.light }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: colors.state.success }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("tutorDashboard.schedule.confirmed")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: colors.state.warning }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("tutorDashboard.schedule.pending")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: `${colors.state.success}30` }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {t("tutorDashboard.schedule.available")}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Today's Lessons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: colors.text.primary }}
              >
                <CalendarDots
                  weight="duotone"
                  className="w-5 h-5 inline-block mr-2"
                  style={{ color: colors.primary.main }}
                />
                {t("tutorDashboard.schedule.todayLessons")}
              </h2>

              <div className="space-y-3">
                {upcomingToday.length > 0 ? (
                  upcomingToday.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar src={lesson.studentAvatar} size="sm" />
                        <div className="flex-1">
                          <p
                            className="font-medium text-sm"
                            style={{ color: colors.text.primary }}
                          >
                            {lesson.student}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {lesson.course}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          style={{
                            backgroundColor: `${getStatusColor(lesson.status)}20`,
                            color: getStatusColor(lesson.status),
                          }}
                        >
                          {lesson.status}
                        </Chip>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock
                            weight="duotone"
                            className="w-4 h-4"
                            style={{ color: colors.text.tertiary }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {lesson.time} • {lesson.duration} min
                          </span>
                        </div>
                        <Button
                          size="sm"
                          isIconOnly
                          style={{
                            backgroundColor: colors.primary.main,
                            color: colors.text.white,
                          }}
                        >
                          <VideoCamera weight="fill" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="text-center py-8"
                    style={{ color: colors.text.tertiary }}
                  >
                    <CalendarDots className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>{t("tutorDashboard.schedule.noLessonsToday")}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Set Availability Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("tutorDashboard.schedule.setWeeklyAvailability")}
          </ModalHeader>
          <ModalBody>
            {tempAvailability && (
              <div className="space-y-4">
                {days.map((day, index) => {
                  const daySlots = tempAvailability[index] || [];
                  const isEnabled = daySlots.length > 0;

                  return (
                    <div
                      key={day.name}
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            isSelected={isEnabled}
                            size="sm"
                            onValueChange={() => handleToggleDay(index)}
                          />
                          <span
                            className="font-medium"
                            style={{
                              color: isEnabled
                                ? colors.text.primary
                                : colors.text.tertiary,
                            }}
                          >
                            {day.fullName}
                          </span>
                        </div>
                        {isEnabled && (
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={
                              <Plus weight="bold" className="w-3 h-3" />
                            }
                            onPress={() => handleAddSlot(index)}
                            style={{ color: colors.primary.main }}
                          >
                            {t("tutorDashboard.schedule.addSlot")}
                          </Button>
                        )}
                      </div>

                      {isEnabled && (
                        <div className="space-y-2 ml-10">
                          {daySlots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="flex items-center gap-2"
                            >
                              <Select
                                size="sm"
                                selectedKeys={[slot.start]}
                                className="w-28"
                                classNames={selectClassNames}
                                aria-label="Start time"
                                onSelectionChange={(keys) => {
                                  const val = Array.from(keys)[0];
                                  if (val)
                                    handleSlotChange(
                                      index,
                                      slotIndex,
                                      "start",
                                      val,
                                    );
                                }}
                              >
                                {allTimeOptions.map((t) => (
                                  <SelectItem key={t}>{t}</SelectItem>
                                ))}
                              </Select>
                              <span
                                className="text-sm"
                                style={{ color: colors.text.secondary }}
                              >
                                —
                              </span>
                              <Select
                                size="sm"
                                selectedKeys={[slot.end]}
                                className="w-28"
                                classNames={selectClassNames}
                                aria-label="End time"
                                onSelectionChange={(keys) => {
                                  const val = Array.from(keys)[0];
                                  if (val)
                                    handleSlotChange(
                                      index,
                                      slotIndex,
                                      "end",
                                      val,
                                    );
                                }}
                              >
                                {allTimeOptions
                                  .filter((t) => t > slot.start)
                                  .map((t) => (
                                    <SelectItem key={t}>{t}</SelectItem>
                                  ))}
                              </Select>
                              <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                                onPress={() =>
                                  handleRemoveSlot(index, slotIndex)
                                }
                              >
                                <X
                                  weight="bold"
                                  className="w-4 h-4"
                                  style={{ color: colors.state.error }}
                                />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {t("tutorDashboard.schedule.cancel")}
            </Button>
            <Button
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              onPress={handleSaveAvailability}
            >
              {t("tutorDashboard.schedule.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Schedule;
