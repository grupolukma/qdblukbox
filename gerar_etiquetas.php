<?php
// gerar_etiquetas.php

// Define o cabeçalho para garantir que o navegador não armazene em cache
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Verifica se os dados do formulário foram enviados
if (!isset($_POST['op_numero']) || !isset($_POST['quadros'])) {
    die("Erro: Dados incompletos. Por favor, volte ao formulário e preencha todos os campos.");
}

$op_numero = htmlspecialchars($_POST['op_numero']);
$quadros = $_POST['quadros'];
$data_hoje = date('d/m/Y');

$html_etiquetas = "";

// 1. Loop através de cada Quadro preenchido no formulário
foreach ($quadros as $quadro) {
    // Sanitiza e extrai os dados do quadro atual
    $cod_quadro = htmlspecialchars($quadro['cod']);
    $modelo = htmlspecialchars($quadro['modelo']);
    $quantidade = (int)$quadro['quantidade'];
    if ($quantidade < 1) $quantidade = 1;

    // 2. Loop para gerar a QUANTIDADE de pares de etiquetas solicitada
    for ($i = 0; $i < $quantidade; $i++) {
        
        // Define o conteúdo interno de uma única etiqueta (50mm x 30mm)
        $conteudo_etiqueta = "
            <div class='data-lateral'>{$data_hoje}</div>
            <img src='assets/img/etiqueta.png' alt='Logo' class='logo'>
            <div class='campos-principais'>
                <p><strong>OP:</strong> {$op_numero}</p>
                <p><strong>Cód. Quadro:</strong></p>
                <p>$cod_quadro</p>
                <p><strong>Modelo:</strong> {$modelo}</p>
            </div>
        ";

        // Gera o PAR de etiquetas (100mm x 30mm)
        $par_etiqueta = "
        <div class='etiqueta-wrapper'>
            <div class='etiqueta'>
                {$conteudo_etiqueta}
            </div>
            <div class='etiqueta'>
                {$conteudo_etiqueta}
            </div>
        </div>";
        
        $html_etiquetas .= $par_etiqueta;
    }
}

// 3. Estrutura final da página de impressão
// Inclui o CSS e o script para acionar a impressão
echo <<<HTML
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Impressão - OP {$op_numero}</title>
    <link rel="stylesheet" href="assets/css/estilo_etiqueta.css">
</head>
<body>

    {$html_etiquetas}

    <script>
        window.onload = function() {
            // Atraso sutil para garantir que o CSS de impressão seja aplicado
            setTimeout(function() {
                window.print();
            }, 200); 
        };
    </script>

</body>
</html>
HTML;
?>