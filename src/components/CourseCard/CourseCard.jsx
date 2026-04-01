import { Card, CardBody, CardFooter, Chip, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Star, Users, Clock } from "@phosphor-icons/react";

const CourseCard = ({
  course,
  showViewButton = true,
  showCategory = false,
  showTutorInfo = true,
  statusBadge = null,
  topRightAction = null,
  basePath = "/courses",
  variant = "default", // "default" | "compact"
  style: customStyle = {},
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();

  const formatDuration = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const formatPrice = (price) => {
    if (price == null) return "";
    return price.toLocaleString("vi-VN") + "₫";
  };

  const category = course.courseCategories?.[0]?.categoryName;

  return (
    <Card
      className="h-full shadow-none"
      style={{
        backgroundColor: colors.background.light,
        ...customStyle,
      }}
    >
      <div className="relative p-3">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-40 object-cover rounded-xl"
          style={
            !course.thumbnailUrl
              ? { backgroundColor: colors.background.gray }
              : {}
          }
        />
        {statusBadge && (
          <Chip
            size="sm"
            className="absolute top-5 left-5"
            style={{
              backgroundColor: statusBadge.color,
              color: "#fff",
            }}
          >
            {statusBadge.label}
          </Chip>
        )}
        {topRightAction && (
          <div className="absolute top-5 right-5 z-10">{topRightAction}</div>
        )}
      </div>
      <CardBody
        className={`p-4 pt-0${variant === "compact" ? " flex-grow" : ""}`}
      >
        <div className="flex items-center gap-2 mb-2">
          {course.level && (
            <Chip
              size="sm"
              variant="flat"
              style={{
                backgroundColor: colors.background.primaryLight,
                color: colors.primary.main,
              }}
            >
              {course.level}
            </Chip>
          )}
          {showCategory && category && (
            <Chip
              size="sm"
              variant="flat"
              style={{
                backgroundColor: colors.background.gray,
                color: colors.text.secondary,
              }}
            >
              {category}
            </Chip>
          )}
        </div>
        <h3
          className="font-semibold mb-2 line-clamp-2 min-h-[48px]"
          style={{ color: colors.text.primary }}
        >
          {course.title}
        </h3>
        {showTutorInfo && course.tutor && (
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              {course.tutor}
            </p>
          </div>
        )}
        <div
          className="flex items-center gap-3 text-sm mb-3"
          style={{ color: colors.text.secondary }}
        >
          <span className="flex items-center gap-1">
            <Star size={14} weight="fill" style={{ color: "#F59E0B" }} />
            {course.ratingAverage}
            {course.ratingCount > 0 && ` (${course.ratingCount})`}
          </span>
          {course.numberOfEnrollment > 0 && (
            <span className="flex items-center gap-1">
              <Users size={14} weight="duotone" />
              {course.numberOfEnrollment?.toLocaleString()}
            </span>
          )}
          {course.estimatedTimeLesson && (
            <span className="flex items-center gap-1">
              <Clock size={14} weight="duotone" />
              {formatDuration(course.estimatedTimeLesson)}
            </span>
          )}
        </div>
      </CardBody>
      <CardFooter
        className={`p-4 pt-0 flex justify-between items-center${variant === "compact" ? " mt-auto" : ""}`}
      >
        <div>
          <span
            className="text-lg font-bold"
            style={{ color: colors.primary.main }}
          >
            {formatPrice(course.price)}
          </span>
        </div>
        {showViewButton && (
          <Button
            size="md"
            style={{
              fontWeight: "600",
              backgroundColor: colors.button.primaryLight.background,
              color: colors.button.primaryLight.text,
            }}
            onPress={() => navigate(`${basePath}/${course.id}`)}
          >
            {t("courses.viewDetails")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
