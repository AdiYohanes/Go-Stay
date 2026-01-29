-- HOTFIX: Add is_active column to properties table
-- This is a temporary fix to add the missing column without running full migrations
-- Run this SQL in your Supabase SQL Editor

-- Add is_active column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE properties 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
        
        -- Update existing records to be active
        UPDATE properties SET is_active = true WHERE is_active IS NULL;
        
        -- Create index for performance
        CREATE INDEX IF NOT EXISTS idx_properties_active 
        ON properties(is_active) 
        WHERE is_active = true;
        
        RAISE NOTICE 'Column is_active added successfully';
    ELSE
        RAISE NOTICE 'Column is_active already exists';
    END IF;
END $$;
