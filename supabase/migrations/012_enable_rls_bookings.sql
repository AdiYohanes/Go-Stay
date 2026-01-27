-- Migration: Row Level Security for Bookings
-- Description: Enable RLS and create policies for bookings table (user owns, admin all)
-- Requirements: 4.2, 5.6

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own bookings
CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own bookings (e.g., cancel)
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  USING (is_admin());

-- Policy: Admins can update all bookings
CREATE POLICY "Admins can update all bookings"
  ON bookings
  FOR UPDATE
  USING (is_admin());

-- Policy: Admins can delete bookings
CREATE POLICY "Admins can delete bookings"
  ON bookings
  FOR DELETE
  USING (is_admin());
