import { useState, useEffect } from "react";
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
  Chip,
  Checkbox,
  Spinner,
  addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useThemeColors } from "../../../hooks/useThemeColors";
import useInputStyles from "../../../hooks/useInputStyles";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash,
  Image as ImageIcon,
  VideoCamera,
  CheckCircle,
  MagnifyingGlass,
  ArrowRight,
  PaperPlaneTilt,
  File as FileIcon,
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

const CreateCourse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courseId: continueId } = useParams();
  const colors = useThemeColors();
  const { inputClassNames, selectClassNames } = useInputStyles();

  // Step state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!continueId);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Created IDs returned from API after each step
  const [createdCourseId, setCreatedCourseId] = useState(null);
  const [createdModules, setCreatedModules] = useState([]);
  const [createdSessions, setCreatedSessions] = useState({});
  const [createdResources, setCreatedResources] = useState({});

  // Step 1: Course info
  const [courseData, setCourseData] = useState({
    Title: "",
    ShortDescription: "",
    FullDescription: "",
    Outcomes: "",
    Level: "",
    EstimatedTimeLesson: "",
    Price: "",
    Currency: "VND",
    NumsSessionInWeek: "",
    IsCertificate: false,
    CategoryIds: [],
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [demoVideoFile, setDemoVideoFile] = useState(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null);
  const [existingDemoVideoUrl, setExistingDemoVideoUrl] = useState(null);
  const [categories, setCategories] = useState([]);

  // Step 2: Modules
  const [modules, setModules] = useState([
    { title: "", description: "", outcomes: "", moduleNumber: 1 },
  ]);
  const [existingModules, setExistingModules] = useState([]);
  const [selectedExistingModules, setSelectedExistingModules] = useState([]);
  const [moduleSearch, setModuleSearch] = useState("");
  const [loadingExistingModules, setLoadingExistingModules] = useState(false);

  // Step 3: Sessions (per module)
  const [sessions, setSessions] = useState({});
  const [existingSessions, setExistingSessions] = useState([]);
  const [selectedExistingSessions, setSelectedExistingSessions] = useState({});
  const [sessionSearch, setSessionSearch] = useState("");
  const [loadingExistingSessions, setLoadingExistingSessions] = useState(false);
  const [activeModuleForSessions, setActiveModuleForSessions] = useState(null);

  // Step 4: Resources (per session)
  const [resources, setResources] = useState({});
  const [activeSessionForResources, setActiveSessionForResources] =
    useState(null);

  // Edit mode tracking
  const [deletedModuleIds, setDeletedModuleIds] = useState([]);
  const [deletedSessionIds, setDeletedSessionIds] = useState([]);
  const [deletedResourceIds, setDeletedResourceIds] = useState([]);
  const [thumbnailChanged, setThumbnailChanged] = useState(false);
  const [demoVideoChanged, setDemoVideoChanged] = useState(false);

  // Load categories on mount
  useEffect(() => {
    coursesApi
      .getCategories({ "page-size": 50 })
      .then((res) => setCategories(res?.data?.items || []))
      .catch(() => {});
  }, []);

  // Continue creating: load existing course data
  useEffect(() => {
    if (!continueId) return;
    const loadCourse = async () => {
      try {
        setInitialLoading(true);
        const res = await coursesApi.getCourseById(continueId);
        const c = res.data;
        if (!c) return;

        // Populate course info
        setCreatedCourseId(c.id);
        setCourseData({
          Title: c.title || "",
          ShortDescription: c.shortDescription || "",
          FullDescription: c.fullDescription || "",
          Outcomes: c.outcomes || "",
          Level: c.level || "",
          EstimatedTimeLesson: c.estimatedTimeLesson
            ? String(
                typeof c.estimatedTimeLesson === "string" &&
                  c.estimatedTimeLesson.includes(":")
                  ? (() => {
                      const parts = c.estimatedTimeLesson.split(":");
                      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                    })()
                  : parseInt(c.estimatedTimeLesson) || 0,
              )
            : "",
          Price: c.price
            ? c.price.toLocaleString("vi-VN").replace(/,/g, ".")
            : "",
          Currency: c.currency || "VND",
          NumsSessionInWeek: c.numsSessionInWeek
            ? String(c.numsSessionInWeek)
            : "",
          IsCertificate: c.isCertificate || false,
          CategoryIds: (c.courseCategories || []).map(
            (cat) => cat.categoryId || cat.id,
          ),
        });

        // Load existing media URLs
        if (c.thumbnailUrl) setExistingThumbnailUrl(c.thumbnailUrl);
        if (c.demoVideoUrl) setExistingDemoVideoUrl(c.demoVideoUrl);

        // Load modules
        const mods = (c.courseCourseModules || []).sort(
          (a, b) => a.moduleNumber - b.moduleNumber,
        );

        if (mods.length === 0) {
          // No modules → start at step 2
          setStep(2);
          loadExistingModules(c.id);
        } else {
          setCreatedModules(
            mods.map((m) => ({
              id: m.courseModuleId,
              title: m.moduleTitle || "",
              description: m.moduleDescription || "",
              outcomes: m.moduleOutcomes || "",
              moduleNumber: m.moduleNumber,
            })),
          );

          // Check sessions
          const allSessions = {};
          let hasSessions = false;
          mods.forEach((m) => {
            const sess = (m.courseModuleCourseSessions || []).sort(
              (a, b) => a.sessionNumber - b.sessionNumber,
            );
            allSessions[m.courseModuleId] = sess.map((s) => ({
              id: s.courseSessionId,
              title: s.sessionTitle || "",
              description: s.sessionDescription || "",
              outcomes: s.sessionOutcomes || "",
              sessionNumber: s.sessionNumber,
            }));
            if (sess.length > 0) hasSessions = true;
          });

          if (!hasSessions) {
            // Modules exist but no sessions → start at step 3
            setCreatedSessions({});
            setSessions(
              Object.fromEntries(
                mods.map((m) => [
                  m.courseModuleId,
                  [
                    {
                      title: "",
                      description: "",
                      outcomes: "",
                      sessionNumber: 1,
                    },
                  ],
                ]),
              ),
            );
            setActiveModuleForSessions(mods[0].courseModuleId);
            setStep(3);
            loadExistingSessions(mods[0].courseModuleId);
          } else {
            // Has sessions → load them and start at step 4 (resources)
            setCreatedSessions(allSessions);
            const resMap = {};
            Object.values(allSessions)
              .flat()
              .forEach((s) => {
                resMap[s.id] = [];
              });
            setResources(resMap);
            const firstSession = Object.values(allSessions).flat()[0];
            if (firstSession) {
              setActiveSessionForResources(firstSession.id);
              loadExistingResources(firstSession.id);
            }
            setStep(4);
          }
        }
      } catch (err) {
        console.error("Failed to load course for continue:", err);
        setError(t("tutorDashboard.createCourse.error.loadFailed"));
      } finally {
        setInitialLoading(false);
      }
    };
    loadCourse();
  }, [continueId]);

  // Handlers
  const handleCourseChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field])
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
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
    const mod = modules[index];
    if (mod.id) {
      setDeletedModuleIds((prev) => [...prev, mod.id]);
    }
    setModules((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, moduleNumber: i + 1 })),
    );
  };

  const getSessionsForModule = (moduleId) => sessions[moduleId] || [];

  const handleSessionChange = (moduleId, index, field, value) => {
    setSessions((prev) => {
      const arr = [...(prev[moduleId] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [moduleId]: arr };
    });
  };

  const addSession = (moduleId) => {
    setSessions((prev) => {
      const arr = prev[moduleId] || [];
      return {
        ...prev,
        [moduleId]: [
          ...arr,
          {
            title: "",
            description: "",
            outcomes: "",
            sessionNumber: arr.length + 1,
          },
        ],
      };
    });
  };

  const removeSession = (moduleId, index) => {
    const sessArr = sessions[moduleId] || [];
    const sess = sessArr[index];
    if (sess?.id) {
      setDeletedSessionIds((prev) => [...prev, sess.id]);
    }
    setSessions((prev) => {
      const arr = (prev[moduleId] || []).filter((_, i) => i !== index);
      return {
        ...prev,
        [moduleId]: arr.map((s, i) => ({ ...s, sessionNumber: i + 1 })),
      };
    });
  };

  const getResourcesForSession = (sessionId) => resources[sessionId] || [];

  const handleResourceChange = (sessionId, index, field, value) => {
    setResources((prev) => {
      const arr = [...(prev[sessionId] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [sessionId]: arr };
    });
  };

  const addResource = (sessionId) => {
    setResources((prev) => {
      const arr = prev[sessionId] || [];
      return {
        ...prev,
        [sessionId]: [...arr, { title: "", resourceType: "", file: null }],
      };
    });
  };

  const removeResource = (sessionId, index) => {
    const resArr = resources[sessionId] || [];
    const res = resArr[index];
    if (res?.id) {
      setDeletedResourceIds((prev) => [...prev, res.id]);
    }
    setResources((prev) => {
      const arr = (prev[sessionId] || []).filter((_, i) => i !== index);
      return { ...prev, [sessionId]: arr };
    });
  };

  // Load existing items
  const loadExistingModules = async (courseId) => {
    setLoadingExistingModules(true);
    try {
      const res = await coursesApi.getCourseModulesByTutor({
        ...(courseId ? { CourseId: courseId } : {}),
        "page-size": 50,
      });
      setExistingModules(res?.data?.items || []);
    } catch {
      /* ignore */
    } finally {
      setLoadingExistingModules(false);
    }
  };

  const loadExistingSessions = async (moduleId) => {
    if (!moduleId) return;
    setLoadingExistingSessions(true);
    try {
      const res = await coursesApi.getCourseSessionsByTutor({
        CourseModuleId: moduleId,
        "page-size": 50,
      });
      setExistingSessions(res?.data?.items || []);
    } catch {
      /* ignore */
    } finally {
      setLoadingExistingSessions(false);
    }
  };

  const loadExistingResources = async (sessionId) => {
    if (!sessionId) return;
    try {
      const res = await coursesApi.getCourseResourcesByTutor({
        CourseSessionId: sessionId,
        "page-size": 50,
      });
      return res?.data?.items || [];
    } catch {
      return [];
    }
  };

  // Navigate back and populate form from created data
  const goBackToStep = (targetStep) => {
    if (targetStep === 2 && createdModules.length > 0) {
      setModules(
        createdModules.map((m) => ({
          id: m.id,
          title: m.title || "",
          description: m.description || "",
          outcomes: m.outcomes || "",
          moduleNumber: m.moduleNumber,
        })),
      );
      setSelectedExistingModules([]);
      setDeletedModuleIds([]);
      loadExistingModules(createdCourseId);
    }
    if (targetStep === 3 && Object.keys(createdSessions).length > 0) {
      const sessionMap = {};
      Object.entries(createdSessions).forEach(([modId, sessArr]) => {
        sessionMap[modId] = sessArr.map((s) => ({
          id: s.id,
          title: s.title || "",
          description: s.description || "",
          outcomes: s.outcomes || "",
          sessionNumber: s.sessionNumber,
        }));
      });
      setSessions(sessionMap);
      setSelectedExistingSessions({});
      setDeletedSessionIds([]);
      if (createdModules.length > 0) {
        setActiveModuleForSessions(createdModules[0].id);
        loadExistingSessions(createdModules[0].id);
      }
    }
    if (targetStep === 4 && Object.keys(createdResources).length > 0) {
      const resMap = {};
      Object.entries(createdResources).forEach(([sessId, resArr]) => {
        resMap[sessId] = resArr.map((r) => ({
          id: r.id,
          title: r.title || "",
          resourceType: r.resourceType || "",
          file: null,
        }));
      });
      setResources(resMap);
      setDeletedResourceIds([]);
      const firstSession = Object.values(createdSessions).flat()[0];
      if (firstSession) {
        setActiveSessionForResources(firstSession.id);
        loadExistingResources(firstSession.id);
      }
    }
    setStep(targetStep);
  };

  // Validation
  const validateStep1 = () => {
    const errors = {};
    if (!courseData.Title.trim())
      errors.Title = t("tutorDashboard.createCourse.validation.titleRequired");
    if (!courseData.ShortDescription.trim())
      errors.ShortDescription = t(
        "tutorDashboard.createCourse.validation.shortDescRequired",
      );
    if (!courseData.Level)
      errors.Level = t("tutorDashboard.createCourse.validation.levelRequired");
    if (!courseData.Price || Number(courseData.Price.replace(/\./g, "")) < 0)
      errors.Price = t("tutorDashboard.createCourse.validation.priceRequired");
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

  // Step 1: Create or update course
  const handleCreateCourse = async () => {
    if (!validateStep1()) {
      addToast({
        title: t("tutorDashboard.createCourse.validation.incompleteForm"),
        description: t(
          "tutorDashboard.createCourse.validation.incompleteFormDescription",
        ),
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const isEditing = !!createdCourseId;

      if (isEditing) {
        // UPDATE mode
        const payload = {
          title: courseData.Title,
          shortDescription: courseData.ShortDescription,
          fullDescription: courseData.FullDescription,
          outcomes: courseData.Outcomes,
          level: courseData.Level,
          estimatedTimeLesson: Number(courseData.EstimatedTimeLesson) || 0,
          price: Number(courseData.Price.replace(/\./g, "")),
          currency: courseData.Currency,
          numsSessionInWeek: Number(courseData.NumsSessionInWeek) || 0,
          isCertificate: courseData.IsCertificate,
          categoryIds: courseData.CategoryIds,
        };
        const res = await coursesApi.updateCourse(createdCourseId, payload);
        if (!res.isSuccess) {
          setError(
            res.error?.message ||
              t("tutorDashboard.createCourse.error.createFailed"),
          );
          return;
        }
        if (thumbnailFile && thumbnailChanged) {
          await coursesApi.updateCourseThumbnail(
            createdCourseId,
            thumbnailFile,
            thumbnailFile.name,
          );
        }
        if (demoVideoFile && demoVideoChanged) {
          await coursesApi.updateCourseDemoVideo(
            createdCourseId,
            demoVideoFile,
            demoVideoFile.name,
          );
        }
        setThumbnailChanged(false);
        setDemoVideoChanged(false);
        setStep(2);
        loadExistingModules();
      } else {
        // CREATE mode
        const payload = {
          Title: courseData.Title,
          ShortDescription: courseData.ShortDescription,
          FullDescription: courseData.FullDescription,
          Outcomes: courseData.Outcomes,
          Level: courseData.Level,
          EstimatedTimeLesson: Number(courseData.EstimatedTimeLesson) || 0,
          Price: Number(courseData.Price.replace(/\./g, "")),
          Currency: courseData.Currency,
          NumsSessionInWeek: Number(courseData.NumsSessionInWeek) || 0,
          IsCertificate: courseData.IsCertificate,
          CategoryIds: courseData.CategoryIds,
        };
        if (thumbnailFile) {
          payload.ThumbnailFile = thumbnailFile;
          payload.ThumbnailFileName = thumbnailFile.name;
        }
        if (demoVideoFile) {
          payload.DemoVideoFile = demoVideoFile;
          payload.DemoVideoFileName = demoVideoFile.name;
        }
        const res = await coursesApi.createCourse(payload);
        if (!res.isSuccess) {
          setError(
            res.error?.message ||
              t("tutorDashboard.createCourse.error.createFailed"),
          );
          return;
        }
        setCreatedCourseId(res.data.id);
        setStep(2);
        loadExistingModules(res.data.id);
      }
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

  // Step 2: Create or update modules
  const handleCreateModules = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setError("");
    try {
      const isEditing = createdModules.length > 0;

      if (isEditing) {
        // DELETE removed modules
        for (const id of deletedModuleIds) {
          await coursesApi.deleteCourseModule(id);
        }
        // UPDATE existing modules
        const existingMods = modules.filter((m) => m.id);
        for (const mod of existingMods) {
          await coursesApi.updateCourseModule(mod.id, {
            title: mod.title,
            description: mod.description,
            outcomes: mod.outcomes,
            moduleNumber: mod.moduleNumber,
          });
        }
        // CREATE new modules
        const newMods = modules.filter((m) => !m.id && m.title.trim());
        const existingIds = selectedExistingModules.map((id, idx) => ({
          courseModuleId: id,
          moduleNumber: modules.length + idx + 1,
        }));
        if (newMods.length > 0 || existingIds.length > 0) {
          const payload = {
            courseId: createdCourseId,
            newCourseModules: newMods.map((m) => ({
              title: m.title,
              description: m.description,
              outcomes: m.outcomes,
              moduleNumber: m.moduleNumber,
            })),
            courseModuleIdExists: existingIds,
          };
          await coursesApi.createCourseModule(payload);
        }
        // Refresh modules list
        const res = await coursesApi.getAllCourseModules({
          CourseId: createdCourseId,
          "page-size": 100,
        });
        const updatedModules = res?.data?.items || [];
        setCreatedModules(updatedModules);
        const sessMap = {};
        updatedModules.forEach((m) => {
          sessMap[m.id] = sessions[m.id] || createdSessions[m.id] || [];
        });
        setSessions(sessMap);
        if (updatedModules.length > 0) {
          setActiveModuleForSessions(updatedModules[0].id);
        }
        setDeletedModuleIds([]);
        setStep(3);
        loadExistingSessions(updatedModules[0]?.id);
      } else {
        // CREATE mode (original flow)
        const newMods = modules.filter((m) => m.title.trim());
        const existingIds = selectedExistingModules.map((id, idx) => ({
          courseModuleId: id,
          moduleNumber: newMods.length + idx + 1,
        }));
        const payload = {
          courseId: createdCourseId,
          newCourseModules: newMods.map((m) => ({
            title: m.title,
            description: m.description,
            outcomes: m.outcomes,
            moduleNumber: m.moduleNumber,
          })),
          courseModuleIdExists: existingIds,
        };
        const res = await coursesApi.createCourseModule(payload);
        if (!res.isSuccess) {
          setError(
            res.error?.message ||
              t("tutorDashboard.createCourse.error.createFailed"),
          );
          return;
        }
        setCreatedModules(res.data.courseModules || []);
        const sessMap = {};
        (res.data.courseModules || []).forEach((m) => {
          sessMap[m.id] = [];
        });
        setSessions((prev) => ({ ...sessMap, ...prev }));
        if (res.data.courseModules?.length > 0) {
          setActiveModuleForSessions(res.data.courseModules[0].id);
        }
        setStep(3);
        loadExistingSessions(res.data.courseModules[0]?.id);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          t("tutorDashboard.createCourse.error.createFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Create or update sessions for each module
  const handleCreateSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const isEditing = Object.keys(createdSessions).length > 0;

      if (isEditing) {
        // DELETE removed sessions
        for (const id of deletedSessionIds) {
          await coursesApi.deleteCourseSession(id);
        }
        // UPDATE existing sessions & CREATE new ones
        for (const mod of createdModules) {
          const modSessions = sessions[mod.id] || [];
          const existingSess = modSessions.filter((s) => s.id);
          const newSess = modSessions.filter((s) => !s.id && s.title.trim());
          // Update existing
          for (const sess of existingSess) {
            await coursesApi.updateCourseSession(sess.id, {
              title: sess.title,
              description: sess.description,
              outcomes: sess.outcomes,
              sessionNumber: sess.sessionNumber,
            });
          }
          // Create new
          const existingIds = (selectedExistingSessions[mod.id] || []).map(
            (id, idx) => ({
              courseSessionId: id,
              sessionNumber: modSessions.length + idx + 1,
            }),
          );
          if (newSess.length > 0 || existingIds.length > 0) {
            const payload = {
              courseModuleId: mod.id,
              newCourseSessions: newSess.map((s) => ({
                title: s.title,
                description: s.description,
                outcomes: s.outcomes,
                sessionNumber: s.sessionNumber,
              })),
              courseSessionIdExists: existingIds,
            };
            await coursesApi.createCourseSession(payload);
          }
        }
        // Refresh sessions for all modules
        const allCreatedSessions = {};
        for (const mod of createdModules) {
          const res = await coursesApi.getAllCourseSessions({
            CourseModuleId: mod.id,
            "page-size": 100,
          });
          allCreatedSessions[mod.id] = res?.data?.items || [];
        }
        setCreatedSessions(allCreatedSessions);
        const resMap = {};
        Object.values(allCreatedSessions)
          .flat()
          .forEach((s) => {
            resMap[s.id] = resources[s.id] || createdResources[s.id] || [];
          });
        setResources(resMap);
        const firstSession = Object.values(allCreatedSessions).flat()[0];
        if (firstSession) {
          setActiveSessionForResources(firstSession.id);
          loadExistingResources(firstSession.id);
        }
        setDeletedSessionIds([]);
        setStep(4);
      } else {
        // CREATE mode (original flow)
        const allCreatedSessions = {};
        for (const mod of createdModules) {
          const newSess = (sessions[mod.id] || []).filter((s) =>
            s.title.trim(),
          );
          const existingIds = (selectedExistingSessions[mod.id] || []).map(
            (id, idx) => ({
              courseSessionId: id,
              sessionNumber: newSess.length + idx + 1,
            }),
          );
          if (newSess.length === 0 && existingIds.length === 0) continue;
          const payload = {
            courseModuleId: mod.id,
            newCourseSessions: newSess.map((s) => ({
              title: s.title,
              description: s.description,
              outcomes: s.outcomes,
              sessionNumber: s.sessionNumber,
            })),
            courseSessionIdExists: existingIds,
          };
          const res = await coursesApi.createCourseSession(payload);
          if (res.isSuccess) {
            allCreatedSessions[mod.id] = res.data.courseSessions || [];
          }
        }
        setCreatedSessions(allCreatedSessions);
        const resMap = {};
        Object.values(allCreatedSessions)
          .flat()
          .forEach((s) => {
            resMap[s.id] = [];
          });
        setResources((prev) => ({ ...resMap, ...prev }));
        const firstSession = Object.values(allCreatedSessions).flat()[0];
        if (firstSession) {
          setActiveSessionForResources(firstSession.id);
          loadExistingResources(firstSession.id);
        }
        setStep(4);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          t("tutorDashboard.createCourse.error.createFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Create or update resources for each session
  const handleCreateResources = async () => {
    setLoading(true);
    setError("");
    try {
      const isEditing = Object.keys(createdResources).length > 0;

      if (isEditing) {
        // DELETE removed resources
        for (const id of deletedResourceIds) {
          await coursesApi.deleteCourseResource(id);
        }
        // UPDATE existing resources & CREATE new ones
        const allSessions = Object.values(createdSessions).flat();
        const allCreatedResources = {};
        for (const sess of allSessions) {
          const sessResources = resources[sess.id] || [];
          const updatedForSession = [];
          for (const r of sessResources) {
            if (r.id) {
              // Update existing
              await coursesApi.updateCourseResource(r.id, {
                title: r.title,
                resourceType: r.resourceType,
              });
              updatedForSession.push(r);
            } else if (r.title.trim()) {
              // Create new
              const payload = {
                CourseSessionId: sess.id,
                Title: r.title,
                ResourceType: r.resourceType,
              };
              if (r.file) {
                payload.ResourceFile = r.file;
                payload.ResourceFileName = r.file.name;
              }
              const res = await coursesApi.createCourseResource(payload);
              if (res.isSuccess) updatedForSession.push(res.data);
            }
          }
          if (updatedForSession.length > 0) {
            allCreatedResources[sess.id] = updatedForSession;
          }
        }
        setCreatedResources(allCreatedResources);
        setDeletedResourceIds([]);
        setStep(5);
      } else {
        // CREATE mode (original flow)
        const allCreatedResources = {};
        const allSessions = Object.values(createdSessions).flat();
        for (const sess of allSessions) {
          const newRes = (resources[sess.id] || []).filter((r) =>
            r.title.trim(),
          );
          const createdForSession = [];
          for (const r of newRes) {
            const payload = {
              CourseSessionId: sess.id,
              Title: r.title,
              ResourceType: r.resourceType,
            };
            if (r.file) {
              payload.ResourceFile = r.file;
              payload.ResourceFileName = r.file.name;
            }
            const res = await coursesApi.createCourseResource(payload);
            if (res.isSuccess) createdForSession.push(res.data);
          }
          if (createdForSession.length > 0) {
            allCreatedResources[sess.id] = createdForSession;
          }
        }
        setCreatedResources(allCreatedResources);
        setStep(5);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          t("tutorDashboard.createCourse.error.createFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Submit for verification
  const handleSubmitVerification = async () => {
    setLoading(true);
    setError("");
    try {
      await coursesApi.createCourseVerificationRequest(createdCourseId);
      addToast({
        title: t("tutorDashboard.createCourse.submitForVerification"),
        color: "success",
        timeout: 3000,
      });
      navigate("/tutor/my-courses");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          t("tutorDashboard.createCourse.error.createFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Step indicator
  const stepList = [
    { num: 1, label: t("tutorDashboard.createCourse.stepCourseInfo") },
    { num: 2, label: t("tutorDashboard.createCourse.stepModules") },
    { num: 3, label: t("tutorDashboard.createCourse.stepSessions") },
    { num: 4, label: t("tutorDashboard.createCourse.stepResources") },
    { num: 5, label: t("tutorDashboard.createCourse.stepReview") },
  ];

  const StepIndicator = () => (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {stepList.map((s, idx) => (
        <div key={s.num} className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (s.num < step) goBackToStep(s.num);
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor:
                  step >= s.num ? colors.primary.main : colors.background.gray,
                color:
                  step >= s.num ? colors.text.white : colors.text.secondary,
              }}
            >
              {step > s.num ? (
                <CheckCircle weight="bold" className="w-5 h-5" />
              ) : (
                s.num
              )}
            </div>
            <span
              className="font-medium text-sm whitespace-nowrap"
              style={{
                color:
                  step >= s.num ? colors.primary.main : colors.text.secondary,
              }}
            >
              {s.label}
            </span>
          </div>
          {idx < stepList.length - 1 && (
            <div
              className="w-8 h-0.5 flex-shrink-0"
              style={{
                backgroundColor:
                  step > s.num ? colors.primary.main : colors.background.gray,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Existing item picker component
  const ExistingItemPicker = ({
    title,
    description,
    items,
    selectedIds,
    onToggle,
    searchValue,
    onSearchChange,
    loadingItems,
    searchPlaceholder,
  }) => (
    <Card shadow="none" style={{ backgroundColor: colors.background.light }}>
      <CardBody className="p-6 space-y-4">
        <div>
          <h3
            className="text-base font-semibold"
            style={{ color: colors.text.primary }}
          >
            {title}
          </h3>
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            {description}
          </p>
        </div>
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onValueChange={onSearchChange}
          startContent={
            <MagnifyingGlass
              className="w-4 h-4"
              style={{ color: colors.text.tertiary }}
            />
          }
          classNames={inputClassNames}
          size="sm"
        />
        {loadingItems ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2">
            {items
              .filter(
                (item) =>
                  !searchValue ||
                  item.title?.toLowerCase().includes(searchValue.toLowerCase()),
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: selectedIds.includes(item.id)
                      ? colors.background.primaryLight
                      : colors.background.gray,
                  }}
                  onClick={() => onToggle(item.id)}
                >
                  <Checkbox
                    isSelected={selectedIds.includes(item.id)}
                    onValueChange={() => onToggle(item.id)}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-sm truncate"
                      style={{ color: colors.text.primary }}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p
                        className="text-xs mt-1 line-clamp-2"
                        style={{ color: colors.text.secondary }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            {items.filter(
              (item) =>
                !searchValue ||
                item.title?.toLowerCase().includes(searchValue.toLowerCase()),
            ).length === 0 && (
              <p
                className="text-sm text-center py-4"
                style={{ color: colors.text.secondary }}
              >
                No items found
              </p>
            )}
          </div>
        )}
        {selectedIds.length > 0 && (
          <p
            className="text-sm font-medium"
            style={{ color: colors.primary.main }}
          >
            {t("tutorDashboard.createCourse.selected")}: {selectedIds.length}
          </p>
        )}
      </CardBody>
    </Card>
  );

  // Render
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

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
          {continueId
            ? t("tutorDashboard.createCourse.continueTitle")
            : t("tutorDashboard.createCourse.title")}
        </h1>
        <p style={{ color: colors.text.secondary }}>
          {continueId
            ? t("tutorDashboard.createCourse.continueSubtitle")
            : t("tutorDashboard.createCourse.subtitle")}
        </p>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <StepIndicator />
      </motion.div>

      {/* Error alert */}
      {error && (
        <Alert color="danger" variant="flat" title={error} className="mb-2" />
      )}

      {/* STEP 1: Course Information */}
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
                value={courseData.Title}
                onChange={(e) => handleCourseChange("Title", e.target.value)}
                isInvalid={!!validationErrors.Title}
                errorMessage={validationErrors.Title}
                classNames={inputClassNames}
                isRequired
              />
              <Textarea
                label={t("tutorDashboard.createCourse.shortDescription")}
                placeholder={t(
                  "tutorDashboard.createCourse.shortDescPlaceholder",
                )}
                labelPlacement="outside"
                value={courseData.ShortDescription}
                onChange={(e) =>
                  handleCourseChange("ShortDescription", e.target.value)
                }
                isInvalid={!!validationErrors.ShortDescription}
                errorMessage={validationErrors.ShortDescription}
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
                value={courseData.FullDescription}
                onChange={(e) =>
                  handleCourseChange("FullDescription", e.target.value)
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
                value={courseData.Outcomes}
                onChange={(e) => handleCourseChange("Outcomes", e.target.value)}
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
                <Select
                  label={t("tutorDashboard.createCourse.level")}
                  placeholder={t(
                    "tutorDashboard.createCourse.levelPlaceholder",
                  )}
                  labelPlacement="outside"
                  selectedKeys={courseData.Level ? [courseData.Level] : []}
                  onSelectionChange={(keys) =>
                    handleCourseChange("Level", Array.from(keys)[0] || "")
                  }
                  isInvalid={!!validationErrors.Level}
                  errorMessage={validationErrors.Level}
                  classNames={selectClassNames}
                  isRequired
                >
                  {LEVELS.map((level) => (
                    <SelectItem key={level}>{level}</SelectItem>
                  ))}
                </Select>
                <Input
                  label={t("tutorDashboard.createCourse.price")}
                  placeholder="0"
                  type="text"
                  inputMode="numeric"
                  labelPlacement="outside"
                  value={courseData.Price}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    handleCourseChange("Price", formatted);
                  }}
                  isInvalid={!!validationErrors.Price}
                  errorMessage={validationErrors.Price}
                  classNames={inputClassNames}
                  isRequired
                  endContent={
                    <span
                      className="text-sm"
                      style={{ color: colors.text.tertiary }}
                    >
                      VND
                    </span>
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={t("tutorDashboard.createCourse.sessionsPerWeek")}
                  placeholder="0"
                  type="number"
                  labelPlacement="outside"
                  value={courseData.NumsSessionInWeek}
                  onChange={(e) =>
                    handleCourseChange("NumsSessionInWeek", e.target.value)
                  }
                  classNames={inputClassNames}
                />
                <Input
                  label={t("tutorDashboard.createCourse.estimatedTimeLesson")}
                  placeholder="0"
                  type="number"
                  labelPlacement="outside"
                  value={courseData.EstimatedTimeLesson}
                  onChange={(e) =>
                    handleCourseChange("EstimatedTimeLesson", e.target.value)
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
                <div className="flex items-end h-full pb-1">
                  <Checkbox
                    isSelected={courseData.IsCertificate}
                    onValueChange={(v) =>
                      handleCourseChange("IsCertificate", v)
                    }
                  >
                    <span style={{ color: colors.text.primary }}>
                      {t("tutorDashboard.createCourse.isCertificate")}
                    </span>
                  </Checkbox>
                </div>
              </div>
              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <p
                    className="text-sm font-medium mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {t("tutorDashboard.createCourse.category")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Chip
                        key={cat.id}
                        variant={
                          courseData.CategoryIds.includes(cat.id)
                            ? "solid"
                            : "flat"
                        }
                        className="cursor-pointer"
                        style={{
                          backgroundColor: courseData.CategoryIds.includes(
                            cat.id,
                          )
                            ? colors.primary.main
                            : colors.background.gray,
                          color: courseData.CategoryIds.includes(cat.id)
                            ? colors.text.white
                            : colors.text.primary,
                        }}
                        onClick={() => {
                          setCourseData((prev) => ({
                            ...prev,
                            CategoryIds: prev.CategoryIds.includes(cat.id)
                              ? prev.CategoryIds.filter((id) => id !== cat.id)
                              : [...prev.CategoryIds, cat.id],
                          }));
                        }}
                      >
                        {cat.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
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
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorDashboard.createCourse.thumbnail")}
                </p>
                <label
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer"
                  style={{ borderColor: colors.border.light }}
                >
                  <ImageIcon
                    className="w-6 h-6"
                    style={{ color: colors.text.tertiary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {thumbnailFile
                      ? thumbnailFile.name
                      : existingThumbnailUrl
                        ? t("tutorDashboard.createCourse.changeFile")
                        : t("tutorDashboard.createCourse.noFileChosen")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      setThumbnailFile(e.target.files?.[0] || null);
                      setThumbnailChanged(true);
                    }}
                  />
                </label>
                {thumbnailFile ? (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Thumbnail preview"
                      className="rounded-lg object-cover max-h-48 w-auto"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="absolute top-1 right-1 min-w-6 w-6 h-6"
                      onPress={() => setThumbnailFile(null)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                ) : existingThumbnailUrl ? (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={existingThumbnailUrl}
                      alt="Thumbnail preview"
                      className="rounded-lg object-cover max-h-48 w-auto"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="absolute top-1 right-1 min-w-6 w-6 h-6"
                      onPress={() => setExistingThumbnailUrl(null)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                ) : null}
              </div>
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {t("tutorDashboard.createCourse.demoVideo")}
                </p>
                <label
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer"
                  style={{ borderColor: colors.border.light }}
                >
                  <VideoCamera
                    className="w-6 h-6"
                    style={{ color: colors.text.tertiary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    {demoVideoFile
                      ? demoVideoFile.name
                      : existingDemoVideoUrl
                        ? t("tutorDashboard.createCourse.changeFile")
                        : t("tutorDashboard.createCourse.noFileChosen")}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      setDemoVideoFile(e.target.files?.[0] || null);
                      setDemoVideoChanged(true);
                    }}
                  />
                </label>
                {demoVideoFile ? (
                  <div className="mt-3 relative inline-block">
                    <video
                      src={URL.createObjectURL(demoVideoFile)}
                      controls
                      className="rounded-lg max-h-56 w-auto"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="absolute top-1 right-1 min-w-6 w-6 h-6"
                      onPress={() => setDemoVideoFile(null)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                ) : existingDemoVideoUrl ? (
                  <div className="mt-3 relative inline-block w-full">
                    <video
                      src={existingDemoVideoUrl}
                      controls
                      className="rounded-lg max-h-56 w-auto"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="absolute top-1 right-1 min-w-6 w-6 h-6"
                      onPress={() => setExistingDemoVideoUrl(null)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Button
              color="primary"
              size="lg"
              onPress={handleCreateCourse}
              isLoading={loading}
              isDisabled={loading}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              endContent={
                !loading && <ArrowRight weight="bold" className="w-5 h-5" />
              }
            >
              {loading
                ? createdCourseId
                  ? t("tutorDashboard.createCourse.saving")
                  : t("tutorDashboard.createCourse.creating")
                : t("tutorDashboard.createCourse.nextAddModules")}
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Course Modules */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {/* Existing modules picker */}
          <ExistingItemPicker
            title={t("tutorDashboard.createCourse.existingModules")}
            description={t("tutorDashboard.createCourse.existingModulesDesc")}
            items={existingModules}
            selectedIds={selectedExistingModules}
            onToggle={(id) =>
              setSelectedExistingModules((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : [...prev, id],
              )
            }
            searchValue={moduleSearch}
            onSearchChange={setModuleSearch}
            loadingItems={loadingExistingModules}
            searchPlaceholder={t("tutorDashboard.createCourse.searchModules")}
          />

          {/* New modules */}
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

          <Divider />
          <div className="flex justify-between gap-4">
            <Button
              variant="flat"
              size="lg"
              onPress={() => goBackToStep(1)}
              startContent={<ArrowLeft className="w-5 h-5" />}
              style={{ color: colors.text.secondary }}
            >
              {t("tutorDashboard.createCourse.back")}
            </Button>
            <Button
              color="primary"
              size="lg"
              onPress={handleCreateModules}
              isLoading={loading}
              isDisabled={loading}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              endContent={
                !loading && <ArrowRight weight="bold" className="w-5 h-5" />
              }
            >
              {loading
                ? createdModules.length > 0
                  ? t("tutorDashboard.createCourse.saving")
                  : t("tutorDashboard.createCourse.creating")
                : t("tutorDashboard.createCourse.nextAddSessions")}
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Sessions per Module */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {createdModules.length === 0 ? (
            <Alert
              color="warning"
              variant="flat"
              title={t("tutorDashboard.createCourse.noModulesForSessions")}
            />
          ) : (
            <>
              {/* Module tabs */}
              <div className="flex flex-wrap gap-2">
                {createdModules.map((mod) => (
                  <Chip
                    key={mod.id}
                    variant={
                      activeModuleForSessions === mod.id ? "solid" : "flat"
                    }
                    className="cursor-pointer"
                    style={{
                      backgroundColor:
                        activeModuleForSessions === mod.id
                          ? colors.primary.main
                          : colors.background.gray,
                      color:
                        activeModuleForSessions === mod.id
                          ? colors.text.white
                          : colors.text.primary,
                    }}
                    onClick={() => setActiveModuleForSessions(mod.id)}
                  >
                    {mod.title}
                  </Chip>
                ))}
              </div>

              {activeModuleForSessions && (
                <>
                  {/* Existing sessions picker */}
                  <ExistingItemPicker
                    title={t("tutorDashboard.createCourse.existingSessions")}
                    description={t(
                      "tutorDashboard.createCourse.existingSessionsDesc",
                    )}
                    items={existingSessions}
                    selectedIds={
                      selectedExistingSessions[activeModuleForSessions] || []
                    }
                    onToggle={(id) =>
                      setSelectedExistingSessions((prev) => {
                        const current = prev[activeModuleForSessions] || [];
                        return {
                          ...prev,
                          [activeModuleForSessions]: current.includes(id)
                            ? current.filter((x) => x !== id)
                            : [...current, id],
                        };
                      })
                    }
                    searchValue={sessionSearch}
                    onSearchChange={setSessionSearch}
                    loadingItems={loadingExistingSessions}
                    searchPlaceholder={t(
                      "tutorDashboard.createCourse.searchSessions",
                    )}
                  />

                  {/* New sessions for active module */}
                  {getSessionsForModule(activeModuleForSessions).map(
                    (sess, index) => (
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
                              {t("tutorDashboard.createCourse.sessionNumber", {
                                number: sess.sessionNumber,
                              })}
                            </h3>
                            <Button
                              isIconOnly
                              variant="light"
                              color="danger"
                              size="sm"
                              onPress={() =>
                                removeSession(activeModuleForSessions, index)
                              }
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            label={t(
                              "tutorDashboard.createCourse.sessionTitle",
                            )}
                            placeholder={t(
                              "tutorDashboard.createCourse.sessionTitlePlaceholder",
                            )}
                            labelPlacement="outside"
                            value={sess.title}
                            onChange={(e) =>
                              handleSessionChange(
                                activeModuleForSessions,
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                            classNames={inputClassNames}
                            isRequired
                          />
                          <Textarea
                            label={t(
                              "tutorDashboard.createCourse.sessionDescription",
                            )}
                            placeholder={t(
                              "tutorDashboard.createCourse.sessionDescPlaceholder",
                            )}
                            labelPlacement="outside"
                            value={sess.description}
                            onChange={(e) =>
                              handleSessionChange(
                                activeModuleForSessions,
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            classNames={inputClassNames}
                            minRows={2}
                            maxRows={4}
                          />
                          <Textarea
                            label={t(
                              "tutorDashboard.createCourse.sessionOutcomes",
                            )}
                            placeholder={t(
                              "tutorDashboard.createCourse.sessionOutcomesPlaceholder",
                            )}
                            labelPlacement="outside"
                            value={sess.outcomes}
                            onChange={(e) =>
                              handleSessionChange(
                                activeModuleForSessions,
                                index,
                                "outcomes",
                                e.target.value,
                              )
                            }
                            classNames={inputClassNames}
                            minRows={2}
                            maxRows={3}
                          />
                        </CardBody>
                      </Card>
                    ),
                  )}

                  <Button
                    variant="flat"
                    startContent={<Plus weight="bold" className="w-5 h-5" />}
                    onPress={() => addSession(activeModuleForSessions)}
                    className="w-full"
                    style={{
                      backgroundColor: colors.background.primaryLight,
                      color: colors.primary.main,
                    }}
                  >
                    {t("tutorDashboard.createCourse.addSession")}
                  </Button>
                </>
              )}
            </>
          )}

          <Divider />
          <div className="flex justify-between gap-4">
            <Button
              variant="flat"
              size="lg"
              onPress={() => goBackToStep(2)}
              startContent={<ArrowLeft className="w-5 h-5" />}
              style={{ color: colors.text.secondary }}
            >
              {t("tutorDashboard.createCourse.back")}
            </Button>
            <Button
              color="primary"
              size="lg"
              onPress={handleCreateSessions}
              isLoading={loading}
              isDisabled={loading}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              endContent={
                !loading && <ArrowRight weight="bold" className="w-5 h-5" />
              }
            >
              {loading
                ? Object.keys(createdSessions).length > 0
                  ? t("tutorDashboard.createCourse.saving")
                  : t("tutorDashboard.createCourse.creating")
                : t("tutorDashboard.createCourse.nextAddResources")}
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Resources per Session */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          {Object.values(createdSessions).flat().length === 0 ? (
            <Alert
              color="warning"
              variant="flat"
              title={t("tutorDashboard.createCourse.noSessionsForResources")}
            />
          ) : (
            <>
              {/* Session tabs grouped by module */}
              {createdModules.map((mod) => {
                const modSessions = createdSessions[mod.id] || [];
                if (modSessions.length === 0) return null;
                return (
                  <div key={mod.id} className="space-y-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.text.secondary }}
                    >
                      {mod.title}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {modSessions.map((sess) => (
                        <Chip
                          key={sess.id}
                          variant={
                            activeSessionForResources === sess.id
                              ? "solid"
                              : "flat"
                          }
                          className="cursor-pointer"
                          style={{
                            backgroundColor:
                              activeSessionForResources === sess.id
                                ? colors.primary.main
                                : colors.background.gray,
                            color:
                              activeSessionForResources === sess.id
                                ? colors.text.white
                                : colors.text.primary,
                          }}
                          onClick={() => {
                            setActiveSessionForResources(sess.id);
                            loadExistingResources(sess.id);
                          }}
                        >
                          {sess.title}
                        </Chip>
                      ))}
                    </div>
                  </div>
                );
              })}

              {activeSessionForResources && (
                <>
                  {/* New resources for active session */}
                  {getResourcesForSession(activeSessionForResources).map(
                    (res, index) => (
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
                              {t("tutorDashboard.createCourse.resourceNumber", {
                                number: index + 1,
                              })}
                            </h3>
                            <Button
                              isIconOnly
                              variant="light"
                              color="danger"
                              size="sm"
                              onPress={() =>
                                removeResource(activeSessionForResources, index)
                              }
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                              label={t(
                                "tutorDashboard.createCourse.resourceTitle",
                              )}
                              placeholder={t(
                                "tutorDashboard.createCourse.resourceTitlePlaceholder",
                              )}
                              labelPlacement="outside"
                              value={res.title}
                              onChange={(e) =>
                                handleResourceChange(
                                  activeSessionForResources,
                                  index,
                                  "title",
                                  e.target.value,
                                )
                              }
                              classNames={inputClassNames}
                              isRequired
                            />
                            <Input
                              label={t(
                                "tutorDashboard.createCourse.resourceType",
                              )}
                              placeholder={t(
                                "tutorDashboard.createCourse.resourceTypePlaceholder",
                              )}
                              labelPlacement="outside"
                              value={res.resourceType}
                              onChange={(e) =>
                                handleResourceChange(
                                  activeSessionForResources,
                                  index,
                                  "resourceType",
                                  e.target.value,
                                )
                              }
                              classNames={inputClassNames}
                            />
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium mb-2"
                              style={{ color: colors.text.primary }}
                            >
                              {t("tutorDashboard.createCourse.resourceFile")}
                            </p>
                            <label
                              className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer"
                              style={{ borderColor: colors.border.light }}
                            >
                              <FileIcon
                                className="w-5 h-5"
                                style={{ color: colors.text.tertiary }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: colors.text.secondary }}
                              >
                                {res.file
                                  ? res.file.name
                                  : t(
                                      "tutorDashboard.createCourse.noFileChosen",
                                    )}
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleResourceChange(
                                    activeSessionForResources,
                                    index,
                                    "file",
                                    e.target.files?.[0] || null,
                                  )
                                }
                              />
                            </label>
                          </div>
                        </CardBody>
                      </Card>
                    ),
                  )}

                  <Button
                    variant="flat"
                    startContent={<Plus weight="bold" className="w-5 h-5" />}
                    onPress={() => addResource(activeSessionForResources)}
                    className="w-full"
                    style={{
                      backgroundColor: colors.background.primaryLight,
                      color: colors.primary.main,
                    }}
                  >
                    {t("tutorDashboard.createCourse.addResource")}
                  </Button>
                </>
              )}
            </>
          )}

          <Divider />
          <div className="flex justify-between gap-4">
            <Button
              variant="flat"
              size="lg"
              onPress={() => goBackToStep(3)}
              startContent={<ArrowLeft className="w-5 h-5" />}
              style={{ color: colors.text.secondary }}
            >
              {t("tutorDashboard.createCourse.back")}
            </Button>
            <Button
              color="primary"
              size="lg"
              onPress={handleCreateResources}
              isLoading={loading}
              isDisabled={loading}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              endContent={
                !loading && <ArrowRight weight="bold" className="w-5 h-5" />
              }
            >
              {loading
                ? Object.keys(createdResources).length > 0
                  ? t("tutorDashboard.createCourse.saving")
                  : t("tutorDashboard.createCourse.creating")
                : t("tutorDashboard.createCourse.nextReview")}
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 5: Review & Submit */}
      {step === 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          <Card
            shadow="none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6 space-y-4">
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.createCourse.reviewTitle")}
              </h2>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                {t("tutorDashboard.createCourse.reviewSubtitle")}
              </p>
            </CardBody>
          </Card>

          {/* Course info summary */}
          <Card
            shadow="none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6 space-y-3">
              <h3
                className="text-base font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.createCourse.reviewCourseInfo")}
              </h3>
              <Divider />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span style={{ color: colors.text.secondary }}>
                    {t("tutorDashboard.createCourse.courseTitle")}:
                  </span>
                  <p
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {courseData.Title}
                  </p>
                </div>
                <div>
                  <span style={{ color: colors.text.secondary }}>
                    {t("tutorDashboard.createCourse.level")}:
                  </span>
                  <p
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {courseData.Level}
                  </p>
                </div>
                <div>
                  <span style={{ color: colors.text.secondary }}>
                    {t("tutorDashboard.createCourse.price")}:
                  </span>
                  <p
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {Number(courseData.Price.replace(/\./g, "")).toLocaleString(
                      "vi-VN",
                    )}{" "}
                    VND
                  </p>
                </div>
                <div>
                  <span style={{ color: colors.text.secondary }}>
                    {t("tutorDashboard.createCourse.isCertificate")}:
                  </span>
                  <p
                    className="font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    {courseData.IsCertificate
                      ? t("tutorDashboard.createCourse.yes")
                      : t("tutorDashboard.createCourse.no")}
                  </p>
                </div>
              </div>
              {courseData.ShortDescription && (
                <div className="text-sm">
                  <span style={{ color: colors.text.secondary }}>
                    {t("tutorDashboard.createCourse.shortDescription")}:
                  </span>
                  <p style={{ color: colors.text.primary }}>
                    {courseData.ShortDescription}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Modules summary */}
          <Card
            shadow="none"
            style={{ backgroundColor: colors.background.light }}
          >
            <CardBody className="p-6 space-y-3">
              <h3
                className="text-base font-semibold"
                style={{ color: colors.text.primary }}
              >
                {t("tutorDashboard.createCourse.reviewModules")} (
                {createdModules.length})
              </h3>
              <Divider />
              {createdModules.map((mod) => {
                const modSessions = createdSessions[mod.id] || [];
                return (
                  <div
                    key={mod.id}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p
                      className="font-medium text-sm"
                      style={{ color: colors.text.primary }}
                    >
                      {mod.moduleNumber}. {mod.title}
                    </p>
                    {mod.description && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.text.secondary }}
                      >
                        {mod.description}
                      </p>
                    )}
                    {modSessions.length > 0 && (
                      <div className="mt-2 ml-4 space-y-1">
                        {modSessions.map((sess) => {
                          const sessResources = createdResources[sess.id] || [];
                          return (
                            <div key={sess.id}>
                              <p
                                className="text-xs font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                {sess.sessionNumber}. {sess.title}
                              </p>
                              {sessResources.length > 0 && (
                                <div className="ml-4 mt-1 space-y-0.5">
                                  {sessResources.map((r) => (
                                    <p
                                      key={r.id}
                                      className="text-xs flex items-center gap-1"
                                      style={{ color: colors.text.secondary }}
                                    >
                                      <FileIcon className="w-3 h-3" />
                                      {r.title} ({r.resourceType})
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Divider />
          <div className="flex justify-between gap-4">
            <Button
              variant="flat"
              size="lg"
              onPress={() => goBackToStep(4)}
              startContent={<ArrowLeft className="w-5 h-5" />}
              style={{ color: colors.text.secondary }}
            >
              {t("tutorDashboard.createCourse.back")}
            </Button>
            <Button
              color="primary"
              size="lg"
              onPress={handleSubmitVerification}
              isLoading={loading}
              isDisabled={loading}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.text.white,
              }}
              startContent={
                !loading && <PaperPlaneTilt weight="bold" className="w-5 h-5" />
              }
            >
              {loading
                ? t("tutorDashboard.createCourse.submitting")
                : t("tutorDashboard.createCourse.submitForVerification")}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreateCourse;
