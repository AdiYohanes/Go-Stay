/**
 * API route for review management
 * Requirements: 9.1, 9.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reviewSchema } from '@/lib/validations/review';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
import { getCacheHeaders } from '@/lib/cache-headers';

// GET /api/reviews - List reviews for a property
const getReviewsSchema = z.object({
  property_id: z.string().uuid(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validation = getReviewsSchema.safeParse(params);
    
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

    const { property_id, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    const supabase = await createClient();
    
    // Build query
    const query = supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(id, full_name, avatar_url)
      `, { count: 'exact' })
      .eq('property_id', property_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews', code: 'DATABASE_ERROR' },
        { status: 500 }
      );
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      reviews: data || [],
      total: count || 0,
      page,
      totalPages,
      hasMore: page < totalPages,
    }, {
      headers: getCacheHeaders('static'),
    });
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = reviewSchema.safeParse(body);
    
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

    const { property_id, rating, comment } = validation.data;

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_ERROR' },
        { status: 401 }
      );
    }

    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user has completed booking at this property
    const { data: completedBooking, error: bookingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', property_id)
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .limit(1)
      .maybeSingle();

    if (bookingError) {
      console.error('Database error:', bookingError);
      return NextResponse.json(
        { error: 'Failed to verify booking eligibility', code: 'DATABASE_ERROR' },
        { status: 500 }
      );
    }

    type BookingData = { id: string };
    const booking = completedBooking as BookingData | null;

    if (!booking) {
      return NextResponse.json(
        {
          error: 'You must complete a stay at this property before leaving a review',
          code: 'REVIEW_INELIGIBLE',
        },
        { status: 403 }
      );
    }

    // Check if user already reviewed this property
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('property_id', property_id)
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        {
          error: 'You have already reviewed this property',
          code: 'DUPLICATE_REVIEW',
        },
        { status: 409 }
      );
    }

    // Create review
    const reviewData: Database['public']['Tables']['reviews']['Insert'] = {
      property_id,
      user_id: user.id,
      booking_id: booking.id,
      rating,
      comment: comment || null,
    };

    const { data, error } = await supabase
      .from('reviews')
      // @ts-expect-error - Supabase type inference issue
      .insert([reviewData])
      .select(`
        *,
        user:profiles(id, full_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create review', code: 'DATABASE_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    
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
