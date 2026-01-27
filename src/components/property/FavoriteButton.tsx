"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  initialIsFavorited?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * FavoriteButton component with heart animation
 * Requirements: Customer favorites feature
 */
export function FavoriteButton({
  propertyId,
  initialIsFavorited = false,
  className,
  size = "md",
}: FavoriteButtonProps) {
  const { isFavorited, isPending, toggleFavorite } = useFavorites(
    propertyId,
    initialIsFavorited,
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to property detail
    e.stopPropagation();
    toggleFavorite();
  };

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "p-2 rounded-full hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        isPending && "opacity-50 cursor-not-allowed",
        className,
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="presentation"
        focusable="false"
        className={cn(
          "block stroke-[2px] overflow-visible transition-all duration-300",
          sizeClasses[size],
          isFavorited
            ? "fill-[#FF385C] stroke-[#FF385C] scale-110"
            : "fill-black/50 stroke-white scale-100",
        )}
      >
        <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z" />
      </svg>
    </button>
  );
}
