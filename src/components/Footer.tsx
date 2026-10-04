import React from 'react';
import { SiteConfig } from '../types';
import { Settings, MessageSquare, MapPin, KeyRound } from 'lucide-react';

interface FooterProps {
  config: SiteConfig;
  onToggleAdmin: () => void;
  onOpenConfig?: () => void;
  onOpenLeadModal: (servicoNome: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onToggleAdmin, onOpenConfig, onOpenLeadModal }) => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <span className="font-display font-bold text-white text-base block">
              GRUPO ELO & VANGUARD
            </span>
            <p className="mt-2 text-slate-400 leading-relaxed text-xs">
              Hub unificado de soluções: manutenção de máquinas de costura em São Gonçalo RJ, cursos
              livres profissionalizantes e consultoria administrativa/RH digital.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-cyan-400 font-semibold text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>São Gonçalo - RJ · Atendimento Nacional</span>
            </div>
          </div>

          {/* EloMak Col */}
          <div>
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
              EloMak Máquinas
            </span>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>Reforma de Overlock & Reta Industrial</li>
              <li>Revisão de Máquinas Domésticas</li>
              <li>Venda de Peças, Motores e Acessórios</li>
              <li>Orçamento sem compromisso em São Gonçalo RJ</li>
            </ul>
          </div>

          {/* Vanguard & Elo Contabil Col */}
          <div>
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] block">
              Educação & BPO Digital
            </span>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>Vanguard: Vendas de Alta Performance</li>
              <li>Vanguard: 100% Online com Certificado</li>
              <li>Elo Contábil: BPO Financeiro e Rotinas de RH</li>
              <li>Elo Contábil: Serviços sem necessidade de CRC</li>
            </ul>
          </div>

          {/* Concierge & Admin Link */}
          <div>
            <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
              Central de Atendimento
            </span>
            <p className="mt-2 text-slate-300">
              {config.camillaNome} · {config.camillaCargo}
            </p>
            <button
              onClick={() => onOpenLeadModal('Atendimento Geral pelo Rodapé')}
              className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-bold text-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>(21) 99613-4073</span>
            </button>

            <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
              {onOpenConfig && (
                <button
                  onClick={onOpenConfig}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3 h-3 text-cyan-400" />
                  <span>Configuração de Chaves & Serviços</span>
                </button>
              )}
              <button
                onClick={onToggleAdmin}
                className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-3 h-3" />
                <span>Painel de Controle Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Grupo Elo & Vanguard. Todos os direitos reservados.
          </p>
          <p className="text-slate-400">
            EloMak São Gonçalo · Vanguard Cursos Online · Elo Contábil Digital
          </p>
        </div>
      </div>
    </footer>
  );
};
