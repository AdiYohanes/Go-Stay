# 🎯 CARA INSERT DATA - Step by Step

## ⚡ COBA INI DULU (Paling Mudah)

### Script: `minimal-seed.sql`

Script ini **PALING SEDERHANA**:

- ✅ Hanya 4 kolom: `title`, `price_per_night`, `location`, `max_guests`
- ✅ Insert satu per satu (12 resort)
- ✅ Mudah lihat mana yang error

### Cara Pakai:

1. **Buka Supabase**

   ```
   https://supabase.com → Project → SQL Editor
   ```

2. **Copy Script**
   - Buka file: `scripts/minimal-seed.sql`
   - Copy SEMUA isinya (Ctrl+A, Ctrl+C)

3. **Paste & Run**
   - Paste di SQL Editor (Ctrl+V)
   - Klik "Run" atau Ctrl+Enter

4. **Lihat Hasil**
   - Jika berhasil: Akan muncul 12 rows
   - Jika error: Lihat error message

---

## 📊 Jika Berhasil

Anda akan lihat:

```
total
-----
12

title                                    | location        | price_per_night
-----------------------------------------|-----------------|----------------
Bulgari Resort Bali                      | Uluwatu, Bali   | 18500000
Mandapa, a Ritz-Carlton Reserve          | Ubud, Bali      | 12500000
Six Senses Uluwatu                       | Uluwatu, Bali   | 9800000
...
```

**Next Step:**

1. Hard refresh browser (Ctrl+Shift+R)
2. Buka homepage
3. Seharusnya muncul 12 resort Bali!

---

## ❌ Jika Masih Error

### Error 1: "column X does not exist"

**Contoh:**

```
ERROR: column "max_guests" does not exist
```

**Artinya:** Table properties belum punya kolom yang dibutuhkan.

**Solusi:** Cek kolom apa saja yang ada:

```sql
-- Run query ini:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
```

**Lalu share hasilnya ke saya**, saya akan buatkan script yang sesuai.

---

### Error 2: "relation properties does not exist"

**Artinya:** Table properties belum dibuat sama sekali.

**Solusi:** Buat table dulu:

```sql
-- Run ini dulu:
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  max_guests INTEGER DEFAULT 1,
  image_urls TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Lalu run `minimal-seed.sql` lagi.

---

### Error 3: "duplicate key value"

**Artinya:** Data sudah ada, ID bentrok.

**Solusi:**

```sql
-- Hapus data lama dulu:
DELETE FROM properties;

-- Atau drop & recreate:
TRUNCATE TABLE properties CASCADE;
```

Lalu run `minimal-seed.sql` lagi.

---

## 🔄 Alternatif: Insert Manual Satu-Satu

Jika script otomatis tidak jalan, coba insert manual:

### Insert Resort 1:

```sql
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Bulgari Resort Bali', 18500000, 'Uluwatu, Bali', 4);
```

**Klik Run** → Lihat hasilnya

### Jika Berhasil:

Lanjut insert resort 2, 3, dst...

### Jika Error:

Share error message lengkap.

---

## 📝 Summary Script Files

| File                 | Kolom    | Keterangan            |
| -------------------- | -------- | --------------------- |
| `minimal-seed.sql`   | 4 kolom  | **COBA INI DULU** ⭐  |
| `simple-seed.sql`    | 8 kolom  | Jika minimal berhasil |
| `test-insert.sql`    | 5 kolom  | Test 1 resort         |
| `clean-and-seed.sql` | 11 kolom | Setelah migration     |

---

## 💡 Tips Debug

1. **Cek table ada atau tidak:**

   ```sql
   SELECT * FROM properties LIMIT 1;
   ```

2. **Cek kolom apa saja yang ada:**

   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'properties';
   ```

3. **Cek jumlah data:**

   ```sql
   SELECT COUNT(*) FROM properties;
   ```

4. **Hapus semua data:**
   ```sql
   DELETE FROM properties;
   ```

---

## ✅ Checklist

- [ ] Buka Supabase SQL Editor
- [ ] Copy `minimal-seed.sql`
- [ ] Paste & Run
- [ ] Cek hasil: `SELECT COUNT(*) FROM properties;`
- [ ] Hard refresh browser
- [ ] Cek homepage

---

**Masih Error?**

Share info ini:

1. Error message lengkap
2. Hasil query: `SELECT column_name FROM information_schema.columns WHERE table_name = 'properties';`
3. Script yang dipakai

Saya akan bantu fix! 🚀
