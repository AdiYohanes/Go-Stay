/**
 * Midtrans payment gateway configuration and utilities
 * Handles Snap token generation and transaction management
 */

import { MidtransSnapRequest, MidtransSnapResponse } from '@/types/payment.types';

// Environment variables
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Midtrans API endpoints
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

const MIDTRANS_SNAP_SCRIPT_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

/**
 * Validates that required Midtrans environment variables are set
 * @throws Error if required variables are missing
 */
export function validateMidtransConfig(): void {
  if (!MIDTRANS_SERVER_KEY) {
    throw new Error('MIDTRANS_SERVER_KEY environment variable is not set');
  }
  if (!MIDTRANS_CLIENT_KEY) {
    throw new Error('NEXT_PUBLIC_MIDTRANS_CLIENT_KEY environment variable is not set');
  }
}

/**
 * Gets the Midtrans client key for frontend usage
 * @returns The Midtrans client key
 */
export function getMidtransClientKey(): string {
  return MIDTRANS_CLIENT_KEY;
}

/**
 * Gets the Midtrans Snap script URL
 * @returns The Snap script URL based on environment
 */
export function getMidtransSnapScriptUrl(): string {
  return MIDTRANS_SNAP_SCRIPT_URL;
}

/**
 * Creates a Midtrans Snap transaction and returns the token
 * @param request The transaction request details
 * @returns Promise with Snap token and redirect URL
 * @throws Error if transaction creation fails
 */
export async function createTransaction(
  request: MidtransSnapRequest
): Promise<MidtransSnapResponse> {
  validateMidtransConfig();

  // Create authorization header (Basic Auth with server key)
  const authString = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');

  try {
    const response = await fetch(MIDTRANS_SNAP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Midtrans API error:', errorData);
      throw new Error(
        `Midtrans API error: ${response.status} - ${errorData.error_messages?.join(', ') || 'Unknown error'}`
      );
    }

    const data = await response.json();

    return {
      token: data.token,
      redirect_url: data.redirect_url,
    };
  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create payment transaction');
  }
}

/**
 * Verifies the signature of a Midtrans notification
 * @param orderId The order ID
 * @param statusCode The status code from notification
 * @param grossAmount The gross amount from notification
 * @param signatureKey The signature key from notification
 * @returns True if signature is valid, false otherwise
 */
export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const crypto = require('crypto');
  
  // Create hash: SHA512(order_id + status_code + gross_amount + server_key)
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + MIDTRANS_SERVER_KEY)
    .digest('hex');

  return hash === signatureKey;
}

/**
 * Maps Midtrans transaction status to our payment status
 * @param transactionStatus The Midtrans transaction status
 * @param fraudStatus Optional fraud status
 * @returns Our normalized payment status
 */
export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): 'pending' | 'capture' | 'settlement' | 'deny' | 'cancel' | 'expire' | 'refund' {
  // Handle fraud status for capture
  if (transactionStatus === 'capture') {
    if (fraudStatus === 'accept') {
      return 'capture';
    }
    return 'deny';
  }

  // Map other statuses
  const statusMap: Record<string, 'pending' | 'settlement' | 'deny' | 'cancel' | 'expire' | 'refund'> = {
    'settlement': 'settlement',
    'pending': 'pending',
    'deny': 'deny',
    'cancel': 'cancel',
    'expire': 'expire',
    'refund': 'refund',
  };

  return statusMap[transactionStatus] || 'pending';
}
