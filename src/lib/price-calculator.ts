/**
 * Price calculation utilities for the hotel booking system
 * Requirements: 2.3
 */

import { BookingPriceCalculation } from '@/types/booking.types';

/**
 * Calculates the number of nights between two dates
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @returns Number of nights
 */
export function calculateNights(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / millisecondsPerDay);
}

/**
 * Calculates the complete booking price breakdown
 * @param pricePerNight Nightly rate for the property
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @returns BookingPriceCalculation with nights, subtotal, service fee, and total
 */
export function calculateBookingPrice(
  pricePerNight: number,
  startDate: Date,
  endDate: Date
): BookingPriceCalculation {
  // Calculate number of nights
  const nights = calculateNights(startDate, endDate);

  // Calculate subtotal (nights × nightly rate)
  const subtotal = nights * pricePerNight;

  // Calculate service fee (10% of subtotal)
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;

  // Calculate total price and round to 2 decimal places
  const total = Math.round((subtotal + serviceFee) * 100) / 100;

  return {
    nights,
    nightly_rate: pricePerNight,
    subtotal,
    service_fee: serviceFee,
    total,
  };
}
