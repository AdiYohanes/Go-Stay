"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * BookingWidgetSkeleton component
 * Requirements: 7.4, 7.6
 *
 * Skeleton loader matching BookingWidget structure
 */

interface BookingWidgetSkeletonProps {
  className?: string;
}

export function BookingWidgetSkeleton({
  className = "",
}: BookingWidgetSkeletonProps) {
  return (
    <div className={className}>
      {/* Desktop: Sidebar layout */}
      <div className="hidden lg:block">
        <div className="border rounded-lg p-6 shadow-lg">
          <div className="space-y-6">
            {/* Price header */}
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Date picker */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Guest selector */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-3 w-32" />
            </div>

            {/* Reserve button */}
            <Skeleton className="h-11 w-full rounded-md" />

            {/* Price breakdown */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between pt-3 border-t">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
        <div className="p-4 space-y-3">
          {/* Compact date and guest selector */}
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-9 rounded-md" />
            <Skeleton className="h-9 rounded-lg" />
          </div>

          {/* Price and reserve button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-11 flex-1 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
