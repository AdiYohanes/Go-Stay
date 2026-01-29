# ❤️ Favorites Feature Documentation

## Overview

Fitur favorites memungkinkan user untuk menyimpan resort favorit mereka untuk akses mudah nanti.

## Flow Diagram

```
User Click Favorite Button
    ↓
Check Authentication
    ↓
    ├─ Not Logged In
    │     ↓
    │     Show Toast: "Please login to add favorites"
    │     ↓
    │     Redirect to /login
    │
    └─ Logged In
          ↓
          Toggle Favorite (Add/Remove)
          ↓
          Save to Database (favorites table)
          ↓
          Show Success Toast
          ↓
          Update UI (heart icon filled/unfilled)
```

## Components

### 1. FavoriteButton Component

**File:** `src/components/property/FavoriteButton.tsx`

**Features:**

- Heart icon with animation
- Optimistic UI updates
- Disabled state during pending
- Accessible (aria-label)

**Usage:**

```tsx
<FavoriteButton propertyId="property-id" initialIsFavorited={false} size="md" />
```

### 2. useFavorites Hook

**File:** `src/hooks/useFavorites.ts`

**Features:**

- Optimistic updates
- Authentication check
- Auto redirect to login if not authenticated
- Toast notifications
- Error handling with rollback

**Logic:**

```typescript
const toggleFavorite = () => {
  // 1. Optimistic update (instant UI feedback)
  setIsFavorited(!isFavorited);

  // 2. Call server action
  const result = await addToFavorites(propertyId);

  // 3. Check for auth error
  if (result.error?.includes("Authentication required")) {
    toast.error("Please login to add favorites");
    router.push("/login");
    return;
  }

  // 4. Handle success/error
  if (result.success) {
    toast.success("Added to favorites");
  } else {
    setIsFavorited(previousState); // Rollback
    toast.error(result.error);
  }
};
```

### 3. Favorites Actions

**File:** `src/actions/favorites.ts`

**Functions:**

#### addToFavorites(propertyId)

- Check authentication
- Validate property exists
- Check if already favorited
- Insert to favorites table
- Revalidate paths

#### removeFromFavorites(propertyId)

- Check authentication
- Check if favorite exists
- Delete from favorites table
- Revalidate paths

#### getUserFavorites(params)

- Get user's favorites with pagination
- Include full property details
- Return properties array

#### checkIsFavorite(propertyId)

- Check if property is favorited by current user
- Return boolean

### 4. Favorites Page

**File:** `src/app/favorites/page.tsx`

**Features:**

- Protected route (requires login)
- Display all favorited properties
- Empty state with CTA
- Property grid layout
- Shows favorite count

**Access:** `/favorites`

## Database Schema

### favorites Table

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);
```

## User Experience

### Scenario 1: Not Logged In

1. User clicks heart icon on property card
2. Toast appears: "Please login to add favorites"
3. User redirected to `/login`
4. After login, user can add favorites

### Scenario 2: Logged In - Add Favorite

1. User clicks heart icon (unfilled)
2. Heart instantly fills (optimistic update)
3. Toast appears: "Added to favorites"
4. Property saved to database
5. Heart stays filled

### Scenario 3: Logged In - Remove Favorite

1. User clicks heart icon (filled)
2. Heart instantly unfills (optimistic update)
3. Toast appears: "Removed from favorites"
4. Property removed from database
5. Heart stays unfilled

### Scenario 4: View Favorites

1. User navigates to `/favorites`
2. See all favorited properties
3. Can click property to view details
4. Can remove from favorites by clicking heart

## Error Handling

### Authentication Error

```typescript
if (result.error?.includes("Authentication required")) {
  toast.error("Please login to add favorites");
  router.push("/login");
  return;
}
```

### Already Favorited

```typescript
if (existingFavorite) {
  throw new ConflictError("Property is already in favorites");
}
```

### Property Not Found

```typescript
if (!property) {
  throw new NotFoundError("Property");
}
```

### Network Error

```typescript
catch (error) {
  setIsFavorited(previousState) // Rollback
  toast.error('An unexpected error occurred')
}
```

## Features

### ✅ Optimistic Updates

- UI updates instantly before server response
- Better user experience
- Rollback on error

### ✅ Authentication Check

- Redirect to login if not authenticated
- Clear error messages
- Seamless flow

### ✅ Toast Notifications

- Success: "Added to favorites"
- Success: "Removed from favorites"
- Error: "Please login to add favorites"
- Error: Custom error messages

### ✅ Persistent Storage

- Saved to database
- Survives page refresh
- Synced across devices

### ✅ Protected Routes

- Favorites page requires login
- Auto redirect to login
- Return to favorites after login

## Testing Checklist

- [ ] Click favorite when not logged in → Redirect to login
- [ ] Click favorite when logged in → Add to favorites
- [ ] Click favorite again → Remove from favorites
- [ ] Navigate to /favorites → See all favorites
- [ ] Remove from favorites page → Property removed
- [ ] Refresh page → Favorites persist
- [ ] Login from different device → Favorites synced

## API Endpoints

### Add to Favorites

```typescript
POST /api/favorites
Body: { propertyId: string }
Response: { success: true, data: { id: string } }
```

### Remove from Favorites

```typescript
DELETE /api/favorites
Body: { propertyId: string }
Response: { success: true, data: { id: string } }
```

### Get User Favorites

```typescript
GET /api/favorites?page=1&limit=20
Response: {
  success: true,
  data: {
    properties: Property[],
    total: number,
    page: number,
    totalPages: number,
    hasMore: boolean
  }
}
```

## Integration Points

### PropertyCard

```tsx
<FavoriteButton propertyId={property.id} initialIsFavorited={isFavorited} />
```

### Property Detail Page

```tsx
<FavoriteButton
  propertyId={property.id}
  initialIsFavorited={isFavorited}
  size="lg"
/>
```

### Favorites Page

```tsx
{
  properties.map((property) => (
    <PropertyCard
      key={property.id}
      property={property}
      initialIsFavorited={true}
    />
  ));
}
```

## Summary

✅ **Authentication:** Redirect to login if not authenticated
✅ **Optimistic UI:** Instant feedback
✅ **Error Handling:** Graceful rollback
✅ **Toast Notifications:** Clear feedback
✅ **Persistent Storage:** Database backed
✅ **Protected Routes:** Secure access
✅ **Responsive:** Works on all devices

Favorites feature is fully functional and ready to use! ❤️
