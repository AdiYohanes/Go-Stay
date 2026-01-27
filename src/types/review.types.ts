/**
 * Review type definitions for the hotel booking system
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { Profile } from "./booking.types";

export interface Review {
  id: string;
  property_id: string;
  user_id: string;
  booking_id?: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUser extends Review {
  user: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

export interface CreateReviewInput {
  property_id: string;
  booking_id?: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface PropertyRating {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
