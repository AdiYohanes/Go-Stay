/**
 * Server actions for notification management
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { safeAction, ActionResult } from '@/lib/action-utils';
import { 
  Notification, 
  CreateNotificationInput
} from '@/types/notification.types';
import { AuthenticationError, NotFoundError } from '@/lib/errors';
import { Database } from '@/types/database.types';

type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

/**
 * Creates a new notification for a user
 * @param input Notification creation data
 * @returns ActionResult with created notification
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<ActionResult<Notification>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Prepare insert data
    const insertData: NotificationInsert = {
      user_id: input.user_id,
      type: input.type,
      title: input.title,
      message: input.message,
      data: (input.data || {}) as Database['public']['Tables']['notifications']['Row']['data'],
      read: false,
    };

    // Create notification
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert([insertData] as unknown as never)
      .select()
      .single();

    if (notificationError || !notification) {
      console.error('Error creating notification:', notificationError);
      throw new Error('Failed to create notification');
    }

    return notification as Notification;
  });
}

/**
 * Retrieves notifications for the current user with pagination
 * @param page Page number (default: 1)
 * @param limit Items per page (default: 20)
 * @returns ActionResult with paginated notifications
 */
export async function getUserNotifications(
  page: number = 1,
  limit: number = 20
): Promise<ActionResult<{ notifications: Notification[]; total: number; hasMore: boolean }>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to view notifications');
    }

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error counting notifications:', countError);
      throw new Error('Failed to count notifications');
    }

    // Get notifications with pagination
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
      throw new Error('Failed to fetch notifications');
    }

    const total = count || 0;
    const hasMore = to < total - 1;

    return {
      notifications: (notifications || []) as Notification[],
      total,
      hasMore,
    };
  });
}

/**
 * Marks a notification as read
 * @param notificationId The notification ID
 * @returns ActionResult with updated notification
 */
export async function markAsRead(
  notificationId: string
): Promise<ActionResult<Notification>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to update notifications');
    }

    // Verify notification belongs to user
    const { data: existingNotification, error: fetchError } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', notificationId)
      .single();

    if (fetchError || !existingNotification) {
      throw new NotFoundError('Notification');
    }

    // Type assertion for notification fields
    const notificationData = existingNotification as { user_id: string };

    if (notificationData.user_id !== user.id) {
      throw new AuthenticationError('You can only update your own notifications');
    }

    // Prepare update data
    const updateData: NotificationUpdate = {
      read: true,
    };

    // Update notification
    const { data: notification, error: updateError } = await supabase
      .from('notifications')
      .update(updateData as unknown as never)
      .eq('id', notificationId)
      .select()
      .single();

    if (updateError || !notification) {
      console.error('Error updating notification:', updateError);
      throw new Error('Failed to mark notification as read');
    }

    return notification as Notification;
  });
}

/**
 * Marks all notifications as read for the current user
 * @returns ActionResult with count of updated notifications
 */
export async function markAllAsRead(): Promise<ActionResult<{ count: number }>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to update notifications');
    }

    // Prepare update data
    const updateData: NotificationUpdate = {
      read: true,
    };

    // Update all unread notifications for this user
    const { data: notifications, error: updateError } = await supabase
      .from('notifications')
      .update(updateData as unknown as never)
      .eq('user_id', user.id)
      .eq('read', false)
      .select();

    if (updateError) {
      console.error('Error marking all notifications as read:', updateError);
      throw new Error('Failed to mark all notifications as read');
    }

    return { count: notifications?.length || 0 };
  });
}

/**
 * Gets the count of unread notifications for the current user
 * @returns ActionResult with unread count
 */
export async function getUnreadCount(): Promise<ActionResult<number>> {
  return safeAction(async () => {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthenticationError('You must be logged in to view notifications');
    }

    // Get count of unread notifications
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (countError) {
      console.error('Error counting unread notifications:', countError);
      throw new Error('Failed to count unread notifications');
    }

    return count || 0;
  });
}

// ============================================================================
// Notification Trigger Functions for Booking Events
// ============================================================================

/**
 * Sends a booking confirmation notification to the user
 * @param userId The user ID
 * @param bookingId The booking ID
 * @param propertyTitle The property title
 * @param startDate The check-in date
 * @param endDate The check-out date
 * @returns ActionResult with created notification
 */
export async function sendBookingConfirmation(
  userId: string,
  bookingId: string,
  propertyTitle: string,
  startDate: string,
  endDate: string
): Promise<ActionResult<Notification>> {
  return createNotification({
    user_id: userId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: `Your booking for ${propertyTitle} from ${startDate} to ${endDate} has been confirmed.`,
    data: {
      booking_id: bookingId,
      property_title: propertyTitle,
      start_date: startDate,
      end_date: endDate,
    },
  });
}

/**
 * Sends booking cancellation notifications to user and admin
 * @param userId The user ID
 * @param bookingId The booking ID
 * @param propertyTitle The property title
 * @param startDate The check-in date
 * @param endDate The check-out date
 * @returns ActionResult with array of created notifications
 */
export async function sendBookingCancellation(
  userId: string,
  bookingId: string,
  propertyTitle: string,
  startDate: string,
  endDate: string
): Promise<ActionResult<Notification[]>> {
  return safeAction(async () => {
    const supabase = await createClient();
    const notifications: Notification[] = [];

    // Send notification to user
    const userNotificationResult = await createNotification({
      user_id: userId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking for ${propertyTitle} from ${startDate} to ${endDate} has been cancelled.`,
      data: {
        booking_id: bookingId,
        property_title: propertyTitle,
        start_date: startDate,
        end_date: endDate,
      },
    });

    if (userNotificationResult.success) {
      notifications.push(userNotificationResult.data);
    }

    // Get all admin users
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (!adminsError && admins && admins.length > 0) {
      // Send notification to each admin
      for (const admin of admins) {
        const adminData = admin as { id: string };
        const adminNotificationResult = await createNotification({
          user_id: adminData.id,
          type: 'booking_cancelled',
          title: 'Booking Cancelled',
          message: `A booking for ${propertyTitle} from ${startDate} to ${endDate} has been cancelled.`,
          data: {
            booking_id: bookingId,
            property_title: propertyTitle,
            start_date: startDate,
            end_date: endDate,
            user_id: userId,
          },
        });

        if (adminNotificationResult.success) {
          notifications.push(adminNotificationResult.data);
        }
      }
    }

    return notifications;
  });
}

/**
 * Sends a booking reminder notification to the user (24 hours before check-in)
 * @param userId The user ID
 * @param bookingId The booking ID
 * @param propertyTitle The property title
 * @param startDate The check-in date
 * @param propertyLocation The property location
 * @returns ActionResult with created notification
 */
export async function sendBookingReminder(
  userId: string,
  bookingId: string,
  propertyTitle: string,
  startDate: string,
  propertyLocation: string
): Promise<ActionResult<Notification>> {
  return createNotification({
    user_id: userId,
    type: 'booking_reminder',
    title: 'Booking Reminder',
    message: `Your stay at ${propertyTitle} in ${propertyLocation} starts tomorrow (${startDate}). Have a great trip!`,
    data: {
      booking_id: bookingId,
      property_title: propertyTitle,
      start_date: startDate,
      property_location: propertyLocation,
    },
  });
}

/**
 * Sends a payment success notification to the user
 * @param userId The user ID
 * @param bookingId The booking ID
 * @param amount The payment amount
 * @param propertyTitle The property title
 * @returns ActionResult with created notification
 */
export async function sendPaymentSuccess(
  userId: string,
  bookingId: string,
  amount: number,
  propertyTitle: string
): Promise<ActionResult<Notification>> {
  return createNotification({
    user_id: userId,
    type: 'payment_success',
    title: 'Payment Successful',
    message: `Your payment of $${amount.toFixed(2)} for ${propertyTitle} has been processed successfully.`,
    data: {
      booking_id: bookingId,
      amount,
      property_title: propertyTitle,
    },
  });
}

/**
 * Sends a payment failed notification to the user
 * @param userId The user ID
 * @param bookingId The booking ID
 * @param amount The payment amount
 * @param propertyTitle The property title
 * @returns ActionResult with created notification
 */
export async function sendPaymentFailed(
  userId: string,
  bookingId: string,
  amount: number,
  propertyTitle: string
): Promise<ActionResult<Notification>> {
  return createNotification({
    user_id: userId,
    type: 'payment_failed',
    title: 'Payment Failed',
    message: `Your payment of $${amount.toFixed(2)} for ${propertyTitle} could not be processed. Please try again.`,
    data: {
      booking_id: bookingId,
      amount,
      property_title: propertyTitle,
    },
  });
}
