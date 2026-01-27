-- Migration: Row Level Security for Notifications
-- Description: Enable RLS and create policies for notifications table (user owns only)
-- Requirements: 4.2, 5.6

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: System can create notifications for any user (via service role)
-- This policy allows server-side code to create notifications
CREATE POLICY "Service role can create notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
  ON notifications
  FOR SELECT
  USING (is_admin());
