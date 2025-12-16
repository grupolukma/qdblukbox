const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyUtHc-byh7Pe2yRllp_nfyfc8gnJ_bpIvJDcHh9eusxeonwWwfAaru-kyMUimWWFbJlg/exec";

const containerQuadros = document.getElementById('campos_quadros');
const btnList = document.getElementById('viewList');
const btnGrid = document.getElementById('viewGrid');

/* =========================
   GERAR CAMPOS DE QUADROS
   reset = true  -> limpa tudo
   reset = false -> preserva dados
========================= */
function gerarCamposQuadros(reset = false) {
    const numQuadros = document.getElementById('num_quadros').value;

    let valores = {};

    if (!reset) {
        containerQuadros.querySelectorAll('.quadro-fields').forEach((el, index) => {
            const i = index + 1;
            valores[i] = {
                cod: el.querySelector(`#cod_quadro_${i}`)?.value || '',
                modelo: el.querySelector(`#modelo_${i}`)?.value || '',
                quantidade: el.querySelector(`#quantidade_${i}`)?.value || 1
            };
        });
    }

    let html = '';

    for (let i = 1; i <= numQuadros; i++) {
        html += `
            <div class="quadro-fields">
                <h4>Quadro #${i}</h4>

                <div class="input-group">
                    <label>Cód. Quadro</label>
                    <input type="text"
                           id="cod_quadro_${i}"
                           value="${reset ? '' : (valores[i]?.cod || '')}"
                           required>
                </div>

                <div class="input-group">
                    <label>Modelo</label>
                    <input type="text"
                           id="modelo_${i}"
                           value="${reset ? '' : (valores[i]?.modelo || '')}"
                           required>
                </div>

                <div class="input-group">
                    <label>Quantidade de Pares</label>
                    <input type="number"
                           id="quantidade_${i}"
                           min="1"
                           value="${reset ? 1 : (valores[i]?.quantidade || 1)}"
                           required>
                </div>
            </div>
        `;
    }

    containerQuadros.innerHTML = html;

    if (!containerQuadros.classList.contains('grid')) {
        containerQuadros.classList.add('lista');
    }
}

/* =========================
   TOGGLE LISTA / CARDS
========================= */
btnList.addEventListener('click', () => {
    containerQuadros.classList.add('lista');
    containerQuadros.classList.remove('grid');
    btnList.classList.add('active');
    btnGrid.classList.remove('active');
});

btnGrid.addEventListener('click', () => {
    containerQuadros.classList.add('grid');
    containerQuadros.classList.remove('lista');
    btnGrid.classList.add('active');
    btnList.classList.remove('active');
});

/* =========================
   SUBMIT FORMULÁRIO
========================= */
document.getElementById('formEtiquetas').addEventListener('submit', function (e) {
    e.preventDefault();

    const op_numero = document.getElementById('op_numero').value;
    const numQuadros = parseInt(document.getElementById('num_quadros').value);

    let sheetsData = [];
    let quadrosParaPHP = {};

    for (let i = 1; i <= numQuadros; i++) {
        const cod = document.getElementById(`cod_quadro_${i}`).value;
        const modelo = document.getElementById(`modelo_${i}`).value;
        const quantidade = document.getElementById(`quantidade_${i}`).value;

        sheetsData.push({ op_numero, cod, modelo, quantidade });
        quadrosParaPHP[i] = { cod, modelo, quantidade };
    }

    /* SALVAR NO GOOGLE SHEETS */
    fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(sheetsData)
    }).catch(err => console.error('Erro ao salvar no Sheets:', err));

    /* IMPRIMIR */
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'gerar_etiquetas.php';
    form.target = '_blank';

    form.innerHTML = `<input type="hidden" name="op_numero" value="${op_numero}">`;

    for (const i in quadrosParaPHP) {
        for (const campo in quadrosParaPHP[i]) {
            form.innerHTML += `
                <input type="hidden"
                       name="quadros[${i}][${campo}]"
                       value="${quadrosParaPHP[i][campo]}">
            `;
        }
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
});

/* =========================
   NOVA ETIQUETA (RESET TOTAL)
========================= */
document.getElementById('btnNovaEtiqueta').addEventListener('click', () => {
    if (!confirm('Criar nova etiqueta e limpar todos os dados?')) return;

    document.getElementById('op_numero').value = '';
    document.getElementById('num_quadros').value = 1;

    gerarCamposQuadros(true); // 🔥 limpa tudo

    btnList.classList.add('active');
    btnGrid.classList.remove('active');
    containerQuadros.classList.add('lista');
    containerQuadros.classList.remove('grid');
});

/* =========================
   INIT
========================= */
document.getElementById('num_quadros').addEventListener('change', () => gerarCamposQuadros(false));
window.onload = () => gerarCamposQuadros(true);
