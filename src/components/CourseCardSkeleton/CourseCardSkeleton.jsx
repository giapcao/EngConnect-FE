import { Card, CardBody, Skeleton } from "@heroui/react";

export default function CourseCardSkeleton({
  count = 4,
  gridClassName = "grid sm:grid-cols-2 lg:grid-cols-4 gap-6",
  cardBgColor,
  showProgress = false,
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          shadow="none"
          className="h-full w-full"
          style={cardBgColor ? { backgroundColor: cardBgColor } : undefined}
        >
          {/* Thumbnail */}
          <div className="p-3">
            <Skeleton className="w-full h-40 rounded-xl" />
          </div>
          <CardBody className="p-4 pt-0 flex flex-col flex-1">
            {/* Level chip */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            {/* Title */}
            <div className="space-y-2 mb-3">
              <Skeleton className="h-5 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/5 rounded-lg" />
            </div>
            {/* Tutor avatar + name (only when not showing progress) */}
            {!showProgress && (
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <Skeleton className="h-4 w-24 rounded-lg" />
              </div>
            )}
            {/* Bottom row */}
            <div className="flex items-center justify-between mt-auto">
              {showProgress ? (
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-12 rounded-lg" />
                    <Skeleton className="h-4 w-10 rounded-lg" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-lg" />
                </>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
