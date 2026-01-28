/**
 * Dynamic imports for heavy components
 * Improves initial page load performance by code-splitting
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Type definitions for component props
type PropertyGalleryProps = {
  images: string[];
  title: string;
  className?: string;
};

type BookingWidgetProps = {
  property: any;
};

type ReviewListProps = {
  reviews: any[];
  averageRating: number;
  totalReviews: number;
};

type ReviewFormProps = {
  propertyId: string;
  onSuccess?: () => void;
};

type PropertyFormProps = {
  property?: any;
  onSuccess?: (property: any) => void;
  onCancel?: () => void;
};

type SearchFiltersProps = {
  initialFilters: any;
};

type NotificationListProps = {
  notifications: any[];
};

// Dynamically imported components
export const DynamicPropertyGallery: ComponentType<PropertyGalleryProps> = dynamic(
  () => import('@/components/property/PropertyGallery').then((mod) => mod.PropertyGallery),
  {
    ssr: false, // Gallery has interactive features, can be client-only
  }
);

export const DynamicBookingWidget: ComponentType<BookingWidgetProps> = dynamic(
  () => import('@/components/booking/BookingWidget').then((mod) => mod.BookingWidget),
  {
    ssr: false, // Booking widget is interactive, can be client-only
  }
);

export const DynamicReviewList: ComponentType<ReviewListProps> = dynamic(
  () => import('@/components/review/ReviewList').then((mod) => mod.ReviewList),
  {
    ssr: true,
  }
);

export const DynamicReviewForm: ComponentType<ReviewFormProps> = dynamic(
  () => import('@/components/review/ReviewForm').then((mod) => mod.ReviewForm),
  {
    ssr: false, // Form is interactive, can be client-only
  }
);

export const DynamicPropertyForm: ComponentType<PropertyFormProps> = dynamic(
  () => import('@/components/property/PropertyForm').then((mod) => mod.PropertyForm),
  {
    ssr: false, // Form is interactive, can be client-only
  }
);

export const DynamicSearchFilters: ComponentType<SearchFiltersProps> = dynamic(
  () => import('@/components/search/SearchFilters').then((mod) => mod.SearchFilters),
  {
    ssr: false, // Filters are interactive, can be client-only
  }
);

export const DynamicNotificationList: ComponentType<NotificationListProps> = dynamic(
  () => import('@/components/notification/NotificationList').then((mod) => mod.NotificationList),
  {
    ssr: false,
  }
);
