-- BANCO DE DADOS UNIFICADO (HOSTINGER VPS KVM2 - DEBIAN APACHE)
-- Domínio: grupoeloizio.com.br

CREATE DATABASE IF NOT EXISTS `hub_servicos` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hub_servicos`;

-- 1. TABELA DE CONFIGURAÇÕES GERAIS E SEO
CREATE TABLE IF NOT EXISTS `configuracoes` (
    `id` INT PRIMARY KEY DEFAULT 1,
    `site_titulo` VARCHAR(150),
    `site_descricao` TEXT,
    `site_keywords` TEXT,
    `cor_primaria` VARCHAR(15) DEFAULT '#00f2fe',
    `cor_secundaria` VARCHAR(15) DEFAULT '#4facfe',
    `cor_fundo` VARCHAR(15) DEFAULT '#080b11',
    `home_h1` VARCHAR(255),
    `home_subtitulo` TEXT,
    `camilla_nome` VARCHAR(80) DEFAULT 'Camilla',
    `camilla_cargo` VARCHAR(120) DEFAULT 'Head de Triagem & Atendimento Especializado',
    `camilla_whatsapp` VARCHAR(30) DEFAULT '5521996134073',
    `camilla_mensagem` TEXT,
    `aviso_urgencia` VARCHAR(255)
);

-- 2. TABELA DE SERVIÇOS DO MINI SHOPPING
CREATE TABLE IF NOT EXISTS `servicos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `marca` ENUM('elomak', 'vanguard', 'elocontabil') NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `subtitulo` VARCHAR(255),
    `descricao` TEXT,
    `beneficios` TEXT,
    `preco_texto` VARCHAR(100),
    `badge` VARCHAR(100),
    `link_destino` VARCHAR(255),
    `disponivel` TINYINT(1) DEFAULT 1,
    `ordem` INT DEFAULT 0
);

-- 3. TABELA DE CAPTURA DE LEADS
CREATE TABLE IF NOT EXISTS `leads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(120) NOT NULL,
    `whatsapp` VARCHAR(30) NOT NULL,
    `email` VARCHAR(120),
    `servico_interesse` VARCHAR(150),
    `marca` VARCHAR(30),
    `status` VARCHAR(30) DEFAULT 'novo',
    `observacao` TEXT,
    `data_hora` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE PROVAS SOCIAIS
CREATE TABLE IF NOT EXISTS `depoimentos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(100) NOT NULL,
    `localidade_empresa` VARCHAR(150),
    `texto` TEXT NOT NULL,
    `rating` INT DEFAULT 5,
    `tag_servico` VARCHAR(50),
    `resultado_concreto` VARCHAR(150),
    `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario` VARCHAR(50) UNIQUE NOT NULL,
    `senha_hash` VARCHAR(255) NOT NULL,
    `nome` VARCHAR(100),
    `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS
INSERT INTO `configuracoes` (`id`, `site_titulo`, `site_descricao`, `site_keywords`, `cor_primaria`, `cor_secundaria`, `cor_fundo`, `home_h1`, `home_subtitulo`, `camilla_nome`, `camilla_cargo`, `camilla_whatsapp`, `aviso_urgencia`)
VALUES (
    1,
    'Elo & Vanguard | Hub de Soluções Integradas',
    'Manutenção de máquinas em São Gonçalo RJ pela EloMak, Cursos Online Vanguard e BPO Administrativo/RH Digital pela Elo Contábil sem CRC.',
    'conserto maquina costura são gonçalo rj, elomak, cursos vendas vanguard, bpo financeiro sem crc, rh são gonçalo',
    '#00f2fe',
    '#4facfe',
    '#080b11',
    'Tecnologia, Precisão e Alta Performance em um Único Hub',
    'Conectamos você à excelência: reforma e peças de máquinas de costura em São Gonçalo, cursos livres 100% online focados em vendas e BPO administrativo e de RH digital.',
    'Camilla',
    'Head de Triagem & Atendimento Especializado',
    '5521996134073',
    'Orçamento sem compromisso em São Gonçalo e condições especiais nesta semana!'
) ON DUPLICATE KEY UPDATE `site_titulo`=VALUES(`site_titulo`);

-- USUÁRIO PADRÃO (admin / eloizio2026)
INSERT INTO `usuarios` (`usuario`, `senha_hash`, `nome`)
VALUES ('admin', '$2y$10$wTqg.qZz/F3XmF.179JzTeQY0K96.mXw4gH0aD8yL1m59bE8p8Q4G', 'Administrador')
ON DUPLICATE KEY UPDATE `usuario`=VALUES(`usuario`);

-- SERVIÇOS INICIAIS
INSERT INTO `servicos` (`marca`, `titulo`, `subtitulo`, `descricao`, `beneficios`, `preco_texto`, `badge`, `link_destino`, `disponivel`, `ordem`) VALUES
('elomak', 'Reforma & Manutenção de Máquinas Industriais', 'Overlock, Reta, Galoneira, Interlock e Pespontadeira', 'Reforma completa com desmontagem técnica, calibragem de ponto e teste em tecido. Não pare sua produção!', 'Orçamento sem compromisso em São Gonçalo RJ|Regulagem precisa de ponto|Opção Direct Drive econômico|Garantia técnica comprovada', 'Sob consulta (Orçamento Grátis)', 'Atendimento São Gonçalo - RJ', 'https://wa.me/5521996134073', 1, 1),
('elomak', 'Revisão & Regulagem de Máquinas Domésticas', 'Singer, Elgin, Brother, Janome e Vigorelli', 'Limpeza interna completa, lubrificação de engrenagens, eliminação de barulho e teste de tensão de linha.', 'Diagnóstico sem surpresas|Troca de peças com desgaste|Atendimento ágil para ateliês|Garantia pós-serviço', 'A partir de R$ 90,00', 'Orçamento sem compromisso', 'https://wa.me/5521996134073', 1, 2),
('elomak', 'Peças Originais, Motores Direct Drive & Acessórios', 'Lançadeiras, Loopers, Calcadores e Lubrificantes', 'Estoque de reposição imediata para que sua confecção ou ateliê mantenha produtividade sem interrupção.', 'Peças testadas com alta durabilidade|Acessórios para vivos e bainhas|Retirada em São Gonçalo ou envio|Suporte técnico do mecânico', 'Peças a partir de R$ 25,00', 'Pronta Entrega RJ', 'https://wa.me/5521996134073', 1, 3),

('vanguard', 'Formação em Vendas de Alta Performance', 'Do Script de Abordagem ao Fechamento de Alto Ticket', 'Curso 100% online desenvolvido para quem busca empregabilidade imediata ou aumento expressivo de comissão.', 'Acesso vitalício à plataforma|Certificado de conclusão reconhecido|Scripts de WhatsApp prontos|Módulo de quebra de objeções', '12x de R$ 29,90 ou R$ 297', '100% Online · Alta Empregabilidade', 'https://wa.me/5521996134073', 1, 4),
('vanguard', 'Gestão Comercial & Negociação Estratégica', 'Liderança de Vendas e Fechamento B2B e Varejo', 'Aprenda a estruturar metas de vendas, indicadores de conversão e técnicas de persuasão para ascensão executiva.', 'Aulas práticas direto ao ponto|Planilhas prontas de CRM|Suporte para dúvidas dos alunos|Foco em novas vagas e promoções', '12x de R$ 34,90 ou R$ 347', 'Certificado Incluso', 'https://wa.me/5521996134073', 1, 5),
('vanguard', 'Atendimento & Prospecção Ativa via WhatsApp', 'Converta Contatos Frios em Clientes Compradores', 'Configure o WhatsApp Business com catálogo, funil e mensagens de recuperação rápida que multiplicam vendas.', 'Gatilhos mentais aplicados a texto e áudio|Recuperação de clientes desistentes|Simulações de atendimento real|Pronto para aplicar hoje', 'R$ 147,00 à vista', 'Rápido Retorno', 'https://wa.me/5521996134073', 1, 6),

('elocontabil', 'BPO Financeiro & Gestão Administrativa', 'Contas a Pagar, Receber e Conciliação Bancária', 'Terceirização da rotina financeira da sua empresa. Serviços administrativos que não exigem contador registrado no CRC.', 'Emissão de cobranças e conciliação|Relatórios semanais na nuvem|Economia de até 60% vs equipe interna|Atendimento 100% digital', 'Planos a partir de R$ 390/mês', 'Sem Necessidade de CRC', 'https://wa.me/5521996134073', 1, 7),
('elocontabil', 'Terceirização de Rotinas de RH & Departamento Pessoal', 'Admissão, Folha de Ponto, Benefícios e Contratos', 'Gestão operacional de colaboradores. Controle de horas, arquivo digital e envio de holerites sem burocracia.', 'Pastas digitais de cada funcionário|Controle rigoroso de férias e atestados|Comunicados e avisos legais|Tranquilidade para o empresário', 'Planos a partir de R$ 290/mês', 'Eficiência Operacional', 'https://wa.me/5521996134073', 1, 8),
('elocontabil', 'Consultoria de Organização Empresarial & Custos', 'Diagnóstico de Gargalos e Redução de Desperdícios', 'Análise minuciosa de despesas operacionais para cortar juros, renegociar fornecedores e aumentar o lucro líquido.', 'Diagnóstico inicial detalhado|Plano prático em 30 dias|Padronização de processos|Acompanhamento consultivo', 'Sob consulta personalizada', 'Foco em Lucro Líquido', 'https://wa.me/5521996134073', 1, 9);
