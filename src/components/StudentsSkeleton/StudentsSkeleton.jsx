import { Card, CardBody, Skeleton } from "@heroui/react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function StudentsSkeleton({ count = 5 }) {
  const colors = useThemeColors();

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          shadow="none"
          className="border-none"
          style={{ backgroundColor: colors.background.light }}
        >
          <CardBody className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Avatar + name/course */}
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  {/* Name + status chip */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-36 rounded-lg" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  {/* Course name */}
                  <Skeleton className="h-3.5 w-56 rounded-md" />
                  {/* Progress bar area */}
                  <div className="space-y-1.5 mt-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20 rounded-md" />
                      <Skeleton className="h-3 w-10 rounded-md" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Skeleton className="h-8 w-28 rounded-xl" />
                <Skeleton className="h-8 w-28 rounded-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
