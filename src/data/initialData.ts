import { ServiceItem, Testimonial, SiteConfig, Lead, SystemKeysConfig } from '../types';

export const INITIAL_CONFIG: SiteConfig = {
  siteTitulo: 'Grupo Eloizio | Hub de Soluções Integradas',
  siteDescricao: 'Portal unificado do Grupo Eloizio: EloMak (Máquinas de Costura São Gonçalo RJ), Vanguard Cursos Profissionalizantes e Elo Contábil Digital BPO & RH sem CRC.',
  siteKeywords: 'grupo eloizio, elomak são gonçalo rj, elocontabil grupo eloizio, vanguard cursos online, conserto maquinas costura são gonçalo, camilla inteligência artificial',
  corPrimaria: '#00f2fe',
  corSecundaria: '#4facfe',
  corFundo: '#080b11',
  homeH1: 'Tecnologia, Precisão e Alta Performance em um Único Hub',
  homeSubtitulo: 'Portal central do Grupo Eloizio conectando você aos nossos serviços especializados: EloMak em São Gonçalo, Cursos Livres Vanguard e Gestão Administrativa & RH pela Elo Contábil Digital.',
  camillaNome: 'Camilla',
  camillaCargo: 'Head de Triagem & Atendimento Especializado',
  camillaWhatsApp: '5521996134073',
  camillaMensagemPadrao: 'Olá Camilla, vim através do portal grupoeloizio.com.br. Gostaria de atendimento para: ',
  seoLocalidadePrincipal: 'São Gonçalo - RJ e Atendimento Nacional Online',
  avisoUrgencia: 'Atendimento operacional ativo com direcionamento aos portais oficiais da EloMak, Vanguard e Elo Contábil.'
};

export const INITIAL_SERVICES: ServiceItem[] = [
  // --- ELOMAK (elomak.grupoeloizio.com.br) ---
  {
    id: 'elomak-01',
    marca: 'elomak',
    titulo: 'Reforma & Manutenção de Máquinas Industriais',
    subtitulo: 'Overlock, Reta, Galoneira, Interlock e Pespontadeira',
    descricao: 'Reforma completa com desmontagem técnica, alinhamento micrométrico do ponto, troca de peças com folga e teste prático de costura. Não deixe a sua confecção parar!',
    beneficios: [
      'Orçamento sem compromisso em São Gonçalo e região',
      'Regulagem precisa de ponto para malha, jeans e tecidos finos',
      'Opção de troca de motor tradicional por Direct Drive econômico',
      'Garantia sobre os serviços executados'
    ],
    precoTexto: 'Sob consulta (Orçamento Grátis)',
    badge: 'elomak.grupoeloizio.com.br',
    linkDestino: 'https://elomak.grupoeloizio.com.br',
    disponivel: true,
    ordem: 1
  },
  {
    id: 'elomak-02',
    marca: 'elomak',
    titulo: 'Revisão & Regulagem de Máquinas Domésticas',
    subtitulo: 'Singer, Elgin, Brother, Janome e Vigorelli',
    descricao: 'Limpeza ultrassônica de caixa de bobina, lubrificação especial com óleo sintético neutro, eliminação de ruídos e calibragem de tensão superior e inferior.',
    beneficios: [
      'Diagnóstico transparente e sem surpresas',
      'Troca de engrenagens de nylon e correias desgastadas',
      'Atendimento ágil para costureiras e ateliês locais',
      'Testada na entrega com o seu próprio tecido'
    ],
    precoTexto: 'A partir de R$ 90,00',
    badge: 'São Gonçalo - RJ',
    linkDestino: 'https://elomak.grupoeloizio.com.br',
    disponivel: true,
    ordem: 2
  },
  {
    id: 'elomak-03',
    marca: 'elomak',
    titulo: 'Peças Originais, Acessórios & Motores Industriais',
    subtitulo: 'Lançadeiras, Loopers, Calcadores e Óleo Específico',
    descricao: 'Estoque de reposição rápida para máquinas de costura. Peças testadas com alta durabilidade mecânica para que sua produção mantenha produtividade contínua.',
    beneficios: [
      'Peças novas e revisadas com procedência garantida',
      'Acessórios para vivos, elásticos, bainhas e zíper invisível',
      'Retirada em São Gonçalo ou envio expresso',
      'Orientação técnica da equipe de mecânicos'
    ],
    precoTexto: 'Peças a partir de R$ 25,00',
    badge: 'Pronta Entrega RJ',
    linkDestino: 'https://elomak.grupoeloizio.com.br',
    disponivel: true,
    ordem: 3
  },

  // --- VANGUARD CURSOS (vanguard.grupoeloizio.com.br) ---
  {
    id: 'vanguard-01',
    marca: 'vanguard',
    titulo: 'Formação em Vendas de Alta Performance',
    subtitulo: 'Do Script de Abordagem ao Fechamento de Alto Ticket',
    descricao: 'Curso 100% online desenvolvido para quem busca empregabilidade imediata ou aumento expressivo de comissão. Metodologia prática baseada no comportamento do consumidor moderno.',
    beneficios: [
      'Acesso imediato e vitalício à plataforma digital',
      'Certificado de conclusão reconhecido para currículo',
      'Scripts prontos de WhatsApp, telefone e abordagem presencial',
      'Módulo exclusivo sobre contorno de objeções em vendas'
    ],
    precoTexto: '12x de R$ 29,90 ou R$ 297 à vista',
    badge: 'vanguard.grupoeloizio.com.br',
    linkDestino: 'https://vanguard.grupoeloizio.com.br',
    disponivel: true,
    ordem: 4
  },
  {
    id: 'vanguard-02',
    marca: 'vanguard',
    titulo: 'Gestão Comercial & Negociação Estratégica',
    subtitulo: 'Liderança de Vendas e Fechamento B2B e Varejo',
    descricao: 'Aprenda a estruturar funis de vendas, metas de vendas realistas, indicadores de conversão e técnicas de persuasão para ascender na carreira executiva comercial.',
    beneficios: [
      'Aulas práticas direto ao ponto, sem enrolação teórica',
      'Planilhas prontas de CRM e controle de pipeline',
      'Suporte para dúvidas e comunidade de alunos',
      'Foco direto na conquista de novos cargos e promoções'
    ],
    precoTexto: '12x de R$ 34,90 ou R$ 347 à vista',
    badge: 'Certificado Incluso',
    linkDestino: 'https://vanguard.grupoeloizio.com.br',
    disponivel: true,
    ordem: 5
  },
  {
    id: 'vanguard-03',
    marca: 'vanguard',
    titulo: 'Atendimento & Prospecção Ativa via WhatsApp',
    subtitulo: 'Converta Contatos Frios em Clientes Compradores',
    descricao: 'Como configurar o WhatsApp Business profissionalmente, criar catálogos que vendem sozinhos, etiquetas de acompanhamento e rotinas de resposta que multiplicam conversões.',
    beneficios: [
      'Gatilhos mentais aplicados a mensagens de texto e áudio',
      'Técnicas de recuperação de clientes perdidos e desistentes',
      'Exercícios práticos com simulações de atendimento real',
      'Estudo de casos reais de negócios que escalaram faturamento'
    ],
    precoTexto: 'Apenas R$ 147,00 à vista',
    badge: 'Rápido Retorno',
    linkDestino: 'https://vanguard.grupoeloizio.com.br',
    disponivel: true,
    ordem: 6
  },

  // --- ELO CONTÁBIL DIGITAL (elocontabil.grupoeloizio.com.br) ---
  {
    id: 'elo-01',
    marca: 'elocontabil',
    titulo: 'BPO Financeiro & Gestão Administrativa para Empresas',
    subtitulo: 'Contas a Pagar, Contas a Receber e Conciliação Bancária',
    descricao: 'Terceirização completa da rotina financeira do seu negócio. Serviços administrativos que organizam o fluxo de caixa sem a exigência de contador registrado no CRC.',
    beneficios: [
      'Emissão e controle de cobranças e faturamento mensal',
      'Relatórios semanais de fluxo de caixa em painel digital',
      'Redução de até 60% nos custos de manter um setor interno',
      'Atendimento 100% digital e seguro via nuvem'
    ],
    precoTexto: 'Planos a partir de R$ 390/mês',
    badge: 'elocontabil.grupoeloizio.com.br',
    linkDestino: 'https://elocontabil.grupoeloizio.com.br',
    disponivel: true,
    ordem: 7
  },
  {
    id: 'elo-02',
    marca: 'elocontabil',
    titulo: 'Terceirização de Rotinas de RH & Departamento Pessoal',
    subtitulo: 'Admissão, Folha de Ponto, Benefícios e Contratos',
    descricao: 'Gestão operacional de pessoas para pequenos e médios negócios. Cuidamos do controle de horas, envio de holerites e arquivo de documentações trabalhistas com exatidão.',
    beneficios: [
      'Organização de pastas digitais de colaboradores',
      'Controle rigoroso de férias, faltas e atestados',
      'Elaboração de comunicados internos e regulamentos da empresa',
      'Tranquilidade para os proprietários focarem nas vendas'
    ],
    precoTexto: 'Planos a partir de R$ 290/mês',
    badge: 'Sem Necessidade de CRC',
    linkDestino: 'https://elocontabil.grupoeloizio.com.br',
    disponivel: true,
    ordem: 8
  },
  {
    id: 'elo-03',
    marca: 'elocontabil',
    titulo: 'Consultoria de Organização Empresarial & Custos',
    subtitulo: 'Diagnóstico de Gargalos e Redução de Gastos Desnecessários',
    descricao: 'Análise minuciosa das despesas operacionais da sua empresa para identificar desperdícios em fornecedores, juros bancários e despesas fixas excessivas.',
    beneficios: [
      'Diagnóstico inicial completo das contas da empresa',
      'Plano de ação prático com metas de economia em 30 dias',
      'Padronização de processos administrativos e compras',
      'Acompanhamento direto com especialistas em gestão'
    ],
    precoTexto: 'Sob consulta personalizada',
    badge: 'Foco em Lucro',
    linkDestino: 'https://elocontabil.grupoeloizio.com.br',
    disponivel: true,
    ordem: 9
  },
  // --- ELOSIGN (sign.grupoeloizio.com.br) - Plataforma SaaS de Assinatura ---
  {
    id: 'elosign-01',
    marca: 'elosign',
    titulo: 'EloSign Starter · 10 Assinaturas Jurídicas por Mês',
    subtitulo: 'Assinatura Eletrônica Avançada (Lei 14.063/2020) com Notificação WhatsApp',
    descricao: 'Ideal para associados, autônomos e pequenos escritórios. Envie contratos pelo WhatsApp e colete assinaturas com prova de IP, data/hora e manifesto jurídico sem pagar DocuSign.',
    beneficios: [
      '10 assinaturas eletrônicas inclusas por mês',
      'Disparo automático de link e token via WhatsApp (EloWa)',
      'Manifesto de assinaturas gerado automaticamente no fim do PDF',
      'Economia de até 80% comparado a plataformas externas'
    ],
    precoTexto: 'R$ 49,90 / mês',
    badge: 'Lei 14.063/2020',
    linkDestino: 'https://sign.grupoeloizio.com.br',
    disponivel: true,
    ordem: 10
  },
  {
    id: 'elosign-02',
    marca: 'elosign',
    titulo: 'EloSign Business · 50 Assinaturas + Portal Verificador',
    subtitulo: 'Para Empresas, Imobiliárias e Escritórios Contábeis',
    descricao: 'Pacote corporativo com 50 assinaturas mensais, integração com o portal público de verificação (valida.grupoeloizio.com.br) e painel multiusuário para associados.',
    beneficios: [
      '50 envelopes de assinatura por mês inclusos',
      'Validação pública instantânea por QR Code ou Código',
      'Painel de gestão de clientes e documentos aguardando assinatura',
      'Suporte direto da Camilla IA para lembretes de pendências'
    ],
    precoTexto: 'R$ 149,90 / mês',
    badge: 'Mais Popular',
    linkDestino: 'https://sign.grupoeloizio.com.br',
    disponivel: true,
    ordem: 11
  },
  {
    id: 'elosign-03',
    marca: 'elosign',
    titulo: 'EloSign Enterprise · Assinaturas Ilimitadas + White Label',
    subtitulo: 'Sua Própria Plataforma de Assinatura (Marca e Domínio Próprio)',
    descricao: 'Solução completa para grandes operações. Assinaturas ilimitadas, subdomínio personalizado do associado e integração direta via API com n8n ou ERP.',
    beneficios: [
      'Assinaturas eletrônicas ilimitadas sem custo por envelope',
      'White Label: link com a marca e domínio da sua empresa',
      'Chave de API dedicada (x-api-key) para automação n8n',
      'Banco de dados PostgreSQL dedicado com trilha de auditoria'
    ],
    precoTexto: 'R$ 499,90 / mês',
    badge: 'Ilimitado & White Label',
    linkDestino: 'https://sign.grupoeloizio.com.br',
    disponivel: true,
    ordem: 12
  },
  {
    id: 'elosign-04',
    marca: 'elosign',
    titulo: 'EloSign Envelope Avulso · Assine por Demanda',
    subtitulo: 'Pague Apenas pelo que Usar · Sem Mensalidade Fixa',
    descricao: 'Perfeito para quem precisa colher assinatura jurídica em contratos esporádicos. Recibos, termos de garantia ou contratos de prestação avulsos.',
    beneficios: [
      'Apenas R$ 2,50 por documento assinado',
      'Validade jurídica inquestionável com carimbo forense e IP',
      'Notificação automática do assinante no WhatsApp',
      'Armazenamento seguro em PDF com Manifesto'
    ],
    precoTexto: 'R$ 2,50 por doc',
    badge: 'Sem Mensalidade',
    linkDestino: 'https://sign.grupoeloizio.com.br',
    disponivel: true,
    ordem: 13
  },
  // --- ELOAUTÊNTICO (valida.grupoeloizio.com.br) ---
  {
    id: 'eloautentico-01',
    marca: 'eloautentico',
    titulo: 'EloAutêntico: Carimbo Digital & QR Code de Verificação',
    subtitulo: 'Autenticidade In-House com Hash SHA-256 e Validador Público',
    descricao: 'Transforme qualquer documento emitido (recibos, laudos de máquinas, declarações financeiras) em um título auditável com QR Code e página pública de verificação em valida.grupoeloizio.com.br.',
    beneficios: [
      'Carimbo de integridade com Hash SHA-256 inviolável',
      'Página pública de consulta aberta a órgãos públicos e clientes',
      'Evidência forense de autoria e carimbo de tempo no PostgreSQL',
      'Compatível com a Lei 14.063/2020 e MP 2.200-2/2001'
    ],
    precoTexto: 'Incluso nos Planos ou Sob Consulta',
    badge: 'valida.grupoeloizio.com.br',
    linkDestino: 'https://valida.grupoeloizio.com.br',
    disponivel: true,
    ordem: 14
  },
  // --- ELOMAIL (mail.grupoeloizio.com.br) ---
  {
    id: 'elomail-01',
    marca: 'elomail',
    titulo: 'EloMail Gateway: Disparo Transacional e PDF Automático',
    subtitulo: 'API de E-mails com Geração de Anexo PDF e Integração n8n',
    descricao: 'Gateway segura de mensageria corporativa conectada ao SMTP da Hostinger. Permite à Camilla IA e ao n8n disparar faturas, termos e notificações com PDFs gerados em tempo real.',
    beneficios: [
      'Integração via API REST com chave mestra de segurança (x-api-key)',
      'Geração dinâmica de PDF pelo motor FPDF sem consumir APIs pagas',
      'Configurado para o Traefik com TLS Let\'s Encrypt gratuito',
      'Logs completos de entrega e armazenamento na pasta segura do VPS'
    ],
    precoTexto: 'API Dedicada Hostinger',
    badge: 'mail.grupoeloizio.com.br',
    linkDestino: 'https://mail.grupoeloizio.com.br',
    disponivel: true,
    ordem: 15
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-01',
    nome: 'Ricardo Menezes',
    localidadeEmpresa: 'Oficina de Confecção Têxtil · Neves, São Gonçalo - RJ',
    texto: 'Minha produção em Neves parou com 2 overlocks travadas na véspera de entrega de lote. A equipe da EloMak veio rapidamente, realizou o orçamento sem compromisso e no dia seguinte as máquinas estavam costurando perfeitas!',
    rating: 5,
    tagServico: 'EloMak',
    resultadoConcreto: '0 dias de produção perdida em São Gonçalo',
    data: '15/09/2026'
  },
  {
    id: 't-02',
    nome: 'Bianca Albuquerque Duarte',
    localidadeEmpresa: 'Supervisora de Vendas · Rio de Janeiro - RJ',
    texto: 'Fiz a formação em Vendas da Vanguard Cursos. O conteúdo prático de abordagem pelo WhatsApp e quebra de objeções mudou a minha postura. Fui promovida a supervisora com aumento de 45% nos meus ganhos.',
    rating: 5,
    tagServico: 'Vanguard',
    resultadoConcreto: '+45% de comissão e promoção rápida',
    data: '02/09/2026'
  },
  {
    id: 't-03',
    nome: 'Carlos Eduardo Peixoto',
    localidadeEmpresa: 'Distribuidora de Alimentos · Niterói / SG',
    texto: 'Contratamos a Elo Contábil Digital para o BPO financeiro e rotinas de RH. Não precisávamos de um contador fixo interno com CRC, apenas de gestão profissional e sem falhas. Economizamos muito por mês!',
    rating: 5,
    tagServico: 'Elo Contábil',
    resultadoConcreto: 'Economia de R$ 2.400/mês em custos operacionais',
    data: '21/08/2026'
  },
  {
    id: 't-04',
    nome: 'Marlene Silva Antunes',
    localidadeEmpresa: 'Ateliê de Moda Sob Medida · Alcântara, São Gonçalo',
    texto: 'Minha máquina doméstica Brother estava com o ponto frouxo há semanas. O mecânico da EloMak fez a limpeza, trocou uma engrenagem gasta e a máquina ficou como nova. Indico de olhos fechados!',
    rating: 5,
    tagServico: 'EloMak',
    resultadoConcreto: 'Ponto firme e máquina 100% silenciosa',
    data: '10/08/2026'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-01',
    nome: 'Juliana Costa',
    whatsapp: '21988776655',
    email: 'juliana.costa@gmail.com',
    servicoInteresse: 'Reforma & Manutenção de Máquinas Industriais',
    marca: 'elomak',
    dataHora: '2026-09-30 14:22',
    status: 'em_atendimento',
    observacao: 'Possui 3 retas industriais com vibração em Alcântara.'
  },
  {
    id: 'lead-02',
    nome: 'Marcos Vinicius Andrade',
    whatsapp: '21976543210',
    email: 'marcos.vini@outlook.com',
    servicoInteresse: 'Formação em Vendas de Alta Performance',
    marca: 'vanguard',
    dataHora: '2026-09-29 18:40',
    status: 'convertido',
    observacao: 'Matriculou-se no curso com foco em vendas ativas.'
  },
  {
    id: 'lead-03',
    nome: 'Cláudio Ferreira - MEI',
    whatsapp: '21991234567',
    servicoInteresse: 'BPO Financeiro & Gestão Administrativa para Empresas',
    marca: 'elocontabil',
    dataHora: '2026-09-28 11:15',
    status: 'novo',
    observacao: 'Quer organizar contas a pagar e fluxo de caixa de marcenaria.'
  }
];

export const INITIAL_SYSTEM_KEYS: SystemKeysConfig = {
  // Mercado Pago
  mpAccessToken: 'APP_USR-6789123456789012-100203-abcdef1234567890abcdef1234567890-704814245',
  mpPublicKey: 'APP_USR-78901234-5678-4901-8234-abcdef123456',
  mpWebhookSecret: 'whsec_mercadopago_grupoeloizio_prod_2026',
  mpPixKey: '21996134073',

  // Camilla AI & WhatsApp
  camillaBrainApiKey: 'camilla_brain_sec_eloizio_2026_rio',
  camillaDomain: 'https://camilla.grupoeloizio.com.br',
  whatsappToken: 'wa_token_baileys_eloizio_996134073',
  waDomain: 'https://wa.grupoeloizio.com.br',
  baileysEndpoint: 'https://elowa.grupoeloizio.com.br',

  // EloMail, EloSign & Hostinger
  apiKeyMaster: 'elo_master_key_hostinger_vps_2026',
  smtpHost: 'smtp.hostinger.com',
  smtpPort: 465,
  smtpUser: 'contato@grupoeloizio.com.br',
  smtpPass: '••••••••••••••••',
  smtpSecure: 'ssl',
  smtpFromName: 'Grupo Eloizio | Atendimento Oficial',

  // PostgreSQL 16
  pgHost: 'localhost',
  pgPort: 5432,
  pgDb: 'grupoeloizio',
  pgUser: 'postgres',
  pgPass: 'postgres',

  // Subdomínios & Endpoints
  mailDomain: 'https://mail.grupoeloizio.com.br/api.php',
  validaDomain: 'https://valida.grupoeloizio.com.br',
  signDomain: 'https://sign.grupoeloizio.com.br',

  // Automações & Webhooks
  n8nWebhookUrl: 'https://n8n.grupoeloizio.com.br/webhook/leads-grupoeloizio',
  n8nApiKey: 'n8n_sec_leads_orchestrator_2026',
  traefikTlsCertResolver: 'letsencrypt',

  // Rastreamento & Scripts
  gtmId: 'GTM-ELZ2026',
  ga4Id: 'G-ELOIZIO2026',
  metaPixelId: '987654321098765',
  customHeadScripts: '',
  customBodyScripts: '',
  leadWebhookUrl: 'https://n8n.grupoeloizio.com.br/webhook/hub-leads',

  updatedAt: new Date().toISOString()
};

