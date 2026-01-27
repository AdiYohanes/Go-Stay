/**
 * Unit tests for price calculation utilities
 * Requirements: 2.3
 */

import { describe, it, expect } from 'vitest';
import { calculateNights, calculateBookingPrice } from '@/lib/price-calculator';

describe('Price Calculator', () => {
  describe('calculateNights', () => {
    it('should calculate correct number of nights for single night', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');
      expect(calculateNights(startDate, endDate)).toBe(1);
    });

    it('should calculate correct number of nights for multiple nights', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-05');
      expect(calculateNights(startDate, endDate)).toBe(4);
    });

    it('should calculate correct number of nights for week-long stay', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-08');
      expect(calculateNights(startDate, endDate)).toBe(7);
    });
  });

  describe('calculateBookingPrice', () => {
    it('should calculate correct price for single night', () => {
      const pricePerNight = 100;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');

      const result = calculateBookingPrice(pricePerNight, startDate, endDate);

      expect(result.nights).toBe(1);
      expect(result.nightly_rate).toBe(100);
      expect(result.subtotal).toBe(100);
      expect(result.service_fee).toBe(10); // 10% of 100
      expect(result.total).toBe(110);
    });

    it('should calculate correct price for multiple nights', () => {
      const pricePerNight = 150;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-04');

      const result = calculateBookingPrice(pricePerNight, startDate, endDate);

      expect(result.nights).toBe(3);
      expect(result.nightly_rate).toBe(150);
      expect(result.subtotal).toBe(450);
      expect(result.service_fee).toBe(45); // 10% of 450
      expect(result.total).toBe(495);
    });

    it('should round service fee to 2 decimal places', () => {
      const pricePerNight = 123.45;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');

      const result = calculateBookingPrice(pricePerNight, startDate, endDate);

      expect(result.nights).toBe(2);
      expect(result.subtotal).toBe(246.9);
      expect(result.service_fee).toBe(24.69); // 10% of 246.9, rounded
      expect(result.total).toBe(271.59);
    });

    it('should handle week-long booking', () => {
      const pricePerNight = 200;
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-08');

      const result = calculateBookingPrice(pricePerNight, startDate, endDate);

      expect(result.nights).toBe(7);
      expect(result.subtotal).toBe(1400);
      expect(result.service_fee).toBe(140); // 10% of 1400
      expect(result.total).toBe(1540);
    });
  });
});
