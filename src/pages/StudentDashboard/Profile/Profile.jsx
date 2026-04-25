import { useState, useEffect, useRef } from "react";
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
  Spinner,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  User,
  Envelope,
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
  GraduationCap,
  BookBookmark,
  Note,
} from "@phosphor-icons/react";
import { studentApi } from "../../../api";
import { authApi } from "../../../api/authApi";
import ProfileSkeleton from "../../../components/ProfileSkeleton/ProfileSkeleton";
import { useDispatch } from "react-redux";
import { updateUserAvatar, updateUserInfo } from "../../../store";

const Profile = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentUserId, setStudentUserId] = useState("");
  const fileInputRef = useRef(null);
  const [originalData, setOriginalData] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    notes: "",
    school: "",
    grade: "",
    class: "",
    avatar: "",
  });

  const [notifications, setNotifications] = useState({
    emailLessons: true,
    emailHomework: true,
    emailCommunity: false,
    pushLessons: true,
    pushHomework: true,
    pushCommunity: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, avatarRes] = await Promise.all([
          studentApi.getStudentProfile(),
          studentApi.getStudentAvatar().catch(() => null),
        ]);
        const d = profileRes.data;
        const avatarUrl = avatarRes?.data?.url || d.avatar || "";
        setStudentId(d.id);
        setStudentUserId(d.userId);
        const data = {
          firstName: d.user?.firstName || "",
          lastName: d.user?.lastName || "",
          email: d.user?.email || "",
          notes: d.notes || "",
          school: d.school || "",
          grade: d.grade || "",
          class: d.class || "",
          avatar: avatarUrl,
        };
        setProfileData(data);
        setOriginalData(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        studentApi.updateStudentById(studentId, studentUserId, {
          id: studentId,
          userId: studentUserId,
          notes: profileData.notes,
          school: profileData.school,
          grade: profileData.grade,
          class: profileData.class,
        }),
        authApi.updateUser(studentUserId, {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        }),
      ]);
      setIsEditing(false);
      setOriginalData((prev) => ({
        ...prev,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        notes: profileData.notes,
        school: profileData.school,
        grade: profileData.grade,
        class: profileData.class,
      }));
      dispatch(
        updateUserInfo({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        }),
      );
      addToast({
        title: t("studentDashboard.profile.profileUpdated"),
        color: "success",
        timeout: 3000,
      });
    } catch (err) {
      console.error("Failed to update profile", err);
      addToast({
        title: t("studentDashboard.profile.profileUpdateFailed"),
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await studentApi.updateStudentAvatar(file);
      const res = await studentApi.getStudentAvatar();
      const newUrl = res?.data?.url || "";
      dispatch(updateUserAvatar(newUrl));
      setProfileData((prev) => ({ ...prev, avatar: newUrl }));
    } catch (err) {
      console.error("Failed to update avatar", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

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

  if (loading) {
    return <ProfileSkeleton />;
  }

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
                  src={profileData.avatar || undefined}
                  name={`${profileData.firstName} ${profileData.lastName}`}
                  className="w-24 h-24"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  isLoading={uploadingAvatar}
                  className="absolute bottom-0 right-0"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                  }}
                  onPress={() => fileInputRef.current?.click()}
                >
                  {!uploadingAvatar && (
                    <Camera weight="fill" className="w-4 h-4" />
                  )}
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
                {profileData.notes && (
                  <p
                    className="text-sm max-w-md"
                    style={{ color: colors.text.secondary }}
                  >
                    {profileData.notes}
                  </p>
                )}
              </div>

              {/* Stats hidden */}
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
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <Button
                      variant="flat"
                      size="sm"
                      onPress={() => {
                        if (originalData) setProfileData(originalData);
                        setIsEditing(false);
                      }}
                    >
                      {t("logoutModal.cancel")}
                    </Button>
                  )}
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
                    isLoading={saving}
                    onPress={() => {
                      if (isEditing) {
                        handleSave();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing
                      ? saving
                        ? t("studentDashboard.profile.saving")
                        : t("studentDashboard.profile.save")
                      : t("studentDashboard.profile.edit")}
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label={t("studentDashboard.profile.firstName")}
                  value={profileData.firstName}
                  isDisabled={!isEditing}
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
                  isDisabled={!isEditing}
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
                  isDisabled
                  startContent={
                    <Envelope
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                />
                <Input
                  label={t("studentDashboard.profile.school")}
                  value={profileData.school}
                  isDisabled={!isEditing}
                  startContent={
                    <GraduationCap
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, school: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.grade")}
                  value={profileData.grade}
                  isDisabled={!isEditing}
                  startContent={
                    <BookBookmark
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, grade: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.class")}
                  value={profileData.class}
                  isDisabled={!isEditing}
                  startContent={
                    <BookOpen
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, class: value })
                  }
                />
                <Input
                  label={t("studentDashboard.profile.notes")}
                  value={profileData.notes}
                  isDisabled={!isEditing}
                  startContent={
                    <Note
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                  }
                  classNames={inputClassNames}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, notes: value })
                  }
                />
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
