/**
 * Cart type definitions for the hotel booking system
 * Supports multi-property reservation workflow
 */

import { Property } from "./property.types";
import { BookingPriceCalculation } from "./booking.types";

export interface CartItem {
  id: string;
  user_id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithDetails extends CartItem {
  property: Pick<
    Property,
    "id" | "title" | "location" | "image_urls" | "price_per_night" | "max_guests"
  >;
  pricing: BookingPriceCalculation;
  isAvailable: boolean;
}

export interface Cart {
  items: CartItemWithDetails[];
  summary: CartSummary;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  totalServiceFee: number;
  total: number;
  allAvailable: boolean;
}

export interface AddToCartInput {
  property_id: string;
  check_in: Date;
  check_out: Date;
  guests: number;
}

export interface UpdateCartItemInput {
  check_in?: Date;
  check_out?: Date;
  guests?: number;
}
