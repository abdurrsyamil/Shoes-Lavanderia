-- 1. Create Tables
CREATE TABLE IF NOT EXISTS features (
    id SERIAL PRIMARY KEY,
    icon_name VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price_label VARCHAR(50) NOT NULL,
    price_value VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    operating_hours VARCHAR(100) NOT NULL,
    whatsapp_url TEXT NOT NULL,
    gmaps_url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promos (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'AKTIF',
    date VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    benefits TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert Seed Data
-- Features Data
INSERT INTO features (icon_name, title, description) VALUES
('Shield', 'GARANSI CUCI ULANG', 'Kami berikan garansi cuci ulang tanpa tambahan biaya jika hasil pembersihan belum memenuhi standar kualitas estetika premium kami. *S&K berlaku.'),
('UserCheck', 'KONSULTASI GRATIS', 'Layanan analisis bahan dan konsultasi gratis oleh tim ahli kami untuk menentukan metode perawatan yang paling aman sesuai jenis sepatu Anda.'),
('Truck', 'GRATIS JEMPUT & ANTAR', 'Nikmati kemudahan layanan penjemputan dan pengantaran sepatu gratis hingga radius 8 KM dari lokasi workshop kami.'),
('Award', 'JAMINAN GARANSI LAYANAN', 'Layanan pembersihan dan perawatan terbaik untuk semua jenis sepatu Anda. Dikerjakan dengan teliti dan profesional oleh tim ahli kami.');

-- Services Data
INSERT INTO services (name, description, price_label, price_value) VALUES
('FAST CLEANING', 'Fast cleaning merupakan pencucian instan pada bagian upper dan midsole yang bisa di tunggu selama 15-30 menit.', 'MULAI DARI', 'Rp 30.000'),
('DEEP CLEANING', 'Perawatan pembersihan sepatu secara detail dan menyeluruh pada seluruh bagian.', 'MULAI DARI', 'Rp 50.000'),
('PREMIUM TREATMENT', 'Perawatan yang pengerjaannya ditujukan untuk sepatu dengan material-material khusus.', 'MULAI DARI', 'Rp 90.000'),
('UNYELLOWING', 'Perawatan yang dikhususkan untuk midsole sepatu yang telah menguning agar kembali bersih dan cerah.', 'MULAI DARI', 'Rp 100.000'),
('REPAINT', 'Perawatan restorasi warna dengan penggunaan cat khusus yang ditujukan untuk mengembalikan warna awal sepatu seperti semula.', 'MULAI DARI', 'Rp 185.000'),
('GRATIS', 'Layanan jemput dan antar gratis hingga radius 8 KM dari lokasi workshop Shoes Lavandería (S&K Berlaku). Hubungi kami sekarang.', 'LAYANAN', 'ANTAR JEMPUT');

-- Locations Data (6 Stores)
INSERT INTO locations (city, store_name, operating_hours, whatsapp_url, gmaps_url) VALUES
('JAWA BARAT', 'Shoes Lavandería DEPOK BEJI', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Depok+Beji'),
('JAKARTA', 'Shoes Lavandería PIK 2', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+PIK+2'),
('YOGYAKARTA', 'Shoes Lavandería YOGYAKARTA (DEKAT UGM)', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Yogyakarta+UGM'),
('JAKARTA', 'Shoes Lavandería MENTENG ATAS', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Menteng+Atas'),
('JAKARTA', 'Shoes Lavandería JAKBAR DAAN MOGOT', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Daan+Mogot'),
('JAWA BARAT', 'Shoes Lavandería BANDUNG (DEKAT TELKOM UNIVERSITY)', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Bandung+Telkom+University');

-- Promos Data
INSERT INTO promos (status, date, title, benefits) VALUES
('AKTIF', '02 Jul 2026', 'CLEAN COMBO 3 Shoes Lavandería GO', '• Harga 60K Perpasang\n• Minimal 3 Pasang\n• Ongkir 10k'),
('AKTIF', '02 Jul 2026', 'BERSIH BARENG Shoes Lavandería GO', '• Harga 55K Perpasang\n• Minimal 5 Pasang\n• Ongkir 10k'),
('AKTIF', '02 Jul 2026', 'PAKET KOMUNITAS Shoes Lavandería GO', '• Harga 50K Perpasang\n• Minimal 8 Pasang\n• Ongkir 10k');

-- 3. Create Registered Users Table (For Registration Flow)
CREATE TABLE IF NOT EXISTS registered_users (
    email VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Bookings Table for Customer Orders
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    workshop_name VARCHAR(100) NOT NULL,
    shoe_name VARCHAR(100) NOT NULL,
    repaint_color VARCHAR(100),
    service_name VARCHAR(100) NOT NULL,
    service_price VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    distance NUMERIC,
    delivery_fee INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

