"use client";

/**
 * Dynamic imports for heavy components
 * Improves initial page load performance by code-splitting
 * 
 * Note: This file must be a Client Component because it uses
 * next/dynamic with ssr: false option
 */

import dynamic from 'next/dynamic';

// Dynamically imported components with loading states
export const DynamicPropertyGallery = dynamic(
  () => import('@/components/property/PropertyGallery').then((mod) => mod.PropertyGallery),
  {
    ssr: false,
    loading: () => <div className="aspect-[4/3] bg-muted animate-pulse rounded-xl" />,
  }
);

export const DynamicBookingWidget = dynamic(
  () => import('@/components/booking/BookingWidget').then((mod) => mod.BookingWidget),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-muted animate-pulse rounded-xl" />,
  }
);

export const DynamicReviewList = dynamic(
  () => import('@/components/review/ReviewList').then((mod) => mod.ReviewList),
  {
    loading: () => <div className="h-64 bg-muted animate-pulse rounded-xl" />,
  }
);

export const DynamicReviewForm = dynamic(
  () => import('@/components/review/ReviewForm').then((mod) => mod.ReviewForm),
  {
    ssr: false,
    loading: () => <div className="h-48 bg-muted animate-pulse rounded-xl" />,
  }
);

export const DynamicPropertyForm = dynamic(
  () => import('@/components/property/PropertyForm').then((mod) => mod.PropertyForm),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-muted animate-pulse rounded-xl" />,
  }
);

export const DynamicSearchFilters = dynamic(
  () => import('@/components/search/SearchFilters').then((mod) => mod.SearchFilters),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-muted animate-pulse rounded-xl" />,
  }
);

export const DynamicNotificationList = dynamic(
  () => import('@/components/notification/NotificationList').then((mod) => mod.NotificationList),
  {
    ssr: false,
    loading: () => <div className="h-48 bg-muted animate-pulse rounded-xl" />,
  }
);
