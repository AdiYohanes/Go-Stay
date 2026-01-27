/**
 * Search type definitions for the hotel booking system
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

import { Property } from "./property.types";

export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest";

export interface SearchParams {
  query?: string;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: SortOption;
}

export interface SearchResult {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface AvailabilityCheck {
  property_id: string;
  start_date: Date;
  end_date: Date;
}

export interface AvailabilityResult {
  available: boolean;
  conflicting_dates?: { start: string; end: string }[];
}
