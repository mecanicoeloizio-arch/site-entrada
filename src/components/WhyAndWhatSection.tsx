import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Wrench,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { SiteConfig } from '../types';

interface WhyAndWhatSectionProps {
  config: SiteConfig;
  onOpenLeadModal: (servicoNome: string) => void;
  onFilterCategory: (brand: 'elomak' | 'vanguard' | 'elocontabil') => void;
}

export const WhyAndWhatSection: React.FC<WhyAndWhatSectionProps> = ({
  config,
  onOpenLeadModal,
  onFilterCategory
}) => {
  const pillars = [
    {
      id: 'elomak' as const,
      brand: 'EloMak Máquinas',
      badge: 'São Gonçalo - RJ · Presencial & Balcão',
      icon: Wrench,
      colorTheme: 'amber',
      accentBorder: 'border-amber-500/30',
      accentBg: 'bg-amber-950/20',
      accentGlow: 'hover:border-amber-400/50 hover:shadow-amber-500/10',
      badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
      btnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
      dor: 'A Dor Invisível: O Custo de Máquina Parada',
      dorTexto:
        'Em São Gonçalo e região, quando uma overlock ou reta trava, não é apenas um conserto: são horas de costureiras paradas, atraso na entrega para lojistas e risco de perder tecidos por ponto frouxo ou engrenagens gastas.',
      porque: 'Por que a EloMak existe?',
      porqueTexto:
        'Para dar segurança total a ateliês, facções e costureiras com diagnóstico transparente. Mecânicos locais experientes que sabem que você não pode perder nem um dia de produção.',
      praQue: 'Pra que serve na prática para você?',
      praQueBeneficios: [
        'Regulagem micrométrica do ponto: sem quebra de agulhas e sem franzir o tecido.',
        'Opção de motores Direct Drive que economizam até 70% na sua conta de luz.',
        'Peças originais a pronta entrega para você não esperar semanas por encomenda.',
        'Orçamento 100% sem compromisso: se o valor não agradar, você não gasta 1 real.'
      ],
      garantia: 'Zero Risco: Diagnóstico honesto. Se for apenas regulagem simples, cobramos apenas o justo.',
      cta: 'Solicitar Orçamento sem Compromisso'
    },
    {
      id: 'vanguard' as const,
      brand: 'Vanguard Cursos Online',
      badge: '100% Online · Brasil · Certificado Rápido',
      icon: GraduationCap,
      colorTheme: 'emerald',
      accentBorder: 'border-emerald-500/30',
      accentBg: 'bg-emerald-950/20',
      accentGlow: 'hover:border-emerald-400/50 hover:shadow-emerald-500/10',
      badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
      btnClass: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950',
      dor: 'A Dor Invisível: O Prejuízo de Não Saber Vender',
      dorTexto:
        'Milhares de pessoas perdem vendas todos os dias mandando mensagens frias de WhatsApp que são ignoradas, ou travam na hora em que o cliente diz "tá caro", perdendo comissões que poderiam mudar sua renda.',
      porque: 'Por que a Vanguard existe?',
      porqueTexto:
        'Cursos tradicionais são longos, teóricos e caros. A Vanguard nasceu para entregar habilidades de alta empregabilidade imediata com foco obsessivo em fechamento de vendas e negociação prática.',
      praQue: 'Pra que serve na prática para você?',
      praQueBeneficios: [
        'Scripts prontos de abordagem e quebra de objeções para aplicar no mesmo dia.',
        'Metodologia para dobrar sua taxa de resposta e fechamento no WhatsApp Business.',
        'Certificado de conclusão reconhecido para turbinar seu currículo e disputar vagas melhores.',
        'Aulas gravadas direto ao ponto para assistir no celular, no ônibus ou no intervalo.'
      ],
      garantia: 'Retorno Imediato: Conteúdo validado na prática para você recuperar o valor investido já na primeira semana.',
      cta: 'Quero Destravar Minhas Vendas'
    },
    {
      id: 'elocontabil' as const,
      brand: 'Elo Contábil Digital',
      badge: '100% Digital · PMEs · Sem Exigência de CRC',
      icon: Briefcase,
      colorTheme: 'sky',
      accentBorder: 'border-sky-500/30',
      accentBg: 'bg-sky-950/20',
      accentGlow: 'hover:border-sky-400/50 hover:shadow-sky-500/10',
      badgeClass: 'text-sky-400 bg-sky-950/60 border-sky-500/40',
      btnClass: 'bg-sky-400 hover:bg-sky-300 text-slate-950',
      dor: 'A Dor Invisível: Dinheiro Vazando no Caixa e RH',
      dorTexto:
        'Pequenas empresas pagam juros por boletos esquecidos, levam multas de folha de ponto e perdem noites de sono porque o dono perde horas fazendo trabalho operacional de departamento financeiro e RH.',
      porque: 'Por que a Elo Contábil Digital existe?',
      porqueTexto:
        'Para libertar os donos de empresas da rotina burocrática sem os custos pesados de um funcionário CLT interno ou honorários abusivos de escritórios tradicionais.',
      praQue: 'Pra que serve na prática para você?',
      praQueBeneficios: [
        'BPO Financeiro: Contas a pagar, receber e conciliação bancária 100% organizados na nuvem.',
        'Departamento Pessoal & RH: Admissões, controle rigoroso de ponto e férias sem burocracia.',
        'Economia real de até 60% comparado à contratação de um assistente administrativo CLT.',
        'Rotinas administrativas que dispensam a contratação de contador com CRC para o operacional.'
      ],
      garantia: 'Legalidade & Economia: 100% dentro das normas, sem encargos trabalhistas e com relatórios semanais.',
      cta: 'Cotar BPO Financeiro & RH'
    }
  ];

  return (
    <section id="porque-pra-que" className="py-20 relative bg-slate-950/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Clareza & Psicologia de Decisão</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            O Porquê e Pra Quê de Cada Solução
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Ninguém compra ferramentas ou serviços por vaidade: você contrata para <strong className="text-white">estancar uma perda</strong> ou para <strong className="text-cyan-300">alcançar um resultado concreto</strong>. Veja exatamente como cada braço do ecossistema protege e multiplica seu negócio.
          </p>
        </div>

        {/* 3 Pillars Deep Dive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`rounded-3xl bg-slate-900/80 border ${p.accentBorder} p-6 sm:p-8 backdrop-blur-xl transition-all shadow-xl flex flex-col justify-between ${p.accentGlow}`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white leading-tight">
                          {p.brand}
                        </h3>
                        <span className="text-[10px] text-slate-400 block">{p.badge}</span>
                      </div>
                    </div>
                  </div>

                  {/* 1. O Problema / A Dor (Gatilho de Perda) */}
                  <div className="mt-5 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{p.dor}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      {p.dorTexto}
                    </p>
                  </div>

                  {/* 2. O Porquê (Propósito & Solução) */}
                  <div className="mt-4">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                      {p.porque}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {p.porqueTexto}
                    </p>
                  </div>

                  {/* 3. O Pra Quê (Resultado Prático & Benefícios) */}
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{p.praQue}</span>
                    </span>

                    <ul className="space-y-2.5">
                      {p.praQueBeneficios.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 4. Alívio de Risco / Garantia */}
                  <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{p.garantia}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => onOpenLeadModal(`${p.brand}: Solicitação Direta via Porquê e Pra Quê`)}
                    className={`w-full min-h-[46px] py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${p.btnClass}`}
                  >
                    <span>{p.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onFilterCategory(p.id);
                      const el = document.getElementById('shopping');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    Ver Catálogo no Mini Shopping ↓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
