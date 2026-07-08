import React from 'react';
import { useStore } from '../context/StoreContext';
import { FeatureIcon } from './FeatureIcon';
import { ShoeLogoIcon } from './ShoeLogoSvg';

export const Landing: React.FC = () => {
  const { features, services, setCurrentPage, triggerWhatsAppWithAuth, toggleChatbot } = useStore();

  // Filter first 3 services for preview
  const previewServices = services.slice(0, 3);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-6 overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        
        {/* Abstract Color-Block Accents in Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ffb700] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neutral-800 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <span className="text-[#ffb700] text-xs font-bold tracking-[0.3em] uppercase mb-4 block font-mono">
            ― SHOES LAVANDERÍA
          </span>
          <h1 className="font-display text-4xl md:text-7xl text-white tracking-wide mb-6 leading-none uppercase font-bold">
            CUCI SEPATU CIRI KHAS SPANYOL<br />
            <span className="text-[#ffb700] underline decoration-4 underline-offset-8">DI INDONESIA</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-12">
            Kami menghadirkan rahasia keahlian perawatan sepatu terbaik khas Spanyol langsung ke Indonesia. Dengan memadukan ketelitian teknik artisan Eropa dan produk ramah lingkungan berkualitas tinggi, kami memastikan sepatu kesayangan Anda mendapatkan perawatan kelas dunia yang aman, detail, dan profesional di tanah air.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button 
              onClick={() => setCurrentPage('layanan')}
              className="w-full sm:w-auto bg-[#ffb700] hover:bg-white text-black font-bold py-4 px-8 rounded-full tracking-widest text-xs uppercase transition-all border border-[#ffb700] hover:border-white text-center cursor-pointer"
            >
              Gunakan Layanan Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-black py-16 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="border-b md:border-b-0 md:border-r border-neutral-800 pb-8 md:pb-0 md:pr-8">
              <div className="font-display text-6xl text-[#ffb700] font-bold">6</div>
              <p className="text-neutral-400 text-xs tracking-widest uppercase mt-2 font-mono">Workshop Partner</p>
            </div>
            <div className="border-b md:border-b-0 md:border-r border-neutral-800 pb-8 md:pb-0 md:pr-8">
              <div className="font-display text-6xl text-[#ffb700] font-bold">3.200+</div>
              <p className="text-neutral-400 text-xs tracking-widest uppercase mt-2 font-mono">Sepatu Dirawat</p>
            </div>
            <div>
              <div className="font-display text-6xl text-[#ffb700] font-bold">1.800+</div>
              <p className="text-neutral-400 text-xs tracking-widest uppercase mt-2 font-mono">Pelanggan Puas</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="mb-16">
            <span className="text-[#ffb700] text-xs font-bold tracking-[0.2em] uppercase font-mono block mb-2">― OUR COMMITMENT</span>
            <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none mb-4 uppercase font-bold">
              BAWA SEPATU KOTORMU, BAWA PULANG KEPERCAYAAN DIRIMU.
            </h2>
            <p className="text-neutral-400 max-w-2xl text-sm leading-relaxed">
              Shoes Lavandería adalah pelopor jasa perawatan sepatu premium di Indonesia yang mengadaptasi dedikasi dan standar kualitas legendaris khas Spanyol. Kami hadir untuk memberikan solusi perawatan alas kaki terbaik dengan sentuhan profesional yang praktis bagi Anda.
            </p>
          </div>

          {/* Features Dynamic Grid Container - ALWAYS 1 COL AS REQUESTED BY USER */}
          <div className="grid grid-cols-1 gap-6" id="features-container">
            {features.map((item, index) => (
              <div 
                key={item.id || index} 
                className="bg-[#121212] p-8 border border-neutral-900 rounded-3xl hover:border-[#ffb700] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#ffb700] flex items-center justify-center flex-shrink-0 shadow-[0_4px_20px_rgba(255,183,0,0.2)]">
                  <FeatureIcon iconName={item.icon_name} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-display text-lg text-white font-bold tracking-widest uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed max-w-3xl mb-1">
                    {item.description}
                  </p>
                  {item.title === 'KONSULTASI GRATIS' && (
                    <button 
                      onClick={() => toggleChatbot(true)}
                      className="mt-4 bg-[#ffb700] hover:bg-white text-black font-bold py-2.5 px-5 rounded-full tracking-widest text-[10px] uppercase transition-colors duration-200 cursor-pointer border-0 inline-flex items-center gap-2 shadow-[0_2px_10px_rgba(255,183,0,0.15)]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Mulai Chat Bot AI
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES PREVIEW SECTION */}
      <section className="py-24 px-6 bg-[#0c0c0c] border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[#ffb700] text-xs font-bold tracking-[0.2em] uppercase font-mono block mb-2">― SERVICES LIST</span>
              <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider leading-none uppercase font-bold">
                LAYANAN UTAMA KAMI
              </h2>
            </div>
            <button 
              onClick={() => setCurrentPage('layanan')}
              className="inline-block bg-transparent hover:bg-[#ffb700] text-[#ffb700] hover:text-black font-bold tracking-widest text-xs py-3.5 px-8 rounded-full uppercase transition-all border-2 border-[#ffb700] text-center cursor-pointer"
            >
              Lihat Semua Layanan →
            </button>
          </div>

          {/* Services Dynamic Preview Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="services-preview-container">
            {previewServices.map((item, index) => (
              <div 
                key={item.id || index}
                className="bg-[#1c1c1c] p-8 rounded-3xl border border-neutral-800 hover:border-[#ffb700] transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] hover:shadow-2xl"
              >
                <div>
                  <div className="text-xs font-bold text-[#ffb700] tracking-widest mb-1 font-mono uppercase">
                    {item.price_label}
                  </div>
                  <div className="font-display text-4xl text-white tracking-tight mb-4 font-bold">
                    {item.price_value}
                  </div>
                  <div className="h-[1px] bg-neutral-800 mb-6"></div>
                  <h3 className="font-display text-2xl text-white tracking-wider mb-2 uppercase font-bold">
                    {item.name}
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>
                <div>
                  <button 
                    onClick={() => setCurrentPage('layanan')}
                    className="w-full text-center bg-[#ffb700] hover:bg-white hover:text-black text-black font-bold py-3.5 px-4 rounded-full tracking-widest text-[10px] transition-colors duration-200 block uppercase cursor-pointer border-0"
                  >
                    INFO DETAIL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCENT BANNER (Typography & Solid block) */}
      <section className="bg-[#ffb700] text-black py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-7xl leading-none tracking-wider mb-6 uppercase font-bold">
            JANGAN BIARKAN SEPATU KUSAM MERUSAK PENAMPILANMU!
          </h2>
          <p className="text-black/80 font-bold max-w-2xl mx-auto text-sm leading-relaxed mb-10">
            Kembalikan penampilan terbaik sepatu kesayangan Anda dengan perawatan berstandar tinggi khas Spanyol yang kini hadir di Indonesia. Konsultasikan gratis sekarang dan rasakan bedanya!
          </p>
          <button 
            onClick={() => triggerWhatsAppWithAuth("https://wa.me/6285776909036")}
            className="inline-block bg-black hover:bg-neutral-900 text-[#ffb700] font-bold tracking-widest text-xs py-4 px-10 rounded-full uppercase transition-all border-2 border-black cursor-pointer"
          >
            Hubungi Customer Care
          </button>
        </div>
      </section>
    </div>
  );
};
