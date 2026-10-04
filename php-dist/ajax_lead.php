<?php
/**
 * Endpoint de Captura de Leads - Hub Elo & Vanguard
 */
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método inválido.']);
    exit;
}

$nome = trim($_POST['nome'] ?? '');
$whatsapp = trim($_POST['whatsapp'] ?? '');
$email = trim($_POST['email'] ?? '');
$servico = trim($_POST['servico'] ?? 'Atendimento Geral');
$marca = trim($_POST['marca'] ?? 'elocontabil');
$observacao = trim($_POST['observacao'] ?? '');

if (empty($nome) || empty($whatsapp)) {
    echo json_encode(['status' => 'error', 'message' => 'Nome e WhatsApp são campos obrigatórios.']);
    exit;
}

try {
    if ($pdo && $db_mode === 'postgres') {
        $stmt = $pdo->prepare("INSERT INTO leads (nome, whatsapp, email, servico_interesse, marca, status, observacao) VALUES (?, ?, ?, ?, ?, 'novo', ?)");
        $stmt->execute([$nome, $whatsapp, $email, $servico, $marca, $observacao]);
    } else {
        // Fallback para JSON local
        $data = get_hub_data();
        $data['leads'][] = [
            'id' => time(),
            'nome' => $nome,
            'whatsapp' => $whatsapp,
            'email' => $email,
            'servico_interesse' => $servico,
            'marca' => $marca,
            'status' => 'novo',
            'observacao' => $observacao,
            'data_hora' => date('Y-m-d H:i:s')
        ];
        save_hub_data($data);
    }
    
    // Obter dados da Camilla
    $zapCamilla = CAMILLA_WHATSAPP;

    // Gerar link formatado do WhatsApp
    $msg = "Olá Camilla, meu nome é {$nome}. Vi o serviço \"{$servico}\" no portal grupoeloizio.com.br e gostaria de atendimento exclusivo.";
    if (!empty($observacao)) {
        $msg .= " Observação: {$observacao}";
    }
    $waUrl = "https://wa.me/{$zapCamilla}?text=" . rawurlencode($msg);

    echo json_encode([
        'status' => 'success',
        'message' => 'Lead registrado com sucesso!',
        'whatsapp_url' => $waUrl
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar lead: ' . $e->getMessage()]);
}
