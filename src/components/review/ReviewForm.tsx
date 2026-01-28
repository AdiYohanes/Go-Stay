/**
 * ReviewForm component - Form for submitting reviews with star rating
 * Requirements: 6.1, 7.6
 * Implements star rating selector with hover preview, comment textarea,
 * character count, validation errors, and submit animation
 */

"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormData } from "@/lib/validations/review";
import { createReview } from "@/actions/review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarIcon, Loader2Icon, CheckCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewFormProps {
  propertyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MAX_COMMENT_LENGTH = 1000;

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

/**
 * Interactive star rating selector with hover preview
 */
function StarRatingSelector({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (rating: number) => void;
  error?: string;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || value;

  return (
    <div className="space-y-2">
      <Label className={cn(error && "text-destructive")}>
        Rating <span className="text-destructive">*</span>
      </Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <StarIcon
              className={cn(
                "h-8 w-8 transition-colors",
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted hover:fill-yellow-200 hover:text-yellow-200",
              )}
            />
          </button>
        ))}
        {displayRating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {ratingLabels[displayRating]}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

/**
 * Form component for submitting property reviews
 * Includes star rating selector, comment textarea with character count,
 * validation errors, and submit animation
 */
export function ReviewForm({
  propertyId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      property_id: propertyId,
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");
  const comment = watch("comment") || "";
  const characterCount = comment.length;

  const onSubmit = (data: ReviewFormData) => {
    startTransition(async () => {
      try {
        const result = await createReview({
          property_id: data.property_id,
          rating: data.rating,
          comment: data.comment || undefined,
        });

        if (result.success) {
          setIsSuccess(true);
          toast.success("Review submitted successfully!");

          // Reset success state and call onSuccess after animation
          setTimeout(() => {
            setIsSuccess(false);
            onSuccess?.();
          }, 1500);
        } else {
          toast.error(result.error || "Failed to submit review");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  // Success state animation
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-lg font-medium">Thank you for your review!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hidden property_id field */}
      <input type="hidden" {...register("property_id")} />

      {/* Star rating selector */}
      <StarRatingSelector
        value={rating}
        onChange={(value) =>
          setValue("rating", value, { shouldValidate: true })
        }
        error={errors.rating?.message}
      />

      {/* Comment textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="comment">Comment (optional)</Label>
          <span
            className={cn(
              "text-xs",
              characterCount > MAX_COMMENT_LENGTH
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {characterCount}/{MAX_COMMENT_LENGTH}
          </span>
        </div>
        <Textarea
          id="comment"
          placeholder="Share your experience with this property..."
          className="min-h-[120px] resize-none"
          {...register("comment")}
          aria-invalid={!!errors.comment}
        />
        {errors.comment && (
          <p className="text-sm text-destructive">{errors.comment.message}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending || rating === 0}>
          {isPending ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
}
