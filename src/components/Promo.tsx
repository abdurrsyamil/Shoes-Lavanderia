import React from 'react';
import { useStore } from '../context/StoreContext';

export const Promo: React.FC = () => {
  const { promos, triggerWhatsAppWithAuth } = useStore();

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      {/* PAGE HEADER */}
      <section className="bg-black text-white py-20 px-6 border-b border-neutral-900 relative overflow-hidden">
        {/* Solid color accent decoration */}
        <div className="absolute left-0 bottom-0 h-2 bg-[#ffb700] w-full"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-[#ffb700] text-xs font-mono font-bold tracking-widest block mb-2">― SPECIAL OFFERS</span>
          <h1 className="font-display text-6xl md:text-8xl tracking-wider leading-none mb-4 uppercase font-bold">
            PROMO & PENAWARAN <span class="text-[#ffb700]">SPESIAL</span>.
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Kami memberikan berbagai promo menarik dengan kemeriahan festival ala Spanyol di setiap toko kami untuk Anda. Nikmati penawaran paket hemat berkualitas kasta tertinggi.
          </p>
        </div>
      </section>

      {/* PROMOS GRID SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Promo Container Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="promos-container">
            {promos.map((item, index) => {
              // Split benefit bullet points
              const benefitsList = item.benefits.split('\n').filter(b => b.trim().length > 0);
              const waUrl = `https://wa.me/6285776909036?text=Halo%20Shoes%20Lavander%C3%ADa,%20saya%20tertarik%20dengan%20promo%20${encodeURIComponent(item.title)}.`;

              return (
                <div 
                  key={item.id || index}
                  className="bg-white rounded-3xl border border-neutral-200 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-[#10b981] text-white font-mono text-[10px] font-bold px-3 py-1 tracking-widest rounded-full uppercase">
                        {item.status}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl text-black tracking-wider mb-6 leading-none uppercase font-bold">
                      {item.title}
                    </h3>
                    <ul className="mb-4">
                      {benefitsList.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-start text-sm text-neutral-600 mb-2">
                          <svg className="w-4 h-4 text-[#ffb700] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{benefit.replace(/^[•\-\s]+/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 pt-0">
                    <button 
                      onClick={() => triggerWhatsAppWithAuth(waUrl)}
                      className="w-full text-center bg-black hover:bg-[#ffb700] hover:text-black text-white font-bold py-3.5 rounded-full tracking-widest text-xs transition-colors duration-200 block uppercase cursor-pointer border-0"
                    >
                      LIHAT PROMO →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ / COMMUNITY BANNER */}
      <section className="py-20 px-6 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-black tracking-wider mb-4 uppercase font-bold">Ingin Custom Promo untuk Komunitas Anda?</h2>
          <p className="text-neutral-600 text-sm max-w-2xl mx-auto leading-relaxed mb-8">
            Shoes Lavandería mendukung berbagai kegiatan komunitas, korporat, dan sekolah dengan semangat kekeluargaan ("comunidad") khas Spanyol. Hubungi admin kami untuk penawaran harga khusus kemitraan kuantitas besar.
          </p>
          <button 
            onClick={() => triggerWhatsAppWithAuth("https://wa.me/6285776909036?text=Halo%20Shoes%20Lavander%C3%ADa,%20saya%20ingin%20bertanya%20mengenai%20kerjasama%20promo%20komunitas.")}
            className="bg-black hover:bg-[#ffb700] hover:text-black text-white font-bold py-4 px-8 rounded-full tracking-widest text-xs uppercase transition-colors inline-block cursor-pointer border-0"
          >
            HUBUNGI ADMIN KEMITRAAN
          </button>
        </div>
      </section>
    </div>
  );
};
