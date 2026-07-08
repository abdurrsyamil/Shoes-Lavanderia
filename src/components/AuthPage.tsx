import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoeLogoIcon } from './ShoeLogoSvg';

export const AuthPage: React.FC = () => {
  const { 
    authModalOpen, 
    authModalTab, 
    authModalError, 
    closeLoginModal, 
    setAuthModalTab, 
    handleLogin, 
    handleRegister,
    otpStep,
    otpCode,
    otpPendingUser,
    setOtpStep,
    verifyOtpAndComplete
  } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setLocalError('HARAP ISI ALAMAT EMAIL ANDA!');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setLocalError('HARAP MASUKKAN ALAMAT EMAIL YANG VALID!');
      return;
    }

    if (authModalTab === 'register') {
      if (!name.trim()) {
        setLocalError('HARAP MASUKKAN NAMA LENGKAP ANDA!');
        return;
      }
      // Register without password
      const success = handleRegister(name, cleanEmail, '');
      if (success) {
        // Reset fields
        setName('');
        setEmail('');
        setPassword('');
      }
    } else {
      const success = handleLogin(cleanEmail, password);
      if (success) {
        // Reset fields
        setName('');
        setEmail('');
        setPassword('');
      }
    }
  };

  const activeError = localError || authModalError;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] overflow-y-auto p-4 transition-all duration-300">
      <div className="min-h-full flex items-center justify-center">
        <div className="bg-[#121212] w-full max-w-md rounded-3xl border border-neutral-800 text-white shadow-2xl p-8 relative flex flex-col justify-between my-8">
          
          {/* Close Button */}
          <button 
            onClick={closeLoginModal} 
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1 bg-transparent border-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Modal Brand */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center justify-center mb-4">
              <ShoeLogoIcon className="h-16 w-16 drop-shadow-[0_4px_16px_rgba(255,183,0,0.35)]" />
              <span className="font-logo text-xl tracking-[0.2em] text-white font-bold uppercase mt-3">SHOES <span className="text-[#ffb700]">LAVANDERÍA</span></span>
              <span className="text-[8px] tracking-[0.3em] text-neutral-400 font-mono uppercase mt-1 leading-none font-medium">Limpieza De Calzado Premium</span>
            </div>
            
            <h2 className="font-display text-2xl tracking-wider text-white uppercase font-bold">
              {authModalTab === 'login' ? 'SIGN IN' : 'DAFTAR BARU'}
            </h2>
            <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
              Silakan masuk atau mendaftar menggunakan nama dan email Anda.
            </p>
          </div>

          {/* Error Box */}
          {activeError && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs font-mono p-3.5 mb-6 rounded-xl uppercase tracking-wider text-center">
              {activeError}
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-neutral-800 mb-6">
            <button 
              type="button"
              onClick={() => { setAuthModalTab('login'); setLocalError(''); }}
              className={`flex-1 text-center py-2 text-xs font-bold tracking-widest uppercase border-b-2 bg-transparent cursor-pointer ${authModalTab === 'login' ? 'border-[#ffb700] text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
            >
              SIGN IN
            </button>
            <button 
              type="button"
              onClick={() => { setAuthModalTab('register'); setLocalError(''); }}
              className={`flex-1 text-center py-2 text-xs font-bold tracking-widest uppercase border-b-2 bg-transparent cursor-pointer ${authModalTab === 'register' ? 'border-[#ffb700] text-white' : 'border-transparent text-neutral-400 hover:text-white'}`}
            >
              DAFTAR BARU
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && (
              <div>
                <label className="block text-[10px] font-bold tracking-wider font-mono text-neutral-400 uppercase mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="CONTOH: DON ELIXIR" 
                  className="w-full bg-black border border-neutral-800 focus:border-[#ffb700] p-3.5 rounded-xl text-sm text-white font-mono uppercase focus:outline-none transition-colors"
                />
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-bold tracking-wider font-mono text-neutral-400 uppercase mb-1.5">Alamat Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="CONTOH: pelanggan@email.com" 
                className="w-full bg-black border border-neutral-800 focus:border-[#ffb700] p-3.5 rounded-xl text-sm text-white font-mono focus:outline-none transition-colors"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#ffb700] hover:bg-[#e0a100] text-black font-bold tracking-widest text-xs py-4 px-6 rounded-full uppercase transition-colors cursor-pointer mt-6 border-0"
            >
              {authModalTab === 'login' ? 'SIGN IN' : 'DAFTAR AKUN SEKARANG'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
