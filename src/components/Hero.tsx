import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  MessageSquare,
  Wrench,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  onExploreShopping: () => void;
  onOpenLeadModal: (servicoNome: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onExploreShopping, onOpenLeadModal }) => {
  return (
    <section id="topo" className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Psychological Trust & Concierge Live Status Kicker */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-semibold text-cyan-200">
              {config.camillaNome} · Triagem Ativa no WhatsApp
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>São Gonçalo - RJ & Brasil</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-medium text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Orçamento Sem Compromisso</span>
          </div>
        </div>

        {/* Marquee Headline with Balanced Typography */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
            {config.homeH1}
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-balance">
            {config.homeSubtitulo}
          </p>
        </div>

        {/* 3 Pillars Quick Cards with Clear Value Proposition */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* 1. EloMak */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/70 border border-amber-500/25 backdrop-blur-xl hover:border-amber-400/50 transition-all flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  EloMak Máquinas
                </span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  São Gonçalo - RJ
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                Reforma, Peças & Manutenção
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Overlock, reta e galoneira reguladas no ponto ideal. Não deixe sua produção parada com mecânico que demora.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-amber-300 font-semibold">Orçamento Grátis</span>
              <button
                onClick={onExploreShopping}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                Ver vitrine <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. Vanguard Cursos */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/70 border border-emerald-500/25 backdrop-blur-xl hover:border-emerald-400/50 transition-all flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Vanguard Cursos
                </span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  100% Online
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                Vendas & Empregabilidade
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Formação livre prática com certificado rápido e scripts de negociação para alavancar comissões imediatas.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-semibold">Certificado Incluso</span>
              <button
                onClick={onExploreShopping}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                Ver cursos <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3. Elo Contábil Digital */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/70 border border-sky-500/25 backdrop-blur-xl hover:border-sky-400/50 transition-all flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Elo Contábil Digital
                </span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  Sem CRC
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                BPO Financeiro & Rotinas RH
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Terceirização administrativa e departamento pessoal para PMEs sem o custo pesado de contratação CLT.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-sky-300 font-semibold">Economia de até 60%</span>
              <button
                onClick={onExploreShopping}
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                Ver planos <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Decision Buttons (Touch Friendly & Responsive) */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onExploreShopping}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:opacity-95 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explorar Mini Shopping de Soluções</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenLeadModal('Triagem Imediata via WhatsApp')}
            className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Falar com Camilla no WhatsApp</span>
          </button>
        </div>

        {/* Zero Risk Assurance Banner */}
        <div className="mt-8 pt-6 border-t border-white/10 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] sm:text-xs text-slate-400 text-center">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Orçamento 100% Gratuito
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Sem Contratos de Fidelidade
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            Retorno Médio em 3 Minutos
          </span>
        </div>
      </div>
    </section>
  );
};
