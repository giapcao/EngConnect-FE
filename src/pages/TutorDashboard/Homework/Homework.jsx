import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Input,
  Chip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  Plus,
  DotsThree,
  Eye,
  PencilSimple,
  Trash,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Star,
} from "@phosphor-icons/react";

const Homework = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGradeOpen,
    onOpen: onGradeOpen,
    onClose: onGradeClose,
  } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const assignments = [
    {
      id: 1,
      title: "Business Email Writing",
      course: "Business English",
      dueDate: "Jan 25, 2026",
      status: "active",
      totalSubmissions: 12,
      gradedCount: 8,
      description: "Write a formal business email requesting a meeting.",
    },
    {
      id: 2,
      title: "IELTS Writing Task 2 Practice",
      course: "IELTS Preparation",
      dueDate: "Jan 26, 2026",
      status: "active",
      totalSubmissions: 8,
      gradedCount: 3,
      description:
        "Write an essay discussing the advantages and disadvantages of remote work.",
    },
    {
      id: 3,
      title: "Vocabulary Quiz - Unit 5",
      course: "Conversational English",
      dueDate: "Jan 20, 2026",
      status: "closed",
      totalSubmissions: 15,
      gradedCount: 15,
      description: "Complete the vocabulary quiz covering Unit 5 topics.",
    },
  ];

  const submissions = [
    {
      id: 1,
      assignmentId: 1,
      student: "Nguyen Van A",
      avatar: "https://i.pravatar.cc/150?u=student1",
      submittedAt: "Jan 23, 2026 - 10:30 AM",
      status: "pending",
      grade: null,
      file: "business_email_nguyenvana.pdf",
    },
    {
      id: 2,
      assignmentId: 1,
      student: "Tran Thi B",
      avatar: "https://i.pravatar.cc/150?u=student2",
      submittedAt: "Jan 22, 2026 - 3:45 PM",
      status: "graded",
      grade: 85,
      file: "email_tranthib.docx",
    },
    {
      id: 3,
      assignmentId: 1,
      student: "Le Van C",
      avatar: "https://i.pravatar.cc/150?u=student3",
      submittedAt: "Jan 23, 2026 - 9:00 AM",
      status: "pending",
      grade: null,
      file: "assignment1_levanc.pdf",
    },
    {
      id: 4,
      assignmentId: 2,
      student: "Pham Thi D",
      avatar: "https://i.pravatar.cc/150?u=student4",
      submittedAt: "Jan 24, 2026 - 11:15 AM",
      status: "graded",
      grade: 92,
      file: "ielts_essay_phamthid.pdf",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return colors.state.success;
      case "closed":
        return colors.text.tertiary;
      case "graded":
        return colors.state.success;
      case "pending":
        return colors.state.warning;
      default:
        return colors.text.secondary;
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (selectedTab === "all") return true;
    return assignment.status === selectedTab;
  });

  const handleGrade = (submission) => {
    setSelectedSubmission(submission);
    onGradeOpen();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {t("tutorDashboard.homework.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("tutorDashboard.homework.subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus weight="bold" className="w-5 h-5" />}
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
          onPress={onOpen}
        >
          {t("tutorDashboard.homework.createAssignment")}
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("tutorDashboard.homework.searchPlaceholder")}
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
          <Tab key="all" title={t("tutorDashboard.homework.all")} />
          <Tab key="active" title={t("tutorDashboard.homework.active")} />
          <Tab key="closed" title={t("tutorDashboard.homework.closed")} />
        </Tabs>
      </motion.div>

      {/* Assignments */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {filteredAssignments.map((assignment) => (
          <motion.div key={assignment.id} variants={itemVariants}>
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                {/* Assignment Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        {assignment.title}
                      </h3>
                      <Chip
                        size="sm"
                        style={{
                          backgroundColor: `${getStatusColor(assignment.status)}20`,
                          color: getStatusColor(assignment.status),
                        }}
                      >
                        {assignment.status}
                      </Chip>
                    </div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: colors.primary.main }}
                    >
                      {assignment.course}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {assignment.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className="text-sm"
                        style={{ color: colors.text.tertiary }}
                      >
                        {t("tutorDashboard.homework.dueDate")}
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {assignment.dueDate}
                      </p>
                    </div>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <DotsThree weight="bold" className="w-5 h-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="edit"
                          startContent={<PencilSimple className="w-4 h-4" />}
                        >
                          {t("tutorDashboard.homework.edit")}
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          startContent={<Trash className="w-4 h-4" />}
                        >
                          {t("tutorDashboard.homework.delete")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                {/* Stats */}
                <div
                  className="flex items-center gap-6 mb-4 pb-4 border-b"
                  style={{ borderColor: colors.border.light }}
                >
                  <div className="flex items-center gap-2">
                    <FileText
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.text.tertiary }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {assignment.totalSubmissions}{" "}
                      {t("tutorDashboard.homework.submissions")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.state.success }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {assignment.gradedCount}{" "}
                      {t("tutorDashboard.homework.graded")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock
                      weight="duotone"
                      className="w-5 h-5"
                      style={{ color: colors.state.warning }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {assignment.totalSubmissions - assignment.gradedCount}{" "}
                      {t("tutorDashboard.homework.pending")}
                    </span>
                  </div>
                </div>

                {/* Submissions */}
                <div className="space-y-3">
                  <h4
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorDashboard.homework.recentSubmissions")}
                  </h4>
                  {submissions
                    .filter((s) => s.assignmentId === assignment.id)
                    .slice(0, 3)
                    .map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar src={submission.avatar} size="sm" />
                          <div>
                            <p
                              className="font-medium text-sm"
                              style={{ color: colors.text.primary }}
                            >
                              {submission.student}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {submission.submittedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {submission.status === "graded" ? (
                            <div className="flex items-center gap-2">
                              <Star
                                weight="fill"
                                className="w-4 h-4"
                                style={{ color: colors.state.warning }}
                              />
                              <span
                                className="font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                {submission.grade}/100
                              </span>
                            </div>
                          ) : (
                            <Chip
                              size="sm"
                              style={{
                                backgroundColor: `${colors.state.warning}20`,
                                color: colors.state.warning,
                              }}
                            >
                              {t("tutorDashboard.homework.pendingReview")}
                            </Chip>
                          )}
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<Download className="w-4 h-4" />}
                            style={{
                              backgroundColor: colors.background.light,
                              color: colors.text.secondary,
                            }}
                          >
                            {t("tutorDashboard.homework.download")}
                          </Button>
                          {submission.status === "pending" && (
                            <Button
                              size="sm"
                              style={{
                                backgroundColor: colors.primary.main,
                                color: colors.text.white,
                              }}
                              onPress={() => handleGrade(submission)}
                            >
                              {t("tutorDashboard.homework.grade")}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Assignment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("tutorDashboard.homework.createNewAssignment")}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label={t("tutorDashboard.homework.assignmentTitle")}
                placeholder={t("tutorDashboard.homework.titlePlaceholder")}
                labelPlacement="outside"
              />
              <Textarea
                label={t("tutorDashboard.homework.description")}
                placeholder={t(
                  "tutorDashboard.homework.descriptionPlaceholder",
                )}
                labelPlacement="outside"
                minRows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t("tutorDashboard.homework.dueDate")}
                  type="date"
                  labelPlacement="outside"
                />
                <Input
                  label={t("tutorDashboard.homework.course")}
                  placeholder={t("tutorDashboard.homework.selectCourse")}
                  labelPlacement="outside"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              {t("tutorDashboard.homework.cancel")}
            </Button>
            <Button
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              onPress={onClose}
            >
              {t("tutorDashboard.homework.create")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Grade Modal */}
      <Modal isOpen={isGradeOpen} onClose={onGradeClose} size="lg">
        <ModalContent style={{ backgroundColor: colors.background.light }}>
          <ModalHeader style={{ color: colors.text.primary }}>
            {t("tutorDashboard.homework.gradeSubmission")}
          </ModalHeader>
          <ModalBody>
            {selectedSubmission && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar src={selectedSubmission.avatar} size="md" />
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      {selectedSubmission.student}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {selectedSubmission.submittedAt}
                    </p>
                  </div>
                </div>
                <Input
                  label={t("tutorDashboard.homework.gradeScore")}
                  placeholder="0-100"
                  type="number"
                  labelPlacement="outside"
                  endContent={
                    <span style={{ color: colors.text.tertiary }}>/100</span>
                  }
                />
                <Textarea
                  label={t("tutorDashboard.homework.feedback")}
                  placeholder={t("tutorDashboard.homework.feedbackPlaceholder")}
                  labelPlacement="outside"
                  minRows={4}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onGradeClose}>
              {t("tutorDashboard.homework.cancel")}
            </Button>
            <Button
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              onPress={onGradeClose}
            >
              {t("tutorDashboard.homework.submitGrade")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Homework;
