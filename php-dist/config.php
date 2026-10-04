<?php
/**
 * CONFIGURAÇÃO DO HUB - GRUPO ELOIZIO
 * Caminho: /var/www/html/grupo-eloizio
 * Servidor: Apache 2.4 + Traefik + Postgres 16 + PHP 8.2
 */

define('ECOSYSTEM_DOMAIN', 'grupoeloizio.com.br');
define('URL_ELOMAK', 'https://elomak.grupoeloizio.com.br');
define('URL_VANGUARD', 'https://vanguard.grupoeloizio.com.br');
define('URL_ELOCONTABIL', 'https://elocontabil.grupoeloizio.com.br');
define('URL_CAMILLA', 'https://camilla.grupoeloizio.com.br');
define('URL_WA_GATEWAY', 'https://wa.grupoeloizio.com.br');
define('CAMILLA_WHATSAPP', '5521996134073');

// Dados do Postgres Unificado do ecossistema
define('PG_HOST', getenv('DB_HOST') ?: 'postgres');
define('PG_PORT', getenv('DB_PORT') ?: '5432');
define('PG_DB', getenv('DB_NAME') ?: 'grupoeloizio');
define('PG_USER', getenv('DB_USER') ?: 'postgres');
define('PG_PASS', getenv('DB_PASS') ?: 'postgres');

// Arquivo de persistência resiliente (caso pdo_pgsql esteja OFF no container)
define('JSON_STORAGE_FILE', __DIR__ . '/storage_hub.json');

$pdo = null;
$db_mode = 'json'; // 'postgres' ou 'json'

if (extension_loaded('pdo_pgsql')) {
    try {
        $dsn = "pgsql:host=" . PG_HOST . ";port=" . PG_PORT . ";dbname=" . PG_DB;
        $pdo = new PDO($dsn, PG_USER, PG_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);
        $db_mode = 'postgres';
    } catch (Exception $e) {
        $pdo = null;
        $db_mode = 'json';
    }
} else if (extension_loaded('pdo_mysql')) {
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=grupoeloizio;charset=utf8mb4", "root", "", [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $db_mode = 'mysql';
    } catch (Exception $e) {
        $pdo = null;
        $db_mode = 'json';
    }
}

// Inicializar JSON caso ainda não exista
if (!file_exists(JSON_STORAGE_FILE)) {
    $initialData = [
        'configuracoes' => [
            'site_titulo' => 'Grupo Eloizio | Hub de Soluções Integradas',
            'site_descricao' => 'Portal central do Grupo Eloizio: EloMak (Máquinas em São Gonçalo RJ), Vanguard Cursos Online e Elo Contábil Digital BPO & RH sem CRC.',
            'site_keywords' => 'grupo eloizio, elomak são gonçalo rj, vanguard cursos, elocontabil bpo, camilla ai',
            'cor_primaria' => '#00f2fe',
            'cor_secundaria' => '#4facfe',
            'cor_fundo' => '#080b11',
            'home_h1' => 'Tecnologia, Precisão e Alta Performance em um Único Hub',
            'home_subtitulo' => 'Portal central do Grupo Eloizio conectando você aos nossos serviços especializados: EloMak em São Gonçalo, Cursos Livres Vanguard e Gestão Administrativa & RH pela Elo Contábil Digital.',
            'camilla_nome' => 'Camilla',
            'camilla_cargo' => 'Head de Triagem & Atendimento Especializado',
            'camilla_whatsapp' => '5521996134073',
            'aviso_urgencia' => 'Atendimento operacional ativo com direcionamento aos portais oficiais da EloMak, Vanguard e Elo Contábil.'
        ],
        'servicos' => [
            [
                'id' => 1,
                'marca' => 'elomak',
                'titulo' => 'Reforma & Manutenção de Máquinas Industriais',
                'subtitulo' => 'Overlock, Reta, Galoneira e Pespontadeira',
                'descricao' => 'Reforma completa com desmontagem técnica, alinhamento micrométrico do ponto, troca de peças com folga e teste prático em São Gonçalo RJ.',
                'beneficios' => 'Orçamento sem compromisso em São Gonçalo|Regulagem precisa de ponto|Opção motor Direct Drive|Garantia sobre os serviços',
                'preco_texto' => 'Sob consulta (Orçamento Grátis)',
                'badge' => 'elomak.grupoeloizio.com.br',
                'link_destino' => 'https://elomak.grupoeloizio.com.br',
                'disponivel' => 1,
                'ordem' => 1
            ],
            [
                'id' => 2,
                'marca' => 'elomak',
                'titulo' => 'Revisão & Regulagem de Máquinas Domésticas',
                'subtitulo' => 'Singer, Elgin, Brother, Janome e Vigorelli',
                'descricao' => 'Limpeza ultrassônica de caixa de bobina, lubrificação especial e regulagem de tensão para costureiras e ateliês em São Gonçalo.',
                'beneficios' => 'Diagnóstico sem surpresas|Troca de engrenagens gastas|Atendimento ágil para ateliês|Testada na entrega',
                'preco_texto' => 'A partir de R$ 90,00',
                'badge' => 'São Gonçalo - RJ',
                'link_destino' => 'https://elomak.grupoeloizio.com.br',
                'disponivel' => 1,
                'ordem' => 2
            ],
            [
                'id' => 3,
                'marca' => 'elomak',
                'titulo' => 'Peças Originais, Motores & Acessórios',
                'subtitulo' => 'Lançadeiras, Loopers, Calcadores e Óleo Especial',
                'descricao' => 'Estoque de reposição rápida para máquinas de costura industriais e domésticas em São Gonçalo RJ.',
                'beneficios' => 'Peças com procedência garantida|Acessórios para vivos e zíper|Retirada em São Gonçalo ou envio|Suporte do mecânico',
                'preco_texto' => 'Peças a partir de R$ 25,00',
                'badge' => 'Pronta Entrega RJ',
                'link_destino' => 'https://elomak.grupoeloizio.com.br',
                'disponivel' => 1,
                'ordem' => 3
            ],
            [
                'id' => 4,
                'marca' => 'vanguard',
                'titulo' => 'Formação em Vendas de Alta Performance',
                'subtitulo' => 'Do Script de Abordagem ao Fechamento',
                'descricao' => 'Curso 100% online desenvolvido para quem busca empregabilidade imediata ou aumento expressivo de comissão em vendas.',
                'beneficios' => 'Acesso imediato à plataforma|Certificado reconhecido|Scripts de WhatsApp prontos|Quebra de objeções',
                'preco_texto' => '12x de R$ 29,90 ou R$ 297',
                'badge' => 'vanguard.grupoeloizio.com.br',
                'link_destino' => 'https://vanguard.grupoeloizio.com.br',
                'disponivel' => 1,
                'ordem' => 4
            ],
            [
                'id' => 5,
                'marca' => 'vanguard',
                'titulo' => 'Gestão Comercial & Negociação Estratégica',
                'subtitulo' => 'Liderança de Vendas B2B e Varejo',
                'descricao' => 'Aprenda a estruturar funis de vendas, metas realistas, CRM e técnicas de persuasão para ascender profissionalmente.',
                'beneficios' => 'Aulas práticas direto ao ponto|Planilhas prontas de CRM|Suporte para dúvidas|Foco em promoção',
                'preco_texto' => '12x de R$ 34,90 ou R$ 347',
                'badge' => 'Certificado Incluso',
                'link_destino' => 'https://vanguard.grupoeloizio.com.br',
                'disponivel' => 1,
                'ordem' => 5
            ],
            [
                'id' => 6,
                'marca' => 'elocontabil',
                'titulo' => 'BPO Financeiro & Gestão Administrativa',
                'subtitulo' => 'Contas a Pagar, Receber e Conciliação Bancária',
                'descricao' => 'Terceirização da rotina financeira do seu negócio. Serviços administrativos que organizam o fluxo de caixa sem exigência de contador no CRC.',
                'beneficios' => 'Emissão de cobranças e conciliação|Relatórios semanais na nuvem|Economia de até 60% vs CLT|Atendimento 100% digital',
                'preco_texto' => 'Planos a partir de R$ 390/mês',
                'badge' => 'elocontabil.grupoeloizio.com.br',
                'link_destino' => 'https://elocontabil.grupoeloizio.com.br',
                'disponivel' => 1,
                'ordem' => 6
            ],
            [
                'id' => 7,
                'marca' => 'elocontabil',
                'titulo' => 'Terceirização de Rotinas de RH & Departamento Pessoal',
                'subtitulo' => 'Admissão, Folha de Ponto, Benefícios e Contratos',
                'descricao' => 'Gestão operacional de colaboradores para PMEs. Cuidamos do controle de horas, férias e holerites com exatidão.',
                'beneficios' => 'Pastas digitais por funcionário|Controle rigoroso de férias|Elaboração de contratos operacionais|Sem CRC necessário',
                'preco_texto' => 'Planos a partir de R$ 290/mês',
                'badge' => 'Sem Necessidade de CRC',
                'link_destino' => 'https://elocontabil.grupoeloizio.com.br',
                'disponivel' => 1,
                'ordem' => 7
            ]
        ],
        'depoimentos' => [
            [
                'id' => 1,
                'nome' => 'Ricardo Menezes',
                'localidade_empresa' => 'Oficina de Confecção Têxtil · Neves, São Gonçalo - RJ',
                'texto' => 'Minha produção em Neves parou com 2 overlocks travadas. A equipe da EloMak veio rápido, fez o orçamento sem compromisso e no dia seguinte já estava tudo costurando perfeito!',
                'rating' => 5,
                'tag_servico' => 'EloMak',
                'resultado_concreto' => '0 dias de produção perdida em SG'
            ],
            [
                'id' => 2,
                'nome' => 'Bianca Albuquerque Duarte',
                'localidade_empresa' => 'Supervisora de Vendas · Rio de Janeiro - RJ',
                'texto' => 'Fiz a formação da Vanguard Cursos. O conteúdo prático de abordagem pelo WhatsApp e quebra de objeções mudou meus resultados. Fui promovida a supervisora!',
                'rating' => 5,
                'tag_servico' => 'Vanguard',
                'resultado_concreto' => '+45% de comissão e promoção'
            ],
            [
                'id' => 3,
                'nome' => 'Carlos Eduardo Peixoto',
                'localidade_empresa' => 'Distribuidora de Alimentos · Niterói / SG',
                'texto' => 'Contratamos a Elo Contábil Digital para o BPO financeiro e RH. Não precisávamos de contador fixo com CRC, apenas de rotina organizada. Economizamos muito todo mês!',
                'rating' => 5,
                'tag_servico' => 'Elo Contábil',
                'resultado_concreto' => 'Economia de R$ 2.400/mês'
            ]
        ],
        'leads' => []
    ];
    file_put_contents(JSON_STORAGE_FILE, json_encode($initialData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Funções auxiliares para leitura e escrita
function get_hub_data() {
    if (!file_exists(JSON_STORAGE_FILE)) return [];
    return json_decode(file_get_contents(JSON_STORAGE_FILE), true) ?: [];
}

function save_hub_data($data) {
    return file_put_contents(JSON_STORAGE_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
