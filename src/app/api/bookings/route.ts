/**
 * API route for booking management
 * Requirements: 9.1, 9.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { bookingSchema } from '@/lib/validations/booking';
import { createClient } from '@/lib/supabase/server';
import { checkAvailability } from '@/lib/availability.server';
import { calculateBookingPrice } from '@/lib/price-calculator';
import { Database } from '@/types/database.types';
import { getCacheHeaders } from '@/lib/cache-headers';

// GET /api/bookings - List user's bookings
const getBookingsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validation = getBookingsSchema.safeParse(params);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { page, limit, status } = validation.data;
    const offset = (page - 1) * limit;

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_ERROR' },
        { status: 401 }
      );
    }

    // Build query
    let query = supabase
      .from('bookings')
      .select(`
        *,
        property:properties(id, title, location, image_urls, price_per_night)
      `, { count: 'exact' })
      .eq('user_id', user.id);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings', code: 'DATABASE_ERROR' },
        { status: 500 }
      );
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      bookings: data || [],
      total: count || 0,
      page,
      totalPages,
      hasMore: page < totalPages,
    }, {
      headers: getCacheHeaders('user-specific'),
    });
  } catch (error) {
    console.error('Error in GET /api/bookings:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = bookingSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { property_id, start_date, end_date, guests } = validation.data;

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_ERROR' },
        { status: 401 }
      );
    }

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('price_per_night, max_guests')
      .eq('id', property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    type PropertyData = {
      price_per_night: number;
      max_guests: number;
    };

    const propertyData = property as PropertyData;

    // Validate guest count
    if (guests > propertyData.max_guests) {
      return NextResponse.json(
        {
          error: 'Guest count exceeds property capacity',
          code: 'VALIDATION_ERROR',
          details: { guests: [`Maximum ${propertyData.max_guests} guests allowed`] },
        },
        { status: 400 }
      );
    }

    // Check availability
    const availabilityResult = await checkAvailability(
      property_id,
      start_date,
      end_date
    );

    if (!availabilityResult.available) {
      return NextResponse.json(
        {
          error: 'Property is not available for selected dates',
          code: 'CONFLICT',
          details: { conflicting_dates: availabilityResult.conflicting_dates },
        },
        { status: 409 }
      );
    }

    // Calculate pricing
    const pricing = calculateBookingPrice(
      propertyData.price_per_night,
      start_date,
      end_date
    );

    // Create booking
    const bookingData: Database['public']['Tables']['bookings']['Insert'] = {
      property_id,
      user_id: user.id,
      start_date: start_date.toISOString().split('T')[0],
      end_date: end_date.toISOString().split('T')[0],
      guests,
      total_price: pricing.total,
      service_fee: pricing.service_fee,
      status: 'confirmed',
    };

    const { data, error } = await supabase
      .from('bookings')
      // @ts-expect-error - Supabase type inference issue
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create booking', code: 'DATABASE_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/bookings:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
