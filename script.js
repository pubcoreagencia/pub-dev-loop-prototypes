// ===== PATO DE MINAS - Sistema de Gestão de Patos =====

// Estado da aplicação
let patos = [];
let patoEditando = null;

// Elementos do DOM
const formPato = document.getElementById('formPato');
const listaPatos = document.getElementById('listaPatos');
const modalEdicao = document.getElementById('modalEdicao');
const formEdicao = document.getElementById('formEdicao');
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarPatos();
    inicializarNavegacao();
    inicializarFiltros();
});

// ===== PERSISTÊNCIA COM LOCALSTORAGE =====

function carregarPatos() {
    const patosSalvos = localStorage.getItem('patosDeMinas');
    if (patosSalvos) {
        patos = JSON.parse(patosSalvos);
    }
    atualizarLista();
    atualizarEstatisticas();
}

function salvarPatos() {
    localStorage.setItem('patosDeMinas', JSON.stringify(patos));
}

// ===== NAVEGAÇÃO =====

function inicializarNavegacao() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            if (tabId === 'estatisticas') {
                atualizarEstatisticas();
            }
        });
    });
}

// ===== CADASTRO =====

formPato.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pato = {
        id: Date.now().toString(),
        nome: document.getElementById('nome').value,
        raca: document.getElementById('raca').value,
        idade: parseInt(document.getElementById('idade').value),
        genero: document.getElementById('genero').value,
        peso: parseFloat(document.getElementById('peso').value),
        saude: document.getElementById('saude').value,
        observacoes: document.getElementById('observacoes').value,
        dataCadastro: new Date().toISOString()
    };
    
    patos.push(pato);
    salvarPatos();
    atualizarLista();
    formPato.reset();
    
    // Feedback visual
    mostrarMensagem('Pato cadastrado com sucesso!', 'success');
});

function mostrarMensagem(texto, tipo) {
    const msg = document.createElement('div');
    msg.className = `mensagem mensagem-${tipo}`;
    msg.textContent = texto;
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 6px;
        z-index: 2000;
        animation: fadeIn 0.3s;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// ===== LISTA =====

function atualizarLista() {
    const busca = document.getElementById('busca')?.value.toLowerCase() || '';
    const filtroSaude = document.getElementById('filtroSaude')?.value || '';
    
    let patosFiltrados = patos.filter(pato => {
        const matchBusca = pato.nome.toLowerCase().includes(busca) || 
                          pato.raca.toLowerCase().includes(busca);
        const matchSaude = !filtroSaude || pato.saude === filtroSaude;
        return matchBusca && matchSaude;
    });
    
    if (patosFiltrados.length === 0) {
        listaPatos.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <h3>Nenhum pato encontrado</h3>
                <p>Cadastre seu primeiro pato ou ajuste os filtros.</p>
            </div>
        `;
        return;
    }
    
    listaPatos.innerHTML = patosFiltrados.map(pato => criarCardPato(pato)).join('');
}

function criarCardPato(pato) {
    const iconeGenero = pato.genero === 'Macho' ? '♂️' : '♀️';
    const corSaude = getCorSaude(pato.saude);
    
    return `
        <div class="card" data-id="${pato.id}">
            <h3>🦆 ${pato.nome} ${iconeGenero}</h3>
            <p class="info">
                <strong>Raça:</strong> ${pato.raca}<br>
                <strong>Idade:</strong> ${pato.idade} meses<br>
                <strong>Peso:</strong> ${pato.peso} kg<br>
                <strong>Saúde:</strong> <span style="color: ${corSaude}; font-weight: bold;">● ${pato.saude}</span>
            </p>
            ${pato.observacoes ? `<p class="observacoes">${pato.observacoes}</p>` : ''}
            <div class="card-actions">
                <button class="btn-editar" onclick="editarPato('${pato.id}')">✏️ Editar</button>
                <button class="btn-excluir" onclick="excluirPato('${pato.id}')">🗑️ Excluir</button>
            </div>
        </div>
    `;
}

function getCorSaude(saude) {
    switch(saude) {
        case 'Saudável': return '#4CAF50';
        case 'Recuperando': return '#FF9800';
        case 'Em tratamento': return '#2196F3';
        case 'Doente': return '#f44336';
        default: return '#666';
    }
}

// ===== EDIÇÃO =====

function inicializarFiltros() {
    const buscaInput = document.getElementById('busca');
    const filtroSaudeSelect = document.getElementById('filtroSaude');
    
    if (buscaInput) {
        buscaInput.addEventListener('input', atualizarLista);
    }
    if (filtroSaudeSelect) {
        filtroSaudeSelect.addEventListener('change', atualizarLista);
    }
}

function editarPato(id) {
    patoEditando = patos.find(p => String(p.id) === String(id));
    if (!patoEditando) return;
    
    document.getElementById('editId').value = patoEditando.id;
    document.getElementById('editNome').value = patoEditando.nome || '';
    document.getElementById('editRaca').value = patoEditando.raca || '';
    document.getElementById('editIdade').value = patoEditando.idade || 0;
    document.getElementById('editGenero').value = patoEditando.genero || 'Macho';
    document.getElementById('editPeso').value = patoEditando.peso || 1;
    document.getElementById('editSaude').value = patoEditando.saude || 'Saudável';
    document.getElementById('editObservacoes').value = patoEditando.observacoes || '';
    
    modalEdicao.style.display = 'flex';
}

formEdicao.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const indice = patos.findIndex(p => String(p.id) === String(id));
    
    if (indice === -1) return;
    
    patos[indice] = {
        ...patos[indice],
        nome: document.getElementById('editNome').value,
        raca: document.getElementById('editRaca').value,
        idade: parseInt(document.getElementById('editIdade').value) || 0,
        genero: document.getElementById('editGenero').value,
        peso: parseFloat(document.getElementById('editPeso').value) || 0,
        saude: document.getElementById('editSaude').value,
        observacoes: document.getElementById('editObservacoes').value
    };
    
    salvarPatos();
    atualizarLista();
    atualizarEstatisticas();
    fecharModal();
    mostrarMensagem('Pato atualizado com sucesso!', 'success');
});

function fecharModal() {
    modalEdicao.style.display = 'none';
    patoEditando = null;
}

// Global window bindings for onclick
window.editarPato = editarPato;
window.excluirPato = excluirPato;
window.fecharModal = fecharModal;

document.querySelector('.close-modal')?.addEventListener('click', fecharModal);
modalEdicao.addEventListener('click', (e) => {
    if (e.target === modalEdicao) fecharModal();
});

// Event delegation fallback
listaPatos?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-editar');
    if (editBtn) {
        const card = editBtn.closest('.card');
        const id = card?.dataset?.id;
        if (id) editarPato(id);
    }
    const delBtn = e.target.closest('.btn-excluir');
    if (delBtn) {
        const card = delBtn.closest('.card');
        const id = card?.dataset?.id;
        if (id) excluirPato(id);
    }
});

// ===== EXCLUSÃO =====

function excluirPato(id) {
    if (!confirm('Tem certeza que deseja excluir este pato?')) return;
    
    patos = patos.filter(p => p.id !== id);
    salvarPatos();
    atualizarLista();
    mostrarMensagem('Pato excluído com sucesso!', 'success');
}

// ===== ESTATÍSTICAS =====

function atualizarEstatisticas() {
    const total = patos.length;
    const saudaveis = patos.filter(p => p.saude === 'Saudável').length;
    const emTratamento = patos.filter(p => p.saude === 'Em tratamento').length;
    const idadeMedia = total > 0 
        ? (patos.reduce((acc, p) => acc + p.idade, 0) / total).toFixed(1)
        : 0;
    
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statSaudaveis').textContent = saudaveis;
    document.getElementById('statTratamento').textContent = emTratamento;
    document.getElementById('statIdadeMedia').textContent = idadeMedia;
    
    atualizarGraficoRaca();
}

function atualizarGraficoRaca() {
    const contagemRacas = {};
    patos.forEach(pato => {
        contagemRacas[pato.raca] = (contagemRacas[pato.raca] || 0) + 1;
    });
    
    const container = document.getElementById('distribuicaoRaca');
    
    if (Object.keys(contagemRacas).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888;">Cadastre patos para ver a distribuição por raça.</p>';
        return;
    }
    
    const maxCount = Math.max(...Object.values(contagemRacas));
    
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">';
    
    for (const [raca, count] of Object.entries(contagemRacas)) {
        const altura = Math.max(30, (count / maxCount) * 120);
        const porcentagem = ((count / patos.length) * 100).toFixed(1);
        
        html += `
            <div style="text-align: center; min-width: 80px;">
                <div style="
                    background: linear-gradient(to top, #4a90a4, #6bb3c9);
                    width: 60px;
                    height: ${altura}px;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding-bottom: 8px;
                    color: white;
                    font-weight: bold;
                ">${count}</div>
                <p style="margin-top: 8px; font-size: 0.9rem; color: #666;">${raca}</p>
                <p style="font-size: 0.75rem; color: #999;">${porcentagem}%</p>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}
