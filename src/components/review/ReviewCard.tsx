/**
 * ReviewCard component - Display individual review with user info and rating
 * Requirements: 6.2
 * Shows user avatar, name, date, star rating, and comment with read more
 */

"use client";

import { useState } from "react";
import { ReviewWithUser } from "@/types/review.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: ReviewWithUser;
  className?: string;
}

/**
 * Renders star rating with filled/empty stars
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Gets user initials from full name for avatar fallback
 */
function getInitials(name: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const COMMENT_TRUNCATE_LENGTH = 200;

/**
 * Card component displaying a single review with user info, rating, and comment
 * Includes "Read more" functionality for long comments
 */
export function ReviewCard({ review, className }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const comment = review.comment || "";
  const shouldTruncate = comment.length > COMMENT_TRUNCATE_LENGTH;
  const displayComment =
    isExpanded || !shouldTruncate
      ? comment
      : comment.slice(0, COMMENT_TRUNCATE_LENGTH) + "...";

  const userName = review.user?.full_name || "Anonymous User";
  const userAvatar = review.user?.avatar_url;
  const reviewDate = format(new Date(review.created_at), "MMM d, yyyy");

  return (
    <Card className={cn("border-0 shadow-none", className)}>
      <CardContent className="p-0">
        <div className="space-y-3">
          {/* User info and rating */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">{reviewDate}</p>
              </div>
            </div>
            <StarRating rating={review.rating} />
          </div>

          {/* Comment */}
          {comment && (
            <div className="space-y-2">
              <p className="text-sm text-foreground leading-relaxed">
                {displayComment}
              </p>
              {shouldTruncate && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Show less" : "Read more"}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { StarRating };
