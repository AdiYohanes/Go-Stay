# Database Seeding Scripts

## ⚠️ PENTING: Data Masih "Desert Dome"?

Jika homepage masih menampilkan "Desert Dome Glamping", data di database Supabase belum diupdate.

## ✅ FIXED: Script Sudah Diperbaiki!

Script `clean-and-seed.sql` sudah diperbaiki untuk mengatasi error kolom `latitude` dan `longitude` yang tidak ada.

## Cara Update Data Resort Bali

### LANGKAH CEPAT:

1. **Buka Supabase Dashboard** → SQL Editor
2. **Copy isi file** `clean-and-seed.sql`
3. **Paste & Run** di SQL Editor
4. **Hard Refresh** browser (Ctrl+Shift+R)

### Detail Lengkap:

**File: `clean-and-seed.sql`**

Script ini akan:

- Menghapus SEMUA data lama (Desert Dome, dll)
- Insert 12 resort Bali yang baru
- **Hanya menggunakan kolom yang ada di database** (tidak pakai latitude/longitude)

**Cara Jalankan:**

```
1. Login https://supabase.com
2. Pilih project → SQL Editor
3. Copy SEMUA isi clean-and-seed.sql
4. Paste di editor
5. Klik "Run" (Ctrl+Enter)
6. Tunggu "Success"
7. Hard refresh browser
```

**Verifikasi:**

```sql
SELECT COUNT(*) FROM properties;
-- Harus return: 12

SELECT title, location FROM properties;
-- Harus muncul resort Bali
```

## 12 Resort Bali:

1. Bulgari Resort Bali (Uluwatu) - Rp 18.5 juta
2. Four Seasons Sayan (Ubud) - Rp 8.9 juta
3. W Bali Seminyak - Rp 3.2 juta
4. The St. Regis (Nusa Dua) - Rp 7.5 juta
5. COMO Uma Canggu - Rp 2.4 juta
6. Four Seasons Jimbaran - Rp 6.8 juta
7. Padma Resort Legian - Rp 1.85 juta
8. Mandapa Ritz-Carlton (Ubud) - Rp 12.5 juta
9. Grand Hyatt (Nusa Dua) - Rp 2.9 juta
10. Six Senses Uluwatu - Rp 9.8 juta
11. Potato Head Seminyak - Rp 2.8 juta
12. The Legian Seminyak - Rp 4.2 juta

## Troubleshooting:

**Error "column latitude does not exist"?**
✅ SUDAH DIPERBAIKI! Script sekarang tidak menggunakan kolom latitude/longitude.

**Data masih tidak berubah?**

- Clear cache browser
- Hard refresh (Ctrl+Shift+R)
- Cek console browser untuk error

**Error foreign key?**

```sql
TRUNCATE TABLE bookings, cart_items CASCADE;
TRUNCATE TABLE properties CASCADE;
-- Lalu run clean-and-seed.sql lagi
```
