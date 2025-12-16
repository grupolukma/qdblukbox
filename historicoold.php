<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Histórico de Impressões</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 1000px;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #0056b3;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #0056b3;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        button {
            background-color: #004494;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover {
            background-color: #003377;
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 20px;
            color: #0056b3;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Histórico de Impressões</h1>
    
    <table id="tabelaHistorico">
        <thead>
            <tr>
                <th>Data</th>
                <th>OP</th>
                <th>Cód. Quadro</th>
                <th>Modelo</th>
                <th>Qtde Pares</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr><td colspan="6">Carregando dados...</td></tr>
        </tbody>
    </table>
    
    <a href="index.html" class="back-link">← Voltar para a Tela de Impressão</a>
</div>

<script>
    // ⭐️ SUA NOVA URL DA WEB APP ⭐️
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyAKJlsXN_lRWzDW0FTGgtaYyGgvxMh5EIBzP8w4W70lm8n7o6PXQp-VXjivzczqXYjdA/exec"; 
    
    const tbody = document.getElementById('tabelaHistorico').getElementsByTagName('tbody')[0];
    
    // ⭐️ FUNÇÃO GLOBAL CHAMADA PELO APPS SCRIPT (O CALLBACK) ⭐️
    window.handleResponse = function(dados) {
        if (!dados || dados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhum registro encontrado.</td></tr>';
            return;
        }
        
        tbody.innerHTML = ''; 

        dados.forEach(item => {
            const row = tbody.insertRow();
            
            // Renderiza os dados
            row.insertCell().textContent = new Date(item.TIMESTAMP).toLocaleDateString('pt-BR'); 
            row.insertCell().textContent = item.OP_NUMERO;
            row.insertCell().textContent = item.COD_QUADRO;
            row.insertCell().textContent = item.MODELO;
            row.insertCell().textContent = item.QUANTIDADE;
            
            const acoesCell = row.insertCell();
            
            // Botão de Re-impressão
            const btnReimprimir = document.createElement('button');
            btnReimprimir.textContent = 'Re-imprimir';
            btnReimprimir.onclick = () => reimprimir(item); 
            acoesCell.appendChild(btnReimprimir);
        });
    }

    // ⭐️ FUNÇÃO PARA INJETAR O SCRIPT (JSONP) ⭐️
    function carregarHistorico() {
        tbody.innerHTML = '<tr><td colspan="6">Carregando dados...</td></tr>';

        const script = document.createElement('script');
        // Adiciona o parâmetro callback=? para dizer ao Apps Script qual função chamar
        script.src = WEB_APP_URL + "?callback=handleResponse"; 
        script.onerror = function() {
            tbody.innerHTML = `<tr><td colspan="6" style="color:red; font-weight:bold;">Falha na comunicação. Verifique se o Apps Script foi publicado corretamente (MimeType.JAVASCRIPT).</td></tr>`;
            console.error("Falha ao carregar script JSONP. Verifique a publicação do Apps Script.");
        };
        document.head.appendChild(script);
    }

    // A função de reimpressão permanece igual
    function reimprimir(item) {
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = 'gerar_etiquetas.php';
        tempForm.target = '_blank';

        let opInput = document.createElement('input');
        opInput.type = 'hidden';
        opInput.name = 'op_numero';
        opInput.value = item.OP_NUMERO;
        tempForm.appendChild(opInput);
        
        let codInput = document.createElement('input');
        codInput.type = 'hidden';
        codInput.name = 'quadros[1][cod]';
        codInput.value = item.COD_QUADRO;
        tempForm.appendChild(codInput);
        
        let modeloInput = document.createElement('input');
        modeloInput.type = 'hidden';
        modeloInput.name = 'quadros[1][modelo]';
        modeloInput.value = item.MODELO;
        tempForm.appendChild(modeloInput);

        let qtdeInput = document.createElement('input');
        qtdeInput.type = 'hidden';
        qtdeInput.name = 'quadros[1][quantidade]';
        qtdeInput.value = item.QUANTIDADE;
        tempForm.appendChild(qtdeInput);


        document.body.appendChild(tempForm);
        tempForm.submit();
        document.body.removeChild(tempForm);
    }

    window.onload = carregarHistorico;
</script>

</body>
</html>