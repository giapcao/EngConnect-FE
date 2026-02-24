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
  ChalkboardTeacher,
  Star,
  CurrencyDollar,
  Users,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";

const TutorManagement = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTutor, setSelectedTutor] = useState(null);

  const stats = [
    {
      icon: ChalkboardTeacher,
      label: t("adminDashboard.tutors.stats.totalTutors"),
      value: "458",
      color: colors.primary.main,
      bg: colors.background.primaryLight,
    },
    {
      icon: CheckCircle,
      label: t("adminDashboard.tutors.stats.verified"),
      value: "412",
      color: colors.state.success,
      bg: `${colors.state.success}20`,
    },
    {
      icon: Users,
      label: t("adminDashboard.tutors.stats.totalStudents"),
      value: "12,847",
      color: colors.state.warning,
      bg: `${colors.state.warning}20`,
    },
    {
      icon: CurrencyDollar,
      label: t("adminDashboard.tutors.stats.totalEarnings"),
      value: "$248,560",
      color: colors.state.error,
      bg: `${colors.state.error}20`,
    },
  ];

  const tutors = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "https://i.pravatar.cc/150?u=tutor1",
      specialty: "Business English",
      rating: 4.9,
      students: 234,
      earnings: "$12,450",
      status: "verified",
      joinDate: "Jan 10, 2024",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@example.com",
      avatar: "https://i.pravatar.cc/150?u=tutor2",
      specialty: "IELTS Preparation",
      rating: 4.8,
      students: 189,
      earnings: "$9,830",
      status: "verified",
      joinDate: "Feb 15, 2024",
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      avatar: "https://i.pravatar.cc/150?u=tutor3",
      specialty: "Conversational English",
      rating: 4.9,
      students: 312,
      earnings: "$15,200",
      status: "verified",
      joinDate: "Dec 20, 2023",
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.b@example.com",
      avatar: "https://i.pravatar.cc/150?u=pending1",
      specialty: "Grammar Expert",
      rating: 0,
      students: 0,
      earnings: "$0",
      status: "pending",
      joinDate: "Jan 25, 2024",
    },
    {
      id: 5,
      name: "Anna Martinez",
      email: "anna.m@example.com",
      avatar: "https://i.pravatar.cc/150?u=pending2",
      specialty: "Academic Writing",
      rating: 0,
      students: 0,
      earnings: "$0",
      status: "pending",
      joinDate: "Jan 26, 2024",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "danger";
      default:
        return "default";
    }
  };

  const handleViewTutor = (tutor) => {
    setSelectedTutor(tutor);
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
          <Button
            startContent={<Plus className="w-4 h-4" />}
            style={{
              backgroundColor: colors.primary.main,
              color: colors.text.white,
            }}
          >
            {t("adminDashboard.tutors.addTutor")}
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
                      {t("adminDashboard.tutors.status")}:{" "}
                      {selectedStatus === "all"
                        ? t("adminDashboard.tutors.all")
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
                      {t("adminDashboard.tutors.all")}
                    </DropdownItem>
                    <DropdownItem key="verified">
                      {t("adminDashboard.tutors.verified")}
                    </DropdownItem>
                    <DropdownItem key="pending">
                      {t("adminDashboard.tutors.pending")}
                    </DropdownItem>
                    <DropdownItem key="suspended">
                      {t("adminDashboard.tutors.suspended")}
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
              aria-label="Tutors table"
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
                  {t("adminDashboard.tutors.table.tutor")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.specialty")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.rating")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.students")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.earnings")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.status")}
                </TableColumn>
                <TableColumn>
                  {t("adminDashboard.tutors.table.actions")}
                </TableColumn>
              </TableHeader>
              <TableBody>
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
                            {tutor.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.text.secondary }}
                          >
                            {tutor.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.primary }}>
                        {tutor.specialty}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tutor.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star
                            className="w-4 h-4"
                            weight="fill"
                            style={{ color: colors.state.warning }}
                          />
                          <span style={{ color: colors.text.primary }}>
                            {tutor.rating}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: colors.text.tertiary }}>N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.text.primary }}>
                        {tutor.students}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: colors.state.success }}>
                        {tutor.earnings}
                      </span>
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
                        {tutor.status === "pending" && (
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
                            >
                              {t("adminDashboard.tutors.edit")}
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              color="danger"
                              startContent={<Trash className="w-4 h-4" />}
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
                {selectedTutor && (
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
                          {selectedTutor.name}
                        </h3>
                        <p style={{ color: colors.text.secondary }}>
                          {selectedTutor.specialty}
                        </p>
                        <Chip
                          size="sm"
                          color={getStatusColor(selectedTutor.status)}
                          variant="flat"
                          className="mt-2"
                        >
                          {selectedTutor.status}
                        </Chip>
                      </div>
                    </div>
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
                            {selectedTutor.rating || "N/A"}
                          </span>
                        </div>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          Rating
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
                          {selectedTutor.students}
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
                        <p
                          className="text-2xl font-bold"
                          style={{ color: colors.state.success }}
                        >
                          {selectedTutor.earnings}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          Earnings
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("adminDashboard.tutors.close")}
                </Button>
                <Button
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
    </div>
  );
};

export default TutorManagement;
