import { Card, CardBody, Skeleton } from "@heroui/react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function ScheduleSkeleton() {
  const colors = useThemeColors();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_460px]">
      {/* Calendar skeleton */}
      <Card
        shadow="none"
        className="border-none"
        style={{ backgroundColor: colors.background.light }}
      >
        <CardBody className="p-4">
          {/* Week navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-5 w-44 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>

          {/* Day headers */}
          <div
            className="grid pb-3 mb-1"
            style={{
              gridTemplateColumns: "44px repeat(7, 1fr)",
              borderBottom: `1px solid ${colors.border.light}`,
            }}
          >
            <div />
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 px-1">
                <Skeleton className="h-3 w-8 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
            ))}
          </div>

          {/* Time grid rows */}
          <div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="grid"
                style={{
                  gridTemplateColumns: "44px repeat(7, 1fr)",
                  height: "48px",
                }}
              >
                <div className="flex items-start justify-end pr-2 pt-1">
                  <Skeleton className="h-3 w-9 rounded-sm" />
                </div>
                {Array.from({ length: 7 }).map((_, j) => (
                  <div
                    key={j}
                    className="px-0.5 pt-1"
                    style={{
                      borderLeft: `1px solid ${colors.border.light}`,
                      borderTop:
                        i > 0 ? `1px solid ${colors.border.light}` : "none",
                    }}
                  >
                    {((i === 1 && j === 2) ||
                      (i === 3 && j === 4) ||
                      (i === 5 && j === 0) ||
                      (i === 2 && j === 6) ||
                      (i === 7 && j === 3)) && (
                      <Skeleton className="h-9 w-full rounded-lg" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Sidebar skeleton */}
      <Card
        shadow="none"
        className="border-none"
        style={{ backgroundColor: colors.background.light }}
      >
        <CardBody className="p-6 space-y-4">
          {/* Tab buttons */}
          <div className="flex gap-2 mb-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>

          {/* Lesson items */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-xl space-y-2"
              style={{ backgroundColor: colors.background.gray }}
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                <Skeleton className="h-3 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
