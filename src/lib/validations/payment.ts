/**
 * Zod validation schemas for payment operations
 */

import { z } from 'zod';

export const createPaymentSchema = z.object({
  booking_id: z.string().uuid('Invalid booking ID'),
  amount: z.number().positive('Amount must be positive'),
});

export const paymentNotificationSchema = z.object({
  transaction_time: z.string(),
  transaction_status: z.string(),
  transaction_id: z.string(),
  status_message: z.string(),
  status_code: z.string(),
  signature_key: z.string(),
  payment_type: z.string(),
  order_id: z.string(),
  merchant_id: z.string(),
  gross_amount: z.string(),
  fraud_status: z.string().optional(),
  currency: z.string(),
});

export const getPaymentStatusSchema = z.object({
  payment_id: z.string().uuid('Invalid payment ID'),
});
