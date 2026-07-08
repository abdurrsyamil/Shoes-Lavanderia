import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, CheckCircle2, Info, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const EmailModal: React.FC = () => {
  const { latestEmail, emailModalOpen, setEmailModalOpen } = useStore();

  if (!emailModalOpen || !latestEmail) return null;

  const handleClose = () => {
    setEmailModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Email Header Panel */}
          <div className="p-6 border-b border-neutral-800 bg-neutral-900/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#ffb700]/10 text-[#ffb700] rounded-lg">
                  <Mail size={18} />
                </div>
                <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-[#ffb700] uppercase">
                  SISTEM NOTIFIKASI EMAIL
                </span>
              </div>

              <div className="flex items-center gap-3">
                {latestEmail.sentRealEmail ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono py-1 px-3 rounded-full uppercase">
                    <CheckCircle2 size={12} />
                    SMTP Sent (Real Email)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono py-1 px-3 rounded-full uppercase">
                    <Info size={12} />
                    Local Sandbox Simulation
                  </span>
                )}

                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer border-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Simulated Mail Client Fields */}
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex items-start">
                <span className="w-16 text-neutral-500 font-bold">DARI:</span>
                <span className="text-white font-medium">
                  {latestEmail.senderName} <span className="text-neutral-500">&lt;no-reply@shoeslavanderiago.com&gt;</span>
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-16 text-neutral-500 font-bold">KEPADA:</span>
                <span className="text-white font-medium">{latestEmail.to}</span>
              </div>
              <div className="flex items-start">
                <span className="w-16 text-neutral-500 font-bold">PERIHAL:</span>
                <span className="text-[#ffb700] font-bold">{latestEmail.subject}</span>
              </div>
            </div>
          </div>

          {/* Email Content Box (Secure isolated iframe for HTML rendering) */}
          <div className="flex-1 overflow-hidden p-4 bg-[#050505]">
            <iframe
              title="Welcome Email Preview"
              srcDoc={latestEmail.html}
              className="w-full h-[55vh] border border-neutral-900 rounded-2xl bg-[#0a0a0a]"
              sandbox="allow-popups allow-popups-to-escape-sandbox"
            />
          </div>

          {/* Sandbox Info Bar */}
          {!latestEmail.sentRealEmail && (
            <div className="px-6 py-3 bg-neutral-900 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 leading-relaxed flex items-center gap-2">
              <Info size={14} className="text-amber-500 shrink-0" />
              <span>
                <strong>Catatan Sandbox:</strong> Seputar integrasi produksi, Anda dapat mengaktifkan pengiriman email otomatis secara langsung ke inbox asli pengguna dengan mengisi kredensial <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, dan <code>SMTP_USER</code> pada Secrets/Environment variables.
              </span>
            </div>
          )}

          {/* Actions Footer */}
          <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
            <p className="text-[10px] font-mono text-neutral-500">
              Generated automatically on registration
            </p>
            <button
              onClick={handleClose}
              className="bg-[#ffb700] hover:bg-[#e0a100] text-black font-bold tracking-widest text-[10px] py-2.5 px-6 rounded-full uppercase transition-colors cursor-pointer border-0"
            >
              TUTUP INBOX PREVIEW
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
