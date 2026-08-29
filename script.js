// ============== STATE ==============
let materiais = JSON.parse(localStorage.getItem('materiais')) || [];
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

// ============== UTIL ==============
function save() {
    localStorage.setItem('materiais', JSON.stringify(materiais));
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// ============== NAVIGATION ==============
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ============== MATERIAIS ==============
function renderMateriais() {
    const body = document.getElementById('materiaisBody');
    body.innerHTML = '';
    materiais.forEach((m, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${m.nome}</td>
            <td>${m.qtd}</td>
            <td>${m.unidade}</td>
            <td><button class="remove-btn" data-index="${i}">Remover</button></td>
        `;
        body.appendChild(tr);
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            materiais.splice(btn.dataset.index, 1);
            save();
            renderMateriais();
            renderDashboard();
        });
    });
    renderDashboard();
}

document.getElementById('addMaterial').addEventListener('click', () => {
    const nome = document.getElementById('materialNome').value.trim();
    const qtd = document.getElementById('materialQtd').value;
    const unidade = document.getElementById('materialUnidade').value.trim();
    if (!nome || !qtd || !unidade) return alert('Preencha todos os campos');
    materiais.push({ nome, qtd: parseFloat(qtd), unidade });
    document.getElementById('materialNome').value = '';
    document.getElementById('materialQtd').value = '';
    document.getElementById('materialUnidade').value = '';
    save();
    renderMateriais();
});

// ============== TAREFAS ==============
function renderTarefas() {
    const ul = document.getElementById('listaTarefas');
    ul.innerHTML = '';
    tarefas.forEach((t, i) => {
        const li = document.createElement('li');
        if (t.completada) li.classList.add('completada');
        li.innerHTML = `
            <div>
                <strong>${t.nome}</strong>
                <small style="display:block; color:#7f8c8d;">${t.data || 'Sem data'}</small>
            </div>
            <div>
                <button class="toggle-btn" data-index="${i}">${t.completada ? 'Desfazer' : 'Concluir'}</button>
                <button class="remove-btn" data-index="${i}">Remover</button>
            </div>
        `;
        ul.appendChild(li);
    });
    document.querySelectorAll('#listaTarefas .toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tarefas[btn.dataset.index].completada = !tarefas[btn.dataset.index].completada;
            save();
            renderTarefas();
            renderDashboard();
        });
    });
    document.querySelectorAll('#listaTarefas .remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tarefas.splice(btn.dataset.index, 1);
            save();
            renderTarefas();
            renderDashboard();
        });
    });
    renderDashboard();
}

document.getElementById('addTarefa').addEventListener('click', () => {
    const nome = document.getElementById('tarefaNome').value.trim();
    const data = document.getElementById('tarefaData').value;
    if (!nome) return alert('Informe a descrição da tarefa');
    tarefas.push({ nome, data, completada: false });
    document.getElementById('tarefaNome').value = '';
    document.getElementById('tarefaData').value = '';
    save();
    renderTarefas();
});

// ============== DASHBOARD ==============
function renderDashboard() {
    document.getElementById('countMateriais').textContent = materiais.length;
    document.getElementById('countPendentes').textContent = tarefas.filter(t => !t.completada).length;
    document.getElementById('countProjetos').textContent = 1; // demo

    const ul = document.getElementById('listaProximas');
    ul.innerHTML = '';
    const proximas = tarefas
        .filter(t => !t.completada)
        .sort((a, b) => new Date(a.data) - new Date(b.data))
        .slice(0, 5);
    if (proximas.length === 0) {
        ul.innerHTML = '<li style="border-left-color:#bdc3c7;">Nenhuma tarefa pendente</li>';
    } else {
        proximas.forEach(t => {
            const li = document.createElement('li');
            li.style.cssText = 'background:#fff; padding:.6rem 1rem; margin-bottom:.4rem; border-left:4px solid #3498db; list-style:none; border-radius:4px;';
            li.innerHTML = `<strong>${t.nome}</strong> <small style="color:#7f8c8d;">- ${t.data || 'sem data'}</small>`;
            ul.appendChild(li);
        });
    }
}

// ============== CALCULADORA ==============
document.getElementById('calcConcreto').addEventListener('click', () => {
    const L = parseFloat(document.getElementById('cLargura').value);
    const C = parseFloat(document.getElementById('cComprimento').value);
    const E = parseFloat(document.getElementById('cEspessura').value);
    if (!L || !C || !E) return document.getElementById('resConcreto').textContent = 'Preencha todos os campos';
    const vol = (L * C * E) / 100; // m³
    const cimento = Math.ceil(vol * 7); // ~7 sacos/m³
    const areia = (vol * 0.5).toFixed(2); // m³
    const brita = (vol * 0.8).toFixed(2); // m³
    document.getElementById('resConcreto').innerHTML = `
        <p><strong>Volume:</strong> ${vol.toFixed(2)} m³</p>
        <p><strong>Cimento:</strong> ~${cimento} sacos de 50kg</p>
        <p><strong>Areia:</strong> ${areia} m³</p>
        <p><strong>Brita:</strong> ${brita} m³</p>
    `;
});

document.getElementById('calcArea').addEventListener('click', () => {
    const L = parseFloat(document.getElementById('aLargura').value);
    const C = parseFloat(document.getElementById('aComprimento').value);
    if (!L || !C) return document.getElementById('resArea').textContent = 'Preencha os campos';
    const area = L * C;
    document.getElementById('resArea').innerHTML = `<p><strong>Área total:</strong> ${area.toFixed(2)} m²</p>`;
});

document.getElementById('calcTinta').addEventListener('click', () => {
    const area = parseFloat(document.getElementById('tArea').value);
    const demao = parseInt(document.getElementById('tDemao').value);
    if (!area) return document.getElementById('resTinta').textContent = 'Informe a área';
    const rendimento = 10; // m² por litro por demão
    const litros = ((area * demao) / rendimento).toFixed(1);
    document.getElementById('resTinta').innerHTML = `
        <p><strong>Quantidade:</strong> ${litros} L</p>
        <p><small>Rendimento médio: 10 m²/L por demão</small></p>
    `;
});

// ============== INIT ==============
renderMateriais();
renderTarefas();
