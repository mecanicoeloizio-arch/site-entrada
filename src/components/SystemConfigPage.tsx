import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  ShoppingBag,
  Code2,
  Globe,
  FileCode,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Mail,
  Send,
  Printer,
  Download,
  Server,
  Terminal
} from 'lucide-react';
import { ServiceBrand, ServiceItem, SystemKeysConfig, SiteConfig } from '../types';
import { INITIAL_SYSTEM_KEYS } from '../data/initialData';
import { api } from '../services/api';
import { ServiceIllustration } from './ServiceIllustration';

interface SystemConfigPageProps {
  config: SiteConfig;
  services: ServiceItem[];
  onUpdateServices: (services: ServiceItem[]) => void;
  onClose: () => void;
  onOpenLeadModal?: (servico: string) => void;
}

export const SystemConfigPage: React.FC<SystemConfigPageProps> = ({
  config,
  services,
  onUpdateServices,
  onClose,
  onOpenLeadModal
}) => {
  const [activeTab, setActiveTab] = useState<'chaves' | 'servicos' | 'codigos' | 'subdominios' | 'gerador_env'>('chaves');

  // Keys configuration state
  const [systemKeys, setSystemKeys] = useState<SystemKeysConfig>(() => {
    try {
      const saved = localStorage.getItem('hub_system_keys');
      return saved ? JSON.parse(saved) : INITIAL_SYSTEM_KEYS;
    } catch {
      return INITIAL_SYSTEM_KEYS;
    }
  });

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; msg: string; success: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Services management state
  const [servicesFilter, setServicesFilter] = useState<'todos' | ServiceBrand>('todos');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormMode, setServiceFormMode] = useState<'adicionar' | 'listar'>('listar');

  // Form for New / Edit Service
  const emptyServiceForm: Omit<ServiceItem, 'id'> = {
    marca: 'elomak',
    titulo: '',
    subtitulo: '',
    descricao: '',
    beneficios: ['Atendimento com rapidez', 'Orçamento sem compromisso'],
    precoTexto: 'A partir de R$ 97,00',
    badge: 'Atendimento São Gonçalo - RJ',
    linkDestino: `https://wa.me/${config.camillaWhatsApp}`,
    disponivel: true,
    ordem: services.length + 1,
    modalidade: 'presencial',
    precoPromocional: '',
    destaqueHome: false
  };

  const [serviceForm, setServiceForm] = useState<Omit<ServiceItem, 'id'>>(emptyServiceForm);
  const [newBenefitText, setNewBenefitText] = useState('');

  // Load system keys from backend on mount
  useEffect(() => {
    async function loadKeys() {
      try {
        const fetched = await api.getSystemKeys();
        if (fetched) {
          setSystemKeys((prev) => ({ ...prev, ...fetched }));
        }
      } catch {
        // use local
      }
    }
    loadKeys();
  }, []);

  const toggleShowSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveKeys = async () => {
    setSaveStatus('Salvando credenciais...');
    try {
      await api.updateSystemKeys(systemKeys);
      localStorage.setItem('hub_system_keys', JSON.stringify(systemKeys));
      setSaveStatus('Chaves e códigos salvos com sucesso!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      localStorage.setItem('hub_system_keys', JSON.stringify(systemKeys));
      setSaveStatus('Salvo localmente com segurança.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Test Ping for external or internal APIs
  const handleTestEndpoint = async (url: string, id: string) => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.testConnection(url);
      setTestResult({
        id,
        msg: res.success ? `Conexão OK! Latência: ${res.latencyMs}ms` : `Falha no teste: ${res.error || res.statusText}`,
        success: res.success
      });
    } catch (err: any) {
      setTestResult({
        id,
        msg: `Erro ao testar: ${err.message}`,
        success: false
      });
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  // Add Benefit to Form
  const handleAddBenefit = () => {
    if (!newBenefitText.trim()) return;
    setServiceForm((prev) => ({
      ...prev,
      beneficios: [...prev.beneficios, newBenefitText.trim()]
    }));
    setNewBenefitText('');
  };

  const handleRemoveBenefit = (index: number) => {
    setServiceForm((prev) => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index)
    }));
  };

  // Save or Update Service
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.titulo.trim()) {
      alert('Por favor, informe o título do serviço.');
      return;
    }

    if (editingServiceId) {
      // Update existing
      const updatedItem: ServiceItem = {
        ...serviceForm,
        id: editingServiceId
      };
      const updatedList = services.map((s) => (s.id === editingServiceId ? updatedItem : s));
      onUpdateServices(updatedList);
      await api.updateService(editingServiceId, updatedItem);
      setSaveStatus(`Serviço "${serviceForm.titulo}" atualizado!`);
    } else {
      // Create new
      const newId = `srv-${Date.now()}`;
      const newItem: ServiceItem = {
        ...serviceForm,
        id: newId
      };
      const updatedList = [newItem, ...services];
      onUpdateServices(updatedList);
      await api.createService(newItem);
      setSaveStatus(`Novo serviço "${serviceForm.titulo}" adicionado com sucesso!`);
    }

    // Reset and return to list
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    setServiceFormMode('listar');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Edit existing service
  const handleStartEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setServiceForm({
      marca: service.marca,
      titulo: service.titulo,
      subtitulo: service.subtitulo,
      descricao: service.descricao,
      beneficios: [...service.beneficios],
      precoTexto: service.precoTexto,
      badge: service.badge,
      linkDestino: service.linkDestino,
      disponivel: service.disponivel,
      ordem: service.ordem,
      modalidade: service.modalidade || 'presencial',
      precoPromocional: service.precoPromocional || '',
      destaqueHome: service.destaqueHome || false
    });
    setServiceFormMode('adicionar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Duplicate service
  const handleDuplicate = (service: ServiceItem) => {
    const duplicated: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`,
      titulo: `${service.titulo} (Cópia)`,
      ordem: services.length + 1
    };
    const updated = [duplicated, ...services];
    onUpdateServices(updated);
    api.createService(duplicated);
    setSaveStatus(`Serviço duplicado: "${duplicated.titulo}"`);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Delete service
  const handleDeleteService = async (id: string, titulo: string) => {
    if (confirm(`Tem certeza de que deseja excluir o serviço "${titulo}"?`)) {
      const updated = services.filter((s) => s.id !== id);
      onUpdateServices(updated);
      await api.deleteService(id);
      setSaveStatus(`Serviço removido com sucesso.`);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Toggle service availability
  const handleToggleAvailable = async (service: ServiceItem) => {
    const updated = services.map((s) => (s.id === service.id ? { ...s, disponivel: !s.disponivel } : s));
    onUpdateServices(updated);
    await api.updateService(service.id, { disponivel: !service.disponivel });
  };

  // Generate .env file content
  const generatedEnv = `# ==============================================================================
# GRUPO ELOIZIO - ARQUIVO DE AMBIENTE (.env)
# Gerado automaticamente pelo Painel de Configurações
# ==============================================================================
PORT=3000
NODE_ENV=production

# --- POSTGRESQL 16 UNIFICADO ---
DATABASE_URL=postgres://${systemKeys.pgUser}:${systemKeys.pgPass}@${systemKeys.pgHost}:${systemKeys.pgPort}/${systemKeys.pgDb}
POSTGRES_HOST=${systemKeys.pgHost}
POSTGRES_PORT=${systemKeys.pgPort}
POSTGRES_DB=${systemKeys.pgDb}
POSTGRES_USER=${systemKeys.pgUser}
POSTGRES_PASSWORD=${systemKeys.pgPass}

# --- MERCADO PAGO (PAGAMENTOS EXCLUSIVOS) ---
MP_ACCESS_TOKEN=${systemKeys.mpAccessToken}
MP_PUBLIC_KEY=${systemKeys.mpPublicKey}
MP_WEBHOOK_SECRET=${systemKeys.mpWebhookSecret}
MP_PIX_KEY=${systemKeys.mpPixKey}

# --- ATENDIMENTO INTELIGENTE CAMILLA & WHATSAPP ---
CAMILLA_BRAIN_KEY=${systemKeys.camillaBrainApiKey}
CAMILLA_ENDPOINT=${systemKeys.camillaDomain}
WHATSAPP_TOKEN=${systemKeys.whatsappToken}
WHATSAPP_INSTANCE_URL=${systemKeys.waDomain}
BAILEYS_ENDPOINT=${systemKeys.baileysEndpoint}

# --- HOSTINGER SMTP & ELOMAIL ---
SMTP_HOST=${systemKeys.smtpHost}
SMTP_PORT=${systemKeys.smtpPort}
SMTP_USER=${systemKeys.smtpUser}
SMTP_PASS=${systemKeys.smtpPass}
SMTP_SECURE=${systemKeys.smtpSecure}
SMTP_FROM_NAME=${systemKeys.smtpFromName}
API_KEY_MASTER=${systemKeys.apiKeyMaster}

# --- RASTREAMENTO & MARKETING ---
GTM_ID=${systemKeys.gtmId}
GA4_ID=${systemKeys.ga4Id}
META_PIXEL_ID=${systemKeys.metaPixelId}
LEAD_WEBHOOK_URL=${systemKeys.leadWebhookUrl}
`;

  // Generate config.php content
  const generatedPhpConfig = `<?php
// ==============================================================================
// GRUPO ELOIZIO - CONFIGURAÇÃO CENTRAL (config.php)
// Compatível com PHP 8.2 / Apache Hostinger
// ==============================================================================
define('DB_HOST', '${systemKeys.pgHost}');
define('DB_PORT', '${systemKeys.pgPort}');
define('DB_NAME', '${systemKeys.pgDb}');
define('DB_USER', '${systemKeys.pgUser}');
define('DB_PASS', '${systemKeys.pgPass}');

// Mercado Pago
define('MP_ACCESS_TOKEN', '${systemKeys.mpAccessToken}');
define('MP_PUBLIC_KEY', '${systemKeys.mpPublicKey}');
define('MP_PIX_KEY', '${systemKeys.mpPixKey}');

// Camilla Atendente Inteligente
define('CAMILLA_WHATSAPP', '${config.camillaWhatsApp}');
define('CAMILLA_ENDPOINT', '${systemKeys.camillaDomain}');
define('CAMILLA_BRAIN_KEY', '${systemKeys.camillaBrainApiKey}');

// Hostinger SMTP & EloMail
define('SMTP_HOST', '${systemKeys.smtpHost}');
define('SMTP_PORT', ${systemKeys.smtpPort});
define('SMTP_USER', '${systemKeys.smtpUser}');
define('SMTP_PASS', '${systemKeys.smtpPass}');
define('API_KEY_MASTER', '${systemKeys.apiKeyMaster}');

// Webhooks
define('LEAD_WEBHOOK_URL', '${systemKeys.leadWebhookUrl}');
`;

  // Generate docker-compose.yml content
  const generatedDockerCompose = `# ==============================================================================
# DOCKER-COMPOSE - STACK GRUPO ELOIZIO (Traefik, PHP 8.2 e PostgreSQL 16)
# Domínio: grupoeloizio.com.br
# ==============================================================================
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: eloizio-traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=mecanicoeloizio@gmail.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - eloizio-net

  web:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: eloizio-hub-web
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      # ONDE OS ARQUIVOS FICAM: pasta do host mapeada para dentro do contêiner
      - ./php-dist:/var/www/html
      - ./php-dist/data:/var/www/html/data
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=${systemKeys.pgDb || 'grupoeloizio'}
      - DB_USER=${systemKeys.pgUser || 'postgres'}
      - DB_PASS=${systemKeys.pgPass || 'postgres'}
      - CAMILLA_WHATSAPP=${config.camillaWhatsApp || '5521996134073'}
      - ECOSYSTEM_DOMAIN=grupoeloizio.com.br
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.eloizio-web.rule=Host(\`grupoeloizio.com.br\`, \`www.grupoeloizio.com.br\`)"
      - "traefik.http.routers.eloizio-web.entrypoints=websecure"
      - "traefik.http.routers.eloizio-web.tls.certresolver=letsencrypt"
      - "traefik.http.services.eloizio-web.loadbalancer.server.port=80"
    networks:
      - eloizio-net

  postgres:
    image: postgres:16-alpine
    container_name: eloizio-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${systemKeys.pgDb || 'grupoeloizio'}
      POSTGRES_USER: ${systemKeys.pgUser || 'postgres'}
      POSTGRES_PASSWORD: ${systemKeys.pgPass || 'postgres'}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./php-dist/postgres_schema.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${systemKeys.pgUser || 'postgres'} -d ${systemKeys.pgDb || 'grupoeloizio'}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - eloizio-net

volumes:
  postgres_data:
    name: eloizio_postgres_data

networks:
  eloizio-net:
    name: eloizio_network
    driver: bridge
`;

  // Generate Dockerfile content
  const generatedDockerfile = `# ==============================================================================
# DOCKERFILE - GRUPO ELOIZIO (Apache + PHP 8.2 + PDO_PGSQL)
# ==============================================================================
FROM php:8.2-apache

# Instalar extensões PostgreSQL, cURL, GD e ZIP
RUN apt-get update && apt-get install -y --no-install-recommends \\
    libpq-dev \\
    libcurl4-openssl-dev \\
    libpng-dev \\
    libjpeg-dev \\
    libfreetype6-dev \\
    libzip-dev \\
    zip \\
    unzip \\
    curl \\
    && docker-php-ext-configure gd --with-freetype --with-jpeg \\
    && docker-php-ext-install -j$(nproc) \\
        pdo \\
        pdo_pgsql \\
        pgsql \\
        curl \\
        gd \\
        zip \\
    && apt-get clean \\
    && rm -rf /var/lib/apt/lists/*

# Habilitar mod_rewrite do Apache
RUN a2enmod rewrite headers

WORKDIR /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
`;


  const getBrandBadge = (marca: ServiceBrand) => {
    switch (marca) {
      case 'elomak':
        return { label: 'EloMak Máquinas', color: 'text-amber-400 bg-amber-950/60 border-amber-500/30' };
      case 'vanguard':
        return { label: 'Vanguard Cursos', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' };
      case 'elocontabil':
        return { label: 'Elo Contábil Digital', color: 'text-sky-400 bg-sky-950/60 border-sky-500/30' };
      case 'elosign':
        return { label: 'EloSign Assinatura', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30' };
      case 'eloautentico':
        return { label: 'EloAutêntico Validador', color: 'text-purple-400 bg-purple-950/60 border-purple-500/30' };
      case 'elomail':
        return { label: 'EloMail Gateway', color: 'text-rose-400 bg-rose-950/60 border-rose-500/30' };
      case 'saas':
      default:
        return { label: 'SaaS & Automação', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30' };
    }
  };

  const filteredServices = services
    .filter((s) => (servicesFilter === 'todos' ? true : s.marca === servicesFilter))
    .sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#080b11]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-2 text-xs font-semibold"
              title="Voltar ao Hub Principal"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Voltar ao Hub</span>
            </button>

            <div className="h-6 w-px bg-white/10" />

            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                  <KeyRound className="w-4 h-4" />
                </span>
                <h1 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                  Configuração de Códigos, Chaves & Serviços
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Painel unificado para gerenciar credenciais de APIs, gateways de pagamento e o catálogo de serviços
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="text-xs text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/30 animate-pulse font-medium">
                {saveStatus}
              </span>
            )}

            <button
              onClick={handleSaveKeys}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none gap-2 border-t border-white/5 py-2">
          {[
            { id: 'chaves', label: '1. Chaves de API & Gateways', icon: KeyRound },
            { id: 'servicos', label: `2. Acrescentar & Gerenciar Serviços (${services.length})`, icon: ShoppingBag },
            { id: 'codigos', label: '3. Códigos de Rastreamento & Scripts', icon: Code2 },
            { id: 'subdominios', label: '4. Subdomínios & Ecossistema', icon: Globe },
            { id: 'gerador_env', label: '5. Docker Stack, .env & Manual PDF', icon: Server }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* =========================================================================
            TAB 1: CHAVES DE API & GATEWAYS
        ========================================================================= */}
        {activeTab === 'chaves' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Context Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/20 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Central de Credenciais & Segredos</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mt-1">
                  Gerenciamento de Chaves, Tokens & Acessos do Sistema
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Insira abaixo as chaves e credenciais dos seus provedores. As credenciais são mantidas de forma segura
                  e sincronizadas com o backend Node / PostgreSQL e arquivos de produção.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSaveKeys}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Todas as Chaves</span>
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/50 border-red-500/40 text-red-300'
                }`}
              >
                {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{testResult.msg}</span>
              </div>
            )}

            {/* Grid de Seções de Chaves */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. MERCADO PAGO */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold text-xs">
                        MP
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-white">
                          Mercado Pago (Pagamentos Exclusivos)
                        </h3>
                        <span className="text-[10px] text-sky-400">Checkout, Cartão, Pix & Webhooks IPN</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ativo
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Access Token */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-medium">Access Token de Produção</label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('mpAccessToken')}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {showSecrets['mpAccessToken'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showSecrets['mpAccessToken'] ? 'Ocultar' : 'Exibir'}</span>
                        </button>
                      </div>
                      <input
                        type={showSecrets['mpAccessToken'] ? 'text' : 'password'}
                        value={systemKeys.mpAccessToken}
                        onChange={(e) => setSystemKeys({ ...systemKeys, mpAccessToken: e.target.value })}
                        placeholder="APP_USR-..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Public Key */}
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Public Key (Frontend)</label>
                      <input
                        type="text"
                        value={systemKeys.mpPublicKey}
                        onChange={(e) => setSystemKeys({ ...systemKeys, mpPublicKey: e.target.value })}
                        placeholder="APP_USR-..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Chave Pix */}
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Chave Pix Oficial do Grupo</label>
                      <input
                        type="text"
                        value={systemKeys.mpPixKey}
                        onChange={(e) => setSystemKeys({ ...systemKeys, mpPixKey: e.target.value })}
                        placeholder="21996134073 ou CNPJ"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Webhook Secret */}
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Webhook Secret / IPN</label>
                      <input
                        type="text"
                        value={systemKeys.mpWebhookSecret}
                        onChange={(e) => setSystemKeys({ ...systemKeys, mpWebhookSecret: e.target.value })}
                        placeholder="whsec_..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>URL Webhook: <code className="text-cyan-300 font-mono">/api/webhooks/mercadopago</code></span>
                  <button
                    onClick={() => handleCopy('https://grupoeloizio.com.br/api/webhooks/mercadopago', 'mpWh')}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'mpWh' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar URL</span>
                  </button>
                </div>
              </div>

              {/* 2. CAMILLA ATENDENTE IA & WHATSAPP */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-white">
                          Camilla IA & WhatsApp (Baileys)
                        </h3>
                        <span className="text-[10px] text-cyan-400">Atendimento Inteligente & Concierge Oficial</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      21 996134073
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Camilla Brain Key */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-medium">Chave Secreta do Cérebro da Camilla (IA)</label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('camillaBrainApiKey')}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {showSecrets['camillaBrainApiKey'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showSecrets['camillaBrainApiKey'] ? 'Ocultar' : 'Exibir'}</span>
                        </button>
                      </div>
                      <input
                        type={showSecrets['camillaBrainApiKey'] ? 'text' : 'password'}
                        value={systemKeys.camillaBrainApiKey}
                        onChange={(e) => setSystemKeys({ ...systemKeys, camillaBrainApiKey: e.target.value })}
                        placeholder="camilla_brain_sec_..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Camilla Endpoint */}
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Endpoint Gateway da Camilla</label>
                      <input
                        type="text"
                        value={systemKeys.camillaDomain}
                        onChange={(e) => setSystemKeys({ ...systemKeys, camillaDomain: e.target.value })}
                        placeholder="https://camilla.grupoeloizio.com.br"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* WhatsApp API Token */}
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">WhatsApp Baileys Token / Secret</label>
                      <input
                        type="text"
                        value={systemKeys.whatsappToken}
                        onChange={(e) => setSystemKeys({ ...systemKeys, whatsappToken: e.target.value })}
                        placeholder="wa_token_..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Baileys Instance Endpoint */}
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">URL da Instância Baileys</label>
                      <input
                        type="text"
                        value={systemKeys.baileysEndpoint}
                        onChange={(e) => setSystemKeys({ ...systemKeys, baileysEndpoint: e.target.value })}
                        placeholder="https://elowa.grupoeloizio.com.br"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">CEO WhatsApp: <strong className="text-white">21 987648727 (Eloizio)</strong></span>
                  <button
                    onClick={() => handleTestEndpoint(systemKeys.camillaDomain || '/api/health', 'camilla')}
                    disabled={isTesting}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>Testar Conexão</span>
                  </button>
                </div>
              </div>

              {/* 3. POSTGRESQL 16 UNIFICADO */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
                        PG
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-white">
                          PostgreSQL 16 (Banco Unificado)
                        </h3>
                        <span className="text-[10px] text-blue-400">postgres://postgres:5432/grupoeloizio</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Tabelas Ativas
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Host do Banco</label>
                      <input
                        type="text"
                        value={systemKeys.pgHost}
                        onChange={(e) => setSystemKeys({ ...systemKeys, pgHost: e.target.value })}
                        placeholder="localhost ou postgres"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Porta</label>
                      <input
                        type="number"
                        value={systemKeys.pgPort}
                        onChange={(e) => setSystemKeys({ ...systemKeys, pgPort: parseInt(e.target.value, 10) || 5432 })}
                        placeholder="5432"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Nome do Banco</label>
                      <input
                        type="text"
                        value={systemKeys.pgDb}
                        onChange={(e) => setSystemKeys({ ...systemKeys, pgDb: e.target.value })}
                        placeholder="grupoeloizio"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Usuário</label>
                      <input
                        type="text"
                        value={systemKeys.pgUser}
                        onChange={(e) => setSystemKeys({ ...systemKeys, pgUser: e.target.value })}
                        placeholder="postgres"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-medium">Senha do PostgreSQL</label>
                      <button
                        type="button"
                        onClick={() => toggleShowSecret('pgPass')}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {showSecrets['pgPass'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['pgPass'] ? 'Ocultar' : 'Exibir'}</span>
                      </button>
                    </div>
                    <input
                      type={showSecrets['pgPass'] ? 'text' : 'password'}
                      value={systemKeys.pgPass}
                      onChange={(e) => setSystemKeys({ ...systemKeys, pgPass: e.target.value })}
                      placeholder="Senha do banco..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tabelas: <code className="text-cyan-300">clientes, conversas, cerebro_camilla, servicos</code></span>
                  <button
                    onClick={() => handleCopy(`postgres://${systemKeys.pgUser}:${systemKeys.pgPass}@${systemKeys.pgHost}:${systemKeys.pgPort}/${systemKeys.pgDb}`, 'dbUrl')}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'dbUrl' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar URL</span>
                  </button>
                </div>
              </div>

              {/* 4. HOSTINGER SMTP & ELOMAIL */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xs">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-white">
                          Hostinger SMTP & EloMail Gateway
                        </h3>
                        <span className="text-[10px] text-rose-400">Disparo Transacional & Geração de PDF</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      SSL 465
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Host SMTP</label>
                      <input
                        type="text"
                        value={systemKeys.smtpHost}
                        onChange={(e) => setSystemKeys({ ...systemKeys, smtpHost: e.target.value })}
                        placeholder="smtp.hostinger.com"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Porta (465 SSL / 587 TLS)</label>
                      <input
                        type="number"
                        value={systemKeys.smtpPort}
                        onChange={(e) => setSystemKeys({ ...systemKeys, smtpPort: parseInt(e.target.value, 10) || 465 })}
                        placeholder="465"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">E-mail Remetente</label>
                      <input
                        type="email"
                        value={systemKeys.smtpUser}
                        onChange={(e) => setSystemKeys({ ...systemKeys, smtpUser: e.target.value })}
                        placeholder="contato@grupoeloizio.com.br"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-medium block mb-1">Chave Mestra (x-api-key)</label>
                      <input
                        type="text"
                        value={systemKeys.apiKeyMaster}
                        onChange={(e) => setSystemKeys({ ...systemKeys, apiKeyMaster: e.target.value })}
                        placeholder="elo_master_key_..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-medium">Senha do E-mail Hostinger</label>
                      <button
                        type="button"
                        onClick={() => toggleShowSecret('smtpPass')}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {showSecrets['smtpPass'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['smtpPass'] ? 'Ocultar' : 'Exibir'}</span>
                      </button>
                    </div>
                    <input
                      type={showSecrets['smtpPass'] ? 'text' : 'password'}
                      value={systemKeys.smtpPass}
                      onChange={(e) => setSystemKeys({ ...systemKeys, smtpPass: e.target.value })}
                      placeholder="Senha da caixa postal..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Endpoint: <code className="text-rose-300">mail.grupoeloizio.com.br</code></span>
                  <button
                    onClick={() => handleCopy(systemKeys.apiKeyMaster, 'apiKeyMaster')}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'apiKeyMaster' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar x-api-key</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ACRESCENTAR & GERENCIAR SERVIÇOS
        ========================================================================= */}
        {activeTab === 'servicos' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header & Mode Switcher */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Expansão de Faturamento & Catálogo</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mt-1">
                  Acrescentar Novos Serviços do Grupo Eloizio
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Cadastre novos produtos, serviços ou cursos que você passará a oferecer. Eles aparecem imediatamente no Mini
                  Shopping, na triagem da Camilla e são integrados ao checkout do Mercado Pago.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingServiceId(null);
                    setServiceForm(emptyServiceForm);
                    setServiceFormMode('adicionar');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    serviceFormMode === 'adicionar' && !editingServiceId
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Criar Novo Serviço</span>
                </button>

                <button
                  onClick={() => setServiceFormMode('listar')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    serviceFormMode === 'listar'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span>Ver Catálogo Ativo ({services.length})</span>
                </button>
              </div>
            </div>

            {/* FORMULÁRIO DE NOVO SERVIÇO COM PREVIEW EM TEMPO REAL */}
            {serviceFormMode === 'adicionar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Col */}
                <div className="lg:col-span-7 bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        {editingServiceId ? <Edit3 className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
                        <span>{editingServiceId ? 'Editar Serviço Existente' : 'Formulário de Cadastro de Novo Serviço'}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Preencha as informações comerciais. O preview ao lado é atualizado em tempo real.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setServiceFormMode('listar');
                        setEditingServiceId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-5 text-xs">
                    {/* Pilar / Marca do Serviço */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-2">
                        Pilar de Atuação / Marca Oficial:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'elomak', label: 'EloMak Máquinas', desc: 'Mecânica e Reforma SG', color: 'border-amber-500/40 text-amber-300' },
                          { id: 'vanguard', label: 'Vanguard Cursos', desc: 'Educação 100% Online', color: 'border-emerald-500/40 text-emerald-300' },
                          { id: 'elocontabil', label: 'Elo Contábil', desc: 'BPO & RH sem CRC', color: 'border-sky-500/40 text-sky-300' },
                          { id: 'elosign', label: 'EloSign', desc: 'Assinatura Jurídica', color: 'border-indigo-500/40 text-indigo-300' },
                          { id: 'eloautentico', label: 'EloAutêntico', desc: 'Validação Forense', color: 'border-purple-500/40 text-purple-300' },
                          { id: 'saas', label: 'SaaS & Automação', desc: 'Novos Softwares/Serviços', color: 'border-cyan-500/40 text-cyan-300' }
                        ].map((brand) => (
                          <button
                            key={brand.id}
                            type="button"
                            onClick={() => setServiceForm({ ...serviceForm, marca: brand.id as ServiceBrand })}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              serviceForm.marca === brand.id
                                ? `bg-white/10 ${brand.color} shadow-sm ring-1 ring-white/20`
                                : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            <span className="font-bold block text-white text-[11px] leading-tight">{brand.label}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{brand.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Título do Serviço */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Título do Serviço ou Produto <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={serviceForm.titulo}
                        onChange={(e) => setServiceForm({ ...serviceForm, titulo: e.target.value })}
                        placeholder="Ex: Manutenção Preventiva de Reta Industrial / BPO Financeiro PME"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Subtítulo / Proposta de Valor Rápida */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Subtítulo Persuasivo (Gancho Rápido)
                      </label>
                      <input
                        type="text"
                        value={serviceForm.subtitulo}
                        onChange={(e) => setServiceForm({ ...serviceForm, subtitulo: e.target.value })}
                        placeholder="Ex: Volte a produzir hoje mesmo sem danificar tecidos ou perder prazos"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Descrição Detalhada */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Descrição Comercial Detalhada (O Porquê contratar)
                      </label>
                      <textarea
                        rows={3}
                        value={serviceForm.descricao}
                        onChange={(e) => setServiceForm({ ...serviceForm, descricao: e.target.value })}
                        placeholder="Explique a solução, para quem serve e a transformação concreta gerada no negócio do cliente..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                      />
                    </div>

                    {/* Preço e Modalidade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Condição / Preço de Venda
                        </label>
                        <input
                          type="text"
                          value={serviceForm.precoTexto}
                          onChange={(e) => setServiceForm({ ...serviceForm, precoTexto: e.target.value })}
                          placeholder="Ex: A partir de R$ 97,00 ou 12x de R$ 29,90"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Modalidade de Entrega
                        </label>
                        <select
                          value={serviceForm.modalidade || 'presencial'}
                          onChange={(e) => setServiceForm({ ...serviceForm, modalidade: e.target.value as any })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        >
                          <option value="presencial">Presencial (São Gonçalo / RJ e Região)</option>
                          <option value="online">100% Online (Todo o Brasil)</option>
                          <option value="hibrido">Híbrido (Online + Presencial)</option>
                        </select>
                      </div>
                    </div>

                    {/* Badge e Link de Destino */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Badge de Destaque no Card
                        </label>
                        <input
                          type="text"
                          value={serviceForm.badge}
                          onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                          placeholder="Ex: Mais Procurado, Orçamento Grátis, 100% Online"
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">
                          Ordem de Exibição no Catálogo
                        </label>
                        <input
                          type="number"
                          value={serviceForm.ordem}
                          onChange={(e) => setServiceForm({ ...serviceForm, ordem: parseInt(e.target.value, 10) || 1 })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Link de Destino / Checkout */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Link de Destino / Checkout do Mercado Pago / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={serviceForm.linkDestino}
                        onChange={(e) => setServiceForm({ ...serviceForm, linkDestino: e.target.value })}
                        placeholder={`https://mpago.la/... ou https://wa.me/${config.camillaWhatsApp}`}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Insira aqui o link de pagamento gerado no Mercado Pago ou deixe o link do WhatsApp com a Camilla.
                      </span>
                    </div>

                    {/* Benefícios Inclusos (Lista Dinâmica) */}
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Benefícios Inclusos (O Pra Quê serve na prática)
                      </label>
                      <div className="space-y-2 mb-2">
                        {serviceForm.beneficios.map((beneficio, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>{beneficio}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBenefit(idx)}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                              title="Remover benefício"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add benefit input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newBenefitText}
                          onChange={(e) => setNewBenefitText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddBenefit();
                            }
                          }}
                          placeholder="Adicionar novo benefício (Ex: Garantia 90 dias, Suporte VIP)..."
                          className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={handleAddBenefit}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="disponivelCheck"
                          checked={serviceForm.disponivel}
                          onChange={(e) => setServiceForm({ ...serviceForm, disponivel: e.target.checked })}
                          className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-white/20 cursor-pointer"
                        />
                        <label htmlFor="disponivelCheck" className="text-slate-300 font-medium cursor-pointer">
                          Serviço ativo e visível no Mini Shopping
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingServiceId ? 'Atualizar Serviço' : 'Salvar no Catálogo'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Preview Col */}
                <div className="lg:col-span-5 sticky top-28">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pré-Visualização em Tempo Real</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Como o cliente verá no site</span>
                  </div>

                  {/* Render simulated Card */}
                  <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/40 overflow-hidden shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
                    <div className="relative">
                      <ServiceIllustration marca={serviceForm.marca} />
                      <div className="absolute top-3 left-3 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-cyan-500/40 bg-slate-950/80 text-cyan-300">
                          {serviceForm.badge || 'Destaque'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-20">
                        <span className="text-[10px] text-slate-300 bg-slate-950/90 px-2 py-0.5 rounded border border-white/10">
                          {getBrandBadge(serviceForm.marca).label}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <h3 className="font-display text-lg font-bold text-white leading-snug">
                        {serviceForm.titulo || 'Nome do Novo Serviço'}
                      </h3>
                      <p className="text-xs text-cyan-300 font-medium mt-1">
                        {serviceForm.subtitulo || 'Subtítulo persuasivo com benefícios'}
                      </p>

                      <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                        {serviceForm.descricao || 'Descrição detalhada do serviço oferecido...'}
                      </p>

                      {/* Pra Quê Serve */}
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                          Pra quê serve na prática:
                        </span>
                        {serviceForm.beneficios.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{b}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price box */}
                      <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                          Condição Comercial
                        </div>
                        <div className="text-xs font-bold text-white font-mono">
                          {serviceForm.precoTexto || 'Sob Consulta'}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <button
                          type="button"
                          className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                          <span>Acessar via Camilla</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LISTAGEM E GESTÃO DOS SERVIÇOS CADASTRADOS */}
            {serviceFormMode === 'listar' && (
              <div className="space-y-6">
                {/* Brand Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { id: 'todos', label: 'Todos os Serviços' },
                      { id: 'elomak', label: 'EloMak (Máquinas)' },
                      { id: 'vanguard', label: 'Vanguard (Cursos)' },
                      { id: 'elocontabil', label: 'Elo Contábil (BPO/RH)' },
                      { id: 'elosign', label: 'EloSign' },
                      { id: 'eloautentico', label: 'EloAutêntico' },
                      { id: 'saas', label: 'SaaS & Automação' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setServicesFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          servicesFilter === f.id
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-slate-400">
                    Mostrando <strong>{filteredServices.length}</strong> de {services.length} serviços
                  </span>
                </div>

                {/* Services Table / Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredServices.map((service) => {
                    const badge = getBrandBadge(service.marca);
                    return (
                      <div
                        key={service.id}
                        className={`p-5 rounded-2xl bg-slate-900/70 border transition-all flex flex-col justify-between ${
                          service.disponivel
                            ? 'border-white/10 hover:border-cyan-500/40'
                            : 'border-red-500/20 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{service.ordem}
                            </span>
                          </div>

                          <h4 className="font-display font-bold text-white text-base leading-snug">
                            {service.titulo}
                          </h4>
                          <p className="text-xs text-cyan-300 font-medium mt-1">
                            {service.subtitulo}
                          </p>

                          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {service.descricao}
                          </p>

                          <div className="mt-4 p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-400">Preço:</span>
                            <strong className="text-white font-mono">{service.precoTexto}</strong>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailable(service)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                              service.disponivel
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            }`}
                          >
                            {service.disponivel ? '● Ativo no Site' : '○ Pausado'}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDuplicate(service)}
                              title="Duplicar Serviço"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(service)}
                              title="Editar Serviço"
                              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id, service.titulo)}
                              title="Excluir Serviço"
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: CÓDIGOS DE RASTREAMENTO & SCRIPTS
        ========================================================================= */}
        {activeTab === 'codigos' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/30 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <Code2 className="w-4 h-4" />
                  <span>Rastreamento & Conversão Avançada</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mt-1">
                  Códigos de Rastreamento, Pixels & Webhooks de Leads
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Adicione IDs de rastreamento do Google, Meta Ads e webhooks para automatizar o envio imediato de cada
                  lead capturado pela Camilla para o seu n8n, CRM ou planilha.
                </p>
              </div>

              <button
                onClick={handleSaveKeys}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-white transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Códigos</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Google Tag Manager */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Google Tag Manager (GTM)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Insira o ID do seu container do GTM para gerenciar todas as tags em um único local.
                </p>
                <input
                  type="text"
                  value={systemKeys.gtmId}
                  onChange={(e) => setSystemKeys({ ...systemKeys, gtmId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Meta Pixel */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span>Meta Pixel (Facebook & Instagram Ads)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  ID do Pixel para mensurar conversões de tráfego pago nos anúncios de São Gonçalo e todo Brasil.
                </p>
                <input
                  type="text"
                  value={systemKeys.metaPixelId}
                  onChange={(e) => setSystemKeys({ ...systemKeys, metaPixelId: e.target.value })}
                  placeholder="Ex: 987654321098765"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Webhook de Novos Leads */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Webhook Global de Leads (n8n / Make / Zapier)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Disparo Automático HTTP POST
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Toda vez que um cliente solicitar contato ou preencher o formulário da Camilla, os dados completos
                  (nome, WhatsApp, serviço e detalhes) serão enviados em JSON para esta URL.
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={systemKeys.leadWebhookUrl}
                    onChange={(e) => setSystemKeys({ ...systemKeys, leadWebhookUrl: e.target.value })}
                    placeholder="https://n8n.grupoeloizio.com.br/webhook/leads-grupoeloizio"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleTestEndpoint(systemKeys.leadWebhookUrl || '/api/health', 'webhook')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Testar Disparo</span>
                  </button>
                </div>
              </div>

              {/* Custom Head Scripts */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3 md:col-span-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>Scripts Customizados para o &lt;head&gt; (HTML / JS)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Tags personalizadas de verificação do Google Search Console, scripts de chat ou estilos CSS extras.
                </p>
                <textarea
                  rows={4}
                  value={systemKeys.customHeadScripts}
                  onChange={(e) => setSystemKeys({ ...systemKeys, customHeadScripts: e.target.value })}
                  placeholder={`<!-- Exemplo: -->\n<meta name="google-site-verification" content="..." />`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SUBDOMÍNIOS & ECOSSISTEMA
        ========================================================================= */}
        {activeTab === 'subdominios' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
              <h2 className="text-base sm:text-xl font-bold text-white">
                Os 8 Subdomínios do Ecossistema Grupo Eloizio
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Arquitetura em cluster com Traefik Reverse Proxy, certificados SSL Let's Encrypt automáticos e roteamento limpo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { domain: 'grupoeloizio.com.br', name: 'Hub Central & Mini Shopping', desc: 'Portal oficial, triagem com Camilla e vitrine de oportunidades.', status: 'Online' },
                { domain: 'elomak.grupoeloizio.com.br', name: 'EloMak Máquinas de Costura', desc: 'Compra, venda, reforma e peças em São Gonçalo - RJ e região.', status: 'Online' },
                { domain: 'vanguard.grupoeloizio.com.br', name: 'Vanguard Cursos Livres', desc: 'Formação executiva e cursos profissionalizantes de alta vendabilidade.', status: 'Online' },
                { domain: 'elocontabil.grupoeloizio.com.br', name: 'Elo Contábil Digital', desc: 'BPO Financeiro e rotinas de RH sem exigência de CRC.', status: 'Online' },
                { domain: 'camilla.grupoeloizio.com.br', name: 'Camilla Brain & Triage', desc: 'Cérebro inteligente com análise multimídia e encaminhamento.', status: 'Online' },
                { domain: 'mail.grupoeloizio.com.br', name: 'EloMail Gateway', desc: 'Disparo transacional com geração dinâmica de PDF.', status: 'Online' },
                { domain: 'valida.grupoeloizio.com.br', name: 'EloAutêntico', desc: 'Validação jurídica e consulta pública de hashes SHA-256.', status: 'Online' },
                { domain: 'sign.grupoeloizio.com.br', name: 'EloSign Enterprise', desc: 'Assinatura eletrônica avançada (Lei 14.063/2020).', status: 'Online' }
              ].map((sub, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-cyan-300 font-bold block text-sm">{sub.domain}</span>
                    <strong className="text-white block mt-0.5">{sub.name}</strong>
                    <p className="text-slate-400 text-[11px] mt-1">{sub.desc}</p>
                  </div>
                  <a
                    href={`https://${sub.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 transition-colors shrink-0"
                    title="Visitar Subdomínio"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: DOCKER STACK, .ENV & MANUAL PDF
        ========================================================================= */}
        {activeTab === 'gerador_env' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Action Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/40 border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Server className="w-4 h-4" />
                  <span>Publicação Oficial em Contêineres</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white mt-1">
                  Manual de Configuração Docker & Publicação do Grupo Eloizio
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Stack orquestrada com Traefik (SSL automático), Apache PHP 8.2 (com driver PDO_PGSQL) e PostgreSQL 16
                  com volume persistente para os arquivos publicados em <code className="text-cyan-300 font-mono">./php-dist:/var/www/html</code>.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <a
                  href="/api/manual-docker-pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>🖨️ Abrir / Baixar Manual em PDF</span>
                </a>
              </div>
            </div>

            {/* Passo a Passo Rápido de Instalação */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Passo a Passo de Instalação e Inicialização no Servidor (VPS Ubuntu / Debian)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="font-bold text-cyan-400 block text-xs">1. Conectar e Preparar Pastas</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Crie o diretório oficial da aplicação no servidor:
                  </p>
                  <code className="text-[11px] text-cyan-300 block bg-slate-950 p-2 rounded border border-white/5 font-mono">
                    mkdir -p /var/www/grupoeloizio/php-dist
                  </code>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="font-bold text-emerald-400 block text-xs">2. Subir os Arquivos do Site</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Coloque os arquivos descompactados dentro da pasta mapeada:
                  </p>
                  <code className="text-[11px] text-emerald-300 block bg-slate-950 p-2 rounded border border-white/5 font-mono">
                    /var/www/grupoeloizio/php-dist/
                  </code>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <span className="font-bold text-purple-400 block text-xs">3. Subir os Contêineres</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Execute o comando único de inicialização:
                  </p>
                  <code className="text-[11px] text-purple-300 block bg-slate-950 p-2 rounded border border-white/5 font-mono">
                    docker compose up -d --build
                  </code>
                </div>
              </div>
            </div>

            {/* Quick Copy Buttons for all files */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy(generatedDockerCompose, 'dockerCompose')}
                className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-500/30"
              >
                {copiedKey === 'dockerCompose' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar docker-compose.yml</span>
              </button>

              <button
                onClick={() => handleCopy(generatedDockerfile, 'dockerFile')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
              >
                {copiedKey === 'dockerFile' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Dockerfile</span>
              </button>

              <button
                onClick={() => handleCopy(generatedEnv, 'envFile')}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-cyan-500/30"
              >
                {copiedKey === 'envFile' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar .env</span>
              </button>

              <button
                onClick={() => handleCopy(generatedPhpConfig, 'phpFile')}
                className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-purple-500/30"
              >
                {copiedKey === 'phpFile' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar config.php</span>
              </button>
            </div>

            {/* Grid com os 4 arquivos essenciais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
              {/* 1. docker-compose.yml Preview */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-slate-300 font-sans font-bold">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>docker-compose.yml (Orquestrador)</span>
                  </div>
                  <span className="text-[10px] text-blue-400">Traefik + Web + PostgreSQL</span>
                </div>
                <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre p-3 rounded-xl bg-slate-950 border border-white/5 flex-1 max-h-[380px]">
                  {generatedDockerCompose}
                </pre>
              </div>

              {/* 2. Dockerfile Preview */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-slate-300 font-sans font-bold">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Dockerfile (Apache + PHP 8.2 + PDO_PGSQL)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Com Drivers Instalados</span>
                </div>
                <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre p-3 rounded-xl bg-slate-950 border border-white/5 flex-1 max-h-[380px]">
                  {generatedDockerfile}
                </pre>
              </div>

              {/* 3. .env Preview */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-slate-300 font-sans font-bold">
                  <span>Arquivo .env (Chaves & Credenciais)</span>
                  <span className="text-[10px] text-cyan-400">Variáveis do Contêiner</span>
                </div>
                <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre p-3 rounded-xl bg-slate-950 border border-white/5 flex-1 max-h-[340px]">
                  {generatedEnv}
                </pre>
              </div>

              {/* 4. config.php Preview */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-slate-300 font-sans font-bold">
                  <span>Arquivo config.php (Hostinger Apache / PHP 8.2)</span>
                  <span className="text-[10px] text-purple-400">Hostinger Dist</span>
                </div>
                <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre p-3 rounded-xl bg-slate-950 border border-white/5 flex-1 max-h-[340px]">
                  {generatedPhpConfig}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
