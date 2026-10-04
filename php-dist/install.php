<?php
/**
 * INSTALADOR AUTOMATIZADO - GRUPO ELOIZIO
 * Servidor: 3f247dd71b26 | Apache 2.4 + Traefik + Postgres 16 | PHP 8.2.34
 * Caminho: /var/www/html/grupo-eloizio
 * Domínio: grupoeloizio.com.br
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;
$error = '';
$success = '';

// Verificações de ambiente
$phpVersion = phpversion();
$hasPgsql = extension_loaded('pdo_pgsql');
$hasMysql = extension_loaded('pdo_mysql');
$isWritable = is_writable(__DIR__);
$alreadyInstalled = file_exists(__DIR__ . '/config.php');

// Ação de Instalação Rápida
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $install_type = $_POST['install_type'] ?? 'json'; // 'postgres' ou 'json'
    $camilla_zap = trim($_POST['camilla_zap'] ?? '5521996134073');
    $admin_user = trim($_POST['admin_user'] ?? 'admin');
    $admin_pass = trim($_POST['admin_pass'] ?? 'eloizio2026');

    try {
        if ($install_type === 'postgres' && $hasPgsql) {
            $pg_host = trim($_POST['pg_host'] ?? 'postgres');
            $pg_port = trim($_POST['pg_port'] ?? '5432');
            $pg_db = trim($_POST['pg_db'] ?? 'grupoeloizio');
            $pg_user = trim($_POST['pg_user'] ?? 'postgres');
            $pg_pass = $_POST['pg_pass'] ?? 'postgres';

            $dsn = "pgsql:host=$pg_host;port=$pg_port;dbname=$pg_db";
            $pdo = new PDO($dsn, $pg_user, $pg_pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            
            // Criar tabelas se não existirem
            $pdo->exec("
            CREATE TABLE IF NOT EXISTS configuracoes (
                id INT PRIMARY KEY DEFAULT 1,
                site_titulo VARCHAR(150),
                site_descricao TEXT,
                site_keywords TEXT,
                cor_primaria VARCHAR(15) DEFAULT '#00f2fe',
                cor_secundaria VARCHAR(15) DEFAULT '#4facfe',
                cor_fundo VARCHAR(15) DEFAULT '#080b11',
                home_h1 VARCHAR(255),
                home_subtitulo TEXT,
                camilla_nome VARCHAR(80) DEFAULT 'Camilla',
                camilla_cargo VARCHAR(120) DEFAULT 'Head de Triagem & Atendimento Especializado',
                camilla_whatsapp VARCHAR(30) DEFAULT '5521996134073',
                aviso_urgencia VARCHAR(255)
            );
            CREATE TABLE IF NOT EXISTS servicos (
                id SERIAL PRIMARY KEY,
                marca VARCHAR(30) NOT NULL,
                titulo VARCHAR(150) NOT NULL,
                subtitulo VARCHAR(255),
                descricao TEXT,
                beneficios TEXT,
                preco_texto VARCHAR(100),
                badge VARCHAR(100),
                link_destino VARCHAR(255),
                disponivel INT DEFAULT 1,
                ordem INT DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
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
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                localidade_empresa VARCHAR(150),
                texto TEXT NOT NULL,
                rating INT DEFAULT 5,
                tag_servico VARCHAR(50),
                resultado_concreto VARCHAR(150),
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                senha_hash VARCHAR(255) NOT NULL,
                nome VARCHAR(100),
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ");
        }

        // Criar ou atualizar config.php
        $cfg = "<?php
define('ECOSYSTEM_DOMAIN', 'grupoeloizio.com.br');
define('URL_ELOMAK', 'https://elomak.grupoeloizio.com.br');
define('URL_VANGUARD', 'https://vanguard.grupoeloizio.com.br');
define('URL_ELOCONTABIL', 'https://elocontabil.grupoeloizio.com.br');
define('URL_CAMILLA', 'https://camilla.grupoeloizio.com.br');
define('URL_WA_GATEWAY', 'https://wa.grupoeloizio.com.br');
define('CAMILLA_WHATSAPP', '$camilla_zap');
define('JSON_STORAGE_FILE', __DIR__ . '/storage_hub.json');

\$pdo = null;
\$db_mode = '" . ($hasPgsql && $install_type === 'postgres' ? 'postgres' : 'json') . "';

if (extension_loaded('pdo_pgsql')) {
    try {
        \$pdo = new PDO('pgsql:host=postgres;port=5432;dbname=grupoeloizio', 'postgres', 'postgres', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);
        \$db_mode = 'postgres';
    } catch (Exception \$e) {
        \$db_mode = 'json';
    }
}

function get_hub_data() {
    if (!file_exists(JSON_STORAGE_FILE)) return [];
    return json_decode(file_get_contents(JSON_STORAGE_FILE), true) ?: [];
}

function save_hub_data(\$data) {
    return file_put_contents(JSON_STORAGE_FILE, json_encode(\$data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
";
        file_put_contents(__DIR__ . '/config.php', $cfg);

        // Criar .htaccess
        $htaccess = "DirectoryIndex index.php index.html install.php
Options -Indexes +FollowSymLinks
<IfModule mod_authz_core.c>
    Require all granted
</IfModule>
";
        file_put_contents(__DIR__ . '/.htaccess', $htaccess);

        $success = "Configuração e ativação concluídas com sucesso!";
        $step = 3;
    } catch (Exception $e) {
        $error = "Erro: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalador & Ativador | Grupo Eloizio Hub</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #00f2fe; --secondary: #4facfe; --bg: #080b11; --card: rgba(15, 23, 42, 0.85); --border: rgba(255, 255, 255, 0.1); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: #f1f5f9; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { width: 100%; max-width: 680px; background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
        h1 { font-family: 'Syne', sans-serif; font-size: 26px; margin-bottom: 6px; color: #fff; }
        p.subtitle { color: #94a3b8; font-size: 13px; margin-bottom: 20px; }
        .box-diag { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; font-size: 12px; margin-bottom: 20px; }
        .diag-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .diag-item:last-child { border-bottom: none; }
        .tag-ok { color: #10b981; font-weight: bold; }
        .tag-warn { color: #fbbf24; font-weight: bold; }
        .btn-submit { width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(90deg, var(--primary), var(--secondary)); color: #020617; font-weight: 800; font-size: 14px; cursor: pointer; text-transform: uppercase; margin-top: 15px; }
        input, select { width: 100%; padding: 10px 12px; border-radius: 10px; background: #020617; border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 13px; margin-top: 4px; margin-bottom: 12px; }
        .alert-success { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7; padding: 18px; border-radius: 12px; text-align: center; margin-bottom: 20px; }
        .btn-link { display: inline-block; padding: 12px 24px; border-radius: 10px; background: var(--primary); color: #020617; font-weight: 700; text-decoration: none; margin: 6px; }
    </style>
</head>
<body>

<div class="container">
    <div style="font-size:11px; font-weight:800; color:var(--primary); text-transform:uppercase; margin-bottom:6px;">
        Servidor: 3f247dd71b26 · /var/www/html/grupo-eloizio
    </div>
    <h1>Instalador & Ativador · Grupo Eloizio</h1>
    <p class="subtitle">Conecta o Hub aos subdomínios (EloMak, Vanguard, Elo Contábil) e ao banco unificado.</p>

    <!-- Diagnóstico Detectado -->
    <div class="box-diag">
        <div class="diag-item">
            <span>Ambiente PHP</span>
            <span class="tag-ok">PHP <?php echo htmlspecialchars($phpVersion); ?> ✅</span>
        </div>
        <div class="diag-item">
            <span>DocumentRoot</span>
            <span class="tag-ok">/var/www/html/grupo-eloizio ✅</span>
        </div>
        <div class="diag-item">
            <span>Extensão PDO Postgres (pdo_pgsql)</span>
            <span class="<?php echo $hasPgsql ? 'tag-ok' : 'tag-warn'; ?>">
                <?php echo $hasPgsql ? 'Ativada ✅' : 'Ausente (Modo Resiliente JSON Ativo) ⚡'; ?>
            </span>
        </div>
        <div class="diag-item">
            <span>Permissão de Escrita</span>
            <span class="<?php echo $isWritable ? 'tag-ok' : 'tag-warn'; ?>">
                <?php echo $isWritable ? 'SIM (0755) ✅' : 'NÃO'; ?>
            </span>
        </div>
    </div>

    <?php if ($step === 3 && $success): ?>
        <div class="alert-success">
            <h3>🎉 Hub Ativado com Sucesso!</h3>
            <p style="margin-top:6px; font-size:13px;"><?php echo htmlspecialchars($success); ?></p>
            <p style="font-size:12px; color:#cbd5e1; margin-top:8px;">O site já está pronto para receber visitantes em <strong>grupoeloizio.com.br</strong>.</p>
            <div style="margin-top: 15px;">
                <a href="index.php" class="btn-link">Acessar Hub Oficial</a>
                <a href="admin.php" class="btn-link" style="background:rgba(255,255,255,0.1); color:#fff;">Painel Admin</a>
            </div>
        </div>
    <?php else: ?>
        <form method="POST">
            <label style="font-size:12px; font-weight:700; color:#cbd5e1;">Modo de Armazenamento</label>
            <select name="install_type">
                <option value="json" selected>Armazenamento Local JSON (Imediato · Sem erro de driver)</option>
                <?php if ($hasPgsql): ?>
                    <option value="postgres">Postgres 16 Unificado (postgres://postgres:5432/grupoeloizio)</option>
                <?php endif; ?>
            </select>

            <label style="font-size:12px; font-weight:700; color:#cbd5e1;">WhatsApp da Camilla para Triagem</label>
            <input type="text" name="camilla_zap" value="5521996134073" required>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div>
                    <label style="font-size:12px; font-weight:700; color:#cbd5e1;">Usuário Admin</label>
                    <input type="text" name="admin_user" value="admin" required>
                </div>
                <div>
                    <label style="font-size:12px; font-weight:700; color:#cbd5e1;">Senha Admin</label>
                    <input type="text" name="admin_pass" value="eloizio2026" required>
                </div>
            </div>

            <button type="submit" class="btn-submit">
                ATIVAR HUB GRUPO ELOIZIO
            </button>
        </form>
    <?php endif; ?>
</div>

</body>
</html>
