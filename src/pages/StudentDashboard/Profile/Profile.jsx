import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Input,
  Divider,
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
  Lock,
  CheckCircle,
  GraduationCapIcon,
  BookBookmarkIcon,
  BookOpenIcon,
  NoteIcon,
  ArrowRight,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../../api";
import { authApi } from "../../../api/authApi";
import ProfileSkeleton from "../../../components/ProfileSkeleton/ProfileSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAvatar, updateUserInfo, selectUser } from "../../../store";

const Profile = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { inputClassNames } = useInputStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isTutor = !!user?.tutorId;
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

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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

  const handleChangePassword = async () => {
    setPasswordError("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t("studentDashboard.profile.passwordMismatch"));
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      addToast({
        title: t("studentDashboard.profile.passwordChanged"),
        color: "success",
        timeout: 3000,
      });
    } catch (err) {
      const errorCode = err?.response?.data?.error?.code;
      if (errorCode === "User.InvalidPassword") {
        setPasswordError(t("studentDashboard.profile.invalidPassword"));
      } else {
        setPasswordError(t("studentDashboard.profile.passwordChangeFailed"));
      }
    } finally {
      setChangingPassword(false);
    }
  };

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

              {/* Become Tutor */}
              {!isTutor && (
                <div className="flex-shrink-0 self-center">
                  <Button
                    style={{
                      backgroundColor: colors.primary.main,
                      color: colors.text.white,
                    }}
                    onPress={() => navigate("/become-tutor")}
                    endContent={<ArrowRight className="w-4 h-4" />}
                  >
                    {t("nav.becomeTutor")}
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Combined Content Card */}
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
            {/* ── Personal Information ── */}
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
                  <GraduationCapIcon
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
                  <BookBookmarkIcon
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
                  <BookOpenIcon
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
                  <NoteIcon
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

            <Divider className="my-8" />

            {/* ── Change Password ── */}
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
                value={passwordData.oldPassword}
                startContent={
                  <Lock
                    weight="duotone"
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                }
                classNames={inputClassNames}
                onValueChange={(value) => {
                  setPasswordError("");
                  setPasswordData((prev) => ({ ...prev, oldPassword: value }));
                }}
              />
              <Input
                type="password"
                label={t("studentDashboard.profile.newPassword")}
                value={passwordData.newPassword}
                startContent={
                  <Lock
                    weight="duotone"
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                }
                classNames={inputClassNames}
                onValueChange={(value) => {
                  setPasswordError("");
                  setPasswordData((prev) => ({ ...prev, newPassword: value }));
                }}
              />
              <Input
                type="password"
                label={t("studentDashboard.profile.confirmPassword")}
                value={passwordData.confirmPassword}
                isInvalid={
                  !!passwordError &&
                  passwordError ===
                    t("studentDashboard.profile.passwordMismatch")
                }
                errorMessage={
                  passwordError ===
                  t("studentDashboard.profile.passwordMismatch")
                    ? passwordError
                    : ""
                }
                startContent={
                  <Lock
                    weight="duotone"
                    className="w-5 h-5"
                    style={{ color: colors.text.secondary }}
                  />
                }
                classNames={inputClassNames}
                onValueChange={(value) => {
                  setPasswordError("");
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: value,
                  }));
                }}
              />
              {passwordError &&
                passwordError !==
                  t("studentDashboard.profile.passwordMismatch") && (
                  <p className="text-sm" style={{ color: colors.state.error }}>
                    {passwordError}
                  </p>
                )}
              <Button
                isLoading={changingPassword}
                isDisabled={
                  !passwordData.oldPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.white,
                }}
                onPress={handleChangePassword}
              >
                {changingPassword
                  ? t("studentDashboard.profile.changingPassword")
                  : t("studentDashboard.profile.updatePassword")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
