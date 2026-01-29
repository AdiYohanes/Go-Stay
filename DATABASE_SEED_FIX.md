# ✅ Database Seed Script - FIXED

## Problem Yang Diperbaiki

Error sebelumnya:

```
ERROR: 42703: column "latitude" of relation "properties" does not exist
```

## Solusi

Script `scripts/clean-and-seed.sql` sudah diperbaiki dengan:

1. **Menghapus kolom yang tidak ada:**
   - ❌ `latitude`
   - ❌ `longitude`
   - ❌ `created_at` (akan diisi otomatis oleh database)
   - ❌ `updated_at` (akan diisi otomatis oleh database)

2. **Hanya menggunakan kolom yang pasti ada:**
   - ✅ `id`, `title`, `description`
   - ✅ `price_per_night`, `location`
   - ✅ `image_urls`, `amenities`
   - ✅ `max_guests`, `bedrooms`, `beds`, `bathrooms`
   - ✅ `is_active`

## Cara Menggunakan

### 1. Buka Supabase Dashboard

```
https://supabase.com → Your Project → SQL Editor
```

### 2. Copy Script

Buka file `scripts/clean-and-seed.sql` dan copy semua isinya.

### 3. Paste & Run

- Paste di SQL Editor
- Klik "Run" atau tekan Ctrl+Enter
- Tunggu sampai muncul "Success"

### 4. Verifikasi

```sql
SELECT COUNT(*) FROM properties;
-- Harus return: 12

SELECT id, title, location, price_per_night
FROM properties
ORDER BY price_per_night DESC;
-- Harus muncul 12 resort Bali
```

### 5. Hard Refresh Browser

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## Hasil Yang Diharapkan

Homepage akan menampilkan 12 resort Bali:

1. **Bulgari Resort Bali** (Uluwatu) - Rp 18,500,000
2. **Mandapa Ritz-Carlton** (Ubud) - Rp 12,500,000
3. **Six Senses Uluwatu** - Rp 9,800,000
4. **Four Seasons Sayan** (Ubud) - Rp 8,900,000
5. **The St. Regis** (Nusa Dua) - Rp 7,500,000
6. **Four Seasons Jimbaran** - Rp 6,800,000
7. **The Legian Seminyak** - Rp 4,200,000
8. **W Bali Seminyak** - Rp 3,200,000
9. **Grand Hyatt** (Nusa Dua) - Rp 2,900,000
10. **Potato Head Seminyak** - Rp 2,800,000
11. **COMO Uma Canggu** - Rp 2,400,000
12. **Padma Resort Legian** - Rp 1,850,000

## Troubleshooting

### Masih muncul "Desert Dome"?

- Pastikan script sudah berhasil dijalankan (cek "Success" message)
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache

### Error "foreign key constraint"?

Jalankan ini dulu sebelum seed script:

```sql
TRUNCATE TABLE bookings, cart_items, reviews CASCADE;
TRUNCATE TABLE properties CASCADE;
```

### Data tidak muncul sama sekali?

Cek apakah ada error di console browser (F12 → Console tab)

## Status

✅ Script sudah diperbaiki dan siap digunakan
✅ Tidak ada lagi error kolom latitude/longitude
✅ Semua data resort Bali dengan harga Indonesia
✅ Search dan filter akan bekerja dengan data baru
