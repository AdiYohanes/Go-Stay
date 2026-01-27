-- Migration: Row Level Security for Favorites
-- Description: Enable RLS and create policies for favorites table (user owns only)
-- Requirements: 4.2, 5.6

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own favorites
CREATE POLICY "Users can create own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Admins can view all favorites
CREATE POLICY "Admins can view all favorites"
  ON favorites
  FOR SELECT
  USING (is_admin());
