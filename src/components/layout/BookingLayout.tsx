/**
 * BookingLayout component for responsive booking page layout
 * Requirements: 8.6
 *
 * Features:
 * - Sticky footer on mobile (width < 768px)
 * - Sidebar on desktop (width >= 768px)
 * - Smooth transitions between layouts
 */

"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BookingLayoutProps {
  /** Main content area (property details, reviews, etc.) */
  children: ReactNode;
  /** Sidebar/footer content (booking widget) */
  sidebar: ReactNode;
  /** Additional class names for the container */
  className?: string;
  /** Whether to show the mobile footer */
  showMobileFooter?: boolean;
}

export function BookingLayout({
  children,
  sidebar,
  className,
  showMobileFooter = true,
}: BookingLayoutProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Main layout container */}
      <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12">
        {/* Main content area */}
        <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>

        {/* Desktop sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-full md:w-[340px] lg:w-[380px] xl:w-[420px] shrink-0">
          <div className="sticky top-24">{sidebar}</div>
        </aside>
      </div>

      {/* Mobile sticky footer - Visible only on mobile */}
      {showMobileFooter && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden z-40">
          <MobileBookingFooter>{sidebar}</MobileBookingFooter>
        </div>
      )}
    </div>
  );
}

interface MobileBookingFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mobile sticky footer wrapper with proper styling
 */
function MobileBookingFooter({
  children,
  className,
}: MobileBookingFooterProps) {
  return (
    <div
      className={cn(
        "bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
        "p-4 safe-area-inset-bottom",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface BookingLayoutSectionProps {
  children: ReactNode;
  className?: string;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Whether to show a divider after this section */
  divider?: boolean;
}

/**
 * Section wrapper for consistent spacing and dividers
 */
export function BookingLayoutSection({
  children,
  className,
  title,
  description,
  divider = true,
}: BookingLayoutSectionProps) {
  return (
    <section className={cn("py-6 md:py-8", className)}>
      {(title || description) && (
        <div className="mb-4 md:mb-6">
          {title && (
            <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
      {divider && <div className="border-b mt-6 md:mt-8" />}
    </section>
  );
}

interface CompactBookingWidgetProps {
  /** Price per night */
  pricePerNight: number;
  /** Currency symbol */
  currency?: string;
  /** Rating value */
  rating?: number | null;
  /** Number of reviews */
  reviewCount?: number;
  /** Action button content */
  actionButton: ReactNode;
  className?: string;
}

/**
 * Compact booking widget for mobile footer
 * Shows price and action button in a condensed format
 */
export function CompactBookingWidget({
  pricePerNight,
  currency = "$",
  rating,
  reviewCount,
  actionButton,
  className,
}: CompactBookingWidgetProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold">
            {currency}
            {pricePerNight.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">night</span>
        </div>
        {rating !== null && rating !== undefined && (
          <div className="flex items-center gap-1 text-sm">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-medium">{rating.toFixed(2)}</span>
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="text-muted-foreground">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>
        )}
      </div>
      <div className="shrink-0">{actionButton}</div>
    </div>
  );
}

interface TwoColumnLayoutProps {
  /** Left column content */
  left: ReactNode;
  /** Right column content */
  right: ReactNode;
  /** Gap between columns */
  gap?: "sm" | "md" | "lg";
  /** Whether to reverse order on mobile */
  reverseOnMobile?: boolean;
  className?: string;
}

const gapClasses = {
  sm: "gap-4 md:gap-6",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
};

/**
 * Generic two-column layout for various booking page sections
 */
export function TwoColumnLayout({
  left,
  right,
  gap = "md",
  reverseOnMobile = false,
  className,
}: TwoColumnLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row",
        gapClasses[gap],
        reverseOnMobile && "flex-col-reverse md:flex-row",
        className,
      )}
    >
      <div className="flex-1 min-w-0">{left}</div>
      <div className="flex-1 min-w-0">{right}</div>
    </div>
  );
}
