import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Wrench,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ServiceBrand, ServiceItem, SiteConfig } from '../types';
import { ServiceIllustration } from './ServiceIllustration';

interface MiniShoppingProps {
  services: ServiceItem[];
  config: SiteConfig;
  activeFilter: 'todos' | ServiceBrand;
  onFilterChange: (filter: 'todos' | ServiceBrand) => void;
  onOpenLeadModal: (servicoNome: string) => void;
}

export const MiniShopping: React.FC<MiniShoppingProps> = ({
  services,
  config,
  activeFilter,
  onFilterChange,
  onOpenLeadModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services
    .filter((s) => s.disponivel)
    .filter((s) => (activeFilter === 'todos' ? true : s.marca === activeFilter))
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.titulo.toLowerCase().includes(q) ||
        s.subtitulo.toLowerCase().includes(q) ||
        s.descricao.toLowerCase().includes(q) ||
        s.badge.toLowerCase().includes(q) ||
        s.beneficios.some((b) => b.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => a.ordem - b.ordem);

  const getBrandMeta = (marca: ServiceBrand) => {
    switch (marca) {
      case 'elomak':
        return {
          label: 'EloMak Máquinas',
          subtitle: 'São Gonçalo - RJ · Orçamento sem compromisso',
          accentBorder: 'hover:border-amber-400/50',
          badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
          btnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold',
          porQue: 'Evite prejuízo de produção parada e tecidos danificados.'
        };
      case 'vanguard':
        return {
          label: 'Vanguard Cursos',
          subtitle: '100% Online · Alta Empregabilidade',
          accentBorder: 'hover:border-emerald-400/50',
          badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
          btnClass: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold',
          porQue: 'Destrave comissões mais altas com scripts práticos validados.'
        };
      case 'elocontabil':
        return {
          label: 'Elo Contábil Digital',
          subtitle: 'BPO & RH · Não precisa de CRC',
          accentBorder: 'hover:border-sky-400/50',
          badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-500/40',
          btnClass: 'bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold',
          porQue: 'Economize até 60% vs equipe interna sem dores de cabeça.'
        };
      case 'elosign':
        return {
          label: 'EloSign Assinaturas',
          subtitle: '100% Online · Lei 14.063/2020',
          accentBorder: 'hover:border-indigo-400/50',
          badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40',
          btnClass: 'bg-indigo-400 hover:bg-indigo-300 text-slate-950 font-bold',
          porQue: 'Colete assinaturas com validade jurídica sem pagar fortunas por envelope.'
        };
      case 'eloautentico':
        return {
          label: 'EloAutêntico',
          subtitle: '100% Online · QR Code & SHA-256',
          accentBorder: 'hover:border-purple-400/50',
          badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/40',
          btnClass: 'bg-purple-400 hover:bg-purple-300 text-slate-950 font-bold',
          porQue: 'Validação pública imediata de recibos, laudos e termos com carimbo forense.'
        };
      case 'elomail':
        return {
          label: 'EloMail Gateway',
          subtitle: '100% Online · Hostinger SMTP & PDF',
          accentBorder: 'hover:border-rose-400/50',
          badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
          btnClass: 'bg-rose-400 hover:bg-rose-300 text-slate-950 font-bold',
          porQue: 'Disparo de faturas e termos em PDF integrado à IA e n8n sem custos abusivos.'
        };
      case 'saas':
      default:
        return {
          label: 'SaaS & Automação',
          subtitle: 'Solução Digital Grupo Eloizio',
          accentBorder: 'hover:border-cyan-400/50',
          badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
          btnClass: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold',
          porQue: 'Tecnologia sob medida para acelerar seu negócio e eliminar retrabalho.'
        };
    }
  };

  return (
    <section id="shopping" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <span>Mini Shopping de Soluções</span>
              <span aria-hidden="true">·</span>
              <span>Encaminhamento Direto</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Catálogo de Serviços & Oportunidades
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consulte os detalhes técnicos, entenda o porquê de cada solução e clique para iniciar
              o atendimento imediato com Camilla via WhatsApp.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar serviço, máquina, curso..."
              className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 placeholder-slate-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs (Horizontal Scrollable on Mobile for Perfect Touch UX) */}
        <div className="mt-6 sm:mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          <button
            onClick={() => onFilterChange('todos')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeFilter === 'todos'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            Todos os Serviços ({services.filter((s) => s.disponivel).length})
          </button>

          <button
            onClick={() => onFilterChange('elomak')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeFilter === 'elomak'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>EloMak (São Gonçalo - RJ)</span>
          </button>

          <button
            onClick={() => onFilterChange('vanguard')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeFilter === 'vanguard'
                ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vanguard (Cursos Online)</span>
          </button>

          <button
            onClick={() => onFilterChange('elocontabil')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeFilter === 'elocontabil'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-400/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            <span>Elo Contábil (BPO & RH Digital)</span>
          </button>
        </div>

        {/* Product / Service Grid (Mobile 1 col, Tablet 2 cols, Desktop 3 cols) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const brandMeta = getBrandMeta(service.marca);

            return (
              <div
                key={service.id}
                className={`rounded-2xl sm:rounded-3xl bg-slate-900/70 border border-white/10 overflow-hidden flex flex-col justify-between transition-all backdrop-blur-xl ${brandMeta.accentBorder} hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30`}
              >
                {/* Visual Header */}
                <div>
                  <div className="relative">
                    <ServiceIllustration marca={service.marca} />

                    {/* Regional & Brand Badges */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${brandMeta.badgeColor}`}>
                        {service.badge}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-20">
                      <span className="text-[10px] text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                        {brandMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Content with "Porque e Pra Que" Clarity */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                      {service.titulo}
                    </h3>
                    <p className="text-xs text-cyan-300 font-medium mt-1">
                      {service.subtitulo}
                    </p>

                    {/* Micro Porquê Kicker */}
                    <div className="mt-3 p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 leading-snug">
                      <strong className="text-white block font-medium">Por que escolher:</strong>
                      {brandMeta.porQue}
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      {service.descricao}
                    </p>

                    {/* Bullet Benefits (O Pra Quê) */}
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Pra quê serve na prática:
                      </span>
                      {service.beneficios.map((beneficio, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{beneficio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer & CTA with Large Touch Targets */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between mb-4">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                      Investimento / Condição
                    </div>
                    <div className="text-xs font-bold text-white font-mono tabular-nums">
                      {service.precoTexto}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => onOpenLeadModal(`${service.titulo} (${brandMeta.label})`)}
                      className={`col-span-4 min-h-[46px] py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${brandMeta.btnClass}`}
                    >
                      <span>Acessar via Camilla</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://wa.me/${config.camillaWhatsApp}?text=${encodeURIComponent(
                        `Olá Camilla, vi o serviço "${service.titulo}" no Mini Shopping do Grupo Eloizio e gostaria de atendimento.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-1 min-h-[46px] rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Chamar direto no WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl bg-white/5 border border-white/10 mt-6">
            <p className="text-slate-400 text-sm">
              Nenhum serviço encontrado com os filtros atuais.
            </p>
            <button
              onClick={() => {
                onFilterChange('todos');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-cyan-400 font-semibold hover:underline cursor-pointer"
            >
              Limpar filtros e exibir todos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
