import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Input,
  Tabs,
  Tab,
  Switch,
  Divider,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  User,
  Envelope,
  Phone,
  MapPin,
  Calendar,
  GlobeHemisphereWest,
  Camera,
  PencilSimple,
  Bell,
  Lock,
  CreditCard,
  Shield,
  SignOut,
  CheckCircle,
  Trophy,
  BookOpen,
  Clock,
  Fire,
} from "@phosphor-icons/react";

const Profile = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const [selectedTab, setSelectedTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    birthday: "1995-06-15",
    language: "English",
    bio: "Passionate English learner aiming to improve my communication skills for business and travel.",
  });

  const [notifications, setNotifications] = useState({
    emailLessons: true,
    emailHomework: true,
    emailCommunity: false,
    pushLessons: true,
    pushHomework: true,
    pushCommunity: true,
  });

  const stats = [
    {
      icon: BookOpen,
      label: t("studentDashboard.profile.coursesCompleted"),
      value: "5",
      color: colors.primary.main,
    },
    {
      icon: Clock,
      label: t("studentDashboard.profile.hoursLearned"),
      value: "120",
      color: colors.state.warning,
    },
    {
      icon: Trophy,
      label: t("studentDashboard.profile.certificates"),
      value: "3",
      color: colors.state.success,
    },
    {
      icon: Fire,
      label: t("studentDashboard.profile.currentStreak"),
      value: "7",
      color: colors.state.error,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Completed your first lesson",
      icon: "🎯",
      date: "Nov 1, 2024",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "7 day learning streak",
      icon: "🔥",
      date: "Nov 15, 2024",
    },
    {
      id: 3,
      title: "Grammar Guru",
      description: "Completed grammar course",
      icon: "📚",
      date: "Nov 20, 2024",
    },
    {
      id: 4,
      title: "Social Butterfly",
      description: "Made 10 community posts",
      icon: "🦋",
      date: "Dec 1, 2024",
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      course: "Business English Masterclass",
      amount: 49.99,
      date: "Dec 1, 2024",
      status: "completed",
    },
    {
      id: 2,
      course: "IELTS Band 7+ Preparation",
      amount: 79.99,
      date: "Nov 15, 2024",
      status: "completed",
    },
    {
      id: 3,
      course: "English for Beginners",
      amount: 29.99,
      date: "Oct 28, 2024",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          {t("studentDashboard.profile.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("studentDashboard.profile.subtitle")}
        </p>
      </motion.div>

      {/* Profile Card */}
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
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  src="https://i.pravatar.cc/150?u=student"
                  className="w-24 h-24"
                />
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  className="absolute bottom-0 right-0"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                >
                  <Camera weight="fill" className="w-4 h-4" />
                </Button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="mb-3" style={{ color: colors.text.secondary }}>
                  {profileData.email}
                </p>
                <p
                  className="text-sm max-w-md"
                  style={{ color: colors.text.secondary }}
                >
                  {profileData.bio}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-3 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <stat.icon
                      weight="duotone"
                      className="w-6 h-6 mx-auto mb-1"
                      style={{ color: stat.color }}
                    />
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
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Card
          shadow="none"
          className="border-none rounded-full"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-2">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              variant="light"
              radius="full"
              classNames={{
                tabList: "gap-2 w-full p-1",
                tab: "px-6 h-12",
              }}
              style={{
                "--heroui-hover-opacity": "1",
              }}
              color="primary"
            >
              <Tab
                key="profile"
                title={
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">
                      {t("studentDashboard.profile.tabs.profile")}
                    </span>
                  </div>
                }
              />
              <Tab
                key="achievements"
                title={
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">
                      {t("studentDashboard.profile.tabs.achievements")}
                    </span>
                  </div>
                }
              />
              <Tab
                key="notifications"
                title={
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">
                      {t("studentDashboard.profile.tabs.notifications")}
                    </span>
                  </div>
                }
              />
              <Tab
                key="security"
                title={
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">
                      {t("studentDashboard.profile.tabs.security")}
                    </span>
                  </div>
                }
              />
              <Tab
                key="payments"
                title={
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">
                      {t("studentDashboard.profile.tabs.payments")}
                    </span>
                  </div>
                }
              />
            </Tabs>
          </CardBody>
        </Card>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        {selectedTab === "profile" && (
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  {t("studentDashboard.profile.personalInfo")}
                </h3>
                <Button
                  variant={isEditing ? "solid" : "outline"}
                  size="sm"
                  startContent={
                    isEditing ? (
                      <CheckCircle weight="duotone" className="w-4 h-4" />
                    ) : (
                      <PencilSimple weight="duotone" className="w-4 h-4" />
                    )
                  }
                  style={
                    isEditing
                      ? {
                          backgroundColor: colors.primary.main,
                          color: colors.text.white,
                        }
                      : {
                          backgroundColor:
                            colors.button.primaryLight.background,
                          color: colors.button.primaryLight.text,
                        }
                  }
                  onPress={() => setIsEditing(!isEditing)}
                >
                  {isEditing
                    ? t("studentDashboard.profile.save")
                    : t("studentDashboard.profile.edit")}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label={t("studentDashboard.profile.firstName")}
                  value={profileData.firstName}
                  isReadOnly={!isEditing}
                  startContent={
                    <User
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, firstName: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.lastName")}
                  value={profileData.lastName}
                  isReadOnly={!isEditing}
                  startContent={
                    <User
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, lastName: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.email")}
                  value={profileData.email}
                  isReadOnly={!isEditing}
                  startContent={
                    <Envelope
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, email: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.phone")}
                  value={profileData.phone}
                  isReadOnly={!isEditing}
                  startContent={
                    <Phone
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, phone: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.location")}
                  value={profileData.location}
                  isReadOnly={!isEditing}
                  startContent={
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, location: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.language")}
                  value={profileData.language}
                  isReadOnly={!isEditing}
                  startContent={
                    <GlobeHemisphereWest
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, language: value })
                  }
                />
              </div>
            </CardBody>
          </Card>
        )}

        {selectedTab === "achievements" && (
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                <Card
                  shadow="none"
                  className="border-none"
                  style={{ backgroundColor: colors.background.light }}
                >
                  <CardBody className="p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        {achievement.icon}
                      </div>
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {achievement.title}
                        </h4>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {achievement.description}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.text.secondary }}
                        >
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {selectedTab === "notifications" && (
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6 space-y-6">
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("studentDashboard.profile.emailNotifications")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("studentDashboard.profile.lessonReminders")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("studentDashboard.profile.lessonRemindersDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.emailLessons}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          emailLessons: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("studentDashboard.profile.homeworkDeadlines")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("studentDashboard.profile.homeworkDeadlinesDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.emailHomework}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          emailHomework: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("studentDashboard.profile.communityUpdates")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("studentDashboard.profile.communityUpdatesDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.emailCommunity}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          emailCommunity: value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("studentDashboard.profile.pushNotifications")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("studentDashboard.profile.lessonReminders")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.pushLessons}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          pushLessons: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("studentDashboard.profile.homeworkDeadlines")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.pushHomework}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          pushHomework: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("studentDashboard.profile.communityUpdates")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.pushCommunity}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          pushCommunity: value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {selectedTab === "security" && (
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6 space-y-6">
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  {t("studentDashboard.profile.changePassword")}
                </h3>
                <div className="space-y-4 max-w-md">
                  <Input
                    type="password"
                    label={t("studentDashboard.profile.currentPassword")}
                    startContent={
                      <Lock
                        weight="duotone"
                        className="w-5 h-5"
                        style={{ color: colors.text.secondary }}
                      />
                    }
                    classNames={inputClassNames}
                  />
                  <Input
                    type="password"
                    label={t("studentDashboard.profile.newPassword")}
                    startContent={
                      <Lock
                        weight="duotone"
                        className="w-5 h-5"
                        style={{ color: colors.text.secondary }}
                      />
                    }
                    classNames={inputClassNames}
                  />
                  <Input
                    type="password"
                    label={t("studentDashboard.profile.confirmPassword")}
                    startContent={
                      <Lock
                        weight="duotone"
                        className="w-5 h-5"
                        style={{ color: colors.text.secondary }}
                      />
                    }
                    classNames={inputClassNames}
                  />
                  <Button
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                  >
                    {t("studentDashboard.profile.updatePassword")}
                  </Button>
                </div>
              </div>

              <Divider />

              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.state.error }}
                >
                  {t("studentDashboard.profile.dangerZone")}
                </h3>
                <Button
                  variant="bordered"
                  color="danger"
                  startContent={<SignOut weight="bold" className="w-5 h-5" />}
                >
                  {t("studentDashboard.profile.deleteAccount")}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {selectedTab === "payments" && (
          <Card
            shadow="none"
            className="border-none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t("studentDashboard.profile.paymentHistory")}
              </h3>

              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${colors.state.success}20` }}
                      >
                        <CheckCircle
                          weight="fill"
                          className="w-5 h-5"
                          style={{ color: colors.state.success }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: colors.text.primary }}
                        >
                          {payment.course}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {payment.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className="font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      ${payment.amount}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
