import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Input,
  Textarea,
  Spinner,
  Avatar,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import * as MotionLib from "framer-motion";
// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { tutorApi } from "../../../api/tutorApi";
import logoImage from "../../../assets/images/logo.png";
import {
  CheckCircle,
  FileText,
  VideoCamera,
  Upload,
  SealCheck,
  Camera,
  Eye,
} from "@phosphor-icons/react";

const TutorOnboarding = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const navigate = useNavigate();
  const { inputClassNames, textareaClassNames } = useInputStyles();

  const [tutorProfile, setTutorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    yearsExperience: "",
  });

  const cvInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const data = await tutorApi.getTutorProfile();
      if (data.isSuccess) {
        const p = data.data;
        setTutorProfile(p);
        if (p.verifiedStatus === "Verified" || p.verifiedStatus === "Pending") {
          navigate("/tutor/dashboard", { replace: true });
          return;
        }
        setFormData({
          headline: p.headline || "",
          bio: p.bio || "",
          yearsExperience:
            p.yearsExperience !== null && p.yearsExperience !== undefined
              ? String(p.yearsExperience)
              : "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch tutor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress steps
  const steps = [
    { key: "headline", done: !!formData.headline.trim() },
    { key: "bio", done: !!formData.bio.trim() },
    {
      key: "yearsExperience",
      done:
        formData.yearsExperience !== "" &&
        Number(formData.yearsExperience) >= 0,
    },
    { key: "cv", done: !!tutorProfile?.cvUrl },
    { key: "video", done: !!tutorProfile?.introVideoUrl },
  ];
  const completedSteps = steps.filter((s) => s.done).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  const handleSaveProfile = async () => {
    if (!tutorProfile?.id) return;
    setSaving(true);
    try {
      const data = await tutorApi.updateTutorById(tutorProfile.id, {
        headline: formData.headline.trim(),
        bio: formData.bio.trim(),
        yearsExperience: Number(formData.yearsExperience),
      });
      if (data.isSuccess) {
        await fetchProfile();
        addToast({
          title: t("tutorOnboarding.profileSaved"),
          color: "success",
        });
      }
    } catch (err) {
      console.error(err);
      addToast({ title: t("tutorOnboarding.saveFailed"), color: "danger" });
    } finally {
      setSaving(false);
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvUploading(true);
    try {
      const data = await tutorApi.uploadCv(file, file.name);
      if (data.isSuccess) {
        await fetchProfile();
        addToast({ title: t("tutorOnboarding.cvUploaded"), color: "success" });
      }
    } catch (err) {
      console.error(err);
      addToast({ title: t("tutorOnboarding.cvUploadFailed"), color: "danger" });
    } finally {
      setCvUploading(false);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoUploading(true);
    try {
      const data = await tutorApi.uploadIntroVideo(file, file.name);
      if (data.isSuccess) {
        await fetchProfile();
        addToast({
          title: t("tutorOnboarding.videoUploaded"),
          color: "success",
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        title: t("tutorOnboarding.videoUploadFailed"),
        color: "danger",
      });
    } finally {
      setVideoUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const data = await tutorApi.uploadAvatar(file, file.name);
      if (data.isSuccess) {
        await fetchProfile();
        addToast({
          title: t("tutorOnboarding.avatarUploaded"),
          color: "success",
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        title: t("tutorOnboarding.avatarUploadFailed"),
        color: "danger",
      });
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleSubmitVerification = async () => {
    setSubmitting(true);
    try {
      const data = await tutorApi.submitVerificationRequest();
      if (data.isSuccess) {
        addToast({
          title: t("tutorOnboarding.submitSuccess"),
          color: "success",
        });
        navigate("/tutor/dashboard");
      }
    } catch (err) {
      console.error(err);
      addToast({ title: t("tutorOnboarding.submitFailed"), color: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background.page }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: colors.background.card,
  };

  const stepNumber = (index, done) => (
    <div
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
      style={{
        backgroundColor: done ? colors.primary.main : colors.background.gray,
        color: done ? colors.text.white : colors.text.tertiary,
      }}
    >
      {done ? (
        <CheckCircle weight="fill" className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <span className="text-xs sm:text-sm font-semibold">{index + 1}</span>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.gray }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-sm px-4 sm:px-6 py-2 flex items-center"
        style={{
          backgroundColor: `${colors.background.card}ee`,
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImage} alt="EngConnect" className="h-9 w-auto" />
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6 sm:mb-10"
        >
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
            style={{ backgroundColor: colors.background.primaryLight }}
          >
            <SealCheck
              weight="duotone"
              className="w-7 h-7 sm:w-8 sm:h-8"
              style={{ color: colors.primary.main }}
            />
          </div>
          <h1
            className="text-xl sm:text-2xl font-bold mb-1.5"
            style={{ color: colors.text.primary }}
          >
            {t("tutorOnboarding.title")}
          </h1>
          <p
            className="text-sm sm:text-base max-w-md mx-auto"
            style={{ color: colors.text.secondary }}
          >
            {t("tutorOnboarding.subtitle")}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl"
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-medium"
              style={{ color: colors.text.primary }}
            >
              {t("tutorOnboarding.progress")}
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: colors.primary.main }}
            >
              {completedSteps}/{steps.length}
            </span>
          </div>
          <div
            className="h-2 sm:h-2.5 rounded-full overflow-hidden mb-4"
            style={{ backgroundColor: colors.background.gray }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colors.primary.main }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            {steps.map((step, i) => (
              <div
                key={step.key}
                className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
              >
                {stepNumber(i, step.done)}
                <span
                  className="text-[10px] sm:text-xs text-center leading-tight font-medium"
                  style={{
                    color: step.done
                      ? colors.text.primary
                      : colors.text.tertiary,
                  }}
                >
                  {t(`tutorOnboarding.steps.${step.key}`)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main content — 2-column on lg, single on mobile */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 mb-6 sm:mb-8">
          {/* Left column — Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1 p-5 sm:p-6 rounded-2xl"
            style={cardStyle}
          >
            <h2
              className="text-base sm:text-lg font-semibold mb-4 sm:mb-5"
              style={{ color: colors.text.primary }}
            >
              {t("tutorOnboarding.profileSection")}
            </h2>

            {/* Avatar */}
            {tutorProfile && (
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="relative cursor-pointer shrink-0"
                  role="button"
                  tabIndex={0}
                  onClick={() => avatarInputRef.current?.click()}
                  onKeyDown={(e) =>
                    e.key === "Enter" && avatarInputRef.current?.click()
                  }
                >
                  {avatarUploading ? (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.background.gray }}
                    >
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <>
                      <Avatar src={tutorProfile.avatar} className="w-16 h-16" />
                      <div
                        className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                      >
                        <Camera weight="fill" className="w-5 h-5 text-white" />
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: colors.text.primary }}
                  >
                    {tutorProfile.user?.firstName} {tutorProfile.user?.lastName}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: colors.text.tertiary }}
                  >
                    {t("tutorOnboarding.avatarHint")}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorRegistration.headline")}
                </label>
                <Input
                  variant="flat"
                  size="lg"
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, headline: e.target.value }))
                  }
                  placeholder={t("tutorRegistration.headlinePlaceholder")}
                  classNames={inputClassNames}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorRegistration.bio")}
                </label>
                <Textarea
                  variant="flat"
                  size="lg"
                  minRows={3}
                  maxRows={6}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, bio: e.target.value }))
                  }
                  placeholder={t("tutorRegistration.bioPlaceholder")}
                  classNames={textareaClassNames}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorRegistration.yearsExperience")}
                </label>
                <Input
                  type="number"
                  variant="flat"
                  size="lg"
                  min={0}
                  value={formData.yearsExperience}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      yearsExperience: e.target.value,
                    }))
                  }
                  placeholder={t(
                    "tutorRegistration.yearsExperiencePlaceholder",
                  )}
                  classNames={inputClassNames}
                />
              </div>
              <Button
                className="w-full font-medium"
                size="lg"
                isLoading={saving}
                onPress={handleSaveProfile}
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.white,
                }}
              >
                {t("tutorOnboarding.saveProfile")}
              </Button>
            </div>
          </motion.div>

          {/* Right column — Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="lg:w-[380px] xl:w-[420px] flex flex-col gap-5 sm:gap-6"
          >
            {/* CV Upload */}
            <div className="p-5 sm:p-6 rounded-2xl" style={cardStyle}>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: colors.background.primaryLight }}
                >
                  <FileText
                    weight="duotone"
                    className="w-4.5 h-4.5"
                    style={{ color: colors.primary.main }}
                  />
                </div>
                <h2
                  className="text-base sm:text-lg font-semibold flex-1"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorOnboarding.cvSection")}
                </h2>
                {tutorProfile?.cvUrl && (
                  <CheckCircle
                    weight="fill"
                    className="w-5 h-5 shrink-0"
                    style={{ color: colors.state.success }}
                  />
                )}
              </div>
              {tutorProfile?.cvUrl ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${colors.primary.main}12` }}
                >
                  <FileText
                    weight="duotone"
                    className="w-5 h-5 shrink-0"
                    style={{ color: colors.primary.main }}
                  />
                  <span
                    className="text-sm flex-1 truncate"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorOnboarding.cvUploaded")}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="light"
                      as="a"
                      href={tutorProfile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colors.primary.main }}
                    >
                      <Eye weight="bold" className="w-4 h-4" />
                      {t("tutorOnboarding.view")}
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      isLoading={cvUploading}
                      onPress={() => cvInputRef.current?.click()}
                      style={{ color: colors.primary.main }}
                    >
                      {t("tutorOnboarding.replace")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ borderColor: colors.border.medium }}
                  role="button"
                  tabIndex={0}
                  onClick={() => cvInputRef.current?.click()}
                  onKeyDown={(e) =>
                    e.key === "Enter" && cvInputRef.current?.click()
                  }
                >
                  {cvUploading ? (
                    <Spinner size="md" />
                  ) : (
                    <>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <Upload
                          weight="duotone"
                          className="w-5 h-5"
                          style={{ color: colors.text.tertiary }}
                        />
                      </div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: colors.text.primary }}
                      >
                        {t("tutorOnboarding.cvUploadPrompt")}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        PDF, DOC, DOCX
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleCvUpload}
              />
            </div>

            {/* Video Upload */}
            <div className="p-5 sm:p-6 rounded-2xl" style={cardStyle}>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: colors.background.primaryLight }}
                >
                  <VideoCamera
                    weight="duotone"
                    className="w-4.5 h-4.5"
                    style={{ color: colors.primary.main }}
                  />
                </div>
                <h2
                  className="text-base sm:text-lg font-semibold flex-1"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorOnboarding.videoSection")}
                </h2>
                {tutorProfile?.introVideoUrl && (
                  <CheckCircle
                    weight="fill"
                    className="w-5 h-5 shrink-0"
                    style={{ color: colors.state.success }}
                  />
                )}
              </div>
              {tutorProfile?.introVideoUrl ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${colors.primary.main}12` }}
                >
                  <VideoCamera
                    weight="duotone"
                    className="w-5 h-5 shrink-0"
                    style={{ color: colors.primary.main }}
                  />
                  <span
                    className="text-sm flex-1 truncate"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorOnboarding.videoUploaded")}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="light"
                      as="a"
                      href={tutorProfile.introVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colors.primary.main }}
                    >
                      <Eye weight="bold" className="w-4 h-4" />
                      {t("tutorOnboarding.view")}
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      isLoading={videoUploading}
                      onPress={() => videoInputRef.current?.click()}
                      style={{ color: colors.primary.main }}
                    >
                      {t("tutorOnboarding.replace")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ borderColor: colors.border.medium }}
                  role="button"
                  tabIndex={0}
                  onClick={() => videoInputRef.current?.click()}
                  onKeyDown={(e) =>
                    e.key === "Enter" && videoInputRef.current?.click()
                  }
                >
                  {videoUploading ? (
                    <Spinner size="md" />
                  ) : (
                    <>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: colors.background.gray }}
                      >
                        <Upload
                          weight="duotone"
                          className="w-5 h-5"
                          style={{ color: colors.text.tertiary }}
                        />
                      </div>
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: colors.text.primary }}
                      >
                        {t("tutorOnboarding.videoUploadPrompt")}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.text.tertiary }}
                      >
                        MP4, WebM, MOV
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/mov"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </div>
          </motion.div>
        </div>

        {/* Submit for Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 sm:p-6 rounded-2xl"
          style={cardStyle}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-base mb-0.5"
                style={{ color: colors.text.primary }}
              >
                {t("tutorOnboarding.submitVerification")}
              </h3>
              {completedSteps < steps.length && (
                <p className="text-sm" style={{ color: colors.text.tertiary }}>
                  {t("tutorOnboarding.submitHint", {
                    count: steps.length - completedSteps,
                  })}
                </p>
              )}
            </div>
            <Button
              size="lg"
              className="font-semibold text-sm sm:text-base sm:px-8 w-full sm:w-auto shrink-0"
              isLoading={submitting}
              onPress={handleSubmitVerification}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
            >
              <SealCheck weight="fill" className="w-5 h-5 mr-1.5" />
              {t("tutorOnboarding.submitVerification")}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TutorOnboarding;
