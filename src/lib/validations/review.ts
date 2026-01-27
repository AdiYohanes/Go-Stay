import { z } from "zod";

export const reviewSchema = z.object({
  property_id: z.string().uuid("Invalid property ID"),
  rating: z.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters").optional(),
});

export const updateReviewSchema = z.object({
  review_id: z.string().uuid("Invalid review ID"),
  rating: z.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters").optional(),
});

export const deleteReviewSchema = z.object({
  review_id: z.string().uuid("Invalid review ID"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
export type UpdateReviewData = z.infer<typeof updateReviewSchema>;
export type DeleteReviewData = z.infer<typeof deleteReviewSchema>;
