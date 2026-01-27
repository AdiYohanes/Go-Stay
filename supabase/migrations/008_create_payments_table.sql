-- Migration: Payments Table
-- Description: Create payments table with booking_id, midtrans_order_id, status
-- Requirements: 1.1, 2.4, 6.1, 10.4

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  midtrans_order_id TEXT UNIQUE,
  midtrans_transaction_id TEXT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'IDR',
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processing',
    'success',
    'failed',
    'cancelled',
    'expired',
    'refunded'
  )),
  payment_method TEXT,
  payment_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_midtrans_order ON payments(midtrans_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Create composite index for user payments query
CREATE INDEX IF NOT EXISTS idx_payments_user_created 
  ON payments(user_id, created_at DESC);

-- Create trigger to update updated_at on payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to get payment by midtrans order id
CREATE OR REPLACE FUNCTION get_payment_by_midtrans_order(p_order_id TEXT)
RETURNS TABLE(
  id UUID,
  booking_id UUID,
  user_id UUID,
  amount DECIMAL(10,2),
  status TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.booking_id,
    p.user_id,
    p.amount,
    p.status,
    p.created_at
  FROM payments p
  WHERE p.midtrans_order_id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status(
  p_payment_id UUID,
  p_status TEXT,
  p_transaction_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payments
  SET 
    status = p_status,
    midtrans_transaction_id = COALESCE(p_transaction_id, midtrans_transaction_id),
    paid_at = CASE WHEN p_status = 'success' THEN NOW() ELSE paid_at END,
    updated_at = NOW()
  WHERE id = p_payment_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
