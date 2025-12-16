const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyzeSMywP8G9StmljbkZAAWGVJFQwCOP3c1dwTzfwYQ13AZTlCKe8e8tEeoPpQAfMvSog/exec";

function gerarCampos() {
  const n = document.getElementById("num_quadros").value;
  let html = "";

  for (let i = 1; i <= n; i++) {
    html += `
      <hr>
      <label>Código</label>
      <input id="cod_${i}" required>

      <label>Modelo</label>
      <input id="modelo_${i}" required>

      <label>Quantidade de pares</label>
      <input type="number" id="quantidade_${i}" value="1" min="1">
    `;
  }

  document.getElementById("campos").innerHTML = html;
}

gerarCampos();

function enviar() {
  const op = document.getElementById("op_numero").value;
  const n = document.getElementById("num_quadros").value;

  let dados = [];
  let quadros = [];

  for (let i = 1; i <= n; i++) {
    const cod = document.getElementById(`cod_${i}`).value;
    const modelo = document.getElementById(`modelo_${i}`).value;
    const quantidade = parseInt(document.getElementById(`quantidade_${i}`).value);

    dados.push({ op_numero: op, cod, modelo, quantidade });
    quadros.push({ cod, modelo, quantidade });
  }

  fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  imprimir(op, quadros);
}

function imprimir(op, quadros) {
  let html = `
  <html>
  <head>
    <link rel="stylesheet" href="assets/css/estilo_etiqueta.css">
  </head>
  <body>
  `;

  quadros.forEach(q => {
    for (let i = 0; i < q.quantidade; i++) {
      html += `
      <div class="etiqueta-wrapper">
        <div class="etiqueta">
          <img src="assets/img/logo.png" class="logo">
          <div class="data-lateral">${new Date().toLocaleDateString()}</div>
          <div class="campos-principais">
            <p>OP ${op}</p>
            <p>${q.cod}</p>
            <p>${q.modelo}</p>
          </div>
        </div>
        <div class="etiqueta"></div>
      </div>
      `;
    }
  });

  html += `<script>window.print()</script></body></html>`;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
}
