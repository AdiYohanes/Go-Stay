# 🔍 Debug: Search Tidak Muncul Hasil

## Kemungkinan Penyebab

### 1. Database Masih Kosong ⚠️

**Paling Mungkin!**

Cek apakah data sudah di-insert:

```sql
-- Run di Supabase SQL Editor:
SELECT COUNT(*) FROM properties;
```

**Expected:** 12
**Jika 0:** Data belum di-insert, run `scripts/minimal-seed.sql`

---

### 2. Bookings Table Tidak Ada

Availability check gagal karena table bookings belum dibuat.

Cek table bookings:

```sql
-- Run di Supabase SQL Editor:
SELECT COUNT(*) FROM bookings;
```

**Jika error "relation does not exist":**

- Table bookings belum dibuat
- Availability check return `false` untuk semua properties
- Semua properties di-filter out

**Solusi:** Buat table bookings dulu:

```sql
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3. Search Dengan Tanggal

Jika search DENGAN tanggal check-in/check-out:

- System akan check availability
- Jika bookings table error → semua properties unavailable
- Result: 0 properties

**Test:** Coba search TANPA tanggal (hanya lokasi atau tanpa filter)

---

## 🔧 Cara Debug

### Step 1: Cek Data Properties

```sql
SELECT id, title, location FROM properties LIMIT 5;
```

**Jika kosong:**

1. Buka `scripts/minimal-seed.sql`
2. Copy semua
3. Paste di Supabase SQL Editor
4. Run

---

### Step 2: Cek Table Bookings

```sql
SELECT * FROM bookings LIMIT 1;
```

**Jika error:**
Run migration untuk create table bookings (lihat solusi di atas)

---

### Step 3: Test Search Tanpa Filter

1. Buka `/properties` (tanpa search params)
2. Seharusnya muncul semua properties
3. Jika tidak muncul → masalah di database

---

### Step 4: Test Search Dengan Lokasi Saja

1. Search bar → Pilih lokasi "Ubud, Bali"
2. JANGAN pilih tanggal
3. JANGAN pilih guests
4. Klik Search
5. Seharusnya muncul properties di Ubud

---

### Step 5: Test Search Lengkap

1. Search bar → Pilih lokasi "Seminyak, Bali"
2. Pilih tanggal (contoh: besok - lusa)
3. Pilih guests (contoh: 2)
4. Klik Search
5. Seharusnya muncul properties available

---

## 🎯 Quick Fix

### Jika Database Kosong:

**Run ini di Supabase SQL Editor:**

```sql
-- 1. Hapus data lama (jika ada)
DELETE FROM properties;

-- 2. Insert 3 resort untuk test
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES
  ('Bulgari Resort Bali', 18500000, 'Uluwatu, Bali', 4),
  ('Four Seasons Sayan', 8900000, 'Ubud, Bali', 6),
  ('W Bali Seminyak', 3200000, 'Seminyak, Bali', 2);

-- 3. Cek hasil
SELECT * FROM properties;
```

**Lalu refresh browser** (Ctrl+Shift+R)

---

### Jika Bookings Table Tidak Ada:

**Run ini di Supabase SQL Editor:**

```sql
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📊 Expected Behavior

### Tanpa Filter:

- URL: `/properties`
- Result: Semua properties (12 resort)

### Dengan Lokasi:

- URL: `/properties?location=Ubud%2C+Bali`
- Result: Properties di Ubud saja

### Dengan Tanggal:

- URL: `/properties?checkIn=2024-03-01&checkOut=2024-03-05`
- Result: Properties yang available di tanggal tersebut

### Dengan Semua Filter:

- URL: `/properties?location=Seminyak&checkIn=2024-03-01&checkOut=2024-03-05&guests=2`
- Result: Properties di Seminyak, available, capacity >= 2

---

## 🆘 Troubleshooting

### "No properties found"

**Cek:**

1. Database ada data? → `SELECT COUNT(*) FROM properties;`
2. Search params benar? → Cek URL
3. Availability check error? → Cek console browser (F12)

### Properties muncul di homepage tapi tidak di search

**Kemungkinan:**

- Availability check gagal
- Bookings table error
- Filter terlalu ketat

**Test:**

- Buka `/properties` langsung (tanpa search)
- Jika muncul → masalah di search filter
- Jika tidak muncul → masalah di database

---

## ✅ Checklist

- [ ] Database ada data (SELECT COUNT(\*) FROM properties)
- [ ] Table bookings ada (SELECT \* FROM bookings LIMIT 1)
- [ ] Homepage menampilkan properties
- [ ] `/properties` menampilkan properties
- [ ] Search tanpa filter menampilkan properties
- [ ] Search dengan lokasi menampilkan properties
- [ ] Search dengan tanggal menampilkan properties

---

**Masih bermasalah?**

Share info ini:

1. Hasil query: `SELECT COUNT(*) FROM properties;`
2. Hasil query: `SELECT COUNT(*) FROM bookings;`
3. URL search yang dipakai
4. Screenshot hasil search
