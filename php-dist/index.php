<?php
/**
 * HUB DE SOLUÇÕES - GRUPO ELOIZIO
 * Domínio Principal: grupoeloizio.com.br
 * Diretório: /var/www/html/grupo-eloizio
 */
require_once __DIR__ . '/config.php';

$hubData = get_hub_data();

// Carregar Configurações (Via Postgres se disponível, senão via JSON)
$conf = $hubData['configuracoes'] ?? [];
$servicos = $hubData['servicos'] ?? [];
$depoimentos = $hubData['depoimentos'] ?? [];

if ($pdo && $db_mode === 'postgres') {
    try {
        $c = $pdo->query("SELECT * FROM configuracoes WHERE id=1 LIMIT 1")->fetch();
        if ($c) $conf = array_merge($conf, $c);

        $s = $pdo->query("SELECT * FROM servicos WHERE disponivel=1 ORDER BY ordem ASC")->fetchAll();
        if (!empty($s)) $servicos = $s;

        $d = $pdo->query("SELECT * FROM depoimentos ORDER BY id DESC LIMIT 6")->fetchAll();
        if (!empty($d)) $depoimentos = $d;
    } catch (Exception $e) {
        // Fallback silencioso para dados JSON já carregados
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($conf['site_titulo'] ?? 'Elo & Vanguard | Hub de Soluções'); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($conf['site_descricao'] ?? ''); ?>">
    <meta name="keywords" content="<?php echo htmlspecialchars($conf['site_keywords'] ?? ''); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($conf['site_titulo'] ?? ''); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($conf['site_descricao'] ?? ''); ?>">
    <meta property="og:type" content="website">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "EloMak Máquinas de Costura São Gonçalo RJ",
      "telephone": "+55<?php echo preg_replace('/\D/', '', $conf['camilla_whatsapp'] ?? '21996134073'); ?>",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São Gonçalo",
        "addressRegion": "RJ",
        "addressCountry": "BR"
      }
    }
    </script>

    <style>
        :root {
            --primary: <?php echo htmlspecialchars($conf['cor_primaria'] ?? '#00f2fe'); ?>;
            --secondary: <?php echo htmlspecialchars($conf['cor_secundaria'] ?? '#4facfe'); ?>;
            --bg: <?php echo htmlspecialchars($conf['cor_fundo'] ?? '#080b11'); ?>;
            --card-bg: rgba(15, 23, 42, 0.7);
            --border-glass: rgba(255, 255, 255, 0.08);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg);
            color: #f1f5f9;
            min-height: 100vh;
            line-height: 1.6;
            overflow-x: hidden;
        }

        h1, h2, h3, .font-display { font-family: 'Syne', sans-serif; }

        header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: rgba(8, 11, 17, 0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border-glass);
            padding: 16px 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo-box {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }
        .logo-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: #020617;
            font-size: 18px;
        }
        .logo-text { font-size: 18px; font-weight: 800; color: #fff; line-height: 1; }
        .logo-sub { font-size: 10px; color: var(--primary); text-transform: uppercase; font-weight: 700; margin-top: 3px; display: block; }

        nav.nav-links { display: flex; gap: 24px; }
        nav.nav-links a { color: #cbd5e1; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        nav.nav-links a:hover { color: var(--primary); }

        .btn-camilla {
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            color: #020617;
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-camilla:hover { opacity: 0.9; transform: translateY(-1px); }

        .btn-admin-link {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-glass);
            color: #cbd5e1;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 12px;
            text-decoration: none;
            margin-right: 8px;
        }

        /* Hero */
        .hero {
            padding: 70px 5% 50px;
            text-align: center;
            position: relative;
        }
        .kicker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            border-radius: 50px;
            background: rgba(0, 242, 254, 0.08);
            border: 1px solid rgba(0, 242, 254, 0.25);
            color: var(--primary);
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 10px #10b981;
        }
        .hero h1 {
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 800;
            line-height: 1.15;
            max-width: 900px;
            margin: 0 auto 18px;
            color: #fff;
        }
        .hero p.lead {
            font-size: 17px;
            color: #94a3b8;
            max-width: 750px;
            margin: 0 auto 30px;
        }

        /* Shopping Grid */
        .container { max-width: 1240px; margin: 0 auto; padding: 40px 5%; }
        .filter-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .filter-btn {
            padding: 8px 18px;
            border-radius: 10px;
            border: 1px solid var(--border-glass);
            background: rgba(255,255,255,0.05);
            color: #cbd5e1;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .filter-btn.active, .filter-btn:hover {
            background: var(--primary);
            color: #020617;
            font-weight: 700;
            border-color: var(--primary);
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 25px;
        }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-glass);
            border-radius: 20px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        .card:hover {
            transform: translateY(-4px);
            border-color: rgba(0, 242, 254, 0.3);
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
        }
        .card-tag {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 3px 8px;
            border-radius: 6px;
            display: inline-block;
            margin-bottom: 12px;
        }
        .tag-elomak { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; }
        .tag-vanguard { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; }
        .tag-elocontabil { background: rgba(14, 165, 233, 0.15); border: 1px solid rgba(14, 165, 233, 0.3); color: #38bdf8; }

        .card h3 { font-size: 19px; color: #fff; margin-bottom: 6px; }
        .card .sub { font-size: 12px; color: var(--primary); margin-bottom: 12px; font-weight: 600; }
        .card p.desc { font-size: 13px; color: #94a3b8; margin-bottom: 16px; }
        .benefits-list { list-style: none; margin-bottom: 20px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 14px; }
        .benefits-list li { font-size: 12px; color: #cbd5e1; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
        .benefits-list li::before { content: "✓"; color: var(--primary); font-weight: bold; }

        .price-box {
            background: rgba(0,0,0,0.3);
            padding: 8px 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 16px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .price-val { font-weight: 700; color: #fff; }

        .btn-card-action {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            border: none;
            background: rgba(255,255,255,0.08);
            color: #fff;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }
        .btn-card-action:hover {
            background: var(--primary);
            color: #020617;
        }

        /* SEO Local Box */
        .seo-box {
            background: rgba(245, 158, 11, 0.05);
            border: 1px solid rgba(245, 158, 11, 0.2);
            border-radius: 20px;
            padding: 35px;
            margin: 50px 0;
        }

        /* Floating Camilla Widget */
        .camilla-float {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999;
            background: rgba(8, 11, 17, 0.95);
            border: 1px solid rgba(0, 242, 254, 0.35);
            border-radius: 18px;
            padding: 14px 18px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(12px);
        }
        .avatar-c {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: #020617;
            position: relative;
        }
        .avatar-c::after {
            content: "";
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 10px;
            height: 10px;
            background: #10b981;
            border: 2px solid #080b11;
            border-radius: 50%;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(8px);
            z-index: 2000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-content {
            background: #0f172a;
            border: 1px solid var(--border-glass);
            border-radius: 24px;
            max-width: 480px;
            width: 100%;
            padding: 35px;
            position: relative;
        }
        .modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 20px;
            cursor: pointer;
        }
        .modal input, .modal textarea {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            background: #020617;
            border: 1px solid var(--border-glass);
            color: #fff;
            margin-bottom: 14px;
            font-size: 13px;
        }

        @media(max-width: 768px) {
            nav.nav-links { display: none; }
            .hero h1 { font-size: 32px; }
        }
    </style>
</head>
<body>

<header>
    <a href="#topo" class="logo-box">
        <div class="logo-icon">EV</div>
        <div>
            <span class="logo-text">GRUPO ELO & VANGUARD</span>
            <span class="logo-sub">São Gonçalo RJ & Brasil</span>
        </div>
    </a>

    <nav class="nav-links">
        <a href="#shopping">Mini Shopping</a>
        <a href="#shopping" onclick="filterServices('elomak')">EloMak (SG)</a>
        <a href="#shopping" onclick="filterServices('vanguard')">Cursos Vanguard</a>
        <a href="#shopping" onclick="filterServices('elocontabil')">Elo Contábil Digital</a>
        <a href="#depoimentos">Depoimentos</a>
    </nav>

    <div>
        <a href="admin.php" class="btn-admin-link">Área Admin</a>
        <button onclick="openLeadModal('Atendimento Geral Concierge')" class="btn-camilla">
            Falar com <?php echo htmlspecialchars($conf['camilla_nome'] ?? 'Camilla'); ?>
        </button>
    </div>
</header>

<section class="hero" id="topo">
    <div class="kicker">
        <span class="pulse-dot"></span>
        <span><?php echo htmlspecialchars($conf['camilla_nome'] ?? 'Camilla'); ?> online · Triagem no WhatsApp (21) 99613-4073</span>
    </div>

    <h1><?php echo htmlspecialchars($conf['home_h1'] ?? 'Soluções Inteligentes em um Único Hub'); ?></h1>
    <p class="lead"><?php echo htmlspecialchars($conf['home_subtitulo'] ?? ''); ?></p>

    <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
        <a href="#shopping" class="btn-camilla" style="padding:14px 28px; font-size:14px;">
            Acessar Mini Shopping de Soluções
        </a>
        <button onclick="openLeadModal('Triagem Imediata Camilla')" class="btn-card-action" style="width:auto; padding:14px 28px;">
            Iniciar Triagem no WhatsApp
        </button>
    </div>
</section>

<div class="container" id="shopping">
    <div style="margin-bottom:20px;">
        <h2 style="font-size:26px; color:#fff;">Catálogo de Serviços & Oportunidades</h2>
        <p style="color:#94a3b8; font-size:13px;">Selecione o serviço para atendimento e orçamento direto com a Camilla.</p>
    </div>

    <div class="filter-bar">
        <button class="filter-btn active" onclick="filterServices('all')">Todos os Serviços</button>
        <button class="filter-btn" onclick="filterServices('elomak')">EloMak (Máquinas SG)</button>
        <button class="filter-btn" onclick="filterServices('vanguard')">Vanguard (Cursos Online)</button>
        <button class="filter-btn" onclick="filterServices('elocontabil')">Elo Contábil (BPO/RH)</button>
    </div>

    <div class="cards-grid">
        <?php foreach ($servicos as $s): 
            $tagClass = 'tag-' . $s['marca'];
            $beneficios = array_filter(explode('|', $s['beneficios'] ?? ''));
        ?>
        <div class="card service-card" data-brand="<?php echo htmlspecialchars($s['marca']); ?>">
            <div>
                <span class="card-tag <?php echo $tagClass; ?>">
                    <?php echo htmlspecialchars($s['badge'] ?? $s['marca']); ?>
                </span>
                <h3><?php echo htmlspecialchars($s['titulo']); ?></h3>
                <div class="sub"><?php echo htmlspecialchars($s['subtitulo'] ?? ''); ?></div>
                <p class="desc"><?php echo htmlspecialchars($s['descricao'] ?? ''); ?></p>

                <?php if (!empty($beneficios)): ?>
                <ul class="benefits-list">
                    <?php foreach ($beneficios as $b): ?>
                        <li><?php echo htmlspecialchars(trim($b)); ?></li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
            </div>

            <div>
                <div class="price-box">
                    <span style="color:#94a3b8;">Condição:</span>
                    <span class="price-val"><?php echo htmlspecialchars($s['preco_texto'] ?? 'Sob consulta'); ?></span>
                </div>
                <button onclick="openLeadModal('<?php echo addslashes($s['titulo']); ?> (<?php echo strtoupper($s['marca']); ?>)')" class="btn-card-action">
                    Acessar via <?php echo htmlspecialchars($conf['camilla_nome'] ?? 'Camilla'); ?>
                </button>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

    <!-- SEO Local Box São Gonçalo -->
    <div class="seo-box">
        <span style="color:#fbbf24; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px;">
            São Gonçalo - RJ · Atendimento Técnico Especializado
        </span>
        <h3 style="font-size:22px; color:#fff; margin:6px 0 10px;">EloMak: Oficina de Máquinas de Costura em São Gonçalo</h3>
        <p style="color:#cbd5e1; font-size:13px; line-height:1.7;">
            Reforma completa e assistência técnica em máquinas de costura industriais e domésticas em todos os bairros de 
            <strong>São Gonçalo - RJ</strong> (Alcântara, Neves, Centro, Zé Garoto, Barro Vermelho, Porto da Pedra e Mutondo). 
            Diagnóstico transparente com <strong>orçamento sem compromisso</strong>.
        </p>
    </div>
</div>

<!-- Parede de Provas Sociais -->
<section id="depoimentos" style="background:rgba(0,0,0,0.3); padding:60px 5%; border-top:1px solid var(--border-glass);">
    <div style="max-width:1240px; margin:0 auto;">
        <div style="text-align:center; margin-bottom:40px;">
            <span style="color:#10b981; font-size:11px; font-weight:800; text-transform:uppercase;">Data Trust Wall</span>
            <h2 style="font-size:28px; color:#fff; margin-top:4px;">Resultados Comprovados</h2>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
            <?php foreach ($depoimentos as $d): ?>
            <div style="background:var(--card-bg); border:1px solid var(--border-glass); border-radius:16px; padding:22px;">
                <div style="color:#fbbf24; margin-bottom:8px;">
                    <?php echo str_repeat('★', (int)($d['rating'] ?? 5)); ?>
                </div>
                <p style="font-size:13px; color:#cbd5e1; font-style:italic; margin-bottom:15px;">
                    "<?php echo htmlspecialchars($d['texto']); ?>"
                </p>
                <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:10px; font-size:12px;">
                    <strong style="color:#fff; display:block;"><?php echo htmlspecialchars($d['nome']); ?></strong>
                    <span style="color:#94a3b8; font-size:11px;"><?php echo htmlspecialchars($d['localidade_empresa']); ?></span>
                    <span style="display:block; color:#10b981; font-weight:bold; margin-top:4px; font-size:11px;">
                        ✓ <?php echo htmlspecialchars($d['resultado_concreto']); ?>
                    </span>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Floating Widget Camilla -->
<div class="camilla-float">
    <div class="avatar-c">C</div>
    <div>
        <strong style="font-size:13px; display:block; color:#fff;"><?php echo htmlspecialchars($conf['camilla_nome'] ?? 'Camilla'); ?></strong>
        <span style="font-size:11px; color:var(--primary); display:block;">Online no WhatsApp</span>
    </div>
    <button onclick="openLeadModal('Atendimento Flutuante')" class="btn-camilla" style="padding:6px 12px; font-size:11px;">
        Chamar
    </button>
</div>

<!-- Modal Lead -->
<div class="modal" id="leadModal">
    <div class="modal-content">
        <button class="modal-close" onclick="closeLeadModal()">&times;</button>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
            <div class="avatar-c" style="width:36px; height:36px; font-size:14px;">C</div>
            <div>
                <h3 style="color:#fff; font-size:16px;">Fale com <?php echo htmlspecialchars($conf['camilla_nome'] ?? 'Camilla'); ?></h3>
                <span style="font-size:11px; color:var(--primary);">Triagem Express WhatsApp</span>
            </div>
        </div>
        <p style="font-size:12px; color:#94a3b8; margin-bottom:15px;">
            Preencha seus dados para ser encaminhado com exclusividade para: <strong id="modalServicoNome" style="color:#fff;"></strong>
        </p>

        <form id="formLeadAjax">
            <input type="hidden" id="lead_servico_input" name="servico">
            <input type="text" name="nome" placeholder="Seu Nome Completo" required>
            <input type="tel" name="whatsapp" placeholder="Seu WhatsApp (com DDD)" required>
            <input type="email" name="email" placeholder="Seu E-mail (opcional)">
            <textarea name="observacao" rows="2" placeholder="Algum detalhe ou urgência da sua máquina / curso?"></textarea>
            <button type="submit" class="btn-camilla" style="width:100%; justify-content:center; padding:12px;">
                CONECTAR NO WHATSAPP AGORA
            </button>
        </form>
    </div>
</div>

<script>
function filterServices(brand) {
    const cards = document.querySelectorAll('.service-card');
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    cards.forEach(card => {
        if (brand === 'all' || card.getAttribute('data-brand') === brand) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function openLeadModal(servico) {
    document.getElementById('modalServicoNome').innerText = servico;
    document.getElementById('lead_servico_input').value = servico;
    document.getElementById('leadModal').style.display = 'flex';
}

function closeLeadModal() {
    document.getElementById('leadModal').style.display = 'none';
}

document.getElementById('formLeadAjax').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('ajax_lead.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'success' && data.whatsapp_url) {
            window.location.href = data.whatsapp_url;
        } else {
            // Fallback direto
            const nome = formData.get('nome');
            const servico = formData.get('servico');
            const msg = encodeURIComponent(`Olá Camilla, meu nome é ${nome}. Vi o serviço ${servico} no site e gostaria de atendimento.`);
            window.location.href = `https://wa.me/<?php echo preg_replace('/\D/', '', $conf['camilla_whatsapp'] ?? '21996134073'); ?>?text=${msg}`;
        }
    })
    .catch(() => {
        const nome = formData.get('nome');
        const servico = formData.get('servico');
        const msg = encodeURIComponent(`Olá Camilla, meu nome é ${nome}. Vi o serviço ${servico} no site e gostaria de atendimento.`);
        window.location.href = `https://wa.me/<?php echo preg_replace('/\D/', '', $conf['camilla_whatsapp'] ?? '21996134073'); ?>?text=${msg}`;
    });
});

window.onclick = function(e) {
    if (e.target == document.getElementById('leadModal')) {
        closeLeadModal();
    }
}
</script>

</body>
</html>
