-- Migration: Favorites Table
-- Description: Create favorites table with unique constraint (user_id, property_id)
-- Requirements: 1.1, 2.4, 6.1, 10.4

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_property UNIQUE(user_id, property_id)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- Create composite index for user favorites query
CREATE INDEX IF NOT EXISTS idx_favorites_user_created 
  ON favorites(user_id, created_at DESC);

-- Create function to check if property is favorited
CREATE OR REPLACE FUNCTION is_property_favorited(
  p_user_id UUID,
  p_property_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  favorite_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM favorites
    WHERE user_id = p_user_id
      AND property_id = p_property_id
  ) INTO favorite_exists;
  
  RETURN favorite_exists;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user favorites count
CREATE OR REPLACE FUNCTION get_user_favorites_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  favorites_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO favorites_count
  FROM favorites
  WHERE user_id = p_user_id;
  
  RETURN favorites_count;
END;
$$ LANGUAGE plpgsql;
