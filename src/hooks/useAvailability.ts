/**
 * React hook for real-time availability checking
 * Requirements: 2.7, 2.8
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AvailabilityResult } from '@/types/search.types';
import { checkAvailabilityClient } from '@/lib/availability';

interface UseAvailabilityOptions {
  propertyId: string;
  startDate: Date | null;
  endDate: Date | null;
  enabled?: boolean;
}

interface UseAvailabilityReturn {
  availability: AvailabilityResult | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for checking property availability in real-time
 * @param options Configuration options for availability checking
 * @returns Availability result, loading state, error, and refetch function
 */
export function useAvailability({
  propertyId,
  startDate,
  endDate,
  enabled = true,
}: UseAvailabilityOptions): UseAvailabilityReturn {
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkAvailability = useCallback(async () => {
    // Don't check if disabled or dates are missing
    if (!enabled || !startDate || !endDate || !propertyId) {
      setAvailability(null);
      return;
    }

    // Validate dates
    if (endDate <= startDate) {
      setAvailability(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkAvailabilityClient(propertyId, startDate, endDate);
      setAvailability(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check availability');
      setError(error);
      setAvailability(null);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, startDate, endDate, enabled]);

  // Check availability when dependencies change
  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  return {
    availability,
    isLoading,
    error,
    refetch: checkAvailability,
  };
}
