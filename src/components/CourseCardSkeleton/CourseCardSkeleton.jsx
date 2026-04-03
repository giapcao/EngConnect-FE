import { Card, CardBody, Skeleton } from "@heroui/react";

export default function CourseCardSkeleton({
  count = 4,
  gridClassName = "grid sm:grid-cols-2 lg:grid-cols-4 gap-6",
  cardBgColor,
}) {
  return (
    <div className={gridClassName}>
      {[...Array(count)].map((_, i) => (
        <Card
          key={i}
          shadow="none"
          className="h-full"
          style={cardBgColor ? { backgroundColor: cardBgColor } : undefined}
        >
          <div className="p-3">
            <Skeleton className="w-full h-40 rounded-xl" />
          </div>
          <CardBody className="px-4 pb-4 pt-0 space-y-3">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-full rounded-lg" />
            <Skeleton className="h-3 w-2/3 rounded-lg" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-4 w-12 rounded-lg" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
