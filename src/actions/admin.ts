/**
 * Server actions for admin dashboard
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction, ActionResult } from '@/lib/action-utils';
import { AuthorizationError, NotFoundError } from '@/lib/errors';
import { Booking, BookingWithDetails, BookingStatus } from '@/types/booking.types';
import { Property } from '@/types/property.types';
import { PaymentIntent } from '@/types/payment.types';
import { Database } from '@/types/database.types';

type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

/**
 * Helper function to check if user is admin
 */
async function checkAdminAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new AuthorizationError('Authentication required');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile as { role: string }).role !== 'admin') {
    throw new AuthorizationError('Admin access required');
  }

  return user;
}

/**
 * Dashboard metrics interface
 */
export interface DashboardMetrics {
  totalBookings: number;
  totalRevenue: number;
  totalProperties: number;
  activeProperties: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

/**
 * Get dashboard metrics
 * Requirements: 5.1
 */
export async function getDashboardMetrics(): Promise<ActionResult<DashboardMetrics>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    // Get total bookings count
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Get total revenue (sum of confirmed and completed bookings)
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('total_price')
      .in('status', ['confirmed', 'completed']);

    const totalRevenue = (revenueData || []).reduce(
      (sum, booking) => sum + ((booking as { total_price: number }).total_price || 0),
      0
    );

    // Get total properties count
    const { count: totalProperties } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    // Get active properties count
    const { count: activeProperties } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get booking counts by status
    const { count: pendingBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: confirmedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');

    const { count: completedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const { count: cancelledBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'cancelled');

    return {
      totalBookings: totalBookings || 0,
      totalRevenue,
      totalProperties: totalProperties || 0,
      activeProperties: activeProperties || 0,
      pendingBookings: pendingBookings || 0,
      confirmedBookings: confirmedBookings || 0,
      completedBookings: completedBookings || 0,
      cancelledBookings: cancelledBookings || 0,
    };
  });
}

/**
 * Admin bookings filter interface
 */
export interface AdminBookingsFilter {
  status?: BookingStatus;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Get admin bookings with filtering
 * Requirements: 5.2
 */
export async function getAdminBookings(
  filters?: AdminBookingsFilter
): Promise<ActionResult<{
  bookings: BookingWithDetails[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('bookings')
      .select(`
        *,
        property:properties (
          id,
          title,
          location,
          image_urls,
          price_per_night
        ),
        user:profiles (
          id,
          email,
          full_name
        )
      `, { count: 'exact' });

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.propertyId) {
      query = query.eq('property_id', filters.propertyId);
    }

    if (filters?.startDate) {
      query = query.gte('start_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('end_date', filters.endDate);
    }

    // Apply pagination and ordering
    const { data: bookings, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching admin bookings:', error);
      throw new Error('Failed to fetch bookings');
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      bookings: (bookings || []) as unknown as BookingWithDetails[],
      total,
      page,
      totalPages,
      hasMore,
    };
  });
}

/**
 * Get admin properties with pagination
 * Requirements: 5.4
 */
export async function getAdminProperties(params?: {
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}): Promise<ActionResult<{
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const includeInactive = params?.includeInactive ?? true; // Admin sees all by default
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Filter by active status if specified
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    // Apply pagination and ordering
    const { data: properties, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching admin properties:', error);
      throw new Error('Failed to fetch properties');
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      properties: (properties || []) as Property[],
      total,
      page,
      totalPages,
      hasMore,
    };
  });
}

/**
 * Update booking status (admin only)
 * Requirements: 5.3
 */
export async function updateBookingStatusAdmin(
  bookingId: string,
  status: BookingStatus
): Promise<ActionResult<Booking>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    // Check if booking exists
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .single();

    if (!existingBooking) {
      throw new NotFoundError('Booking');
    }

    // Prepare update data
    const updateData: BookingUpdate = {
      status,
      updated_at: new Date().toISOString()
    };

    // Update booking status
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData as unknown as never)
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError || !booking) {
      console.error('Error updating booking:', updateError);
      throw new Error('Failed to update booking status');
    }

    return booking as Booking;
  });
}

/**
 * Get admin payments overview
 * Requirements: 5.4
 */
export async function getAdminPayments(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{
  payments: PaymentIntent[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('payments')
      .select('*', { count: 'exact' });

    // Filter by status if specified
    if (params?.status) {
      query = query.eq('status', params.status);
    }

    // Apply pagination and ordering
    const { data: payments, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching admin payments:', error);
      throw new Error('Failed to fetch payments');
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      payments: (payments || []) as PaymentIntent[],
      total,
      page,
      totalPages,
      hasMore,
    };
  });
}

/**
 * Booking trend data point
 */
export interface BookingTrendDataPoint {
  date: string;
  count: number;
}

/**
 * Get booking trends over time
 * Requirements: 5.5
 */
export async function getBookingTrends(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<ActionResult<BookingTrendDataPoint[]>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    const groupBy = params?.groupBy || 'day';
    const endDate = params?.endDate || new Date().toISOString().split('T')[0];
    
    // Default to last 30 days if no start date provided
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const startDate = params?.startDate || defaultStartDate.toISOString().split('T')[0];

    // Fetch bookings within date range
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching booking trends:', error);
      throw new Error('Failed to fetch booking trends');
    }

    // Group bookings by date
    const trendMap = new Map<string, number>();

    (bookings || []).forEach((booking) => {
      const createdAt = new Date((booking as { created_at: string }).created_at);
      let dateKey: string;

      switch (groupBy) {
        case 'week': {
          // Get the Monday of the week
          const monday = new Date(createdAt);
          monday.setDate(createdAt.getDate() - createdAt.getDay() + 1);
          dateKey = monday.toISOString().split('T')[0];
          break;
        }
        case 'month': {
          dateKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-01`;
          break;
        }
        case 'day':
        default: {
          dateKey = createdAt.toISOString().split('T')[0];
          break;
        }
      }

      trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1);
    });

    // Convert map to array and sort by date
    const trends: BookingTrendDataPoint[] = Array.from(trendMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return trends;
  });
}

/**
 * Revenue statistics interface
 */
export interface RevenueStats {
  totalRevenue: number;
  revenueByPeriod: {
    period: string;
    revenue: number;
  }[];
  averageBookingValue: number;
  revenueGrowth?: number; // Percentage growth compared to previous period
}

/**
 * Get revenue statistics
 * Requirements: 5.5
 */
export async function getRevenueStats(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}): Promise<ActionResult<RevenueStats>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    const groupBy = params?.groupBy || 'month';
    const endDate = params?.endDate || new Date().toISOString().split('T')[0];
    
    // Default to last 12 months if no start date provided
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 12);
    const startDate = params?.startDate || defaultStartDate.toISOString().split('T')[0];

    // Fetch confirmed and completed bookings within date range
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('created_at, total_price')
      .in('status', ['confirmed', 'completed'])
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching revenue stats:', error);
      throw new Error('Failed to fetch revenue statistics');
    }

    // Calculate total revenue
    const totalRevenue = (bookings || []).reduce(
      (sum, booking) => sum + ((booking as { total_price: number }).total_price || 0),
      0
    );

    // Calculate average booking value
    const averageBookingValue = bookings && bookings.length > 0
      ? totalRevenue / bookings.length
      : 0;

    // Group revenue by period
    const revenueMap = new Map<string, number>();

    (bookings || []).forEach((booking) => {
      const bookingTyped = booking as { created_at: string; total_price: number };
      const createdAt = new Date(bookingTyped.created_at);
      let periodKey: string;

      switch (groupBy) {
        case 'week': {
          // Get the Monday of the week
          const monday = new Date(createdAt);
          monday.setDate(createdAt.getDate() - createdAt.getDay() + 1);
          periodKey = monday.toISOString().split('T')[0];
          break;
        }
        case 'month': {
          periodKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
          break;
        }
        case 'day':
        default: {
          periodKey = createdAt.toISOString().split('T')[0];
          break;
        }
      }

      revenueMap.set(periodKey, (revenueMap.get(periodKey) || 0) + (bookingTyped.total_price || 0));
    });

    // Convert map to array and sort by period
    const revenueByPeriod = Array.from(revenueMap.entries())
      .map(([period, revenue]) => ({ period, revenue }))
      .sort((a, b) => a.period.localeCompare(b.period));

    // Calculate revenue growth (compare last period to previous period)
    let revenueGrowth: number | undefined;
    if (revenueByPeriod.length >= 2) {
      const lastPeriodRevenue = revenueByPeriod[revenueByPeriod.length - 1].revenue;
      const previousPeriodRevenue = revenueByPeriod[revenueByPeriod.length - 2].revenue;
      
      if (previousPeriodRevenue > 0) {
        revenueGrowth = ((lastPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
      }
    }

    return {
      totalRevenue,
      revenueByPeriod,
      averageBookingValue,
      revenueGrowth,
    };
  });
}

/**
 * Occupancy rate data point
 */
export interface OccupancyRateDataPoint {
  propertyId: string;
  propertyTitle: string;
  totalDays: number;
  bookedDays: number;
  occupancyRate: number; // Percentage (0-100)
}

/**
 * Get occupancy rates for properties
 * Requirements: 5.5
 */
export async function getOccupancyRates(params?: {
  startDate?: string;
  endDate?: string;
  propertyId?: string;
}): Promise<ActionResult<OccupancyRateDataPoint[]>> {
  return safeAction(async () => {
    await checkAdminAccess();
    const supabase = await createClient();

    const endDate = params?.endDate || new Date().toISOString().split('T')[0];
    
    // Default to last 30 days if no start date provided
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const startDate = params?.startDate || defaultStartDate.toISOString().split('T')[0];

    // Calculate total days in the period
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Build properties query
    let propertiesQuery = supabase
      .from('properties')
      .select('id, title')
      .eq('is_active', true);

    if (params?.propertyId) {
      propertiesQuery = propertiesQuery.eq('id', params.propertyId);
    }

    const { data: properties, error: propertiesError } = await propertiesQuery;

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError);
      throw new Error('Failed to fetch properties');
    }

    // Fetch bookings for the period
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('property_id, start_date, end_date')
      .in('status', ['confirmed', 'completed'])
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      throw new Error('Failed to fetch bookings');
    }

    // Calculate occupancy for each property
    const occupancyRates: OccupancyRateDataPoint[] = (properties || []).map((property) => {
      const propertyTyped = property as { id: string; title: string };
      
      // Filter bookings for this property
      const propertyBookings = (bookings || []).filter(
        (booking) => (booking as { property_id: string }).property_id === propertyTyped.id
      );

      // Calculate booked days
      let bookedDays = 0;
      propertyBookings.forEach((booking) => {
        const bookingTyped = booking as { start_date: string; end_date: string };
        const bookingStart = new Date(Math.max(new Date(bookingTyped.start_date).getTime(), start.getTime()));
        const bookingEnd = new Date(Math.min(new Date(bookingTyped.end_date).getTime(), end.getTime()));
        
        if (bookingStart <= bookingEnd) {
          const days = Math.ceil((bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          bookedDays += days;
        }
      });

      // Calculate occupancy rate
      const occupancyRate = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;

      return {
        propertyId: propertyTyped.id,
        propertyTitle: propertyTyped.title,
        totalDays,
        bookedDays,
        occupancyRate: Math.round(occupancyRate * 100) / 100, // Round to 2 decimal places
      };
    });

    return occupancyRates;
  });
}
