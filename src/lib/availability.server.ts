/**
 * Server-side availability checking utilities for the hotel booking system
 * Requirements: 2.7, 2.8
 */

import { createClient } from '@/lib/supabase/server';
import { AvailabilityResult } from '@/types/search.types';
import { Database } from '@/types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

/**
 * Checks if two date ranges overlap
 * @param start1 Start date of first range
 * @param end1 End date of first range
 * @param start2 Start date of second range
 * @param end2 End date of second range
 * @returns true if the ranges overlap, false otherwise
 */
export function doDateRangesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  // Two ranges overlap if:
  // - start1 is before end2 AND end1 is after start2
  return start1 < end2 && end1 > start2;
}

/**
 * Checks availability of a property for a given date range (SERVER-SIDE ONLY)
 * @param propertyId The property ID to check
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @returns AvailabilityResult with availability status and conflicting dates if unavailable
 */
export async function checkAvailability(
  propertyId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityResult> {
  const supabase = await createClient();

  // Query all confirmed bookings for this property that might overlap
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('property_id', propertyId)
    .in('status', ['confirmed', 'pending'])
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error checking availability:', error);
    throw new Error('Failed to check availability');
  }

  if (!bookings || bookings.length === 0) {
    return { available: true };
  }

  // Check for overlapping bookings
  const conflictingDates: { start: string; end: string }[] = [];

  for (const booking of bookings as Pick<Booking, 'start_date' | 'end_date'>[]) {
    const bookingStart = new Date(booking.start_date);
    const bookingEnd = new Date(booking.end_date);

    if (doDateRangesOverlap(startDate, endDate, bookingStart, bookingEnd)) {
      conflictingDates.push({
        start: booking.start_date,
        end: booking.end_date,
      });
    }
  }

  if (conflictingDates.length > 0) {
    return {
      available: false,
      conflicting_dates: conflictingDates,
    };
  }

  return { available: true };
}
