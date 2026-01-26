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
  Image,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
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
  BookOpen,
  Users,
  Star,
  TrendUp,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";

const CourseManagement = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const stats = [
    {
      icon: BookOpen,
      label: t("adminDashboard.courses.stats.totalCourses"),
      value: "1,234",
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: CheckCircle,
      label: t("adminDashboard.courses.stats.published"),
      value: "1,156",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: Users,
      label: t("adminDashboard.courses.stats.enrollments"),
      value: "45,678",
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: TrendUp,
      label: t("adminDashboard.courses.stats.completionRate"),
      value: "78.5%",
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const courses = [
    {
      id: 1,
      title: "Business English Masterclass",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300",
      tutor: "Sarah Johnson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
      category: "Business",
      price: "$49.99",
      students: 234,
      rating: 4.9,
      status: "published",
      createdAt: "Jan 15, 2024",
    },
    {
      id: 2,
      title: "IELTS Preparation Complete Guide",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300",
      tutor: "Michael Chen",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor2",
      category: "IELTS",
      price: "$79.99",
      students: 189,
      rating: 4.8,
      status: "published",
      createdAt: "Feb 20, 2024",
    },
    {
      id: 3,
      title: "Conversational English for Beginners",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300",
      tutor: "Emma Wilson",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor3",
      category: "Conversation",
      price: "$29.99",
      students: 312,
      rating: 4.9,
      status: "published",
      createdAt: "Dec 10, 2023",
    },
    {
      id: 4,
      title: "Advanced TOEFL Strategies",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300",
      tutor: "Lisa Wang",
      tutorAvatar: "https://i.pravatar.cc/150?u=tutor4",
      category: "TOEFL",
      price: "$89.99",
      students: 0,
      rating: 0,
      status: "pending",
      createdAt: "Jan 25, 2024",
    },
    {
      id: 5,
      title: "Grammar Essentials",
      image:
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300",
      tutor: "David Brown",
      tutorAvatar: "https://i.pravatar.cc/150?u=pending1",
      category: "Grammar",
      price: "$39.99",
      students: 0,
      rating: 0,
      status: "draft",
      createdAt: "Jan 26, 2024",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "pending":
        return "warning";
      case "draft":
        return "default";
      case "archived":
        return "danger";
      default:
        return "default";
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    onOpen();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold mb-1"
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.courses.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("adminDashboard.courses.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Export className="w-4 h-4" />}
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.courses.export")}
          </Button>
          <Button
            startContent={<Plus className="w-4 h-4" />}
            style={{
              backgroundColor: colors.primary.main,
              color: colors.text.white,
            }}
          >
            {t("adminDashboard.courses.addCourse")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
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
                placeholder={t("adminDashboard.courses.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={
                  <MagnifyingGlass
                    className="w-4 h-4"
                    style={{ color: colors.text.secondary }}
                  />
                }
                className="flex-1"
              />
              <div className="flex gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      startContent={<Funnel className="w-4 h-4" />}
                    >
                      {t("adminDashboard.courses.status")}:{" "}
                      {selectedStatus === "all"
                        ? t("adminDashboard.courses.all")
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
                      {t("adminDashboard.courses.all")}
                    </DropdownItem>
                    <DropdownItem key="published">
                      {t("adminDashboard.courses.published")}
                    </DropdownItem>
                    <DropdownItem key="pending">
                      {t("adminDashboard.courses.pending")}
                    </DropdownItem>
                    <DropdownItem key="draft">
                      {t("adminDashboard.courses.draft")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Courses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-0">
            <Table
              aria-label="Courses table"
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
                  {t("adminDashboard.courses.table.course")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.courses.table.tutor")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.courses.table.category")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.courses.table.price")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.courses.table.students")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.courses.table.status")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.courses.table.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p
                            className="font-medium line-clamp-1"
                            style={{ color: colors.text.primary }}
                          >
                            {course.title}
                          </p>
                          {course.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star
                                className="w-3 h-3"
                                weight="fill"
                                style={{ color: colors.state.warning }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: colors.text.secondary }}
                              >
                                {course.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={course.tutorAvatar}
                          size="sm"
                          className="w-6 h-6"
                        />
                        <span style={{ color: colors.text.primary }}>
                          {course.tutor}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat">
                        {course.category}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span
                        className="font-medium"
                        style={{ color: colors.state.success }}
                      >
                        {course.price}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.primary }}>
                        {course.students}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getStatusColor(course.status)}
                        variant="flat"
                      >
                        {course.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {course.status === "pending" && (
                          <>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              style={{ color: colors.state.success }}
                            >
                              <CheckCircle className="w-5 h-5" weight="fill" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              style={{ color: colors.state.error }}
                            >
                              <XCircle className="w-5 h-5" weight="fill" />
                            </Button>
                          </>
                        )}
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
                          <DropdownMenu aria-label="Course actions">
                            <DropdownItem
                              key="view"
                              startContent={<Eye className="w-4 h-4" />}
                              onPress={() => handleViewCourse(course)}
                            >
                              {t("adminDashboard.courses.view")}
                            </DropdownItem>
                            <DropdownItem
                              key="edit"
                              startContent={
                                <PencilSimple className="w-4 h-4" />
                              }
                            >
                              {t("adminDashboard.courses.edit")}
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              color="danger"
                              startContent={<Trash className="w-4 h-4" />}
                            >
                              {t("adminDashboard.courses.delete")}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Course Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.courses.courseDetails")}
              </ModalHeader>
              <ModalBody>
                {selectedCourse && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-24 rounded-xl overflow-hidden">
                        <Image
                          src={selectedCourse.image}
                          alt={selectedCourse.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-xl font-semibold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {selectedCourse.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar
                            src={selectedCourse.tutorAvatar}
                            size="sm"
                            className="w-6 h-6"
                          />
                          <span style={{ color: colors.text.secondary }}>
                            {selectedCourse.tutor}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip size="sm" variant="flat">
                            {selectedCourse.category}
                          </Chip>
                          <Chip
                            size="sm"
                            color={getStatusColor(selectedCourse.status)}
                            variant="flat"
                          >
                            {selectedCourse.status}
                          </Chip>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className="p-4 rounded-xl text-center"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-2xl font-bold"
                          style={{ color: colors.state.success }}
                        >
                          {selectedCourse.price}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          Price
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl text-center"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <p
                          className="text-2xl font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {selectedCourse.students}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          Students
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl text-center"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Star
                            className="w-5 h-5"
                            weight="fill"
                            style={{ color: colors.state.warning }}
                          />
                          <span
                            className="text-2xl font-bold"
                            style={{ color: colors.text.primary }}
                          >
                            {selectedCourse.rating || "N/A"}
                          </span>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          Rating
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.courses.close")}
                </Button>
                <Button
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.courses.edit")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CourseManagement;
