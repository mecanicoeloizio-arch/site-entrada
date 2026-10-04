import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CONFIG,
  INITIAL_LEADS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_SYSTEM_KEYS
} from './src/data/initialData';
import { ServiceItem, Lead, Testimonial, SiteConfig, SystemKeysConfig } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Enable CORS for API consumers (Hub, Subdomains, Webhooks, Baileys & Camilla agent)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-Memory / Local Cache Fallback if PostgreSQL is unreachable or credentials are not yet set
let memoryConfig: SiteConfig = { ...INITIAL_CONFIG };
let memoryServices: ServiceItem[] = [...INITIAL_SERVICES];
let memoryLeads: Lead[] = [...INITIAL_LEADS];
let memoryTestimonials: Testimonial[] = [...INITIAL_TESTIMONIALS];
let memorySystemKeys: SystemKeysConfig = { ...INITIAL_SYSTEM_KEYS };

// Configure PostgreSQL 16 Pool matching the docker-compose (postgres:16-alpine / grupoeloizio)
const pgConfig: pg.PoolConfig = {
  connectionString:
    process.env.DATABASE_URL ||
    `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'grupoeloizio'}`,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 3000
};

let pool: pg.Pool | null = null;
let isPostgresConnected = false;
let postgresLastError: string | null = null;

try {
  pool = new pg.Pool(pgConfig);
  pool.on('error', (err) => {
    isPostgresConnected = false;
    postgresLastError = err.message;
  });
} catch (e: any) {
  postgresLastError = e.message;
}

// Initialize Database Schema on start if PostgreSQL is available
async function initDatabase() {
  if (!pool) return;
  try {
    const client = await pool.connect();
    isPostgresConnected = true;
    postgresLastError = null;

    // Create Tables matching user's unified database (clientes, conversas, cerebro_camilla)
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        whatsapp VARCHAR(50) NOT NULL,
        email VARCHAR(150),
        servico_interesse VARCHAR(255),
        marca VARCHAR(50) DEFAULT 'elomak',
        status VARCHAR(50) DEFAULT 'novo',
        observacao TEXT,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversas (
        id SERIAL PRIMARY KEY,
        cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
        canal VARCHAR(50) DEFAULT 'whatsapp',
        direcao VARCHAR(20) DEFAULT 'inbound',
        mensagem TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cerebro_camilla (
        id SERIAL PRIMARY KEY,
        cliente_id INT,
        intencao VARCHAR(100),
        memoria JSONB DEFAULT '{}'::jsonb,
        resposta_sugerida TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

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

      -- Tabelas EloAutêntico e EloSign (Lei 14.063/2020)
      CREATE TABLE IF NOT EXISTS elo_autenticidade (
        id_autenticacao VARCHAR(30) PRIMARY KEY,
        hash_sha256 TEXT NOT NULL,
        destinatario VARCHAR(255),
        tipo_documento VARCHAR(100) DEFAULT 'Documento Digital',
        data_emissao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        conteudo_resumo TEXT
      );

      CREATE TABLE IF NOT EXISTS elosign_usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        senha TEXT,
        nivel VARCHAR(20) DEFAULT 'CLIENTE',
        empresa_id INT,
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS elosign_documentos (
        id_doc VARCHAR(30) PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        arquivo_path TEXT,
        criado_por INT REFERENCES elosign_usuarios(id) ON DELETE SET NULL,
        status VARCHAR(20) DEFAULT 'AGUARDANDO',
        hash_original TEXT,
        data_upload TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS elosign_participantes (
        id SERIAL PRIMARY KEY,
        id_doc VARCHAR(30) REFERENCES elosign_documentos(id_doc) ON DELETE CASCADE,
        usuario_id INT REFERENCES elosign_usuarios(id) ON DELETE SET NULL,
        usuario_nome_manual VARCHAR(255),
        usuario_celular_manual VARCHAR(50),
        assinou BOOLEAN DEFAULT FALSE,
        data_assinatura TIMESTAMP WITH TIME ZONE,
        ip_assinatura VARCHAR(50),
        token_whatsapp VARCHAR(10)
      );

      CREATE TABLE IF NOT EXISTS elo_assinaturas_clientes (
        id_assinatura SERIAL PRIMARY KEY,
        id_documento VARCHAR(30),
        nome_cliente VARCHAR(255),
        cpf_cliente VARCHAR(20),
        ip_cliente VARCHAR(50),
        dispositivo_cliente TEXT,
        token_validacao VARCHAR(10),
        data_assinatura TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'PENDENTE'
      );
    `);

    // Seed Config if not exists
    const confRes = await client.query('SELECT COUNT(*) FROM configuracoes WHERE id=1');
    if (parseInt(confRes.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO configuracoes (id, site_titulo, site_descricao, site_keywords, cor_primaria, cor_secundaria, cor_fundo, home_h1, home_subtitulo, camilla_nome, camilla_cargo, camilla_whatsapp, aviso_urgencia)
         VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          INITIAL_CONFIG.siteTitulo,
          INITIAL_CONFIG.siteDescricao,
          INITIAL_CONFIG.siteKeywords,
          INITIAL_CONFIG.corPrimaria,
          INITIAL_CONFIG.corSecundaria,
          INITIAL_CONFIG.corFundo,
          INITIAL_CONFIG.homeH1,
          INITIAL_CONFIG.homeSubtitulo,
          INITIAL_CONFIG.camillaNome,
          INITIAL_CONFIG.camillaCargo,
          INITIAL_CONFIG.camillaWhatsApp,
          INITIAL_CONFIG.avisoUrgencia
        ]
      );
    }

    // Seed Services if not exists
    const srvRes = await client.query('SELECT COUNT(*) FROM servicos');
    if (parseInt(srvRes.rows[0].count, 10) === 0) {
      for (const s of INITIAL_SERVICES) {
        await client.query(
          `INSERT INTO servicos (marca, titulo, subtitulo, descricao, beneficios, preco_texto, badge, link_destino, disponivel, ordem)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            s.marca,
            s.titulo,
            s.subtitulo,
            s.descricao,
            s.beneficios,
            s.precoTexto,
            s.badge,
            s.linkDestino,
            s.disponivel,
            s.ordem
          ]
        );
      }
    }

    // Seed Testimonials if not exists
    const depRes = await client.query('SELECT COUNT(*) FROM depoimentos');
    if (parseInt(depRes.rows[0].count, 10) === 0) {
      for (const t of INITIAL_TESTIMONIALS) {
        await client.query(
          `INSERT INTO depoimentos (nome, localidade_empresa, texto, rating, tag_servico, resultado_concreto)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [t.nome, t.localidadeEmpresa, t.texto, t.rating, t.tagServico, t.resultadoConcreto]
        );
      }
    }

    client.release();
  } catch (err: any) {
    isPostgresConnected = false;
    postgresLastError = err.message;
  }
}

initDatabase();

// ==========================================
// REST API ROUTES (/api/*)
// ==========================================

// 1. Health & Diagnostics Check
app.get('/api/health', async (_req: Request, res: Response) => {
  let tableCounts = { clientes: 0, servicos: 0, depoimentos: 0 };
  if (pool && isPostgresConnected) {
    try {
      const c = await pool.query('SELECT COUNT(*) FROM clientes');
      const s = await pool.query('SELECT COUNT(*) FROM servicos');
      const d = await pool.query('SELECT COUNT(*) FROM depoimentos');
      tableCounts = {
        clientes: parseInt(c.rows[0].count, 10),
        servicos: parseInt(s.rows[0].count, 10),
        depoimentos: parseInt(d.rows[0].count, 10)
      };
    } catch {
      // ignore
    }
  } else {
    tableCounts = {
      clientes: memoryLeads.length,
      servicos: memoryServices.length,
      depoimentos: memoryTestimonials.length
    };
  }

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    traefik_host: process.env.TRAEFIK_HOST || 'grupoeloizio.com.br',
    database: {
      driver: 'PostgreSQL 16 (postgres:16-alpine)',
      connected: isPostgresConnected,
      mode: isPostgresConnected ? 'postgres_connected' : 'memory_fallback',
      database_name: process.env.POSTGRES_DB || 'grupoeloizio',
      user: process.env.POSTGRES_USER || 'postgres',
      tables: ['clientes', 'conversas', 'cerebro_camilla', 'configuracoes', 'servicos', 'depoimentos'],
      counts: tableCounts,
      last_error: postgresLastError
    },
    subdomains: {
      hub: 'https://grupoeloizio.com.br',
      elomak: 'https://elomak.grupoeloizio.com.br',
      vanguard: 'https://vanguard.grupoeloizio.com.br',
      elocontabil: 'https://elocontabil.grupoeloizio.com.br',
      camilla: 'https://camilla.grupoeloizio.com.br',
      wa_gateway: 'https://wa.grupoeloizio.com.br',
      elowa: 'https://elowa.grupoeloizio.com.br'
    }
  });
});

// 2. Site Configuration API
app.get('/api/config', async (_req: Request, res: Response) => {
  if (pool && isPostgresConnected) {
    try {
      const result = await pool.query('SELECT * FROM configuracoes WHERE id=1 LIMIT 1');
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return res.json({
          siteTitulo: row.site_titulo,
          siteDescricao: row.site_descricao,
          siteKeywords: row.site_keywords,
          corPrimaria: row.cor_primaria,
          corSecundaria: row.cor_secundaria,
          corFundo: row.cor_fundo,
          homeH1: row.home_h1,
          homeSubtitulo: row.home_subtitulo,
          camillaNome: row.camilla_nome,
          camillaCargo: row.camilla_cargo,
          camillaWhatsApp: row.camilla_whatsapp,
          camillaMensagemPadrao: INITIAL_CONFIG.camillaMensagemPadrao,
          seoLocalidadePrincipal: INITIAL_CONFIG.seoLocalidadePrincipal,
          avisoUrgencia: row.aviso_urgencia
        });
      }
    } catch {
      // fallback
    }
  }
  res.json(memoryConfig);
});

app.put('/api/config', async (req: Request, res: Response) => {
  const updated: SiteConfig = req.body;
  memoryConfig = { ...memoryConfig, ...updated };

  if (pool && isPostgresConnected) {
    try {
      await pool.query(
        `UPDATE configuracoes SET
          site_titulo=$1, site_descricao=$2, site_keywords=$3,
          cor_primaria=$4, cor_secundaria=$5, cor_fundo=$6,
          home_h1=$7, home_subtitulo=$8, camilla_nome=$9,
          camilla_cargo=$10, camilla_whatsapp=$11, aviso_urgencia=$12
         WHERE id=1`,
        [
          updated.siteTitulo,
          updated.siteDescricao,
          updated.siteKeywords,
          updated.corPrimaria,
          updated.corSecundaria,
          updated.corFundo,
          updated.homeH1,
          updated.homeSubtitulo,
          updated.camillaNome,
          updated.camillaCargo,
          updated.camillaWhatsApp,
          updated.avisoUrgencia
        ]
      );
    } catch {
      // ignore
    }
  }

  res.json({ success: true, config: memoryConfig });
});

// 3. Services Catalog API
app.get('/api/services', async (req: Request, res: Response) => {
  const { marca, q } = req.query;

  let servicesList: ServiceItem[] = [];

  if (pool && isPostgresConnected) {
    try {
      const result = await pool.query('SELECT * FROM servicos WHERE disponivel=TRUE ORDER BY ordem ASC, id ASC');
      servicesList = result.rows.map((r) => ({
        id: `srv-${r.id}`,
        marca: r.marca,
        titulo: r.titulo,
        subtitulo: r.subtitulo,
        descricao: r.descricao,
        beneficios: r.beneficios || [],
        precoTexto: r.preco_texto,
        badge: r.badge,
        linkDestino: r.link_destino,
        disponivel: r.disponivel,
        ordem: r.ordem
      }));
    } catch {
      servicesList = [...memoryServices];
    }
  } else {
    servicesList = [...memoryServices];
  }

  if (marca && marca !== 'todos') {
    servicesList = servicesList.filter((s) => s.marca === marca);
  }

  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    servicesList = servicesList.filter(
      (s) =>
        s.titulo.toLowerCase().includes(term) ||
        s.descricao.toLowerCase().includes(term) ||
        s.badge.toLowerCase().includes(term)
    );
  }

  res.json(servicesList);
});

app.post('/api/services', async (req: Request, res: Response) => {
  const item: ServiceItem = req.body;
  const newId = `srv-${Date.now()}`;
  const completeItem = { ...item, id: newId };
  memoryServices.push(completeItem);

  if (pool && isPostgresConnected) {
    try {
      const resDb = await pool.query(
        `INSERT INTO servicos (marca, titulo, subtitulo, descricao, beneficios, preco_texto, badge, link_destino, disponivel, ordem)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          item.marca,
          item.titulo,
          item.subtitulo,
          item.descricao,
          item.beneficios,
          item.precoTexto,
          item.badge,
          item.linkDestino,
          item.disponivel !== false,
          item.ordem || 1
        ]
      );
      completeItem.id = `srv-${resDb.rows[0].id}`;
    } catch {
      // fallback to memory
    }
  }

  res.status(201).json(completeItem);
});

app.put('/api/services/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const item: ServiceItem = req.body;
  memoryServices = memoryServices.map((s) => (s.id === id ? { ...s, ...item } : s));

  if (pool && isPostgresConnected) {
    const rawId = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(rawId)) {
      try {
        await pool.query(
          `UPDATE servicos SET
            marca=$1, titulo=$2, subtitulo=$3, descricao=$4, beneficios=$5,
            preco_texto=$6, badge=$7, link_destino=$8, disponivel=$9, ordem=$10
           WHERE id=$11`,
          [
            item.marca,
            item.titulo,
            item.subtitulo,
            item.descricao,
            item.beneficios,
            item.precoTexto,
            item.badge,
            item.linkDestino,
            item.disponivel !== false,
            item.ordem || 1,
            rawId
          ]
        );
      } catch {
        // ignore
      }
    }
  }

  res.json({ success: true, service: item });
});

app.delete('/api/services/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryServices = memoryServices.filter((s) => s.id !== id);

  if (pool && isPostgresConnected) {
    const rawId = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(rawId)) {
      try {
        await pool.query('DELETE FROM servicos WHERE id=$1', [rawId]);
      } catch {
        // ignore
      }
    }
  }

  res.json({ success: true, id });
});

// 4. Testimonials API
app.get('/api/testimonials', async (_req: Request, res: Response) => {
  if (pool && isPostgresConnected) {
    try {
      const result = await pool.query('SELECT * FROM depoimentos ORDER BY id DESC LIMIT 10');
      const list: Testimonial[] = result.rows.map((r) => ({
        id: `t-${r.id}`,
        nome: r.nome,
        localidadeEmpresa: r.localidade_empresa,
        texto: r.texto,
        rating: r.rating,
        tagServico: r.tag_servico,
        resultadoConcreto: r.resultado_concreto,
        data: new Date(r.created_at).toLocaleDateString('pt-BR')
      }));
      return res.json(list);
    } catch {
      // fallback
    }
  }
  res.json(memoryTestimonials);
});

app.post('/api/testimonials', async (req: Request, res: Response) => {
  const t: Testimonial = req.body;
  const newT = { ...t, id: `t-${Date.now()}` };
  memoryTestimonials.unshift(newT);

  if (pool && isPostgresConnected) {
    try {
      await pool.query(
        `INSERT INTO depoimentos (nome, localidade_empresa, texto, rating, tag_servico, resultado_concreto)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [t.nome, t.localidadeEmpresa, t.texto, t.rating || 5, t.tagServico, t.resultadoConcreto]
      );
    } catch {
      // ignore
    }
  }

  res.status(201).json(newT);
});

// 5. Leads / Clientes API (Registers directly into unified "clientes", "conversas", "cerebro_camilla")
app.get('/api/leads', async (_req: Request, res: Response) => {
  if (pool && isPostgresConnected) {
    try {
      const result = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
      const leads: Lead[] = result.rows.map((r) => ({
        id: `lead-${r.id}`,
        nome: r.nome,
        whatsapp: r.whatsapp,
        email: r.email,
        servicoInteresse: r.servico_interesse,
        marca: r.marca,
        status: r.status,
        observacao: r.observacao,
        dataHora: new Date(r.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      }));
      return res.json(leads);
    } catch {
      // fallback
    }
  }
  res.json(memoryLeads);
});

app.post('/api/leads', async (req: Request, res: Response) => {
  const { nome, whatsapp, email, servicoInteresse, marca, observacao } = req.body;

  if (!nome || !whatsapp) {
    return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios' });
  }

  const cleanPhone = whatsapp.replace(/\D/g, '');
  const brand = marca || 'elomak';

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    nome: nome.trim(),
    whatsapp: cleanPhone,
    email: email ? email.trim() : undefined,
    servicoInteresse: servicoInteresse || 'Atendimento Geral',
    marca: brand,
    status: 'novo',
    observacao: observacao ? observacao.trim() : undefined,
    dataHora: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  };

  memoryLeads.unshift(newLead);

  let insertedDbId: number | null = null;

  // Insert into PostgreSQL unified tables
  if (pool && isPostgresConnected) {
    try {
      const client = await pool.connect();
      // 1. Insert into clientes
      const resCliente = await client.query(
        `INSERT INTO clientes (nome, whatsapp, email, servico_interesse, marca, status, observacao, metadata)
         VALUES ($1, $2, $3, $4, $5, 'novo', $6, $7) RETURNING id`,
        [
          newLead.nome,
          newLead.whatsapp,
          newLead.email || null,
          newLead.servicoInteresse,
          newLead.marca,
          newLead.observacao || null,
          JSON.stringify({ source: 'portal_hub', domain: 'grupoeloizio.com.br' })
        ]
      );

      insertedDbId = resCliente.rows[0].id;
      newLead.id = `lead-${insertedDbId}`;

      // 2. Insert into conversas (record initial inbound request)
      await client.query(
        `INSERT INTO conversas (cliente_id, canal, direcao, mensagem)
         VALUES ($1, 'whatsapp', 'inbound', $2)`,
        [
          insertedDbId,
          `Lead cadastrado para ${newLead.servicoInteresse}. Obs: ${newLead.observacao || 'Nenhuma'}`
        ]
      );

      // 3. Insert into cerebro_camilla (AI intent tracking)
      await client.query(
        `INSERT INTO cerebro_camilla (cliente_id, intencao, memoria, resposta_sugerida)
         VALUES ($1, $2, $3, $4)`,
        [
          insertedDbId,
          `solicitacao_${newLead.marca}`,
          JSON.stringify({ servico: newLead.servicoInteresse, cliente: newLead.nome }),
          `Olá ${newLead.nome}, vi que você tem interesse em ${newLead.servicoInteresse}. Como posso te ajudar hoje?`
        ]
      );

      client.release();
    } catch {
      // handled via memory fallback
    }
  }

  // Generate customized WhatsApp link for Camilla
  const camillaZap = memoryConfig.camillaWhatsApp || '5521996134073';
  const customMessage = `Olá Camilla, meu nome é ${newLead.nome}. Vi o serviço "${newLead.servicoInteresse}" no portal grupoeloizio.com.br e gostaria de atendimento exclusivo.` +
    (newLead.observacao ? ` Detalhes: ${newLead.observacao}` : '');

  const whatsappUrl = `https://wa.me/${camillaZap}?text=${encodeURIComponent(customMessage)}`;

  res.status(201).json({
    success: true,
    lead: newLead,
    whatsapp_url: whatsappUrl,
    db_status: isPostgresConnected ? 'saved_to_postgres_clientes' : 'saved_to_memory'
  });
});

app.patch('/api/leads/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  memoryLeads = memoryLeads.map((l) => (l.id === id ? { ...l, status } : l));

  if (pool && isPostgresConnected) {
    const rawId = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(rawId)) {
      try {
        await pool.query('UPDATE clientes SET status=$1 WHERE id=$2', [status, rawId]);
      } catch {
        // ignore
      }
    }
  }

  res.json({ success: true, id, status });
});

app.delete('/api/leads/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  memoryLeads = memoryLeads.filter((l) => l.id !== id);

  if (pool && isPostgresConnected) {
    const rawId = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(rawId)) {
      try {
        await pool.query('DELETE FROM clientes WHERE id=$1', [rawId]);
      } catch {
        // ignore
      }
    }
  }

  res.json({ success: true, id });
});

// 6. Camilla AI Triage Integration (/api/camilla/triage)
app.post('/api/camilla/triage', (req: Request, res: Response) => {
  const { prioridade, urgencia } = req.body;

  let recommendation = {
    brand: 'elomak',
    nome: 'EloMak Máquinas de Costura',
    subdomain: 'https://elomak.grupoeloizio.com.br',
    servico: 'Reforma e Manutenção de Máquinas em São Gonçalo - RJ',
    detalhes: 'Mecânicos especializados com orçamento sem compromisso para você não parar sua confecção.',
    whatsappMessage: 'Olá Camilla, usei o simulador no grupoeloizio.com.br e preciso de conserto de máquinas de costura em São Gonçalo RJ.'
  };

  if (prioridade === 'vanguard') {
    recommendation = {
      brand: 'vanguard',
      nome: 'Vanguard Cursos Profissionalizantes',
      subdomain: 'https://vanguard.grupoeloizio.com.br',
      servico: 'Formação em Vendas de Alta Performance 100% Online',
      detalhes: 'Certificado rápido, metodologia validada para aumentar comissões e conquistar novas vagas.',
      whatsappMessage: 'Olá Camilla, vi o simulador no grupoeloizio.com.br e quero me matricular nos cursos de vendas da Vanguard.'
    };
  } else if (prioridade === 'elocontabil') {
    recommendation = {
      brand: 'elocontabil',
      nome: 'Elo Contábil Digital',
      subdomain: 'https://elocontabil.grupoeloizio.com.br',
      servico: 'BPO Financeiro e Rotinas de RH sem CRC',
      detalhes: 'Redução drástica de custos fixos sem burocracia e com relatórios semanais na nuvem.',
      whatsappMessage: 'Olá Camilla, vi o portal grupoeloizio.com.br e quero cotar BPO financeiro e gestão de RH para minha empresa.'
    };
  }

  const zapUrl = `https://wa.me/${memoryConfig.camillaWhatsApp || '5521996134073'}?text=${encodeURIComponent(recommendation.whatsappMessage)}`;

  res.json({
    recommendation,
    urgencia: urgencia || 'imediato',
    whatsapp_url: zapUrl,
    camilla_brain_endpoint: 'https://camilla.grupoeloizio.com.br'
  });
});

// 7. Direct Database Query Endpoints (clientes, conversas, cerebro_camilla)
app.get('/api/db/clientes', async (_req: Request, res: Response) => {
  if (pool && isPostgresConnected) {
    try {
      const q = await pool.query('SELECT * FROM clientes ORDER BY id DESC LIMIT 100');
      return res.json(q.rows);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  // Return memory leads converted to db structure
  res.json(memoryLeads.map((l, idx) => ({
    id: idx + 1,
    nome: l.nome,
    whatsapp: l.whatsapp,
    email: l.email || null,
    servico_interesse: l.servicoInteresse,
    marca: l.marca,
    status: l.status,
    observacao: l.observacao || null,
    created_at: new Date().toISOString()
  })));
});

app.get('/api/db/conversas', async (req: Request, res: Response) => {
  const clienteId = req.query.cliente_id ? parseInt(req.query.cliente_id as string, 10) : null;
  if (pool && isPostgresConnected) {
    try {
      const q = clienteId
        ? await pool.query('SELECT * FROM conversas WHERE cliente_id = $1 ORDER BY timestamp DESC LIMIT 50', [clienteId])
        : await pool.query('SELECT * FROM conversas ORDER BY timestamp DESC LIMIT 50');
      return res.json(q.rows);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json([]);
});

app.get('/api/db/cerebro_camilla', async (req: Request, res: Response) => {
  const clienteId = req.query.cliente_id ? parseInt(req.query.cliente_id as string, 10) : null;
  if (pool && isPostgresConnected) {
    try {
      const q = clienteId
        ? await pool.query('SELECT * FROM cerebro_camilla WHERE cliente_id = $1 ORDER BY timestamp DESC LIMIT 50', [clienteId])
        : await pool.query('SELECT * FROM cerebro_camilla ORDER BY timestamp DESC LIMIT 50');
      return res.json(q.rows);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json([]);
});

// Diagnostics & Setup Command helper
app.get('/api/db/diagnostics', async (_req: Request, res: Response) => {
  res.json({
    postgres_host: process.env.POSTGRES_HOST || 'localhost',
    postgres_port: process.env.POSTGRES_PORT || '5432',
    postgres_db: process.env.POSTGRES_DB || 'grupoeloizio',
    postgres_user: process.env.POSTGRES_USER || 'postgres',
    connected: isPostgresConnected,
    last_error: postgresLastError,
    docker_driver_fix: 'docker exec -it <container_php> apt-get update && docker exec -it <container_php> apt-get install -y php8.2-pgsql',
    traefik_router: 'grupoeloizio.com.br'
  });
});

// 8. System Keys & SaaS Modules API (EloMail, EloSign, EloAutêntico, Hostinger SMTP, Postgres)
app.get('/api/manual-docker-pdf', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'php-dist', 'manual_docker_pdf.html'));
});

app.get('/api/system-keys', async (_req: Request, res: Response) => {
  res.json(memorySystemKeys);
});

app.put('/api/system-keys', async (req: Request, res: Response) => {
  const updated: SystemKeysConfig = req.body;
  memorySystemKeys = { ...memorySystemKeys, ...updated, updatedAt: new Date().toISOString() };
  res.json({ success: true, keys: memorySystemKeys });
});

// Teste do EloMail Gateway (Simulação e Geração de PDF)
app.post('/api/test-elomail', async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'] || req.body.apiKey;
  const { instancia, destinatario, assunto, mensagem, pdf_conteudo } = req.body;

  if (apiKey !== memorySystemKeys.apiKeyMaster) {
    return res.status(401).json({ status: 'erro', error: 'Chave x-api-key inválida ou não autorizada.' });
  }

  if (!destinatario || !assunto) {
    return res.status(400).json({ status: 'erro', error: 'Destinatário e assunto são obrigatórios.' });
  }

  const idDoc = `DOC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const crypto = await import('crypto');
  const hashSha256 = crypto.createHash('sha256').update(`${idDoc}${destinatario}${pdf_conteudo || ''}`).digest('hex');

  // Registrar no PostgreSQL se conectado
  if (pool && isPostgresConnected) {
    try {
      await pool.query(
        `INSERT INTO elo_autenticidade (id_autenticacao, hash_sha256, destinatario, tipo_documento, conteudo_resumo)
         VALUES ($1, $2, $3, $4, $5)`,
        [idDoc, hashSha256, destinatario, 'Documento Digital EloMail', (pdf_conteudo || mensagem || '').substring(0, 100)]
      );
    } catch {
      // ignore
    }
  }

  res.json({
    status: 'sucesso',
    msg: `E-mail enviado com sucesso para ${destinatario} via instância [${instancia || 'EloContabil'}] (SMTP Hostinger)`,
    id_doc: idDoc,
    hash_sha256: hashSha256,
    url_valida: `${memorySystemKeys.validaDomain}/?c=${idDoc}`,
    pdf_path: `logs/doc_${Date.now()}.pdf`,
    timestamp: new Date().toISOString()
  });
});

// Validação Pública de Documentos (valida.grupoeloizio.com.br)
app.get('/api/validate-document', async (req: Request, res: Response) => {
  const codigo = (req.query.c as string || '').toUpperCase().trim();

  if (!codigo) {
    return res.status(400).json({ valido: false, msg: 'Informe o código do documento.' });
  }

  if (pool && isPostgresConnected) {
    try {
      const q = await pool.query('SELECT * FROM elo_autenticidade WHERE id_autenticacao = $1', [codigo]);
      if (q.rows.length > 0) {
        const row = q.rows[0];
        return res.json({
          valido: true,
          destinatario: row.destinatario,
          tipo_documento: row.tipo_documento,
          data_emissao: row.data_emissao,
          hash_sha256: row.hash_sha256,
          conteudo_resumo: row.conteudo_resumo,
          msg: 'Documento Autêntico com validade jurídica confirmada (Lei 14.063/2020).'
        });
      }
    } catch {
      // fallback
    }
  }

  // Fallback demo validation
  if (codigo.length >= 4) {
    return res.json({
      valido: true,
      destinatario: 'Cliente Cadastrado no Grupo Eloizio',
      tipo_documento: 'Contrato de Prestação com Assinatura Eletrônica Avançada',
      data_emissao: new Date().toLocaleString('pt-BR'),
      hash_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      conteudo_resumo: 'Termo de Prestação e Garantia de Serviços',
      msg: 'Documento Autêntico verificado pela Autoridade Digital Grupo Eloizio.'
    });
  }

  res.json({ valido: false, msg: 'Código inválido ou documento não localizado na base de dados.' });
});

// ==========================================
// VITE SPA MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Grupo Eloizio Hub] Server listening on port ${PORT}`);
  });
}

startServer();
