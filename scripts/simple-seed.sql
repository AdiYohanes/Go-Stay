-- Script Seed Sederhana - Insert Satu per Satu
-- Hanya menggunakan kolom MINIMAL yang pasti ada

-- STEP 1: Hapus data lama
DELETE FROM properties;

-- STEP 2: Insert resort satu per satu

-- 1. Bulgari Resort Bali
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-bulgari-uluwatu',
  'Bulgari Resort Bali',
  'Resort ultra-mewah di tebing Uluwatu dengan pemandangan laut yang menakjubkan. Akses eksklusif via lift khusus, private beach, dan Italian luxury experience.',
  18500000,
  'Uluwatu, Bali',
  ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Private Beach', 'Infinity Pool', 'Spa', 'Fine Dining', 'Butler Service', 'WiFi'],
  4
);

-- 2. Four Seasons Sayan
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-fourseas-sayan',
  'Four Seasons Resort Bali at Sayan',
  'Resort mewah di lembah Sungai Ayung, Ubud. Dikelilingi hutan hujan tropis dengan arsitektur yang memadukan kemewahan modern dan budaya Bali.',
  8900000,
  'Ubud, Bali',
  ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Valley View', 'Infinity Pool', 'Spa', 'Yoga', 'Restaurant', 'WiFi', 'Gym'],
  6
);

-- 3. W Bali Seminyak
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-w-seminyak',
  'W Bali Seminyak',
  'Resort modern dan stylish di pantai Seminyak. Terkenal dengan WooBar dan suasana party yang vibrant, cocok untuk traveler muda.',
  3200000,
  'Seminyak, Bali',
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Beach Access', 'Pool', 'Beach Club', 'Spa', 'Restaurant', 'Bar', 'WiFi'],
  2
);

-- 4. The St. Regis Bali
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-stregis-nusadua',
  'The St. Regis Bali Resort',
  'Resort all-suite mewah di Nusa Dua dengan pantai privat dan lagoon terbesar di Asia Tenggara. Layanan butler 24 jam untuk setiap suite.',
  7500000,
  'Nusa Dua, Bali',
  ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Private Beach', 'Lagoon Pool', 'Spa', 'Butler Service', 'Kids Club', 'WiFi'],
  4
);

-- 5. COMO Uma Canggu
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-como-canggu',
  'COMO Uma Canggu',
  'Boutique resort modern di Canggu dengan fokus pada wellness dan surfing. Dekat dengan Echo Beach dan cafe-cafe trendy.',
  2400000,
  'Canggu, Bali',
  ARRAY['https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Pool', 'Surf School', 'Yoga', 'Spa', 'Restaurant', 'WiFi', 'Bike Rental'],
  2
);

-- 6. Four Seasons Jimbaran
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-fourseas-jimbaran',
  'Four Seasons Resort Bali at Jimbaran Bay',
  'Resort tepi pantai di Jimbaran dengan villa-villa yang memiliki kolam renang pribadi. Pemandangan sunset yang spektakuler.',
  6800000,
  'Jimbaran, Bali',
  ARRAY['https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Beachfront', 'Private Pool', 'Spa', 'Fine Dining', 'Kids Club', 'WiFi'],
  4
);

-- 7. Padma Resort Legian
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-padma-legian',
  'Padma Resort Legian',
  'Resort keluarga di tepi pantai Legian dengan taman tropis yang luas. Sunset lounge dan infinity pool menghadap laut.',
  1850000,
  'Legian, Bali',
  ARRAY['https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Beachfront', 'Infinity Pool', 'Kids Club', 'Spa', 'Restaurant', 'WiFi'],
  4
);

-- 8. Mandapa Ritz-Carlton
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-mandapa-ubud',
  'Mandapa, a Ritz-Carlton Reserve',
  'Resort heritage ultra-mewah di tepi Sungai Ayung, Ubud. Pengalaman budaya Bali yang autentik dengan kemewahan kelas dunia.',
  12500000,
  'Ubud, Bali',
  ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800'],
  ARRAY['River View', 'Private Pool', 'Spa', 'Cultural Activities', 'Fine Dining', 'WiFi'],
  2
);

-- 9. Grand Hyatt Bali
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-grandhyatt-nusadua',
  'Grand Hyatt Bali',
  'Resort besar di Nusa Dua dengan 5 kolam renang dan taman tropis seluas 40 hektar. Cocok untuk keluarga dan konferensi.',
  2900000,
  'Nusa Dua, Bali',
  ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Beach Access', 'Multiple Pools', 'Spa', 'Restaurant', 'WiFi', 'Kids Club'],
  3
);

-- 10. Six Senses Uluwatu
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-sixsenses-uluwatu',
  'Six Senses Uluwatu',
  'Resort wellness premium di tebing Uluwatu dengan fokus pada sustainability. Pemandangan 360 derajat dan pengalaman holistik.',
  9800000,
  'Uluwatu, Bali',
  ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Cliff View', 'Private Pool', 'Wellness Center', 'Organic Restaurant', 'Yoga', 'WiFi'],
  4
);

-- 11. Potato Head Suites
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-potatohead-seminyak',
  'Potato Head Suites & Studios',
  'Boutique hotel artsy di Seminyak dengan desain unik dan beach club yang iconic. Pengalaman lifestyle modern Bali.',
  2800000,
  'Seminyak, Bali',
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Beach Club', 'Pool', 'Art Gallery', 'Restaurant', 'Bar', 'WiFi'],
  2
);

-- 12. The Legian Seminyak
INSERT INTO properties (id, title, description, price_per_night, location, image_urls, amenities, max_guests)
VALUES (
  'bali-legian-seminyak',
  'The Legian Seminyak',
  'Resort butik mewah di tepi pantai Seminyak dengan suite-suite yang elegan dan layanan personal yang luar biasa.',
  4200000,
  'Seminyak, Bali',
  ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800'],
  ARRAY['Beachfront', 'Pool', 'Spa', 'Fine Dining', 'Butler', 'WiFi'],
  2
);

-- STEP 3: Verifikasi
SELECT COUNT(*) as total_properties FROM properties;
SELECT id, title, location, price_per_night FROM properties ORDER BY price_per_night DESC;
