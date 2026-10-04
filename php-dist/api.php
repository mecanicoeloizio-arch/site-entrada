<?php
/**
 * REST API ROUTER - GRUPO ELOIZIO
 * Caminho: /var/www/html/grupo-eloizio/api.php
 * Conexão com Postgres 16 (postgres:16-alpine) ou JSON fallback
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Obter endpoint relativo (ex: /api/health ou /health)
$endpoint = preg_replace('#^.*?api/#', '', $uri);
$endpoint = trim($endpoint, '/');

$hubData = get_hub_data();

switch ($endpoint) {
    // 1. GET /api/health
    case 'health':
        $tableCounts = [
            'clientes' => count($hubData['leads'] ?? []),
            'servicos' => count($hubData['servicos'] ?? []),
            'depoimentos' => count($hubData['depoimentos'] ?? [])
        ];

        if ($pdo && $db_mode === 'postgres') {
            try {
                $c = $pdo->query("SELECT COUNT(*) FROM clientes")->fetchColumn();
                $s = $pdo->query("SELECT COUNT(*) FROM servicos")->fetchColumn();
                $d = $pdo->query("SELECT COUNT(*) FROM depoimentos")->fetchColumn();
                $tableCounts = ['clientes' => (int)$c, 'servicos' => (int)$s, 'depoimentos' => (int)$d];
            } catch (Exception $e) {}
        }

        echo json_encode([
            'status' => 'online',
            'server_time' => date('c'),
            'domain' => ECOSYSTEM_DOMAIN,
            'database' => [
                'type' => 'PostgreSQL 16 (postgres:16-alpine)',
                'database_name' => PG_DB,
                'user' => PG_USER,
                'connected' => ($db_mode === 'postgres' && $pdo !== null),
                'mode' => $db_mode,
                'tables' => ['clientes', 'conversas', 'cerebro_camilla', 'configuracoes', 'servicos', 'depoimentos'],
                'counts' => $tableCounts
            ],
            'subdomains' => [
                'hub' => 'https://' . ECOSYSTEM_DOMAIN,
                'elomak' => URL_ELOMAK,
                'vanguard' => URL_VANGUARD,
                'elocontabil' => URL_ELOCONTABIL,
                'camilla' => URL_CAMILLA,
                'wa' => URL_WA_GATEWAY
            ]
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

    // 2. GET /api/config & PUT /api/config
    case 'config':
        if ($method === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            if ($input) {
                $hubData['configuracoes'] = array_merge($hubData['configuracoes'] ?? [], $input);
                save_hub_data($hubData);
            }
            echo json_encode(['success' => true, 'config' => $hubData['configuracoes']]);
        } else {
            echo json_encode($hubData['configuracoes'] ?? []);
        }
        break;

    // 3. GET /api/services & POST /api/services
    case 'services':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $newItem = array_merge([
                'id' => 'srv-' . time(),
                'marca' => 'elomak',
                'titulo' => '',
                'preco_texto' => 'Sob consulta',
                'disponivel' => 1
            ], $input ?? []);
            $hubData['servicos'][] = $newItem;
            save_hub_data($hubData);
            echo json_encode($newItem);
        } else if ($method === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            $serviceId = $input['id'] ?? ($_GET['id'] ?? null);
            if ($serviceId) {
                foreach ($hubData['servicos'] as &$s) {
                    if (($s['id'] ?? '') === $serviceId) {
                        $s = array_merge($s, $input);
                        break;
                    }
                }
                save_hub_data($hubData);
            }
            echo json_encode(['success' => true, 'service' => $input]);
        } else if ($method === 'DELETE') {
            $serviceId = $_GET['id'] ?? null;
            if ($serviceId) {
                $hubData['servicos'] = array_values(array_filter($hubData['servicos'] ?? [], fn($s) => ($s['id'] ?? '') !== $serviceId));
                save_hub_data($hubData);
            }
            echo json_encode(['success' => true]);
        } else {
            $marca = $_GET['marca'] ?? null;
            $items = $hubData['servicos'] ?? [];
            if ($marca && $marca !== 'todos') {
                $items = array_values(array_filter($items, fn($s) => ($s['marca'] ?? '') === $marca));
            }
            echo json_encode($items);
        }
        break;

    // 3.5 GET & PUT /api/system-keys
    case 'system-keys':
        if ($method === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            $hubData['system_keys'] = array_merge($hubData['system_keys'] ?? [], $input ?? []);
            save_hub_data($hubData);
            echo json_encode(['success' => true, 'keys' => $hubData['system_keys']]);
        } else {
            echo json_encode($hubData['system_keys'] ?? [
                'mpAccessToken' => '',
                'mpPublicKey' => '',
                'mpPixKey' => '21996134073',
                'camillaDomain' => URL_CAMILLA,
                'smtpHost' => 'smtp.hostinger.com',
                'smtpPort' => 465,
                'smtpUser' => 'contato@grupoeloizio.com.br'
            ]);
        }
        break;

    // 4. GET /api/leads & POST /api/leads
    case 'leads':
        if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $nome = trim($input['nome'] ?? '');
            $whatsapp = trim($input['whatsapp'] ?? '');
            $servico = trim($input['servicoInteresse'] ?? 'Atendimento Geral');
            $marca = trim($input['marca'] ?? 'elomak');
            $observacao = trim($input['observacao'] ?? '');

            if (empty($nome) || empty($whatsapp)) {
                http_response_code(400);
                echo json_encode(['error' => 'Nome e WhatsApp são obrigatórios']);
                exit;
            }

            $newLead = [
                'id' => time(),
                'nome' => $nome,
                'whatsapp' => $whatsapp,
                'email' => $input['email'] ?? '',
                'servicoInteresse' => $servico,
                'marca' => $marca,
                'status' => 'novo',
                'observacao' => $observacao,
                'dataHora' => date('d/m/Y H:i')
            ];

            // Inserir no Postgres nas tabelas oficiais se conectado
            if ($pdo && $db_mode === 'postgres') {
                try {
                    $stmt = $pdo->prepare("INSERT INTO clientes (nome, whatsapp, email, servico_interesse, marca, status, observacao) VALUES (?, ?, ?, ?, ?, 'novo', ?) RETURNING id");
                    $stmt->execute([$nome, $whatsapp, $input['email'] ?? null, $servico, $marca, $observacao]);
                    $dbId = $stmt->fetchColumn();
                    $newLead['id'] = (int)$dbId;

                    // Registro em conversas
                    $pdo->prepare("INSERT INTO conversas (cliente_id, canal, direcao, mensagem) VALUES (?, 'whatsapp', 'inbound', ?)")
                        ->execute([$dbId, "Lead cadastrado para {$servico}. Obs: {$observacao}"]);

                    // Registro em cerebro_camilla
                    $pdo->prepare("INSERT INTO cerebro_camilla (cliente_id, intencao, memoria) VALUES (?, ?, ?)")
                        ->execute([$dbId, "solicitacao_{$marca}", json_encode(['servico' => $servico, 'cliente' => $nome])]);
                } catch (Exception $e) {}
            }

            // Grava no storage JSON
            $hubData['leads'][] = $newLead;
            save_hub_data($hubData);

            $msg = "Olá Camilla, meu nome é {$nome}. Vi o serviço \"{$servico}\" no portal grupoeloizio.com.br e gostaria de atendimento exclusivo.";
            if ($observacao) $msg .= " Detalhes: {$observacao}";
            $waUrl = "https://wa.me/" . CAMILLA_WHATSAPP . "?text=" . rawurlencode($msg);

            echo json_encode([
                'success' => true,
                'lead' => $newLead,
                'whatsapp_url' => $waUrl
            ]);
        } else {
            echo json_encode($hubData['leads'] ?? []);
        }
        break;

    // 5. POST /api/camilla/triage
    case 'camilla/triage':
    case 'camilla':
        $input = json_decode(file_get_contents('php://input'), true);
        $prioridade = $input['prioridade'] ?? 'elomak';
        
        $rec = [
            'brand' => 'elomak',
            'nome' => 'EloMak Máquinas de Costura',
            'subdomain' => URL_ELOMAK,
            'servico' => 'Reforma e Manutenção em São Gonçalo - RJ',
            'whatsappMessage' => 'Olá Camilla, preciso de conserto ou peças de máquinas de costura em São Gonçalo RJ.'
        ];

        if ($prioridade === 'vanguard') {
            $rec = [
                'brand' => 'vanguard',
                'nome' => 'Vanguard Cursos Profissionalizantes',
                'subdomain' => URL_VANGUARD,
                'servico' => 'Cursos 100% Online de Vendas de Alta Performance',
                'whatsappMessage' => 'Olá Camilla, quero me matricular nos cursos de vendas da Vanguard.'
            ];
        } else if ($prioridade === 'elocontabil') {
            $rec = [
                'brand' => 'elocontabil',
                'nome' => 'Elo Contábil Digital',
                'subdomain' => URL_ELOCONTABIL,
                'servico' => 'BPO Financeiro e Rotinas de RH sem CRC',
                'whatsappMessage' => 'Olá Camilla, gostaria de cotar BPO financeiro e RH para minha empresa.'
            ];
        }

        echo json_encode([
            'recommendation' => $rec,
            'whatsapp_url' => 'https://wa.me/' . CAMILLA_WHATSAPP . '?text=' . rawurlencode($rec['whatsappMessage']),
            'camilla_ai_gateway' => URL_CAMILLA
        ]);
        break;

    // 6. Direct PostgreSQL Inspect Endpoints
    case 'db/clientes':
        if ($pdo && $db_mode === 'postgres') {
            try {
                $stmt = $pdo->query("SELECT * FROM clientes ORDER BY id DESC LIMIT 100");
                echo json_encode($stmt->fetchAll());
                break;
            } catch (Exception $e) {}
        }
        echo json_encode($hubData['leads'] ?? []);
        break;

    case 'db/conversas':
        if ($pdo && $db_mode === 'postgres') {
            try {
                $clienteId = isset($_GET['cliente_id']) ? (int)$_GET['cliente_id'] : null;
                $sql = $clienteId ? "SELECT * FROM conversas WHERE cliente_id = ? ORDER BY timestamp DESC LIMIT 50" : "SELECT * FROM conversas ORDER BY timestamp DESC LIMIT 50";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($clienteId ? [$clienteId] : []);
                echo json_encode($stmt->fetchAll());
                break;
            } catch (Exception $e) {}
        }
        echo json_encode([]);
        break;

    case 'db/cerebro_camilla':
        if ($pdo && $db_mode === 'postgres') {
            try {
                $stmt = $pdo->query("SELECT * FROM cerebro_camilla ORDER BY timestamp DESC LIMIT 50");
                echo json_encode($stmt->fetchAll());
                break;
            } catch (Exception $e) {}
        }
        echo json_encode([]);
        break;

    case 'db/diagnostics':
        echo json_encode([
            'postgres_host' => PG_HOST,
            'postgres_port' => PG_PORT,
            'postgres_db' => PG_DB,
            'postgres_user' => PG_USER,
            'driver_loaded' => extension_loaded('pdo_pgsql'),
            'curl_loaded' => extension_loaded('curl'),
            'mode' => $db_mode,
            'docker_driver_fix' => 'docker exec -it <container_php> apt-get update && docker exec -it <container_php> apt-get install -y php8.2-pgsql && docker exec -it <container_php> service apache2 restart',
            'domain' => ECOSYSTEM_DOMAIN
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint não encontrado', 'endpoint' => $endpoint]);
        break;
}
