/**
 * ReviewList component - Display reviews with rating summary and pagination
 * Requirements: 6.2, 6.3, 7.1
 * Shows average rating with distribution chart, lists reviews with
 * staggered animations, and includes load more pagination
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewWithUser, PropertyRating } from "@/types/review.types";
import { getPropertyReviews, calculatePropertyRating } from "@/actions/review";
import { ReviewCard, StarRating } from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewListProps {
  propertyId: string;
  initialReviews?: ReviewWithUser[];
  initialRating?: PropertyRating;
  pageSize?: number;
  className?: string;
}

const DEFAULT_PAGE_SIZE = 5;

/**
 * Rating distribution bar component
 */
function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-muted-foreground">{star}</span>
      <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-muted-foreground">{count}</span>
    </div>
  );
}

/**
 * Rating summary component with average and distribution
 */
function RatingSummary({ rating }: { rating: PropertyRating }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/30 rounded-lg">
      {/* Average rating */}
      <div className="flex flex-col items-center justify-center sm:min-w-[120px]">
        <span className="text-4xl font-bold">{rating.average.toFixed(1)}</span>
        <StarRating rating={Math.round(rating.average)} />
        <span className="text-sm text-muted-foreground mt-1">
          {rating.count} {rating.count === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Distribution chart */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => (
          <RatingBar
            key={star}
            star={star}
            count={rating.distribution[star as 1 | 2 | 3 | 4 | 5]}
            total={rating.count}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for review cards
 */
function ReviewCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

/**
 * Empty state when no reviews exist
 */
function EmptyState() {
  return (
    <div className="text-center py-8">
      <StarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
      <p className="text-muted-foreground">No reviews yet</p>
      <p className="text-sm text-muted-foreground">
        Be the first to share your experience!
      </p>
    </div>
  );
}

/**
 * List component displaying property reviews with rating summary,
 * staggered animations, and load more pagination
 */
export function ReviewList({
  propertyId,
  initialReviews,
  initialRating,
  pageSize = DEFAULT_PAGE_SIZE,
  className,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>(
    initialReviews || [],
  );
  const [rating, setRating] = useState<PropertyRating | null>(
    initialRating || null,
  );
  const [isLoading, setIsLoading] = useState(!initialReviews);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayCount, setDisplayCount] = useState(pageSize);

  const hasMore = reviews.length > displayCount;
  const displayedReviews = reviews.slice(0, displayCount);

  // Fetch reviews and rating on mount if not provided
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [reviewsResult, ratingResult] = await Promise.all([
        getPropertyReviews(propertyId),
        calculatePropertyRating(propertyId),
      ]);

      if (reviewsResult.success) {
        setReviews(reviewsResult.data);
      }
      if (ratingResult.success) {
        setRating(ratingResult.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (!initialReviews) {
      fetchData();
    }
  }, [initialReviews, fetchData]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay for animation
    setTimeout(() => {
      setDisplayCount((prev) => prev + pageSize);
      setIsLoadingMore(false);
    }, 300);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (reviews.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Rating summary */}
      {rating && rating.count > 0 && <RatingSummary rating={rating} />}

      {/* Reviews list with staggered animation */}
      <div className="space-y-6">
        {displayedReviews.map((review, index) => (
          <div
            key={review.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ReviewCard review={review} />
            {index < displayedReviews.length - 1 && (
              <div className="border-b mt-6" />
            )}
          </div>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Show more reviews (${reviews.length - displayCount} remaining)`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Refresh function to reload reviews (useful after submitting a new review)
 */
export function useRefreshReviews() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { refreshKey, refresh };
}
