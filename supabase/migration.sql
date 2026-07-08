-- Migrasi SQL untuk Supabase (PostgreSQL)

-- 1. Tabel Features (Why Choose Us)
CREATE TABLE IF NOT EXISTS public.features (
    id SERIAL PRIMARY KEY,
    icon_name VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) untuk Features
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for features" ON public.features FOR SELECT USING (true);

-- 2. Tabel Services
CREATE TABLE IF NOT EXISTS public.services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price_label VARCHAR(50) NOT NULL,
    price_value VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS untuk Services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for services" ON public.services FOR SELECT USING (true);

-- 3. Tabel Locations
CREATE TABLE IF NOT EXISTS public.locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    operating_hours VARCHAR(100) NOT NULL,
    whatsapp_url TEXT NOT NULL,
    gmaps_url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS untuk Locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for locations" ON public.locations FOR SELECT USING (true);

-- 4. Tabel Promos
CREATE TABLE IF NOT EXISTS public.promos (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'AKTIF',
    date VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    benefits TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS untuk Promos
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for promos" ON public.promos FOR SELECT USING (true);

-- 5. Seed Data untuk Features
INSERT INTO public.features (icon_name, title, description) VALUES
('Shield', 'GARANSI CUCI ULANG', 'Jika hasilnya kurang memuaskan, kami tangani kembali tanpa biaya tambahan demi kehormatan standar Spanyol kami. *S&K berlaku.'),
('UserCheck', 'KONSULTASI GRATIS', 'Dapatkan rekomendasi terbaik dari tim profesional kami agar sepatu kesayangan Anda dirawat dengan metode tradisional ala Madrid yang paling tepat dan aman.'),
('Truck', 'GRATIS JEMPUT & ANTAR', 'Layanan ekspres antar jemput gratis hingga radius 8 KM layaknya pengantaran kargo kerajaan di Toledo. Hemat waktu Anda!'),
('Award', 'JAMINAN GARANSI LAYANAN', 'Dikerjakan oleh artisan berpengalaman dengan standar jaminan kualitas premium Spanyol (La Calidad) untuk segala jenis bahan sepatu.');

-- 6. Seed Data untuk Services
INSERT INTO public.services (name, description, price_label, price_value) VALUES
('FAST CLEANING', 'Fast cleaning ala kafe-kafe kilat di Barcelona merupakan pencucian instan pada bagian upper & midsole yang bisa ditunggu selama 15-30 menit.', 'MULAI DARI', 'Rp 30.000'),
('DEEP CLEANING', 'Perawatan pembersihan sepatu secara detail, menyeluruh, dan penuh dedikasi artisan khas semenanjung Iberia.', 'MULAI DARI', 'Rp 50.000'),
('PREMIUM TREATMENT', 'Perawatan terspesialisasi yang pengerjaannya ditujukan untuk sepatu material khusus (Suede, Nubuck, dll.) dengan formula hidrasi dari Madrid.', 'MULAI DARI', 'Rp 90.000'),
('UNYELLOWING', 'Perawatan restorasi midsole menguning akibat oksidasi menggunakan krim pemutih premium bersertifikasi butik Spanyol.', 'MULAI DARI', 'Rp 100.000'),
('REPAINT', 'Perawatan restorasi warna menggunakan cat premium khusus Spanyol untuk mengembalikan pigmen warna orisinal layaknya sepatu baru.', 'MULAI DARI', 'Rp 185.000'),
('GRATIS', 'Layanan jemput dan antar gratis hingga radius 8 KM dari lokasi workshop Shoes Lavandería dengan keramahan khas Iberia (S&K Berlaku). Hubungi kami sekarang.', 'LAYANAN', 'ANTAR JEMPUT');

-- 7. Seed Data untuk Locations
INSERT INTO public.locations (city, store_name, operating_hours, whatsapp_url, gmaps_url) VALUES
('JAWA BARAT', 'Shoes Lavandería DEPOK BEJI', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Depok+Beji'),
('JAKARTA', 'Shoes Lavandería PIK 2', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+PIK+2'),
('YOGYAKARTA', 'Shoes Lavandería YOGYAKARTA (DEKAT UGM)', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Yogyakarta+UGM'),
('JAKARTA', 'Shoes Lavandería MENTENG ATAS', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Menteng+Atas'),
('JAKARTA', 'Shoes Lavandería JAKBAR DAAN MOGOT', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Daan+Mogot'),
('JAWA BARAT', 'Shoes Lavandería BANDUNG (DEKAT TELKOM UNIVERSITY)', 'Senin - Minggu, 10.00 - 21.00', 'https://wa.me/6285920292879', 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Bandung+Telkom+University');

-- 8. Seed Data untuk Promos
INSERT INTO public.promos (status, date, title, benefits) VALUES
('AKTIF', '02 Jul 2026', 'CLEAN COMBO 3 Shoes Lavandería GO', '• Harga 60K Perpasang\n• Minimal 3 Pasang\n• Ongkir 10k'),
('AKTIF', '02 Jul 2026', 'BERSIH BARENG Shoes Lavandería GO', '• Harga 55K Perpasang\n• Minimal 5 Pasang\n• Ongkir 10k'),
('AKTIF', '02 Jul 2026', 'PAKET KOMUNITAS Shoes Lavandería GO', '• Harga 50K Perpasang\n• Minimal 8 Pasang\n• Ongkir 10k');

-- 9. Tabel Registered Users (Untuk Alur Registrasi Otomatis)
CREATE TABLE IF NOT EXISTS public.registered_users (
    email VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(100) NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS untuk Registered Users
ALTER TABLE public.registered_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for registered_users" ON public.registered_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert for registered_users" ON public.registered_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for registered_users" ON public.registered_users FOR UPDATE USING (true) WITH CHECK (true);

-- 10. Tabel Bookings (Pemesanan Layanan oleh Customer)
CREATE TABLE IF NOT EXISTS public.bookings (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS untuk Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert for bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for bookings" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);


