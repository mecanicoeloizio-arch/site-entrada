import React, { useState, useEffect } from 'react';
import {
  Database,
  Wifi,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Send,
  Layers,
  Activity,
  HardDrive,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { api, getApiSettings, saveApiSettings } from '../services/api';
import { ApiSettings, DbCliente, DbConversa, DbCerebroCamilla } from '../types';

interface DatabaseApiManagerProps {
  apiHealth?: any;
  leadsCount: number;
}

export const DatabaseApiManager: React.FC<DatabaseApiManagerProps> = ({ apiHealth, leadsCount }) => {
  const [settings, setSettings] = useState<ApiSettings>(getApiSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Ping test state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    statusText: string;
    data?: any;
    error?: string;
  } | null>(null);

  // Database live view state
  const [activeDbTab, setActiveDbTab] = useState<'clientes' | 'conversas' | 'cerebro_camilla' | 'schema_sql'>('clientes');
  const [dbClientes, setDbClientes] = useState<DbCliente[]>([]);
  const [dbConversas, setDbConversas] = useState<DbConversa[]>([]);
  const [dbCerebro, setDbCerebro] = useState<DbCerebroCamilla[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // Load database tables
  const loadDbData = async () => {
    setIsLoadingDb(true);
    try {
      const [cls, convs, cer] = await Promise.all([
        api.getDbClientes(),
        api.getDbConversas(),
        api.getDbCerebroCamilla()
      ]);
      setDbClientes(cls);
      setDbConversas(convs);
      setDbCerebro(cer);
    } catch {
      // fallback
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    loadDbData();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const target = settings.useCustomApi && settings.apiBaseUrl
        ? `${settings.apiBaseUrl.replace(/\/+$/, '')}/health`
        : '/api/health';
      const res = await api.testConnection(target, settings.apiToken);
      setTestResult(res);
      if (res.success) {
        loadDbData();
      }
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const dockerFixCommand = `docker exec -it $(docker ps -qf "name=php") apt-get update && docker exec -it $(docker ps -qf "name=php") apt-get install -y php8.2-pgsql && docker exec -it $(docker ps -qf "name=php") service apache2 restart`;

  const sqlPostgresSchema = `-- ======================================================
-- BANCO DE DADOS UNIFICADO: grupoeloizio (PostgreSQL 16)
-- Conexão: postgres://postgres:5432/grupoeloizio
-- Compatível com: PHP 8.2, Node 24 (Camilla AI), Node 20 (Baileys)
-- ======================================================

-- 1. Tabela Principal de Clientes / Leads
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(150),
  servico_interesse VARCHAR(255) NOT NULL,
  marca VARCHAR(50) DEFAULT 'elomak',
  status VARCHAR(50) DEFAULT 'novo',
  observacao TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Conversas e Disparos de Atendimento (Baileys / Camilla)
CREATE TABLE IF NOT EXISTS conversas (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
  canal VARCHAR(50) DEFAULT 'whatsapp',
  direcao VARCHAR(20) DEFAULT 'inbound',
  mensagem TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela Cérebro Camilla (Memória, Intenções e IA)
CREATE TABLE IF NOT EXISTS cerebro_camilla (
  id SERIAL PRIMARY KEY,
  cliente_id INT,
  intencao VARCHAR(100),
  memoria JSONB DEFAULT '{}'::jsonb,
  resposta_sugerida TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Configurações do Portal Hub
CREATE TABLE IF NOT EXISTS configuracoes (
  id INT PRIMARY KEY DEFAULT 1,
  site_titulo VARCHAR(200),
  site_descricao TEXT,
  site_keywords TEXT,
  cor_primaria VARCHAR(20) DEFAULT '#00f2fe',
  cor_secundaria VARCHAR(20) DEFAULT '#4facfe',
  cor_fundo VARCHAR(20) DEFAULT '#080b11',
  home_h1 VARCHAR(255),
  home_subtitulo TEXT,
  camilla_nome VARCHAR(100) DEFAULT 'Camilla',
  camilla_cargo VARCHAR(150) DEFAULT 'Head de Triagem & Atendimento Especializado',
  camilla_whatsapp VARCHAR(50) DEFAULT '5521996134073',
  aviso_urgencia VARCHAR(255)
);

-- 5. Tabela de Serviços Mini Shopping
CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  subtitulo VARCHAR(255),
  descricao TEXT,
  beneficios TEXT[],
  preco_texto VARCHAR(100),
  badge VARCHAR(100),
  link_destino VARCHAR(255),
  disponivel BOOLEAN DEFAULT TRUE,
  ordem INT DEFAULT 0
);

-- 6. Tabela de Depoimentos & Prova Social
CREATE TABLE IF NOT EXISTS depoimentos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  localidade_empresa VARCHAR(200),
  texto TEXT NOT NULL,
  rating INT DEFAULT 5,
  tag_servico VARCHAR(50),
  resultado_concreto VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Alta Performance para o Hub e Traefik
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp ON clientes(whatsapp);
CREATE INDEX IF NOT EXISTS idx_clientes_marca ON clientes(marca);
CREATE INDEX IF NOT EXISTS idx_conversas_cliente ON conversas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cerebro_intencao ON cerebro_camilla(intencao);`;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Diagnóstico do Servidor Real */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                PostgreSQL 16 · Banco Unificado
              </span>
              <span className="text-xs text-slate-400">grupoeloizio.com.br</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-2">
              Integração com API & Banco de Dados
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Estruturado com as 3 tabelas fundamentais: <code className="text-cyan-300 font-semibold">clientes</code>,{' '}
              <code className="text-cyan-300 font-semibold">conversas</code> e{' '}
              <code className="text-cyan-300 font-semibold">cerebro_camilla</code>, conectado à API REST com fallback resiliente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testando Conexão...' : 'Testar Conexão com API'}</span>
            </button>
            <button
              onClick={loadDbData}
              disabled={isLoadingDb}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Atualizar Dados</span>
            </button>
          </div>
        </div>

        {/* Status Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Driver PHP PDO</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-bold text-amber-300">CURL ON · PDO_PGSQL</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Dual-mode (cURL / PDO)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Banco Unificado</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-emerald-300">grupoeloizio (Porta 5432)</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">PostgreSQL 16 Alpine</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Tabela Clientes</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-extrabold text-white">
                {dbClientes.length > 0 ? dbClientes.length : leadsCount}
              </span>
              <span className="text-[11px] text-cyan-400 font-semibold">registros</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Leads captados no Hub</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Camilla AI & WA</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-bold text-cyan-300">Node 24 + Baileys</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Triagem inteligente</span>
          </div>
        </div>
      </div>

      {/* Alerta e Solução do Erro: "could not find driver" */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-white text-sm">
              Solução do Diagnóstico: "Status: ERRO: could not find driver" (PDO_PGSQL OFF ❌)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No diagnóstico que você enviou, o PHP 8.2 está rodando perfeitamente e o <strong>CURL está ON ✅</strong>, mas a extensão do Postgres no container PHP não estava habilitada.
              Nossa aplicação já vem com <strong>proteção automática</strong>: se o driver estiver OFF, ela usa a <strong>ponte via cURL / JSON resiliente</strong> sem travar o site!
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Para ativar a conexão nativa direta no container do Apache/PHP com 1 comando, execute no terminal do servidor:
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/90 border border-white/10 flex items-center justify-between gap-3">
          <code className="text-xs text-emerald-400 font-mono break-all">
            {dockerFixCommand}
          </code>
          <button
            onClick={() => copyToClipboard(dockerFixCommand, 'docker-cmd')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copiedText === 'docker-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText === 'docker-cmd' ? 'Copiado!' : 'Copiar Comando'}</span>
          </button>
        </div>
      </div>

      {/* Formulário de Configuração da API */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-white text-base">
              Configurações de Conexão com API Externa ou Local
            </h3>
          </div>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Configurações salvas!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useCustomApi"
              checked={settings.useCustomApi}
              onChange={(e) => setSettings({ ...settings, useCustomApi: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-white/20 focus:ring-cyan-500"
            />
            <label htmlFor="useCustomApi" className="text-xs font-semibold text-slate-200 cursor-pointer">
              Ativar URL personalizada para API externa (ex: microserviço Node / Traefik)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                URL Base da API (Endpoint REST)
              </label>
              <input
                type="text"
                value={settings.apiBaseUrl}
                disabled={!settings.useCustomApi}
                onChange={(e) => setSettings({ ...settings, apiBaseUrl: e.target.value })}
                placeholder="https://camilla.grupoeloizio.com.br/api ou /api"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50 font-mono"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Deixe desmarcado para usar a API local padrão integrada (<code className="text-cyan-400">/api</code>).
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Token de Autorização (Bearer Token / API Key Opcional)
              </label>
              <input
                type="password"
                value={settings.apiToken}
                onChange={(e) => setSettings({ ...settings, apiToken: e.target.value })}
                placeholder="Bearer token de segurança..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Enviado no header <code className="text-cyan-400">Authorization: Bearer &lt;token&gt;</code> em todas as requisições.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              Salvar Configurações de API
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ping Teste Rápido</span>
            </button>
          </div>
        </form>

        {/* Live Test Result Output */}
        {testResult && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono space-y-1.5 ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>{testResult.success ? '✅ API Conectada com Sucesso!' : '❌ Falha ao Conectar na API'}</span>
              <span>{testResult.statusText}</span>
            </div>
            {testResult.error && (
              <p className="text-[11px] text-rose-300 mt-1">Erro: {testResult.error}</p>
            )}
            {testResult.data && (
              <pre className="mt-2 p-2.5 rounded-lg bg-slate-950/80 border border-white/10 text-[10px] text-slate-300 overflow-x-auto max-h-36">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Visualizador das Tabelas Oficiais do Banco */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Inspetor de Tabelas do Banco de Dados PostgreSQL
            </h3>
            <span className="text-xs text-slate-400">
              Dados sincronizados entre o Hub e os microserviços (Camilla AI, Baileys e CRM).
            </span>
          </div>

          {/* Table Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveDbTab('clientes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeDbTab === 'clientes'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              clientes ({dbClientes.length})
            </button>
            <button
              onClick={() => setActiveDbTab('conversas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeDbTab === 'conversas'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              conversas ({dbConversas.length})
            </button>
            <button
              onClick={() => setActiveDbTab('cerebro_camilla')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeDbTab === 'cerebro_camilla'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              cerebro_camilla ({dbCerebro.length})
            </button>
            <button
              onClick={() => setActiveDbTab('schema_sql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeDbTab === 'schema_sql'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              SQL Schema
            </button>
          </div>
        </div>

        {/* Tab 1: Clientes */}
        {activeDbTab === 'clientes' && (
          <div className="overflow-x-auto">
            {dbClientes.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Nenhum lead gravado ainda no banco PostgreSQL. Envie um lead pelo formulário ou faça um teste!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Nome</th>
                    <th className="py-2.5 px-3">WhatsApp</th>
                    <th className="py-2.5 px-3">Serviço de Interesse</th>
                    <th className="py-2.5 px-3">Marca</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Observação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dbClientes.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="py-2.5 px-3 font-mono text-cyan-400">#{c.id}</td>
                      <td className="py-2.5 px-3 font-medium text-white">{c.nome}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        <a
                          href={`https://wa.me/${c.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-400 hover:underline"
                        >
                          {c.whatsapp}
                        </a>
                      </td>
                      <td className="py-2.5 px-3 text-slate-200">{c.servico_interesse}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                          {c.marca}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 italic max-w-xs truncate">
                        {c.observacao || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Conversas */}
        {activeDbTab === 'conversas' && (
          <div className="overflow-x-auto">
            {dbConversas.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Nenhum log de conversa registrado no banco. As mensagens geradas pelo portal serão registradas aqui.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Cliente ID</th>
                    <th className="py-2.5 px-3">Canal</th>
                    <th className="py-2.5 px-3">Direção</th>
                    <th className="py-2.5 px-3">Mensagem</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dbConversas.map((cv) => (
                    <tr key={cv.id} className="hover:bg-white/5">
                      <td className="py-2.5 px-3 font-mono text-cyan-400">#{cv.id}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {cv.cliente_id ? `#${cv.cliente_id}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{cv.canal}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            cv.direcao === 'inbound'
                              ? 'bg-cyan-950 text-cyan-300'
                              : 'bg-purple-950 text-purple-300'
                          }`}
                        >
                          {cv.direcao}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-white max-w-md">{cv.mensagem}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                        {new Date(cv.timestamp).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Cerebro Camilla */}
        {activeDbTab === 'cerebro_camilla' && (
          <div className="overflow-x-auto">
            {dbCerebro.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Nenhuma intenção gravada em cerebro_camilla ainda.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Cliente ID</th>
                    <th className="py-2.5 px-3">Intenção</th>
                    <th className="py-2.5 px-3">Memória Extraída</th>
                    <th className="py-2.5 px-3">Resposta Sugerida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dbCerebro.map((cb) => (
                    <tr key={cb.id} className="hover:bg-white/5">
                      <td className="py-2.5 px-3 font-mono text-cyan-400">#{cb.id}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {cb.cliente_id ? `#${cb.cliente_id}` : '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                          {cb.intencao}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                        {JSON.stringify(cb.memoria)}
                      </td>
                      <td className="py-2.5 px-3 text-white italic max-w-sm">{cb.resposta_sugerida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 4: SQL Schema */}
        {activeDbTab === 'schema_sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Script DDL oficial para PostgreSQL 16 para rodar no seu pgAdmin, DBeaver ou terminal psql.
              </span>
              <button
                onClick={() => copyToClipboard(sqlPostgresSchema, 'sql-postgres')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedText === 'sql-postgres' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'sql-postgres' ? 'Copiado!' : 'Copiar Script SQL'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-[11px] text-cyan-300 font-mono overflow-x-auto max-h-72">
              {sqlPostgresSchema}
            </pre>
          </div>
        )}
      </div>

      {/* Mapa do Ecossistema dos 8 Subdomínios */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-bold text-white text-base">
            Arquitetura do Ecossistema grupoeloizio.com.br
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <strong className="text-cyan-300 font-bold">Hub Central</strong>
              <span className="text-[10px] text-slate-400">PHP 8.2</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">Mini Shopping, SEO & Triagem</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold">EloMak</strong>
              <span className="text-[10px] text-emerald-400">São Gonçalo RJ</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">elomak.grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">Máquinas Industriais & Peças</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold">Vanguard Cursos</strong>
              <span className="text-[10px] text-cyan-400">100% Online</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">vanguard.grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">Vendas & Empregabilidade</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold">Elo Contábil Digital</strong>
              <span className="text-[10px] text-purple-400">Sem CRC</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">elocontabil.grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">BPO Financeiro & Rotinas RH</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold">Camilla AI</strong>
              <span className="text-[10px] text-cyan-400">Node 24</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">camilla.grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">Gemini AI + Postgres 16</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold">WhatsApp Gateway</strong>
              <span className="text-[10px] text-emerald-400">Node 20</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">wa.grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">Baileys API Automation</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold">CRM & Automação</strong>
              <span className="text-[10px] text-slate-400">PHP 8.2</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">elowa.grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">Gestão de contatos</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center justify-between">
              <strong className="text-white font-bold">Email Service</strong>
              <span className="text-[10px] text-slate-400">PHPMailer</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">mail.grupoeloizio.com.br</p>
            <span className="text-[10px] text-slate-500 block mt-1">Disparos transacionais</span>
          </div>
        </div>
      </div>
    </div>
  );
};
