import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wrench, GraduationCap, Briefcase, CheckCircle2, RotateCcw } from 'lucide-react';
import { ServiceBrand, SiteConfig } from '../types';

interface NeedFinderProps {
  config: SiteConfig;
  onFilterCategory: (brand: ServiceBrand) => void;
  onOpenLeadModal: (servicoNome: string) => void;
}

export const NeedFinder: React.FC<NeedFinderProps> = ({ config, onFilterCategory, onOpenLeadModal }) => {
  const [selectedGoal, setSelectedGoal] = useState<ServiceBrand | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string>('imediato');

  const handleSelectGoal = (goal: ServiceBrand) => {
    setSelectedGoal(goal);
  };

  const getRecommendation = () => {
    if (selectedGoal === 'elomak') {
      return {
        brandName: 'EloMak Máquinas de Costura',
        tagline: 'Solução técnica e manutenção para confecções e ateliês em São Gonçalo - RJ',
        servicoRecomendado: 'Reforma ou Diagnóstico de Máquinas em São Gonçalo RJ',
        motivo: 'Mecânicos especializados com orçamento sem compromisso para você não perder produção.',
        corBadge: 'text-amber-400 bg-amber-950/40 border-amber-500/30'
      };
    }
    if (selectedGoal === 'vanguard') {
      return {
        brandName: 'Vanguard Cursos Profissionalizantes',
        tagline: 'Capacitação prática em Vendas de Alta Performance 100% online',
        servicoRecomendado: 'Formação em Vendas e Empregabilidade Vanguard',
        motivo: 'Certificado rápido, metodologia validada para aumentar comissões e conquistar novas vagas.',
        corBadge: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
      };
    }
    return {
      brandName: 'Elo Contábil Digital',
      tagline: 'Terceirização de rotinas financeiras, administrativas e RH para PMEs',
      servicoRecomendado: 'BPO Financeiro e RH sem exigência de CRC',
      motivo: 'Redução drástica de custos fixos sem burocracia e com relatórios semanais na nuvem.',
      corBadge: 'text-sky-400 bg-sky-950/40 border-sky-500/30'
    };
  };

  const rec = selectedGoal ? getRecommendation() : null;

  return (
    <section id="triagem" className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl shadow-2xl shadow-cyan-950/50">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Simulador de Direcionamento Rápido</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Não sabe por onde começar? Camilla direciona você em 30 segundos
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Selecione o seu objetivo abaixo para receber a melhor rota e encaminhamento exclusivo.
            </p>
          </div>

          {/* Step 1: Goals */}
          <div className="mt-8">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Passo 1: Qual a sua prioridade principal hoje?
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectGoal('elomak')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedGoal === 'elomak'
                    ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Máquinas de Costura</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Conserto, reforma e peças em São Gonçalo - RJ com orçamento sem compromisso.
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-semibold mt-3 block">EloMak Especialista</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoal('vanguard')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedGoal === 'vanguard'
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Cursos de Vendas Online</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Capacitação profissionalizante para alta empregabilidade e comissões.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold mt-3 block">Vanguard 100% Online</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoal('elocontabil')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedGoal === 'elocontabil'
                    ? 'bg-sky-500/15 border-sky-400 shadow-md shadow-sky-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Gestão Contábil / RH</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    BPO financeiro e departamento pessoal sem exigência de contador no CRC.
                  </p>
                </div>
                <span className="text-[10px] text-sky-400 font-semibold mt-3 block">Elo Contábil Digital</span>
              </button>
            </div>
          </div>

          {/* Step 2: Timeline selector if goal picked */}
          {selectedGoal && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                Passo 2: Qual a sua urgência?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'imediato', label: 'Urgente / Preciso para esta semana' },
                  { id: 'pesquisando', label: 'Estou cotando orçamentos e comparando' },
                  { id: 'futuro', label: 'Planejamento para o próximo mês' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTimeline(item.id)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      selectedTimeline === item.id
                        ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Result & Direct Concierge Routing */}
          {rec && (
            <div className="mt-8 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in duration-300">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${rec.corBadge}`}>
                    {rec.brandName}
                  </span>
                  <span className="text-xs text-slate-400">· Recomendação Direcionada</span>
                </div>
                <h4 className="font-bold text-white text-base sm:text-lg mt-1">{rec.servicoRecomendado}</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">{rec.motivo}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => {
                    if (selectedGoal) {
                      onFilterCategory(selectedGoal);
                      const el = document.getElementById('shopping');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-center text-center"
                >
                  Ver no Mini Shopping
                </button>

                <button
                  onClick={() =>
                    onOpenLeadModal(
                      `Direcionamento Triagem: ${rec.brandName} - ${rec.servicoRecomendado} (${selectedTimeline})`
                    )
                  }
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Ativar Atendimento Camilla</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
