import React, { useState } from 'react';
import { X, MessageSquare, ShieldCheck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { Lead, ServiceBrand, SiteConfig } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  serviceTitle: string;
  config: SiteConfig;
  onClose: () => void;
  onSubmitLead: (lead: Omit<Lead, 'id' | 'dataHora' | 'status'>) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  serviceTitle,
  config,
  onClose,
  onSubmitLead
}) => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [observacao, setObservacao] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  if (!isOpen) return null;

  const detectBrand = (title: string): ServiceBrand => {
    const t = title.toLowerCase();
    if (t.includes('elomak') || t.includes('máquina') || t.includes('costura')) return 'elomak';
    if (t.includes('vanguard') || t.includes('curso') || t.includes('vendas')) return 'vanguard';
    return 'elocontabil';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !whatsapp.trim()) return;

    const brand = detectBrand(serviceTitle);

    // Save lead
    onSubmitLead({
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      servicoInteresse: serviceTitle,
      marca: brand,
      observacao: observacao.trim() || undefined
    });

    // Generate custom WhatsApp message
    const msg = encodeURIComponent(
      `Olá Camilla, meu nome é ${nome.trim()}. Vi no portal grupoeloizio.com.br o serviço "${serviceTitle}" e gostaria de atendimento exclusivo.` +
        (observacao.trim() ? ` Detalhes: ${observacao.trim()}` : '')
    );

    const waLink = `https://wa.me/${config.camillaWhatsApp}?text=${msg}`;
    setRedirectUrl(waLink);
    setSubmitted(true);
  };

  const handleOpenWhatsApp = () => {
    if (redirectUrl) {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      handleResetAndClose();
    }
  };

  const handleResetAndClose = () => {
    setNome('');
    setWhatsapp('');
    setEmail('');
    setObservacao('');
    setSubmitted(false);
    setRedirectUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-950/70 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Fechar Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div className="p-5 sm:p-8 overflow-y-auto">
            {/* Header Concierge Badge */}
            <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-white/10">
              <div className="relative shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-display font-extrabold text-base sm:text-lg shadow-md shadow-cyan-500/25">
                  C
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-white text-base sm:text-lg leading-tight truncate">
                  Atendimento com {config.camillaNome}
                </h3>
                <p className="text-xs text-cyan-300 font-medium truncate">{config.camillaCargo}</p>
                <p className="text-[11px] text-slate-400">São Gonçalo RJ · Retorno rápido no WhatsApp</p>
              </div>
            </div>

            {/* Selected Service Focus */}
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                Serviço de Interesse
              </span>
              <span className="font-bold text-white block mt-0.5 text-xs sm:text-sm">{serviceTitle}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria Silva ou Confecção RJ"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(21) 99999-9999"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@empresa.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detalhes ou urgência (opcional)
                </label>
                <textarea
                  rows={2}
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Ex: Minha overlock parou em Neves; Quero começar o curso de vendas hoje; etc."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span>Conectar com Camilla no WhatsApp Agora</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 text-center pt-1">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Dados protegidos · Sem spam · Orçamento 100% sem compromisso</span>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Confirmation */
          <div className="p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Triagem Pronta, {nome}!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Seus dados foram registrados com sucesso. A Camilla já está a postos no WhatsApp para dar
              continuidade ao seu atendimento sobre{' '}
              <strong className="text-cyan-300">{serviceTitle}</strong>.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:gap-3">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full min-h-[48px] py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950 shrink-0" />
                <span>Abrir Conversa no WhatsApp (21 99613-4073)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={handleResetAndClose}
                className="w-full min-h-[40px] py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Voltar ao Mini Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
