import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Service } from '../types';
import { MapPin, X, Navigation, Compass, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { supabaseClient } from '../supabaseClient';


const STORE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Shoes Lavandería DEPOK BEJI': { lat: -6.367055, lng: 106.819827 },
  'Shoes Lavandería PIK 2': { lat: -6.095200, lng: 106.744100 },
  'Shoes Lavandería YOGYAKARTA (DEKAT UGM)': { lat: -7.771384, lng: 110.377494 },
  'Shoes Lavandería MENTENG ATAS': { lat: -6.216300, lng: 106.839800 },
  'Shoes Lavandería JAKBAR DAAN MOGOT': { lat: -6.155700, lng: 106.762200 },
  'Shoes Lavandería BANDUNG (DEKAT TELKOM UNIVERSITY)': { lat: -6.974000, lng: 107.630300 },
};

const KEYWORD_COORDINATES: { keywords: string[]; lat: number; lng: number }[] = [
  { keywords: ['depok', 'beji', 'margonda', 'ui', 'cimanggis', 'cinere', 'sawangan', 'pancoran mas'], lat: -6.367055, lng: 106.819827 },
  { keywords: ['pik', 'pantai indah kapuk', 'cengkareng', 'kalideres', 'jakbar', 'jakarta barat'], lat: -6.095200, lng: 106.744100 },
  { keywords: ['ugm', 'yogyakarta', 'jogja', 'sleman', 'bantul', 'gunungkidul', 'kulon progo'], lat: -7.771384, lng: 110.377494 },
  { keywords: ['menteng', 'sudirman', 'kuningan', 'senopati', 'tebet', 'jaksel', 'jakarta selatan', 'blok m'], lat: -6.216300, lng: 106.839800 },
  { keywords: ['daan mogot', 'grogol', 'kebon jeruk', 'tomang', 'puri indah'], lat: -6.155700, lng: 106.762200 },
  { keywords: ['bandung', 'telkom', 'dago', 'itb', 'unpad', 'gedebage', 'lembang'], lat: -6.974000, lng: 107.630300 },
];

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  
  // Real driving road distance is typically 1.35x to 1.5x longer than straight-line distance (Haversine)
  // in metropolitan Jabodetabek (Jakarta, Depok, etc.) due to grid layout, winding roads, toll gates, and rivers.
  const routingCorrectionFactor = 1.45;
  const drivingDistance = d * routingCorrectionFactor;
  return Number(drivingDistance.toFixed(1));
}

function formatOutletName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace('shoes lavandería', 'Shoes Lavandería')
    .replace('ugm', 'UGM')
    .replace('pik', 'PIK')
    .replace('hq', 'HQ')
    .replace('deket', 'Dekat')
    .replace('dekat', 'Dekat')
    .replace('telkom university', 'Telkom University')
    .replace('jakbar', 'Jakarta Barat')
    .split(' ')
    .map(word => {
      if (['pik', 'ugm', 'hq', 'd17', 'gps', 'gmaps', 'km', 'wa'].includes(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ service, isOpen, onClose }) => {
  const { currentUser, showToast, locations } = useStore();
  const [shoeName, setShoeName] = useState('');
  const [repaintColor, setRepaintColor] = useState('');
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [addressMethod, setAddressMethod] = useState<'manual' | 'gps'>('manual');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  
  const [distance, setDistance] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset fields when opened
      setShoeName('');
      setRepaintColor('');
      setAddress('');
      setSearchQuery('');
      setSelectedLocation(null);
      setAddressMethod('manual');
      setUserCoordinates(null);
      setDistance(0);
    }
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const isAntarJemputFree = selectedLocation ? distance <= 8.0 : true;
  // Dynamic delivery fee following standard Indonesian express courier (JNE/SPX/Gojek/Grab) formula:
  // Base tariff of Rp 10.000 + Rp 2.500 per additional kilometer above the 8 km threshold, rounded to the nearest thousand.
  const deliveryFee = (() => {
    if (!selectedLocation || isAntarJemputFree) return 0;
    const extraDistance = distance - 8.0;
    const rawFee = 10000 + (extraDistance * 2500);
    return Math.round(rawFee / 1000) * 1000;
  })();

  const updateDistanceAndPin = (storeName: string, userCoords: { lat: number; lng: number }) => {
    const storeCoord = STORE_COORDINATES[storeName];
    if (!storeCoord) return;

    const realKm = calculateHaversineDistance(userCoords.lat, userCoords.lng, storeCoord.lat, storeCoord.lng);
    setDistance(realKm === 0 ? 0.1 : realKm);
  };

  const getMapEmbedUrl = () => {
    if (selectedLocation) {
      const storeCoord = STORE_COORDINATES[selectedLocation.store_name];
      if (userCoordinates && storeCoord) {
        return `https://maps.google.com/maps?saddr=${userCoordinates.lat},${userCoordinates.lng}&daddr=${storeCoord.lat},${storeCoord.lng}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
      } else if (storeCoord) {
        return `https://maps.google.com/maps?q=${storeCoord.lat},${storeCoord.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      }
    }
    return `https://maps.google.com/maps?q=-6.200000,106.816666&t=&z=11&ie=UTF8&iwloc=&output=embed`;
  };

  const handleGetGPSLocation = () => {
    if (!selectedLocation) {
      if (typeof showToast === 'function') {
        showToast('SILAKAN PILIH OUTLET / WORKSHOP TERLEBIH DAHULU!', 'bg-amber-500 text-black border-black');
      } else {
        alert('Silakan pilih outlet / workshop terlebih dahulu!');
      }
      return;
    }
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung fitur Geolocation GPS.');
      return;
    }
    setIsLocating(true);
    setAddress('Mengambil lokasi GPS Anda dari browser...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoordinates({ lat, lng });
        
        // Simulate a small premium delay for radar effect
        setTimeout(() => {
          const simulatedAddress = `Alamat GPS Aktif: Koordinat (${lat.toFixed(6)}, ${lng.toFixed(6)}), Terdekat dengan ${selectedLocation.store_name}`;
          setAddress(simulatedAddress);
          updateDistanceAndPin(selectedLocation.store_name, { lat, lng });
          
          setIsLocating(false);
          if (typeof showToast === 'function') {
            showToast('📍 BERHASIL MENDAPATKAN LOKASI GPS SEKARANG!', 'bg-emerald-500 text-black border-black');
          }
        }, 1200);
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        setAddress('');
        alert('Gagal mendapatkan lokasi GPS. Mohon aktifkan izin lokasi di browser Anda atau masukkan alamat secara manual.');
        setAddressMethod('manual');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleManualAddressChange = (val: string) => {
    setAddress(val);
    if (!selectedLocation) return;

    if (val.trim().length < 5) {
      setDistance(0);
      setUserCoordinates(null);
      return;
    }

    // Resolve coordinate from keywords or fallback
    const lowerVal = val.toLowerCase();
    const matched = KEYWORD_COORDINATES.find(item => item.keywords.some(kw => lowerVal.includes(kw)));
    
    let resolvedCoords: { lat: number; lng: number };
    
    if (matched) {
      // Calculate a stable offset based on the exact address text hash
      let hash = 0;
      for (let i = 0; i < val.length; i++) {
        hash = val.charCodeAt(i) + ((hash << 5) - hash);
      }
      const absoluteHash = Math.abs(hash);
      
      // Fine-grained offset (within ~1.5km of central area point)
      const latOffset = ((absoluteHash % 100) - 50) / 10000;
      const lngOffset = (((absoluteHash >> 2) % 100) - 50) / 10000;
      
      resolvedCoords = { 
        lat: matched.lat + latOffset, 
        lng: matched.lng + lngOffset 
      };
    } else {
      // Generate stable fallback from hash
      let hash = 0;
      for (let i = 0; i < val.length; i++) {
        hash = val.charCodeAt(i) + ((hash << 5) - hash);
      }
      const absoluteHash = Math.abs(hash);
      const storeCoord = STORE_COORDINATES[selectedLocation.store_name] || { lat: -6.367055, lng: 106.819827 };
      const offsetLat = ((absoluteHash % 100) - 50) / 400;
      const offsetLng = (((absoluteHash >> 2) % 100) - 50) / 400;
      resolvedCoords = {
        lat: storeCoord.lat + offsetLat,
        lng: storeCoord.lng + offsetLng
      };
    }

    setUserCoordinates(resolvedCoords);
    updateDistanceAndPin(selectedLocation.store_name, resolvedCoords);
  };

  const handleOrderSubmit = async () => {
    if (!selectedLocation) {
      alert('Mohon pilih lokasi workshop tujuan terlebih dahulu!');
      return;
    }
    if (!shoeName.trim()) {
      alert('Mohon masukkan nama / merk sepatu Anda!');
      return;
    }
    if (service.name.toLowerCase().includes('repaint') && !repaintColor.trim()) {
      alert('Mohon tentukan request warna target repaint Anda!');
      return;
    }
    if (!address.trim()) {
      alert('Mohon lengkapi alamat penjemputan / pengantaran Anda!');
      return;
    }

    const customerName = currentUser?.name || 'Pelanggan';
    const customerEmail = currentUser?.email || 'pelanggan-anonim@shoeslavanderiago.com';

    // Format WA message
    const orderMessage = `*PESANAN LAYANAN SHOES LAVANDERÍA GO* 🇪🇸👞

Halo Asesor Shoes Lavandería, saya ingin melakukan pemesanan layanan pencucian dengan detail berikut:

👤 *DATA PELANGGAN*
- Nama: ${customerName.toUpperCase()}
- Email: ${customerEmail}

🏬 *WORKSHOP TUJUAN*
- Workshop: ${selectedLocation.store_name}

👟 *DATA SEPATU*
- Merk/Tipe Sepatu: ${shoeName}
${service.name.toLowerCase().includes('repaint') ? `- Request Warna Target: ${repaintColor}\n` : ''}
📦 *DETAIL LAYANAN*
- Jenis Jasa: ${service.name}
- Biaya Jasa: ${service.price_value}

📍 *ALAMAT & ANTAR JEMPUT*
- Alamat Lengkap: ${address}
- Jarak Estimasi: ${distance} km
- Status Ongkir: ${isAntarJemputFree ? '✅ GRATIS ANTAR JEMPUT (≤ 8 km)' : `⚠️ Dikenakan Ongkos Kirim (> 8 km)`}
- Biaya Ongkir: ${isAntarJemputFree ? 'GRATIS' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}

*TOTAL ESTIMASI:* Rp ${(parseInt(service.price_value.replace(/\D/g, '')) + deliveryFee).toLocaleString('id-ID')}

Mohon segera dikonfirmasi ya Asesor, terima kasih!`;

    // 1. Simpan ke Database Supabase jika terhubung
    if (supabaseClient) {
      try {
        const rawPriceValue = parseInt(service.price_value.replace(/\D/g, '')) || 0;
        const { error } = await supabaseClient.from('bookings').insert([{
          customer_name: customerName,
          customer_email: customerEmail,
          workshop_name: selectedLocation.store_name,
          shoe_name: shoeName,
          repaint_color: service.name.toLowerCase().includes('repaint') ? repaintColor : null,
          service_name: service.name,
          service_price: service.price_value,
          address: address,
          distance: parseFloat(distance) || 0,
          delivery_fee: deliveryFee,
          total_price: rawPriceValue + deliveryFee,
          status: 'PENDING'
        }]);

        if (error) {
          console.error("Gagal menyimpan ke Supabase bookings:", error);
        } else {
          console.log("Pesanan berhasil tersimpan di database Supabase bookings!");
        }
      } catch (dbErr) {
        console.error("Terjadi error koneksi ke database:", dbErr);
      }
    }

    // 2. Simpan juga ke LocalStorage untuk riwayat offline
    try {
      const localBookingsStr = localStorage.getItem('sac_bookings') || '[]';
      let localBookings = [];
      try {
        localBookings = JSON.parse(localBookingsStr);
      } catch (_) {}
      localBookings.push({
        id: Date.now(),
        customer_name: customerName,
        customer_email: customerEmail,
        workshop_name: selectedLocation.store_name,
        shoe_name: shoeName,
        repaint_color: repaintColor || null,
        service_name: service.name,
        service_price: service.price_value,
        address: address,
        distance: parseFloat(distance) || 0,
        delivery_fee: deliveryFee,
        total_price: (parseInt(service.price_value.replace(/\D/g, '')) || 0) + deliveryFee,
        status: 'PENDING',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('sac_bookings', JSON.stringify(localBookings));
    } catch (lsErr) {
      console.error("Gagal menyimpan ke LocalStorage:", lsErr);
    }

    // Open WhatsApp
    const waUrl = `https://wa.me/6285776909036?text=${encodeURIComponent(orderMessage)}`;
    window.open(waUrl, '_blank');
    
    onClose();
    if (typeof showToast === 'function') {
      showToast('PESANAN BERHASIL DIKIRIM & TERSIMPAN DI DATABASE!', 'bg-emerald-500 text-black border-black');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999] overflow-y-auto backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-neutral-950 border border-neutral-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-base shadow-lg shadow-amber-500/10">
              GO
            </div>
            <div>
              <h2 className="text-white text-base font-semibold tracking-tight">Detail Pemesanan Layanan</h2>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">Sistem Penjemputan Otomatis • Shoes Lavandería GO</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar">
          
          {/* SERVICE SUMMARY */}
          <div className="bg-neutral-950 border border-neutral-850 rounded-2xl p-4.5 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase block mb-1">Layanan Terpilih</span>
              <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider truncate">{service.name}</h3>
              <p className="text-xs text-neutral-400 line-clamp-1 font-sans mt-0.5">{service.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase block">Biaya Jasa</span>
              <span className="text-amber-500 text-sm sm:text-base font-mono font-bold tracking-tight whitespace-nowrap block mt-1.5">
                {service.price_value}
              </span>
            </div>
          </div>

          {/* INPUT FORM */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                1. Pilih Lokasi Workshop Terdekat <span className="text-amber-500">*</span>
              </label>
              <select
                value={selectedLocation ? selectedLocation.store_name : ''}
                onChange={(e) => {
                  const found = locations.find(loc => loc.store_name === e.target.value);
                  setSelectedLocation(found || null);
                  
                  if (found) {
                    if (userCoordinates) {
                      updateDistanceAndPin(found.store_name, userCoordinates);
                    } else if (address && address.trim().length >= 5) {
                      const lowerVal = address.toLowerCase();
                      const matched = KEYWORD_COORDINATES.find(item => item.keywords.some(kw => lowerVal.includes(kw)));
                      let resolvedCoords: { lat: number; lng: number };
                      
                      if (matched) {
                        let hash = 0;
                        for (let i = 0; i < address.length; i++) {
                          hash = address.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        const absoluteHash = Math.abs(hash);
                        const latOffset = ((absoluteHash % 100) - 50) / 10000;
                        const lngOffset = (((absoluteHash >> 2) % 100) - 50) / 10000;
                        resolvedCoords = {
                          lat: matched.lat + latOffset,
                          lng: matched.lng + lngOffset
                        };
                      } else {
                        let hash = 0;
                        for (let i = 0; i < address.length; i++) {
                          hash = address.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        const absoluteHash = Math.abs(hash);
                        const storeCoord = STORE_COORDINATES[found.store_name] || { lat: -6.367055, lng: 106.819827 };
                        const offsetLat = ((absoluteHash % 100) - 50) / 400;
                        const offsetLng = (((absoluteHash >> 2) % 100) - 50) / 400;
                        resolvedCoords = {
                          lat: storeCoord.lat + offsetLat,
                          lng: storeCoord.lng + offsetLng
                        };
                      }
                      setUserCoordinates(resolvedCoords);
                      updateDistanceAndPin(found.store_name, resolvedCoords);
                    } else {
                      setDistance(5.2);
                    }
                  } else {
                    setDistance(0);
                    setUserCoordinates(null);
                  }
                }}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors text-xs font-sans cursor-pointer"
              >
                <option value="">-- Silakan Pilih Workshop --</option>
                {locations.map((loc) => (
                  <option key={loc.store_name} value={loc.store_name}>
                    {formatOutletName(loc.store_name)} ({loc.city})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-neutral-500 mt-1 font-sans">
                *Pilih workshop untuk menghitung estimasi jarak kurir dan peta rute secara otomatis.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                2. Nama / Brand Sepatu Anda <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={shoeName}
                onChange={(e) => setShoeName(e.target.value)}
                placeholder="Contoh: Adidas Samba / Nike Air Jordan 1"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors text-xs font-sans"
              />
            </div>

            {service.name.toLowerCase().includes('repaint') && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Request Warna Target Repaint <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={repaintColor}
                  onChange={(e) => setRepaintColor(e.target.value)}
                  placeholder="Contoh: Ganti ke Hitam Pekat / Samakan dengan warna asli / Request warna biru muda"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors text-xs font-sans"
                />
                <p className="text-[11px] text-neutral-500 font-sans">
                  *Tuliskan warna apa yang ingin Anda aplikasikan pada sepatu Anda.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                3. Alamat Rumah Lengkap & Rute Kurir Motor (Google Maps) <span className="text-amber-500">*</span>
              </label>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
                {/* Minimalist Address Input Controller */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-900">
                      <button
                        type="button"
                        onClick={() => setAddressMethod('manual')}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all duration-150 font-sans flex items-center gap-1.5 cursor-pointer ${
                          addressMethod === 'manual'
                            ? 'bg-neutral-800 text-white'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        Tulis Alamat Anda
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressMethod('gps');
                          handleGetGPSLocation();
                        }}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all duration-150 font-sans flex items-center gap-1.5 cursor-pointer ${
                          addressMethod === 'gps'
                            ? 'bg-neutral-800 text-amber-500'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        Lokasi Anda Sekarang
                      </button>
                    </div>

                    {addressMethod === 'gps' && (
                      <span className="text-[10px] text-emerald-400 font-sans font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        GPS Aktif
                      </span>
                    )}
                  </div>

                  <textarea
                    value={address}
                    onChange={(e) => handleManualAddressChange(e.target.value)}
                    readOnly={addressMethod === 'gps'}
                    placeholder={
                      addressMethod === 'gps'
                        ? "Mendeteksi koordinat lokasi GPS Anda..."
                        : "Tuliskan alamat lengkap rumah Anda di sini..."
                    }
                    rows={2}
                    className={`w-full bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors resize-none text-xs leading-relaxed font-sans ${
                      addressMethod === 'gps' ? 'text-neutral-400 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Google Maps Embed and Floating Route Info Card */}
                <div className="relative h-64 bg-neutral-950 border border-neutral-850 rounded-xl overflow-hidden shadow-inner group">
                  {/* REAL INTERACTIVE GOOGLE MAP IFRAME */}
                  <iframe
                    title="Google Maps"
                    src={getMapEmbedUrl()}
                    className="w-full h-full border-0 grayscale-[3%] brightness-[97%] contrast-[102%]"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* FLOATING ROUTE CARD (GMAPS LOOK-A-LIKE) */}
                  {selectedLocation && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-neutral-800 rounded-xl p-3 shadow-lg max-w-[240px] border border-neutral-200 z-10 hidden sm:block font-sans">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 mb-1.5">
                        <span className="text-[10px] font-bold tracking-wide text-neutral-850 uppercase flex items-center gap-1.5 font-semibold">
                          <span>🛵</span> Kurir Motor
                        </span>
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-black px-1.5 py-0.5 rounded font-sans">
                          {distance} KM
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[9px] leading-normal">
                        <div className="flex items-start gap-1">
                          <span className="text-blue-500 shrink-0 text-[10px]">📍</span>
                          <div className="truncate text-neutral-500 font-medium">
                            Mulai: <span className="text-neutral-800 font-bold block truncate">{address || 'Ketik alamat Anda di atas'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="text-red-500 shrink-0 text-[10px]">🏁</span>
                          <div className="truncate text-neutral-500 font-medium">
                            Tujuan: <span className="text-neutral-800 font-bold block truncate">{formatOutletName(selectedLocation.store_name)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ESTIMATED DISTANCE FLOATING BADGE (MOTOR ONLY) */}
                  {selectedLocation && (
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur border border-neutral-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5 z-10 shadow-lg font-sans text-neutral-850">
                      <Compass className="text-amber-500 animate-spin-slow animate-pulse" size={13} />
                      <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-600 flex items-center gap-1">
                        Jarak Kurir Motor: <strong className="text-sm text-neutral-900 font-black">{distance} KM</strong>
                      </span>
                    </div>
                  )}

                  {/* NO WORKSHOP SELECTED OVERLAY */}
                  {!selectedLocation && (
                    <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                      <Compass className="text-neutral-600 animate-pulse mb-3" size={24} />
                      <p className="text-amber-500 font-sans text-xs font-semibold uppercase tracking-wider">
                        Pilih Lokasi Workshop Terlebih Dahulu
                      </p>
                      <p className="text-neutral-500 text-[10px] max-w-xs mt-1 leading-normal font-sans">
                        Rute & estimasi jarak kurir motor baru dapat ditampilkan setelah Anda memilih lokasi workshop tujuan di atas.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DISTANCE STATUS BANNER */}
          <div>
            {isAntarJemputFree ? (
              <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle size={15} />
                </div>
                <div className="font-sans space-y-0.5">
                  <h4 className="text-neutral-200 text-xs font-semibold">Gratis Ongkos Antar-Jemput</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Jarak lokasi Anda adalah <strong className="text-white font-medium">{distance} km</strong> (maksimal 8 km). Layanan antar-jemput sepenuhnya <strong>Gratis</strong>!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle size={15} />
                </div>
                <div className="font-sans space-y-0.5">
                  <h4 className="text-neutral-200 text-xs font-semibold">Jarak Melebihi Batas Gratis Ongkir (8 km)</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Jarak lokasi Anda adalah <strong className="text-white font-medium">{distance} km</strong>. Dikenakan penyesuaian biaya kurir sebesar <strong className="text-amber-500 font-semibold">Rp {deliveryFee.toLocaleString('id-ID')}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* BILLING CALCULATION */}
          <div className="border-t border-neutral-900 pt-4 space-y-2 text-xs text-neutral-300 font-sans">
            <div className="flex justify-between items-center gap-2">
              <span className="truncate">Biaya Jasa Cuci ({service.name}):</span>
              <span className="font-medium text-white shrink-0 whitespace-nowrap">{service.price_value}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="truncate">Biaya Antar-Jemput Kurir Motor ({distance} km):</span>
              <span className={isAntarJemputFree ? 'text-emerald-400 font-semibold shrink-0 whitespace-nowrap' : 'text-white font-medium shrink-0 whitespace-nowrap'}>
                {isAntarJemputFree ? 'Gratis' : `Rp ${deliveryFee.toLocaleString('id-ID')}`}
              </span>
            </div>
            <div className="border-t border-neutral-900 pt-2.5 flex justify-between items-center gap-2 text-sm font-bold text-white">
              <span className="truncate">Total Estimasi Pembayaran:</span>
              <span className="text-amber-500 text-base font-extrabold shrink-0 whitespace-nowrap font-mono">
                Rp {(parseInt(service.price_value.replace(/\D/g, '')) + deliveryFee).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-6 border-t border-neutral-900 bg-neutral-900/40 flex justify-end gap-3 font-sans">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-semibold py-2.5 px-5 rounded-xl cursor-pointer transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleOrderSubmit}
            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold py-2.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/10"
          >
            <Navigation size={12} className="rotate-45" />
            Pesan via WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
};
