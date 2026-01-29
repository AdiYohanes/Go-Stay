-- Script to seed Bali resort data into properties table
-- Run this in Supabase SQL Editor

-- STEP 1: Delete existing properties (data lama seperti Desert Dome, dll)
DELETE FROM properties;

-- STEP 2: Insert Bali resort data
INSERT INTO properties (
  id,
  title,
  description,
  price_per_night,
  location,
  latitude,
  longitude,
  image_urls,
  amenities,
  max_guests,
  bedrooms,
  beds,
  bathrooms,
  created_at,
  updated_at
) VALUES
(
  '1',
  'Bulgari Resort Bali',
  'Resort ultra-mewah di tebing Uluwatu dengan pemandangan laut yang menakjubkan. Akses eksklusif via lift khusus, private beach, dan Italian luxury experience.',
  18500000,
  'Uluwatu, Bali',
  -8.8291,
  115.0849,
  ARRAY[
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Private Beach', 'Infinity Pool', 'Spa', 'Fine Dining', 'Butler Service', 'WiFi'],
  4,
  2,
  2,
  2,
  NOW(),
  NOW()
),
(
  '2',
  'Four Seasons Resort Bali at Sayan',
  'Resort mewah di lembah Sungai Ayung, Ubud. Dikelilingi hutan hujan tropis dengan arsitektur yang memadukan kemewahan modern dan budaya Bali.',
  8900000,
  'Ubud, Bali',
  -8.5069,
  115.2624,
  ARRAY[
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Valley View', 'Infinity Pool', 'Spa', 'Yoga', 'Restaurant', 'WiFi', 'Gym'],
  6,
  3,
  3,
  3,
  NOW(),
  NOW()
),
(
  '3',
  'W Bali Seminyak',
  'Resort modern dan stylish di pantai Seminyak. Terkenal dengan WooBar dan suasana party yang vibrant, cocok untuk traveler muda.',
  3200000,
  'Seminyak, Bali',
  -8.6905,
  115.1575,
  ARRAY[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Beach Access', 'Pool', 'Beach Club', 'Spa', 'Restaurant', 'Bar', 'WiFi'],
  2,
  1,
  1,
  1,
  NOW(),
  NOW()
),
(
  '4',
  'The St. Regis Bali Resort',
  'Resort all-suite mewah di Nusa Dua dengan pantai privat dan lagoon terbesar di Asia Tenggara. Layanan butler 24 jam untuk setiap suite.',
  7500000,
  'Nusa Dua, Bali',
  -8.8005,
  115.2317,
  ARRAY[
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Private Beach', 'Lagoon Pool', 'Spa', 'Butler Service', 'Kids Club', 'WiFi'],
  4,
  2,
  2,
  2,
  NOW(),
  NOW()
),
(
  '5',
  'COMO Uma Canggu',
  'Boutique resort modern di Canggu dengan fokus pada wellness dan surfing. Dekat dengan Echo Beach dan cafe-cafe trendy.',
  2400000,
  'Canggu, Bali',
  -8.6478,
  115.1385,
  ARRAY[
    'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Pool', 'Surf School', 'Yoga', 'Spa', 'Restaurant', 'WiFi', 'Bike Rental'],
  2,
  1,
  1,
  1,
  NOW(),
  NOW()
),
(
  '6',
  'Four Seasons Resort Bali at Jimbaran Bay',
  'Resort tepi pantai di Jimbaran dengan villa-villa yang memiliki kolam renang pribadi. Pemandangan sunset yang spektakuler.',
  6800000,
  'Jimbaran, Bali',
  -8.7892,
  115.1556,
  ARRAY[
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Beachfront', 'Private Pool', 'Spa', 'Fine Dining', 'Kids Club', 'WiFi'],
  4,
  2,
  2,
  2,
  NOW(),
  NOW()
),
(
  '7',
  'Padma Resort Legian',
  'Resort keluarga di tepi pantai Legian dengan taman tropis yang luas. Sunset lounge dan infinity pool menghadap laut.',
  1850000,
  'Legian, Bali',
  -8.7056,
  115.1686,
  ARRAY[
    'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Beachfront', 'Infinity Pool', 'Kids Club', 'Spa', 'Restaurant', 'WiFi'],
  4,
  2,
  2,
  1,
  NOW(),
  NOW()
),
(
  '8',
  'Mandapa, a Ritz-Carlton Reserve',
  'Resort heritage ultra-mewah di tepi Sungai Ayung, Ubud. Pengalaman budaya Bali yang autentik dengan kemewahan kelas dunia.',
  12500000,
  'Ubud, Bali',
  -8.4892,
  115.2789,
  ARRAY[
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['River View', 'Private Pool', 'Spa', 'Cultural Activities', 'Fine Dining', 'WiFi'],
  2,
  1,
  1,
  1,
  NOW(),
  NOW()
),
(
  '9',
  'Grand Hyatt Bali',
  'Resort besar di Nusa Dua dengan 5 kolam renang dan taman tropis seluas 40 hektar. Cocok untuk keluarga dan konferensi.',
  2900000,
  'Nusa Dua, Bali',
  -8.8123,
  115.2289,
  ARRAY[
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Beach Access', 'Multiple Pools', 'Spa', 'Restaurant', 'WiFi', 'Kids Club'],
  3,
  1,
  2,
  1,
  NOW(),
  NOW()
),
(
  '10',
  'Six Senses Uluwatu',
  'Resort wellness premium di tebing Uluwatu dengan fokus pada sustainability. Pemandangan 360 derajat dan pengalaman holistik.',
  9800000,
  'Uluwatu, Bali',
  -8.8356,
  115.0912,
  ARRAY[
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Cliff View', 'Private Pool', 'Wellness Center', 'Organic Restaurant', 'Yoga', 'WiFi'],
  4,
  2,
  2,
  2,
  NOW(),
  NOW()
),
(
  '11',
  'Potato Head Suites & Studios',
  'Boutique hotel artsy di Seminyak dengan desain unik dan beach club yang iconic. Pengalaman lifestyle modern Bali.',
  2800000,
  'Seminyak, Bali',
  -8.6823,
  115.1534,
  ARRAY[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Beach Club', 'Pool', 'Art Gallery', 'Restaurant', 'Bar', 'WiFi'],
  2,
  1,
  1,
  1,
  NOW(),
  NOW()
),
(
  '12',
  'The Legian Seminyak',
  'Resort butik mewah di tepi pantai Seminyak dengan suite-suite yang elegan dan layanan personal yang luar biasa.',
  4200000,
  'Seminyak, Bali',
  -8.6867,
  115.1545,
  ARRAY[
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
  ],
  ARRAY['Beachfront', 'Pool', 'Spa', 'Fine Dining', 'Butler', 'WiFi'],
  2,
  1,
  1,
  1,
  NOW(),
  NOW()
);
