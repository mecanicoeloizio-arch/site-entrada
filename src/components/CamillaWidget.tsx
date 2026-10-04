import React, { useState } from 'react';
import { MessageSquare, X, ChevronUp, Sparkles, Send } from 'lucide-react';
import { SiteConfig } from '../types';

interface CamillaWidgetProps {
  config: SiteConfig;
  onOpenLeadModal: (servicoNome: string) => void;
}

export const CamillaWidget: React.FC<CamillaWidgetProps> = ({ config, onOpenLeadModal }) => {
  // On mobile screens, start minimized to respect the 15% sticky cap
  const [isMinimized, setIsMinimized] = useState(true);
  const [quickMsg, setQuickMsg] = useState('');

  const handleSendQuick = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = quickMsg.trim() || 'Olá Camilla, gostaria de atendimento pelo Hub.';
    const url = `https://wa.me/${config.camillaWhatsApp}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setQuickMsg('');
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 max-w-sm w-[calc(100vw-1.5rem)] sm:w-80">
      {isMinimized ? (
        /* Minimized State (Compact, thumb-friendly pill) */
        <button
          onClick={() => setIsMinimized(false)}
          className="ml-auto min-h-[48px] flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-900/95 border border-cyan-500/40 text-white shadow-xl shadow-cyan-950/50 backdrop-blur-md hover:border-cyan-400 transition-all cursor-pointer group"
          aria-label="Abrir Atendimento Camilla"
        >
          <div className="relative shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 text-xs font-bold">
              C
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-slate-900" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold block text-white leading-none">
              {config.camillaNome} · Online
            </span>
            <span className="text-[10px] text-cyan-300 block mt-0.5">Triagem WhatsApp</span>
          </div>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
        </button>
      ) : (
        /* Expanded Concierge Card */
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/70 p-4 sm:p-5 backdrop-blur-xl text-white animate-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 text-xs font-extrabold shadow-md shadow-cyan-500/20">
                  C
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h4 className="font-display text-xs sm:text-sm font-bold text-white leading-none">
                  {config.camillaNome}
                </h4>
                <span className="text-[10px] text-cyan-300 block mt-0.5">
                  {config.camillaCargo}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Minimizar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Concierge Message Bubble */}
          <div className="my-3 p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-200 leading-snug">
            <p>
              Olá! Como posso ajudar você hoje? Posso direcionar para conserto de máquinas na{' '}
              <strong className="text-amber-300">EloMak (São Gonçalo)</strong>, cursos de vendas da{' '}
              <strong className="text-emerald-300">Vanguard</strong> ou BPO da{' '}
              <strong className="text-sky-300">Elo Contábil</strong>.
            </p>
          </div>

          {/* Quick WhatsApp Form */}
          <form onSubmit={handleSendQuick} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                placeholder="Qual o seu pedido ou dúvida?"
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder-slate-500 transition-colors"
              />
              <button
                type="submit"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                title="Enviar para Camilla no WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>(21) 99613-4073</span>
              <button
                type="button"
                onClick={() => {
                  setIsMinimized(true);
                  onOpenLeadModal('Atendimento Personalizado');
                }}
                className="text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Abrir Triagem Completa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
