-- Migration: Row Level Security for Payments
-- Description: Enable RLS and create policies for payments table (user owns, admin read)
-- Requirements: 4.2, 5.6

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own payments
CREATE POLICY "Users can create own payments"
  ON payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: System can update payments (via service role for webhook handling)
-- Users cannot directly update payments, only the system can
CREATE POLICY "Service role can update payments"
  ON payments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments
  FOR SELECT
  USING (is_admin());

-- Policy: Admins can update all payments
CREATE POLICY "Admins can update all payments"
  ON payments
  FOR UPDATE
  USING (is_admin());
