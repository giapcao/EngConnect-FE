import { useState, useEffect, useCallback } from "react";
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
  Spinner,
  Textarea,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import useTableStyles from "../../../hooks/useTableStyles";
import { motion } from "framer-motion";
import { adminApi } from "../../../api";
import {
  MagnifyingGlass,
  DotsThree,
  Eye,
  PencilSimple,
  Trash,
  Export,
  Funnel,
  ChalkboardTeacher,
  Star,
  CheckCircle,
} from "@phosphor-icons/react";

const TutorManagement = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames, textareaClassNames } = useInputStyles();
  const { tableCardStyle, tableClassNames } = useTableStyles();

  // List state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedVerifiedStatus, setSelectedVerifiedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [tutors, setTutors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Stats
  const [totalTutorsCount, setTotalTutorsCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);

  // Detail modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Delete modal
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [tutorToDelete, setTutorToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [editForm, setEditForm] = useState({
    headline: "",
    bio: "",
    monthExperience: 0,
    status: "",
  });
  const [editTutorId, setEditTutorId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch tutors list
  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, "page-size": pageSize };
      if (debouncedSearch) params["search-term"] = debouncedSearch;
      if (selectedVerifiedStatus !== "all")
        params.VerifiedStatus = selectedVerifiedStatus;

      const response = await adminApi.getAllTutors(params);
      const data = response.data;
      setTutors(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, selectedVerifiedStatus]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allRes, verifiedRes] = await Promise.all([
          adminApi.getAllTutors({ "page-size": 1, page: 1 }),
          adminApi.getAllTutors({
            VerifiedStatus: "Verified",
            "page-size": 1,
            page: 1,
          }),
        ]);
        setTotalTutorsCount(allRes.data.totalItems || 0);
        setVerifiedCount(verifiedRes.data.totalItems || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: ChalkboardTeacher,
      label: t("adminDashboard.tutors.stats.totalTutors"),
      value: totalTutorsCount.toLocaleString(),
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: CheckCircle,
      label: t("adminDashboard.tutors.stats.verified"),
      value: verifiedCount.toLocaleString(),
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
  ];

  const getVerifiedColor = (status) => {
    return status === "Verified" ? "success" : "warning";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "default";
      default:
        return "primary";
    }
  };

  const getTutorName = (tutor) => {
    if (tutor.user) {
      return `${tutor.user.firstName || ""} ${tutor.user.lastName || ""}`.trim();
    }
    return t("adminDashboard.tutors.nA");
  };

  const getTutorEmail = (tutor) => {
    return tutor.user?.email || "";
  };

  // View detail
  const handleViewTutor = async (tutor) => {
    setSelectedTutor(tutor);
    onOpen();
    setDetailLoading(true);
    try {
      const response = await adminApi.getTutorById(tutor.id);
      setSelectedTutor(response.data);
    } catch (error) {
      console.error("Failed to fetch tutor detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Delete
  const handleDeleteClick = (tutor) => {
    setTutorToDelete(tutor);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!tutorToDelete) return;
    setDeleting(true);
    try {
      await adminApi.deleteTutor(tutorToDelete.id);
      onDeleteClose();
      setTutorToDelete(null);
      addToast({
        title: t("adminDashboard.tutors.deleteSuccess"),
        color: "success",
      });
      fetchTutors();
      setTotalTutorsCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to delete tutor:", error);
      addToast({
        title: t("adminDashboard.tutors.deleteFailed"),
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Edit
  const handleEditClick = (tutor) => {
    setEditTutorId(tutor.id);
    setEditForm({
      headline: tutor.headline || "",
      bio: tutor.bio || "",
      monthExperience: tutor.monthExperience || 0,
      status: tutor.status || "",
    });
    onEditOpen();
  };

  const handleEditSave = async () => {
    if (!editTutorId) return;
    setSaving(true);
    try {
      await adminApi.updateTutor(editTutorId, editForm);
      onEditClose();
      addToast({
        title: t("adminDashboard.tutors.updateSuccess"),
        color: "success",
      });
      fetchTutors();
    } catch (error) {
      console.error("Failed to update tutor:", error);
      addToast({
        title: t("adminDashboard.tutors.updateFailed"),
        color: "danger",
      });
    } finally {
      setSaving(false);
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
            {t("adminDashboard.tutors.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("adminDashboard.tutors.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Export className="w-4 h-4" />}
            style={{ color: colors.text.primary }}
          >
            {t("adminDashboard.tutors.export")}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder={t("adminDashboard.tutors.searchPlaceholder")}
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
                      {t("adminDashboard.tutors.verifiedStatusLabel")}:{" "}
                      {selectedVerifiedStatus === "all"
                        ? t("adminDashboard.tutors.all")
                        : t(
                            `adminDashboard.tutors.${selectedVerifiedStatus === "Verified" ? "verified" : "unverified"}`,
                          )}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Verified status filter"
                    onAction={(key) => {
                      setSelectedVerifiedStatus(key);
                      setPage(1);
                    }}
                    selectedKeys={[selectedVerifiedStatus]}
                    selectionMode="single"
                  >
                    <DropdownItem key="all">
                      {t("adminDashboard.tutors.all")}
                    </DropdownItem>
                    <DropdownItem key="Verified">
                      {t("adminDashboard.tutors.verified")}
                    </DropdownItem>
                    <DropdownItem key="Unverified">
                      {t("adminDashboard.tutors.unverified")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Tutors Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card shadow="none" className="border-none" style={tableCardStyle}>
          <CardBody className="p-0">
            <Table
              aria-label="Tutors table"
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
                  {t("adminDashboard.tutors.table.tutor")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.headline")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.experience")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.rating")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.verifiedStatus")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.status")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody
                isLoading={loading}
                loadingContent={<Spinner size="lg" />}
                emptyContent={t("adminDashboard.tutors.noData")}
              >
                {tutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar src={tutor.avatar} size="sm" />
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {getTutorName(tutor)}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {getTutorEmail(tutor)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className="line-clamp-1"
                        style={{ color: colors.text.primary }}
                      >
                        {tutor.headline || t("adminDashboard.tutors.nA")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.primary }}>
                        {tutor.monthExperience != null
                          ? `${tutor.monthExperience} ${t("adminDashboard.tutors.months")}`
                          : t("adminDashboard.tutors.nA")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tutor.ratingAverage > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star
                            className="w-4 h-4"
                            weight="fill"
                            style={{ color: colors.state.warning }}
                          />
                          <span style={{ color: colors.text.primary }}>
                            {tutor.ratingAverage.toFixed(1)}
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: colors.text.tertiary }}
                          >
                            ({tutor.ratingCount})
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: colors.text.tertiary }}>
                          {t("adminDashboard.tutors.nA")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getVerifiedColor(tutor.verifiedStatus)}
                        variant="flat"
                      >
                        {tutor.verifiedStatus === "Verified"
                          ? t("adminDashboard.tutors.verified")
                          : t("adminDashboard.tutors.unverified")}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getStatusColor(tutor.status)}
                        variant="flat"
                      >
                        {tutor.status}
                      </Chip>
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
                          <DropdownMenu aria-label="Tutor actions">
                            <DropdownItem
                              key="view"
                              startContent={<Eye className="w-4 h-4" />}
                              onPress={() => handleViewTutor(tutor)}
                            >
                              {t("adminDashboard.tutors.view")}
                            </DropdownItem>
                            <DropdownItem
                              key="edit"
                              startContent={
                                <PencilSimple className="w-4 h-4" />
                              }
                              onPress={() => handleEditClick(tutor)}
                            >
                              {t("adminDashboard.tutors.edit")}
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              color="danger"
                              startContent={<Trash className="w-4 h-4" />}
                              onPress={() => handleDeleteClick(tutor)}
                            >
                              {t("adminDashboard.tutors.delete")}
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

      {/* Tutor Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.tutors.tutorDetails")}
              </ModalHeader>
              <ModalBody>
                {detailLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : selectedTutor ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={selectedTutor.avatar}
                        className="w-20 h-20"
                      />
                      <div>
                        <h3
                          className="text-xl font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {getTutorName(selectedTutor)}
                        </h3>
                        <p style={{ color: colors.text.secondary }}>
                          {selectedTutor.headline || ""}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Chip
                            size="sm"
                            color={getVerifiedColor(
                              selectedTutor.verifiedStatus,
                            )}
                            variant="flat"
                          >
                            {selectedTutor.verifiedStatus === "Verified"
                              ? t("adminDashboard.tutors.verified")
                              : t("adminDashboard.tutors.unverified")}
                          </Chip>
                          <Chip
                            size="sm"
                            color={getStatusColor(selectedTutor.status)}
                            variant="flat"
                          >
                            {selectedTutor.status}
                          </Chip>
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className="p-4 rounded-xl text-center"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star
                            className="w-5 h-5"
                            weight="fill"
                            style={{ color: colors.state.warning }}
                          />
                          <span
                            className="text-2xl font-bold"
                            style={{ color: colors.text.primary }}
                          >
                            {selectedTutor.ratingAverage > 0
                              ? selectedTutor.ratingAverage.toFixed(1)
                              : t("adminDashboard.tutors.nA")}
                          </span>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("adminDashboard.tutors.table.rating")}
                          {selectedTutor.ratingCount > 0 &&
                            ` (${selectedTutor.ratingCount} ${t("adminDashboard.tutors.ratingCount")})`}
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
                          {selectedTutor.monthExperience || 0}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("adminDashboard.tutors.experience")} (
                          {t("adminDashboard.tutors.months")})
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
                          {selectedTutor.slotsCount || 0}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("adminDashboard.tutors.slots")}
                        </p>
                      </div>
                    </div>

                    {/* Info grid */}
                    <div className="space-y-3">
                      {selectedTutor.bio && (
                        <div>
                          <p
                            className="text-sm font-semibold mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.tutors.bio")}
                          </p>
                          <p style={{ color: colors.text.primary }}>
                            {selectedTutor.bio}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.tutors.email")}
                          </p>
                          <p style={{ color: colors.text.primary }}>
                            {getTutorEmail(selectedTutor)}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.tutors.phone")}
                          </p>
                          <p style={{ color: colors.text.primary }}>
                            {selectedTutor.user?.phone ||
                              t("adminDashboard.tutors.nA")}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.tutors.joinDate")}
                          </p>
                          <p style={{ color: colors.text.primary }}>
                            {selectedTutor.createdAt
                              ? new Date(
                                  selectedTutor.createdAt,
                                ).toLocaleDateString()
                              : t("adminDashboard.tutors.nA")}
                          </p>
                        </div>
                      </div>
                      {selectedTutor.introVideoUrl && (
                        <div>
                          <p
                            className="text-sm font-semibold mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.tutors.introVideo")}
                          </p>
                          <video
                            src={selectedTutor.introVideoUrl}
                            controls
                            className="w-full max-h-60 rounded-lg"
                          />
                        </div>
                      )}
                      {selectedTutor.cvUrl && (
                        <div>
                          <p
                            className="text-sm font-semibold mb-1"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("adminDashboard.tutors.cvFile")}
                          </p>
                          <a
                            href={selectedTutor.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline"
                            style={{ color: colors.primary.main }}
                          >
                            {t("adminDashboard.tutors.view")} CV
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.tutors.close")}
                </Button>
                <Button
                  onPress={() => {
                    onClose();
                    if (selectedTutor) handleEditClick(selectedTutor);
                  }}
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.tutors.edit")}
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
                {t("adminDashboard.tutors.confirmDelete")}
              </ModalHeader>
              <ModalBody>
                <p style={{ color: colors.text.secondary }}>
                  {t("adminDashboard.tutors.confirmDeleteMsg")}
                </p>
                {tutorToDelete && (
                  <div className="flex items-center gap-3 mt-3">
                    <Avatar src={tutorToDelete.avatar} size="sm" />
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {getTutorName(tutorToDelete)}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.secondary }}
                      >
                        {getTutorEmail(tutorToDelete)}
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.tutors.cancel")}
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteConfirm}
                  isLoading={deleting}
                >
                  {t("adminDashboard.tutors.delete")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Tutor Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: colors.text.primary }}>
                {t("adminDashboard.tutors.editTutor")}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label={t("adminDashboard.tutors.headline")}
                    value={editForm.headline}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        headline: e.target.value,
                      }))
                    }
                    classNames={inputClassNames}
                  />
                  <Textarea
                    label={t("adminDashboard.tutors.bio")}
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    classNames={textareaClassNames}
                    minRows={3}
                  />
                  <Input
                    type="number"
                    label={`${t("adminDashboard.tutors.experience")} (${t("adminDashboard.tutors.months")})`}
                    value={String(editForm.monthExperience)}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        monthExperience: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                    classNames={inputClassNames}
                  />
                  <Input
                    label={t("adminDashboard.tutors.status")}
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    classNames={inputClassNames}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.tutors.cancel")}
                </Button>
                <Button
                  onPress={handleEditSave}
                  isLoading={saving}
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  {t("adminDashboard.tutors.save")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TutorManagement;
