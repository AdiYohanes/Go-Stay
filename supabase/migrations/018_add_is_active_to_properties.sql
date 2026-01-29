-- Add is_active, rating, and review_count columns to properties table
-- These columns are used for soft-delete and review aggregation

-- Add is_active column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add rating column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT NULL;

-- Add review_count column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Update existing properties to have default values
UPDATE properties SET is_active = true WHERE is_active IS NULL;
UPDATE properties SET review_count = 0 WHERE review_count IS NULL;

-- Make is_active NOT NULL after setting defaults
ALTER TABLE properties 
ALTER COLUMN is_active SET NOT NULL;

ALTER TABLE properties 
ALTER COLUMN review_count SET NOT NULL;

-- Create indexes for faster filtering and sorting
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_rating ON properties(rating);
CREATE INDEX IF NOT EXISTS idx_properties_review_count ON properties(review_count);
