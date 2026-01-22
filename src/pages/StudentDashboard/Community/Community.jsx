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
  Textarea,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  ChatCircle,
  Heart,
  Share,
  Plus,
  Fire,
  Clock,
  CheckCircle,
  User,
  PaperPlaneRight,
  ThumbsUp,
  BookmarkSimple,
} from "@phosphor-icons/react";

const Community = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedTab, setSelectedTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const categories = [
    { key: "all", label: t("studentDashboard.community.categories.all") },
    {
      key: "grammar",
      label: t("studentDashboard.community.categories.grammar"),
    },
    {
      key: "vocabulary",
      label: t("studentDashboard.community.categories.vocabulary"),
    },
    {
      key: "speaking",
      label: t("studentDashboard.community.categories.speaking"),
    },
    {
      key: "writing",
      label: t("studentDashboard.community.categories.writing"),
    },
    { key: "ielts", label: t("studentDashboard.community.categories.ielts") },
    { key: "tips", label: t("studentDashboard.community.categories.tips") },
  ];

  const posts = [
    {
      id: 1,
      author: "Emily Chen",
      avatar: "https://i.pravatar.cc/150?u=user1",
      role: "Student",
      title: "How do I use 'would' vs 'will' correctly?",
      content:
        "I'm confused about when to use 'would' and when to use 'will'. Can someone explain the difference with examples?",
      category: "Grammar",
      likes: 24,
      comments: 12,
      time: "2 hours ago",
      isAnswered: true,
      isTrending: true,
    },
    {
      id: 2,
      author: "Michael Brown",
      avatar: "https://i.pravatar.cc/150?u=user2",
      role: "Tutor",
      isTutor: true,
      title: "5 Tips to Improve Your Speaking Fluency",
      content:
        "After teaching for 10 years, here are my top tips for improving your speaking fluency: 1. Practice daily with native speakers...",
      category: "Speaking",
      likes: 156,
      comments: 45,
      time: "5 hours ago",
      isAnswered: false,
      isTrending: true,
    },
    {
      id: 3,
      author: "Sarah Wilson",
      avatar: "https://i.pravatar.cc/150?u=user3",
      role: "Student",
      title: "IELTS Writing Task 2 - Need feedback on my essay",
      content:
        "I wrote this essay for IELTS practice. Topic: 'Social media has more negative effects than positive ones.' Could someone give me feedback?",
      category: "IELTS",
      likes: 8,
      comments: 6,
      time: "1 day ago",
      isAnswered: true,
      isTrending: false,
    },
    {
      id: 4,
      author: "David Lee",
      avatar: "https://i.pravatar.cc/150?u=user4",
      role: "Student",
      title: "Best resources for learning business vocabulary?",
      content:
        "I'm preparing for a job interview at an international company. What resources do you recommend for learning business English vocabulary?",
      category: "Vocabulary",
      likes: 32,
      comments: 18,
      time: "2 days ago",
      isAnswered: true,
      isTrending: false,
    },
    {
      id: 5,
      author: "Lisa Anderson",
      avatar: "https://i.pravatar.cc/150?u=tutor5",
      role: "Tutor",
      isTutor: true,
      title: "Common mistakes in English writing and how to avoid them",
      content:
        "Here's a comprehensive guide on the most common writing mistakes I see from my students and practical tips to avoid them...",
      category: "Writing",
      likes: 89,
      comments: 23,
      time: "3 days ago",
      isAnswered: false,
      isTrending: true,
    },
  ];

  const trendingPosts = posts.filter((post) => post.isTrending);
  const recentPosts = [...posts].sort(
    (a, b) => posts.indexOf(a) - posts.indexOf(b),
  );

  const displayPosts = selectedTab === "trending" ? trendingPosts : recentPosts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            {t("studentDashboard.community.title")}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {t("studentDashboard.community.subtitle")}
          </p>
        </div>
        <Button
          style={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
          }}
          startContent={<Plus weight="bold" className="w-5 h-5" />}
        >
          {t("studentDashboard.community.newPost")}
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Input
          placeholder={t("studentDashboard.community.searchPlaceholder")}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <MagnifyingGlass
              className="w-5 h-5"
              style={{ color: colors.text.secondary }}
            />
          }
          classNames={{
            inputWrapper: "bg-white dark:bg-gray-800",
          }}
        />
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((cat) => (
          <Chip
            key={cat.key}
            variant="flat"
            className="cursor-pointer"
            style={{
              backgroundColor: colors.background.light,
              color: colors.text.primary,
            }}
          >
            {cat.label}
          </Chip>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              shadow="none" className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar src="https://i.pravatar.cc/150?u=student" size="md" />
                  <div className="flex-1">
                    <Textarea
                      placeholder={t("studentDashboard.community.askQuestion")}
                      value={newPostContent}
                      onValueChange={setNewPostContent}
                      minRows={2}
                      classNames={{
                        inputWrapper: "bg-gray-100 dark:bg-gray-700",
                      }}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: colors.primary.main,
                          color: colors.text.white,
                        }}
                        endContent={
                          <PaperPlaneRight weight="fill" className="w-4 h-4" />
                        }
                      >
                        {t("studentDashboard.community.post")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
                key="trending"
                title={
                  <div className="flex items-center gap-2">
                    <Fire weight="duotone" className="w-5 h-5" />
                    <span>{t("studentDashboard.community.trending")}</span>
                  </div>
                }
              />
              <Tab
                key="recent"
                title={
                  <div className="flex items-center gap-2">
                    <Clock weight="duotone" className="w-5 h-5" />
                    <span>{t("studentDashboard.community.recent")}</span>
                  </div>
                }
              />
            </Tabs>
          </motion.div>

          {/* Posts */}
          <div className="space-y-4">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  shadow="none" className="border-none"
                  style={{ backgroundColor: colors.background.light }}
                  isPressable
                >
                  <CardBody className="p-5">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar src={post.avatar} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {post.author}
                          </span>
                          {post.isTutor && (
                            <Chip
                              size="sm"
                              variant="flat"
                              style={{
                                backgroundColor: colors.background.primaryLight,
                                color: colors.primary.main,
                              }}
                            >
                              {t("studentDashboard.community.tutor")}
                            </Chip>
                          )}
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: colors.text.secondary }}
                        >
                          {post.time}
                        </span>
                      </div>
                      {post.isAnswered && (
                        <Chip
                          size="sm"
                          variant="flat"
                          startContent={
                            <CheckCircle weight="fill" className="w-3 h-3" />
                          }
                          style={{
                            backgroundColor: `${colors.state.success}20`,
                            color: colors.state.success,
                          }}
                        >
                          {t("studentDashboard.community.answered")}
                        </Chip>
                      )}
                    </div>

                    {/* Content */}
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: colors.text.primary }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: colors.text.secondary }}
                    >
                      {post.content}
                    </p>

                    {/* Category */}
                    <Chip
                      size="sm"
                      variant="flat"
                      className="mb-4"
                      style={{
                        backgroundColor: colors.background.gray,
                        color: colors.text.secondary,
                      }}
                    >
                      {post.category}
                    </Chip>

                    {/* Actions */}
                    <div
                      className="flex items-center gap-4 pt-3 border-t"
                      style={{ borderColor: colors.border.light }}
                    >
                      <Button
                        variant="light"
                        size="sm"
                        startContent={
                          <ThumbsUp weight="duotone" className="w-4 h-4" />
                        }
                        style={{ color: colors.text.secondary }}
                      >
                        {post.likes}
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        startContent={
                          <ChatCircle weight="duotone" className="w-4 h-4" />
                        }
                        style={{ color: colors.text.secondary }}
                      >
                        {post.comments}
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        startContent={
                          <BookmarkSimple
                            weight="duotone"
                            className="w-4 h-4"
                          />
                        }
                        style={{ color: colors.text.secondary }}
                      >
                        {t("studentDashboard.community.save")}
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        startContent={
                          <Share weight="duotone" className="w-4 h-4" />
                        }
                        style={{ color: colors.text.secondary }}
                      >
                        {t("studentDashboard.community.share")}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card
              shadow="none" className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-5">
                <h3
                  className="font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("studentDashboard.community.topContributors")}
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      name: "Michael Brown",
                      avatar: "https://i.pravatar.cc/150?u=user2",
                      points: 1250,
                      isTutor: true,
                    },
                    {
                      name: "Lisa Anderson",
                      avatar: "https://i.pravatar.cc/150?u=tutor5",
                      points: 980,
                      isTutor: true,
                    },
                    {
                      name: "Emily Chen",
                      avatar: "https://i.pravatar.cc/150?u=user1",
                      points: 456,
                      isTutor: false,
                    },
                    {
                      name: "David Lee",
                      avatar: "https://i.pravatar.cc/150?u=user4",
                      points: 321,
                      isTutor: false,
                    },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span
                        className="w-6 text-center font-bold"
                        style={{ color: colors.text.secondary }}
                      >
                        {index + 1}
                      </span>
                      <Avatar src={user.avatar} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {user.name}
                          </span>
                          {user.isTutor && (
                            <CheckCircle
                              weight="fill"
                              className="w-4 h-4"
                              style={{ color: colors.primary.main }}
                            />
                          )}
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: colors.text.secondary }}
                        >
                          {user.points} {t("studentDashboard.community.points")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card
              shadow="none" className="border-none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="p-5">
                <h3
                  className="font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("studentDashboard.community.popularTags")}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {[
                    "#grammar",
                    "#ielts",
                    "#speaking",
                    "#vocabulary",
                    "#writing",
                    "#business",
                    "#tips",
                    "#pronunciation",
                  ].map((tag) => (
                    <Chip
                      key={tag}
                      variant="flat"
                      size="sm"
                      className="cursor-pointer"
                      style={{
                        backgroundColor: colors.background.gray,
                        color: colors.primary.main,
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Community;
