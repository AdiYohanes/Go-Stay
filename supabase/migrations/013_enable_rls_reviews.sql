-- Migration: Row Level Security for Reviews
-- Description: Enable RLS and create policies for reviews table (user owns, public read)
-- Requirements: 4.2, 5.6

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view reviews (public read)
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Admins can update all reviews
CREATE POLICY "Admins can update all reviews"
  ON reviews
  FOR UPDATE
  USING (is_admin());

-- Policy: Admins can delete all reviews
CREATE POLICY "Admins can delete all reviews"
  ON reviews
  FOR DELETE
  USING (is_admin());
