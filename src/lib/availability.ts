/**
 * Client-side availability checking utilities for the hotel booking system
 * Requirements: 2.7, 2.8
 */

import { AvailabilityResult } from '@/types/search.types';

/**
 * Client-side version of checkAvailability for use in client components
 * @param propertyId The property ID to check
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @returns AvailabilityResult with availability status and conflicting dates if unavailable
 */
export async function checkAvailabilityClient(
  propertyId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityResult> {
  // This will be called from client components via an API route
  const response = await fetch('/api/availability/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      property_id: propertyId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to check availability');
  }

  return response.json();
}
