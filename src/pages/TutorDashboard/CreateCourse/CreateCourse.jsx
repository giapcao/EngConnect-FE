import { useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
  Select,
  SelectItem,
  Divider,
  Alert,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useTheme } from "../../../contexts/ThemeContext";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash,
  FloppyDisk,
  Image as ImageIcon,
  VideoCamera,
  ListNumbers,
} from "@phosphor-icons/react";
import { coursesApi } from "../../../api";

const LEVELS = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced",
  "All Levels",
];
const CURRENCIES = ["USD", "VND", "EUR"];

const CreateCourse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { theme } = useTheme();

  // Course form state
  const [courseData, setCourseData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    outcomes: "",
    level: "",
    estimatedTime: "",
    estimatedTimeLesson: "",
    price: "",
    currency: "",
    numberOfSessions: "",
    numsSessionInWeek: "",
    thumbnailUrl: "",
    demoVideoUrl: "",
  });

  // Modules state
  const [modules, setModules] = useState([
    { title: "", description: "", outcomes: "", moduleNumber: 1 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Course info, 2: Modules
  const [validationErrors, setValidationErrors] = useState({});

  const { inputClassNames, selectClassNames } = useInputStyles();

  const handleCourseChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleModuleChange = (index, field, value) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        outcomes: "",
        moduleNumber: prev.length + 1,
      },
    ]);
  };

  const removeModule = (index) => {
    if (modules.length <= 1) return;
    const updated = modules.filter((_, i) => i !== index);
    // Re-number modules
    const renumbered = updated.map((m, i) => ({
      ...m,
      moduleNumber: i + 1,
    }));
    setModules(renumbered);
  };

  const validateStep1 = () => {
    const errors = {};
    if (!courseData.title.trim())
      errors.title = t("tutorDashboard.createCourse.validation.titleRequired");
    if (!courseData.shortDescription.trim())
      errors.shortDescription = t(
        "tutorDashboard.createCourse.validation.shortDescRequired",
      );
    if (!courseData.level)
      errors.level = t("tutorDashboard.createCourse.validation.levelRequired");
    if (!courseData.price || Number(courseData.price) < 0)
      errors.price = t("tutorDashboard.createCourse.validation.priceRequired");
    if (!courseData.currency)
      errors.currency = t(
        "tutorDashboard.createCourse.validation.currencyRequired",
      );
    if (
      !courseData.numberOfSessions ||
      Number(courseData.numberOfSessions) <= 0
    )
      errors.numberOfSessions = t(
        "tutorDashboard.createCourse.validation.sessionsRequired",
      );

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    for (const mod of modules) {
      if (!mod.title.trim()) {
        setError(
          t("tutorDashboard.createCourse.validation.modulesTitleRequired"),
        );
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      setError("");
    } else {
      addToast({
        title: t("tutorDashboard.createCourse.validation.incompleteForm"),
        description: t(
          "tutorDashboard.createCourse.validation.incompleteFormDescription",
        ),
        color: "warning",
        timeout: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setError("");

    try {
      // 1. Create the course
      const coursePayload = {
        title: courseData.title,
        shortDescription: courseData.shortDescription,
        fullDescription: courseData.fullDescription,
        outcomes: courseData.outcomes,
        level: courseData.level,
        estimatedTime: Number(courseData.estimatedTime) || 0,
        estimatedTimeLesson: Number(courseData.estimatedTimeLesson) || 0,
        price: Number(courseData.price),
        currency: courseData.currency,
        numberOfSessions: Number(courseData.numberOfSessions),
        numsSessionInWeek: Number(courseData.numsSessionInWeek) || 0,
        thumbnailUrl: courseData.thumbnailUrl,
        demoVideoUrl: courseData.demoVideoUrl,
      };

      const courseResponse = await coursesApi.createCourse(coursePayload);

      if (!courseResponse.isSuccess) {
        setError(
          courseResponse.error?.message ||
            t("tutorDashboard.createCourse.error.createFailed"),
        );
        setLoading(false);
        return;
      }

      const courseId = courseResponse.data?.id;

      // 2. Create modules for the course
      if (courseId && modules.length > 0) {
        for (const mod of modules) {
          if (mod.title.trim()) {
            const modulePayload = {
              courseId: courseId,
              title: mod.title,
              description: mod.description,
              outcomes: mod.outcomes,
              moduleNumber: mod.moduleNumber,
            };

            await coursesApi.createCourseModule(modulePayload);
          }
        }
      }

      // Navigate back to my courses on success
      navigate("/tutor/my-courses");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          t("tutorDashboard.createCourse.error.createFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Button
          variant="light"
          startContent={<ArrowLeft className="w-5 h-5" />}
          onPress={() => navigate("/tutor/my-courses")}
          className="mb-4"
          style={{ color: colors.text.secondary }}
        >
          {t("tutorDashboard.createCourse.backToCourses")}
        </Button>

        <h1
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {t("tutorDashboard.createCourse.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {t("tutorDashboard.createCourse.subtitle")}
        </p>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-4"
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setStep(1)}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor:
                step >= 1 ? colors.primary.main : colors.background.gray,
              color: step >= 1 ? colors.text.white : colors.text.secondary,
            }}
          >
            1
          </div>
          <span
            className="font-medium text-sm"
            style={{
              color: step >= 1 ? colors.primary.main : colors.text.secondary,
            }}
          >
            {t("tutorDashboard.createCourse.stepCourseInfo")}
          </span>
        </div>

        <div
          className="flex-1 h-0.5"
          style={{
            backgroundColor:
              step >= 2 ? colors.primary.main : colors.background.gray,
          }}
        />

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor:
                step >= 2 ? colors.primary.main : colors.background.gray,
              color: step >= 2 ? colors.text.white : colors.text.secondary,
            }}
          >
            2
          </div>
          <span
            className="font-medium text-sm"
            style={{
              color: step >= 2 ? colors.primary.main : colors.text.secondary,
            }}
          >
            {t("tutorDashboard.createCourse.stepModules")}
          </span>
        </div>
      </motion.div>

      {/* Error alert */}
      {error && (
        <Alert color="danger" variant="flat" title={error} className="mb-2" />
      )}

      {/* Step 1: Course Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <Card
            shadow="none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="space-y-5 p-6">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.createCourse.basicInfo")}
              </h2>

              <Input
                label={t("tutorDashboard.createCourse.courseTitle")}
                placeholder={t(
                  "tutorDashboard.createCourse.courseTitlePlaceholder",
                )}
                labelPlacement="outside"
                value={courseData.title}
                onChange={(e) => handleCourseChange("title", e.target.value)}
                isInvalid={!!validationErrors.title}
                errorMessage={validationErrors.title}
                classNames={inputClassNames}
                isRequired
              />

              <Textarea
                label={t("tutorDashboard.createCourse.shortDescription")}
                placeholder={t(
                  "tutorDashboard.createCourse.shortDescPlaceholder",
                )}
                labelPlacement="outside"
                value={courseData.shortDescription}
                onChange={(e) =>
                  handleCourseChange("shortDescription", e.target.value)
                }
                isInvalid={!!validationErrors.shortDescription}
                errorMessage={validationErrors.shortDescription}
                classNames={inputClassNames}
                minRows={2}
                maxRows={4}
                isRequired
              />

              <Textarea
                label={t("tutorDashboard.createCourse.fullDescription")}
                placeholder={t(
                  "tutorDashboard.createCourse.fullDescPlaceholder",
                )}
                labelPlacement="outside"
                value={courseData.fullDescription}
                onChange={(e) =>
                  handleCourseChange("fullDescription", e.target.value)
                }
                classNames={inputClassNames}
                minRows={4}
                maxRows={8}
              />

              <Textarea
                label={t("tutorDashboard.createCourse.outcomes")}
                placeholder={t(
                  "tutorDashboard.createCourse.outcomesPlaceholder",
                )}
                labelPlacement="outside"
                value={courseData.outcomes}
                onChange={(e) => handleCourseChange("outcomes", e.target.value)}
                classNames={inputClassNames}
                minRows={2}
                maxRows={4}
              />
            </CardBody>
          </Card>

          {/* Course Details */}
          <Card
            shadow="none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="space-y-5 p-6">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.createCourse.courseDetails")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="w-full">
                  <Select
                    label={t("tutorDashboard.createCourse.level")}
                    placeholder={t(
                      "tutorDashboard.createCourse.levelPlaceholder",
                    )}
                    labelPlacement="outside"
                    selectedKeys={courseData.level ? [courseData.level] : []}
                    onSelectionChange={(keys) =>
                      handleCourseChange("level", Array.from(keys)[0] || "")
                    }
                    isInvalid={!!validationErrors.level}
                    errorMessage={validationErrors.level}
                    classNames={selectClassNames}
                    isRequired
                  >
                    {LEVELS.map((level) => (
                      <SelectItem key={level}>{level}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="w-full">
                  <Input
                    label={t("tutorDashboard.createCourse.numberOfSessions")}
                    placeholder="0"
                    type="number"
                    labelPlacement="outside"
                    value={courseData.numberOfSessions}
                    onChange={(e) =>
                      handleCourseChange("numberOfSessions", e.target.value)
                    }
                    isInvalid={!!validationErrors.numberOfSessions}
                    errorMessage={validationErrors.numberOfSessions}
                    classNames={inputClassNames}
                    isRequired
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="w-full">
                  <Input
                    label={t("tutorDashboard.createCourse.price")}
                    placeholder="0"
                    type="number"
                    labelPlacement="outside"
                    value={courseData.price}
                    onChange={(e) =>
                      handleCourseChange("price", e.target.value)
                    }
                    isInvalid={!!validationErrors.price}
                    errorMessage={validationErrors.price}
                    classNames={inputClassNames}
                    isRequired
                  />
                </div>

                <div className="w-full">
                  <Select
                    label={t("tutorDashboard.createCourse.currency")}
                    placeholder={t(
                      "tutorDashboard.createCourse.currencyPlaceholder",
                    )}
                    labelPlacement="outside"
                    selectedKeys={
                      courseData.currency ? [courseData.currency] : []
                    }
                    onSelectionChange={(keys) =>
                      handleCourseChange("currency", Array.from(keys)[0] || "")
                    }
                    isInvalid={!!validationErrors.currency}
                    errorMessage={validationErrors.currency}
                    classNames={selectClassNames}
                    isRequired
                  >
                    {CURRENCIES.map((cur) => (
                      <SelectItem key={cur}>{cur}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={t("tutorDashboard.createCourse.sessionsPerWeek")}
                  placeholder="0"
                  type="number"
                  labelPlacement="outside"
                  value={courseData.numsSessionInWeek}
                  onChange={(e) =>
                    handleCourseChange("numsSessionInWeek", e.target.value)
                  }
                  classNames={inputClassNames}
                />

                <Input
                  label={t("tutorDashboard.createCourse.estimatedTime")}
                  placeholder="0"
                  type="number"
                  labelPlacement="outside"
                  value={courseData.estimatedTime}
                  onChange={(e) =>
                    handleCourseChange("estimatedTime", e.target.value)
                  }
                  classNames={inputClassNames}
                  endContent={
                    <span
                      className="text-sm"
                      style={{ color: colors.text.tertiary }}
                    >
                      {t("tutorDashboard.createCourse.hours")}
                    </span>
                  }
                />

                <Input
                  label={t("tutorDashboard.createCourse.estimatedTimeLesson")}
                  placeholder="0"
                  type="number"
                  labelPlacement="outside"
                  value={courseData.estimatedTimeLesson}
                  onChange={(e) =>
                    handleCourseChange("estimatedTimeLesson", e.target.value)
                  }
                  classNames={inputClassNames}
                  endContent={
                    <span
                      className="text-sm"
                      style={{ color: colors.text.tertiary }}
                    >
                      {t("tutorDashboard.createCourse.minutes")}
                    </span>
                  }
                />
              </div>
            </CardBody>
          </Card>

          {/* Media */}
          <Card
            shadow="none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="space-y-5 p-6">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.createCourse.media")}
              </h2>

              <Input
                label={t("tutorDashboard.createCourse.thumbnailUrl")}
                placeholder={t(
                  "tutorDashboard.createCourse.thumbnailPlaceholder",
                )}
                labelPlacement="outside"
                value={courseData.thumbnailUrl}
                onChange={(e) =>
                  handleCourseChange("thumbnailUrl", e.target.value)
                }
                classNames={inputClassNames}
                startContent={
                  <ImageIcon
                    className="w-5 h-5"
                    style={{ color: colors.text.tertiary }}
                  />
                }
              />

              <Input
                label={t("tutorDashboard.createCourse.demoVideoUrl")}
                placeholder={t(
                  "tutorDashboard.createCourse.demoVideoPlaceholder",
                )}
                labelPlacement="outside"
                value={courseData.demoVideoUrl}
                onChange={(e) =>
                  handleCourseChange("demoVideoUrl", e.target.value)
                }
                classNames={inputClassNames}
                startContent={
                  <VideoCamera
                    className="w-5 h-5"
                    style={{ color: colors.text.tertiary }}
                  />
                }
              />
            </CardBody>
          </Card>

          {/* Next button */}
          <div className="flex justify-end">
            <Button
              color="primary"
              size="lg"
              onPress={handleNextStep}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              endContent={<ListNumbers className="w-5 h-5" />}
            >
              {t("tutorDashboard.createCourse.nextAddModules")}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Course Modules */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {modules.map((mod, index) => (
            <Card
              key={index}
              shadow="none"
              style={{ backgroundColor: colors.background.light }}
            >
              <CardBody className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-base font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorDashboard.createCourse.moduleNumber", {
                      number: mod.moduleNumber,
                    })}
                  </h3>
                  {modules.length > 1 && (
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      size="sm"
                      onPress={() => removeModule(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Input
                  label={t("tutorDashboard.createCourse.moduleTitle")}
                  placeholder={t(
                    "tutorDashboard.createCourse.moduleTitlePlaceholder",
                  )}
                  labelPlacement="outside"
                  value={mod.title}
                  onChange={(e) =>
                    handleModuleChange(index, "title", e.target.value)
                  }
                  classNames={inputClassNames}
                  isRequired
                />

                <Textarea
                  label={t("tutorDashboard.createCourse.moduleDescription")}
                  placeholder={t(
                    "tutorDashboard.createCourse.moduleDescPlaceholder",
                  )}
                  labelPlacement="outside"
                  value={mod.description}
                  onChange={(e) =>
                    handleModuleChange(index, "description", e.target.value)
                  }
                  classNames={inputClassNames}
                  minRows={2}
                  maxRows={4}
                />

                <Textarea
                  label={t("tutorDashboard.createCourse.moduleOutcomes")}
                  placeholder={t(
                    "tutorDashboard.createCourse.moduleOutcomesPlaceholder",
                  )}
                  labelPlacement="outside"
                  value={mod.outcomes}
                  onChange={(e) =>
                    handleModuleChange(index, "outcomes", e.target.value)
                  }
                  classNames={inputClassNames}
                  minRows={2}
                  maxRows={3}
                />
              </CardBody>
            </Card>
          ))}

          <Button
            variant="flat"
            startContent={<Plus weight="bold" className="w-5 h-5" />}
            onPress={addModule}
            className="w-full"
            style={{
              backgroundColor: colors.background.primaryLight,
              color: colors.primary.main,
            }}
          >
            {t("tutorDashboard.createCourse.addModule")}
          </Button>

          {/* Action buttons */}
          <Divider />
          <div className="flex justify-between gap-4">
            <Button
              variant="flat"
              size="lg"
              onPress={() => setStep(1)}
              startContent={<ArrowLeft className="w-5 h-5" />}
              style={{ color: colors.text.secondary }}
            >
              {t("tutorDashboard.createCourse.back")}
            </Button>

            <Button
              color="primary"
              size="lg"
              onPress={handleSubmit}
              isLoading={loading}
              isDisabled={loading}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              startContent={
                !loading && <FloppyDisk weight="bold" className="w-5 h-5" />
              }
            >
              {loading
                ? t("tutorDashboard.createCourse.creating")
                : t("tutorDashboard.createCourse.createCourse")}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreateCourse;
