import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Avatar, Chip, Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { motion } from "framer-motion";
import { adminApi } from "../../../api";
import { ArrowLeft, Star, CheckCircle } from "@phosphor-icons/react";

const AdminTutorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getTutorById(id);
        setTutor(response.data);
      } catch (error) {
        console.error("Failed to fetch tutor detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getVerifiedColor = (status) => {
    return status === "Verified" ? "success" : "warning";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "default";
      default:
        return "primary";
    }
  };

  const getTutorName = (t) => {
    if (t?.user) {
      return `${t.user.firstName || ""} ${t.user.lastName || ""}`.trim();
    }
    return "N/A";
  };

  const getTutorEmail = (t) => {
    return t?.user?.email || "";
  };

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-3"
      >
        <Button
          isIconOnly
          variant="light"
          onPress={() => navigate("/admin/tutors")}
        >
          <ArrowLeft size={20} style={{ color: colors.text.primary }} />
        </Button>
        <h1
          className="text-2xl lg:text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {t("adminDashboard.tutors.tutorDetails")}
        </h1>
      </motion.div>

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
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : tutor ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar src={tutor.avatar} className="w-20 h-20" />
                  <div>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      {getTutorName(tutor)}
                    </h3>
                    <p style={{ color: colors.text.secondary }}>
                      {tutor.headline || ""}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Chip
                        size="sm"
                        color={getVerifiedColor(tutor.verifiedStatus)}
                        variant="flat"
                      >
                        {tutor.verifiedStatus === "Verified"
                          ? t("adminDashboard.tutors.verified")
                          : t("adminDashboard.tutors.unverified")}
                      </Chip>
                      <Chip
                        size="sm"
                        color={getStatusColor(tutor.status)}
                        variant="flat"
                      >
                        {tutor.status}
                      </Chip>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star
                        className="w-5 h-5"
                        weight="fill"
                        style={{ color: colors.state.warning }}
                      />
                      <span
                        className="text-2xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {tutor.ratingAverage > 0
                          ? tutor.ratingAverage.toFixed(1)
                          : t("adminDashboard.tutors.nA")}
                      </span>
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.tutors.table.rating")}
                      {tutor.ratingCount > 0 &&
                        ` (${tutor.ratingCount} ${t("adminDashboard.tutors.ratingCount")})`}
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {tutor.monthExperience || 0}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.tutors.experience")} (
                      {t("adminDashboard.tutors.months")})
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{ backgroundColor: colors.background.gray }}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {tutor.slotsCount || 0}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {t("adminDashboard.tutors.slots")}
                    </p>
                  </div>
                </div>

                {/* Info grid */}
                <div className="space-y-3">
                  {tutor.bio && (
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.tutors.bio")}
                      </p>
                      <p style={{ color: colors.text.primary }}>{tutor.bio}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.tutors.email")}
                      </p>
                      <p style={{ color: colors.text.primary }}>
                        {getTutorEmail(tutor)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.tutors.joinDate")}
                      </p>
                      <p style={{ color: colors.text.primary }}>
                        {tutor.createdAt
                          ? new Date(tutor.createdAt).toLocaleDateString()
                          : t("adminDashboard.tutors.nA")}
                      </p>
                    </div>
                  </div>
                  {tutor.introVideoUrl && (
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.tutors.introVideo")}
                      </p>
                      <video
                        src={tutor.introVideoUrl}
                        controls
                        className="w-full max-h-60 rounded-lg"
                      />
                    </div>
                  )}
                  {tutor.cvUrl && (
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: colors.text.secondary }}
                      >
                        {t("adminDashboard.tutors.cvFile")}
                      </p>
                      <a
                        href={tutor.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                        style={{ color: colors.primary.main }}
                      >
                        {t("adminDashboard.tutors.view")} CV
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminTutorDetail;
