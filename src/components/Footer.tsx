import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoeLogoIcon } from './ShoeLogoSvg';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <footer className="bg-[#0c0c0c] border-t border-neutral-900 py-16 px-6 text-neutral-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand column */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <ShoeLogoIcon className="h-16 w-16 drop-shadow-[0_4px_12px_rgba(255,183,0,0.3)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-logo text-lg tracking-[0.2em] text-white font-bold leading-none uppercase whitespace-nowrap">SHOES <span className="text-[#ffb700]">LAVANDERÍA</span></span>
              <span className="text-[8px] tracking-[0.3em] text-neutral-400 font-mono uppercase mt-1.5 leading-none font-medium whitespace-nowrap">Limpieza De Calzado Premium</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            Jasa perawatan dan cuci sepatu premium pertama di Indonesia dengan sentuhan kebersihan legendaris khas Spanyol, garansi gratis cuci ulang, antar-jemput, dan konsultasi gratis.
          </p>
        </div>

        {/* Fast links column */}
        <div className="md:pl-12 lg:pl-20">
          <h4 className="text-white font-mono text-xs font-bold tracking-widest uppercase mb-6">Navigasi Halaman</h4>
          <ul className="space-y-3 text-xs tracking-wider">
            <li>
              <button onClick={() => setCurrentPage('beranda')} className="hover:text-[#ffb700] transition-colors bg-transparent border-0 p-0 text-left cursor-pointer">
                Beranda
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('layanan')} className="hover:text-[#ffb700] transition-colors bg-transparent border-0 p-0 text-left cursor-pointer">
                Layanan Kami
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('lokasi')} className="hover:text-[#ffb700] transition-colors bg-transparent border-0 p-0 text-left cursor-pointer">
                Lokasí Workshop
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('promo')} className="hover:text-[#ffb700] transition-colors bg-transparent border-0 p-0 text-left cursor-pointer">
                Promo Spesial
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('asesor')} className="hover:text-[#ffb700] transition-colors bg-transparent border-0 p-0 text-left cursor-pointer">
                Asesor Hub (Kebutuhan & Flow)
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-mono text-xs font-bold tracking-widest uppercase mb-6">Hubungi Kami</h4>
          <ul className="space-y-4 text-xs text-neutral-500">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#ffb700] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              <div>
                <span className="text-white block font-bold">Layanan Pelanggan (WhatsApp)</span>
                <a href="https://wa.me/6285776909036" target="_blank" rel="noreferrer" className="hover:text-[#ffb700] transition-colors text-neutral-400">+62 857 7690 9036</a>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#ffb700] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25M12 13.5a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
              <div>
                <span className="text-white block font-bold">Kantor Pusat</span>
                <span className="text-neutral-400">Jl. Margonda Raya No. 45, Beji, Kota Depok, Jawa Barat 16421</span>
              </div>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-900 text-center text-[11px] font-mono text-neutral-600 uppercase">
        &copy; 2026 SHOES LAVANDERÍA. ALL RIGHTS RESERVED. DESIGNED WITH PRECISION.
      </div>
    </footer>
  );
};
