import React, { useState } from "react";
import { Input, Button, Textarea, Image, Alert, addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as MotionLib from "framer-motion";
import { useTranslation } from "react-i18next";
import { Briefcase, Video, FileText, Clock, Sparkles } from "lucide-react";
import BrandLogo from "../../components/Authentication/BrandLogo";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import useInputStyles from "../../hooks/useInputStyles";
import {
  registerTutor,
  selectUser,
  selectIsAuthenticated,
} from "../../store/slices/authSlice";
import illustrationImage from "../../assets/illustrations/contract.avif";
import "./TutorRegistration.css";

// eslint-disable-next-line no-unused-vars
const { motion } = MotionLib;

const TutorRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { theme } = useTheme();
  const { inputClassNames, textareaClassNames } = useInputStyles();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { loading, error } = useSelector((state) => state.auth);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    introVideoUrl: "",
    yearsExperience: "",
    cvUrl: "",
    slotsCount: "",
  });

  // Redirect to register if not authenticated
  if (!isAuthenticated) {
    navigate("/register");
    return null;
  }

  const validateForm = () => {
    const errors = {};

    if (!formData.headline.trim()) {
      errors.headline = t("tutorRegistration.validation.headlineRequired");
    } else if (formData.headline.length < 10) {
      errors.headline = t("tutorRegistration.validation.headlineMinLength");
    }

    if (!formData.bio.trim()) {
      errors.bio = t("tutorRegistration.validation.bioRequired");
    } else if (formData.bio.length < 50) {
      errors.bio = t("tutorRegistration.validation.bioMinLength");
    }

    if (
      formData.introVideoUrl.trim() &&
      !/^https?:\/\/.+/i.test(formData.introVideoUrl)
    ) {
      errors.introVideoUrl = t(
        "tutorRegistration.validation.introVideoUrlInvalid",
      );
    }

    if (!formData.yearsExperience) {
      errors.yearsExperience = t(
        "tutorRegistration.validation.yearsExperienceRequired",
      );
    } else if (
      Number.isNaN(Number(formData.yearsExperience)) ||
      Number(formData.yearsExperience) < 0
    ) {
      errors.yearsExperience = t(
        "tutorRegistration.validation.yearsExperienceInvalid",
      );
    }

    if (formData.cvUrl.trim() && !/^https?:\/\/.+/i.test(formData.cvUrl)) {
      errors.cvUrl = t("tutorRegistration.validation.cvUrlInvalid");
    }

    if (!formData.slotsCount) {
      errors.slotsCount = t("tutorRegistration.validation.slotsCountRequired");
    } else if (
      Number.isNaN(Number(formData.slotsCount)) ||
      Number(formData.slotsCount) < 1
    ) {
      errors.slotsCount = t("tutorRegistration.validation.slotsCountInvalid");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        title: t("tutorRegistration.validation.validationError"),
        description: t(
          "tutorRegistration.validation.validationErrorDescription",
        ),
        color: "warning",
        timeout: 3000,
      });
      return;
    }

    const tutorData = {
      userId: user?.userId,
      headline: formData.headline.trim(),
      bio: formData.bio.trim(),
      introVideoUrl: formData.introVideoUrl.trim() || "",
      yearsExperience: Number(formData.yearsExperience),
      cvUrl: formData.cvUrl.trim() || "",
      slotsCount: Number(formData.slotsCount),
    };

    try {
      await dispatch(registerTutor(tutorData)).unwrap();

      addToast({
        title: t("tutorRegistration.success.title"),
        description: t("tutorRegistration.success.description"),
        color: "success",
        timeout: 5000,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Tutor registration error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div
      className="tutor-register-container"
      style={{ backgroundColor: colors.background.light }}
    >
      <div className="tutor-register-content">
        <motion.div
          className="tutor-register-illustration"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundColor:
              theme === "dark" ? colors.background.gray : "#F0F9FF",
          }}
        >
          <Image src={illustrationImage} alt="Tutor registration" />
        </motion.div>

        <motion.div
          className="tutor-register-form-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="tutor-register-header">
            <BrandLogo />

            <div className="text-center mb-2">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors.background.primaryLight,
                  color: colors.primary.main,
                }}
              >
                <Sparkles className="w-4 h-4" />
                {t("tutorRegistration.badge")}
              </span>
            </div>

            <p
              className="text-center mb-6"
              style={{ color: colors.text.secondary }}
            >
              {t("tutorRegistration.subtitle")}
            </p>
          </div>

          <div
            className="tutor-register-card"
            style={{ backgroundColor: colors.background.light }}
          >
            {error && (
              <Alert
                color="danger"
                title={t("tutorRegistration.error.title")}
                description={error}
                className="mb-4"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Headline */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorRegistration.headline")}
                </label>
                <Input
                  type="text"
                  name="headline"
                  placeholder={t("tutorRegistration.headlinePlaceholder")}
                  value={formData.headline}
                  onChange={handleChange}
                  variant="flat"
                  size="lg"
                  isInvalid={!!validationErrors.headline}
                  errorMessage={validationErrors.headline}
                  classNames={inputClassNames}
                  startContent={
                    <Briefcase
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: colors.text.tertiary }}
                    />
                  }
                />
              </div>

              {/* Bio */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorRegistration.bio")}
                </label>
                <Textarea
                  name="bio"
                  placeholder={t("tutorRegistration.bioPlaceholder")}
                  value={formData.bio}
                  onChange={handleChange}
                  variant="flat"
                  size="lg"
                  minRows={4}
                  maxRows={6}
                  isInvalid={!!validationErrors.bio}
                  errorMessage={validationErrors.bio}
                  classNames={textareaClassNames}
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: colors.text.tertiary }}
                >
                  {formData.bio.length}/500 {t("tutorRegistration.characters")}
                </p>
              </div>

              {/* Experience & Slots */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorRegistration.yearsExperience")}
                  </label>
                  <Input
                    type="number"
                    name="yearsExperience"
                    placeholder={t(
                      "tutorRegistration.yearsExperiencePlaceholder",
                    )}
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    variant="flat"
                    size="lg"
                    min={0}
                    isInvalid={!!validationErrors.yearsExperience}
                    errorMessage={validationErrors.yearsExperience}
                    classNames={inputClassNames}
                    startContent={
                      <Briefcase
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: colors.text.tertiary }}
                      />
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorRegistration.slotsCount")}
                  </label>
                  <Input
                    type="number"
                    name="slotsCount"
                    placeholder={t("tutorRegistration.slotsCountPlaceholder")}
                    value={formData.slotsCount}
                    onChange={handleChange}
                    variant="flat"
                    size="lg"
                    min={1}
                    isInvalid={!!validationErrors.slotsCount}
                    errorMessage={validationErrors.slotsCount}
                    classNames={inputClassNames}
                    startContent={
                      <Clock
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: colors.text.tertiary }}
                      />
                    }
                  />
                </div>
              </div>

              {/* Intro Video URL */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorRegistration.introVideoUrl")}
                  <span
                    className="ml-1 text-xs font-normal"
                    style={{ color: colors.text.tertiary }}
                  >
                    ({t("tutorRegistration.optional")})
                  </span>
                </label>
                <Input
                  type="url"
                  name="introVideoUrl"
                  placeholder={t("tutorRegistration.introVideoUrlPlaceholder")}
                  value={formData.introVideoUrl}
                  onChange={handleChange}
                  variant="flat"
                  size="lg"
                  isInvalid={!!validationErrors.introVideoUrl}
                  errorMessage={validationErrors.introVideoUrl}
                  classNames={inputClassNames}
                  startContent={
                    <Video
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: colors.text.tertiary }}
                    />
                  }
                />
              </div>

              {/* CV URL */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorRegistration.cvUrl")}
                  <span
                    className="ml-1 text-xs font-normal"
                    style={{ color: colors.text.tertiary }}
                  >
                    ({t("tutorRegistration.optional")})
                  </span>
                </label>
                <Input
                  type="url"
                  name="cvUrl"
                  placeholder={t("tutorRegistration.cvUrlPlaceholder")}
                  value={formData.cvUrl}
                  onChange={handleChange}
                  variant="flat"
                  size="lg"
                  isInvalid={!!validationErrors.cvUrl}
                  errorMessage={validationErrors.cvUrl}
                  classNames={inputClassNames}
                  startContent={
                    <FileText
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: colors.text.tertiary }}
                    />
                  }
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full font-medium"
                isLoading={loading}
                style={{
                  backgroundColor: colors.primary.main,
                  color: colors.text.white,
                }}
              >
                {loading
                  ? t("tutorRegistration.submitting")
                  : t("tutorRegistration.submitButton")}
              </Button>
            </form>
          </div>

          <div
            className="text-center text-lg"
            style={{ width: "100%", maxWidth: "600px" }}
          >
            <span style={{ color: colors.text.secondary }}>
              {t("tutorRegistration.learnMore")}{" "}
            </span>
            <Button
              variant="light"
              className="text-lg font-semibold p-0"
              style={{ color: colors.primary.main }}
              onPress={() => navigate("/become-tutor")}
            >
              {t("tutorRegistration.learnMoreLink")}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TutorRegistration;
