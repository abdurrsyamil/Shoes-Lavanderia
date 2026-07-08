import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const Lokasi: React.FC = () => {
  const { locations, triggerWhatsAppWithAuth } = useStore();
  const [filter, setFilter] = useState<string>('all');

  const filteredLocations = filter === 'all' 
    ? locations 
    : locations.filter(loc => loc.city.toLowerCase() === filter.toLowerCase());

  return (
    <div className="bg-[#ffb700] text-black min-h-screen">
      {/* LOKASI WORKSHOP HEADER & FILTER BAR */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-black text-xs font-mono font-bold tracking-[0.2em] uppercase block mb-2">― OUTLETS & WORKSHOPS</span>
          <h1 className="font-display text-6xl md:text-8xl text-black tracking-wider leading-none mb-4 uppercase font-bold">LOKASÍ WORKSHOP</h1>
          <p className="text-neutral-900 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-12">
            Temukan lokasí workshop Shoes Lavandería di berbagai kota dan nikmati pelayanan perawatan sepatu premium terdekat Anda dengan keahlian serta formula steril khas Spanyol.
          </p>

          {/* Interactive Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => setFilter('all')}
              className={`font-bold text-xs font-mono tracking-widest py-3 px-6 rounded-full uppercase transition-all duration-150 cursor-pointer ${filter === 'all' ? 'bg-black text-white border-0' : 'bg-white text-black hover:bg-neutral-100 border border-neutral-300'}`}
            >
              Reset Filter
            </button>
            <button 
              onClick={() => setFilter('jakarta')}
              className={`font-bold text-xs font-mono tracking-widest py-3 px-6 rounded-full uppercase transition-all duration-150 cursor-pointer ${filter === 'jakarta' ? 'bg-black text-white border-0' : 'bg-white text-black hover:bg-neutral-100 border border-neutral-300'}`}
            >
              Jakarta
            </button>
            <button 
              onClick={() => setFilter('yogyakarta')}
              className={`font-bold text-xs font-mono tracking-widest py-3 px-6 rounded-full uppercase transition-all duration-150 cursor-pointer ${filter === 'yogyakarta' ? 'bg-black text-white border-0' : 'bg-white text-black hover:bg-neutral-100 border border-neutral-300'}`}
            >
              Yogyakarta
            </button>
            <button 
              onClick={() => setFilter('jawa barat')}
              className={`font-bold text-xs font-mono tracking-widest py-3 px-6 rounded-full uppercase transition-all duration-150 cursor-pointer ${filter === 'jawa barat' ? 'bg-black text-white border-0' : 'bg-white text-black hover:bg-neutral-100 border border-neutral-300'}`}
            >
              Jawa Barat
            </button>
          </div>
        </div>
      </section>

      {/* LOKASI GRID SECTION */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredLocations.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-neutral-200 p-8 shadow-md">
              <p className="text-black font-bold tracking-wider uppercase">Tidak ada workshop ditemukan untuk filter ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="locations-container">
              {filteredLocations.map((item, index) => {
                const mapsLink = item.gmaps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.store_name)}`;
                
                return (
                  <div 
                    key={item.id || index}
                    className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#ffb700] tracking-widest mb-1 font-mono uppercase">― {item.city.toUpperCase()}</div>
                      <h3 className="font-display text-3xl text-black tracking-wider mb-2 leading-none font-bold uppercase">{item.store_name}</h3>
                      <p className="text-gray-600 text-sm tracking-tight mb-8">{item.operating_hours}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <a 
                        href={mapsLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-center bg-white hover:bg-neutral-100 text-black border border-neutral-300 rounded-full font-bold py-3 text-xs tracking-wider uppercase transition-all duration-300"
                      >
                        LOKASI
                      </a>
                      <button 
                        onClick={() => triggerWhatsAppWithAuth(item.whatsapp_url)}
                        className="text-center bg-[#ffb700] hover:bg-black hover:text-white rounded-full text-black font-bold py-3 text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer border-0"
                      >
                        WHATSAPP
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
