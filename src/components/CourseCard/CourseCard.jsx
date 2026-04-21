import { Card, CardBody, Chip, Avatar, Progress } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Star, Users } from "@phosphor-icons/react";

const CourseCard = ({
  course,
  showCategory = false,
  showTutorInfo = true,
  statusBadge = null,
  topRightAction = null,
  basePath = "/courses",
  style: customStyle = {},
  progress = null, // { completed, total } — when provided, shows progress bar instead of stats
}) => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  const formatPrice = (price) => {
    if (price == null) return "";
    return price.toLocaleString("vi-VN") + "₫";
  };

  const category = course.courseCategories?.[0]?.categoryName;

  return (
    <Card
      isPressable
      onPress={() => navigate(`${basePath}/${course.id}`)}
      className="h-full w-full shadow-none"
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
            course.thumbnailUrl
              ? {}
              : { backgroundColor: colors.background.gray }
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
      <CardBody className="p-4 pt-0 flex flex-col flex-1">
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
          className="font-semibold line-clamp-2 min-h-[40px] mb-1"
          style={{ color: colors.text.primary }}
        >
          {course.title}
        </h3>
        {showTutorInfo && (course.tutorFirstName || course.tutorLastName) && (
          <div className="flex items-center gap-2 mb-3">
            <Avatar
              src={course.tutorAvatar}
              name={[course.tutorFirstName, course.tutorLastName]
                .filter(Boolean)
                .join(" ")}
              size="sm"
              className="w-8 h-8 flex-shrink-0"
            />
            <p
              className="text-sm truncate"
              style={{ color: colors.text.secondary }}
            >
              {[course.tutorFirstName, course.tutorLastName]
                .filter(Boolean)
                .join(" ")}
            </p>
          </div>
        )}
        {progress ? (
          <div className="mt-auto space-y-1.5">
            <div
              className="flex items-center justify-between text-xs"
              style={{ color: colors.text.secondary }}
            >
              <span>Progress</span>
              <span
                className="font-medium"
                style={{ color: colors.text.primary }}
              >
                {progress.completed}/{progress.total} lessons
              </span>
            </div>
            <Progress
              value={
                progress.total > 0
                  ? Math.round((progress.completed / progress.total) * 100)
                  : 0
              }
              size="md"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between mt-auto">
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: colors.text.secondary }}
            >
              <span className="flex items-center gap-1">
                <Star size={14} weight="fill" style={{ color: "#F59E0B" }} />
                {course.ratingAverage}
                {course.ratingCount > 0 && ` (${course.ratingCount})`}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} weight="duotone" />
                {course.numberOfEnrollment?.toLocaleString()}
              </span>
            </div>
            <span
              className="text-lg font-bold"
              style={{ color: colors.primary.main }}
            >
              {formatPrice(course.price)}
            </span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CourseCard;
