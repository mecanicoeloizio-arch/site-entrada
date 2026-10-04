-- ==============================================================================
-- BANCO DE DADOS UNIFICADO: grupoeloizio (PostgreSQL 16)
-- Conexão: postgres://postgres:5432/grupoeloizio
-- Host: grupoeloizio.com.br
-- Compatível com: PHP 8.2 (CURL + PDO_PGSQL), Node 24 (Camilla AI), Node 20 (Baileys)
-- ==============================================================================

-- 1. Tabela Principal de Clientes e Leads (Integrada com o Hub)
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

-- 2. Tabela de Conversas e Mensagens (WhatsApp Gateway Baileys / Portal)
CREATE TABLE IF NOT EXISTS conversas (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
  canal VARCHAR(50) DEFAULT 'whatsapp',
  direcao VARCHAR(20) DEFAULT 'inbound',
  mensagem TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela Cérebro Camilla (Memória, Intenções e IA Gemini)
CREATE TABLE IF NOT EXISTS cerebro_camilla (
  id SERIAL PRIMARY KEY,
  cliente_id INT,
  intencao VARCHAR(100),
  memoria JSONB DEFAULT '{}'::jsonb,
  resposta_sugerida TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Configurações Gerais do Hub
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

-- 5. Tabela de Catálogo de Serviços do Mini Shopping
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

-- 6. Tabela de Prova Social e Depoimentos
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

-- Índices para Máxima Performance
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp ON clientes(whatsapp);
CREATE INDEX IF NOT EXISTS idx_clientes_marca ON clientes(marca);
CREATE INDEX IF NOT EXISTS idx_conversas_cliente ON conversas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cerebro_intencao ON cerebro_camilla(intencao);

-- Semente Inicial de Configurações
INSERT INTO configuracoes (id, site_titulo, site_descricao, site_keywords, cor_primaria, cor_secundaria, cor_fundo, home_h1, home_subtitulo, camilla_nome, camilla_cargo, camilla_whatsapp, aviso_urgencia)
VALUES (
  1,
  'Grupo Eloizio | Hub de Soluções Integradas',
  'Hub integrado de soluções: EloMak (Manutenção de Máquinas de Costura em São Gonçalo RJ), Vanguard Cursos Online e Elo Contábil Digital BPO & RH sem CRC.',
  'conserto maquina costura são gonçalo rj, elomak são gonçalo, cursos online vanguard, elocontabil bpo digital, camilla ai',
  '#00f2fe',
  '#4facfe',
  '#080b11',
  'Tecnologia, Precisão e Alta Performance em um Único Hub',
  'Conectamos você aos serviços especializados do Grupo Eloizio: reforma de máquinas industriais e domésticas em São Gonçalo, cursos de alta empregabilidade e BPO administrativo e de RH sem necessidade de CRC.',
  'Camilla',
  'Head de Triagem & Atendimento Especializado',
  '5521996134073',
  'Orçamento sem compromisso em São Gonçalo e atendimento prioritário via WhatsApp!'
) ON CONFLICT (id) DO NOTHING;

-- Semente Inicial dos Serviços
INSERT INTO servicos (marca, titulo, subtitulo, descricao, beneficios, preco_texto, badge, link_destino, disponivel, ordem)
VALUES
  ('elomak', 'Reforma & Manutenção de Máquinas Industriais', 'Overlock, Reta, Galoneira, Interlock e Pespontadeira', 'Reforma completa com desmontagem técnica, calibragem micrométrica de ponto e teste em tecido. Não deixe sua produção parada em São Gonçalo.', ARRAY['Orçamento sem compromisso em São Gonçalo RJ', 'Regulagem precisa de ponto', 'Opção motor Direct Drive econômico', 'Garantia técnica comprovada'], 'Sob consulta (Orçamento Grátis)', 'São Gonçalo - RJ', 'https://elomak.grupoeloizio.com.br', TRUE, 1),
  ('elomak', 'Revisão & Regulagem de Máquinas Domésticas', 'Singer, Elgin, Brother, Janome e Vigorelli', 'Limpeza interna ultrassônica, lubrificação especial de engrenagens, eliminação de ruídos e teste de tensão de linha.', ARRAY['Diagnóstico sem surpresas', 'Troca de peças com desgaste', 'Atendimento ágil para ateliês', 'Garantia pós-serviço'], 'A partir de R$ 90,00', 'Orçamento sem compromisso', 'https://elomak.grupoeloizio.com.br', TRUE, 2),
  ('elomak', 'Peças Originais, Motores Direct Drive & Acessórios', 'Lançadeiras, Loopers, Calcadores e Lubrificantes', 'Estoque de reposição imediata para que sua confecção ou ateliê mantenha produtividade contínua em São Gonçalo.', ARRAY['Peças testadas com alta durabilidade', 'Acessórios para vivos e zíperes', 'Retirada em São Gonçalo ou envio', 'Suporte técnico do mecânico'], 'Peças a partir de R$ 25,00', 'Pronta Entrega RJ', 'https://elomak.grupoeloizio.com.br', TRUE, 3),
  ('vanguard', 'Formação em Vendas de Alta Performance', 'Do Script de Abordagem ao Fechamento de Alto Ticket', 'Curso 100% online desenvolvido para quem busca empregabilidade imediata ou aumento expressivo de comissão em vendas.', ARRAY['Acesso vitalício à plataforma', 'Certificado de conclusão reconhecido', 'Scripts de WhatsApp prontos', 'Módulo de quebra de objeções'], '12x de R$ 29,90 ou R$ 297', '100% Online · Alta Empregabilidade', 'https://vanguard.grupoeloizio.com.br', TRUE, 4),
  ('vanguard', 'Gestão Comercial & Negociação Estratégica', 'Liderança de Vendas e Fechamento B2B e Varejo', 'Aprenda a estruturar metas de vendas, indicadores de conversão e técnicas de persuasão para promoção na carreira comercial.', ARRAY['Aulas práticas direto ao ponto', 'Planilhas prontas de CRM', 'Suporte para dúvidas dos alunos', 'Foco em novas vagas e promoções'], '12x de R$ 34,90 ou R$ 347', 'Certificado Incluso', 'https://vanguard.grupoeloizio.com.br', TRUE, 5),
  ('elocontabil', 'BPO Financeiro & Gestão Administrativa', 'Contas a Pagar, Receber e Conciliação Bancária', 'Terceirização da rotina financeira da sua empresa. Serviços administrativos que não exigem contador registrado no CRC.', ARRAY['Emissão de cobranças e conciliação', 'Relatórios semanais na nuvem', 'Economia de até 60% vs equipe interna', 'Atendimento 100% digital'], 'Planos a partir de R$ 390/mês', 'Sem Necessidade de CRC', 'https://elocontabil.grupoeloizio.com.br', TRUE, 6),
  ('elocontabil', 'Terceirização de Rotinas de RH & Departamento Pessoal', 'Admissão, Folha de Ponto, Benefícios e Contratos', 'Gestão operacional de colaboradores para PMEs. Controle de horas, arquivo digital e envio de holerites sem burocracia.', ARRAY['Pastas digitais de cada funcionário', 'Controle rigoroso de férias e atestados', 'Comunicados e avisos legais', 'Tranquilidade para o empresário'], 'Planos a partir de R$ 290/mês', 'Eficiência Operacional', 'https://elocontabil.grupoeloizio.com.br', TRUE, 7);
