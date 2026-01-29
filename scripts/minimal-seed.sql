-- SCRIPT PALING SEDERHANA - Hanya Kolom Wajib
-- Jika ini masih error, berarti table properties belum ada

-- Hapus data lama
DELETE FROM properties;

-- Insert 12 Resort Bali - Satu per Satu

-- 1
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Bulgari Resort Bali', 18500000, 'Uluwatu, Bali', 4);

-- 2
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Four Seasons Resort Bali at Sayan', 8900000, 'Ubud, Bali', 6);

-- 3
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('W Bali Seminyak', 3200000, 'Seminyak, Bali', 2);

-- 4
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('The St. Regis Bali Resort', 7500000, 'Nusa Dua, Bali', 4);

-- 5
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('COMO Uma Canggu', 2400000, 'Canggu, Bali', 2);

-- 6
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Four Seasons Resort Bali at Jimbaran Bay', 6800000, 'Jimbaran, Bali', 4);

-- 7
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Padma Resort Legian', 1850000, 'Legian, Bali', 4);

-- 8
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Mandapa, a Ritz-Carlton Reserve', 12500000, 'Ubud, Bali', 2);

-- 9
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Grand Hyatt Bali', 2900000, 'Nusa Dua, Bali', 3);

-- 10
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Six Senses Uluwatu', 9800000, 'Uluwatu, Bali', 4);

-- 11
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('Potato Head Suites & Studios', 2800000, 'Seminyak, Bali', 2);

-- 12
INSERT INTO properties (title, price_per_night, location, max_guests)
VALUES ('The Legian Seminyak', 4200000, 'Seminyak, Bali', 2);

-- Cek hasil
SELECT COUNT(*) as total FROM properties;
SELECT title, location, price_per_night FROM properties ORDER BY price_per_night DESC;
