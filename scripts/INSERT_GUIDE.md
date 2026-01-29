# 🚀 Panduan Insert Data Resort Bali

## ⚠️ Problem: Kolom Tidak Ada

Error yang Anda alami menunjukkan bahwa beberapa kolom tidak ada di database:

- ❌ `bedrooms`
- ❌ `beds`
- ❌ `bathrooms`
- ❌ `latitude`
- ❌ `longitude`
- ❌ `is_active`

**Penyebab:** Migration `002_create_properties_table.sql` belum dijalankan.

## ✅ Solusi: 3 Pilihan

### PILIHAN 1: Test Insert Dulu (RECOMMENDED) ⭐

Coba insert 1 resort dulu untuk cek kolom apa yang benar-benar ada:

```sql
-- Copy & paste script ini di Supabase SQL Editor:
```

**File:** `scripts/test-insert.sql`

**Cara:**

1. Buka Supabase → SQL Editor
2. Copy isi file `test-insert.sql`
3. Paste & Run
4. Lihat hasilnya

**Jika berhasil:** Lanjut ke Pilihan 2
**Jika error:** Lanjut ke Pilihan 3

---

### PILIHAN 2: Insert Semua Resort (Kolom Minimal)

Jika test insert berhasil, gunakan script ini:

**File:** `scripts/simple-seed.sql`

Script ini:

- ✅ Insert satu per satu (12 resort)
- ✅ Hanya pakai kolom minimal: `id`, `title`, `description`, `price_per_night`, `location`, `image_urls`, `amenities`, `max_guests`
- ✅ Mudah debug jika ada error

**Cara:**

1. Buka Supabase → SQL Editor
2. Copy isi file `simple-seed.sql`
3. Paste & Run
4. Tunggu sampai selesai (12 INSERT statements)

---

### PILIHAN 3: Run Migration Dulu (Jika Kolom Tidak Ada)

Jika test insert gagal karena kolom tidak ada, run migration dulu:

**Step 1: Run Migration**

```sql
-- Copy & paste migration ini di Supabase SQL Editor:
```

**File:** `supabase/migrations/002_create_properties_table.sql`

**TAPI HATI-HATI!** Migration ini akan:

- ❌ Error jika table `properties` sudah ada
- ✅ Perlu drop table dulu

**Cara Aman:**

```sql
-- 1. Backup data lama (jika ada yang penting)
SELECT * FROM properties;

-- 2. Drop table lama
DROP TABLE IF EXISTS properties CASCADE;

-- 3. Lalu run migration 002_create_properties_table.sql
```

**Step 2: Setelah Migration Berhasil**

Gunakan script lengkap:

**File:** `scripts/clean-and-seed.sql` (script original)

---

## 🎯 Rekomendasi Saya

**Untuk Anda sekarang:**

### Step 1: Test Insert

```sql
-- Run ini dulu di Supabase SQL Editor:

DELETE FROM properties;

INSERT INTO properties (title, description, price_per_night, location, max_guests)
VALUES (
  'Bulgari Resort Bali',
  'Resort ultra-mewah di tebing Uluwatu',
  18500000,
  'Uluwatu, Bali',
  4
);

SELECT * FROM properties;
```

### Step 2A: Jika Berhasil ✅

Lanjut pakai `scripts/simple-seed.sql`

### Step 2B: Jika Error ❌

Cek error message:

- Error "column X does not exist" → Perlu run migration
- Error lain → Share error message

---

## 📝 Quick Reference

| File                              | Deskripsi                | Kapan Pakai            |
| --------------------------------- | ------------------------ | ---------------------- |
| `test-insert.sql`                 | Test 1 resort            | Cek kolom apa yang ada |
| `simple-seed.sql`                 | 12 resort, kolom minimal | Jika test berhasil     |
| `clean-and-seed.sql`              | 12 resort, semua kolom   | Setelah run migration  |
| `002_create_properties_table.sql` | Migration                | Jika kolom tidak ada   |

---

## 🆘 Troubleshooting

### Error: "column bedrooms does not exist"

**Solusi:** Pakai `simple-seed.sql` (tidak pakai kolom bedrooms)

### Error: "relation properties does not exist"

**Solusi:** Table belum dibuat, run migration dulu

### Error: "duplicate key value"

**Solusi:** Run `DELETE FROM properties;` dulu

### Error: "syntax error"

**Solusi:** Pastikan copy script lengkap, tidak terpotong

---

## 💡 Tips

1. **Selalu test dulu** dengan 1 insert sebelum insert semua
2. **Backup data** jika ada data penting
3. **Run satu per satu** jika ada error
4. **Cek error message** untuk tahu kolom mana yang tidak ada

---

## ✅ Success Checklist

Setelah berhasil insert, cek:

```sql
-- 1. Jumlah resort
SELECT COUNT(*) FROM properties;
-- Expected: 12

-- 2. List resort
SELECT title, location, price_per_night
FROM properties
ORDER BY price_per_night DESC;
-- Expected: 12 resort Bali

-- 3. Detail 1 resort
SELECT * FROM properties LIMIT 1;
-- Expected: Data lengkap resort
```

---

**Need Help?**
Jika masih error, share:

1. Error message lengkap
2. Script yang dipakai
3. Hasil dari: `SELECT column_name FROM information_schema.columns WHERE table_name = 'properties';`
