# 🚀 Cara Run Seed Script - Visual Guide

## ⚡ Quick Start (5 Menit)

### Step 1: Buka Supabase

```
🌐 https://supabase.com
```

### Step 2: Login & Pilih Project

```
1. Login dengan account Anda
2. Klik project "Go-Stay" (atau nama project Anda)
```

### Step 3: Buka SQL Editor

```
Di sidebar kiri, klik:
📝 SQL Editor
```

### Step 4: Copy Script

```
Di VS Code:
1. Buka file: scripts/clean-and-seed.sql
2. Select All: Ctrl+A (Windows) atau Cmd+A (Mac)
3. Copy: Ctrl+C (Windows) atau Cmd+C (Mac)
```

### Step 5: Paste & Run

```
Di Supabase SQL Editor:
1. Paste: Ctrl+V (Windows) atau Cmd+V (Mac)
2. Run: Klik tombol "Run" ATAU tekan Ctrl+Enter
3. Tunggu... (biasanya 2-3 detik)
4. Lihat hasil: "Success" ✅
```

### Step 6: Verifikasi

```sql
-- Copy & run query ini untuk cek:
SELECT COUNT(*) FROM properties;
```

**Expected result:** `12`

```sql
-- Lihat semua resort:
SELECT title, location, price_per_night
FROM properties
ORDER BY price_per_night DESC;
```

**Expected result:** 12 resort Bali

### Step 7: Refresh Browser

```
Di browser aplikasi Anda:
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

## ✅ Success Indicators

Setelah refresh, Anda akan lihat:

### Homepage:

- ✅ "Bulgari Resort Bali" (bukan "Desert Dome")
- ✅ Harga dalam Rupiah (Rp 1.85 juta - Rp 18.5 juta)
- ✅ Lokasi Bali (Ubud, Seminyak, Uluwatu, dll)
- ✅ 12 resort cards dengan warna menarik

### Search Bar:

- ✅ Dropdown lokasi menampilkan area Bali
- ✅ Date picker dengan smart display
- ✅ Guest selector

### Properties Page:

- ✅ Semua 12 resort Bali
- ✅ Filter harga bekerja
- ✅ Search by location bekerja

## 🔧 Troubleshooting

### ❌ Error: "foreign key constraint"

**Solusi:** Run ini dulu:

```sql
TRUNCATE TABLE bookings, cart_items, reviews CASCADE;
TRUNCATE TABLE properties CASCADE;
```

Lalu run `clean-and-seed.sql` lagi.

### ❌ Masih muncul "Desert Dome"

**Solusi:**

1. Cek apakah script berhasil run (ada "Success" message?)
2. Hard refresh browser: Ctrl+Shift+R
3. Clear browser cache
4. Coba buka di incognito/private window

### ❌ Tidak ada data sama sekali

**Solusi:**

1. Buka browser console (F12 → Console tab)
2. Cek error messages
3. Verifikasi di Supabase: `SELECT * FROM properties;`
4. Pastikan tidak ada error di Supabase logs

### ❌ Error: "column latitude does not exist"

**Solusi:** ✅ Sudah diperbaiki! Script baru tidak pakai kolom latitude/longitude.
Pastikan Anda copy script terbaru dari `scripts/clean-and-seed.sql`.

## 📊 What The Script Does

```sql
-- 1. Hapus semua data lama
TRUNCATE TABLE properties CASCADE;

-- 2. Insert 12 resort Bali baru
INSERT INTO properties (...) VALUES
  ('bali-bulgari-uluwatu', 'Bulgari Resort Bali', ...),
  ('bali-fourseas-sayan', 'Four Seasons Resort Bali at Sayan', ...),
  ... (10 more resorts)

-- 3. Verifikasi
SELECT id, title, location, price_per_night
FROM properties
ORDER BY price_per_night DESC;
```

## 🎯 Expected Data

| Resort                | Location | Price/Night   |
| --------------------- | -------- | ------------- |
| Bulgari Resort Bali   | Uluwatu  | Rp 18,500,000 |
| Mandapa Ritz-Carlton  | Ubud     | Rp 12,500,000 |
| Six Senses Uluwatu    | Uluwatu  | Rp 9,800,000  |
| Four Seasons Sayan    | Ubud     | Rp 8,900,000  |
| The St. Regis         | Nusa Dua | Rp 7,500,000  |
| Four Seasons Jimbaran | Jimbaran | Rp 6,800,000  |
| The Legian Seminyak   | Seminyak | Rp 4,200,000  |
| W Bali Seminyak       | Seminyak | Rp 3,200,000  |
| Grand Hyatt           | Nusa Dua | Rp 2,900,000  |
| Potato Head Seminyak  | Seminyak | Rp 2,800,000  |
| COMO Uma Canggu       | Canggu   | Rp 2,400,000  |
| Padma Resort Legian   | Legian   | Rp 1,850,000  |

## 💡 Tips

1. **Backup first** (optional):

   ```sql
   -- Export current data (if needed)
   SELECT * FROM properties;
   ```

2. **Run during low traffic**: Script will delete all properties temporarily

3. **Test in staging first**: If you have a staging environment

4. **Check related tables**: Make sure no active bookings reference old properties

## 🎉 Done!

Setelah step ini selesai, aplikasi Anda akan:

- ✅ Menampilkan resort Bali yang realistis
- ✅ Menggunakan harga Indonesia yang sesuai
- ✅ Memiliki data yang konsisten di seluruh aplikasi
- ✅ Siap untuk demo ke client! 🚀

---

**Need more help?** Check:

- `NEXT_STEPS.md` - Detailed instructions
- `DATABASE_SEED_FIX.md` - Technical details
- `FINAL_STATUS.md` - Complete summary
