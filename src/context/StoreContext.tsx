import React, { createContext, useContext, useState, useEffect } from 'react';
import { Feature, Service, Location, Promo, User } from '../types';
import { supabaseClient } from '../supabaseClient';

export type ViewTab = 'beranda' | 'layanan' | 'lokasi' | 'promo' | 'asesor';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  isTyping?: boolean;
}

interface StoreContextType {
  currentPage: ViewTab;
  setCurrentPage: (page: ViewTab) => void;
  currentUser: User | null;
  features: Feature[];
  services: Service[];
  locations: Location[];
  promos: Promo[];
  isLoading: boolean;
  
  // Auth state
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  authModalError: string;
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openLoginModal: (callback?: () => void) => void;
  closeLoginModal: () => void;
  handleLogin: (email: string, pass: string) => boolean;
  handleRegister: (name: string, email: string, pass: string) => boolean;
  handleLogout: () => void;
  triggerWhatsAppWithAuth: (originalUrl: string) => void;

  // OTP Verification state
  otpStep: 'none' | 'register_verify' | 'login_verify';
  setOtpStep: (step: 'none' | 'register_verify' | 'login_verify') => void;
  otpCode: string;
  otpPendingUser: User | null;
  whatsappNotification: { name: string; phone: string; code: string } | null;
  setWhatsappNotification: (notif: { name: string; phone: string; code: string } | null) => void;
  generateAndSendOtp: (name: string, phone: string, pass: string, isRegister: boolean) => boolean;
  verifyOtpAndComplete: (enteredCode: string) => boolean;

  // Chatbot state
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  toggleChatbot: (forceState?: boolean) => void;
  chatbotMessages: ChatMessage[];
  sendUserMessage: (text: string) => void;

  // Welcome Email Notification states
  latestEmail: { to: string; subject: string; html: string; senderName: string; sentRealEmail: boolean } | null;
  setLatestEmail: (email: { to: string; subject: string; html: string; senderName: string; sentRealEmail: boolean } | null) => void;
  emailModalOpen: boolean;
  setEmailModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FALLBACK_FEATURES: Feature[] = [
  {
    icon_name: 'Shield',
    title: 'GARANSI CUCI ULANG',
    description: 'Kami berikan garansi cuci ulang tanpa tambahan biaya jika hasil pembersihan belum memenuhi standar kualitas estetika premium kami. *S&K berlaku.'
  },
  {
    icon_name: 'UserCheck',
    title: 'KONSULTASI GRATIS',
    description: 'Layanan analisis bahan dan konsultasi gratis oleh tim ahli kami untuk menentukan metode perawatan yang paling aman sesuai jenis sepatu Anda.'
  },
  {
    icon_name: 'Truck',
    title: 'GRATIS JEMPUT & ANTAR',
    description: 'Nikmati kemudahan layanan penjemputan dan pengantaran sepatu gratis hingga radius 8 KM dari lokasi workshop kami.'
  },
  {
    icon_name: 'Award',
    title: 'JAMINAN GARANSI LAYANAN',
    description: 'Layanan pembersihan dan perawatan terbaik untuk semua jenis sepatu Anda. Dikerjakan dengan teliti dan profesional oleh tim ahli kami.'
  }
];

const FALLBACK_SERVICES: Service[] = [
  {
    name: 'FAST CLEANING',
    description: 'Fast cleaning ala kafe-kafe kilat di Barcelona merupakan pencucian instan pada bagian upper & midsole yang bisa ditunggu selama 15-30 menit.',
    price_label: 'MULAI DARI',
    price_value: 'Rp 30.000'
  },
  {
    name: 'DEEP CLEANING',
    description: 'Perawatan pembersihan sepatu secara detail, menyeluruh, dan penuh dedikasi artisan khas semenanjung Iberia.',
    price_label: 'MULAI DARI',
    price_value: 'Rp 50.000'
  },
  {
    name: 'PREMIUM TREATMENT',
    description: 'Perawatan terspesialisasi yang pengerjaannya ditujukan untuk sepatu material khusus (Suede, Nubuck, dll.) dengan formula hidrasi dari Madrid.',
    price_label: 'MULAI DARI',
    price_value: 'Rp 90.000'
  },
  {
    name: 'UNYELLOWING',
    description: 'Perawatan restorasi midsole menguning akibat oksidasi menggunakan krim pemutih premium bersertifikasi butik Spanyol.',
    price_label: 'MULAI DARI',
    price_value: 'Rp 100.000'
  },
  {
    name: 'REPAINT',
    description: 'Perawatan restorasi warna menggunakan cat premium khusus Spanyol untuk mengembalikan pigmen warna orisinal layaknya sepatu baru.',
    price_label: 'MULAI DARI',
    price_value: 'Rp 185.000'
  },
  {
    name: 'GRATIS',
    description: 'Layanan jemput dan antar gratis hingga radius 8 KM dari lokasi workshop Shoes Lavandería dengan keramahan khas Iberia (S&K Berlaku). Hubungi kami sekarang.',
    price_label: 'LAYANAN',
    price_value: 'ANTAR JEMPUT'
  }
];

const FALLBACK_LOCATIONS: Location[] = [
  {
    city: 'JAWA BARAT',
    store_name: 'Shoes Lavandería DEPOK BEJI',
    operating_hours: 'Senin - Minggu, 10.00 - 21.00',
    whatsapp_url: 'https://wa.me/6285776909036',
    gmaps_url: 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Depok+Beji'
  },
  {
    city: 'JAKARTA',
    store_name: 'Shoes Lavandería PIK 2',
    operating_hours: 'Senin - Minggu, 10.00 - 21.00',
    whatsapp_url: 'https://wa.me/6285776909036',
    gmaps_url: 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+PIK+2'
  },
  {
    city: 'YOGYAKARTA',
    store_name: 'Shoes Lavandería YOGYAKARTA (DEKAT UGM)',
    operating_hours: 'Senin - Minggu, 10.00 - 21.00',
    whatsapp_url: 'https://wa.me/6285776909036',
    gmaps_url: 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Yogyakarta+UGM'
  },
  {
    city: 'JAKARTA',
    store_name: 'Shoes Lavandería MENTENG ATAS',
    operating_hours: 'Senin - Minggu, 10.00 - 21.00',
    whatsapp_url: 'https://wa.me/6285776909036',
    gmaps_url: 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Menteng+Atas'
  },
  {
    city: 'JAKARTA',
    store_name: 'Shoes Lavandería JAKBAR DAAN MOGOT',
    operating_hours: 'Senin - Minggu, 10.00 - 21.00',
    whatsapp_url: 'https://wa.me/6285776909036',
    gmaps_url: 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Daan+Mogot'
  },
  {
    city: 'JAWA BARAT',
    store_name: 'Shoes Lavandería BANDUNG (DEKAT TELKOM UNIVERSITY)',
    operating_hours: 'Senin - Minggu, 10.00 - 21.00',
    whatsapp_url: 'https://wa.me/6285776909036',
    gmaps_url: 'https://www.google.com/maps/search/?api=1&query=Shoes+Lavander%C3%ADa+Bandung+Telkom+University'
  }
];

const FALLBACK_PROMOS: Promo[] = [
  {
    status: 'AKTIF',
    date: '02 Jul 2026',
    title: 'CLEAN COMBO 3 Shoes Lavandería GO',
    benefits: '• Harga 60K Perpasang\n• Minimal 3 Pasang\n• Ongkir 10k'
  },
  {
    status: 'AKTIF',
    date: '02 Jul 2026',
    title: 'BERSIH BARENG Shoes Lavandería GO',
    benefits: '• Harga 55K Perpasang\n• Minimal 5 Pasang\n• Ongkir 10k'
  },
  {
    status: 'AKTIF',
    date: '02 Jul 2026',
    title: 'PAKET KOMUNITAS Shoes Lavandería GO',
    benefits: '• Harga 50K Perpasang\n• Minimal 8 Pasang\n• Ongkir 10k'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<ViewTab>('beranda');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sac_logged_in_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [features, setFeatures] = useState<Feature[]>(FALLBACK_FEATURES);
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);
  const [locations, setLocations] = useState<Location[]>(FALLBACK_LOCATIONS);
  const [promos, setPromos] = useState<Promo[]>(FALLBACK_PROMOS);
  const [isLoading, setIsLoading] = useState(true);

  // Auth UI state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authModalError, setAuthModalError] = useState('');
  const [pendingAction, setPendingAction] = useState<{ callback: () => void } | null>(null);

  // OTP & WhatsApp Verification state
  const [otpStep, setOtpStep] = useState<'none' | 'register_verify' | 'login_verify'>('none');
  const [otpCode, setOtpCode] = useState('');
  const [otpPendingUser, setOtpPendingUser] = useState<User | null>(null);
  const [whatsappNotification, setWhatsappNotification] = useState<{ name: string; phone: string; code: string } | null>(null);

  // Chatbot state
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState<ChatMessage[]>([]);

  // Welcome Email states
  const [latestEmail, setLatestEmail] = useState<{ to: string; subject: string; html: string; senderName: string; sentRealEmail: boolean } | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Fetch from Supabase if configured
  useEffect(() => {
    async function loadData() {
      if (!supabaseClient) {
        setIsLoading(false);
        return;
      }
      try {
        const [
          { data: fData, error: fErr },
          { data: sData, error: sErr },
          { data: lData, error: lErr },
          { data: pData, error: pErr },
          { data: uData, error: uErr }
        ] = await Promise.all([
          supabaseClient.from('features').select('*').order('id', { ascending: true }),
          supabaseClient.from('services').select('*').order('id', { ascending: true }),
          supabaseClient.from('locations').select('*').order('id', { ascending: true }),
          supabaseClient.from('promos').select('*').order('id', { ascending: true }),
          supabaseClient.from('registered_users').select('*')
        ]);

        if (!fErr && fData && fData.length > 0) setFeatures(fData);
        if (!sErr && sData && sData.length > 0) setServices(sData);
        if (!lErr && lData && lData.length > 0) setLocations(lData);
        if (!pErr && pData && pData.length > 0) setPromos(pData);

        // Sync registered users with localStorage
        if (!uErr && uData) {
          const usersStr = localStorage.getItem('sac_registered_users') || '[]';
          let localUsers: User[] = JSON.parse(usersStr);
          const mergedUsersMap = new Map<string, User>();
          localUsers.forEach(u => {
            const key = u.email || u.phone || '';
            if (key) mergedUsersMap.set(key, u);
          });
          uData.forEach((u: any) => {
            const key = u.email || u.phone || '';
            if (key) {
              mergedUsersMap.set(key, { 
                name: u.name, 
                email: u.email || '', 
                phone: u.phone || '', 
                password: u.password 
              });
            }
          });
          const mergedUsers = Array.from(mergedUsersMap.values());
          localStorage.setItem('sac_registered_users', JSON.stringify(mergedUsers));
        }
      } catch (err) {
        console.error("Error fetching Supabase data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update hash route
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'layanan', 'lokasi', 'promo', 'asesor'].includes(hash)) {
        setCurrentPage(hash as ViewTab);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetPage = (page: ViewTab) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const openLoginModal = (callback?: () => void) => {
    setAuthModalTab('login');
    setAuthModalError('');
    setAuthModalOpen(true);
    if (callback) {
      setPendingAction({ callback });
    }
  };

  const closeLoginModal = () => {
    setAuthModalOpen(false);
    setPendingAction(null);
    setOtpStep('none');
    setOtpCode('');
    setOtpPendingUser(null);
    setWhatsappNotification(null);
  };

  const formatToWhatsAppNumber = (phoneStr: string): string => {
    let cleaned = phoneStr.replace(/\D/g, ''); // keep only digits
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (cleaned.startsWith('8')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  };

  const generateAndSendOtp = (name: string, email: string, pass: string, isRegister: boolean): boolean => {
    // Left as legacy / no-op for compatibility
    return true;
  };

  const verifyOtpAndComplete = (enteredCode: string): boolean => {
    // Left as legacy / no-op for compatibility
    return true;
  };

  const handleLogin = (email: string, pass: string): boolean => {
    setAuthModalError('');
    const emailNormalized = email.trim().toLowerCase();

    const usersStr = localStorage.getItem('sac_registered_users') || '[]';
    const users: User[] = JSON.parse(usersStr);

    const matchedUser = users.find(u => u.email?.toLowerCase() === emailNormalized);
    if (!matchedUser) {
      if (users.length === 0) {
        // Auto register if completely empty (Convenience standard)
        const autoUser: User = { name: 'Pelanggan Baru', email: emailNormalized, password: pass };
        users.push(autoUser);
        localStorage.setItem('sac_registered_users', JSON.stringify(users));
        localStorage.setItem('sac_logged_in_user', JSON.stringify(autoUser));
        setCurrentUser(autoUser);
        triggerLoginSuccess(autoUser);
        return true;
      }
      setAuthModalError('EMAIL TIDAK DITEMUKAN!');
      return false;
    }

    localStorage.setItem('sac_logged_in_user', JSON.stringify(matchedUser));
    setCurrentUser(matchedUser);
    triggerLoginSuccess(matchedUser);
    return true;
  };

  const handleRegister = (name: string, email: string, pass: string): boolean => {
    setAuthModalError('');
    const emailNormalized = email.trim().toLowerCase();
    
    const usersStr = localStorage.getItem('sac_registered_users') || '[]';
    const users: User[] = JSON.parse(usersStr);

    const exists = users.find(u => u.email?.toLowerCase() === emailNormalized);
    if (exists) {
      setAuthModalError('EMAIL INI SUDAH TERDAFTAR!');
      return false;
    }

    const user: User = { name, email: emailNormalized, password: pass };
    users.push(user);
    localStorage.setItem('sac_registered_users', JSON.stringify(users));

    // Save to Supabase table 'registered_users' if supabaseClient exists
    if (supabaseClient) {
      supabaseClient.from('registered_users').insert([
        { 
          email: user.email, 
          name: user.name, 
          password: user.password,
          created_at: new Date().toISOString()
        }
      ]).then(({ error }: any) => {
        if (error) {
          console.warn("Supabase save warning (table 'registered_users' might not exist yet):", error);
        } else {
          console.log("User successfully saved to Supabase 'registered_users' table!");
        }
      }).catch((err: any) => {
        console.error("Error writing to Supabase:", err);
      });
    }

    localStorage.setItem('sac_logged_in_user', JSON.stringify(user));
    setCurrentUser(user);
    triggerLoginSuccess(user);

    // Call the welcome email API endpoint
    fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: user.name, email: user.email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.email) {
          setLatestEmail(data.email);
          setEmailModalOpen(true);
          showToast(`📧 NOTIFIKASI EMAIL DIKIRIM KE ${user.email.toUpperCase()}`, 'bg-emerald-600 text-white border-white');
        }
      })
      .catch(err => {
        console.error('Failed to trigger welcome email API:', err);
      });

    return true;
  };

  const triggerLoginSuccess = (user: User) => {
    setAuthModalOpen(false);
    showToast(`¡BIENVENIDO! SELAMAT DATANG, ${user.name.toUpperCase()}`, 'bg-[#ffb700] text-black border-black');
    if (pendingAction) {
      setTimeout(() => {
        pendingAction.callback();
      }, 300);
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sac_logged_in_user');
    setCurrentUser(null);
    showToast('ANDA TELAH KELUAR DARI SHOES LAVANDERÍA', 'bg-black border-[#ffb700] text-[#ffb700]');
  };

  const showToast = (text: string, classes: string) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 border-2 font-mono text-[10px] font-bold py-3.5 px-6 shadow-2xl z-[9999] animate-bounce uppercase tracking-widest ${classes}`;
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  };

  const triggerWhatsAppRedirect = (originalUrl: string) => {
    if (!originalUrl) return;
    const user = currentUser;
    if (!user) return;

    try {
      const urlObj = new URL(originalUrl);
      let textParam = urlObj.searchParams.get('text') || '';
      if (textParam && !textParam.includes(user.name)) {
        textParam = textParam + `\n\n(Atas Nama: ${user.name.toUpperCase()} - No. WA: ${user.phone})`;
        urlObj.searchParams.set('text', textParam);
      }
      window.open(urlObj.toString(), '_blank');
    } catch (err) {
      const connector = originalUrl.includes('?') ? '&' : '?';
      window.open(originalUrl + connector + `text=Halo%20saya%20${encodeURIComponent(user.name)}%20(${encodeURIComponent(user.phone)})`, '_blank');
    }
  };

  const triggerWhatsAppWithAuth = (originalUrl: string) => {
    if (!currentUser) {
      openLoginModal(() => {
        triggerWhatsAppRedirect(originalUrl);
      });
    } else {
      triggerWhatsAppRedirect(originalUrl);
    }
  };

  // Chatbot Operations
  const toggleChatbot = (forceState?: boolean) => {
    const nextState = typeof forceState === 'boolean' ? forceState : !chatbotOpen;
    setChatbotOpen(nextState);
    if (nextState && chatbotMessages.length === 0) {
      sendBotGreetings();
    }
  };

  const sendBotGreetings = () => {
    setChatbotMessages([
      { id: 'g1', text: "¡Hola Señor/Señora! Selamat datang di Shoes Lavandería. 🇪🇸👞", isBot: true },
      { id: 'g2', text: "Saya adalah **Asesor**, asisten cerdas & admin utama Shoes Lavandería. Di sini kami mengadopsi standar ketelitian tinggi ala Spanyol untuk memberikan perawatan alas kaki premium terbaik di Indonesia.", isBot: true },
      { id: 'g3', text: "Ada noda membandel atau sepatu kesayangan yang ingin Anda konsultasikan hari ini? Silakan pilih opsi di bawah atau ketik langsung keluhan Anda!", isBot: true }
    ]);
  };

  const sendUserMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsgId = 'u-' + Date.now();
    const botMsgId = 'b-' + Date.now();

    setChatbotMessages(prev => [...prev, { id: userMsgId, text, isBot: false }]);
    
    // Add typing indicator
    setChatbotMessages(prev => [...prev, { id: 'typing', text: '', isBot: true, isTyping: true }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan respon dari asisten');
      }

      const data = await response.json();
      const botReply = data.reply || "Maaf Señor/Señora, saya mengalami sedikit kesulitan teknis. Silakan coba kembali atau hubungi WhatsApp kami!";

      setChatbotMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        return [...filtered, { id: botMsgId, text: botReply, isBot: true }];
      });
    } catch (error) {
      console.error('Chat API Error:', error);
      setChatbotMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        return [...filtered, { 
          id: botMsgId, 
          text: "¡Lo siento! Terjadi kendala koneksi dengan Asesor. Silakan pastikan koneksi internet Anda lancar atau konsultasi langsung melalui WhatsApp kami di **+62 857 7690 9036**.", 
          isBot: true 
        }];
      });
    }
  };

  return (
    <StoreContext.Provider value={{
      currentPage,
      setCurrentPage: handleSetPage,
      currentUser,
      features,
      services,
      locations,
      promos,
      isLoading,
      authModalOpen,
      authModalTab,
      authModalError,
      setAuthModalOpen,
      setAuthModalTab,
      openLoginModal,
      closeLoginModal,
      handleLogin,
      handleRegister,
      handleLogout,
      triggerWhatsAppWithAuth,
      otpStep,
      setOtpStep,
      otpCode,
      otpPendingUser,
      whatsappNotification,
      setWhatsappNotification,
      generateAndSendOtp,
      verifyOtpAndComplete,
      chatbotOpen,
      setChatbotOpen,
      toggleChatbot,
      chatbotMessages,
      sendUserMessage,
      latestEmail,
      setLatestEmail,
      emailModalOpen,
      setEmailModalOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
