# Quick Fix: Database Error - is_active Column Missing

## Error Message

```
column properties.is_active does not exist
```

## Problem

The `is_active` column doesn't exist in your `properties` table because the database migrations haven't been applied yet.

## Quick Fix (2 minutes)

### Option 1: Run the Hotfix SQL (RECOMMENDED - Fastest)

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://supabase.com/dashboard
   - Navigate to **SQL Editor**

2. **Run the Hotfix SQL**
   - Copy the content from `supabase/migrations/HOTFIX_add_is_active_column.sql`
   - Paste it into the SQL Editor
   - Click **Run**

3. **Restart your dev server**

   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

4. **Done!** ✅ The error should be fixed.

---

### Option 2: Run Full Migrations (Complete Solution)

If you want to apply all migrations properly:

1. **Install Supabase CLI** (if not installed):

   ```bash
   npm install -g supabase
   ```

2. **Link your project**:

   ```bash
   supabase link --project-ref your-project-ref
   ```

   Find your project ref in Supabase Dashboard → Settings → General → Reference ID

3. **Apply all migrations**:

   ```bash
   supabase db push
   ```

4. **Restart your dev server**:
   ```bash
   npm run dev
   ```

---

## What This Fixes

The `is_active` column is used for:

- ✅ Soft-deleting properties (instead of hard delete)
- ✅ Filtering out inactive properties from search results
- ✅ Admin ability to deactivate properties without deleting them
- ✅ Showing "Inactive" badge in admin panel

## After Fixing

Once the column is added, you can:

1. ✅ Browse properties without errors
2. ✅ Create new properties
3. ✅ Search and filter properties
4. ✅ Admin can soft-delete properties

## Verification

To verify the fix worked:

1. **Check in Supabase Dashboard**:
   - Go to Table Editor → properties
   - You should see the `is_active` column (type: boolean, default: true)

2. **Test in your app**:
   - Visit http://localhost:3000
   - You should see properties loading without errors

---

## Why This Happened

The application code expects an enhanced database schema with the `is_active` column, but your current database still has the old schema. This is normal for new setups - you just need to run the migrations once.

## Need Help?

If you encounter any issues:

1. Check your Supabase connection in `.env.local`
2. Make sure you have the correct project ref
3. Verify you have admin access to the Supabase project

---

**Estimated Time:** 2-5 minutes  
**Difficulty:** Easy  
**Status:** This is a one-time setup step
