import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Tabs,
  Tab,
  Progress,
  Avatar,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  PencilLine,
  Clock,
  CheckCircle,
  Warning,
  FileText,
  Upload,
  Eye,
  Robot,
  CaretRight,
  Star,
} from "@phosphor-icons/react";

const Homework = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedTab, setSelectedTab] = useState("pending");

  const homework = {
    pending: [
      {
        id: 1,
        title: "IELTS Writing Task 2 - Environment Essay",
        course: "IELTS Band 7+ Preparation",
        tutor: "Michael Chen",
        tutorAvatar: "https://i.pravatar.cc/150?u=tutor2",
        dueDate: "Dec 20, 2024",
        daysLeft: 3,
        type: "essay",
        description:
          "Write a 250-word essay on the topic: 'Some people believe that environmental problems are too big for individuals to solve. Others think that individuals can make a significant contribution. Discuss both views and give your opinion.'",
      },
      {
        id: 2,
        title: "Business Email Writing",
        course: "Business English Masterclass",
        tutor: "Sarah Johnson",
        tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
        dueDate: "Dec 22, 2024",
        daysLeft: 5,
        type: "writing",
        description:
          "Write a professional email requesting a meeting with a potential client. Include all necessary formal elements.",
      },
      {
        id: 3,
        title: "Grammar Exercise - Past Tenses",
        course: "English for Beginners",
        tutor: "Emma Wilson",
        tutorAvatar: "https://i.pravatar.cc/150?u=tutor3",
        dueDate: "Dec 18, 2024",
        daysLeft: 1,
        type: "exercise",
        description:
          "Complete all exercises on past simple vs past continuous.",
      },
    ],
    submitted: [
      {
        id: 4,
        title: "Reading Comprehension Test",
        course: "IELTS Band 7+ Preparation",
        tutor: "Michael Chen",
        tutorAvatar: "https://i.pravatar.cc/150?u=tutor2",
        submittedDate: "Dec 14, 2024",
        status: "reviewing",
        type: "test",
      },
      {
        id: 5,
        title: "Vocabulary Quiz - Business Terms",
        course: "Business English Masterclass",
        tutor: "Sarah Johnson",
        tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
        submittedDate: "Dec 12, 2024",
        status: "reviewed",
        score: 85,
        aiCorrections: 3,
        type: "quiz",
      },
    ],
    completed: [
      {
        id: 6,
        title: "Listening Practice - Conversations",
        course: "IELTS Band 7+ Preparation",
        tutor: "Michael Chen",
        tutorAvatar: "https://i.pravatar.cc/150?u=tutor2",
        completedDate: "Dec 10, 2024",
        score: 90,
        feedback:
          "Excellent work! Your listening comprehension has improved significantly.",
        type: "listening",
      },
      {
        id: 7,
        title: "Speaking Task - Self Introduction",
        course: "Business English Masterclass",
        tutor: "Sarah Johnson",
        tutorAvatar: "https://i.pravatar.cc/150?u=tutor1",
        completedDate: "Dec 8, 2024",
        score: 78,
        feedback:
          "Good effort! Focus on improving your pronunciation of certain words.",
        type: "speaking",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "reviewing":
        return colors.state.warning;
      case "reviewed":
        return colors.state.success;
      default:
        return colors.text.secondary;
    }
  };

  const getDaysLeftColor = (daysLeft) => {
    if (daysLeft <= 1) return colors.state.error;
    if (daysLeft <= 3) return colors.state.warning;
    return colors.state.success;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          {t("studentDashboard.homework.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("studentDashboard.homework.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: `${colors.state.warning}20` }}
            >
              <Clock
                weight="duotone"
                className="w-6 h-6"
                style={{ color: colors.state.warning }}
              />
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.state.warning }}
            >
              {homework.pending.length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {t("studentDashboard.homework.pending")}
            </p>
          </CardBody>
        </Card>

        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: colors.background.primaryLight }}
            >
              <FileText
                weight="duotone"
                className="w-6 h-6"
                style={{ color: colors.primary.main }}
              />
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.primary.main }}
            >
              {homework.submitted.length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {t("studentDashboard.homework.submitted")}
            </p>
          </CardBody>
        </Card>

        <Card
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: `${colors.state.success}20` }}
            >
              <CheckCircle
                weight="duotone"
                className="w-6 h-6"
                style={{ color: colors.state.success }}
              />
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.state.success }}
            >
              {homework.completed.length}
            </p>
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {t("studentDashboard.homework.completed")}
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          variant="underlined"
          classNames={{
            tabList: "gap-6",
            tab: "px-0 h-12",
          }}
        >
          <Tab
            key="pending"
            title={
              <div className="flex items-center gap-2">
                <Clock weight="duotone" className="w-5 h-5" />
                <span>{t("studentDashboard.homework.pending")}</span>
                <Chip size="sm" color="warning" variant="flat">
                  {homework.pending.length}
                </Chip>
              </div>
            }
          />
          <Tab
            key="submitted"
            title={
              <div className="flex items-center gap-2">
                <Upload weight="duotone" className="w-5 h-5" />
                <span>{t("studentDashboard.homework.submitted")}</span>
                <Chip size="sm" variant="flat">
                  {homework.submitted.length}
                </Chip>
              </div>
            }
          />
          <Tab
            key="completed"
            title={
              <div className="flex items-center gap-2">
                <CheckCircle weight="duotone" className="w-5 h-5" />
                <span>{t("studentDashboard.homework.completed")}</span>
                <Chip size="sm" color="success" variant="flat">
                  {homework.completed.length}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </motion.div>

      {/* Homework List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {selectedTab === "pending" &&
          homework.pending.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: colors.background.primaryLight,
                          }}
                        >
                          <PencilLine
                            weight="duotone"
                            className="w-5 h-5"
                            style={{ color: colors.primary.main }}
                          />
                        </div>
                        <div>
                          <h3
                            className="font-semibold mb-1"
                            style={{ color: colors.text.primary }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="text-sm mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            {item.course}
                          </p>
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={item.tutorAvatar}
                              size="sm"
                              className="w-5 h-5"
                            />
                            <span
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {item.tutor}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p
                        className="text-sm mb-4 line-clamp-2"
                        style={{ color: colors.text.secondary }}
                      >
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3">
                        <Chip
                          size="sm"
                          variant="flat"
                          startContent={
                            <Warning weight="duotone" className="w-3 h-3" />
                          }
                          style={{
                            backgroundColor: `${getDaysLeftColor(item.daysLeft)}20`,
                            color: getDaysLeftColor(item.daysLeft),
                          }}
                        >
                          {item.daysLeft}{" "}
                          {t("studentDashboard.homework.daysLeft")}
                        </Chip>
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("studentDashboard.homework.dueDate")}:{" "}
                          {item.dueDate}
                        </span>
                      </div>
                    </div>

                    <Button
                      style={{
                        backgroundColor: colors.primary.main,
                        color: colors.text.white,
                      }}
                      endContent={
                        <CaretRight weight="bold" className="w-4 h-4" />
                      }
                    >
                      {t("studentDashboard.homework.startNow")}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}

        {selectedTab === "submitted" &&
          homework.submitted.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <FileText
                          weight="duotone"
                          className="w-5 h-5"
                          style={{ color: colors.text.secondary }}
                        />
                      </div>
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-sm mb-2"
                          style={{ color: colors.text.secondary }}
                        >
                          {item.course}
                        </p>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {t("studentDashboard.homework.submittedOn")}:{" "}
                            {item.submittedDate}
                          </span>
                          <Chip
                            size="sm"
                            variant="flat"
                            style={{
                              backgroundColor: `${getStatusColor(item.status)}20`,
                              color: getStatusColor(item.status),
                            }}
                          >
                            {item.status === "reviewing"
                              ? t("studentDashboard.homework.reviewing")
                              : t("studentDashboard.homework.reviewed")}
                          </Chip>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.status === "reviewed" && (
                        <div className="text-center">
                          <p
                            className="text-2xl font-bold"
                            style={{ color: colors.state.success }}
                          >
                            {item.score}%
                          </p>
                          {item.aiCorrections > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Robot
                                weight="duotone"
                                className="w-4 h-4"
                                style={{ color: colors.primary.main }}
                              />
                              <span style={{ color: colors.text.secondary }}>
                                {item.aiCorrections}{" "}
                                {t("studentDashboard.homework.aiCorrections")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <Button
                        variant="bordered"
                        startContent={
                          <Eye weight="duotone" className="w-4 h-4" />
                        }
                      >
                        {t("studentDashboard.homework.viewDetails")}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}

        {selectedTab === "completed" &&
          homework.completed.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                shadow="none"
                className="border-none"
                style={{ backgroundColor: colors.background.light }}
              >
                <CardBody className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${colors.state.success}20` }}
                      >
                        <CheckCircle
                          weight="duotone"
                          className="w-5 h-5"
                          style={{ color: colors.state.success }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-sm mb-2"
                          style={{ color: colors.text.secondary }}
                        >
                          {item.course}
                        </p>
                        <p
                          className="text-sm mb-3"
                          style={{ color: colors.text.secondary }}
                        >
                          {t("studentDashboard.homework.completedOn")}:{" "}
                          {item.completedDate}
                        </p>

                        {item.feedback && (
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: colors.background.gray }}
                          >
                            <p
                              className="text-sm font-medium mb-1"
                              style={{ color: colors.text.primary }}
                            >
                              {t("studentDashboard.homework.tutorFeedback")}:
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              "{item.feedback}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        className="w-20 h-20 rounded-full flex flex-col items-center justify-center mx-auto mb-2"
                        style={{
                          backgroundColor:
                            item.score >= 80
                              ? `${colors.state.success}20`
                              : item.score >= 60
                                ? `${colors.state.warning}20`
                                : `${colors.state.error}20`,
                        }}
                      >
                        <span
                          className="text-2xl font-bold"
                          style={{
                            color:
                              item.score >= 80
                                ? colors.state.success
                                : item.score >= 60
                                  ? colors.state.warning
                                  : colors.state.error,
                          }}
                        >
                          {item.score}%
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            weight={
                              i < Math.round(item.score / 20)
                                ? "fill"
                                : "regular"
                            }
                            className="w-4 h-4"
                            style={{
                              color:
                                i < Math.round(item.score / 20)
                                  ? colors.state.warning
                                  : colors.text.secondary,
                            }}
                          />
                        ))}
                      </div>
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

export default Homework;
