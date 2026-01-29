# 🖼️ Image Options untuk Resort Data

## Pilihan 1: Gambar Lokal (Desert Dome) ⚠️

**File:** `scripts/seed-with-local-images.sql`

### Kelebihan:

- ✅ Tidak perlu internet untuk load gambar
- ✅ Load lebih cepat (lokal)
- ✅ Tidak ada external dependency

### Kekurangan:

- ❌ Gambar desert dome (tidak sesuai dengan resort Bali)
- ❌ Semua resort pakai gambar yang sama
- ❌ Tidak realistis untuk demo
- ❌ Gambar tidak match dengan deskripsi resort

### Path Gambar:

```
/properties/desert-dome/1.png
/properties/desert-dome/2.png
/properties/desert-dome/3.png
/properties/desert-dome/4.png
/properties/desert-dome/5.png
```

### Contoh:

```sql
ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', ...]
```

---

## Pilihan 2: Unsplash Images (Current) ✅ RECOMMENDED

**File:** `scripts/simple-seed.sql` atau `scripts/minimal-seed.sql`

### Kelebihan:

- ✅ Gambar berkualitas tinggi
- ✅ Sesuai dengan tema resort mewah
- ✅ Berbeda untuk setiap resort
- ✅ Realistis untuk demo ke client
- ✅ Professional appearance

### Kekurangan:

- ❌ Perlu internet untuk load pertama kali
- ❌ External dependency (Unsplash)

### URL Pattern:

```
https://images.unsplash.com/photo-[id]?auto=format&fit=crop&q=80&w=800
```

### Contoh:

```sql
ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800']
```

---

## Pilihan 3: Upload Gambar Resort Bali Sendiri 🎯 BEST

### Langkah:

1. Download gambar resort Bali dari internet
2. Simpan di `public/properties/[resort-name]/`
3. Update seed script dengan path lokal

### Struktur Folder:

```
public/properties/
  ├── bulgari-uluwatu/
  │   ├── 1.jpg
  │   ├── 2.jpg
  │   └── 3.jpg
  ├── four-seasons-sayan/
  │   ├── 1.jpg
  │   └── 2.jpg
  └── w-bali-seminyak/
      ├── 1.jpg
      └── 2.jpg
```

### Kelebihan:

- ✅ Gambar lokal (cepat)
- ✅ Sesuai dengan resort
- ✅ Tidak ada external dependency
- ✅ Full control

### Kekurangan:

- ❌ Perlu download & organize gambar
- ❌ Butuh waktu setup
- ❌ File size lebih besar

---

## 📊 Perbandingan

| Aspek          | Lokal (Desert Dome) | Unsplash     | Upload Sendiri      |
| -------------- | ------------------- | ------------ | ------------------- |
| **Kecepatan**  | ⚡⚡⚡ Sangat Cepat | ⚡⚡ Cepat   | ⚡⚡⚡ Sangat Cepat |
| **Kualitas**   | ⭐⭐ Tidak sesuai   | ⭐⭐⭐ Bagus | ⭐⭐⭐ Bagus        |
| **Realistis**  | ❌ Tidak            | ✅ Ya        | ✅ Ya               |
| **Setup**      | ✅ Mudah            | ✅ Mudah     | ❌ Butuh waktu      |
| **Dependency** | ✅ Tidak ada        | ❌ Unsplash  | ✅ Tidak ada        |

---

## 🎯 Rekomendasi

### Untuk Development/Testing:

**Gunakan: Unsplash (Pilihan 2)** ✅

- Cepat setup
- Gambar bagus
- Tidak perlu download

**File:** `scripts/simple-seed.sql`

### Untuk Production:

**Gunakan: Upload Sendiri (Pilihan 3)** 🎯

- Gambar lokal
- Full control
- Tidak ada external dependency

### Untuk Quick Demo (Sekarang):

**Gunakan: Unsplash (Pilihan 2)** ✅

- Sudah siap pakai
- Gambar professional
- Sesuai dengan resort Bali

---

## 🚀 Quick Start

### Opsi A: Pakai Unsplash (Recommended untuk sekarang)

```sql
-- Run di Supabase SQL Editor:
-- Copy isi dari scripts/simple-seed.sql
```

### Opsi B: Pakai Gambar Lokal (Desert Dome)

```sql
-- Run di Supabase SQL Editor:
-- Copy isi dari scripts/seed-with-local-images.sql
```

**Note:** Opsi B akan membuat semua resort pakai gambar desert dome yang sama.

---

## 💡 Saran Saya

**Untuk sekarang:** Pakai Unsplash (`scripts/simple-seed.sql`)

- Gambar bagus dan sesuai
- Cepat setup
- Professional untuk demo

**Nanti (production):** Upload gambar resort Bali yang sebenarnya

- Download dari website resmi resort
- Simpan di `public/properties/`
- Update database

---

## 🔄 Cara Ganti Gambar Nanti

Jika mau ganti ke gambar lokal nanti:

```sql
-- Update gambar untuk 1 resort
UPDATE properties
SET image_urls = ARRAY[
  '/properties/bulgari-uluwatu/1.jpg',
  '/properties/bulgari-uluwatu/2.jpg',
  '/properties/bulgari-uluwatu/3.jpg'
]
WHERE id = 'bali-bulgari-uluwatu';
```

---

## ✅ Kesimpulan

**Pilihan terbaik untuk sekarang:** Unsplash (sudah ada di `scripts/simple-seed.sql`)

**Alasan:**

- Gambar berkualitas tinggi
- Sesuai dengan resort mewah Bali
- Tidak perlu download/setup
- Professional untuk demo

Gambar desert dome bisa dipakai untuk testing, tapi tidak cocok untuk demo karena tidak sesuai dengan tema resort Bali.
