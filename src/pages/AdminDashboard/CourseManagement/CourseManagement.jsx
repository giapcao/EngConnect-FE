import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Button,
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
  Spinner,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import useTableStyles from "../../../hooks/useTableStyles";
import { motion } from "framer-motion";
import { coursesApi, tutorApi } from "../../../api";
import {
  MagnifyingGlass,
  DotsThree,
  Eye,
  Trash,
  Export,
  Funnel,
  BookOpen,
  Star,
  HourglassMedium,
  CheckCircle,
  Prohibit,
  CaretDown,
  CaretUp,
  Play,
  Certificate,
  Users,
  VideoCamera,
  Clock,
  CalendarBlank,
  Target,
} from "@phosphor-icons/react";

const CourseManagement = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const { tableCardStyle, tableClassNames } = useTableStyles();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Stats
  const [totalCount, setTotalCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  // Detail modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tutorInfo, setTutorInfo] = useState(null);

  // Expanded modules in detail
  const [expandedModules, setExpandedModules] = useState({});
  const toggleModule = (id) =>
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, "page-size": pageSize };
      if (debouncedSearch) params["search-term"] = debouncedSearch;
      if (selectedStatus !== "all") params.Status = selectedStatus;
      if (selectedLevel !== "all") params.Level = selectedLevel;
      if (selectedCategory !== "all") params.CategoryId = selectedCategory;

      const response = await coursesApi.getAllCourses(params);
      const data = response.data;
      setCourses(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    debouncedSearch,
    selectedStatus,
    selectedLevel,
    selectedCategory,
  ]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Fetch categories for filter
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await coursesApi.getCategories({
          "page-size": 100,
          page: 1,
        });
        setCategories(res.data?.items || []);
      } catch (_) {}
    };
    loadCategories();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allRes, publishedRes, pendingRes, draftRes] = await Promise.all([
          coursesApi.getAllCourses({ "page-size": 1, page: 1 }),
          coursesApi.getAllCourses({
            Status: "Published",
            "page-size": 1,
            page: 1,
          }),
          coursesApi.getAllCourses({
            Status: "Pending",
            "page-size": 1,
            page: 1,
          }),
          coursesApi.getAllCourses({
            Status: "Draft",
            "page-size": 1,
            page: 1,
          }),
        ]);
        setTotalCount(allRes.data.totalItems || 0);
        setPublishedCount(publishedRes.data.totalItems || 0);
        setPendingCount(pendingRes.data.totalItems || 0);
        setDraftCount(draftRes.data.totalItems || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: BookOpen,
      label: t("adminDashboard.courses.stats.totalCourses"),
      value: totalCount.toLocaleString(),
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: CheckCircle,
      label: t("adminDashboard.courses.stats.published"),
      value: publishedCount.toLocaleString(),
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: HourglassMedium,
      label: t("adminDashboard.courses.stats.pending"),
      value: pendingCount.toLocaleString(),
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: Prohibit,
      label: t("adminDashboard.courses.stats.draft"),
      value: draftCount.toLocaleString(),
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "success";
      case "pending":
        return "warning";
      case "draft":
        return "default";
      case "inactive":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return t("adminDashboard.courses.published");
      case "pending":
        return t("adminDashboard.courses.pending");
      case "draft":
        return t("adminDashboard.courses.draft");
      case "inactive":
        return t("adminDashboard.courses.inactive");
      default:
        return status;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (price == null) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // View detail
  const handleViewCourse = async (course) => {
    setSelectedCourse(course);
    setExpandedModules({});
    setTutorInfo(null);
    onOpen();
    setDetailLoading(true);
    try {
      const res = await coursesApi.getCourseById(course.id);
      setSelectedCourse(res.data);
      if (res.data?.tutorId) {
        try {
          const tutorRes = await tutorApi.getTutorById(res.data.tutorId);
          setTutorInfo(tutorRes.data);
        } catch (_) {}
      }
    } catch (error) {
      console.error("Failed to fetch course detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Delete
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    try {
      await coursesApi.deleteCourse(courseToDelete.id);
      addToast({
        title: t("adminDashboard.courses.deleteSuccess"),
        color: "success",
      });
      onDeleteClose();
      fetchCourses();
    } catch (error) {
      addToast({
        title: t("adminDashboard.courses.deleteFailed"),
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
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
                placeholder={t("adminDashboard.courses.searchPlaceholder")}
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
              <div className="flex gap-2 flex-wrap">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      startContent={<Funnel className="w-4 h-4" />}
                    >
                      {t("adminDashboard.courses.status")}:{" "}
                      {selectedStatus === "all"
                        ? t("adminDashboard.courses.all")
                        : getStatusLabel(selectedStatus)}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status filter"
                    onAction={(key) => {
                      setSelectedStatus(key);
                      setPage(1);
                    }}
                    selectedKeys={[selectedStatus]}
                    selectionMode="single"
                  >
                    <DropdownItem key="all">
                      {t("adminDashboard.courses.all")}
                    </DropdownItem>
                    <DropdownItem key="Published">
                      {t("adminDashboard.courses.published")}
                    </DropdownItem>
                    <DropdownItem key="Pending">
                      {t("adminDashboard.courses.pending")}
                    </DropdownItem>
                    <DropdownItem key="Draft">
                      {t("adminDashboard.courses.draft")}
                    </DropdownItem>
                    <DropdownItem key="Inactive">
                      {t("adminDashboard.courses.inactive")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat">
                      {t("adminDashboard.courses.table.level")}:{" "}
                      {selectedLevel === "all"
                        ? t("adminDashboard.courses.all")
                        : selectedLevel}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Level filter"
                    onAction={(key) => {
                      setSelectedLevel(key);
                      setPage(1);
                    }}
                    selectedKeys={[selectedLevel]}
                    selectionMode="single"
                  >
                    <DropdownItem key="all">
                      {t("adminDashboard.courses.all")}
                    </DropdownItem>
                    <DropdownItem key="Beginner">Beginner</DropdownItem>
                    <DropdownItem key="Intermediate">Intermediate</DropdownItem>
                    <DropdownItem key="Advanced">Advanced</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat">
                      {t("adminDashboard.courses.table.category")}:{" "}
                      {selectedCategory === "all"
                        ? t("adminDashboard.courses.all")
                        : (categories.find((c) => c.id === selectedCategory)
                            ?.name ?? selectedCategory)}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Category filter"
                    onAction={(key) => {
                      setSelectedCategory(key);
                      setPage(1);
                    }}
                    selectedKeys={[selectedCategory]}
                    selectionMode="single"
                  >
                    <DropdownItem key="all">
                      {t("adminDashboard.courses.all")}
                    </DropdownItem>
                    {categories.map((cat) => (
                      <DropdownItem key={cat.id}>{cat.name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Courses Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card shadow="none" className="border-none" style={tableCardStyle}>
          <CardBody className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <p style={{ color: colors.text.secondary }}>
                  {t("adminDashboard.courses.noData")}
                </p>
              </div>
            ) : (
              <Table
                aria-label="Courses table"
                classNames={tableClassNames}
                bottomContent={
                  totalPages > 1 ? (
                    <div className="flex w-full justify-center py-4">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={totalPages}
                        onChange={(p) => setPage(p)}
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn>
                    {t("adminDashboard.courses.table.course")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courses.table.category")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courses.table.price")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courses.table.level")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courses.table.status")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courses.table.createdAt")}
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
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            {course.thumbnailUrl ? (
                              <Image
                                src={course.thumbnailUrl}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                  backgroundColor: colors.background.gray,
                                }}
                              >
                                <BookOpen
                                  className="w-5 h-5"
                                  style={{ color: colors.text.secondary }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium line-clamp-1"
                              style={{ color: colors.text.primary }}
                            >
                              {course.title}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(course.courseCategories || course.categories)
                            ?.length > 0 ? (
                            (course.courseCategories || course.categories)
                              .slice(0, 2)
                              .map((cat) => (
                                <Chip
                                  key={cat.categoryId || cat.id}
                                  size="sm"
                                  variant="flat"
                                >
                                  {cat.categoryName || cat.name}
                                </Chip>
                              ))
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: colors.text.secondary }}
                            >
                              —
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="font-medium"
                          style={{ color: colors.state.success }}
                        >
                          {formatPrice(course.price)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.text.primary }}>
                          {course.level || course.courseLevel || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={getStatusColor(course.status)}
                          variant="flat"
                        >
                          {getStatusLabel(course.status)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {formatDate(course.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
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
                                key="delete"
                                color="danger"
                                startContent={<Trash className="w-4 h-4" />}
                                onPress={() => handleDeleteClick(course)}
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
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Course Detail Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.courses.courseDetails")}
              </ModalHeader>
              <ModalBody>
                {detailLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  selectedCourse && (
                    <div className="space-y-4">
                      {/* Header: thumbnail + title + categories + status */}
                      <div className="flex gap-4">
                        <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          {selectedCourse.thumbnailUrl ? (
                            <Image
                              src={selectedCourse.thumbnailUrl}
                              alt={selectedCourse.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                backgroundColor: colors.background.gray,
                              }}
                            >
                              <BookOpen
                                className="w-8 h-8"
                                style={{ color: colors.text.secondary }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-xl font-semibold mb-1"
                            style={{ color: colors.text.primary }}
                          >
                            {selectedCourse.title}
                          </h3>
                          {selectedCourse.shortDescription && (
                            <p
                              className="text-sm mb-2"
                              style={{ color: colors.text.secondary }}
                            >
                              {selectedCourse.shortDescription}
                            </p>
                          )}
                          <div className="flex items-center flex-wrap gap-2">
                            {(
                              selectedCourse.courseCategories ||
                              selectedCourse.categories ||
                              []
                            ).map((cat) => (
                              <Chip
                                key={cat.categoryId || cat.id}
                                size="sm"
                                variant="flat"
                              >
                                {cat.categoryName || cat.name}
                              </Chip>
                            ))}
                            <Chip
                              size="sm"
                              color={getStatusColor(selectedCourse.status)}
                              variant="flat"
                            >
                              {getStatusLabel(selectedCourse.status)}
                            </Chip>
                            {selectedCourse.isCertificate && (
                              <Chip
                                size="sm"
                                variant="flat"
                                color="secondary"
                                startContent={
                                  <Certificate size={14} weight="fill" />
                                }
                              >
                                {t("adminDashboard.courses.certificate")}
                              </Chip>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tutor info */}
                      {tutorInfo && (
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{
                            backgroundColor: colors.background.light,
                          }}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            {tutorInfo.avatar ? (
                              <Image
                                src={tutorInfo.avatar}
                                alt={
                                  tutorInfo.user
                                    ? `${tutorInfo.user.firstName} ${tutorInfo.user.lastName}`
                                    : ""
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                  backgroundColor:
                                    colors.background.primaryLight,
                                }}
                              >
                                <Users
                                  size={18}
                                  style={{ color: colors.primary.main }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-medium text-sm"
                              style={{ color: colors.text.primary }}
                            >
                              {tutorInfo.user
                                ? `${tutorInfo.user.firstName} ${tutorInfo.user.lastName}`
                                : "N/A"}
                            </p>
                            {tutorInfo.headline && (
                              <p
                                className="text-xs truncate"
                                style={{ color: colors.text.secondary }}
                              >
                                {tutorInfo.headline}
                              </p>
                            )}
                          </div>
                          {tutorInfo.ratingAverage != null && (
                            <div className="flex items-center gap-1">
                              <Star
                                size={12}
                                weight="fill"
                                style={{ color: colors.state.warning }}
                              />
                              <span
                                className="text-xs font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                {tutorInfo.ratingAverage}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Full Description */}
                      {(selectedCourse.fullDescription ||
                        selectedCourse.description) && (
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: colors.text.primary }}
                          >
                            {t("adminDashboard.courses.fullDescription")}
                          </p>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: colors.text.secondary }}
                          >
                            {selectedCourse.fullDescription ||
                              selectedCourse.description}
                          </p>
                        </div>
                      )}

                      {/* Outcomes */}
                      {selectedCourse.outcomes && (
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: colors.text.primary }}
                          >
                            {t("adminDashboard.courses.outcomes")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCourse.outcomes
                              .split(";")
                              .filter((o) => o.trim())
                              .map((outcome, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1.5"
                                >
                                  <Target
                                    size={14}
                                    weight="fill"
                                    style={{ color: colors.state.success }}
                                  />
                                  <span
                                    className="text-sm"
                                    style={{ color: colors.text.secondary }}
                                  >
                                    {outcome.trim()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Demo Video */}
                      {selectedCourse.demoVideoUrl && (
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: colors.text.primary }}
                          >
                            {t("adminDashboard.courses.demoVideo")}
                          </p>
                          <video
                            src={selectedCourse.demoVideoUrl}
                            controls
                            className="w-full rounded-xl"
                            style={{ maxHeight: 300 }}
                          />
                        </div>
                      )}

                      {/* Quick stats grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div
                          className="p-3 rounded-xl text-center"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <p
                            className="text-lg font-bold"
                            style={{ color: colors.state.success }}
                          >
                            {formatPrice(selectedCourse.price)}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.courses.table.price")}
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-xl text-center"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <p
                            className="text-lg font-bold"
                            style={{ color: colors.text.primary }}
                          >
                            {selectedCourse.level ||
                              selectedCourse.courseLevel ||
                              "N/A"}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.courses.table.level")}
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-xl text-center"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <p
                            className="text-lg font-bold"
                            style={{ color: colors.text.primary }}
                          >
                            {(selectedCourse.courseCourseModules || []).length}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.courses.modules")}
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-xl text-center"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Star
                              size={16}
                              weight="fill"
                              style={{ color: colors.state.warning }}
                            />
                            <p
                              className="text-lg font-bold"
                              style={{ color: colors.text.primary }}
                            >
                              {selectedCourse.ratingAverage ?? "N/A"}
                            </p>
                          </div>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.courses.rating")} (
                            {selectedCourse.ratingCount ?? 0})
                          </p>
                        </div>
                      </div>

                      {/* Extra info rows */}
                      <div
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div className="flex items-center gap-2">
                          <Users
                            size={16}
                            style={{ color: colors.text.secondary }}
                          />
                          <div>
                            <p
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {t("adminDashboard.courses.enrollments")}
                            </p>
                            <p style={{ color: colors.text.primary }}>
                              {selectedCourse.numberOfEnrollment ?? 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarBlank
                            size={16}
                            style={{ color: colors.text.secondary }}
                          />
                          <div>
                            <p
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {t("adminDashboard.courses.sessionsPerWeek")}
                            </p>
                            <p style={{ color: colors.text.primary }}>
                              {selectedCourse.numsSessionInWeek ?? "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <VideoCamera
                            size={16}
                            style={{ color: colors.text.secondary }}
                          />
                          <div>
                            <p
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {t("adminDashboard.courses.totalSessions")}
                            </p>
                            <p style={{ color: colors.text.primary }}>
                              {selectedCourse.numberOfSessions ?? 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock
                            size={16}
                            style={{ color: colors.text.secondary }}
                          />
                          <div>
                            <p
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {t("adminDashboard.courses.estimatedTime")}
                            </p>
                            <p style={{ color: colors.text.primary }}>
                              {selectedCourse.estimatedTime || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock
                            size={16}
                            style={{ color: colors.text.secondary }}
                          />
                          <div>
                            <p
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {t("adminDashboard.courses.estimatedTimeLesson")}
                            </p>
                            <p style={{ color: colors.text.primary }}>
                              {selectedCourse.estimatedTimeLesson || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Certificate
                            size={16}
                            style={{ color: colors.text.secondary }}
                          />
                          <div>
                            <p
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {t("adminDashboard.courses.certificate")}
                            </p>
                            <p style={{ color: colors.text.primary }}>
                              {selectedCourse.isCertificate
                                ? t("adminDashboard.courses.yes")
                                : t("adminDashboard.courses.no")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span style={{ color: colors.text.secondary }}>
                            {t("adminDashboard.courses.table.createdAt")}:{" "}
                          </span>
                          <span style={{ color: colors.text.primary }}>
                            {formatDate(selectedCourse.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: colors.text.secondary }}>
                            {t("adminDashboard.courses.updatedAt")}:{" "}
                          </span>
                          <span style={{ color: colors.text.primary }}>
                            {formatDate(selectedCourse.updatedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Curriculum — Modules & Sessions */}
                      {(() => {
                        const modules = (
                          selectedCourse.courseCourseModules || []
                        ).sort((a, b) => a.moduleNumber - b.moduleNumber);
                        const totalSessions = modules.reduce(
                          (sum, m) =>
                            sum + (m.courseModuleCourseSessions?.length || 0),
                          0,
                        );
                        if (modules.length === 0) return null;
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p
                                className="text-sm font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                {t("adminDashboard.courses.curriculum")}
                              </p>
                              <span
                                className="text-xs"
                                style={{ color: colors.text.secondary }}
                              >
                                {modules.length}{" "}
                                {t("adminDashboard.courses.modules")} ·{" "}
                                {totalSessions}{" "}
                                {t("adminDashboard.courses.sessions")}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {modules.map((mod) => {
                                const isExp =
                                  expandedModules[mod.courseModuleId ?? mod.id];
                                const sessions = (
                                  mod.courseModuleCourseSessions || []
                                ).sort(
                                  (a, b) => a.sessionNumber - b.sessionNumber,
                                );
                                return (
                                  <div
                                    key={mod.courseModuleId ?? mod.id}
                                    className="rounded-xl overflow-hidden border"
                                    style={{
                                      borderColor: colors.border.light,
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="w-full flex items-center justify-between p-3 text-left"
                                      style={{
                                        backgroundColor: colors.background.gray,
                                      }}
                                      onClick={() =>
                                        toggleModule(
                                          mod.courseModuleId ?? mod.id,
                                        )
                                      }
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div
                                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                          style={{
                                            backgroundColor:
                                              colors.primary.main,
                                            color: "#fff",
                                          }}
                                        >
                                          <span className="text-xs font-bold">
                                            {mod.moduleNumber}
                                          </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className="font-medium text-sm truncate"
                                            style={{
                                              color: colors.text.primary,
                                            }}
                                          >
                                            {mod.moduleTitle}
                                          </p>
                                          <p
                                            className="text-xs"
                                            style={{
                                              color: colors.text.tertiary,
                                            }}
                                          >
                                            {sessions.length}{" "}
                                            {t(
                                              "adminDashboard.courses.sessions",
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      {isExp ? (
                                        <CaretUp
                                          size={16}
                                          weight="bold"
                                          style={{
                                            color: colors.text.secondary,
                                          }}
                                        />
                                      ) : (
                                        <CaretDown
                                          size={16}
                                          weight="bold"
                                          style={{
                                            color: colors.text.secondary,
                                          }}
                                        />
                                      )}
                                    </button>
                                    {isExp && (
                                      <div
                                        className="px-3 pb-3 pt-2"
                                        style={{
                                          backgroundColor:
                                            colors.background.light,
                                        }}
                                      >
                                        {mod.moduleDescription && (
                                          <p
                                            className="text-xs mb-2 leading-relaxed"
                                            style={{
                                              color: colors.text.secondary,
                                            }}
                                          >
                                            {mod.moduleDescription}
                                          </p>
                                        )}
                                        {sessions.length === 0 ? (
                                          <p
                                            className="text-xs text-center py-2"
                                            style={{
                                              color: colors.text.tertiary,
                                            }}
                                          >
                                            {t(
                                              "adminDashboard.courses.noSessions",
                                            )}
                                          </p>
                                        ) : (
                                          <div className="space-y-1.5">
                                            {sessions.map((sess) => (
                                              <div
                                                key={
                                                  sess.courseSessionId ??
                                                  sess.id
                                                }
                                                className="rounded-lg p-2.5"
                                                style={{
                                                  backgroundColor:
                                                    colors.background.gray,
                                                }}
                                              >
                                                <div className="flex items-start gap-2">
                                                  <div
                                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                                    style={{
                                                      backgroundColor:
                                                        colors.background
                                                          .primaryLight,
                                                    }}
                                                  >
                                                    <Play
                                                      size={10}
                                                      weight="fill"
                                                      style={{
                                                        color:
                                                          colors.primary.main,
                                                      }}
                                                    />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <p
                                                      className="font-medium text-xs"
                                                      style={{
                                                        color:
                                                          colors.text.primary,
                                                      }}
                                                    >
                                                      {sess.sessionNumber
                                                        ? `${sess.sessionNumber}. `
                                                        : ""}
                                                      {sess.sessionTitle}
                                                    </p>
                                                    {sess.sessionDescription && (
                                                      <p
                                                        className="text-xs mt-0.5 leading-relaxed"
                                                        style={{
                                                          color:
                                                            colors.text
                                                              .secondary,
                                                        }}
                                                      >
                                                        {
                                                          sess.sessionDescription
                                                        }
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.courses.close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.courses.confirmDelete")}
              </ModalHeader>
              <ModalBody>
                <p style={{ color: colors.text.secondary }}>
                  {t("adminDashboard.courses.confirmDeleteMsg")}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={deleting}>
                  {t("adminDashboard.courses.cancel")}
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteConfirm}
                  isLoading={deleting}
                >
                  {t("adminDashboard.courses.delete")}
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
