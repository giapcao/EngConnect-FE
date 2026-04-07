import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Input,
  Progress,
  Chip,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0 },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
import {
  MagnifyingGlass,
  DotsThree,
  ChatCircle,
  Eye,
  TrendUp,
  Clock,
  BookOpen,
  Star,
  CalendarCheck,
  Envelope,
} from "@phosphor-icons/react";

const Students = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    {
      id: 1,
      name: "Nguyen Van A",
      email: "nguyenvana@email.com",
      avatar: "https://i.pravatar.cc/150?u=student1",
      course: "Business English",
      progress: 65,
      lessonsCompleted: 13,
      totalLessons: 20,
      lastLesson: "2 hours ago",
      rating: 4.8,
      status: "active",
      enrolledDate: "Jan 15, 2026",
    },
    {
      id: 2,
      name: "Tran Thi B",
      email: "tranthib@email.com",
      avatar: "https://i.pravatar.cc/150?u=student2",
      course: "IELTS Preparation",
      progress: 40,
      lessonsCompleted: 8,
      totalLessons: 20,
      lastLesson: "Yesterday",
      rating: 4.5,
      status: "active",
      enrolledDate: "Jan 10, 2026",
    },
    {
      id: 3,
      name: "Le Van C",
      email: "levanc@email.com",
      avatar: "https://i.pravatar.cc/150?u=student3",
      course: "Conversational English",
      progress: 85,
      lessonsCompleted: 17,
      totalLessons: 20,
      lastLesson: "3 days ago",
      rating: 5.0,
      status: "active",
      enrolledDate: "Dec 20, 2025",
    },
    {
      id: 4,
      name: "Pham Thi D",
      email: "phamthid@email.com",
      avatar: "https://i.pravatar.cc/150?u=student4",
      course: "Business English",
      progress: 100,
      lessonsCompleted: 20,
      totalLessons: 20,
      lastLesson: "1 week ago",
      rating: 4.9,
      status: "completed",
      enrolledDate: "Nov 15, 2025",
    },
    {
      id: 5,
      name: "Hoang Van E",
      email: "hoangvane@email.com",
      avatar: "https://i.pravatar.cc/150?u=student5",
      course: "IELTS Preparation",
      progress: 20,
      lessonsCompleted: 4,
      totalLessons: 20,
      lastLesson: "2 weeks ago",
      rating: 4.2,
      status: "inactive",
      enrolledDate: "Jan 5, 2026",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return colors.state.success;
      case "completed":
        return colors.primary.main;
      case "inactive":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesTab = selectedTab === "all" || student.status === selectedTab;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    {
      label: t("tutorDashboard.students.totalStudents"),
      value: students.length,
      color: colors.primary.main,
    },
    {
      label: t("tutorDashboard.students.activeStudents"),
      value: students.filter((s) => s.status === "active").length,
      color: colors.state.success,
    },
    {
      label: t("tutorDashboard.students.completedCourses"),
      value: students.filter((s) => s.status === "completed").length,
      color: colors.state.info,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {t("tutorDashboard.students.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("tutorDashboard.students.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="grid grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {stat.label}
              </p>
            </CardBody>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("tutorDashboard.students.searchPlaceholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <MagnifyingGlass
              className="w-5 h-5"
              style={{ color: colors.text.tertiary }}
            />
          }
          classNames={{
            inputWrapper: "shadow-none",
          }}
          style={{
            backgroundColor: colors.background.light,
          }}
          className="max-w-xs"
        />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          variant="light"
          classNames={{
            tabList: "gap-2",
            tab: "px-4",
          }}
        >
          <Tab key="all" title={t("tutorDashboard.students.all")} />
          <Tab key="active" title={t("tutorDashboard.students.active")} />
          <Tab key="completed" title={t("tutorDashboard.students.completed")} />
          <Tab key="inactive" title={t("tutorDashboard.students.inactive")} />
        </Tabs>
      </motion.div>

      {/* Students List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredStudents.map((student) => (
          <motion.div key={student.id} variants={itemVariants}>
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Student Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar
                      src={student.avatar}
                      size="lg"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className="font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {student.name}
                        </h3>
                        <Chip
                          size="sm"
                          style={{
                            backgroundColor: `${getStatusColor(student.status)}20`,
                            color: getStatusColor(student.status),
                          }}
                        >
                          {student.status}
                        </Chip>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {student.email}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.primary.main }}
                      >
                        {student.course}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 lg:max-w-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("tutorDashboard.students.progress")}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {student.lessonsCompleted}/{student.totalLessons}{" "}
                        {t("tutorDashboard.students.lessons")}
                      </span>
                    </div>
                    <Progress
                      value={student.progress}
                      size="sm"
                      classNames={{
                        indicator: "bg-primary",
                      }}
                      style={{
                        backgroundColor: colors.background.gray,
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 lg:gap-6">
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
                        {student.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock
                        weight="duotone"
                        className="w-4 h-4"
                        style={{ color: colors.text.tertiary }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {student.lastLesson}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      variant="flat"
                      size="sm"
                      style={{
                        backgroundColor: colors.background.primaryLight,
                        color: colors.primary.main,
                      }}
                    >
                      <ChatCircle weight="duotone" className="w-4 h-4" />
                    </Button>
                    <Button
                      isIconOnly
                      variant="flat"
                      size="sm"
                      style={{
                        backgroundColor: colors.background.gray,
                        color: colors.text.secondary,
                      }}
                    >
                      <Envelope weight="duotone" className="w-4 h-4" />
                    </Button>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          style={{
                            backgroundColor: colors.background.gray,
                            color: colors.text.secondary,
                          }}
                        >
                          <DotsThree weight="bold" className="w-5 h-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="view"
                          startContent={<Eye className="w-4 h-4" />}
                        >
                          {t("tutorDashboard.students.viewProfile")}
                        </DropdownItem>
                        <DropdownItem
                          key="progress"
                          startContent={<TrendUp className="w-4 h-4" />}
                        >
                          {t("tutorDashboard.students.viewProgress")}
                        </DropdownItem>
                        <DropdownItem
                          key="schedule"
                          startContent={<CalendarCheck className="w-4 h-4" />}
                        >
                          {t("tutorDashboard.students.scheduleLesson")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
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

export default Students;
