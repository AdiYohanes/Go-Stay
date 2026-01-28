"use client";

import { cn } from "@/lib/utils";

/**
 * Spinner component with rotation animation
 * Requirements: 7.4, 7.6
 */

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-primary border-t-transparent",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Full page spinner for page-level loading states
 */
interface PageSpinnerProps {
  message?: string;
}

export function PageSpinner({ message = "Loading..." }: PageSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="xl" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

/**
 * Inline spinner for button loading states
 */
interface ButtonSpinnerProps {
  className?: string;
}

export function ButtonSpinner({ className = "" }: ButtonSpinnerProps) {
  return <Spinner size="sm" className={cn("mr-2", className)} />;
}
