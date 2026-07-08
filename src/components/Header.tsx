import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoeLogoIcon } from './ShoeLogoSvg';
import { Menu, X, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPage, setCurrentPage, currentUser, handleLogout, openLoginModal } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] bg-black border-b border-neutral-900 transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
        
        {/* Premium Brand Logo */}
        <button 
          onClick={() => {
            setCurrentPage('beranda');
            setIsMobileMenuOpen(false);
          }} 
          className="flex items-center gap-2 md:gap-4 group text-left cursor-pointer bg-transparent border-0 p-0"
        >
          <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <ShoeLogoIcon className="h-10 w-10 md:h-14 md:w-14 drop-shadow-[0_4px_12px_rgba(255,183,0,0.3)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-logo text-xs sm:text-sm md:text-lg lg:text-xl tracking-[0.12em] sm:tracking-[0.2em] text-white font-bold leading-none uppercase whitespace-nowrap">
              SHOES <span className="text-[#ffb700]">LAVANDERÍA</span>
            </span>
            <span className="text-[7px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.32em] text-neutral-400 font-mono uppercase mt-1 md:mt-1.5 leading-none font-medium whitespace-nowrap">
              Limpieza De Calzado Premium
            </span>
          </div>
        </button>

        {/* Navigation links (Desktop only) */}
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
            Lokasi
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

        {/* Desktop Auth section & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 font-mono">
          {/* Auth Button (Desktop only, hidden on small screens) */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="text-neutral-300 text-[10px] font-bold tracking-widest uppercase">{currentUser.name}</span>
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

          {/* Hamburger Menu Toggle (Mobile only) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center text-neutral-300 hover:text-[#ffb700] bg-transparent border-0 p-2 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay (Dimming background below the header) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-[999] animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Dropdown Menu (Positioned attached below the header) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 z-[1000] bg-black border-b border-neutral-900 shadow-2xl max-h-[70vh] overflow-y-auto flex flex-col py-6 px-6 animate-fadeIn">
          <nav className="flex flex-col space-y-1 text-sm font-bold tracking-widest uppercase text-neutral-300">
            <button 
              onClick={() => {
                setCurrentPage('beranda');
                setIsMobileMenuOpen(false);
              }} 
              className={`w-full flex items-center justify-between py-3.5 border-b border-neutral-900/60 text-left font-sans text-xs sm:text-sm tracking-widest font-bold uppercase transition-colors cursor-pointer bg-transparent border-0 group ${currentPage === 'beranda' ? 'text-[#ffb700]' : 'text-neutral-300 hover:text-[#ffb700]'}`}
            >
              <span>Beranda</span>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${currentPage === 'beranda' ? 'text-[#ffb700]' : 'text-neutral-600 group-hover:text-[#ffb700]'}`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('layanan');
                setIsMobileMenuOpen(false);
              }} 
              className={`w-full flex items-center justify-between py-3.5 border-b border-neutral-900/60 text-left font-sans text-xs sm:text-sm tracking-widest font-bold uppercase transition-colors cursor-pointer bg-transparent border-0 group ${currentPage === 'layanan' ? 'text-[#ffb700]' : 'text-neutral-300 hover:text-[#ffb700]'}`}
            >
              <span>Layanan</span>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${currentPage === 'layanan' ? 'text-[#ffb700]' : 'text-neutral-600 group-hover:text-[#ffb700]'}`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('lokasi');
                setIsMobileMenuOpen(false);
              }} 
              className={`w-full flex items-center justify-between py-3.5 border-b border-neutral-900/60 text-left font-sans text-xs sm:text-sm tracking-widest font-bold uppercase transition-colors cursor-pointer bg-transparent border-0 group ${currentPage === 'lokasi' ? 'text-[#ffb700]' : 'text-neutral-300 hover:text-[#ffb700]'}`}
            >
              <span>Lokasi</span>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${currentPage === 'lokasi' ? 'text-[#ffb700]' : 'text-neutral-600 group-hover:text-[#ffb700]'}`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('promo');
                setIsMobileMenuOpen(false);
              }} 
              className={`w-full flex items-center justify-between py-3.5 border-b border-neutral-900/60 text-left font-sans text-xs sm:text-sm tracking-widest font-bold uppercase transition-colors cursor-pointer bg-transparent border-0 group ${currentPage === 'promo' ? 'text-[#ffb700]' : 'text-neutral-300 hover:text-[#ffb700]'}`}
            >
              <span>Promo</span>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${currentPage === 'promo' ? 'text-[#ffb700]' : 'text-neutral-600 group-hover:text-[#ffb700]'}`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('asesor');
                setIsMobileMenuOpen(false);
              }} 
              className={`w-full flex items-center justify-between py-3.5 border-b border-neutral-900/60 text-left font-sans text-xs sm:text-sm tracking-widest font-bold uppercase transition-colors cursor-pointer bg-transparent border-0 group ${currentPage === 'asesor' ? 'text-[#ffb700]' : 'text-neutral-300 hover:text-[#ffb700]'}`}
            >
              <span>Asesor Hub</span>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-1 ${currentPage === 'asesor' ? 'text-[#ffb700]' : 'text-neutral-600 group-hover:text-[#ffb700]'}`} />
            </button>
          </nav>

          <div className="flex flex-col gap-4 mt-6">
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500 text-[9px] font-mono tracking-widest uppercase">MASUK SEBAGAI</span>
                  <span className="text-[#ffb700] text-[10px] font-mono font-bold tracking-wider uppercase">{currentUser.name}</span>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-neutral-950 hover:bg-red-950 hover:text-red-400 text-white font-bold text-[10px] tracking-widest py-3 border border-neutral-850 hover:border-red-900/30 uppercase transition-all cursor-pointer text-center font-mono rounded-lg"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  openLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-[#ffb700] hover:bg-[#e0a100] text-black font-bold text-[10px] tracking-widest py-3 uppercase transition-all cursor-pointer text-center font-mono rounded-lg"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
