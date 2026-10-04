import React from 'react';
import { MapPin, CheckCircle, Wrench, Shield, ArrowRight, Phone } from 'lucide-react';

interface SeoLocalBannerProps {
  onOpenLeadModal: (servicoNome: string) => void;
}

export const SeoLocalBanner: React.FC<SeoLocalBannerProps> = ({ onOpenLeadModal }) => {
  return (
    <section className="py-14 sm:py-20 relative bg-gradient-to-b from-transparent via-slate-900/40 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-amber-500/25 p-6 sm:p-10 lg:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left 2 Cols: EloMak São Gonçalo SEO focus */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Atendimento Regional Estruturado · São Gonçalo - RJ</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight text-balance">
                EloMak: Referência em Manutenção de Máquinas de Costura em São Gonçalo
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Atendemos com agilidade oficinas de confecção, facções, ateliês e costureiras
                autônomas em todos os bairros de <strong>São Gonçalo - RJ</strong> (Alcântara, Neves,
                Centro, Zé Garoto, Barro Vermelho, Rocha, Porto da Pedra, Mutondo e adjacências).
                Diagnóstico técnico transparente, reposição de peças originais e{' '}
                <strong className="text-amber-300">orçamento sem compromisso</strong>.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                {[
                  'Conserto de Overlock em São Gonçalo',
                  'Regulagem de Reta Industrial SG',
                  'Peças para Galoneira RJ',
                  'Motores Direct Drive Econômicos',
                  'Máquinas Domésticas Singer / Elgin'
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/20 text-amber-300/90 text-[11px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col: Call to Action card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-amber-500/40 text-center flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Visita Técnica & Orçamento
                </span>
                <h4 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                  Sua Máquina Parou?
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Camilla organiza a rota de atendimento do mecânico até a sua oficina em São Gonçalo.
                </p>
              </div>

              <div className="mt-5 sm:mt-6 space-y-2">
                <button
                  onClick={() => onOpenLeadModal('EloMak: Orçamento Rápido São Gonçalo RJ')}
                  className="w-full min-h-[46px] py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Solicitar Orçamento Grátis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <Phone className="w-3 h-3 text-cyan-400" />
                  <span>WhatsApp: (21) 99613-4073</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
