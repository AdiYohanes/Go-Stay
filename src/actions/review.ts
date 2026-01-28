/**
 * Server actions for review management
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction, ActionResult } from '@/lib/action-utils';
import { 
  reviewSchema, 
  updateReviewSchema, 
  deleteReviewSchema 
} from '@/lib/validations/review';
import { 
  Review, 
  ReviewWithUser, 
  CreateReviewInput,
  UpdateReviewInput,
  PropertyRating 
} from '@/types/review.types';
import { NotFoundError, ConflictError, AuthenticationError, AuthorizationError } from '@/lib/errors';
import { Database } from '@/types/database.types';

type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

/**
 * Checks if a user is eligible to review a property
 * User must have a completed booking at the property
 * @param userId The user ID
 * @param propertyId The property ID
 * @returns True if eligible, throws error otherwise
 */
export async function checkReviewEligibility(
  userId: string,
  propertyId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Check if user has a completed booking at this property
  const { data: completedBookings, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .eq('status', 'completed')
    .limit(1);

  if (error) {
    console.error('Error checking review eligibility:', error);
    throw new Error('Failed to check review eligibility');
  }

  if (!completedBookings || completedBookings.length === 0) {
    throw new AuthorizationError(
      'You can only review properties where you have completed a stay'
    );
  }

  return true;
}

/**
 * Creates a new review for a property
 * @param input Review creation data
 * @returns ActionResult with created review
 */
export async function createReview(
  input: CreateReviewInput
): Promise<ActionResult<Review>> {
  return safeAction(async () => {
    // Validate input
    const validated = reviewSchema.parse(input);

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to create a review');
    }

    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', validated.property_id)
      .single();

    if (propertyError || !property) {
      throw new NotFoundError('Property');
    }

    // Check review eligibility
    await checkReviewEligibility(user.id, validated.property_id);

    // Check if user already reviewed this property
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', validated.property_id)
      .maybeSingle();

    if (existingReview) {
      throw new ConflictError('You have already reviewed this property');
    }

    // Prepare insert data
    const insertData: ReviewInsert = {
      property_id: validated.property_id,
      user_id: user.id,
      rating: validated.rating,
      comment: input.comment || null,
    };

    // Create review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([insertData] as unknown as never)
      .select()
      .single();

    if (reviewError || !review) {
      console.error('Error creating review:', reviewError);
      throw new Error('Failed to create review');
    }

    return review as Review;
  });
}

/**
 * Retrieves all reviews for a property with user details
 * @param propertyId The property ID
 * @returns ActionResult with array of reviews with user details
 */
export async function getPropertyReviews(
  propertyId: string
): Promise<ActionResult<ReviewWithUser[]>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get all reviews for this property with user details
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      throw new Error('Failed to fetch reviews');
    }

    return (reviews || []) as unknown as ReviewWithUser[];
  });
}

/**
 * Updates an existing review
 * Preserves the original created_at timestamp
 * @param reviewId The review ID
 * @param input Update data
 * @returns ActionResult with updated review
 */
export async function updateReview(
  reviewId: string,
  input: UpdateReviewInput
): Promise<ActionResult<Review>> {
  return safeAction(async () => {
    // Validate input
    const validated = updateReviewSchema.parse({ review_id: reviewId, ...input });

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to update reviews');
    }

    // Get the review to verify ownership
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id, created_at')
      .eq('id', validated.review_id)
      .single();

    if (fetchError || !existingReview) {
      throw new NotFoundError('Review');
    }

    // Type assertion for review fields
    const reviewData = existingReview as {
      user_id: string;
      created_at: string;
    };

    // Check if user owns this review
    if (reviewData.user_id !== user.id) {
      throw new AuthorizationError('You can only update your own reviews');
    }

    // Prepare update data (preserving created_at)
    const updateData: ReviewUpdate = {
      updated_at: new Date().toISOString()
    };

    if (input.rating !== undefined) {
      updateData.rating = input.rating;
    }

    if (input.comment !== undefined) {
      updateData.comment = input.comment || null;
    }

    // Update review
    const { data: review, error: updateError } = await supabase
      .from('reviews')
      .update(updateData as unknown as never)
      .eq('id', validated.review_id)
      .select()
      .single();

    if (updateError || !review) {
      console.error('Error updating review:', updateError);
      throw new Error('Failed to update review');
    }

    return review as Review;
  });
}

/**
 * Deletes a review
 * @param reviewId The review ID to delete
 * @returns ActionResult with success status
 */
export async function deleteReview(
  reviewId: string
): Promise<ActionResult<{ success: boolean }>> {
  return safeAction(async () => {
    // Validate input
    const validated = deleteReviewSchema.parse({ review_id: reviewId });

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to delete reviews');
    }

    // Get the review to verify ownership
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', validated.review_id)
      .single();

    if (fetchError || !existingReview) {
      throw new NotFoundError('Review');
    }

    // Type assertion for review fields
    const reviewData = existingReview as {
      user_id: string;
    };

    // Check if user owns this review or is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userProfile = profile as { role: string } | null;

    if (reviewData.user_id !== user.id && userProfile?.role !== 'admin') {
      throw new AuthorizationError('You can only delete your own reviews');
    }

    // Delete review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', validated.review_id);

    if (deleteError) {
      console.error('Error deleting review:', deleteError);
      throw new Error('Failed to delete review');
    }

    return { success: true };
  });
}

/**
 * Calculates the average rating and distribution for a property
 * @param propertyId The property ID
 * @returns ActionResult with property rating statistics
 */
export async function calculatePropertyRating(
  propertyId: string
): Promise<ActionResult<PropertyRating>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get all reviews for this property
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('property_id', propertyId);

    if (reviewsError) {
      console.error('Error fetching reviews for rating:', reviewsError);
      throw new Error('Failed to calculate property rating');
    }

    if (!reviews || reviews.length === 0) {
      return {
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    // Calculate average
    const totalRating = reviews.reduce((sum, review) => {
      const reviewData = review as { rating: number };
      return sum + reviewData.rating;
    }, 0);
    const average = totalRating / reviews.length;

    // Calculate distribution
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    reviews.forEach((review) => {
      const reviewData = review as { rating: 1 | 2 | 3 | 4 | 5 };
      distribution[reviewData.rating]++;
    });

    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal place
      count: reviews.length,
      distribution
    };
  });
}
