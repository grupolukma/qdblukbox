<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Histórico de Etiquetas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/historico.css">
</head>
<body>

<div class="container">
    <header class="header-historico">
        <h1>📊 Histórico de Etiquetas</h1>
        <p>Agrupado por Ordem de Produção</p>
    </header>

    <div class="actions">
        <input type="text" id="filtro" placeholder="🔍 Buscar OP, código ou modelo">
    </div>

    <div id="listaOPs"></div>

    <div class="paginacao" id="paginacao"></div>

    <a href="index.html" class="menu-link">⬅ Voltar</a>
</div>

<script src="assets/js/historico.js"></script>
</body>
</html>
