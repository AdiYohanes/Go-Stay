-- Migration: Enhanced Bookings Table
-- Description: Create bookings table with status, service_fee, and date constraints
-- Requirements: 1.1, 2.4, 6.1, 10.4

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1 CHECK (guests > 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  service_fee DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (service_fee >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_guests CHECK (guests > 0),
  CONSTRAINT future_dates CHECK (start_date >= CURRENT_DATE)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Create composite index for availability checks
CREATE INDEX IF NOT EXISTS idx_bookings_property_dates_status 
  ON bookings(property_id, start_date, end_date, status)
  WHERE status IN ('confirmed', 'pending');

-- Create trigger to update updated_at on bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_property_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO conflict_count
  FROM bookings
  WHERE property_id = p_property_id
    AND status IN ('confirmed', 'pending')
    AND (id != p_exclude_booking_id OR p_exclude_booking_id IS NULL)
    AND (
      (start_date <= p_start_date AND end_date > p_start_date)
      OR (start_date < p_end_date AND end_date >= p_end_date)
      OR (start_date >= p_start_date AND end_date <= p_end_date)
    );
  
  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;
