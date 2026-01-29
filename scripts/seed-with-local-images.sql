-- Script Seed dengan Gambar Lokal
-- Menggunakan gambar yang sudah ada di public/properties/desert-dome/

-- Hapus data lama
DELETE FROM properties;

-- Insert 12 Resort Bali dengan gambar lokal
-- Note: Semua resort akan pakai gambar yang sama karena hanya ada 1 set gambar

INSERT INTO properties (title, price_per_night, location, max_guests, image_urls, amenities, description)
VALUES 
-- 1. Bulgari Resort Bali
('Bulgari Resort Bali', 18500000, 'Uluwatu, Bali', 4,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Private Beach', 'Infinity Pool', 'Spa', 'Fine Dining', 'Butler Service', 'WiFi'],
 'Resort ultra-mewah di tebing Uluwatu dengan pemandangan laut yang menakjubkan.'),

-- 2. Four Seasons Sayan
('Four Seasons Resort Bali at Sayan', 8900000, 'Ubud, Bali', 6,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Valley View', 'Infinity Pool', 'Spa', 'Yoga', 'Restaurant', 'WiFi', 'Gym'],
 'Resort mewah di lembah Sungai Ayung, Ubud. Dikelilingi hutan hujan tropis.'),

-- 3. W Bali Seminyak
('W Bali Seminyak', 3200000, 'Seminyak, Bali', 2,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Beach Access', 'Pool', 'Beach Club', 'Spa', 'Restaurant', 'Bar', 'WiFi'],
 'Resort modern dan stylish di pantai Seminyak. Terkenal dengan WooBar.'),

-- 4. The St. Regis Bali
('The St. Regis Bali Resort', 7500000, 'Nusa Dua, Bali', 4,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Private Beach', 'Lagoon Pool', 'Spa', 'Butler Service', 'Kids Club', 'WiFi'],
 'Resort all-suite mewah di Nusa Dua dengan pantai privat dan lagoon terbesar.'),

-- 5. COMO Uma Canggu
('COMO Uma Canggu', 2400000, 'Canggu, Bali', 2,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Pool', 'Surf School', 'Yoga', 'Spa', 'Restaurant', 'WiFi', 'Bike Rental'],
 'Boutique resort modern di Canggu dengan fokus pada wellness dan surfing.'),

-- 6. Four Seasons Jimbaran
('Four Seasons Resort Bali at Jimbaran Bay', 6800000, 'Jimbaran, Bali', 4,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Beachfront', 'Private Pool', 'Spa', 'Fine Dining', 'Kids Club', 'WiFi'],
 'Resort tepi pantai di Jimbaran dengan villa-villa yang memiliki kolam renang pribadi.'),

-- 7. Padma Resort Legian
('Padma Resort Legian', 1850000, 'Legian, Bali', 4,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Beachfront', 'Infinity Pool', 'Kids Club', 'Spa', 'Restaurant', 'WiFi'],
 'Resort keluarga di tepi pantai Legian dengan taman tropis yang luas.'),

-- 8. Mandapa Ritz-Carlton
('Mandapa, a Ritz-Carlton Reserve', 12500000, 'Ubud, Bali', 2,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['River View', 'Private Pool', 'Spa', 'Cultural Activities', 'Fine Dining', 'WiFi'],
 'Resort heritage ultra-mewah di tepi Sungai Ayung, Ubud.'),

-- 9. Grand Hyatt Bali
('Grand Hyatt Bali', 2900000, 'Nusa Dua, Bali', 3,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Beach Access', 'Multiple Pools', 'Spa', 'Restaurant', 'WiFi', 'Kids Club'],
 'Resort besar di Nusa Dua dengan 5 kolam renang dan taman tropis seluas 40 hektar.'),

-- 10. Six Senses Uluwatu
('Six Senses Uluwatu', 9800000, 'Uluwatu, Bali', 4,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Cliff View', 'Private Pool', 'Wellness Center', 'Organic Restaurant', 'Yoga', 'WiFi'],
 'Resort wellness premium di tebing Uluwatu dengan fokus pada sustainability.'),

-- 11. Potato Head Suites
('Potato Head Suites & Studios', 2800000, 'Seminyak, Bali', 2,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Beach Club', 'Pool', 'Art Gallery', 'Restaurant', 'Bar', 'WiFi'],
 'Boutique hotel artsy di Seminyak dengan desain unik dan beach club yang iconic.'),

-- 12. The Legian Seminyak
('The Legian Seminyak', 4200000, 'Seminyak, Bali', 2,
 ARRAY['/properties/desert-dome/1.png', '/properties/desert-dome/2.png', '/properties/desert-dome/3.png', '/properties/desert-dome/4.png', '/properties/desert-dome/5.png'],
 ARRAY['Beachfront', 'Pool', 'Spa', 'Fine Dining', 'Butler', 'WiFi'],
 'Resort butik mewah di tepi pantai Seminyak dengan suite-suite yang elegan.');

-- Cek hasil
SELECT COUNT(*) as total FROM properties;
SELECT title, location, price_per_night FROM properties ORDER BY price_per_night DESC;
