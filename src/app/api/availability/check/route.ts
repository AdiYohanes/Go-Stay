/**
 * API route for checking property availability
 * Requirements: 2.7, 2.8
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/availability.server';
import { z } from 'zod';

const checkAvailabilitySchema = z.object({
  property_id: z.string().uuid(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = checkAvailabilitySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { property_id, start_date, end_date } = validation.data;

    // Convert strings to dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Validate date logic
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Check availability
    const result = await checkAvailability(property_id, startDate, endDate);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in availability check API:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
