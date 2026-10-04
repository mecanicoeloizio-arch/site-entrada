import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Wrench,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { SiteConfig } from '../types';

interface RoiRiskCalculatorProps {
  config: SiteConfig;
  onOpenLeadModal: (servicoNome: string) => void;
}

export const RoiRiskCalculator: React.FC<RoiRiskCalculatorProps> = ({ config, onOpenLeadModal }) => {
  const [activeTab, setActiveTab] = useState<'elomak' | 'elocontabil' | 'vanguard'>('elomak');

  // Calculator states
  const [maquinasCount, setMaquinasCount] = useState<number>(3);
  const [funcionariosCount, setFuncionariosCount] = useState<number>(4);
  const [contatosSemana, setContatosSemana] = useState<number>(30);

  // EloMak math
  const prejuizoPorMaquinaDia = 120; // R$ 120/dia de custo de costureira parada + tecido
  const prejuizoSemanalEstimado = maquinasCount * prejuizoPorMaquinaDia * 3; // se 3 dias com problema
  const prejuizoMensalRisco = prejuizoSemanalEstimado * 2;

  // Elo Contábil math
  const custoCltInterno = 2450; // Salário + encargos CLT de 1 assistente
  const custoBpoMensal = funcionariosCount <= 5 ? 390 : funcionariosCount <= 10 ? 590 : 890;
  const economiaMensal = custoCltInterno - custoBpoMensal;
  const economiaAnual = economiaMensal * 12;

  // Vanguard math
  const taxaConversaoAtual = 0.05; // 5%
  const taxaConversaoComScript = 0.14; // 14%
  const ticketMedio = 150;
  const vendasSemanaAtual = Math.round(contatosSemana * taxaConversaoAtual);
  const vendasSemanaNova = Math.round(contatosSemana * taxaConversaoComScript);
  const ganhoExtraMensal = (vendasSemanaNova - vendasSemanaAtual) * ticketMedio * 4;

  return (
    <section id="calculadora-impacto" className="py-20 relative bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-t border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-3">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Neuromarketing & Análise Financeira</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
            Simulador de Risco vs. Retorno Real
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed text-balance">
            Descubra em segundos quanto você pode estar deixando na mesa e quanto pode economizar ou faturar a mais com o suporte do Grupo Elo & Vanguard.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('elomak')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'elomak'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-500" />
            <span>EloMak (Risco de Máquina Parada)</span>
          </button>

          <button
            onClick={() => setActiveTab('elocontabil')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'elocontabil'
                ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Briefcase className="w-4 h-4 text-sky-500" />
            <span>Elo Contábil (Economia BPO vs. CLT)</span>
          </button>

          <button
            onClick={() => setActiveTab('vanguard')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'vanguard'
                ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            <span>Vanguard (Potencial de Vendas)</span>
          </button>
        </div>

        {/* Calculator Body Card */}
        <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* 1. EloMak Tab */}
          {activeTab === 'elomak' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="font-display font-bold text-white text-xl">
                    Quantas máquinas você tem em operação no seu ateliê ou confecção?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Cálculo baseado no impacto de horas ociosas, atraso de entrega e tecidos danificados em São Gonçalo.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display text-4xl font-extrabold text-amber-400 font-mono tabular-nums">
                    {maquinasCount}
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">máquinas ativas</span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={maquinasCount}
                  onChange={(e) => setMaquinasCount(parseInt(e.target.value, 10))}
                  className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1 máquina (doméstica/artesã)</span>
                  <span>5 máquinas (pequeno ateliê)</span>
                  <span>15 máquinas (facção completa)</span>
                </div>
              </div>

              {/* Results Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Risco de Prejuízo Mensal</span>
                  </div>
                  <div className="font-display text-3xl font-extrabold text-rose-400 font-mono tabular-nums mt-2">
                    - R$ {prejuizoMensalRisco.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Valor estimado em perda de produtividade de costureiras paradas e refação de pontos defeituosos.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Solução Preventiva EloMak</span>
                  </div>
                  <div className="font-display text-2xl font-extrabold text-amber-300 mt-2">
                    Orçamento 100% Gratuito
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    A EloMak envia mecânico com peças originais e diagnóstico sem compromisso em São Gonçalo RJ.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  📍 Atendimento direto em Neves, Alcântara, Zé Garoto, Centro e bairros vizinhos.
                </span>

                <button
                  onClick={() =>
                    onOpenLeadModal(
                      `Simulador EloMak: Proteção para ${maquinasCount} máquinas em São Gonçalo`
                    )
                  }
                  className="min-h-[46px] px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Agendar Diagnóstico Grátis Sem Compromisso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 2. Elo Contábil Tab */}
          {activeTab === 'elocontabil' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="font-display font-bold text-white text-xl">
                    Quantos colaboradores sua empresa possui na equipe?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Comparativo real entre o custo CLT de manter assistente interno vs terceirizar via BPO Digital.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display text-4xl font-extrabold text-sky-400 font-mono tabular-nums">
                    {funcionariosCount}
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">colaboradores</span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={funcionariosCount}
                  onChange={(e) => setFuncionariosCount(parseInt(e.target.value, 10))}
                  className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1 colaborador</span>
                  <span>10 colaboradores</span>
                  <span>20 colaboradores</span>
                </div>
              </div>

              {/* Results Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10">
                  <span className="text-slate-400 text-xs font-semibold block mb-1">
                    Custo CLT de Assistente Financeiro / RH
                  </span>
                  <div className="font-display text-2xl font-bold text-slate-300 font-mono tabular-nums">
                    ~ R$ {custoCltInterno.toLocaleString('pt-BR')}/mês
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Inclui piso salarial, encargos, férias, 13º e rescisão.
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-sky-950/30 border border-sky-500/40">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-bold mb-1">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <span>Economia Anual com Elo Contábil BPO</span>
                  </div>
                  <div className="font-display text-3xl font-extrabold text-sky-300 font-mono tabular-nums mt-1">
                    + R$ {economiaAnual.toLocaleString('pt-BR')}/ano
                  </div>
                  <span className="text-[11px] text-sky-200/80 block mt-1">
                    Plano BPO a partir de apenas R$ {custoBpoMensal}/mês, sem encargos trabalhistas!
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  💼 100% legal: não precisa de contador registrado no CRC para rotinas financeiras e de DP.
                </span>

                <button
                  onClick={() =>
                    onOpenLeadModal(
                      `Simulador BPO: Economia estimada de R$ ${economiaAnual.toLocaleString('pt-BR')}/ano para ${funcionariosCount} funcionários`
                    )
                  }
                  className="min-h-[46px] px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Quero Essa Economia para Minha Empresa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. Vanguard Tab */}
          {activeTab === 'vanguard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h3 className="font-display font-bold text-white text-xl">
                    Quantos clientes ou contatos você atende por semana?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Veja o quanto seu faturamento em comissões ou vendas aumenta ao aplicar scripts práticos de alta conversão.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display text-4xl font-extrabold text-emerald-400 font-mono tabular-nums">
                    {contatosSemana}
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">contatos/semana</span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={contatosSemana}
                  onChange={(e) => setContatosSemana(parseInt(e.target.value, 10))}
                  className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>5 contatos</span>
                  <span>50 contatos</span>
                  <span>100 contatos</span>
                </div>
              </div>

              {/* Results Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10">
                  <span className="text-slate-400 text-xs font-semibold block mb-1">
                    Vendas sem Método (Taxa Média ~5%)
                  </span>
                  <div className="font-display text-2xl font-bold text-slate-300 font-mono tabular-nums">
                    {vendasSemanaAtual} vendas / semana
                  </div>
                  <span className="text-[11px] text-rose-400 block mt-1">
                    Até {contatosSemana - vendasSemanaAtual} clientes perdidos por semana por falta de script!
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ganho Extra Potencial com Vanguard</span>
                  </div>
                  <div className="font-display text-3xl font-extrabold text-emerald-300 font-mono tabular-nums mt-1">
                    + R$ {ganhoExtraMensal.toLocaleString('pt-BR')}/mês
                  </div>
                  <span className="text-[11px] text-emerald-200/80 block mt-1">
                    Com a metodologia Vanguard, você paga o curso e multiplica suas comissões todo mês!
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  🎓 100% online · Certificado Válido incluso · Acesso vitalício aos scripts.
                </span>

                <button
                  onClick={() =>
                    onOpenLeadModal(
                      `Simulador Vanguard: Quero destravar +R$ ${ganhoExtraMensal.toLocaleString('pt-BR')}/mês em vendas`
                    )
                  }
                  className="min-h-[46px] px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Matricular e Multiplicar Minhas Vendas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
