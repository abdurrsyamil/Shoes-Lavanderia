import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const SUGGESTED_CHIPS = [
  { label: "👞 Cara Merawat", query: "Merawat" },
  { label: "🇪🇸 Kenapa ala Spanyol?", query: "Spanyol" },
  { label: "📍 Lokasí Workshop", query: "Lokasi" },
  { label: "💰 Harga Cuci", query: "Harga" },
  { label: "🔥 Promo Aktif", query: "Promo" }
];

export const Chatbot: React.FC = () => {
  const { chatbotOpen, toggleChatbot, chatbotMessages, sendUserMessage } = useStore();
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatbotMessages, chatbotOpen]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendUserMessage(inputVal);
    setInputVal('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleChipClick = (label: string, query: string) => {
    sendUserMessage(label);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div 
        className={`fixed bottom-6 right-6 z-50 font-sans transition-all duration-300 ${chatbotOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`} 
        id="lavanderia-chatbot-root"
      >
        <button 
          onClick={() => toggleChatbot(true)}
          className="bg-[#ffb700] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-black group p-0"
          id="lavanderia-chat-toggle"
        >
          <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Chatbot Window */}
      {chatbotOpen && (
        <div 
          className="fixed bottom-6 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 w-auto sm:w-[380px] h-[480px] sm:h-[550px] bg-[#121212] border-2 border-neutral-900 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-[9999]"
          id="lavanderia-chat-window"
        >
          {/* Window Header */}
          <div className="bg-black p-4 border-b border-neutral-900 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#ffb700] text-black flex items-center justify-center font-bold text-lg border border-black shadow">
                  🇪🇸
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212] animate-pulse"></div>
              </div>
              <div className="text-left">
                <h4 className="text-white text-xs font-mono font-bold tracking-widest uppercase leading-none">Asesor</h4>
                <span className="text-[10px] text-[#ffb700] tracking-wider block font-bold uppercase mt-1 leading-none">Admin Shoes Lavandería</span>
              </div>
            </div>
            <button 
              onClick={() => toggleChatbot(false)} 
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer p-2 bg-transparent border-0"
              id="lavanderia-chat-close"
            >
              <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Stream */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-neutral-800"
            id="lavanderia-chat-messages"
          >
            {chatbotMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                <div 
                  className={`max-w-[85%] p-3 text-xs leading-relaxed font-mono shadow-md ${
                    msg.isBot 
                      ? 'bg-[#1c1c1c] text-white border border-neutral-800 rounded-2xl rounded-tl-sm' 
                      : 'bg-[#ffb700] text-black font-bold rounded-2xl rounded-tr-sm'
                  }`}
                >
                  {msg.isTyping ? (
                    <div className="flex items-center gap-1.5 py-1 px-2">
                      <span className="w-1.5 h-1.5 bg-[#ffb700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#ffb700] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#ffb700] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  ) : (
                    msg.text.split('\n').map((line, lIdx) => (
                      <React.Fragment key={lIdx}>
                        {line}
                        {lIdx < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Action Chips */}
          <div 
            className="px-4 py-3 bg-neutral-950 border-t border-neutral-900 overflow-x-auto whitespace-nowrap flex gap-2 flex-shrink-0" 
            id="lavanderia-chat-chips" 
            style={{ scrollbarWidth: 'none' }}
          >
            {SUGGESTED_CHIPS.map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => handleChipClick(chip.label, chip.query)}
                className="bg-neutral-900 hover:bg-[#ffb700] hover:text-black text-[#ffb700] text-[10px] font-mono tracking-wider font-bold py-2 px-3.5 border border-neutral-850 rounded-full transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex items-center gap-2 flex-shrink-0 pb-safe">
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanyakan kondisi sepatu Anda..." 
              className="flex-1 bg-[#121212] border border-neutral-800 text-white placeholder-neutral-500 rounded-xl py-3 px-3.5 text-xs font-mono tracking-wide focus:outline-none focus:border-[#ffb700] transition-colors"
              id="lavanderia-chat-input"
            />
            <button 
              onClick={handleSend}
              className="bg-[#ffb700] hover:bg-[#e0a100] text-black p-3 rounded-xl transition-all border border-black cursor-pointer bg-transparent"
              id="lavanderia-chat-send"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
