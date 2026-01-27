-- Migration: Reviews Table
-- Description: Create reviews table with booking_id reference and unique constraint
-- Requirements: 1.1, 2.4, 6.1, 10.4

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_property_user_booking UNIQUE(property_id, user_id, booking_id)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Create trigger to update updated_at on reviews
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate property average rating
CREATE OR REPLACE FUNCTION calculate_property_rating(p_property_id UUID)
RETURNS TABLE(
  average_rating DECIMAL(3,2),
  review_count INTEGER,
  rating_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(AVG(rating)::numeric, 2) as average_rating,
    COUNT(*)::INTEGER as review_count,
    jsonb_build_object(
      '1', COUNT(*) FILTER (WHERE rating = 1),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '5', COUNT(*) FILTER (WHERE rating = 5)
    ) as rating_distribution
  FROM reviews
  WHERE property_id = p_property_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to check review eligibility
CREATE OR REPLACE FUNCTION check_review_eligibility(
  p_user_id UUID,
  p_property_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  completed_booking_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO completed_booking_count
  FROM bookings
  WHERE user_id = p_user_id
    AND property_id = p_property_id
    AND status = 'completed';
  
  RETURN completed_booking_count > 0;
END;
$$ LANGUAGE plpgsql;
