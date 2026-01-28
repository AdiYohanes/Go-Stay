import { cn } from "@/lib/utils";

/**
 * Skeleton component with shimmer animation
 * Requirements: 7.4, 7.6
 */

interface SkeletonProps extends React.ComponentProps<"div"> {
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-accent rounded-md",
        shimmer && "animate-pulse relative overflow-hidden",
        shimmer &&
          "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-linear-to-r after:from-transparent after:via-white/20 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
