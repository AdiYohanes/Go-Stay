/**
 * Midtrans payment notification webhook handler
 * Verifies webhook signature and updates payment/booking status
 * Requirements: Payment gateway, 10.1
 */

import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentNotification } from '@/actions/payment';
import { MidtransNotification } from '@/types/payment.types';

/**
 * POST handler for Midtrans payment notifications
 * This endpoint is called by Midtrans when payment status changes
 */
export async function POST(request: NextRequest) {
  try {
    // Parse notification data
    const notification: MidtransNotification = await request.json();

    console.log('Received Midtrans notification:', {
      order_id: notification.order_id,
      transaction_status: notification.transaction_status,
      transaction_id: notification.transaction_id,
    });

    // Handle the notification
    const result = await handlePaymentNotification(notification);

    if (!result.success) {
      console.error('Failed to handle notification:', result.error);
      return NextResponse.json(
        {
          status: 'error',
          message: result.error || 'Failed to process notification',
        },
        { status: 400 }
      );
    }

    // Return success response to Midtrans
    return NextResponse.json({
      status: 'success',
      message: 'Notification processed successfully',
    });
  } catch (error) {
    console.error('Error processing Midtrans notification:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - not used by Midtrans but useful for health checks
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Midtrans webhook endpoint is active',
  });
}
