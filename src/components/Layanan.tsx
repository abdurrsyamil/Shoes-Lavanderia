import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BookingModal } from './BookingModal';
import { Service } from '../types';

export const Layanan: React.FC = () => {
  const { services, currentUser, openLoginModal, triggerWhatsAppWithAuth } = useStore();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (item: Service) => {
    if (!currentUser) {
      openLoginModal(() => {
        setSelectedService(item);
        setIsModalOpen(true);
      });
    } else {
      setSelectedService(item);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="bg-neutral-100 text-neutral-900 min-h-screen">
      {/* PAGE HEADER */}
      <section className="bg-black text-white py-20 px-6 border-b-4 border-black relative overflow-hidden">
        {/* Solid block color styling without photos */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[#ffb700] opacity-5 skew-x-12 translate-x-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-[#ffb700] text-xs font-mono font-bold tracking-widest block mb-2">― MENU & JASA</span>
          <h1 className="font-display text-6xl md:text-8xl tracking-wider leading-none mb-4 uppercase font-bold">LAYANAN KAMI</h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Kami membawa standar emas perawatan sepatu khas Spanyol ke Indonesia. Setiap pasang sepatu ditangani dengan dedikasi tinggi oleh tim ahli lokal terlatih menggunakan metode pembersihan mendalam yang aman dan ramah lingkungan.
          </p>
        </div>
      </section>

      {/* SERVICES GRID SECTION */}
      <section className="py-24 px-6 bg-neutral-100">
        <div className="max-w-7xl mx-auto">
          {/* Services dynamic container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="services-container">
            {services.map((item, index) => {
              const isAntarJemput = item.name.toUpperCase().includes('ANTAR') || item.price_value.toUpperCase().includes('ANTAR');

              return (
                <div 
                  key={item.id || index}
                  className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-gray-500 tracking-widest mb-1 font-mono uppercase">
                      {item.price_label}
                    </div>
                    <div className="font-display text-4xl text-black tracking-tight mb-4 font-bold">
                      {item.price_value}
                    </div>
                    <div className="h-[1px] bg-neutral-200 mb-6"></div>
                    <h3 className="font-display text-3xl text-black tracking-wider mb-3 uppercase font-bold">
                      {item.name}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-8">
                      {item.description}
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleServiceClick(item)}
                      className={`w-full text-center font-bold py-3.5 px-6 rounded-full tracking-widest text-xs transition-colors duration-200 block uppercase cursor-pointer border-0 ${
                        isAntarJemput 
                          ? 'bg-black hover:bg-[#ffb700] hover:text-black text-white' 
                          : 'bg-[#ffb700] hover:bg-black hover:text-white text-black'
                      }`}
                    >
                      {isAntarJemput ? 'Hubungi Kami Sekarang' : 'Pesan Layanan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Form Details & Map Distance Tracker Modal */}
      <BookingModal 
        service={selectedService} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* IMPORTANT GUARANTEE BANNER (SOLID BLACK BLOCK) */}
      <section className="bg-black text-white py-20 px-6 border-t-4 border-[#ffb700]">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[#ffb700] text-xs font-mono font-bold tracking-[0.2em] uppercase block mb-3">― TRANQUILO, AMIGO!</span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-wider mb-6 leading-tight font-bold">
            SEPATU BERSIH TAMPIL MANIS,<br />
            MASIH KOTOR? KAMI CUCI ULANG GRATIS!
          </h2>
          <p className="text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed mb-8">
            Kami berkomitmen memberikan kualitas perawatan sepatu terbaik dengan mengadopsi standar ketelitian tinggi ala Spanyol yang kini hadir di Indonesia. Setiap layanan cuci sepatu kami dilindungi oleh Garansi Cuci Ulang 100% jika Anda kurang puas dengan hasilnya. Hubungi kami dalam waktu 24 jam setelah serah terima sepatu.
          </p>
          <div className="inline-flex gap-4">
            <button 
              onClick={() => triggerWhatsAppWithAuth("https://wa.me/6285776909036?text=Halo%20Shoes%20Lavander%C3%ADa,%20saya%20ingin%20bertanya%20tentang%20Syarat%20dan%20Ketentuan%20Garansi%20Cuci%20Ulang.")}
              className="bg-[#ffb700] hover:bg-white text-black font-bold py-3.5 px-8 rounded-full tracking-widest text-xs uppercase transition-all duration-300 cursor-pointer border-0"
            >
              Tanya Syarat & Ketentuan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
