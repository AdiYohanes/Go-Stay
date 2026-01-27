/**
 * Server actions for booking management
 * Requirements: 2.4, 2.5, 2.6
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction, ActionResult } from '@/lib/action-utils';
import { 
  bookingSchema, 
  updateBookingStatusSchema, 
  cancelBookingSchema 
} from '@/lib/validations/booking';
import { 
  Booking, 
  BookingWithDetails, 
  CreateBookingInput,
  BookingStatus 
} from '@/types/booking.types';
import { calculateBookingPrice } from '@/lib/price-calculator';
import { checkAvailability } from '@/lib/availability';
import { NotFoundError, ConflictError, AuthenticationError } from '@/lib/errors';
import { Database } from '@/types/database.types';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

/**
 * Creates a new booking for a property
 * @param input Booking creation data
 * @returns ActionResult with created booking
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<ActionResult<Booking>> {
  return safeAction(async () => {
    // Validate input
    const validated = bookingSchema.parse(input);

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to create a booking');
    }

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, price_per_night, max_guests, is_active')
      .eq('id', validated.property_id)
      .single();

    if (propertyError || !property) {
      throw new NotFoundError('Property');
    }

    // Type assertion for property fields
    const propertyData = property as {
      id: string;
      price_per_night: number;
      max_guests: number;
      is_active: boolean;
    };

    if (!propertyData.is_active) {
      throw new ConflictError('This property is no longer available');
    }

    // Validate guest count against property capacity
    if (validated.guests > propertyData.max_guests) {
      throw new ConflictError(
        `This property can accommodate a maximum of ${propertyData.max_guests} guests`
      );
    }

    // Check availability
    const availability = await checkAvailability(
      validated.property_id,
      validated.start_date,
      validated.end_date
    );

    if (!availability.available) {
      throw new ConflictError(
        'This property is not available for the selected dates'
      );
    }

    // Calculate pricing
    const pricing = calculateBookingPrice(
      propertyData.price_per_night,
      validated.start_date,
      validated.end_date
    );

    // Prepare insert data
    const insertData: BookingInsert = {
      property_id: validated.property_id,
      user_id: user.id,
      start_date: validated.start_date.toISOString().split('T')[0],
      end_date: validated.end_date.toISOString().split('T')[0],
      guests: validated.guests,
      total_price: pricing.total,
      service_fee: pricing.service_fee,
      status: 'confirmed',
      special_requests: input.special_requests || null,
    };

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([insertData] as unknown as never)
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('Error creating booking:', bookingError);
      throw new Error('Failed to create booking');
    }

    return booking as Booking;
  });
}

/**
 * Retrieves a single booking by ID with property and user details
 * @param bookingId The booking ID
 * @returns ActionResult with booking details
 */
export async function getBooking(
  bookingId: string
): Promise<ActionResult<BookingWithDetails>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to view bookings');
    }

    // Get booking with property and user details
    const { data: booking, error: bookingError } = await supabase
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
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new NotFoundError('Booking');
    }

    // Type assertion for booking data
    const bookingData = booking as unknown as { user_id: string };

    // Check if user owns this booking or is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userProfile = profile as { role: string } | null;

    if (bookingData.user_id !== user.id && userProfile?.role !== 'admin') {
      throw new AuthenticationError('You do not have permission to view this booking');
    }

    return booking as unknown as BookingWithDetails;
  });
}

/**
 * Retrieves all bookings for the current user
 * @returns ActionResult with array of bookings with details
 */
export async function getUserBookings(): Promise<ActionResult<BookingWithDetails[]>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to view bookings');
    }

    // Get all bookings for this user with property details
    const { data: bookings, error: bookingsError } = await supabase
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
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      throw new Error('Failed to fetch bookings');
    }

    return (bookings || []) as unknown as BookingWithDetails[];
  });
}

/**
 * Updates the status of a booking
 * @param bookingId The booking ID
 * @param status The new status
 * @returns ActionResult with updated booking
 */
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<ActionResult<Booking>> {
  return safeAction(async () => {
    // Validate input
    const validated = updateBookingStatusSchema.parse({ booking_id: bookingId, status });

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to update bookings');
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userProfile = profile as { role: string } | null;

    if (userProfile?.role !== 'admin') {
      throw new AuthenticationError('Only administrators can update booking status');
    }

    // Prepare update data
    const updateData: BookingUpdate = {
      status: validated.status,
      updated_at: new Date().toISOString()
    };

    // Update booking status
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData as unknown as never)
      .eq('id', validated.booking_id)
      .select()
      .single();

    if (updateError || !booking) {
      if (updateError?.code === 'PGRST116') {
        throw new NotFoundError('Booking');
      }
      console.error('Error updating booking:', updateError);
      throw new Error('Failed to update booking status');
    }

    return booking as Booking;
  });
}

/**
 * Cancels a booking (sets status to 'cancelled')
 * @param bookingId The booking ID to cancel
 * @returns ActionResult with cancelled booking
 */
export async function cancelBooking(
  bookingId: string
): Promise<ActionResult<Booking>> {
  return safeAction(async () => {
    // Validate input
    const validated = cancelBookingSchema.parse({ booking_id: bookingId });

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to cancel bookings');
    }

    // Get the booking to verify ownership
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id, status')
      .eq('id', validated.booking_id)
      .single();

    if (fetchError || !existingBooking) {
      throw new NotFoundError('Booking');
    }

    // Type assertion for booking fields
    const bookingData = existingBooking as {
      user_id: string;
      status: BookingStatus;
    };

    // Check if user owns this booking
    if (bookingData.user_id !== user.id) {
      throw new AuthenticationError('You can only cancel your own bookings');
    }

    // Check if booking can be cancelled
    if (bookingData.status === 'cancelled') {
      throw new ConflictError('This booking is already cancelled');
    }

    if (bookingData.status === 'completed') {
      throw new ConflictError('Cannot cancel a completed booking');
    }

    // Prepare update data
    const updateData: BookingUpdate = {
      status: 'cancelled',
      updated_at: new Date().toISOString()
    };

    // Cancel the booking
    const { data: booking, error: cancelError } = await supabase
      .from('bookings')
      .update(updateData as unknown as never)
      .eq('id', validated.booking_id)
      .select()
      .single();

    if (cancelError || !booking) {
      console.error('Error cancelling booking:', cancelError);
      throw new Error('Failed to cancel booking');
    }

    return booking as Booking;
  });
}
