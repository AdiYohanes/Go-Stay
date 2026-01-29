# ⚡ QUICK START - Insert Data Resort Bali

## 🎯 Yang Harus Anda Lakukan SEKARANG

### Step 1: Buka File Ini

```
scripts/minimal-seed.sql
```

### Step 2: Copy Semua Isinya

- Ctrl+A (select all)
- Ctrl+C (copy)

### Step 3: Buka Supabase

```
https://supabase.com
→ Login
→ Pilih Project
→ Klik "SQL Editor" (di sidebar kiri)
```

### Step 4: Paste & Run

- Ctrl+V (paste)
- Klik tombol "Run" ATAU tekan Ctrl+Enter
- Tunggu...

### Step 5: Cek Hasil

Jika berhasil, akan muncul:

```
total
-----
12
```

Dan list 12 resort Bali.

### Step 6: Refresh Browser

- Buka aplikasi di browser
- Hard refresh: Ctrl+Shift+R
- Homepage sekarang menampilkan resort Bali! 🎉

---

## ❌ Jika Error

### Cek Kolom Yang Ada:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'properties';
```

**Share hasilnya**, saya akan buatkan script yang sesuai.

---

## 📁 File Yang Tersedia

1. **minimal-seed.sql** ⭐ **COBA INI DULU**
   - Paling sederhana
   - Hanya 4 kolom
   - Insert satu per satu

2. **simple-seed.sql**
   - Lebih lengkap
   - 8 kolom (dengan description, images, amenities)
   - Jika minimal berhasil

3. **test-insert.sql**
   - Test 1 resort dulu
   - Untuk debug

4. **CARA_INSERT.md**
   - Panduan lengkap
   - Troubleshooting

---

## ✅ Expected Result

Setelah berhasil:

- ✅ 12 resort Bali di database
- ✅ Homepage menampilkan resort Bali
- ✅ Harga dalam Rupiah (Rp 1.85M - Rp 18.5M)
- ✅ Lokasi Bali (Ubud, Seminyak, Uluwatu, dll)

---

**Need Help?** Baca `scripts/CARA_INSERT.md` untuk troubleshooting lengkap.
