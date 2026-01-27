# Supabase Database Migrations

This directory contains SQL migration files for the hotel booking enhancement project.

## Migration Files

The migrations are numbered sequentially and should be applied in order:

1. **001_create_profiles_table.sql** - Enhanced profiles table with role-based access
2. **002_create_properties_table.sql** - Properties table with all fields and constraints
3. **003_create_bookings_table.sql** - Bookings table with status, service_fee, and date constraints
4. **004_create_reviews_table.sql** - Reviews table with booking_id reference
5. **005_create_notifications_table.sql** - Notifications table for in-app notifications
6. **006_create_favorites_table.sql** - Favorites table with unique constraint
7. **007_create_cart_items_table.sql** - Cart items table for reservation cart
8. **008_create_payments_table.sql** - Payments table with Midtrans integration
9. **009_create_additional_indexes.sql** - Performance indexes for all tables
10. **010_enable_rls_profiles.sql** - RLS policies for profiles
11. **011_enable_rls_properties.sql** - RLS policies for properties (public read, admin write)
12. **012_enable_rls_bookings.sql** - RLS policies for bookings (user owns, admin all)
13. **013_enable_rls_reviews.sql** - RLS policies for reviews (user owns, public read)
14. **014_enable_rls_notifications.sql** - RLS policies for notifications (user owns only)
15. **015_enable_rls_favorites.sql** - RLS policies for favorites (user owns only)
16. **016_enable_rls_cart_items.sql** - RLS policies for cart items (user owns only)
17. **017_enable_rls_payments.sql** - RLS policies for payments (user owns, admin read)

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Link your project:

   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply all migrations:
   ```bash
   supabase db push
   ```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file content in order
4. Execute each migration

### Option 3: Manual Application

Copy the content of each migration file and execute them in order in your PostgreSQL client or Supabase SQL editor.

## Important Notes

- **Order Matters**: Migrations must be applied in numerical order due to dependencies
- **Idempotent**: All migrations use `IF NOT EXISTS` or `IF NOT EXISTS` clauses to be safely re-runnable
- **RLS Enabled**: Row Level Security is enabled on all tables with appropriate policies
- **Triggers**: Automatic `updated_at` timestamp updates are configured for relevant tables
- **Functions**: Helper functions are included for common operations (availability checks, rating calculations, etc.)

## Database Schema Overview

### Core Tables

- **profiles** - User profiles with role-based access (user/admin)
- **properties** - Hotel properties with amenities and pricing
- **bookings** - Property reservations with date ranges and status
- **reviews** - Property reviews and ratings
- **notifications** - In-app notifications for users
- **favorites** - User favorite properties
- **cart_items** - Shopping cart for reservations
- **payments** - Payment transactions with Midtrans integration

### Key Features

- Role-based access control (user/admin)
- Automatic timestamp management
- Availability checking functions
- Price calculation functions
- Rating calculation functions
- Full-text search support
- Optimized indexes for performance

## Environment Variables

Make sure to set up the following environment variables in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing Migrations

After applying migrations, verify the schema:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public';
```

## Rollback

If you need to rollback migrations, you can drop tables in reverse order:

```sql
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

**Warning**: This will delete all data. Use with caution!
