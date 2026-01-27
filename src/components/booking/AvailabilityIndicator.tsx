/**
 * AvailabilityIndicator component for displaying property availability status
 * Requirements: 2.7, 2.8
 * Reusable across PropertyCard, PropertyDetails, BookingWidget, Cart
 */

"use client";

import { useAvailability } from "@/hooks/useAvailability";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface AvailabilityIndicatorProps {
  propertyId: string;
  startDate: Date | null;
  endDate: Date | null;
  enabled?: boolean;
  showConflictingDates?: boolean;
  variant?: "default" | "compact";
  className?: string;
}

/**
 * Component that displays availability status for a property
 * Shows available/unavailable status with visual feedback
 * Optionally displays conflicting dates when unavailable
 */
export function AvailabilityIndicator({
  propertyId,
  startDate,
  endDate,
  enabled = true,
  showConflictingDates = true,
  variant = "default",
  className = "",
}: AvailabilityIndicatorProps) {
  const { availability, isLoading, error } = useAvailability({
    propertyId,
    startDate,
    endDate,
    enabled,
  });

  // Don't show anything if dates are not selected
  if (!startDate || !endDate) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={className}>
        <Badge variant="outline" className="gap-1.5">
          <AlertCircle className="h-3 w-3" />
          <span>Unable to check availability</span>
        </Badge>
      </div>
    );
  }

  // No availability data yet
  if (!availability) {
    return null;
  }

  // Available
  if (availability.available) {
    return (
      <div className={className}>
        <Badge
          variant="default"
          className="bg-green-600 hover:bg-green-700 gap-1.5"
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Available</span>
        </Badge>
      </div>
    );
  }

  // Unavailable
  return (
    <div className={`${className} space-y-2`}>
      <Badge variant="destructive" className="gap-1.5">
        <XCircle className="h-3 w-3" />
        <span>Not Available</span>
      </Badge>

      {showConflictingDates &&
        availability.conflicting_dates &&
        availability.conflicting_dates.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {variant === "compact" ? (
              <p>Dates conflict with existing bookings</p>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">Conflicting bookings:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {availability.conflicting_dates.map((conflict, index) => (
                    <li key={index}>
                      {format(new Date(conflict.start), "MMM d, yyyy")} -{" "}
                      {format(new Date(conflict.end), "MMM d, yyyy")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
