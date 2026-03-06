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
  Textarea,
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
  Camera,
  PencilSimple,
  Bell,
  Lock,
  CreditCard,
  Shield,
  SignOut,
  CheckCircle,
  Star,
  Clock,
  Student,
  Certificate,
} from "@phosphor-icons/react";

const Profile = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames, textareaClassNames } = useInputStyles();
  const [selectedTab, setSelectedTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    language: "English",
    bio: "Certified IELTS instructor with 8+ years of experience. Specialized in business English and exam preparation. Passionate about helping students achieve their language goals.",
    specializations: ["IELTS", "Business English", "Conversation"],
    hourlyRate: 45,
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailSubmissions: true,
    emailEarnings: true,
    pushBookings: true,
    pushSubmissions: true,
    pushEarnings: false,
  });

  const stats = [
    {
      icon: Student,
      label: t("tutorDashboard.profile.totalStudents"),
      value: "156",
      color: colors.primary.main,
    },
    {
      icon: Clock,
      label: t("tutorDashboard.profile.hoursTeached"),
      value: "1,240",
      color: colors.state.warning,
    },
    {
      icon: Certificate,
      label: t("tutorDashboard.profile.coursesCreated"),
      value: "8",
      color: colors.state.success,
    },
    {
      icon: Star,
      label: t("tutorDashboard.profile.rating"),
      value: "4.9",
      color: "#F59E0B",
    },
  ];

  const certifications = [
    {
      id: 1,
      title: "IELTS Instructor Certification",
      issuer: "British Council",
      icon: "🎓",
      date: "2020",
    },
    {
      id: 2,
      title: "TESOL Certificate",
      issuer: "Arizona State University",
      icon: "📜",
      date: "2018",
    },
    {
      id: 3,
      title: "Business English Specialist",
      issuer: "Cambridge University",
      icon: "💼",
      date: "2019",
    },
    {
      id: 4,
      title: "Online Teaching Excellence",
      issuer: "Coursera",
      icon: "🌐",
      date: "2021",
    },
  ];

  const earningsHistory = [
    {
      id: 1,
      description: "Lesson with John Doe",
      amount: 45.0,
      date: "Jan 20, 2026",
      status: "completed",
    },
    {
      id: 2,
      description: "Lesson with Emily Chen",
      amount: 45.0,
      date: "Jan 19, 2026",
      status: "completed",
    },
    {
      id: 3,
      description: "Course enrollment - Business English",
      amount: 79.99,
      date: "Jan 18, 2026",
      status: "completed",
    },
    {
      id: 4,
      description: "Lesson with Michael Lee",
      amount: 45.0,
      date: "Jan 17, 2026",
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
          {t("tutorDashboard.profile.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("tutorDashboard.profile.subtitle")}
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
                  src="https://i.pravatar.cc/150?u=tutor"
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
                <p className="mb-2" style={{ color: colors.text.secondary }}>
                  {profileData.email}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                  {profileData.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: colors.background.primaryLight,
                        color: colors.primary.main,
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <p
                  className="text-sm max-w-lg"
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
                      {t("tutorDashboard.profile.tabs.profile")}
                    </span>
                  </div>
                }
              />
              <Tab
                key="certifications"
                title={
                  <div className="flex items-center gap-2">
                    <Certificate className="w-5 h-5" />
                    <span className="font-medium">
                      {t("tutorDashboard.profile.tabs.certifications")}
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
                      {t("tutorDashboard.profile.tabs.notifications")}
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
                      {t("tutorDashboard.profile.tabs.security")}
                    </span>
                  </div>
                }
              />
              <Tab
                key="earnings"
                title={
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">
                      {t("tutorDashboard.profile.tabs.earnings")}
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
                  {t("tutorDashboard.profile.personalInfo")}
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
                    ? t("tutorDashboard.profile.save")
                    : t("tutorDashboard.profile.edit")}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label={t("tutorDashboard.profile.firstName")}
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
                  label={t("tutorDashboard.profile.lastName")}
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
                  label={t("tutorDashboard.profile.email")}
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
                  label={t("tutorDashboard.profile.phone")}
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
                  label={t("tutorDashboard.profile.location")}
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
                  label={t("tutorDashboard.profile.hourlyRate")}
                  value={`$${profileData.hourlyRate}`}
                  isReadOnly={!isEditing}
                  startContent={
                    <CreditCard
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                />
              </div>

              <div className="mt-6">
                <Textarea
                  label={t("tutorDashboard.profile.bio")}
                  value={profileData.bio}
                  isReadOnly={!isEditing}
                  classNames={textareaClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, bio: value })
                  }
                />
              </div>
            </CardBody>
          </Card>
        )}

        {selectedTab === "certifications" && (
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
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
                        {cert.icon}
                      </div>
                      <div>
                        <h4
                          className="font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {cert.title}
                        </h4>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {cert.issuer}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.text.tertiary }}
                        >
                          {cert.date}
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
                  {t("tutorDashboard.profile.emailNotifications")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("tutorDashboard.profile.newBookings")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("tutorDashboard.profile.newBookingsDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.emailBookings}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          emailBookings: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("tutorDashboard.profile.homeworkSubmissions")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("tutorDashboard.profile.homeworkSubmissionsDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.emailSubmissions}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          emailSubmissions: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("tutorDashboard.profile.earningsUpdates")}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("tutorDashboard.profile.earningsUpdatesDesc")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.emailEarnings}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          emailEarnings: value,
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
                  {t("tutorDashboard.profile.pushNotifications")}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("tutorDashboard.profile.newBookings")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.pushBookings}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          pushBookings: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("tutorDashboard.profile.homeworkSubmissions")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.pushSubmissions}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          pushSubmissions: value,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ color: colors.text.primary }}>
                        {t("tutorDashboard.profile.earningsUpdates")}
                      </p>
                    </div>
                    <Switch
                      isSelected={notifications.pushEarnings}
                      onValueChange={(value) =>
                        setNotifications({
                          ...notifications,
                          pushEarnings: value,
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
                  {t("tutorDashboard.profile.changePassword")}
                </h3>
                <div className="space-y-4 max-w-md">
                  <Input
                    type="password"
                    label={t("tutorDashboard.profile.currentPassword")}
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
                    label={t("tutorDashboard.profile.newPassword")}
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
                    label={t("tutorDashboard.profile.confirmPassword")}
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
                    {t("tutorDashboard.profile.updatePassword")}
                  </Button>
                </div>
              </div>

              <Divider />

              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.state.error }}
                >
                  {t("tutorDashboard.profile.dangerZone")}
                </h3>
                <Button
                  variant="bordered"
                  color="danger"
                  startContent={<SignOut weight="bold" className="w-5 h-5" />}
                >
                  {t("tutorDashboard.profile.deleteAccount")}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {selectedTab === "earnings" && (
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
                {t("tutorDashboard.profile.recentEarnings")}
              </h3>

              <div className="space-y-3">
                {earningsHistory.map((earning) => (
                  <div
                    key={earning.id}
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
                          {earning.description}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {earning.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className="font-semibold"
                      style={{ color: colors.state.success }}
                    >
                      +${earning.amount.toFixed(2)}
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
