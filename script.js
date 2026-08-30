// Gerenciamento de Clientes
let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
let orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]');

// Função para cadastrar cliente
function cadastrarCliente(event) {
    event.preventDefault();
    const cliente = {
        id: Date.now(),
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('endereco').value,
        data: new Date().toLocaleDateString('pt-BR')
    };
    clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    alert('Cliente cadastrado com sucesso!');
    document.getElementById('form-cliente').reset();
    carregarClientes();
}

// Função para carregar clientes na lista
function carregarClientes() {
    const lista = document.getElementById('lista-clientes');
    if (!lista) return;
    
    if (clientes.length === 0) {
        lista.innerHTML = '<p style="padding: 20px; color: #64748b;">Nenhum cliente cadastrado ainda.</p>';
        return;
    }
    
    lista.innerHTML = clientes.map(c => `
        <div class="client-item">
            <div class="client-info">
                <h4>${c.nome}</h4>
                <p>📞 ${c.telefone} | ✉️ ${c.email} | 📍 ${c.endereco}</p>
                <p style="font-size: 0.8rem;">Cadastrado em: ${c.data}</p>
            </div>
            <div>
                <button class="btn btn-danger" onclick="removerCliente(${c.id})">Remover</button>
            </div>
        </div>
    `).join('');
}

// Função para remover cliente
function removerCliente(id) {
    if (confirm('Deseja realmente remover este cliente?')) {
        clientes = clientes.filter(c => c.id !== id);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        carregarClientes();
    }
}

// Função para criar orçamento
function criarOrcamento(event) {
    event.preventDefault();
    const orcamento = {
        id: Date.now(),
        cliente: document.getElementById('cliente-select').value,
        servico: document.getElementById('servico').value,
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        prazo: document.getElementById('prazo').value,
        status: 'Pendente',
        data: new Date().toLocaleDateString('pt-BR')
    };
    orcamentos.push(orcamento);
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    alert('Orçamento criado com sucesso!');
    document.getElementById('form-orcamento').reset();
    carregarOrcamentos();
}

// Função para carregar orçamentos
function carregarOrcamentos() {
    const lista = document.getElementById('lista-orcamentos');
    if (!lista) return;
    
    if (orcamentos.length === 0) {
        lista.innerHTML = '<p style="padding: 20px; color: #64748b;">Nenhum orçamento criado ainda.</p>';
        return;
    }
    
    lista.innerHTML = orcamentos.map(o => `
        <div class="client-item">
            <div class="client-info">
                <h4>${o.servico} - ${o.cliente}</h4>
                <p>${o.descricao}</p>
                <p>💰 R$ ${o.valor.toFixed(2)} | 📅 Prazo: ${o.prazo} dias | Status: ${o.status}</p>
            </div>
            <div>
                <button class="btn btn-success" onclick="aprovarOrcamento(${o.id})">Aprovar</button>
                <button class="btn btn-danger" onclick="removerOrcamento(${o.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

// Função para aprovar orçamento
function aprovarOrcamento(id) {
    const orcamento = orcamentos.find(o => o.id === id);
    if (orcamento) {
        orcamento.status = 'Aprovado';
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
        carregarOrcamentos();
        alert('Orçamento aprovado!');
    }
}

// Função para remover orçamento
function removerOrcamento(id) {
    if (confirm('Deseja realmente excluir este orçamento?')) {
        orcamentos = orcamentos.filter(o => o.id !== id);
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
        carregarOrcamentos();
    }
}

// Função para popular select de clientes no orçamento
function popularSelectClientes() {
    const select = document.getElementById('cliente-select');
    if (!select) return;
    select.innerHTML = '<option value="">Selecione um cliente</option>' + 
        clientes.map(c => `<option value="${c.nome}">${c.nome}</option>`).join('');
}

// Dashboard - Atualizar estatísticas
function atualizarDashboard() {
    const totalClientes = document.getElementById('total-clientes');
    const totalOrcamentos = document.getElementById('total-orcamentos');
    const orcamentosAprovados = document.getElementById('orcamentos-aprovados');
    const receitaTotal = document.getElementById('receita-total');
    
    if (totalClientes) totalClientes.textContent = clientes.length;
    if (totalOrcamentos) totalOrcamentos.textContent = orcamentos.length;
    if (orcamentosAprovados) {
        orcamentosAprovados.textContent = orcamentos.filter(o => o.status === 'Aprovado').length;
    }
    if (receitaTotal) {
        const total = orcamentos
            .filter(o => o.status === 'Aprovado')
            .reduce((sum, o) => sum + o.valor, 0);
        receitaTotal.textContent = 'R$ ' + total.toFixed(2);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const formCliente = document.getElementById('form-cliente');
    if (formCliente) formCliente.addEventListener('submit', cadastrarCliente);
    
    const formOrcamento = document.getElementById('form-orcamento');
    if (formOrcamento) formOrcamento.addEventListener('submit', criarOrcamento);
    
    carregarClientes();
    carregarOrcamentos();
    popularSelectClientes();
    atualizarDashboard();
});