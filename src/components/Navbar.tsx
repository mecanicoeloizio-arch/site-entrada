import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Settings,
  Menu,
  X,
  Wrench,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Calculator,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { SiteConfig } from '../types';

interface NavbarProps {
  config: SiteConfig;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  onOpenConfig?: () => void;
  onOpenLeadModal: (servicoNome: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  isAdminOpen,
  onToggleAdmin,
  onOpenConfig,
  onOpenLeadModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (elementId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080b11]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('topo');
            }}
            className="flex items-center gap-2 sm:gap-2.5 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="font-display font-extrabold text-slate-950 text-lg sm:text-xl tracking-tighter">
                EV
              </span>
            </div>
            <div className="min-w-0">
              <span className="font-display text-sm sm:text-lg font-bold tracking-tight text-white block leading-none truncate">
                ELO & VANGUARD
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-cyan-400 font-semibold block mt-0.5 sm:mt-1 truncate">
                Hub de Soluções Integradas
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('shopping')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Mini Shopping
          </button>
          <button
            onClick={() => handleNavClick('porque-pra-que')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap text-cyan-300/90 font-semibold cursor-pointer"
          >
            O Porquê & Pra Quê
          </button>
          <button
            onClick={() => handleNavClick('calculadora-impacto')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap text-emerald-300/90 font-semibold cursor-pointer"
          >
            Simulador de Risco
          </button>
          <button
            onClick={() => handleNavClick('triagem')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap flex items-center gap-1.5 text-cyan-300 font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Triagem Camilla
          </button>
          <button
            onClick={() => handleNavClick('depoimentos')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Depoimentos
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Configuração de Chaves & Serviços Button */}
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              className="min-h-[40px] px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30"
              title="Configuração de Códigos, Chaves e Serviços"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Configurações & Chaves</span>
              <span className="xl:hidden hidden md:inline">Config</span>
            </button>
          )}

          {/* Admin Toggle Button */}
          <button
            onClick={onToggleAdmin}
            className={`min-h-[40px] px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAdminOpen
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
            title="Painel de Controle Administrativo"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isAdminOpen ? 'Sair do Admin' : 'Admin'}</span>
          </button>

          {/* Camilla WhatsApp CTA */}
          <button
            onClick={() => onOpenLeadModal('Atendimento Geral Concierge')}
            className="min-h-[40px] px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
            <span className="hidden sm:inline">Falar com {config.camillaNome}</span>
            <span className="sm:hidden">{config.camillaNome}</span>
          </button>

          {/* Mobile Menu Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 cursor-pointer"
            aria-label="Abrir Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-cyan-500/30 backdrop-blur-2xl px-4 py-5 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('shopping')}
              className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-left"
            >
              <span>Mini Shopping (Catálogo Completo)</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => handleNavClick('porque-pra-que')}
              className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-left"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">O Porquê e Pra Quê das Soluções</span>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => handleNavClick('calculadora-impacto')}
              className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-left"
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Simulador de Risco & Economia</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => handleNavClick('triagem')}
              className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Simulador de Triagem Camilla</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavClick('depoimentos')}
              className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-left"
            >
              <span>Casos Reais & Depoimentos</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            {onOpenConfig && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConfig();
                }}
                className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-left font-bold"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Configuração de Chaves & Serviços</span>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            )}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Atendimento São Gonçalo RJ</span>
              <span className="text-xs font-mono font-bold text-cyan-400">(21) 99613-4073</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
