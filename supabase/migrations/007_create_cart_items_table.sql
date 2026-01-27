-- Migration: Cart Items Table
-- Description: Create cart_items table with user_id, property_id, dates, guests
-- Requirements: 1.1, 2.4, 6.1, 10.4

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1 CHECK (guests > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_cart_dates CHECK (end_date > start_date),
  CONSTRAINT valid_cart_guests CHECK (guests > 0)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_property ON cart_items(property_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at DESC);

-- Create composite index for user cart query
CREATE INDEX IF NOT EXISTS idx_cart_items_user_created 
  ON cart_items(user_id, created_at DESC);

-- Create trigger to update updated_at on cart_items
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to get cart item count
CREATE OR REPLACE FUNCTION get_cart_item_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  item_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO item_count
  FROM cart_items
  WHERE user_id = p_user_id;
  
  RETURN item_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate cart total
CREATE OR REPLACE FUNCTION calculate_cart_total(p_user_id UUID)
RETURNS TABLE(
  subtotal DECIMAL(10,2),
  service_fee DECIMAL(10,2),
  total DECIMAL(10,2),
  item_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(
      p.price_per_night * (ci.end_date - ci.start_date)
    ), 0)::DECIMAL(10,2) as subtotal,
    COALESCE(SUM(
      p.price_per_night * (ci.end_date - ci.start_date) * 0.1
    ), 0)::DECIMAL(10,2) as service_fee,
    COALESCE(SUM(
      p.price_per_night * (ci.end_date - ci.start_date) * 1.1
    ), 0)::DECIMAL(10,2) as total,
    COUNT(*)::INTEGER as item_count
  FROM cart_items ci
  JOIN properties p ON ci.property_id = p.id
  WHERE ci.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to clear user cart
CREATE OR REPLACE FUNCTION clear_user_cart(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM cart_items
  WHERE user_id = p_user_id;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
