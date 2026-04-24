import { Card, CardBody, Skeleton } from "@heroui/react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function HomeworkSkeleton({
  count = 5,
  showTutorBadge = false,
}) {
  const colors = useThemeColors();

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              {/* Left: icon placeholder */}
              <div className="flex-1 space-y-2.5">
                {/* Breadcrumb */}
                <Skeleton className="h-3 w-2/5 rounded-md" />

                {/* Title */}
                <Skeleton className="h-5 w-3/4 rounded-lg" />

                {/* Description line */}
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />

                {/* Bottom row: chips + date */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  {showTutorBadge && (
                    <Skeleton className="h-5 w-24 rounded-full" />
                  )}
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>

              {/* Right: action button placeholder */}
              <div className="flex-shrink-0 self-start">
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
