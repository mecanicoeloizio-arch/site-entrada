import React from 'react';
import { Star, ShieldCheck, CheckCircle2, TrendingUp, Users, Award } from 'lucide-react';
import { Testimonial } from '../types';

interface DataTrustWallProps {
  testimonials: Testimonial[];
}

export const DataTrustWall: React.FC<DataTrustWallProps> = ({ testimonials }) => {
  return (
    <section id="depoimentos" className="py-16 sm:py-24 bg-slate-950/50 relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Header */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Operational Status Dot */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-3">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="truncate">DATA TRUST WALL · CASOS REAIS COMPROVADOS</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white text-balance">
            Resultados Comprovados por Quem Já Utilizou
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed text-balance">
            Casos reais de confecções em São Gonçalo, profissionais formados pela Vanguard e PMEs geridas pelo BPO da Elo Contábil.
          </p>
        </div>

        {/* Quantifiable Trust Metrics Banner (Adaptive on mobile) */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400 block font-mono tabular-nums">
              +580
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-1 block">Máquinas Revisadas em SG</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400 block font-mono tabular-nums">
              100%
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-1 block">Cursos com Certificado</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-sky-400 block font-mono tabular-nums">
              -60%
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-1 block">Custos vs. CLT Interno</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-cyan-400 block font-mono tabular-nums">
              4.9/5
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-1 block">Índice Geral de Satisfação</span>
          </div>
        </div>

        {/* Testimonials Grid (Fluid Responsive) */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/30 transition-all backdrop-blur-md relative flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Top Row: Service Tag & Stars */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      t.tagServico === 'EloMak'
                        ? 'text-amber-400 bg-amber-950/60 border-amber-500/40'
                        : t.tagServico === 'Vanguard'
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                        : 'text-sky-400 bg-sky-950/60 border-sky-500/40'
                    }`}
                  >
                    {t.tagServico}
                  </span>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{t.texto}"
                </p>
              </div>

              {/* Bottom: Author & Concrete Outcome */}
              <div className="mt-5 sm:mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <strong className="text-white block font-semibold text-xs sm:text-sm">{t.nome}</strong>
                  <span className="text-slate-400 text-[11px] block">{t.localidadeEmpresa}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-cyan-300 font-medium shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{t.resultadoConcreto}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
