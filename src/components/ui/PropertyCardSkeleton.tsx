"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * PropertyCardSkeleton component
 * Requirements: 7.4, 7.6
 *
 * Skeleton loader matching PropertyCard structure
 */

interface PropertyCardSkeletonProps {
  className?: string;
}

export function PropertyCardSkeleton({
  className = "",
}: PropertyCardSkeletonProps) {
  return (
    <div className={className}>
      {/* Image placeholder */}
      <Skeleton className="aspect-square rounded-xl mb-3" />

      {/* Content placeholders */}
      <div className="space-y-2">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2" />

        {/* Amenities */}
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between mt-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of PropertyCardSkeletons for loading states
 */
interface PropertyCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function PropertyCardSkeletonGrid({
  count = 6,
  className = "",
}: PropertyCardSkeletonGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
