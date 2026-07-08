import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  FileText, 
  Layers, 
  ListTodo, 
  Layout, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ArrowLeftRight, 
  Database, 
  Code2, 
  AlertCircle 
} from 'lucide-react';

interface WireframeComponent {
  id: string;
  type: string;
  title: string;
  details: string;
}

interface AnalysisResult {
  businessRequirements: string;
  userStories: string;
  functionalSpec: string;
  wireframeDesign: {
    title: string;
    description: string;
    components: WireframeComponent[];
  };
}

const TEMPLATES = [
  {
    title: "Layanan Locker Pintar Mandiri",
    desc: "Sistem drop-off & pick-up sepatu 24 jam menggunakan locker digital otomatis di Depok.",
    prompt: "Sistem locker pintar mandiri untuk Shoes Lavandería. Pelanggan bisa meletakkan sepatu kotor di locker digital, mendapatkan kode OTP, admin mengambil untuk dicuci, dan setelah selesai dikembalikan ke locker dengan notifikasi bayar via QRIS sebelum pintu locker terbuka otomatis."
  },
  {
    title: "Sistem Langganan Cuci Bulanan",
    desc: "Paket berlangganan cuci sepatu bulanan (SaaS) dengan pilihan pick-up terjadwal otomatis.",
    prompt: "Sistem langganan bulanan Shoes Lavandería. Pengguna memilih paket (misal: 4 pasang/bulan atau 8 pasang/bulan) dengan auto-billing. Ada fitur penjadwalan kurir penjemputan berkala setiap minggu secara otomatis lewat aplikasi."
  },
  {
    title: "Program Loyalty & Referral Koin",
    desc: "Sistem pengumpulan koin loyalitas dan referral untuk mendapatkan gratis cuci atau diskon.",
    prompt: "Program loyalitas Shoes Lavandería. Pengguna mendapatkan Koin Lavandería setiap kali cuci sepatu atau mengundang teman (referral). Koin bisa ditukar dengan voucher diskon, premium upgrade, atau cuci sepatu gratis."
  }
];

export const AsesorHub: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'requirements' | 'stories' | 'specs' | 'wireframe'>('requirements');
  const [selectedWireframeComp, setSelectedWireframeComp] = useState<WireframeComponent | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (promptText: string) => {
    const textToAnalyze = promptText || idea;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setErrorMsg('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: textToAnalyze }),
      });

      if (!response.ok) {
        throw new Error('Gagal melakukan analisis kebutuhan bisnis');
      }

      const data = await response.json();
      setResult(data);
      setActiveSubTab('requirements');
      setSelectedWireframeComp(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Maaf Señor/Señora, terjadi kesalahan teknis saat menganalisis spesifikasi. Silakan coba beberapa saat lagi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderComponentMockup = (comp: WireframeComponent) => {
    const isSelected = selectedWireframeComp?.id === comp.id;
    const baseStyle = "border-2 rounded-xl p-4 transition-all duration-200 text-left cursor-pointer relative overflow-hidden ";
    const selectedStyle = isSelected 
      ? "bg-[#ffb700]/10 border-[#ffb700] shadow-[0_0_15px_rgba(255,183,0,0.2)]" 
      : "bg-[#181818] border-neutral-800 hover:border-neutral-600";

    switch (comp.type.toLowerCase()) {
      case 'navigation':
      case 'header':
        return (
          <div 
            key={comp.id} 
            onClick={() => setSelectedWireframeComp(comp)}
            className={`${baseStyle} ${selectedStyle} col-span-12 py-3 px-5 flex items-center justify-between bg-black`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#ffb700] text-black text-xs flex items-center justify-center font-bold">🇪🇸</div>
              <span className="font-mono text-xs font-bold tracking-wider text-white">{comp.title.toUpperCase()}</span>
            </div>
            <div className="flex gap-4 text-[10px] text-neutral-400 font-mono">
              <span>[MENU]</span>
              <span>[PROFIL]</span>
            </div>
            {isSelected && <span className="absolute top-0 right-0 bg-[#ffb700] text-black text-[8px] font-mono font-bold px-2 py-0.5 uppercase">Header</span>}
          </div>
        );
      case 'form':
      case 'input':
        return (
          <div 
            key={comp.id} 
            onClick={() => setSelectedWireframeComp(comp)}
            className={`${baseStyle} ${selectedStyle} col-span-12 md:col-span-6`}
          >
            <h5 className="text-white font-mono text-xs font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ffb700] rounded-full"></span>
              {comp.title}
            </h5>
            <div className="space-y-2 pointer-events-none">
              <div className="h-8 bg-neutral-900 border border-neutral-800 rounded-lg px-3 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>Masukkan detail...</span>
              </div>
              <div className="h-8 bg-[#ffb700] text-black rounded-lg flex items-center justify-center font-mono text-[10px] font-bold">
                SUBMIT / KIRIM
              </div>
            </div>
            {isSelected && <span className="absolute top-0 right-0 bg-[#ffb700] text-black text-[8px] font-mono font-bold px-2 py-0.5 uppercase">Form Input</span>}
          </div>
        );
      case 'card':
      case 'grid':
      case 'list':
        return (
          <div 
            key={comp.id} 
            onClick={() => setSelectedWireframeComp(comp)}
            className={`${baseStyle} ${selectedStyle} col-span-12 md:col-span-6`}
          >
            <h5 className="text-white font-mono text-xs font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ffb700] rounded-full"></span>
              {comp.title}
            </h5>
            <div className="space-y-2 pointer-events-none">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center">
                <div className="h-2 w-1/2 bg-neutral-700 rounded"></div>
                <div className="h-2 w-10 bg-[#ffb700]/40 rounded"></div>
              </div>
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center">
                <div className="h-2 w-2/3 bg-neutral-700 rounded"></div>
                <div className="h-2 w-8 bg-[#ffb700]/40 rounded"></div>
              </div>
            </div>
            {isSelected && <span className="absolute top-0 right-0 bg-[#ffb700] text-black text-[8px] font-mono font-bold px-2 py-0.5 uppercase">Data Container</span>}
          </div>
        );
      case 'stats':
      case 'summary':
      case 'chart':
        return (
          <div 
            key={comp.id} 
            onClick={() => setSelectedWireframeComp(comp)}
            className={`${baseStyle} ${selectedStyle} col-span-12 md:col-span-4`}
          >
            <h5 className="text-white font-mono text-xs font-bold mb-1">{comp.title}</h5>
            <div className="text-2xl font-bold font-mono text-[#ffb700] my-2">99+</div>
            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#ffb700] w-2/3"></div>
            </div>
            {isSelected && <span className="absolute top-0 right-0 bg-[#ffb700] text-black text-[8px] font-mono font-bold px-2 py-0.5 uppercase">Summary</span>}
          </div>
        );
      default:
        return (
          <div 
            key={comp.id} 
            onClick={() => setSelectedWireframeComp(comp)}
            className={`${baseStyle} ${selectedStyle} col-span-12`}
          >
            <h5 className="text-white font-mono text-xs font-bold mb-2">{comp.title}</h5>
            <p className="text-neutral-400 text-[10px] leading-relaxed font-mono">{comp.details}</p>
            {isSelected && <span className="absolute top-0 right-0 bg-[#ffb700] text-black text-[8px] font-mono font-bold px-2 py-0.5 uppercase">Widget</span>}
          </div>
        );
    }
  };

  return (
    <section className="bg-neutral-950 text-white min-h-screen py-20 px-6 border-b border-neutral-900" id="asesor-workspace">
      <div className="max-w-6xl mx-auto">
        
        {/* Decorative Badge */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-[#ffb700] font-mono text-[10px] font-bold tracking-[0.2em] px-4.5 py-2 rounded-full uppercase mb-4 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Asesor Workspace v1.0
          </span>
          <h1 className="font-display text-4xl md:text-6xl tracking-wider uppercase font-bold text-white leading-none">
            PERSALINAN <span className="text-[#ffb700]">IDE BISNIS</span>
          </h1>
          <p className="text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed mt-4">
            Jangan langsung coding! Bersama <strong>Asesor</strong>, mari kita gali kebutuhan bisnis secara terstruktur, pecah menjadi User Story, susun Spesifikasi Fungsional, dan petakan rancangan Wireframe interaktif.
          </p>
        </div>

        {/* Input Form & Templates */}
        <div className="bg-[#121212] border-2 border-black rounded-2xl p-6 md:p-8 mb-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#ffb700] text-black text-lg flex items-center justify-center font-bold">🇪🇸</div>
            <div className="text-left">
              <h3 className="text-white text-xs font-mono font-bold tracking-widest uppercase leading-none">Asesor Bisnis</h3>
              <span className="text-[10px] text-neutral-400 tracking-wider block font-bold uppercase mt-1 leading-none">Penyusun Requirements & Spesifikasi</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-left text-neutral-400 font-mono text-xs uppercase tracking-wider font-bold mb-2">
              Tuliskan Ide Fitur / Alur Bisnis Baru Anda:
            </label>
            <textarea 
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Contoh: Saya ingin membuat sistem membership loyalti di mana pelanggan mendapatkan koin setelah mencuci sepatu, koin bisa ditukar voucher..."
              className="w-full h-32 bg-[#181818] border border-neutral-800 text-white placeholder-neutral-600 rounded-xl py-3 px-4 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#ffb700] focus:ring-1 focus:ring-[#ffb700] transition-all resize-none"
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-[10px] text-neutral-500 font-mono">
                *Asesor akan menggunakan model cerdas Gemini 3.5-Flash untuk menyusun cetak biru sistem.
              </span>
              <button 
                onClick={() => handleAnalyze('')}
                disabled={isAnalyzing || !idea.trim()}
                className="w-full sm:w-auto bg-[#ffb700] hover:bg-[#e0a100] disabled:bg-neutral-850 disabled:text-neutral-500 text-black font-bold text-[11px] tracking-widest px-8 py-3.5 border border-black uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-black border-r-2"></div>
                    MENGANALISIS IDE...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black" />
                    MULAI ANALISIS KEBUTUHAN
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-6 p-4 bg-red-950/40 border border-red-900 text-red-400 text-xs font-mono flex items-center gap-3 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Prompt Templates */}
          {!result && !isAnalyzing && (
            <div className="mt-8 border-t border-neutral-900 pt-8">
              <h4 className="text-white font-mono text-xs font-bold tracking-widest uppercase text-left mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ffb700]" />
                Template Ide Inspiratif (Coba Klik Salah Satu):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TEMPLATES.map((tpl, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setIdea(tpl.prompt);
                      handleAnalyze(tpl.prompt);
                    }}
                    className="bg-[#181818] border border-neutral-850 hover:border-[#ffb700] rounded-xl p-4 text-left cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl group"
                  >
                    <h5 className="text-white font-mono text-xs font-bold group-hover:text-[#ffb700] transition-colors mb-1">
                      {tpl.title}
                    </h5>
                    <p className="text-neutral-400 text-[10px] leading-relaxed font-mono">
                      {tpl.desc}
                    </p>
                    <span className="inline-flex items-center text-[#ffb700] text-[9px] font-mono font-bold uppercase mt-4 group-hover:translate-x-1.5 transition-transform gap-1">
                      Gunakan Template <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading placeholder */}
        {isAnalyzing && (
          <div className="bg-[#121212] border border-neutral-850 rounded-2xl p-12 text-center shadow-xl animate-pulse">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-[#ffb700] border-r-2 mb-4"></div>
            <h4 className="text-white font-mono text-sm font-bold tracking-widest uppercase mb-2">Sedang Merajut Cetak Biru...</h4>
            <p className="text-neutral-400 text-xs font-mono max-w-md mx-auto leading-relaxed">
              Asesor sedang menyusun rincian kebutuhan bisnis, menjabarkan user story, mematangkan skema spesifikasi fungsional, serta merancang rancangan wireframe visual.
            </p>
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="space-y-8 animate-fade-in" id="asesor-analysis-results">
            
            {/* Sub navigation tabs */}
            <div className="flex border-b border-neutral-900 overflow-x-auto gap-2" style={{ scrollbarWidth: 'none' }}>
              <button 
                onClick={() => setActiveSubTab('requirements')}
                className={`py-3 px-6 cursor-pointer font-mono text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeSubTab === 'requirements' 
                    ? 'border-[#ffb700] text-[#ffb700] bg-neutral-900/40' 
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                1. Kebutuhan & Alur
              </button>
              <button 
                onClick={() => setActiveSubTab('stories')}
                className={`py-3 px-6 cursor-pointer font-mono text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeSubTab === 'stories' 
                    ? 'border-[#ffb700] text-[#ffb700] bg-neutral-900/40' 
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                2. User Stories
              </button>
              <button 
                onClick={() => setActiveSubTab('specs')}
                className={`py-3 px-6 cursor-pointer font-mono text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeSubTab === 'specs' 
                    ? 'border-[#ffb700] text-[#ffb700] bg-neutral-900/40' 
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                3. Spesifikasi Teknis
              </button>
              <button 
                onClick={() => setActiveSubTab('wireframe')}
                className={`py-3 px-6 cursor-pointer font-mono text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeSubTab === 'wireframe' 
                    ? 'border-[#ffb700] text-[#ffb700] bg-neutral-900/40' 
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                4. Blue Print Wireframe
              </button>
            </div>

            {/* Sub-Tab Contents */}
            <div className="bg-[#121212] border-2 border-black rounded-2xl p-6 md:p-8 text-left shadow-xl font-mono text-xs leading-relaxed">
              
              {/* Tab 1: Business Requirements */}
              {activeSubTab === 'requirements' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5 border-b border-neutral-900 pb-3">
                    <FileText className="w-5 h-5 text-[#ffb700]" />
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">Business Requirements & Operational Flow</h3>
                  </div>
                  <div className="text-neutral-300 space-y-4 markdown-body">
                    {result.businessRequirements.split('\n').map((line, idx) => {
                      if (line.startsWith('#')) {
                        const depth = line.match(/^#+/)?.[0].length || 1;
                        const text = line.replace(/^#+\s*/, '');
                        const sizeClass = depth === 1 ? 'text-lg font-bold text-white mt-4 border-b border-neutral-850 pb-2 block' : depth === 2 ? 'text-sm font-bold text-[#ffb700] mt-3 block' : 'text-xs font-bold text-white block';
                        return <span key={idx} className={sizeClass}>{text}</span>;
                      }
                      if (line.startsWith('-') || line.startsWith('*')) {
                        return (
                          <div key={idx} className="flex items-start gap-2 pl-4 py-0.5">
                            <span className="text-[#ffb700] mt-1">•</span>
                            <span>{line.replace(/^[-*]\s*/, '')}</span>
                          </div>
                        );
                      }
                      return <p key={idx} className="mb-2">{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: User Stories */}
              {activeSubTab === 'stories' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5 border-b border-neutral-900 pb-3">
                    <ListTodo className="w-5 h-5 text-[#ffb700]" />
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">User Stories & Feature Requirements</h3>
                  </div>
                  <div className="text-neutral-300 space-y-4 markdown-body">
                    {result.userStories.split('\n').map((line, idx) => {
                      if (line.startsWith('#')) {
                        const depth = line.match(/^#+/)?.[0].length || 1;
                        const text = line.replace(/^#+\s*/, '');
                        const sizeClass = depth === 1 ? 'text-lg font-bold text-white mt-4 border-b border-neutral-850 pb-2 block' : depth === 2 ? 'text-sm font-bold text-[#ffb700] mt-3 block' : 'text-xs font-bold text-white block';
                        return <span key={idx} className={sizeClass}>{text}</span>;
                      }
                      if (line.startsWith('-') || line.startsWith('*')) {
                        return (
                          <div key={idx} className="flex items-start gap-2 pl-4 py-0.5">
                            <span className="text-[#ffb700] mt-1">•</span>
                            <span>{line.replace(/^[-*]\s*/, '')}</span>
                          </div>
                        );
                      }
                      return <p key={idx} className="mb-2">{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Functional Specifications */}
              {activeSubTab === 'specs' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5 border-b border-neutral-900 pb-3">
                    <Layers className="w-5 h-5 text-[#ffb700]" />
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">Functional & Architectural Specification</h3>
                  </div>
                  
                  {/* Decorative Architectural Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/40 border border-neutral-900 p-3 rounded-xl flex items-center gap-3">
                      <Code2 className="w-5 h-5 text-[#ffb700]" />
                      <div className="text-left">
                        <div className="text-[9px] text-neutral-500 font-bold uppercase">Teknologi API</div>
                        <div className="text-[10px] text-white font-bold font-mono">REST / Express.js</div>
                      </div>
                    </div>
                    <div className="bg-black/40 border border-neutral-900 p-3 rounded-xl flex items-center gap-3">
                      <Database className="w-5 h-5 text-[#ffb700]" />
                      <div className="text-left">
                        <div className="text-[9px] text-neutral-500 font-bold uppercase">Database Relasional</div>
                        <div className="text-[10px] text-white font-bold font-mono">PostgreSQL / Drizzle</div>
                      </div>
                    </div>
                    <div className="bg-black/40 border border-neutral-900 p-3 rounded-xl flex items-center gap-3">
                      <ArrowLeftRight className="w-5 h-5 text-[#ffb700]" />
                      <div className="text-left">
                        <div className="text-[9px] text-neutral-500 font-bold uppercase">Sistem State</div>
                        <div className="text-[10px] text-white font-bold font-mono">React Context / Store</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-neutral-300 space-y-4 markdown-body">
                    {result.functionalSpec.split('\n').map((line, idx) => {
                      if (line.startsWith('#')) {
                        const depth = line.match(/^#+/)?.[0].length || 1;
                        const text = line.replace(/^#+\s*/, '');
                        const sizeClass = depth === 1 ? 'text-lg font-bold text-white mt-4 border-b border-neutral-850 pb-2 block' : depth === 2 ? 'text-sm font-bold text-[#ffb700] mt-3 block' : 'text-xs font-bold text-white block';
                        return <span key={idx} className={sizeClass}>{text}</span>;
                      }
                      if (line.startsWith('-') || line.startsWith('*')) {
                        return (
                          <div key={idx} className="flex items-start gap-2 pl-4 py-0.5">
                            <span className="text-[#ffb700] mt-1">•</span>
                            <span>{line.replace(/^[-*]\s*/, '')}</span>
                          </div>
                        );
                      }
                      return <p key={idx} className="mb-2">{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Interactive Wireframe */}
              {activeSubTab === 'wireframe' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5 border-b border-neutral-900 pb-3">
                    <Layout className="w-5 h-5 text-[#ffb700]" />
                    <div>
                      <h3 className="text-white text-sm font-bold uppercase tracking-wider">Visual Blueprint & Wireframe Mockup</h3>
                      <p className="text-[10px] text-[#ffb700] uppercase font-bold tracking-wider mt-0.5">Klik komponen wireframe di bawah untuk melihat rincian fungsinya</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Visual Blueprint Grid */}
                    <div className="col-span-12 lg:col-span-7 bg-black/50 border border-neutral-900 rounded-2xl p-6 relative">
                      <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      </div>
                      <div className="text-center font-mono text-[9px] text-neutral-600 border-b border-neutral-900 pb-4 mb-6 uppercase tracking-widest">
                        {result.wireframeDesign.title || "Wireframe Preview Frame"}
                      </div>
                      
                      {/* Dynamic Components Layout */}
                      <div className="grid grid-cols-12 gap-4">
                        {result.wireframeDesign.components.map((comp) => renderComponentMockup(comp))}
                      </div>
                    </div>

                    {/* Explanatory Panel */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-between">
                      <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 h-full min-h-[300px] flex flex-col">
                        <h4 className="text-[#ffb700] font-mono text-xs font-bold uppercase tracking-widest border-b border-neutral-800 pb-3 mb-4 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" />
                          Inspektur Komponen
                        </h4>
                        
                        {selectedWireframeComp ? (
                          <div className="space-y-4 animate-fade-in text-left">
                            <div>
                              <div className="text-[9px] text-[#ffb700] font-bold font-mono uppercase tracking-wider mb-1">Nama Komponen</div>
                              <h5 className="text-white font-mono text-sm font-bold uppercase">{selectedWireframeComp.title}</h5>
                            </div>
                            <div>
                              <div className="text-[9px] text-[#ffb700] font-bold font-mono uppercase tracking-wider mb-1">Tipe Tampilan</div>
                              <span className="inline-block bg-neutral-800 border border-neutral-700 text-white text-[9px] font-mono px-2.5 py-1 rounded uppercase font-bold">
                                {selectedWireframeComp.type}
                              </span>
                            </div>
                            <div>
                              <div className="text-[9px] text-[#ffb700] font-bold font-mono uppercase tracking-wider mb-1">Detail Fungsional & Aturan Sistem</div>
                              <p className="text-neutral-300 text-[11px] leading-relaxed font-mono whitespace-pre-line bg-black/40 border border-neutral-950 p-4 rounded-xl">
                                {selectedWireframeComp.details}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                            <Layout className="w-10 h-10 stroke-[1.2] text-neutral-600 mb-3 animate-bounce" />
                            <p className="text-[11px] leading-relaxed max-w-xs font-mono">
                              Silakan klik pada salah satu komponen bergaris tepi di sebelah kiri untuk melihat rincian fungsional dan spesifikasi detail komponen tersebut.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* CTA to Consultation */}
            <div className="bg-gradient-to-r from-black to-[#ffb700]/10 border-2 border-[#ffb700] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-left space-y-1">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Requirements Sudah Sempurna?</h4>
                <p className="text-neutral-400 text-[10px] font-mono max-w-xl leading-relaxed">
                  Bagus Señor/Señora! Langkah berikutnya adalah melakukan konsultasi mendalam dengan tim developer utama Shoes Lavandería melalui WhatsApp.
                </p>
              </div>
              <button 
                onClick={() => window.open('https://wa.me/6285776909036?text=Halo%20Asesor%20Shoes%20Lavanderia,%20saya%20sudah%20menyusun%20spesifikasi%20kebutuhan%20fitur%20baru.%20Bisa%20bantu%20review%20dan%20development?', '_blank')}
                className="bg-[#ffb700] hover:bg-[#e0a100] text-black font-bold text-[10px] tracking-widest px-6 py-3 border border-black uppercase font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 flex-shrink-0"
              >
                KIRIM SPEC KE DEVELOPER
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
