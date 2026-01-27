/**
 * Property type definitions for the hotel booking system
 * Requirements: 1.1, 1.3, 1.4, 1.6
 */

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price_per_night: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image_urls: string[];
  amenities: string[];
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number | null;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price_per_night: number;
  location: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
}

export interface PropertyFilters {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
}

export interface PropertyWithAvailability extends Property {
  isAvailable: boolean;
  conflictingDates?: { start: string; end: string }[];
}
