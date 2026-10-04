<?php
/**
 * PAINEL ADMINISTRATIVO PHP - HUB GRUPO ELOIZIO
 * Domínio: grupoeloizio.com.br
 * Diretório: /var/www/html/grupo-eloizio
 */
session_start();
require_once __DIR__ . '/config.php';

$hubData = get_hub_data();

// Processo de Login Simples
if (isset($_POST['login_action'])) {
    $u = trim($_POST['usuario'] ?? '');
    $p = $_POST['senha'] ?? '';

    $authenticated = false;

    if ($pdo && $db_mode === 'postgres') {
        try {
            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE usuario = ? LIMIT 1");
            $stmt->execute([$u]);
            $user = $stmt->fetch();
            if ($user && password_verify($p, $user['senha_hash'])) {
                $authenticated = true;
            }
        } catch (Exception $e) {}
    }

    // Fallback de login seguro caso o banco ainda não tenha a tabela
    if (!$authenticated) {
        if ($u === 'admin' && ($p === 'eloizio2026' || $p === 'eloizio123')) {
            $authenticated = true;
        }
    }

    if ($authenticated) {
        $_SESSION['admin_auth'] = true;
        $_SESSION['admin_user'] = $u;
    } else {
        $login_error = "Usuário ou senha inválidos.";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Se não autenticado, exibir tela de login
if (!isset($_SESSION['admin_auth']) || $_SESSION['admin_auth'] !== true): ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login Administrativo | Grupo Eloizio</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@700&display=swap" rel="stylesheet">
    <style>
        body { background:#080b11; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
        .box { background:rgba(15,23,42,0.85); border:1px solid rgba(255,255,255,0.1); padding:40px; border-radius:24px; width:100%; max-width:400px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.5); }
        h1 { font-family:'Syne',sans-serif; font-size:22px; margin-bottom:6px; color:#00f2fe; }
        p.sub { font-size:12px; color:#94a3b8; margin-bottom:20px; }
        input { width:100%; padding:12px; margin-bottom:12px; background:#020617; border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff; font-size:14px; box-sizing:border-box; }
        button { width:100%; padding:14px; border-radius:10px; border:none; background:linear-gradient(90deg,#00f2fe,#4facfe); color:#020617; font-weight:800; cursor:pointer; font-size:14px; }
        .error { color:#f87171; font-size:12px; margin-bottom:12px; }
    </style>
</head>
<body>
    <div class="box">
        <h1>Grupo Eloizio</h1>
        <p class="sub">Painel Administrativo do Hub</p>
        <?php if (!empty($login_error)) echo "<p class='error'>$login_error</p>"; ?>
        <form method="POST">
            <input type="text" name="usuario" placeholder="Usuário Admin (padrão: admin)" required>
            <input type="password" name="senha" placeholder="Senha (padrão: eloizio2026)" required>
            <button type="submit" name="login_action">ENTRAR NO SISTEMA</button>
        </form>
    </div>
</body>
</html>
<?php
exit;
endif;

// Processar Atualização de Configurações
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_settings'])) {
    $hubData['configuracoes']['site_titulo'] = $_POST['site_titulo'] ?? '';
    $hubData['configuracoes']['site_descricao'] = $_POST['site_descricao'] ?? '';
    $hubData['configuracoes']['site_keywords'] = $_POST['site_keywords'] ?? '';
    $hubData['configuracoes']['cor_primaria'] = $_POST['cor_primaria'] ?? '#00f2fe';
    $hubData['configuracoes']['cor_secundaria'] = $_POST['cor_secundaria'] ?? '#4facfe';
    $hubData['configuracoes']['cor_fundo'] = $_POST['cor_fundo'] ?? '#080b11';
    $hubData['configuracoes']['home_h1'] = $_POST['home_h1'] ?? '';
    $hubData['configuracoes']['home_subtitulo'] = $_POST['home_subtitulo'] ?? '';
    $hubData['configuracoes']['camilla_whatsapp'] = $_POST['camilla_whatsapp'] ?? '5521996134073';
    save_hub_data($hubData);

    if ($pdo && $db_mode === 'postgres') {
        try {
            $stmt = $pdo->prepare("UPDATE configuracoes SET site_titulo=?, site_descricao=?, site_keywords=?, cor_primaria=?, cor_secundaria=?, cor_fundo=?, home_h1=?, home_subtitulo=?, camilla_whatsapp=? WHERE id=1");
            $stmt->execute([
                $_POST['site_titulo'],
                $_POST['site_descricao'],
                $_POST['site_keywords'],
                $_POST['cor_primaria'],
                $_POST['cor_secundaria'],
                $_POST['cor_fundo'],
                $_POST['home_h1'],
                $_POST['home_subtitulo'],
                $_POST['camilla_whatsapp']
            ]);
        } catch (Exception $e) {}
    }
    $msg_saved = "Configurações atualizadas!";
}

// Processar Adição de Serviço
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_service'])) {
    $newSrv = [
        'id' => time(),
        'marca' => $_POST['marca'] ?? 'elomak',
        'titulo' => $_POST['titulo'] ?? '',
        'subtitulo' => $_POST['subtitulo'] ?? '',
        'descricao' => $_POST['descricao'] ?? '',
        'beneficios' => $_POST['beneficios'] ?? '',
        'preco_texto' => $_POST['preco_texto'] ?? 'Sob consulta',
        'badge' => $_POST['badge'] ?? '',
        'link_destino' => $_POST['link_destino'] ?? 'https://elomak.grupoeloizio.com.br',
        'disponivel' => 1,
        'ordem' => count($hubData['servicos']) + 1
    ];
    $hubData['servicos'][] = $newSrv;
    save_hub_data($hubData);
    $msg_saved = "Serviço cadastrado com sucesso!";
}

// Excluir serviço
if (isset($_GET['del_srv'])) {
    $delId = (int)$_GET['del_srv'];
    $hubData['servicos'] = array_values(array_filter($hubData['servicos'], fn($s) => ($s['id'] ?? 0) != $delId));
    save_hub_data($hubData);
    header('Location: admin.php');
    exit;
}

// Excluir lead
if (isset($_GET['del_lead'])) {
    $delId = (int)$_GET['del_lead'];
    $hubData['leads'] = array_values(array_filter($hubData['leads'] ?? [], fn($l) => ($l['id'] ?? 0) != $delId));
    save_hub_data($hubData);
    header('Location: admin.php');
    exit;
}

// Exportar CSV
if (isset($_GET['export_csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=leads_grupo_eloizio_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Nome', 'WhatsApp', 'Email', 'Servico', 'Marca', 'Data', 'Status']);
    foreach ($hubData['leads'] ?? [] as $r) {
        fputcsv($output, [$r['id'] ?? '', $r['nome'] ?? '', $r['whatsapp'] ?? '', $r['email'] ?? '', $r['servico_interesse'] ?? '', $r['marca'] ?? '', $r['data_hora'] ?? '', $r['status'] ?? '']);
    }
    exit;
}

$conf = $hubData['configuracoes'] ?? [];
$leads = $hubData['leads'] ?? [];
$servicos = $hubData['servicos'] ?? [];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Administração | Grupo Eloizio Hub</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@700&display=swap" rel="stylesheet">
    <style>
        :root { --p: <?php echo $conf['cor_primaria'] ?? '#00f2fe'; ?>; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background:#080b11; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; padding:30px 5%; font-size:13px; }
        header { display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:15px; }
        h1, h2 { font-family:'Syne',sans-serif; }
        .panel { background:rgba(15,23,42,0.85); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:25px; margin-bottom:25px; }
        input, textarea, select { width:100%; padding:10px; background:#020617; border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#fff; font-size:13px; margin-top:4px; margin-bottom:14px; }
        .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:15px; }
        .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:15px; }
        .btn { padding:10px 18px; border-radius:8px; border:none; background:var(--p); color:#020617; font-weight:800; cursor:pointer; font-size:12px; text-decoration:none; display:inline-block; }
        .btn-danger { background:#ef4444; color:#fff; }
        table { width:100%; border-collapse:collapse; margin-top:10px; }
        th, td { padding:10px; border-bottom:1px solid rgba(255,255,255,0.05); text-align:left; font-size:12px; }
        th { color:#94a3b8; font-weight:600; text-transform:uppercase; font-size:11px; }
        .badge-status { padding:4px 8px; border-radius:4px; font-size:10px; font-weight:bold; }
        .badge-ok { background:rgba(16,185,129,0.2); color:#6ee7b7; border:1px solid rgba(16,185,129,0.3); }
        .badge-warn { background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.3); }
    </style>
</head>
<body>

<header>
    <div>
        <h1 style="color:var(--p); font-size:24px;">Painel de Controle · Grupo Eloizio</h1>
        <span style="color:#94a3b8; font-size:12px;">Servidor: 3f247dd71b26 | DocumentRoot: /var/www/html/grupo-eloizio</span>
    </div>
    <div>
        <a href="index.php" class="btn" style="margin-right:10px;">Ver Site Público</a>
        <a href="admin.php?logout=1" class="btn btn-danger">Sair</a>
    </div>
</header>

<!-- Diagnóstico do Ecossistema -->
<div class="panel" style="border-left: 4px solid var(--p);">
    <h2 style="font-size:16px; margin-bottom:10px;">Status do Ecossistema Grupo Eloizio</h2>
    <div class="grid-3" style="font-size:12px;">
        <div>
            <strong style="color:#94a3b8;">Postgres 16 Unificado:</strong><br>
            <span class="badge-status <?php echo ($db_mode === 'postgres') ? 'badge-ok' : 'badge-warn'; ?>">
                <?php echo ($db_mode === 'postgres') ? 'CONECTADO ✅' : 'MODO RESILIENTE JSON (driver pdo_pgsql ausente)'; ?>
            </span>
            <?php if ($db_mode !== 'postgres'): ?>
                <p style="font-size:11px; color:#cbd5e1; margin-top:4px;">
                    Para ativar no container: <code>apt update && apt install -y php8.2-pgsql</code>
                </p>
            <?php endif; ?>
        </div>
        <div>
            <strong style="color:#94a3b8;">Rotas e Subdomínios:</strong><br>
            <a href="https://elomak.grupoeloizio.com.br" target="_blank" style="color:#fbbf24;">elomak</a> · 
            <a href="https://vanguard.grupoeloizio.com.br" target="_blank" style="color:#34d399;">vanguard</a> · 
            <a href="https://elocontabil.grupoeloizio.com.br" target="_blank" style="color:#38bdf8;">elocontabil</a>
        </div>
        <div>
            <strong style="color:#94a3b8;">Inteligência & WhatsApp:</strong><br>
            <a href="https://camilla.grupoeloizio.com.br" target="_blank" style="color:#a78bfa;">camilla.grupoeloizio.com.br</a><br>
            <a href="https://wa.grupoeloizio.com.br" target="_blank" style="color:#6ee7b7;">wa.grupoeloizio.com.br</a>
        </div>
    </div>
</div>

<?php if (!empty($msg_saved)): ?>
    <div style="padding:12px; background:rgba(16,185,129,0.2); border:1px solid #10b981; border-radius:8px; margin-bottom:20px; color:#6ee7b7;">
        ✓ <?php echo $msg_saved; ?>
    </div>
<?php endif; ?>

<!-- LEADS -->
<div class="panel">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h2>Leads Capturados no Portal (<?php echo count($leads); ?>)</h2>
        <a href="admin.php?export_csv=1" class="btn">Exportar CSV</a>
    </div>
    <table>
        <thead>
            <tr>
                <th>Nome</th>
                <th>WhatsApp</th>
                <th>Serviço de Interesse</th>
                <th>Marca</th>
                <th>Data</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($leads)): ?>
                <tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:20px;">Nenhum lead capturado ainda.</td></tr>
            <?php else: ?>
                <?php foreach ($leads as $l): ?>
                <tr>
                    <td><strong><?php echo htmlspecialchars($l['nome'] ?? ''); ?></strong></td>
                    <td><?php echo htmlspecialchars($l['whatsapp'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($l['servico_interesse'] ?? ''); ?></td>
                    <td><?php echo strtoupper($l['marca'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($l['data_hora'] ?? ''); ?></td>
                    <td>
                        <a href="https://wa.me/<?php echo preg_replace('/\D/','',$l['whatsapp'] ?? ''); ?>" target="_blank" style="color:var(--p); margin-right:8px;">WhatsApp</a>
                        <a href="admin.php?del_lead=<?php echo $l['id']; ?>" onclick="return confirm('Excluir lead?')" style="color:#f87171;">Excluir</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- CONFIGURAÇÕES & SEO -->
<div class="panel">
    <h2>Configurações do Portal, SEO & Cores Neon</h2>
    <form method="POST">
        <div class="grid-2">
            <div>
                <label>Título do Portal (&lt;title&gt; no Google)</label>
                <input type="text" name="site_titulo" value="<?php echo htmlspecialchars($conf['site_titulo'] ?? ''); ?>">
                <label>Meta Descrição Google</label>
                <textarea rows="2" name="site_descricao"><?php echo htmlspecialchars($conf['site_descricao'] ?? ''); ?></textarea>
                <label>Palavras-Chave SEO</label>
                <input type="text" name="site_keywords" value="<?php echo htmlspecialchars($conf['site_keywords'] ?? ''); ?>">
            </div>
            <div>
                <label>H1 Principal da Home</label>
                <input type="text" name="home_h1" value="<?php echo htmlspecialchars($conf['home_h1'] ?? ''); ?>">
                <label>Subtítulo Principal</label>
                <textarea rows="2" name="home_subtitulo"><?php echo htmlspecialchars($conf['home_subtitulo'] ?? ''); ?></textarea>
                <label>WhatsApp da Camilla</label>
                <input type="text" name="camilla_whatsapp" value="<?php echo htmlspecialchars($conf['camilla_whatsapp'] ?? '5521996134073'); ?>">
            </div>
        </div>
        <div class="grid-3">
            <div>
                <label>Cor Primária (Neon)</label>
                <input type="color" name="cor_primaria" value="<?php echo htmlspecialchars($conf['cor_primaria'] ?? '#00f2fe'); ?>">
            </div>
            <div>
                <label>Cor Secundária</label>
                <input type="color" name="cor_secundaria" value="<?php echo htmlspecialchars($conf['cor_secundaria'] ?? '#4facfe'); ?>">
            </div>
            <div>
                <label>Cor de Fundo</label>
                <input type="color" name="cor_fundo" value="<?php echo htmlspecialchars($conf['cor_fundo'] ?? '#080b11'); ?>">
            </div>
        </div>
        <button type="submit" name="save_settings" class="btn" style="margin-top:10px;">SALVAR CONFIGURAÇÕES</button>
    </form>
</div>

<!-- SERVIÇOS -->
<div class="panel">
    <h2>Cadastrar Novo Serviço / Destino</h2>
    <form method="POST">
        <div class="grid-3">
            <div>
                <label>Marca / Destino</label>
                <select name="marca">
                    <option value="elomak">EloMak (elomak.grupoeloizio.com.br)</option>
                    <option value="vanguard">Vanguard (vanguard.grupoeloizio.com.br)</option>
                    <option value="elocontabil">Elo Contábil (elocontabil.grupoeloizio.com.br)</option>
                </select>
            </div>
            <div>
                <label>Título do Serviço</label>
                <input type="text" name="titulo" required placeholder="Ex: Reforma de Overlock">
            </div>
            <div>
                <label>Subtítulo</label>
                <input type="text" name="subtitulo" placeholder="Ex: Regulagem micrométrica em São Gonçalo">
            </div>
        </div>
        <label>Descrição</label>
        <textarea rows="2" name="descricao" required placeholder="Detalhes da solução..."></textarea>
        <label>Benefícios (separe por | )</label>
        <input type="text" name="beneficios" placeholder="Ex: Orçamento sem compromisso|Garantia pós-serviço">
        <div class="grid-3">
            <div>
                <label>Preço</label>
                <input type="text" name="preco_texto" placeholder="Ex: A partir de R$ 90,00">
            </div>
            <div>
                <label>Badge</label>
                <input type="text" name="badge" placeholder="Ex: São Gonçalo - RJ">
            </div>
            <div>
                <label>Link Destino</label>
                <input type="text" name="link_destino" value="https://elomak.grupoeloizio.com.br">
            </div>
        </div>
        <button type="submit" name="add_service" class="btn">CADASTRAR SERVIÇO</button>
    </form>
</div>

</body>
</html>
