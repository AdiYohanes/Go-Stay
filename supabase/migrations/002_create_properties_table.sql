-- Migration: Enhanced Properties Table
-- Description: Create properties table with all fields and constraints
-- Requirements: 1.1, 2.4, 6.1, 10.4

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night > 0),
  location TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_urls TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  max_guests INTEGER NOT NULL DEFAULT 1 CHECK (max_guests > 0),
  bedrooms INTEGER DEFAULT 1 CHECK (bedrooms >= 0),
  beds INTEGER DEFAULT 1 CHECK (beds >= 0),
  bathrooms DECIMAL(3,1) DEFAULT 1 CHECK (bathrooms >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_per_night);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_properties_max_guests ON properties(max_guests);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Create GIN index for amenities array searches
CREATE INDEX IF NOT EXISTS idx_properties_amenities ON properties USING GIN(amenities);

-- Create trigger to update updated_at on properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
