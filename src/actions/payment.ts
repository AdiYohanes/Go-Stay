/**
 * Server actions for payment management
 * Handles Midtrans payment integration and transaction processing
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction, ActionResult } from '@/lib/action-utils';
import {
  createPaymentSchema,
  paymentNotificationSchema,
  getPaymentStatusSchema,
} from '@/lib/validations/payment';
import {
  PaymentIntent,
  MidtransNotification,
  MidtransSnapRequest,
} from '@/types/payment.types';
import { CartItemWithDetails } from '@/types/cart.types';
import { createTransaction, verifySignature, mapMidtransStatus } from '@/lib/midtrans';
import { NotFoundError, AuthenticationError, ConflictError } from '@/lib/errors';
import { Database } from '@/types/database.types';
import { clearCart } from './cart';
import { sendBookingConfirmation, sendPaymentSuccess, sendPaymentFailed } from './notification';

type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentUpdate = Database['public']['Tables']['payments']['Update'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

/**
 * Initiates a payment for a single booking
 * @param bookingId The booking ID to pay for
 * @param amount The payment amount
 * @returns ActionResult with payment intent including Snap token
 */
export async function initiatePayment(
  bookingId: string,
  amount: number
): Promise<ActionResult<PaymentIntent>> {
  return safeAction(async () => {
    // Validate input
    const validated = createPaymentSchema.parse({ booking_id: bookingId, amount });

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to make payments');
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, property:properties(title)')
      .eq('id', validated.booking_id)
      .single();

    if (bookingError || !booking) {
      throw new NotFoundError('Booking');
    }

    // Type assertion for booking data
    const bookingData = booking as unknown as {
      user_id: string;
      total_price: number;
      property: { title: string };
    };

    // Verify user owns this booking
    if (bookingData.user_id !== user.id) {
      throw new AuthenticationError('You can only pay for your own bookings');
    }

    // Get user profile for customer details
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const userProfile = profile as { full_name: string | null; email: string } | null;

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${bookingId.substring(0, 8)}`;

    // Create Midtrans transaction request
    const snapRequest: MidtransSnapRequest = {
      transaction_details: {
        order_id: orderId,
        gross_amount: validated.amount,
      },
      customer_details: {
        first_name: userProfile?.full_name || 'Guest',
        email: userProfile?.email || user.email || '',
      },
      item_details: [
        {
          id: validated.booking_id,
          price: validated.amount,
          quantity: 1,
          name: bookingData.property.title || 'Property Booking',
        },
      ],
    };

    // Get Snap token from Midtrans
    const snapResponse = await createTransaction(snapRequest);

    // Create payment record
    const paymentData: PaymentInsert = {
      booking_id: validated.booking_id,
      user_id: user.id,
      midtrans_order_id: orderId,
      amount: validated.amount,
      status: 'pending',
      snap_token: snapResponse.token,
      snap_redirect_url: snapResponse.redirect_url,
    };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([paymentData] as unknown as never)
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('Error creating payment:', paymentError);
      throw new Error('Failed to create payment record');
    }

    return payment as PaymentIntent;
  });
}

/**
 * Creates a Midtrans transaction for cart checkout
 * Creates bookings for all cart items and initiates payment
 * @returns ActionResult with payment intent including Snap token
 */
export async function createMidtransTransaction(): Promise<ActionResult<PaymentIntent>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to checkout');
    }

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        property:properties (
          id,
          title,
          location,
          image_urls,
          price_per_night,
          max_guests,
          is_active
        )
      `
      )
      .eq('user_id', user.id);

    if (cartError) {
      console.error('Error fetching cart:', cartError);
      throw new Error('Failed to fetch cart items');
    }

    if (!cartItems || cartItems.length === 0) {
      throw new ConflictError('Your cart is empty');
    }

    // Type assertion for cart items
    const items = cartItems as unknown as CartItemWithDetails[];

    // Verify all items are available
    const unavailableItems = items.filter((item) => !item.isAvailable);
    if (unavailableItems.length > 0) {
      throw new ConflictError(
        'Some items in your cart are no longer available. Please remove them and try again.'
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.pricing.total, 0);

    // Create bookings for all cart items
    const bookingIds: string[] = [];
    const bookingInserts: BookingInsert[] = [];

    for (const item of items) {
      const bookingData: BookingInsert = {
        property_id: item.property_id,
        user_id: user.id,
        start_date: item.check_in,
        end_date: item.check_out,
        guests: item.guests,
        total_price: item.pricing.total,
        service_fee: item.pricing.service_fee,
        status: 'pending', // Will be updated to confirmed after payment
      };
      bookingInserts.push(bookingData);
    }

    // Insert all bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .insert(bookingInserts as unknown as never)
      .select('id');

    if (bookingsError || !bookings || bookings.length === 0) {
      console.error('Error creating bookings:', bookingsError);
      throw new Error('Failed to create bookings');
    }

    // Extract booking IDs
    bookingIds.push(...bookings.map((b) => (b as { id: string }).id));

    // Get user profile for customer details
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const userProfile = profile as { full_name: string | null; email: string } | null;

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${user.id.substring(0, 8)}`;

    // Create Midtrans transaction request
    const snapRequest: MidtransSnapRequest = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: userProfile?.full_name || 'Guest',
        email: userProfile?.email || user.email || '',
      },
      item_details: items.map((item) => ({
        id: item.property_id,
        price: item.pricing.total,
        quantity: 1,
        name: item.property.title,
      })),
    };

    // Get Snap token from Midtrans
    const snapResponse = await createTransaction(snapRequest);

    // Create payment record (linked to first booking for simplicity)
    const paymentData: PaymentInsert = {
      booking_id: bookingIds[0],
      user_id: user.id,
      midtrans_order_id: orderId,
      amount: totalAmount,
      status: 'pending',
      snap_token: snapResponse.token,
      snap_redirect_url: snapResponse.redirect_url,
    };

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([paymentData] as unknown as never)
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('Error creating payment:', paymentError);
      throw new Error('Failed to create payment record');
    }

    return payment as PaymentIntent;
  });
}

/**
 * Handles Midtrans payment notification webhook
 * Updates payment and booking status based on notification
 * @param notification The Midtrans notification data
 * @returns ActionResult with success status
 */
export async function handlePaymentNotification(
  notification: MidtransNotification
): Promise<ActionResult<{ success: boolean }>> {
  return safeAction(async () => {
    // Validate notification
    const validated = paymentNotificationSchema.parse(notification);

    // Verify signature
    const isValid = verifySignature(
      validated.order_id,
      validated.status_code,
      validated.gross_amount,
      validated.signature_key
    );

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const supabase = await createClient();

    // Get payment by order ID
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('midtrans_order_id', validated.order_id)
      .single();

    if (paymentError || !payment) {
      throw new NotFoundError('Payment');
    }

    // Type assertion for payment data
    const paymentData = payment as PaymentIntent;

    // Map Midtrans status to our status
    const newStatus = mapMidtransStatus(
      validated.transaction_status,
      validated.fraud_status
    );

    // Update payment record
    const paymentUpdate: PaymentUpdate = {
      status: newStatus,
      midtrans_transaction_id: validated.transaction_id,
      payment_type: validated.payment_type,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('payments')
      .update(paymentUpdate as unknown as never)
      .eq('id', paymentData.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      throw new Error('Failed to update payment status');
    }

    // Update booking status if payment is successful
    if (newStatus === 'settlement' || newStatus === 'capture') {
      // Get booking details for notification
      const { data: booking, error: bookingFetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          start_date,
          end_date,
          total_price,
          property:properties (
            title
          )
        `)
        .eq('id', paymentData.booking_id)
        .single();

      const { error: bookingUpdateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() } as unknown as never)
        .eq('id', paymentData.booking_id);

      if (bookingUpdateError) {
        console.error('Error updating booking:', bookingUpdateError);
      }

      // Send booking confirmation and payment success notifications
      if (!bookingFetchError && booking) {
        const bookingDetails = booking as unknown as {
          id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          property: { title: string };
        };

        await sendBookingConfirmation(
          bookingDetails.user_id,
          bookingDetails.id,
          bookingDetails.property.title || 'Property',
          bookingDetails.start_date,
          bookingDetails.end_date
        );

        await sendPaymentSuccess(
          bookingDetails.user_id,
          bookingDetails.id,
          bookingDetails.total_price,
          bookingDetails.property.title || 'Property'
        );
      }

      // Clear cart for this user
      const clearResult = await clearCart();
      if (!clearResult.success) {
        console.error('Error clearing cart:', clearResult.error);
      }
    }

    // Handle failed/cancelled payments
    if (newStatus === 'deny' || newStatus === 'cancel' || newStatus === 'expire') {
      // Get booking details for notification
      const { data: booking, error: bookingFetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          total_price,
          property:properties (
            title
          )
        `)
        .eq('id', paymentData.booking_id)
        .single();

      const { error: bookingUpdateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() } as unknown as never)
        .eq('id', paymentData.booking_id);

      if (bookingUpdateError) {
        console.error('Error updating booking:', bookingUpdateError);
      }

      // Send payment failed notification
      if (!bookingFetchError && booking) {
        const bookingDetails = booking as unknown as {
          id: string;
          user_id: string;
          total_price: number;
          property: { title: string };
        };

        await sendPaymentFailed(
          bookingDetails.user_id,
          bookingDetails.id,
          bookingDetails.total_price,
          bookingDetails.property.title || 'Property'
        );
      }
    }

    return { success: true };
  });
}

/**
 * Gets the status of a payment
 * @param paymentId The payment ID
 * @returns ActionResult with payment details
 */
export async function getPaymentStatus(
  paymentId: string
): Promise<ActionResult<PaymentIntent>> {
  return safeAction(async () => {
    // Validate input
    const validated = getPaymentStatusSchema.parse({ payment_id: paymentId });

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to view payment status');
    }

    // Get payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', validated.payment_id)
      .single();

    if (paymentError || !payment) {
      throw new NotFoundError('Payment');
    }

    // Type assertion for payment data
    const paymentData = payment as PaymentIntent;

    // Verify user owns this payment
    if (paymentData.user_id !== user.id) {
      throw new AuthenticationError('You can only view your own payments');
    }

    return paymentData;
  });
}
