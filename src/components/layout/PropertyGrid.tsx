/**
 * PropertyGrid component for responsive property card layout
 * Requirements: 8.5
 *
 * Responsive columns:
 * - Width < 640px: 1 column
 * - Width 640-767px: 2 columns
 * - Width 768-1023px: 3 columns
 * - Width 1024-1279px: 4 columns
 * - Width 1280-1535px: 5 columns
 * - Width >= 1536px: 6 columns
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PropertyGridProps {
  children: ReactNode;
  className?: string;
  /** Gap between grid items (in Tailwind spacing units) */
  gap?: "sm" | "md" | "lg";
}

const gapClasses = {
  sm: "gap-4 gap-y-6",
  md: "gap-6 gap-y-8",
  lg: "gap-8 gap-y-10",
};

export function PropertyGrid({
  children,
  className,
  gap = "md",
}: PropertyGridProps) {
  return (
    <div
      className={cn(
        "grid",
        // Responsive columns: 1 → 2 → 3 → 4 → 5 → 6
        "grid-cols-1",
        "sm:grid-cols-2",
        "md:grid-cols-3",
        "lg:grid-cols-4",
        "xl:grid-cols-5",
        "2xl:grid-cols-6",
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface PropertyGridItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Optional wrapper for grid items with consistent styling
 */
export function PropertyGridItem({
  children,
  className,
}: PropertyGridItemProps) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

interface PropertyGridSkeletonProps {
  count?: number;
  className?: string;
  gap?: "sm" | "md" | "lg";
}

/**
 * Skeleton loader for PropertyGrid
 * Renders placeholder items while loading
 */
export function PropertyGridSkeleton({
  count = 12,
  className,
  gap = "md",
}: PropertyGridSkeletonProps) {
  return (
    <PropertyGrid className={className} gap={gap}>
      {Array.from({ length: count }).map((_, index) => (
        <PropertyGridSkeletonItem key={index} />
      ))}
    </PropertyGrid>
  );
}

function PropertyGridSkeletonItem() {
  return (
    <div className="w-full animate-pulse">
      {/* Image skeleton - 4:3 aspect ratio */}
      <div className="aspect-[4/3] rounded-xl bg-muted" />
      {/* Content skeleton */}
      <div className="mt-3 space-y-2">
        {/* Title and rating */}
        <div className="flex justify-between items-start">
          <div className="h-4 w-3/4 rounded-md bg-muted" />
          <div className="h-4 w-10 rounded-md bg-muted" />
        </div>
        {/* Location */}
        <div className="h-3.5 w-1/2 rounded-md bg-muted" />
        {/* Property type */}
        <div className="h-3.5 w-2/3 rounded-md bg-muted" />
        {/* Price */}
        <div className="h-4 w-24 rounded-md bg-muted pt-1" />
      </div>
    </div>
  );
}

interface EmptyGridStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Empty state component for when no properties are found
 */
export function EmptyGridState({
  title = "No properties found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  action,
  className,
}: EmptyGridStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}
