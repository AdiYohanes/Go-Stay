-- Migration: Row Level Security for Cart Items
-- Description: Enable RLS and create policies for cart_items table (user owns only)
-- Requirements: 4.2, 5.6

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own cart items
CREATE POLICY "Users can view own cart items"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own cart items
CREATE POLICY "Users can create own cart items"
  ON cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cart items
CREATE POLICY "Users can update own cart items"
  ON cart_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own cart items
CREATE POLICY "Users can delete own cart items"
  ON cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Admins can view all cart items
CREATE POLICY "Admins can view all cart items"
  ON cart_items
  FOR SELECT
  USING (is_admin());
