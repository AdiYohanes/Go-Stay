-- Migration: Row Level Security for Properties
-- Description: Enable RLS and create policies for properties table (public read, admin write)
-- Requirements: 4.2, 5.6

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active properties (public read)
CREATE POLICY "Anyone can view active properties"
  ON properties
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can view all properties (including inactive)
CREATE POLICY "Admins can view all properties"
  ON properties
  FOR SELECT
  USING (is_admin());

-- Policy: Admins can insert properties
CREATE POLICY "Admins can insert properties"
  ON properties
  FOR INSERT
  WITH CHECK (is_admin());

-- Policy: Admins can update properties
CREATE POLICY "Admins can update properties"
  ON properties
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Admins can delete properties (soft delete by setting is_active = false)
CREATE POLICY "Admins can delete properties"
  ON properties
  FOR DELETE
  USING (is_admin());
