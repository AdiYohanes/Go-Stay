# 🔍 Search & Filter Flow Documentation

## Overview

Search bar sudah dikonfigurasi untuk melakukan filtering berdasarkan:

1. ✅ **Lokasi** - Filter by location
2. ✅ **Ketersediaan** - Check availability for date range
3. ✅ **Kapasitas** - Filter by guest count

## Flow Diagram

```
User Input (SearchBar)
    ↓
    ├─ Location: "Ubud, Bali"
    ├─ Check-in: "2024-03-01"
    ├─ Check-out: "2024-03-05"
    └─ Guests: 4
    ↓
searchProperties() Action
    ↓
    ├─ 1. Filter by Location (SQL ILIKE)
    │     WHERE location ILIKE '%Ubud%'
    │
    ├─ 2. Filter by Guest Capacity (SQL GTE)
    │     WHERE max_guests >= 4
    │
    ├─ 3. Fetch Properties (with extra buffer)
    │     Fetch limit * 3 to account for availability filtering
    │
    ├─ 4. Check Availability (for each property)
    │     checkAvailability(property_id, check_in, check_out)
    │     - Query bookings table
    │     - Check for date overlaps
    │     - Return available: true/false
    │
    └─ 5. Filter Available Properties
          Only return properties where available = true
    ↓
Return Filtered Results
```

## Code Implementation

### 1. Location Filter

**File:** `src/actions/search.ts` (Line 44-47)

```typescript
if (location) {
  query = query.ilike("location", `%${location}%`);
}
```

**How it works:**

- Case-insensitive partial match
- "Ubud" matches "Ubud, Bali"
- "Seminyak" matches "Seminyak, Bali"

### 2. Guest Capacity Filter

**File:** `src/actions/search.ts` (Line 51-54)

```typescript
if (guests) {
  query = query.gte("max_guests", guests);
}
```

**How it works:**

- Only shows properties where `max_guests >= requested_guests`
- If user searches for 4 guests, only properties with capacity ≥ 4 shown
- Ensures property can accommodate all guests

### 3. Availability Check

**File:** `src/actions/search.ts` (Line 99-118)

```typescript
if (checkIn && checkOut) {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  const availabilityChecks = await Promise.all(
    filteredProperties.map(async (property) => {
      const result = await checkAvailability(property.id, startDate, endDate);
      return { property, available: result.available };
    }),
  );

  filteredProperties = availabilityChecks
    .filter(({ available }) => available)
    .map(({ property }) => property);
}
```

**How it works:**

- Calls `checkAvailability()` for each property
- Checks bookings table for date overlaps
- Only returns properties with no conflicting bookings

### 4. Availability Logic

**File:** `src/lib/availability.server.ts`

```typescript
// Check for overlapping bookings
const { data: bookings, error } = await supabase
  .from("bookings")
  .select("id, start_date, end_date, status")
  .eq("property_id", propertyId)
  .in("status", ["confirmed", "pending"])
  .or(
    `and(start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()})`,
  );
```

**Overlap detection:**

- Booking overlaps if: `booking.start_date <= search.end_date AND booking.end_date >= search.start_date`
- Only checks confirmed/pending bookings
- Returns `available: false` if any overlap found

## Search Bar Integration

**File:** `src/components/search/SearchBar.tsx` (Line 233-248)

```typescript
const handleSearch = () => {
  const params: SearchParams = {
    location: location || undefined,
    checkIn: dateRange?.from?.toISOString(),
    checkOut: dateRange?.to?.toISOString(),
    guests: totalGuests > 0 ? totalGuests : undefined,
  };

  // Navigate to /properties with search params
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });
  router.push(`/properties?${searchParams.toString()}`);
};
```

## Example Scenarios

### Scenario 1: Location Only

**Input:**

- Location: "Ubud, Bali"
- Dates: Not selected
- Guests: Not selected

**Result:**

- Shows all properties in Ubud
- No availability check (no dates)
- No guest filter

### Scenario 2: Location + Guests

**Input:**

- Location: "Seminyak, Bali"
- Dates: Not selected
- Guests: 4

**Result:**

- Shows properties in Seminyak
- Only properties with `max_guests >= 4`
- No availability check (no dates)

### Scenario 3: Full Search

**Input:**

- Location: "Uluwatu, Bali"
- Dates: March 1-5, 2024
- Guests: 2

**Result:**

- Shows properties in Uluwatu
- Only properties with `max_guests >= 2`
- Only properties available March 1-5
- Checks bookings table for conflicts

### Scenario 4: Dates + Guests (No Location)

**Input:**

- Location: Not selected
- Dates: March 10-15, 2024
- Guests: 6

**Result:**

- Shows ALL locations in Bali
- Only properties with `max_guests >= 6`
- Only properties available March 10-15

## Performance Optimization

### Buffer Fetching

**File:** `src/actions/search.ts` (Line 82-84)

```typescript
// Fetch more results to account for availability filtering
const fetchLimit = checkIn && checkOut ? limit * 3 : limit;
```

**Why:**

- Availability check happens AFTER database query
- Some properties will be filtered out
- Fetch 3x more to ensure enough results after filtering

### Parallel Availability Checks

```typescript
const availabilityChecks = await Promise.all(
  filteredProperties.map(async (property) => {
    const result = await checkAvailability(property.id, startDate, endDate);
    return { property, available: result.available };
  }),
);
```

**Why:**

- Check all properties simultaneously
- Much faster than sequential checks
- Uses Promise.all for parallel execution

## Testing Checklist

- [ ] Search by location only → Shows correct location
- [ ] Search by guests only → Shows properties with enough capacity
- [ ] Search by dates only → Shows available properties
- [ ] Search with all filters → Shows properties matching all criteria
- [ ] Search with no filters → Shows all properties
- [ ] Search with unavailable dates → Shows "No results"
- [ ] Search with high guest count → Shows only large properties

## Database Requirements

### Properties Table

```sql
- id (UUID)
- title (TEXT)
- location (TEXT) -- Used for location filter
- max_guests (INTEGER) -- Used for capacity filter
- price_per_night (DECIMAL)
- image_urls (TEXT[])
- amenities (TEXT[])
```

### Bookings Table

```sql
- id (UUID)
- property_id (UUID) -- FK to properties
- start_date (DATE) -- Used for availability check
- end_date (DATE) -- Used for availability check
- status (TEXT) -- 'confirmed', 'pending', 'cancelled'
```

## Error Handling

### Availability Check Fails

```typescript
try {
  const result = await checkAvailability(property.id, startDate, endDate);
  return { property, available: result.available };
} catch (error) {
  console.error(
    `Error checking availability for property ${property.id}:`,
    error,
  );
  // If availability check fails, exclude the property to be safe
  return { property, available: false };
}
```

**Behavior:**

- If availability check fails, property is excluded
- Safer to show fewer results than show unavailable properties
- Error logged for debugging

## Summary

✅ **Location Filter:** SQL ILIKE query
✅ **Capacity Filter:** SQL GTE query on max_guests
✅ **Availability Filter:** Check bookings table for overlaps
✅ **Performance:** Parallel checks, buffer fetching
✅ **Error Handling:** Graceful degradation

All filters work together to show only relevant, available properties!
