import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Avatar,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Star, Users, Clock, BookOpen } from "@phosphor-icons/react";

const CourseCard = ({
  course,
  showViewButton = true,
  showCategory = false,
  variant = "default", // "default" | "compact"
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Card
      className="h-full shadow-none"
      style={{
        backgroundColor:
          variant === "compact"
            ? colors.background.gray
            : colors.background.card,
      }}
    >
      <div className="relative p-3">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 object-cover rounded-xl"
        />
        {course.isBestseller && (
          <Chip
            size="sm"
            className="absolute top-5 left-5"
            style={{
              backgroundColor: colors.primary.main,
              color: colors.text.white,
            }}
          >
            {t("courses.bestseller")}
          </Chip>
        )}
      </div>
      <CardBody
        className={`p-4 pt-0${variant === "compact" ? " flex-grow" : ""}`}
      >
        <div className="flex items-center gap-2 mb-2">
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
          {showCategory && course.category && (
            <Chip
              size="sm"
              variant="flat"
              style={{
                backgroundColor: colors.background.gray,
                color: colors.text.secondary,
              }}
            >
              {course.category}
            </Chip>
          )}
        </div>
        <h3
          className="font-semibold mb-2 line-clamp-2 min-h-[48px]"
          style={{ color: colors.text.primary }}
        >
          {course.title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {course.tutorAvatar && (
            <Avatar src={course.tutorAvatar} size="sm" className="w-6 h-6" />
          )}
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            {course.tutor}
          </p>
        </div>
        <div
          className="flex items-center gap-3 text-sm mb-3"
          style={{ color: colors.text.secondary }}
        >
          <span className="flex items-center gap-1">
            <Star size={14} weight="fill" style={{ color: "#F59E0B" }} />
            {course.rating}
            {course.reviews && ` (${course.reviews})`}
          </span>
          {course.students && (
            <span className="flex items-center gap-1">
              <Users size={14} weight="duotone" />
              {course.students?.toLocaleString()}
            </span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock size={14} weight="duotone" />
              {course.duration}
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
            ${course.price}
          </span>
          <span
            className="text-sm line-through ml-2"
            style={{ color: colors.text.secondary }}
          >
            ${course.originalPrice}
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
            onPress={() => navigate(`/courses/${course.id}`)}
          >
            {t("courses.viewDetails")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
