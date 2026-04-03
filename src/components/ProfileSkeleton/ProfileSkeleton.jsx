import { Card, CardBody, Skeleton } from "@heroui/react";
import { useThemeColors } from "../../hooks/useThemeColors";

export default function ProfileSkeleton() {
  const colors = useThemeColors();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40 rounded-lg mb-2" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>

      {/* Profile Card */}
      <Card
        shadow="none"
        className="border-none"
        style={{ backgroundColor: colors.background.light }}
      >
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />

            {/* Info */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <Skeleton className="h-7 w-48 rounded-lg" />
              <Skeleton className="h-4 w-56 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-lg" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="text-center p-3 rounded-xl"
                  style={{ backgroundColor: colors.background.gray }}
                >
                  <Skeleton className="w-6 h-6 rounded-full mx-auto mb-1" />
                  <Skeleton className="h-6 w-8 rounded-lg mx-auto mb-1" />
                  <Skeleton className="h-3 w-16 rounded-lg mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Card
        shadow="none"
        className="border-none rounded-full"
        style={{ backgroundColor: colors.background.light }}
      >
        <CardBody className="p-4">
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-full" />
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Form Fields */}
      <Card
        shadow="none"
        className="border-none"
        style={{ backgroundColor: colors.background.light }}
      >
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
