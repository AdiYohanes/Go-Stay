-- Test Insert - Coba insert 1 resort dulu untuk cek kolom apa yang ada

-- Hapus data lama
DELETE FROM properties;

-- Test insert dengan kolom MINIMAL
INSERT INTO properties (title, description, price_per_night, location, max_guests)
VALUES (
  'Bulgari Resort Bali',
  'Resort ultra-mewah di tebing Uluwatu dengan pemandangan laut yang menakjubkan.',
  18500000,
  'Uluwatu, Bali',
  4
);

-- Cek hasil
SELECT * FROM properties;
