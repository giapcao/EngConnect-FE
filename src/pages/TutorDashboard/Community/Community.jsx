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
  Heart,
  ChatCircle,
  DotsThree,
  Flag,
  CheckCircle,
  Star,
  Clock,
  Eye,
} from "@phosphor-icons/react";

const Community = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedTab, setSelectedTab] = useState("all");

  const posts = [
    {
      id: 1,
      author: "Nguyen Van A",
      avatar: "https://i.pravatar.cc/150?u=student1",
      role: "student",
      title: "Help with Business English vocabulary",
      content:
        "Can someone explain the difference between 'revenue' and 'profit'? I keep getting confused in my business reports.",
      category: "vocabulary",
      likes: 12,
      comments: 8,
      createdAt: "2 hours ago",
      isAnswered: true,
      bestAnswer: {
        author: "You",
        content:
          "Great question! Revenue is the total income from sales, while profit is what remains after subtracting all expenses from revenue.",
        likes: 15,
      },
    },
    {
      id: 2,
      author: "Tran Thi B",
      avatar: "https://i.pravatar.cc/150?u=student2",
      role: "student",
      title: "IELTS Writing Task 2 - Need feedback",
      content:
        "I've written an essay about technology in education. Can any tutor review and give me feedback?",
      category: "writing",
      likes: 8,
      comments: 3,
      createdAt: "5 hours ago",
      isAnswered: false,
    },
    {
      id: 3,
      author: "Le Van C",
      avatar: "https://i.pravatar.cc/150?u=student3",
      role: "student",
      title: "Pronunciation tips for 'th' sound",
      content:
        "I'm struggling with the 'th' sound in words like 'think' and 'this'. Any tips from native speakers?",
      category: "pronunciation",
      likes: 25,
      comments: 12,
      createdAt: "1 day ago",
      isAnswered: true,
    },
    {
      id: 4,
      author: "Pham Thi D",
      avatar: "https://i.pravatar.cc/150?u=student4",
      role: "student",
      title: "Grammar question - Present Perfect vs Past Simple",
      content:
        "When should I use 'I have been to Paris' vs 'I went to Paris'? I always get confused.",
      category: "grammar",
      likes: 18,
      comments: 6,
      createdAt: "2 days ago",
      isAnswered: false,
    },
  ];

  const categories = [
    { key: "all", label: t("tutorDashboard.community.all") },
    { key: "unanswered", label: t("tutorDashboard.community.unanswered") },
    { key: "vocabulary", label: t("tutorDashboard.community.vocabulary") },
    { key: "grammar", label: t("tutorDashboard.community.grammar") },
    { key: "writing", label: t("tutorDashboard.community.writing") },
    {
      key: "pronunciation",
      label: t("tutorDashboard.community.pronunciation"),
    },
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case "vocabulary":
        return colors.primary.main;
      case "grammar":
        return colors.state.success;
      case "writing":
        return colors.state.warning;
      case "pronunciation":
        return colors.state.info;
      default:
        return colors.text.secondary;
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "unanswered") return !post.isAnswered;
    return post.category === selectedTab;
  });

  const stats = [
    {
      label: t("tutorDashboard.community.totalQuestions"),
      value: "156",
    },
    {
      label: t("tutorDashboard.community.yourAnswers"),
      value: "48",
    },
    {
      label: t("tutorDashboard.community.endorsedAnswers"),
      value: "32",
    },
  ];

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
      >
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {t("tutorDashboard.community.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("tutorDashboard.community.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
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
              <p
                className="text-3xl font-bold"
                style={{ color: colors.primary.main }}
              >
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Input
          placeholder={t("tutorDashboard.community.searchPlaceholder")}
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

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.key}
              size="sm"
              variant={selectedTab === category.key ? "solid" : "flat"}
              style={{
                backgroundColor:
                  selectedTab === category.key
                    ? colors.primary.main
                    : colors.background.light,
                color:
                  selectedTab === category.key
                    ? colors.text.white
                    : colors.text.secondary,
              }}
              onPress={() => setSelectedTab(category.key)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredPosts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <Card
              shadow="none"
              className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={post.avatar} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {post.author}
                        </p>
                        <Chip
                          size="sm"
                          variant="flat"
                          style={{
                            backgroundColor: colors.background.gray,
                            color: colors.text.tertiary,
                          }}
                        >
                          {post.role}
                        </Chip>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        {post.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      size="sm"
                      style={{
                        backgroundColor: `${getCategoryColor(post.category)}20`,
                        color: getCategoryColor(post.category),
                      }}
                    >
                      {post.category}
                    </Chip>
                    {post.isAnswered && (
                      <Chip
                        size="sm"
                        startContent={
                          <CheckCircle weight="fill" className="w-3 h-3" />
                        }
                        style={{
                          backgroundColor: `${colors.state.success}20`,
                          color: colors.state.success,
                        }}
                      >
                        {t("tutorDashboard.community.answered")}
                      </Chip>
                    )}
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <DotsThree weight="bold" className="w-5 h-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="view"
                          startContent={<Eye className="w-4 h-4" />}
                        >
                          {t("tutorDashboard.community.viewPost")}
                        </DropdownItem>
                        <DropdownItem
                          key="report"
                          startContent={<Flag className="w-4 h-4" />}
                        >
                          {t("tutorDashboard.community.report")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {post.title}
                  </h3>
                  <p style={{ color: colors.text.secondary }}>{post.content}</p>
                </div>

                {/* Best Answer Preview */}
                {post.bestAnswer && (
                  <div
                    className="p-4 rounded-xl mb-4"
                    style={{
                      backgroundColor: `${colors.state.success}10`,
                      borderLeft: `3px solid ${colors.state.success}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Star
                        weight="fill"
                        className="w-4 h-4"
                        style={{ color: colors.state.warning }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.state.success }}
                      >
                        {t("tutorDashboard.community.bestAnswer")} by{" "}
                        {post.bestAnswer.author}
                      </span>
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {post.bestAnswer.content}
                    </p>
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="light"
                      size="sm"
                      startContent={
                        <Heart
                          weight="duotone"
                          className="w-4 h-4"
                          style={{ color: colors.state.error }}
                        />
                      }
                      style={{ color: colors.text.secondary }}
                    >
                      {post.likes}
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      startContent={
                        <ChatCircle
                          weight="duotone"
                          className="w-4 h-4"
                          style={{ color: colors.primary.main }}
                        />
                      }
                      style={{ color: colors.text.secondary }}
                    >
                      {post.comments}
                    </Button>
                  </div>
                  {!post.isAnswered && (
                    <Button
                      size="sm"
                      style={{
                        backgroundColor: colors.primary.main,
                        color: colors.text.white,
                      }}
                    >
                      {t("tutorDashboard.community.addAnswer")}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Community;
