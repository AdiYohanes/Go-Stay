/**
 * API route for property management
 * Requirements: 9.1, 9.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { propertySchema } from '@/lib/validations/property';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
import { getCacheHeaders } from '@/lib/cache-headers';

// GET /api/properties - List properties with pagination
const getPropertiesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  location: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validation = getPropertiesSchema.safeParse(params);
    
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

    const { page, limit, location, minPrice, maxPrice } = validation.data;
    const offset = (page - 1) * limit;

    const supabase = await createClient();
    
    // Build query - is_active filter removed until migration is run
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (minPrice !== undefined) {
      query = query.gte('price_per_night', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte('price_per_night', maxPrice);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch properties', code: 'DATABASE_ERROR' },
        { status: 500 }
      );
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json(
      {
        properties: data || [],
        total: count || 0,
        page,
        totalPages,
        hasMore: page < totalPages,
      },
      {
        headers: getCacheHeaders('static'),
      }
    );
  } catch (error) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = propertySchema.safeParse(body);
    
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

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTHENTICATION_ERROR' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    type ProfileData = { role: 'user' | 'admin' };
    const profileData = profile as ProfileData | null;

    if (profileData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied', code: 'AUTHORIZATION_ERROR' },
        { status: 403 }
      );
    }

    // Create property
    const propertyData: Database['public']['Tables']['properties']['Insert'] = {
      ...validation.data,
    };

    const { data, error } = await supabase
      .from('properties')
      // @ts-expect-error - Supabase type inference issue
      .insert([propertyData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create property', code: 'DATABASE_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/properties:', error);
    
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
