import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  DotsThree,
  Eye,
  PencilSimple,
  Trash,
  Export,
  Plus,
  Funnel,
  Users,
  TrendUp,
  BookOpen,
  Clock,
} from "@phosphor-icons/react";

const StudentManagement = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const stats = [
    {
      icon: Users,
      label: t("adminDashboard.students.stats.totalStudents"),
      value: "12,847",
      change: "+12.5%",
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: TrendUp,
      label: t("adminDashboard.students.stats.activeStudents"),
      value: "10,234",
      change: "+8.2%",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: BookOpen,
      label: t("adminDashboard.students.stats.enrollments"),
      value: "45,678",
      change: "+15.3%",
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: Clock,
      label: t("adminDashboard.students.stats.avgHours"),
      value: "24.5h",
      change: "+5.1%",
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const students = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://i.pravatar.cc/150?u=student1",
      enrolledCourses: 5,
      totalHours: 48,
      status: "active",
      joinDate: "Jan 15, 2024",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Emily Chen",
      email: "emily.chen@example.com",
      avatar: "https://i.pravatar.cc/150?u=student2",
      enrolledCourses: 3,
      totalHours: 32,
      status: "active",
      joinDate: "Feb 20, 2024",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@example.com",
      avatar: "https://i.pravatar.cc/150?u=student3",
      enrolledCourses: 2,
      totalHours: 16,
      status: "inactive",
      joinDate: "Mar 10, 2024",
      lastActive: "5 days ago",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.w@example.com",
      avatar: "https://i.pravatar.cc/150?u=student4",
      enrolledCourses: 7,
      totalHours: 86,
      status: "active",
      joinDate: "Dec 05, 2023",
      lastActive: "30 minutes ago",
    },
    {
      id: 5,
      name: "David Lee",
      email: "david.lee@example.com",
      avatar: "https://i.pravatar.cc/150?u=student5",
      enrolledCourses: 4,
      totalHours: 52,
      status: "suspended",
      joinDate: "Nov 18, 2023",
      lastActive: "2 weeks ago",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "suspended":
        return "danger";
      default:
        return "default";
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold mb-1"
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.students.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("adminDashboard.students.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Export className="w-4 h-4" />}
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.students.export")}
          </Button>
          <Button
            startContent={<Plus className="w-4 h-4" />}
            style={{
              backgroundColor: colors.primary.main,
              color: colors.text.white,
            }}
          >
            {t("adminDashboard.students.addStudent")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bg }}
                  >
                    <stat.icon
                      className="w-5 h-5"
                      weight="duotone"
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
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
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder={t("adminDashboard.students.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={
                  <MagnifyingGlass
                    className="w-4 h-4"
                    style={{ color: colors.text.secondary }}
                  />
                }
                classNames={inputClassNames}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      startContent={<Funnel className="w-4 h-4" />}
                    >
                      {t("adminDashboard.students.status")}:{" "}
                      {selectedStatus === "all"
                        ? t("adminDashboard.students.all")
                        : selectedStatus}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status filter"
                    onAction={(key) => setSelectedStatus(key)}
                    selectedKeys={[selectedStatus]}
                    selectionMode="single"
                  >
                    <DropdownItem key="all">
                      {t("adminDashboard.students.all")}
                    </DropdownItem>
                    <DropdownItem key="active">
                      {t("adminDashboard.students.active")}
                    </DropdownItem>
                    <DropdownItem key="inactive">
                      {t("adminDashboard.students.inactive")}
                    </DropdownItem>
                    <DropdownItem key="suspended">
                      {t("adminDashboard.students.suspended")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Students Table */}
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
          <CardBody className="p-0">
            <Table
              aria-label="Students table"
              classNames={{
                wrapper: "shadow-none",
                th: `text-xs font-semibold ${colors.text.secondary}`,
              }}
              bottomContent={
                <div className="flex w-full justify-center py-4">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={10}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
            >
              <TableHeader>
                <TableColumn>
                  {t("adminDashboard.students.table.student")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.students.table.courses")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.students.table.hours")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.students.table.status")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.students.table.joinDate")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.students.table.lastActive")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.students.table.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar src={student.avatar} size="sm" />
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {student.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.primary }}>
                        {student.enrolledCourses}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.primary }}>
                        {student.totalHours}h
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getStatusColor(student.status)}
                        variant="flat"
                      >
                        {student.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.secondary }}>
                        {student.joinDate}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.secondary }}>
                        {student.lastActive}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="light" size="sm">
                            <DotsThree
                              className="w-5 h-5"
                              weight="bold"
                              style={{ color: colors.text.secondary }}
                            />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Student actions">
                          <DropdownItem
                            key="view"
                            startContent={<Eye className="w-4 h-4" />}
                            onPress={() => handleViewStudent(student)}
                          >
                            {t("adminDashboard.students.view")}
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            startContent={<PencilSimple className="w-4 h-4" />}
                          >
                            {t("adminDashboard.students.edit")}
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            startContent={<Trash className="w-4 h-4" />}
                          >
                            {t("adminDashboard.students.delete")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Student Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.students.studentDetails")}
              </ModalHeader>
              <ModalBody>
                {selectedStudent && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={selectedStudent.avatar}
                        className="w-20 h-20"
                      />
                      <div>
                        <h3
                          className="text-xl font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {selectedStudent.name}
                        </h3>
                        <p style={{ color: colors.text.secondary }}>
                          {selectedStudent.email}
                        </p>
                        <Chip
                          size="sm"
                          color={getStatusColor(selectedStudent.status)}
                          variant="flat"
                          className="mt-2"
                        >
                          {selectedStudent.status}
                        </Chip>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("adminDashboard.students.table.courses")}
                        </p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {selectedStudent.enrolledCourses}
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("adminDashboard.students.table.hours")}
                        </p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {selectedStudent.totalHours}h
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.students.close")}
                </Button>
                <Button
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.students.edit")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StudentManagement;
