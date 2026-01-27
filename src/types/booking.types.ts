/**
 * Booking type definitions for the hotel booking system
 * Requirements: 2.1, 2.3, 2.4, 2.5, 2.6
 */

import { Property } from "./property.types";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;
  property_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  service_fee: number;
  status: BookingStatus;
  special_requests?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url?: string | null;
  role: "user" | "admin";
}

export interface BookingWithDetails extends Booking {
  property: Pick<
    Property,
    "id" | "title" | "location" | "image_urls" | "price_per_night"
  >;
  user: Pick<Profile, "id" | "email" | "full_name">;
}

export interface CreateBookingInput {
  property_id: string;
  start_date: Date;
  end_date: Date;
  guests: number;
  special_requests?: string;
}

export interface BookingPriceCalculation {
  nights: number;
  nightly_rate: number;
  subtotal: number;
  service_fee: number;
  total: number;
}

export interface BookingDateRange {
  start_date: string;
  end_date: string;
}
