import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './components/Landing';
import { Layanan } from './components/Layanan';
import { Lokasi } from './components/Lokasi';
import { Promo } from './components/Promo';
import { AuthPage } from './components/AuthPage';
import { Chatbot } from './components/Chatbot';
import { AsesorHub } from './components/AsesorHub';
import { EmailModal } from './components/EmailModal';

const AppContent: React.FC = () => {
  const { currentPage, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-[#ffb700] border-r-2 mb-4"></div>
        <p className="text-white text-xs tracking-widest uppercase">MEMUAT SHOES LAVANDERÍA...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'beranda':
        return <Landing />;
      case 'layanan':
        return <Layanan />;
      case 'lokasi':
        return <Lokasi />;
      case 'promo':
        return <Promo />;
      case 'asesor':
        return <AsesorHub />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-950 text-white selection:bg-[#ffb700] selection:text-black">
      <div>
        <Header />
        {renderPage()}
      </div>
      <Footer />
      <AuthPage />
      <Chatbot />
      <EmailModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
export { App };
