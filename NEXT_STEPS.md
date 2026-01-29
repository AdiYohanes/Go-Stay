# 🎯 Next Steps - Update Database dengan Resort Bali

## Status Saat Ini

✅ **Code sudah siap:**

- Homepage fetch data dari database (bukan mock data)
- Search & filter bekerja dengan database
- Semua error kolom sudah diperbaiki
- Script seed sudah diperbaiki (tidak ada error latitude/longitude)

❌ **Yang masih perlu dilakukan:**

- Database masih berisi data lama ("Desert Dome Glamping")
- Perlu run script seed untuk update ke resort Bali

## 🚀 Cara Update Database (5 Menit)

### Step 1: Buka Supabase Dashboard

```
1. Buka https://supabase.com
2. Login ke account Anda
3. Pilih project Go-Stay
4. Klik "SQL Editor" di sidebar kiri
```

### Step 2: Copy Script Seed

```
1. Buka file: scripts/clean-and-seed.sql
2. Copy SEMUA isinya (Ctrl+A, Ctrl+C)
```

### Step 3: Run Script

```
1. Paste di SQL Editor (Ctrl+V)
2. Klik tombol "Run" atau tekan Ctrl+Enter
3. Tunggu sampai muncul "Success" message
4. Cek hasil: SELECT COUNT(*) FROM properties;
   (Harus return: 12)
```

### Step 4: Refresh Browser

```
1. Buka aplikasi di browser
2. Hard refresh: Ctrl+Shift+R (Windows) atau Cmd+Shift+R (Mac)
3. Homepage sekarang akan menampilkan resort Bali!
```

## 📋 Hasil Yang Diharapkan

Setelah run script, homepage akan menampilkan:

### Resort Bali (12 properties):

1. **Bulgari Resort Bali** (Uluwatu) - Rp 18.5 juta/malam
2. **Mandapa Ritz-Carlton** (Ubud) - Rp 12.5 juta/malam
3. **Six Senses Uluwatu** - Rp 9.8 juta/malam
4. **Four Seasons Sayan** (Ubud) - Rp 8.9 juta/malam
5. **The St. Regis** (Nusa Dua) - Rp 7.5 juta/malam
6. **Four Seasons Jimbaran** - Rp 6.8 juta/malam
7. **The Legian Seminyak** - Rp 4.2 juta/malam
8. **W Bali Seminyak** - Rp 3.2 juta/malam
9. **Grand Hyatt** (Nusa Dua) - Rp 2.9 juta/malam
10. **Potato Head Seminyak** - Rp 2.8 juta/malam
11. **COMO Uma Canggu** - Rp 2.4 juta/malam
12. **Padma Resort Legian** - Rp 1.85 juta/malam

### Fitur Yang Akan Bekerja:

- ✅ Homepage menampilkan 12 resort Bali
- ✅ Search bar dengan lokasi Bali (Ubud, Seminyak, Uluwatu, dll)
- ✅ Filter harga (Rp 750K - Rp 18.5M)
- ✅ Property cards dengan warna menarik
- ✅ Semua data dari database (no mock data)

## 🔧 Troubleshooting

### Problem: Data masih "Desert Dome"

**Solusi:**

1. Pastikan script sudah berhasil run (cek "Success" message)
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache

### Problem: Error "foreign key constraint"

**Solusi:** Run ini dulu sebelum seed script:

```sql
TRUNCATE TABLE bookings, cart_items, reviews CASCADE;
TRUNCATE TABLE properties CASCADE;
```

Lalu run `clean-and-seed.sql` lagi.

### Problem: Tidak ada data sama sekali

**Solusi:**

1. Cek console browser (F12 → Console tab)
2. Cek apakah ada error di Supabase logs
3. Verifikasi: `SELECT * FROM properties;`

## 📝 Files Yang Sudah Diperbaiki

1. **scripts/clean-and-seed.sql** - Script seed tanpa error
2. **scripts/README.md** - Instruksi lengkap
3. **DATABASE_SEED_FIX.md** - Dokumentasi fix
4. **src/lib/mock-data.ts** - Hanya helper functions
5. **src/app/page.tsx** - Fetch dari database
6. **src/actions/properties.ts** - Tidak filter is_active

## ✨ Summary

**Yang sudah dikerjakan:**

- ✅ Hapus semua mock data usage
- ✅ Update homepage fetch dari database
- ✅ Fix error kolom (is_active, rating, latitude, longitude)
- ✅ Buat seed script dengan 12 resort Bali
- ✅ Fix seed script (hapus kolom yang tidak ada)
- ✅ Update price tiers di PropertyCard
- ✅ Update DestinationPicker dengan lokasi Bali
- ✅ Improve design dengan warna menarik
- ✅ Fix date display di SearchBar

**Yang perlu Anda lakukan:**

1. Run script `clean-and-seed.sql` di Supabase SQL Editor
2. Hard refresh browser
3. Enjoy! 🎉

---

**Need Help?**
Jika ada masalah, cek file `DATABASE_SEED_FIX.md` untuk troubleshooting detail.
