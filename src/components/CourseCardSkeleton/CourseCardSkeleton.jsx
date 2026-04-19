import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";

export default function CourseCardSkeleton({
  count = 4,
  gridClassName = "grid sm:grid-cols-2 lg:grid-cols-4 gap-6",
  cardBgColor,
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          shadow="none"
          className="h-full"
          style={cardBgColor ? { backgroundColor: cardBgColor } : undefined}
        >
          {/* Thumbnail */}
          <div className="p-3">
            <Skeleton className="w-full h-40 rounded-xl" />
          </div>
          <CardBody className="p-4 pt-0 space-y-3">
            {/* Level chip */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            {/* Title */}
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/5 rounded-lg" />
            {/* Tutor avatar + name */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
            {/* Rating, students, duration */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-12 rounded-lg" />
              <Skeleton className="h-4 w-10 rounded-lg" />
              <Skeleton className="h-4 w-14 rounded-lg" />
            </div>
          </CardBody>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
