-- Migration: Additional Performance Indexes
-- Description: Add additional indexes for optimal query performance
-- Requirements: 1.1, 2.4, 6.1, 10.4

-- Additional composite indexes for common query patterns

-- Properties: Search by location and price range
CREATE INDEX IF NOT EXISTS idx_properties_location_price 
  ON properties(location, price_per_night) 
  WHERE is_active = true;

-- Properties: Search by guests and price
CREATE INDEX IF NOT EXISTS idx_properties_guests_price 
  ON properties(max_guests, price_per_night) 
  WHERE is_active = true;

-- Bookings: User bookings by status
CREATE INDEX IF NOT EXISTS idx_bookings_user_status 
  ON bookings(user_id, status, created_at DESC);

-- Bookings: Property bookings by date range
CREATE INDEX IF NOT EXISTS idx_bookings_property_date_range 
  ON bookings(property_id, start_date, end_date) 
  WHERE status IN ('confirmed', 'pending');

-- Reviews: Property reviews with rating
CREATE INDEX IF NOT EXISTS idx_reviews_property_rating 
  ON reviews(property_id, rating, created_at DESC);

-- Notifications: User unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread_created 
  ON notifications(user_id, created_at DESC) 
  WHERE read = false;

-- Cart Items: User cart with dates
CREATE INDEX IF NOT EXISTS idx_cart_items_user_dates 
  ON cart_items(user_id, start_date, end_date);

-- Payments: Booking payments by status
CREATE INDEX IF NOT EXISTS idx_payments_booking_status 
  ON payments(booking_id, status);

-- Full-text search index for properties (title and description)
CREATE INDEX IF NOT EXISTS idx_properties_search 
  ON properties USING GIN(
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(location, ''))
  );

-- Partial index for active properties only
CREATE INDEX IF NOT EXISTS idx_properties_active_price 
  ON properties(price_per_night, created_at DESC) 
  WHERE is_active = true;
