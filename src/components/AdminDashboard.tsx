import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  Server,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Eye,
  Sliders,
  FileCode,
  Database,
  KeyRound
} from 'lucide-react';
import { Lead, ServiceBrand, ServiceItem, SiteConfig, Testimonial } from '../types';
import { DatabaseApiManager } from './DatabaseApiManager';

interface AdminDashboardProps {
  config: SiteConfig;
  services: ServiceItem[];
  leads: Lead[];
  testimonials: Testimonial[];
  apiHealth?: any;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  onUpdateServices: (services: ServiceItem[]) => void;
  onUpdateLeads: (leads: Lead[]) => void;
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  onResetDefaults: () => void;
  onCloseAdmin: () => void;
  onOpenConfig?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  services,
  leads,
  testimonials,
  apiHealth,
  onUpdateConfig,
  onUpdateServices,
  onUpdateLeads,
  onUpdateTestimonials,
  onResetDefaults,
  onCloseAdmin,
  onOpenConfig
}) => {
  const [activeTab, setActiveTab] = useState<
    'metricas' | 'banco_api' | 'leads' | 'catalogo' | 'seo' | 'depoimentos' | 'hostinger'
  >('metricas');

  // Form states for SEO & Config
  const [formConfig, setFormConfig] = useState<SiteConfig>(config);
  const [configSaved, setConfigSaved] = useState(false);

  // Leads filter & search
  const [leadSearch, setLeadSearch] = useState('');
  const [leadBrandFilter, setLeadBrandFilter] = useState<string>('todos');

  // New Service Form State
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    marca: 'elomak',
    titulo: '',
    subtitulo: '',
    descricao: '',
    beneficios: ['Orçamento sem compromisso', 'Garantia de serviço'],
    precoTexto: 'Sob consulta',
    badge: 'Atendimento São Gonçalo',
    linkDestino: 'https://wa.me/5521996134073',
    disponivel: true,
    ordem: services.length + 1
  });

  // New Testimonial Form State
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    nome: '',
    localidadeEmpresa: 'São Gonçalo - RJ',
    texto: '',
    rating: 5,
    tagServico: 'EloMak',
    resultadoConcreto: 'Atendimento rápido e sem burocracia'
  });

  // Hostinger copy indicator
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formConfig);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  const handleLeadStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l));
    onUpdateLeads(updated);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Deseja excluir este registro de lead?')) {
      onUpdateLeads(leads.filter((l) => l.id !== leadId));
    }
  };

  const handleExportLeadsCSV = () => {
    const headers = ['ID', 'Nome', 'WhatsApp', 'Email', 'Servico de Interesse', 'Marca', 'Data/Hora', 'Status', 'Observacao'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.nome.replace(/"/g, '""')}"`,
      `"${l.whatsapp}"`,
      `"${l.email || ''}"`,
      `"${l.servicoInteresse.replace(/"/g, '""')}"`,
      l.marca,
      l.dataHora,
      l.status,
      `"${(l.observacao || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_hub_elo_vanguard_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.titulo || !newService.descricao) return;

    const item: ServiceItem = {
      id: `srv-${Date.now()}`,
      marca: newService.marca || 'elomak',
      titulo: newService.titulo || '',
      subtitulo: newService.subtitulo || '',
      descricao: newService.descricao || '',
      beneficios: newService.beneficios?.filter(Boolean) || ['Qualidade assegurada'],
      precoTexto: newService.precoTexto || 'Sob consulta',
      badge: newService.badge || 'Destaque',
      linkDestino: newService.linkDestino || 'https://wa.me/5521996134073',
      disponivel: true,
      ordem: services.length + 1
    };

    onUpdateServices([...services, item]);
    setIsAddingService(false);
    setNewService({
      marca: 'elomak',
      titulo: '',
      subtitulo: '',
      descricao: '',
      beneficios: ['Orçamento sem compromisso', 'Garantia de serviço'],
      precoTexto: 'Sob consulta',
      badge: 'Atendimento São Gonçalo',
      linkDestino: 'https://wa.me/5521996134073',
      disponivel: true,
      ordem: services.length + 2
    });
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Deseja remover este serviço do catálogo?')) {
      onUpdateServices(services.filter((s) => s.id !== serviceId));
    }
  };

  const handleToggleServiceDisponivel = (serviceId: string) => {
    onUpdateServices(
      services.map((s) => (s.id === serviceId ? { ...s, disponivel: !s.disponivel } : s))
    );
  };

  const handleAddTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.nome || !newTestimonial.texto) return;

    const t: Testimonial = {
      id: `t-${Date.now()}`,
      nome: newTestimonial.nome || '',
      localidadeEmpresa: newTestimonial.localidadeEmpresa || 'São Gonçalo - RJ',
      texto: newTestimonial.texto || '',
      rating: newTestimonial.rating || 5,
      tagServico: (newTestimonial.tagServico as any) || 'EloMak',
      resultadoConcreto: newTestimonial.resultadoConcreto || 'Sucesso comprovado',
      data: new Date().toLocaleDateString('pt-BR')
    };

    onUpdateTestimonials([t, ...testimonials]);
    setIsAddingTestimonial(false);
    setNewTestimonial({
      nome: '',
      localidadeEmpresa: 'São Gonçalo - RJ',
      texto: '',
      rating: 5,
      tagServico: 'EloMak',
      resultadoConcreto: 'Atendimento rápido e sem burocracia'
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Excluir este depoimento?')) {
      onUpdateTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Hostinger PHP & SQL scripts
  const sqlScript = `-- BANCO DE DADOS UNIFICADO (HOSTINGER VPS KVM2)
CREATE DATABASE IF NOT EXISTS hub_servicos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hub_servicos;

CREATE TABLE IF NOT EXISTS configuracoes (
    id INT PRIMARY KEY DEFAULT 1,
    site_titulo VARCHAR(150),
    site_descricao TEXT,
    site_keywords TEXT,
    cor_primaria VARCHAR(10) DEFAULT '#00f2fe',
    cor_secundaria VARCHAR(10) DEFAULT '#4facfe',
    cor_fundo VARCHAR(10) DEFAULT '#080b11',
    home_h1 VARCHAR(255),
    home_subtitulo TEXT,
    camilla_whatsapp VARCHAR(25) DEFAULT '5521996134073',
    aviso_urgencia VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca ENUM('elomak', 'vanguard', 'elocontabil') NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    subtitulo VARCHAR(255),
    descricao TEXT,
    beneficios JSON,
    preco_texto VARCHAR(100),
    badge VARCHAR(80),
    link_destino VARCHAR(255),
    disponivel TINYINT(1) DEFAULT 1,
    ordem INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    email VARCHAR(120),
    servico_interesse VARCHAR(150),
    marca VARCHAR(30),
    status VARCHAR(30) DEFAULT 'novo',
    observacao TEXT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS depoimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localidade_empresa VARCHAR(150),
    texto TEXT NOT NULL,
    rating INT DEFAULT 5,
    tag_servico VARCHAR(50),
    resultado_concreto VARCHAR(150),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  const configPhp = `<?php
/**
 * Conexão com MySQL / MariaDB no VPS Hostinger KVM2
 */
$host = 'localhost';
$dbname = 'hub_servicos';
$username = 'u_hub_admin'; // Substitua pelo usuário criado no MySQL
$password = 'SUA_SENHA_FORTE_AQUI'; // Substitua pela sua senha

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Erro na conexão com o banco de dados: " . $e->getMessage());
}
`;

  const htaccessContent = `# HOSTINGER VPS KVM2 - OTIMIZAÇÃO, GZIP, WEBP & SEGURANÇA
RewriteEngine On

# Forçar HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Habilitar Compressão Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Caching de Imagens e Assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Proteção contra SQL Injection e Bad Bots
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"`;

  const ajaxLeadPhp = `<?php
require 'config.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $whatsapp = trim($_POST['whatsapp'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $servico = trim($_POST['servico'] ?? '');
    $marca = trim($_POST['marca'] ?? 'elocontabil');
    $observacao = trim($_POST['observacao'] ?? '');

    if (empty($nome) || empty($whatsapp)) {
        echo json_encode(['status' => 'error', 'message' => 'Nome e WhatsApp são obrigatórios.']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO leads (nome, whatsapp, email, servico_interesse, marca, observacao) VALUES (?, ?, ?, ?, ?, ?)");
    $ok = $stmt->execute([$nome, $whatsapp, $email, $servico, $marca, $observacao]);

    if ($ok) {
        echo json_encode(['status' => 'success', 'lead_id' => $pdo->lastInsertId()]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Falha ao gravar no banco.']);
    }
}
`;

  const installPhp = `<?php
/**
 * INSTALADOR AUTOMATIZADO - HUB ELO & VANGUARD
 * Servidor: Hostinger VPS KVM2 (Debian / Ubuntu / Apache / PHP 8)
 * Domínio: grupoeloizio.com.br
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['exec_install'])) {
    $db_host = trim($_POST['db_host'] ?? 'localhost');
    $db_port = trim($_POST['db_port'] ?? '3306');
    $db_name = trim($_POST['db_name'] ?? 'hub_servicos');
    $db_user = trim($_POST['db_user'] ?? 'root');
    $db_pass = $_POST['db_pass'] ?? '';
    $admin_user = trim($_POST['admin_user'] ?? 'admin');
    $admin_pass = $_POST['admin_pass'] ?? 'eloizio2026';
    $camilla_zap = trim($_POST['camilla_zap'] ?? '5521996134073');

    try {
        $pdo = new PDO("mysql:host=$db_host;port=$db_port;charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS \`$db_name\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        $pdo->exec("USE \`$db_name\`;");

        // Cria tabelas e configurações
        $sql = file_get_contents(__DIR__ . '/hub_servicos.sql');
        if (!empty($sql)) {
            $pdo->exec($sql);
        }

        // Gera config.php
        $cfg = "<?php\\ndefine('DB_HOST', '$db_host');\\ndefine('DB_PORT', '$db_port');\\ndefine('DB_NAME', '$db_name');\\ndefine('DB_USER', '$db_user');\\ndefine('DB_PASS', '$db_pass');\\n\\ntry {\\n    \\$pdo = new PDO('mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);\\n} catch (PDOException \\$e) { die('Erro no banco: ' . \\$e->getMessage()); }\\n";
        file_put_contents(__DIR__ . '/config.php', $cfg);

        $success = "Instalação concluída com sucesso! Banco e config.php criados.";
        $step = 3;
    } catch (Exception $e) {
        $error = "Erro: " . $e->getMessage();
    }
}
?>`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
                Painel Administrativo Futurista
              </span>
              <span className="text-xs text-slate-400">· Hostinger VPS KVM2 Ready</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Controle Geral do Hub Elo & Vanguard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onOpenConfig && (
              <button
                onClick={onOpenConfig}
                className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Configuração de Códigos, Chaves e Serviços"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Chaves, Códigos & Serviços</span>
              </button>
            )}

            <button
              onClick={onResetDefaults}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Restaurar dados padrão de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar Padrões</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Site Público</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none sm:flex-wrap">
          {[
            { id: 'metricas', label: 'Visão Geral & Métricas', icon: LayoutDashboard },
            { id: 'banco_api', label: 'Banco & API REST', icon: Database },
            { id: 'leads', label: `Gestão de Leads (${leads.length})`, icon: Users },
            { id: 'catalogo', label: `Catálogo Shopping (${services.length})`, icon: ShoppingBag },
            { id: 'seo', label: 'SEO, Textos & Cores Neon', icon: Sliders },
            { id: 'depoimentos', label: `Depoimentos (${testimonials.length})`, icon: MessageSquare },
            { id: 'hostinger', label: 'Exportar PHP/VPS Hostinger', icon: Server }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[42px] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: METRICAS */}
        {activeTab === 'metricas' && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-200">
            {/* Stat Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                <span className="text-xs text-slate-400 font-semibold block">Total de Leads Capturados</span>
                <span className="font-display text-3xl font-extrabold text-cyan-400 mt-2 block font-mono tabular-nums">
                  {leads.length}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Prontos para encaminhamento</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                <span className="text-xs text-slate-400 font-semibold block">Leads EloMak (São Gonçalo)</span>
                <span className="font-display text-3xl font-extrabold text-amber-400 mt-2 block font-mono tabular-nums">
                  {leads.filter((l) => l.marca === 'elomak').length}
                </span>
                <span className="text-[11px] text-amber-300/80 mt-1 block">Manutenção & Peças industriais</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                <span className="text-xs text-slate-400 font-semibold block">Leads Vanguard Cursos</span>
                <span className="font-display text-3xl font-extrabold text-emerald-400 mt-2 block font-mono tabular-nums">
                  {leads.filter((l) => l.marca === 'vanguard').length}
                </span>
                <span className="text-[11px] text-emerald-300/80 mt-1 block">Vendas online e empregabilidade</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                <span className="text-xs text-slate-400 font-semibold block">Leads Elo Contábil Digital</span>
                <span className="font-display text-3xl font-extrabold text-sky-400 mt-2 block font-mono tabular-nums">
                  {leads.filter((l) => l.marca === 'elocontabil').length}
                </span>
                <span className="text-[11px] text-sky-300/80 mt-1 block">BPO & RH sem CRC</span>
              </div>
            </div>

            {/* PostgreSQL 16 & REST API Integration Live Status */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                    PG
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                      <span>PostgreSQL 16 Unificado (postgres:16-alpine)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        {apiHealth?.database?.connected ? 'CONECTADO NATIVO' : 'MODO RESILIENTE ATIVO'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Banco: <code className="text-cyan-300 font-mono">grupoeloizio</code> · Host: <code className="text-cyan-300 font-mono">postgres:5432</code> · Traefik: <code className="text-cyan-300 font-mono">grupoeloizio.com.br</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Tabelas Ativas:</span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                    clientes · conversas · cerebro_camilla
                  </span>
                </div>
              </div>

              {/* Endpoints REST API Map */}
              <div className="mt-4 pt-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Endpoints REST API Prontos para Integração Externa
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">GET /api/health</span>
                    <span className="text-[10px] text-slate-500">Status & DB</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">GET /api/services</span>
                    <span className="text-[10px] text-slate-500">Catálogo</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
                    <span className="text-amber-400 font-bold">POST /api/leads</span>
                    <span className="text-[10px] text-slate-500">Grava em clientes</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
                    <span className="text-purple-400 font-bold">POST /api/camilla</span>
                    <span className="text-[10px] text-slate-500">Triagem IA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Camilla Operations Status */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center font-display font-black text-xl">
                  C
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Operação de Triagem da {config.camillaNome}
                  </h3>
                  <p className="text-xs text-cyan-300">
                    WhatsApp Vinculado: (21) 99613-4073 · Status: Operacional Ativo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${config.camillaWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Testar Canal Camilla</span>
                </a>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Últimos Leads Registrados</h3>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Ver todos os {leads.length} leads →
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {leads.slice(0, 4).map((l) => (
                  <div key={l.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <strong className="text-white block">{l.nome}</strong>
                      <span className="text-slate-400 text-[11px]">
                        {l.whatsapp} · {l.servicoInteresse}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{l.dataHora}</span>
                      <span className="text-[10px] uppercase font-bold text-cyan-300">
                        {l.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.5: BANCO DE DADOS & API REST */}
        {activeTab === 'banco_api' && (
          <div className="mt-8">
            <DatabaseApiManager apiHealth={apiHealth} leadsCount={leads.length} />
          </div>
        )}

        {/* TAB 2: GESTAO DE LEADS */}
        {activeTab === 'leads' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Filtrar por nome ou WhatsApp..."
                  className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs w-64 focus:outline-none focus:border-cyan-400"
                />

                <select
                  value={leadBrandFilter}
                  onChange={(e) => setLeadBrandFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="todos">Todas as Marcas</option>
                  <option value="elomak">EloMak (São Gonçalo)</option>
                  <option value="vanguard">Vanguard Cursos</option>
                  <option value="elocontabil">Elo Contábil Digital</option>
                </select>
              </div>

              <button
                onClick={handleExportLeadsCSV}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Leads (Excel / CSV)</span>
              </button>
            </div>

            {/* Leads Table */}
            <div className="rounded-2xl bg-slate-900 border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-4">Cliente / Contato</th>
                    <th className="p-4">Serviço de Interesse</th>
                    <th className="p-4">Marca</th>
                    <th className="p-4">Data / Hora</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads
                    .filter((l) => (leadBrandFilter === 'todos' ? true : l.marca === leadBrandFilter))
                    .filter(
                      (l) =>
                        !leadSearch ||
                        l.nome.toLowerCase().includes(leadSearch.toLowerCase()) ||
                        l.whatsapp.includes(leadSearch) ||
                        l.servicoInteresse.toLowerCase().includes(leadSearch.toLowerCase())
                    )
                    .map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <strong className="text-white block font-medium">{lead.nome}</strong>
                          <span className="text-slate-400 block text-[11px]">{lead.whatsapp}</span>
                          {lead.email && (
                            <span className="text-slate-500 block text-[10px]">{lead.email}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-slate-200 block max-w-xs">{lead.servicoInteresse}</span>
                          {lead.observacao && (
                            <span className="text-[10px] text-cyan-300/80 italic block mt-0.5">
                              "{lead.observacao}"
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              lead.marca === 'elomak'
                                ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                                : lead.marca === 'vanguard'
                                ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                                : 'text-sky-400 bg-sky-950/40 border border-sky-500/30'
                            }`}
                          >
                            {lead.marca}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">{lead.dataHora}</td>
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleLeadStatusChange(lead.id, e.target.value as Lead['status'])
                            }
                            className="bg-slate-950 border border-white/10 text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-cyan-400"
                          >
                            <option value="novo">Novo</option>
                            <option value="em_atendimento">Em Atendimento</option>
                            <option value="convertido">Convertido</option>
                            <option value="arquivado">Arquivado</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Olá ${lead.nome}, sou a Camilla do Grupo Elo & Vanguard. Vi seu interesse no serviço "${lead.servicoInteresse}". Como posso te ajudar hoje?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                              title="Chamar cliente no WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors cursor-pointer"
                              title="Excluir Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATALOGO SHOPPING */}
        {activeTab === 'catalogo' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Itens da Vitrine (Mini Shopping)</h3>
                <p className="text-xs text-slate-400">
                  Adicione, edite ou altere preços e disponibilidade dos serviços exibidos ao público.
                </p>
              </div>

              <button
                onClick={() => setIsAddingService(!isAddingService)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingService ? 'Cancelar' : 'Novo Serviço'}</span>
              </button>
            </div>

            {/* Add Service Modal/Card */}
            {isAddingService && (
              <form
                onSubmit={handleAddServiceSubmit}
                className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4"
              >
                <h4 className="font-bold text-white text-sm">Cadastrar Novo Serviço na Vitrine</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Marca / Setor</label>
                    <select
                      value={newService.marca}
                      onChange={(e) =>
                        setNewService({ ...newService, marca: e.target.value as ServiceBrand })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    >
                      <option value="elomak">EloMak (São Gonçalo - RJ)</option>
                      <option value="vanguard">Vanguard (Cursos Online)</option>
                      <option value="elocontabil">Elo Contábil (BPO / RH)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Título do Serviço</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Reforma de Pespontadeira"
                      value={newService.titulo}
                      onChange={(e) => setNewService({ ...newService, titulo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Subtítulo Técnico</label>
                    <input
                      type="text"
                      placeholder="Ex: Regulagem micrométrica de ponto"
                      value={newService.subtitulo}
                      onChange={(e) => setNewService({ ...newService, subtitulo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    required
                    value={newService.descricao}
                    onChange={(e) => setNewService({ ...newService, descricao: e.target.value })}
                    placeholder="Descrição atrativa com foco na solução do cliente..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Texto de Preço</label>
                    <input
                      type="text"
                      value={newService.precoTexto}
                      onChange={(e) => setNewService({ ...newService, precoTexto: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Selo / Badge</label>
                    <input
                      type="text"
                      value={newService.badge}
                      onChange={(e) => setNewService({ ...newService, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Link de Destino Final</label>
                    <input
                      type="text"
                      value={newService.linkDestino}
                      onChange={(e) => setNewService({ ...newService, linkDestino: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Salvar e Publicar no Mini Shopping
                </button>
              </form>
            )}

            {/* List of Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-slate-900 border transition-all ${
                    item.disponivel ? 'border-white/10' : 'border-rose-500/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.marca === 'elomak'
                          ? 'text-amber-400 bg-amber-950/40'
                          : item.marca === 'vanguard'
                          ? 'text-emerald-400 bg-emerald-950/40'
                          : 'text-sky-400 bg-sky-950/40'
                      }`}
                    >
                      {item.marca}
                    </span>

                    <button
                      onClick={() => handleToggleServiceDisponivel(item.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                        item.disponivel
                          ? 'text-emerald-400 bg-emerald-950/50'
                          : 'text-rose-400 bg-rose-950/50'
                      }`}
                    >
                      {item.disponivel ? '● Ativo' : '○ Pausado'}
                    </button>
                  </div>

                  <h4 className="font-bold text-white text-sm mt-1">{item.titulo}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.descricao}</p>
                  <span className="text-xs text-cyan-300 font-bold block mt-3 font-mono">
                    {item.precoTexto}
                  </span>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">{item.badge}</span>
                    <button
                      onClick={() => handleDeleteService(item.id)}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                      title="Excluir serviço"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SEO, TEXTOS & CORES NEON */}
        {activeTab === 'seo' && (
          <form
            onSubmit={handleSaveConfig}
            className="mt-8 space-y-6 max-w-4xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-bold text-white text-base">
                  SEO, Textos da Home & Esquema de Cores Neon
                </h3>
                <p className="text-xs text-slate-400">
                  Todas as alterações são aplicadas e salvas em tempo real no sistema.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{configSaved ? 'Configurações Salvas!' : 'Salvar Alterações'}</span>
              </button>
            </div>

            {/* SEO Section */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                1. Otimização para Motores de Busca (Google SEO & Meta Tags)
              </h4>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Título da Página (&lt;title&gt; no Google)
                </label>
                <input
                  type="text"
                  value={formConfig.siteTitulo}
                  onChange={(e) => setFormConfig({ ...formConfig, siteTitulo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Meta Descrição (Snippet nos resultados do Google)
                </label>
                <textarea
                  rows={2}
                  value={formConfig.siteDescricao}
                  onChange={(e) => setFormConfig({ ...formConfig, siteDescricao: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Palavras-chave SEO (Keywords)
                </label>
                <input
                  type="text"
                  value={formConfig.siteKeywords}
                  onChange={(e) => setFormConfig({ ...formConfig, siteKeywords: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Copywriting Home */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                2. Textos do Hero Principal & Banner de Urgência
              </h4>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Título Principal (H1 da Home)
                </label>
                <input
                  type="text"
                  value={formConfig.homeH1}
                  onChange={(e) => setFormConfig({ ...formConfig, homeH1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Subtítulo Explicativo (Proposta de Valor)
                </label>
                <textarea
                  rows={2}
                  value={formConfig.homeSubtitulo}
                  onChange={(e) => setFormConfig({ ...formConfig, homeSubtitulo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Aviso de Urgência / Condição Especial
                </label>
                <input
                  type="text"
                  value={formConfig.avisoUrgencia}
                  onChange={(e) => setFormConfig({ ...formConfig, avisoUrgencia: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Camilla Settings */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                3. Atendimento Concierge (Camilla)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nome da Atendente
                  </label>
                  <input
                    type="text"
                    value={formConfig.camillaNome}
                    onChange={(e) => setFormConfig({ ...formConfig, camillaNome: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    WhatsApp (formato internacional com 55)
                  </label>
                  <input
                    type="text"
                    value={formConfig.camillaWhatsApp}
                    onChange={(e) =>
                      setFormConfig({ ...formConfig, camillaWhatsApp: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Cargo / Título Profissional
                </label>
                <input
                  type="text"
                  value={formConfig.camillaCargo}
                  onChange={(e) => setFormConfig({ ...formConfig, camillaCargo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Neon Colors */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                4. Esquema de Cores Futuristas
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Cor Primária (Ciano Neon)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formConfig.corPrimaria}
                      onChange={(e) => setFormConfig({ ...formConfig, corPrimaria: e.target.value })}
                      className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formConfig.corPrimaria}
                      onChange={(e) => setFormConfig({ ...formConfig, corPrimaria: e.target.value })}
                      className="px-2 py-1 text-xs bg-slate-950 border border-white/10 rounded font-mono w-24 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Cor Secundária (Azul Elétrico)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formConfig.corSecundaria}
                      onChange={(e) =>
                        setFormConfig({ ...formConfig, corSecundaria: e.target.value })
                      }
                      className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formConfig.corSecundaria}
                      onChange={(e) =>
                        setFormConfig({ ...formConfig, corSecundaria: e.target.value })
                      }
                      className="px-2 py-1 text-xs bg-slate-950 border border-white/10 rounded font-mono w-24 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Cor de Fundo Escuro
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formConfig.corFundo}
                      onChange={(e) => setFormConfig({ ...formConfig, corFundo: e.target.value })}
                      className="w-10 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formConfig.corFundo}
                      onChange={(e) => setFormConfig({ ...formConfig, corFundo: e.target.value })}
                      className="px-2 py-1 text-xs bg-slate-950 border border-white/10 rounded font-mono w-24 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Todas as Configurações</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: DEPOIMENTOS */}
        {activeTab === 'depoimentos' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  Parede de Confiança (Data Trust Wall)
                </h3>
                <p className="text-xs text-slate-400">
                  Gerencie as provas sociais estratégicas focadas em São Gonçalo e alta conversão.
                </p>
              </div>

              <button
                onClick={() => setIsAddingTestimonial(!isAddingTestimonial)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingTestimonial ? 'Cancelar' : 'Novo Depoimento'}</span>
              </button>
            </div>

            {isAddingTestimonial && (
              <form
                onSubmit={handleAddTestimonialSubmit}
                className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4"
              >
                <h4 className="font-bold text-white text-sm">Registrar Nova Prova Social</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Nome do Cliente</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberto Ramos"
                      value={newTestimonial.nome}
                      onChange={(e) =>
                        setNewTestimonial({ ...newTestimonial, nome: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Empresa / Bairro</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Oficina Têxtil · Alcântara, São Gonçalo"
                      value={newTestimonial.localidadeEmpresa}
                      onChange={(e) =>
                        setNewTestimonial({ ...newTestimonial, localidadeEmpresa: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Marca Avaliada</label>
                    <select
                      value={newTestimonial.tagServico}
                      onChange={(e) =>
                        setNewTestimonial({ ...newTestimonial, tagServico: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                    >
                      <option value="EloMak">EloMak (São Gonçalo)</option>
                      <option value="Vanguard">Vanguard (Cursos Online)</option>
                      <option value="Elo Contábil">Elo Contábil Digital</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Depoimento do Cliente</label>
                  <textarea
                    rows={2}
                    required
                    value={newTestimonial.texto}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, texto: e.target.value })
                    }
                    placeholder="O que o cliente destacou sobre velocidade, orçamento ou resultado..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Resultado Concreto</label>
                  <input
                    type="text"
                    placeholder="Ex: 0 dias parados; +35% de vendas; Economia de R$ 1.800"
                    value={newTestimonial.resultadoConcreto}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, resultadoConcreto: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Publicar Prova Social
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-cyan-300">
                      {t.tagServico}
                    </span>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer p-1"
                      title="Excluir depoimento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 italic">"{t.texto}"</p>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white block">{t.nome}</strong>
                      <span className="text-[11px] text-slate-400">{t.localidadeEmpresa}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {t.resultadoConcreto}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: HOSTINGER VPS KVM2 EXPORT PACK */}
        {activeTab === 'hostinger' && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            {/* Banner de Solução do Erro 403 Forbidden */}
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                <span>⚠️ Como Resolver o Erro 403 Forbidden no Apache Debian (grupoeloizio.com.br)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                O erro <strong>403 Forbidden</strong> exibido pelo Apache acontece quando a pasta descompactada está com permissões restritas ou os arquivos foram colocados dentro de uma subpasta em vez de direto na raiz <code className="text-cyan-300">/var/www/html/</code>.
              </p>
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-cyan-300 space-y-1">
                <p># 1. No Terminal Web da Hostinger (segunda aba do seu navegador), execute:</p>
                <p className="text-emerald-400">cd /var/www/html</p>
                <p className="text-emerald-400">chown -R www-data:www-data /var/www/html</p>
                <p className="text-emerald-400">chmod -R 755 /var/www/html</p>
                <p className="text-slate-400 mt-2"># 2. Se a pasta foi descompactada dentro de uma subpasta, mova os arquivos para a raiz:</p>
                <p className="text-emerald-400">mv /var/www/html/NOME_DA_SUA_PASTA/* /var/www/html/</p>
                <p className="text-slate-400 mt-2"># 3. Acesse o instalador gráfico pelo navegador:</p>
                <p className="text-cyan-400 font-bold">http://grupoeloizio.com.br/install.php</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 text-slate-950 flex items-center justify-center font-bold">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    Pacote Pronto para Hostinger VPS KVM2 (PHP + MySQL + WebP)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Todos os arquivos gerados estão disponíveis na pasta <code className="text-cyan-300">/php-dist/</code> deste projeto prontos para rodar no seu servidor.
                  </p>
                </div>
              </div>
            </div>

            {/* Script 0: install.php */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <FileCode className="w-3.5 h-3.5" />
                  0. install.php (Instalador Web Automatizado com Interface Gráfica)
                </span>
                <button
                  onClick={() => copyToClipboard(installPhp, 'install')}
                  className="px-3 py-1 rounded-lg text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedFile === 'install' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'install' ? 'Copiado!' : 'Copiar install.php'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Coloque este arquivo em <code className="text-cyan-300">/var/www/html/install.php</code> e abra no navegador: <strong className="text-white">grupoeloizio.com.br/install.php</strong> para configurar o banco de dados com 1 clique.
              </p>
              <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-300 overflow-x-auto font-mono max-h-48">
                {installPhp}
              </pre>
            </div>

            {/* Script 1: Database SQL */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <FileCode className="w-3.5 h-3.5" />
                  1. hub_servicos.sql (Estrutura do Banco no MySQL)
                </span>
                <button
                  onClick={() => copyToClipboard(sqlScript, 'sql')}
                  className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFile === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'sql' ? 'Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-300 overflow-x-auto font-mono">
                {sqlScript}
              </pre>
            </div>

            {/* Script 2: config.php */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <FileCode className="w-3.5 h-3.5" />
                  2. config.php (Conexão PDO Segura)
                </span>
                <button
                  onClick={() => copyToClipboard(configPhp, 'config')}
                  className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFile === 'config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'config' ? 'Copiado!' : 'Copiar PHP'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-300 overflow-x-auto font-mono">
                {configPhp}
              </pre>
            </div>

            {/* Script 3: ajax_lead.php */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <FileCode className="w-3.5 h-3.5" />
                  3. ajax_lead.php (Recepção de Leads via AJAX)
                </span>
                <button
                  onClick={() => copyToClipboard(ajaxLeadPhp, 'ajax')}
                  className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFile === 'ajax' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'ajax' ? 'Copiado!' : 'Copiar PHP'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-300 overflow-x-auto font-mono">
                {ajaxLeadPhp}
              </pre>
            </div>

            {/* Script 4: .htaccess */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <FileCode className="w-3.5 h-3.5" />
                  4. .htaccess (Aceleração Gzip, WebP e Segurança Hostinger)
                </span>
                <button
                  onClick={() => copyToClipboard(htaccessContent, 'htaccess')}
                  className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  {copiedFile === 'htaccess' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile === 'htaccess' ? 'Copiado!' : 'Copiar .htaccess'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[11px] text-slate-300 overflow-x-auto font-mono">
                {htaccessContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
