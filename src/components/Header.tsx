import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoeLogoIcon } from './ShoeLogoSvg';

export const Header: React.FC = () => {
  const { currentPage, setCurrentPage, currentUser, handleLogout, openLoginModal, latestEmail, setEmailModalOpen } = useStore();

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-neutral-900 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* Premium Brand Logo */}
        <button onClick={() => setCurrentPage('beranda')} className="flex items-center gap-4 group text-left cursor-pointer bg-transparent border-0 p-0">
          <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <ShoeLogoIcon className="h-14 w-14 drop-shadow-[0_4px_12px_rgba(255,183,0,0.3)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-logo text-lg md:text-xl tracking-[0.2em] text-white font-bold leading-none uppercase whitespace-nowrap">SHOES <span className="text-[#ffb700]">LAVANDERÍA</span></span>
            <span className="text-[9px] tracking-[0.32em] text-neutral-400 font-mono uppercase mt-1.5 leading-none font-medium whitespace-nowrap">Limpieza De Calzado Premium</span>
          </div>
        </button>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center md:space-x-4 lg:space-x-8 text-[11px] lg:text-xs font-bold tracking-widest uppercase text-neutral-300">
          <button 
            onClick={() => setCurrentPage('beranda')} 
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 ${currentPage === 'beranda' ? 'text-[#ffb700]' : 'hover:text-[#ffb700]'}`}
          >
            Beranda
          </button>
          <button 
            onClick={() => setCurrentPage('layanan')} 
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 ${currentPage === 'layanan' ? 'text-[#ffb700]' : 'hover:text-[#ffb700]'}`}
          >
            Layanan
          </button>
          <button 
            onClick={() => setCurrentPage('lokasi')} 
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 ${currentPage === 'lokasi' ? 'text-[#ffb700]' : 'hover:text-[#ffb700]'}`}
          >
            Lokasí
          </button>
          <button 
            onClick={() => setCurrentPage('promo')} 
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 ${currentPage === 'promo' ? 'text-[#ffb700]' : 'hover:text-[#ffb700]'}`}
          >
            Promo
          </button>
          <button 
            onClick={() => setCurrentPage('asesor')} 
            className={`transition-colors cursor-pointer bg-transparent border-0 py-1 ${currentPage === 'asesor' ? 'text-[#ffb700]' : 'hover:text-[#ffb700]'}`}
          >
            Asesor Hub
          </button>
        </nav>

        {/* Action Button & Auth section */}
        <div className="flex items-center gap-4 font-mono">
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center">
                  <span className="text-neutral-300 text-[10px] font-bold tracking-widest uppercase">{currentUser.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-neutral-900 hover:bg-red-600 hover:border-red-600 text-white font-bold text-[10px] tracking-widest px-4.5 h-11 border border-neutral-850 uppercase transition-all cursor-pointer inline-flex items-center justify-center"
                  id="navbar-logout-btn"
                >
                  Keluar
                </button>
              </>
            ) : (
              <button 
                onClick={() => openLoginModal()}
                className="bg-[#ffb700] hover:bg-[#e0a100] hover:border-[#e0a100] text-black font-bold text-[10px] tracking-widest px-4.5 h-11 border border-[#ffb700] uppercase transition-all cursor-pointer inline-flex items-center justify-center"
                id="navbar-login-btn"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
