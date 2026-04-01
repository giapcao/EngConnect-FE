import { useState, useEffect, useCallback, useRef } from "react";
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
  Spinner,
  Textarea,
  Image,
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
  CheckCircle,
  XCircle,
  Trash,
  Export,
  Funnel,
  ClipboardText,
  HourglassMedium,
  Prohibit,
  BookOpen,
  CaretDown,
  CaretUp,
  Play,
  Certificate,
  Users,
  VideoCamera,
  Clock,
  CalendarBlank,
  Target,
  Star,
} from "@phosphor-icons/react";

const CourseVerification = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames, textareaClassNames } = useInputStyles();
  const { tableCardStyle, tableClassNames } = useTableStyles();

  // List state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Stats
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  // Course data cache: courseId → course object
  const courseCacheRef = useRef({});

  // Detail modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailCourse, setDetailCourse] = useState(null);
  const [tutorInfo, setTutorInfo] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const toggleModule = (id) =>
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));

  // Review modal
  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewRequestId, setReviewRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewing, setReviewing] = useState(false);

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch verification requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, "page-size": pageSize };
      if (debouncedSearch) params["search-term"] = debouncedSearch;
      if (selectedStatus !== "all") params.Status = selectedStatus;

      const response = await coursesApi.getCourseVerificationRequests(params);
      const data = response.data;
      const items = data.items || [];
      setRequests(items);
      setTotalPages(data.totalPages || 1);

      // Fetch course data for items not yet cached
      const uncachedIds = [
        ...new Set(
          items
            .map((r) => r.courseId)
            .filter((id) => id && !courseCacheRef.current[id]),
        ),
      ];
      if (uncachedIds.length > 0) {
        const results = await Promise.allSettled(
          uncachedIds.map((id) => coursesApi.getCourseById(id)),
        );
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            courseCacheRef.current[uncachedIds[i]] = result.value.data;
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch course verification requests:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, selectedStatus]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allRes, pendingRes, approvedRes, rejectedRes] =
          await Promise.all([
            coursesApi.getCourseVerificationRequests({
              "page-size": 1,
              page: 1,
            }),
            coursesApi.getCourseVerificationRequests({
              Status: "Pending",
              "page-size": 1,
              page: 1,
            }),
            coursesApi.getCourseVerificationRequests({
              Status: "Approved",
              "page-size": 1,
              page: 1,
            }),
            coursesApi.getCourseVerificationRequests({
              Status: "Rejected",
              "page-size": 1,
              page: 1,
            }),
          ]);
        setTotalCount(allRes.data.totalItems || 0);
        setPendingCount(pendingRes.data.totalItems || 0);
        setApprovedCount(approvedRes.data.totalItems || 0);
        setRejectedCount(rejectedRes.data.totalItems || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: ClipboardText,
      label: t("adminDashboard.courseVerification.stats.totalRequests"),
      value: totalCount.toLocaleString(),
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: HourglassMedium,
      label: t("adminDashboard.courseVerification.stats.pending"),
      value: pendingCount.toLocaleString(),
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: CheckCircle,
      label: t("adminDashboard.courseVerification.stats.approved"),
      value: approvedCount.toLocaleString(),
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: Prohibit,
      label: t("adminDashboard.courseVerification.stats.rejected"),
      value: rejectedCount.toLocaleString(),
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Approved":
        return t("adminDashboard.courseVerification.approved");
      case "Pending":
        return t("adminDashboard.courseVerification.pending");
      case "Rejected":
        return t("adminDashboard.courseVerification.rejected");
      default:
        return status;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t("adminDashboard.courseVerification.nA");
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCourseName = (courseId) => {
    const course = courseCacheRef.current[courseId];
    return course?.title || courseId?.slice(0, 8) + "...";
  };

  const getCourseThumbnail = (courseId) => {
    return courseCacheRef.current[courseId]?.thumbnailUrl || "";
  };

  // View detail
  const handleViewRequest = async (request) => {
    setSelectedRequest(request);
    setDetailCourse(null);
    setTutorInfo(null);
    setExpandedModules({});
    onOpen();
    setDetailLoading(true);
    try {
      if (request.courseId) {
        const courseRes = await coursesApi.getCourseById(request.courseId);
        setDetailCourse(courseRes.data);
        courseCacheRef.current[request.courseId] = courseRes.data;
        if (courseRes.data?.tutorId) {
          try {
            const tutorRes = await tutorApi.getTutorById(
              courseRes.data.tutorId,
            );
            setTutorInfo(tutorRes.data);
          } catch (_) {}
        }
      }
    } catch (error) {
      console.error("Failed to fetch course detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Review (approve/reject)
  const handleReviewClick = (requestId, action) => {
    setReviewRequestId(requestId);
    setReviewAction(action);
    setRejectionReason("");
    onReviewOpen();
  };

  const handleReviewConfirm = async () => {
    if (!reviewRequestId) return;
    setReviewing(true);
    try {
      await coursesApi.reviewCourseVerificationRequest(reviewRequestId, {
        requestId: reviewRequestId,
        approved: reviewAction === "approve",
        rejectionReason: reviewAction === "reject" ? rejectionReason : null,
      });
      addToast({
        title:
          reviewAction === "approve"
            ? t("adminDashboard.courseVerification.approveSuccess")
            : t("adminDashboard.courseVerification.rejectSuccess"),
        color: "success",
      });
      onReviewClose();
      fetchRequests();
    } catch (error) {
      addToast({
        title:
          reviewAction === "approve"
            ? t("adminDashboard.courseVerification.approveFailed")
            : t("adminDashboard.courseVerification.rejectFailed"),
        color: "danger",
      });
    } finally {
      setReviewing(false);
    }
  };

  // Delete
  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;
    setDeleting(true);
    try {
      await coursesApi.deleteCourseVerificationRequest(requestToDelete.id);
      addToast({
        title: t("adminDashboard.courseVerification.deleteSuccess"),
        color: "success",
      });
      onDeleteClose();
      fetchRequests();
    } catch (error) {
      addToast({
        title: t("adminDashboard.courseVerification.deleteFailed"),
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
            {t("adminDashboard.courseVerification.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("adminDashboard.courseVerification.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Export className="w-4 h-4" />}
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.courseVerification.export")}
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
                placeholder={t(
                  "adminDashboard.courseVerification.searchPlaceholder",
                )}
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
                      {t("adminDashboard.courseVerification.statusLabel")}:{" "}
                      {selectedStatus === "all"
                        ? t("adminDashboard.courseVerification.all")
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
                      {t("adminDashboard.courseVerification.all")}
                    </DropdownItem>
                    <DropdownItem key="Pending">
                      {t("adminDashboard.courseVerification.pending")}
                    </DropdownItem>
                    <DropdownItem key="Approved">
                      {t("adminDashboard.courseVerification.approved")}
                    </DropdownItem>
                    <DropdownItem key="Rejected">
                      {t("adminDashboard.courseVerification.rejected")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Requests Table */}
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
            ) : requests.length === 0 ? (
              <div className="text-center py-20">
                <p style={{ color: colors.text.secondary }}>
                  {t("adminDashboard.courseVerification.noData")}
                </p>
              </div>
            ) : (
              <Table
                aria-label="Course verification requests table"
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
                    {t("adminDashboard.courseVerification.table.course")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courseVerification.table.status")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courseVerification.table.submittedAt")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courseVerification.table.reviewedAt")}
                  </TableColumn>
                  <TableColumn>
                    {t("adminDashboard.courseVerification.table.actions")}
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            {getCourseThumbnail(req.courseId) ? (
                              <Image
                                src={getCourseThumbnail(req.courseId)}
                                alt=""
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
                                  className="w-4 h-4"
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
                              {getCourseName(req.courseId)}
                            </p>
                            <p
                              className="text-xs line-clamp-1"
                              style={{ color: colors.text.secondary }}
                            >
                              ID: {req.id?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={getStatusColor(req.status)}
                          variant="flat"
                        >
                          {getStatusLabel(req.status)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {formatDate(req.submittedAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {formatDate(req.reviewedAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {req.status === "Pending" && (
                            <>
                              <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                style={{ color: colors.state.success }}
                                onPress={() =>
                                  handleReviewClick(req.id, "approve")
                                }
                              >
                                <CheckCircle
                                  className="w-5 h-5"
                                  weight="fill"
                                />
                              </Button>
                              <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                style={{ color: colors.state.error }}
                                onPress={() =>
                                  handleReviewClick(req.id, "reject")
                                }
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
                            <DropdownMenu aria-label="Request actions">
                              <DropdownItem
                                key="view"
                                startContent={<Eye className="w-4 h-4" />}
                                onPress={() => handleViewRequest(req)}
                              >
                                {t("adminDashboard.courseVerification.view")}
                              </DropdownItem>
                              <DropdownItem
                                key="delete"
                                color="danger"
                                startContent={<Trash className="w-4 h-4" />}
                                onPress={() => handleDeleteClick(req)}
                              >
                                {t("adminDashboard.courseVerification.delete")}
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

      {/* Detail Modal */}
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
                {t("adminDashboard.courseVerification.requestDetails")}
              </ModalHeader>
              <ModalBody>
                {detailLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  selectedRequest && (
                    <div className="space-y-4">
                      {/* Request info */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span style={{ color: colors.text.secondary }}>
                            {t("adminDashboard.courseVerification.requestId")}
                            :{" "}
                          </span>
                          <span
                            className="font-mono"
                            style={{ color: colors.text.primary }}
                          >
                            {selectedRequest.id?.slice(0, 12)}...
                          </span>
                        </div>
                        <div>
                          <span style={{ color: colors.text.secondary }}>
                            {t("adminDashboard.courseVerification.statusLabel")}
                            :{" "}
                          </span>
                          <Chip
                            size="sm"
                            color={getStatusColor(selectedRequest.status)}
                            variant="flat"
                          >
                            {getStatusLabel(selectedRequest.status)}
                          </Chip>
                        </div>
                        <div>
                          <span style={{ color: colors.text.secondary }}>
                            {t("adminDashboard.courseVerification.submittedAt")}
                            :{" "}
                          </span>
                          <span style={{ color: colors.text.primary }}>
                            {formatDate(selectedRequest.submittedAt)}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: colors.text.secondary }}>
                            {t("adminDashboard.courseVerification.reviewedAt")}
                            :{" "}
                          </span>
                          <span style={{ color: colors.text.primary }}>
                            {formatDate(selectedRequest.reviewedAt)}
                          </span>
                        </div>
                        {selectedRequest.rejectionReason && (
                          <div className="col-span-2">
                            <span style={{ color: colors.text.secondary }}>
                              {t(
                                "adminDashboard.courseVerification.rejectionReason",
                              )}
                              :{" "}
                            </span>
                            <span style={{ color: colors.state.error }}>
                              {selectedRequest.rejectionReason}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Course info */}
                      {detailCourse && (
                        <div
                          className="p-4 rounded-xl space-y-3"
                          style={{ backgroundColor: colors.background.gray }}
                        >
                          <p
                            className="font-semibold"
                            style={{ color: colors.text.primary }}
                          >
                            {t("adminDashboard.courseVerification.courseInfo")}
                          </p>
                          {/* Header */}
                          <div className="flex gap-4">
                            <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              {detailCourse.thumbnailUrl ? (
                                <Image
                                  src={detailCourse.thumbnailUrl}
                                  alt={detailCourse.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: colors.background.light,
                                  }}
                                >
                                  <BookOpen
                                    className="w-6 h-6"
                                    style={{ color: colors.text.secondary }}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-semibold"
                                style={{ color: colors.text.primary }}
                              >
                                {detailCourse.title}
                              </p>
                              {detailCourse.shortDescription && (
                                <p
                                  className="text-sm mt-1"
                                  style={{ color: colors.text.secondary }}
                                >
                                  {detailCourse.shortDescription}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {(
                                  detailCourse.courseCategories ||
                                  detailCourse.categories ||
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
                                {detailCourse.isCertificate && (
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
                          {(detailCourse.fullDescription ||
                            detailCourse.description) && (
                            <div>
                              <p
                                className="text-xs font-medium mb-1"
                                style={{ color: colors.text.primary }}
                              >
                                {t("adminDashboard.courses.fullDescription")}
                              </p>
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: colors.text.secondary }}
                              >
                                {detailCourse.fullDescription ||
                                  detailCourse.description}
                              </p>
                            </div>
                          )}
                          {/* Outcomes */}
                          {detailCourse.outcomes && (
                            <div>
                              <p
                                className="text-xs font-medium mb-1"
                                style={{ color: colors.text.primary }}
                              >
                                {t("adminDashboard.courses.outcomes")}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {detailCourse.outcomes
                                  .split(";")
                                  .filter((o) => o.trim())
                                  .map((outcome, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-1.5"
                                    >
                                      <Target
                                        size={12}
                                        weight="fill"
                                        style={{ color: colors.state.success }}
                                      />
                                      <span
                                        className="text-xs"
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
                          {detailCourse.demoVideoUrl && (
                            <div>
                              <p
                                className="text-xs font-medium mb-1"
                                style={{ color: colors.text.primary }}
                              >
                                {t("adminDashboard.courses.demoVideo")}
                              </p>
                              <video
                                src={detailCourse.demoVideoUrl}
                                controls
                                className="w-full rounded-lg"
                                style={{ maxHeight: 200 }}
                              />
                            </div>
                          )}
                          {/* Stats grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                            <div
                              className="p-2 rounded-lg text-center"
                              style={{
                                backgroundColor: colors.background.light,
                              }}
                            >
                              <p
                                className="font-bold text-sm"
                                style={{ color: colors.state.success }}
                              >
                                {detailCourse.price != null
                                  ? new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(detailCourse.price)
                                  : "N/A"}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: colors.text.tertiary }}
                              >
                                {t("adminDashboard.courses.table.price")}
                              </p>
                            </div>
                            <div
                              className="p-2 rounded-lg text-center"
                              style={{
                                backgroundColor: colors.background.light,
                              }}
                            >
                              <p
                                className="font-bold text-sm"
                                style={{ color: colors.text.primary }}
                              >
                                {detailCourse.level ||
                                  detailCourse.courseLevel ||
                                  "N/A"}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: colors.text.tertiary }}
                              >
                                {t("adminDashboard.courses.table.level")}
                              </p>
                            </div>
                            <div
                              className="p-2 rounded-lg text-center"
                              style={{
                                backgroundColor: colors.background.light,
                              }}
                            >
                              <p
                                className="font-bold text-sm"
                                style={{ color: colors.text.primary }}
                              >
                                {
                                  (detailCourse.courseCourseModules || [])
                                    .length
                                }
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: colors.text.tertiary }}
                              >
                                {t("adminDashboard.courses.modules")}
                              </p>
                            </div>
                            <div
                              className="p-2 rounded-lg text-center"
                              style={{
                                backgroundColor: colors.background.light,
                              }}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <Star
                                  size={14}
                                  weight="fill"
                                  style={{ color: colors.state.warning }}
                                />
                                <p
                                  className="font-bold text-sm"
                                  style={{ color: colors.text.primary }}
                                >
                                  {detailCourse.ratingAverage ?? "N/A"}
                                </p>
                              </div>
                              <p
                                className="text-xs"
                                style={{ color: colors.text.tertiary }}
                              >
                                {t("adminDashboard.courses.rating")} (
                                {detailCourse.ratingCount ?? 0})
                              </p>
                            </div>
                          </div>
                          {/* Extra info */}
                          <div
                            className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs p-2 rounded-lg"
                            style={{
                              backgroundColor: colors.background.light,
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <Users
                                size={14}
                                style={{ color: colors.text.secondary }}
                              />
                              <div>
                                <p style={{ color: colors.text.tertiary }}>
                                  {t("adminDashboard.courses.enrollments")}
                                </p>
                                <p style={{ color: colors.text.primary }}>
                                  {detailCourse.numberOfEnrollment ?? 0}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CalendarBlank
                                size={14}
                                style={{ color: colors.text.secondary }}
                              />
                              <div>
                                <p style={{ color: colors.text.tertiary }}>
                                  {t("adminDashboard.courses.sessionsPerWeek")}
                                </p>
                                <p style={{ color: colors.text.primary }}>
                                  {detailCourse.numsSessionInWeek ?? "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <VideoCamera
                                size={14}
                                style={{ color: colors.text.secondary }}
                              />
                              <div>
                                <p style={{ color: colors.text.tertiary }}>
                                  {t("adminDashboard.courses.totalSessions")}
                                </p>
                                <p style={{ color: colors.text.primary }}>
                                  {detailCourse.numberOfSessions ?? 0}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock
                                size={14}
                                style={{ color: colors.text.secondary }}
                              />
                              <div>
                                <p style={{ color: colors.text.tertiary }}>
                                  {t("adminDashboard.courses.estimatedTime")}
                                </p>
                                <p style={{ color: colors.text.primary }}>
                                  {detailCourse.estimatedTime || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock
                                size={14}
                                style={{ color: colors.text.secondary }}
                              />
                              <div>
                                <p style={{ color: colors.text.tertiary }}>
                                  {t(
                                    "adminDashboard.courses.estimatedTimeLesson",
                                  )}
                                </p>
                                <p style={{ color: colors.text.primary }}>
                                  {detailCourse.estimatedTimeLesson || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Certificate
                                size={14}
                                style={{ color: colors.text.secondary }}
                              />
                              <div>
                                <p style={{ color: colors.text.tertiary }}>
                                  {t("adminDashboard.courses.certificate")}
                                </p>
                                <p style={{ color: colors.text.primary }}>
                                  {detailCourse.isCertificate
                                    ? t("adminDashboard.courses.yes")
                                    : t("adminDashboard.courses.no")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Curriculum */}
                          {(() => {
                            const modules = (
                              detailCourse.courseCourseModules || []
                            ).sort((a, b) => a.moduleNumber - b.moduleNumber);
                            const totalSessions = modules.reduce(
                              (sum, m) =>
                                sum +
                                (m.courseModuleCourseSessions?.length || 0),
                              0,
                            );
                            if (modules.length === 0) return null;
                            return (
                              <div className="mt-3">
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
                                      expandedModules[
                                        mod.courseModuleId ?? mod.id
                                      ];
                                    const sessions = (
                                      mod.courseModuleCourseSessions || []
                                    ).sort(
                                      (a, b) =>
                                        a.sessionNumber - b.sessionNumber,
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
                                            backgroundColor:
                                              colors.background.light,
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
                                                              colors.primary
                                                                .main,
                                                          }}
                                                        />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <p
                                                          className="font-medium text-xs"
                                                          style={{
                                                            color:
                                                              colors.text
                                                                .primary,
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
                      )}
                    </div>
                  )
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.courseVerification.close")}
                </Button>
                {selectedRequest?.status === "Pending" && (
                  <>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        onClose();
                        handleReviewClick(selectedRequest.id, "reject");
                      }}
                    >
                      {t("adminDashboard.courseVerification.reject")}
                    </Button>
                    <Button
                      style={{
                        backgroundColor: colors.state.success,
                        color: colors.text.white,
                      }}
                      onPress={() => {
                        onClose();
                        handleReviewClick(selectedRequest.id, "approve");
                      }}
                    >
                      {t("adminDashboard.courseVerification.approve")}
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={isReviewOpen} onClose={onReviewClose} size="md">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.courseVerification.reviewRequest")}
              </ModalHeader>
              <ModalBody>
                <p style={{ color: colors.text.secondary }}>
                  {reviewAction === "approve"
                    ? t("adminDashboard.courseVerification.approveConfirm")
                    : t("adminDashboard.courseVerification.rejectConfirm")}
                </p>
                {reviewAction === "reject" && (
                  <Textarea
                    label={t(
                      "adminDashboard.courseVerification.rejectionReason",
                    )}
                    placeholder={t(
                      "adminDashboard.courseVerification.rejectionReasonPlaceholder",
                    )}
                    value={rejectionReason}
                    onValueChange={setRejectionReason}
                    classNames={textareaClassNames}
                    className="mt-3"
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={reviewing}
                >
                  {t("adminDashboard.courseVerification.cancel")}
                </Button>
                <Button
                  color={reviewAction === "approve" ? "success" : "danger"}
                  onPress={handleReviewConfirm}
                  isLoading={reviewing}
                  isDisabled={
                    reviewAction === "reject" && !rejectionReason.trim()
                  }
                >
                  {t("adminDashboard.courseVerification.confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.courseVerification.confirmDelete")}
              </ModalHeader>
              <ModalBody>
                <p style={{ color: colors.text.secondary }}>
                  {t("adminDashboard.courseVerification.confirmDeleteMsg")}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={deleting}>
                  {t("adminDashboard.courseVerification.cancel")}
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteConfirm}
                  isLoading={deleting}
                >
                  {t("adminDashboard.courseVerification.delete")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CourseVerification;
