const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyUtHc-byh7Pe2yRllp_nfyfc8gnJ_bpIvJDcHh9eusxeonwWwfAaru-kyMUimWWFbJlg/exec";

let dadosAgrupados = {};
let listaOPs = [];
let paginaAtual = 1;
const itensPorPagina = 20;

/* =========================
   CARREGAR HISTÓRICO
========================= */
async function carregarHistorico() {
    try {
        const res = await fetch(WEB_APP_URL);
        const data = await res.json();

        dadosAgrupados = {};

        data.forEach(item => {
            if (!dadosAgrupados[item.op_numero]) {
                dadosAgrupados[item.op_numero] = [];
            }
            dadosAgrupados[item.op_numero].push(item);
        });

        listaOPs = Object.keys(dadosAgrupados).reverse();
        paginaAtual = 1;
        renderizarPagina();

    } catch (e) {
        console.error('Erro ao carregar histórico:', e);
    }
}

/* =========================
   RENDERIZAR PÁGINA
========================= */
function renderizarPagina() {
    const container = document.getElementById('listaOPs');
    container.innerHTML = '';

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const opsPagina = listaOPs.slice(inicio, fim);

    opsPagina.forEach(op => {
        const card = document.createElement('div');
        card.className = 'op-card';

        const header = document.createElement('div');
        header.className = 'op-header';
        header.innerHTML = `
            <div class="op-header-left">
                <h3>OP ${op}</h3>
                <span>${dadosAgrupados[op].length} itens</span>
            </div>
            <button class="btn-print-op" onclick="imprimirOP('${op}')">
                🖨 Imprimir OP
            </button>
        `;

        const content = document.createElement('div');
        content.className = 'op-content';

        let tabela = `
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Modelo</th>
                        <th>Qtd</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
        `;

        dadosAgrupados[op].forEach(item => {
            tabela += `
                <tr>
                    <td>${item.cod}</td>
                    <td>${item.modelo}</td>
                    <td>${item.quantidade}</td>
                    <td>
                        <button class="btn-reprint"
                            onclick="reimprimir('${item.op_numero}','${item.cod}','${item.modelo}','${item.quantidade}')">
                            🖨
                        </button>
                    </td>
                </tr>
            `;
        });

        tabela += `
                </tbody>
            </table>
        `;

        content.innerHTML = tabela;

        header.onclick = (e) => {
            if (!e.target.classList.contains('btn-print-op')) {
                content.style.display =
                    content.style.display === 'block' ? 'none' : 'block';
            }
        };

        card.appendChild(header);
        card.appendChild(content);
        container.appendChild(card);
    });

    renderizarPaginacao();
}

/* =========================
   PAGINAÇÃO
========================= */
function renderizarPaginacao() {
    const pag = document.getElementById('paginacao');
    pag.innerHTML = '';

    const totalPaginas = Math.ceil(listaOPs.length / itensPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;

        if (i === paginaAtual) btn.classList.add('active');

        btn.onclick = () => {
            paginaAtual = i;
            renderizarPagina();
        };

        pag.appendChild(btn);
    }
}

/* =========================
   IMPRIMIR OP INTEIRA
========================= */
function imprimirOP(op) {
    const itens = dadosAgrupados[op];

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'gerar_etiquetas.php';
    form.target = '_blank';

    form.innerHTML = `<input type="hidden" name="op_numero" value="${op}">`;

    itens.forEach((item, index) => {
        form.innerHTML += `
            <input type="hidden" name="quadros[${index + 1}][cod]" value="${item.cod}">
            <input type="hidden" name="quadros[${index + 1}][modelo]" value="${item.modelo}">
            <input type="hidden" name="quadros[${index + 1}][quantidade]" value="${item.quantidade}">
        `;
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

/* =========================
   IMPRIMIR ITEM
========================= */
function reimprimir(op, cod, modelo, quantidade) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'gerar_etiquetas.php';
    form.target = '_blank';

    form.innerHTML = `
        <input type="hidden" name="op_numero" value="${op}">
        <input type="hidden" name="quadros[1][cod]" value="${cod}">
        <input type="hidden" name="quadros[1][modelo]" value="${modelo}">
        <input type="hidden" name="quadros[1][quantidade]" value="${quantidade}">
    `;

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

/* =========================
   FILTRO
========================= */
document.getElementById('filtro').addEventListener('input', function () {
    const termo = this.value.toLowerCase();

    listaOPs = Object.keys(dadosAgrupados).filter(op =>
        op.toLowerCase().includes(termo) ||
        dadosAgrupados[op].some(item =>
            item.cod.toLowerCase().includes(termo) ||
            item.modelo.toLowerCase().includes(termo)
        )
    );

    paginaAtual = 1;
    renderizarPagina();
});

/* =========================
   INIT
========================= */
window.onload = carregarHistorico;
