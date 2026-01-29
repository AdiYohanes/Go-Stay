# Data Source Update - Database Only

## Perubahan

Aplikasi sekarang **100% menggunakan data dari database Supabase**, tidak lagi menggunakan mock data.

## File yang Diupdate

### 1. `src/lib/mock-data.ts`

- ❌ Dihapus: `MOCK_BALI_RESORTS`
- ❌ Dihapus: `MOCK_BOOKINGS`
- ✅ Dipertahankan: `LOCATION_OPTIONS` (untuk dropdown lokasi)
- ✅ Dipertahankan: `formatRupiah()` (helper function)

### 2. `src/app/(protected)/my-bookings/page.tsx`

- Diubah dari Client Component ke Server Component
- Sekarang fetch bookings dari database dengan query:
  ```typescript
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`*, property:properties(*)`)
    .eq("user_id", user.id);
  ```

## Cara Populate Data

Untuk menambahkan data resort ke database, jalankan script SQL:

```bash
# File: scripts/seed-bali-resorts.sql
```

**Langkah-langkah:**

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `scripts/seed-bali-resorts.sql`
3. Paste dan Run
4. Refresh aplikasi

## Data yang Tersedia

Script seed akan menambahkan 12 resort di Bali:

- Bulgari Resort Bali (Uluwatu)
- Four Seasons Resort Bali at Sayan (Ubud)
- W Bali Seminyak
- The St. Regis Bali Resort (Nusa Dua)
- COMO Uma Canggu
- Four Seasons Resort Bali at Jimbaran Bay
- Padma Resort Legian
- Mandapa, a Ritz-Carlton Reserve (Ubud)
- Grand Hyatt Bali (Nusa Dua)
- Six Senses Uluwatu
- Potato Head Suites & Studios (Seminyak)
- The Legian Seminyak

## Keuntungan

✅ Data konsisten antara development dan production
✅ Mudah diupdate tanpa deploy ulang
✅ Search dan filter bekerja dengan data real
✅ Performa lebih baik dengan caching database
✅ Tidak ada data hardcoded di aplikasi

## Testing

Untuk testing, gunakan data dari database development/staging Supabase.
