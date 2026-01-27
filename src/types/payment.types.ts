/**
 * Payment type definitions for the hotel booking system
 * Supports Midtrans payment gateway integration
 */

export type PaymentStatus =
  | "pending"
  | "capture"
  | "settlement"
  | "deny"
  | "cancel"
  | "expire"
  | "refund";

export interface PaymentIntent {
  id: string;
  booking_id: string;
  user_id: string;
  midtrans_order_id: string;
  midtrans_transaction_id?: string | null;
  amount: number;
  status: PaymentStatus;
  payment_type?: string | null;
  snap_token?: string | null;
  snap_redirect_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentInput {
  booking_id: string;
  amount: number;
}

export interface MidtransSnapRequest {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  item_details?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface MidtransSnapResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status?: string;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  payment?: PaymentIntent;
  error?: string;
}
