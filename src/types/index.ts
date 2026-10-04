export type ServiceBrand = 'elomak' | 'vanguard' | 'elocontabil' | 'elosign' | 'eloautentico' | 'elomail' | 'saas';

export interface ServiceItem {
  id: string;
  marca: ServiceBrand;
  titulo: string;
  subtitulo: string;
  descricao: string;
  beneficios: string[];
  precoTexto: string;
  badge: string;
  linkDestino: string;
  disponivel: boolean;
  ordem: number;
  precoNumerico?: number;
  precoPromocional?: string;
  modalidade?: 'online' | 'presencial' | 'hibrido';
  destaqueHome?: boolean;
}

export type LeadStatus = 'novo' | 'em_atendimento' | 'convertido' | 'arquivado';

export interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  email?: string;
  servicoInteresse: string;
  marca: ServiceBrand;
  dataHora: string;
  status: LeadStatus;
  observacao?: string;
}

export interface Testimonial {
  id: string;
  nome: string;
  localidadeEmpresa: string;
  texto: string;
  rating: number;
  tagServico: 'EloMak' | 'Vanguard' | 'Elo Contábil';
  resultadoConcreto: string;
  data: string;
}

export interface SiteConfig {
  siteTitulo: string;
  siteDescricao: string;
  siteKeywords: string;
  corPrimaria: string;
  corSecundaria: string;
  corFundo: string;
  homeH1: string;
  homeSubtitulo: string;
  camillaNome: string;
  camillaCargo: string;
  camillaWhatsApp: string;
  camillaMensagemPadrao: string;
  seoLocalidadePrincipal: string;
  avisoUrgencia: string;
}

// PostgreSQL Unified Database Schemas (grupoeloizio: clientes, conversas, cerebro_camilla)
export interface DbCliente {
  id: number;
  nome: string;
  whatsapp: string;
  email?: string | null;
  servico_interesse?: string | null;
  marca?: string;
  status: 'novo' | 'em_atendimento' | 'convertido' | 'arquivado';
  observacao?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DbConversa {
  id: number;
  cliente_id?: number | null;
  canal: string;
  direcao: 'inbound' | 'outbound';
  mensagem: string;
  timestamp: string;
}

export interface DbCerebroCamilla {
  id: number;
  cliente_id?: number | null;
  intencao: string;
  memoria: Record<string, any>;
  resposta_sugerida?: string | null;
  timestamp: string;
}

export interface ApiHealthResponse {
  status: 'online' | 'offline';
  timestamp: string;
  traefik_host?: string;
  database: {
    driver: string;
    connected: boolean;
    mode: 'postgres' | 'memory' | 'json_fallback';
    database_name: string;
    user: string;
    tables: string[];
    counts: {
      clientes: number;
      servicos: number;
      depoimentos: number;
      conversas?: number;
      cerebro_camilla?: number;
    };
    last_error?: string | null;
  };
  subdomains: {
    hub: string;
    elomak: string;
    vanguard: string;
    elocontabil: string;
    camilla: string;
    wa_gateway?: string;
    elowa?: string;
  };
}

export interface ApiSettings {
  apiBaseUrl: string;
  apiToken: string;
  useCustomApi: boolean;
}

// Configurações de Códigos, Chaves e Credenciais do Sistema (Mercado Pago, Camilla, WhatsApp, EloMail, EloSign, Hostinger, Rastreamento)
export interface SystemKeysConfig {
  // Mercado Pago (Pagamentos Exclusivos do Grupo Eloizio)
  mpAccessToken: string;       // APP_USR-... (Produção)
  mpPublicKey: string;         // APP_USR-...
  mpWebhookSecret: string;     // Secret do Webhook IPN
  mpPixKey: string;            // Chave Pix cadastrada (ex: CNPJ / Telefone)

  // Camilla AI & WhatsApp (Atendimento Inteligente & Baileys)
  camillaBrainApiKey: string;  // Token de autenticação da Camilla IA
  camillaDomain: string;       // https://camilla.grupoeloizio.com.br
  whatsappToken: string;       // Token de segurança da API WhatsApp
  waDomain: string;            // https://wa.grupoeloizio.com.br ou elowa
  baileysEndpoint: string;     // Endpoint do servidor Baileys

  // EloMail, EloSign & Hostinger SMTP
  apiKeyMaster: string;        // Chave Mestra x-api-key do EloMail / EloSign
  smtpHost: string;            // Padrão: smtp.hostinger.com
  smtpPort: number;            // 465 (SSL) ou 587 (TLS)
  smtpUser: string;            // contato@grupoeloizio.com.br
  smtpPass: string;            // Senha do E-mail Hostinger
  smtpSecure: 'ssl' | 'tls';
  smtpFromName: string;        // Ex: Grupo Eloizio | Elo Contábil | EloMak
  
  // PostgreSQL 16 Unificado
  pgHost: string;              // postgres ou localhost
  pgPort: number;              // 5432
  pgDb: string;                // grupoeloizio ou postgres
  pgUser: string;              // postgres
  pgPass: string;              // Senha do PostgreSQL

  // Subdomínios & Endpoints Adicionais
  mailDomain: string;          // https://mail.grupoeloizio.com.br/api.php
  validaDomain: string;        // https://valida.grupoeloizio.com.br
  signDomain: string;          // https://sign.grupoeloizio.com.br

  // Automações & Webhooks
  n8nWebhookUrl: string;
  n8nApiKey: string;
  traefikTlsCertResolver: string; // letsencrypt

  // Códigos de Rastreamento & Scripts (Marketing e Conversão)
  gtmId: string;               // Google Tag Manager: GTM-XXXXXXX
  ga4Id: string;               // Google Analytics 4: G-XXXXXXXXXX
  metaPixelId: string;         // Meta Pixel: 123456789012345
  customHeadScripts: string;   // Scripts customizados para o <head>
  customBodyScripts: string;   // Scripts customizados para o <body>
  leadWebhookUrl: string;      // Webhook externo para disparo de novos leads

  updatedAt?: string;
}
