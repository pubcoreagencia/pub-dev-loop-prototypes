// Eletricista Pro - Aplicação completa para profissionais elétricos

document.addEventListener('DOMContentLoaded', function() {
    // Estado da aplicação
    let state = {
        clients: [],
        services: [],
        budgets: []
    };

    // Elementos do DOM
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    // Inicializar estado do localStorage
    function initState() {
        const savedClients = localStorage.getItem('eletricista_clients');
        const savedServices = localStorage.getItem('eletricista_services');
        
        if (savedClients) {
            state.clients = JSON.parse(savedClients);
            renderClients();
        }
        
        if (savedServices) {
            state.services = JSON.parse(savedServices);
            renderServices();
        }
    }

    // Renderizar clientes
    function renderClients() {
        const clientsList = document.getElementById('clientsList');
        
        if (state.clients.length === 0) {
            clientsList.innerHTML = '<p class="empty-state">Nenhum cliente cadastrado</p>';
            return;
        }
        
        let html = '';
        state.clients.forEach((client, index) => {
            html += `
                <div class="client-item">
                    <h4>${client.name}</h4>
                    <p>📞 ${client.phone}</p>
                    ${client.email ? `<p>📧 ${client.email}</p>` : ''}
                    ${client.address ? `<p>🏠 ${client.address}</p>` : ''}
                    <button class="btn btn-secondary btn-sm delete-client" data-index="${index}">Excluir</button>
                </div>
            `;
        });
        
        clientsList.innerHTML = html;
        
        // Adicionar eventos de exclusão
        document.querySelectorAll('.delete-client').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteClient(index);
            });
        });
    }

    // Adicionar cliente
    document.getElementById('clientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const client = {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value
        };
        
        state.clients.push(client);
        localStorage.setItem('eletricista_clients', JSON.stringify(state.clients));
        
        document.getElementById('clientName').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('clientEmail').value = '';
        document.getElementById('clientAddress').value = '';
        
        renderClients();
        updateStats();
    });

    // Excluir cliente
    function deleteClient(index) {
        if(confirm('Tem certeza que deseja excluir este cliente?')) {
            state.clients.splice(index, 1);
            localStorage.setItem('eletricista_clients', JSON.stringify(state.clients));
            renderClients();
            updateStats();
        }
    }

    // Renderizar serviços
    function renderServices() {
        const servicesResult = document.getElementById('servicesResult');
        
        if (state.services.length === 0) {
            servicesResult.innerHTML = '<p class="empty-state">Nenhum serviço cadastrado</p>';
            return;
        }
        
        let html = '';
        state.services.forEach((service, index) => {
            html += `
                <div class="service-item">
                    <h4>${service.clientName} - ${service.type}</h4>
                    <p>💰 R$ ${parseFloat(service.value).toFixed(2)}</p>
                    <p>📅 ${service.date}</p>
                    <button class="btn btn-secondary btn-sm delete-service" data-index="${index}">Excluir</button>
                </div>
            `;
        });
        
        servicesResult.innerHTML = html;
        
        // Adicionar eventos de exclusão
        document.querySelectorAll('.delete-service').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteService(index);
            });
        });
    }

    // Adicionar serviço
    document.getElementById('serviceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientIndex = document.getElementById('serviceClient').selectedIndex;
        const client = state.clients[clientIndex - 1] || { name: 'Não especificado' };
        
        const service = {
            clientName: client.name,
            type: document.getElementById('serviceType').value,
            description: document.getElementById('serviceDescription').value,
            value: parseFloat(document.getElementById('serviceValue').value),
            date: document.getElementById('serviceDate').value
        };
        
        state.services.push(service);
        localStorage.setItem('eletricista_services', JSON.stringify(state.services));
        
        document.getElementById('serviceClient').innerHTML = state.clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('') || '<option value="">Nenhum cliente</option>';
        document.getElementById('serviceDescription').value = '';
        document.getElementById('serviceValue').value = '';
        document.getElementById('serviceDate').value = '';
        
        renderServices();
        updateStats();
    });

    // Excluir serviço
    function deleteService(index) {
        if(confirm('Tem certeza que deseja excluir este serviço?')) {
            state.services.splice(index, 1);
            localStorage.setItem('eletricista_services', JSON.stringify(state.services));
            renderServices();
            updateStats();
        }
    }

    // Orçamento
    document.getElementById('budgetForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;
        const materialCost = parseFloat(document.getElementById('materialCost').value) || 0;
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const tax = parseFloat(document.getElementById('tax').value) || 0;
        
        // Calcular valores
        const subtotal = laborCost + materialCost;
        const discountAmount = (subtotal * discount) / 100;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = (taxableAmount * tax) / 100;
        const total = taxableAmount + taxAmount;
        
        // Exibir resultado
        const resultDiv = document.getElementById('budgetResult');
        resultDiv.innerHTML = `
            <h4>Resumo do Orçamento</h4>
            <p>Mão de obra: R$ ${laborCost.toFixed(2)}</p>
            <p>Materiais: R$ ${materialCost.toFixed(2)}</p>
            <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
            ${discount > 0 ? `<p>Desconto (${discount}%): -R$ ${discountAmount.toFixed(2)}</p>` : ''}
            ${tax > 0 ? `<p>Imposto (${tax}%): +R$ ${taxAmount.toFixed(2)}</p>` : ''}
            <hr>
            <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
        `;
    });

    // Cálculo de Materiais
    document.getElementById('materialsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const diameter = parseFloat(document.getElementById('cableDiameter').value);
        const installationType = document.getElementById('installationType').value;
        
        // Tabela de resistência por metro para diferentes diâmetros (aproximada)
        const resistancePerMeter = {
            '1.0': 18.1,   // 1.0 mm²
            '1.5': 12.1,   // 1.5 mm²
            '2.5': 7.41,   // 2.5 mm²
            '4.0': 4.71,   // 4.0 mm²
            '6.0': 3.09,   // 6.0 mm²
            '10.0': 1.84,  // 10.0 mm²
            '16.0': 1.15,  // 16.0 mm²
            '25.0': 0.78   // 25.0 mm²
        };
        
        const totalResistance = resistancePerMeter[diameter] * distance;
        
        // Seleção baseada na distância e tipo
        let recommendedDiameter = diameter;
        let justification = '';
        
        if (installationType === 'residential') {
            if (distance > 50 && diameter < 2.5) {
                recommendedDiameter = 2.5;
                justification = 'Para distâncias > 50m em residencial, recomenda-se 2.5mm²';
            }
        } else if (installationType === 'commercial') {
            if (distance > 30 && diameter < 4.0) {
                recommendedDiameter = 4.0;
                justification = 'Para distâncias > 30m em comercial, recomenda-se 4.0mm²';
            }
        } else if (installationType === 'industrial') {
            if (distance > 20 && diameter < 6.0) {
                recommendedDiameter = 6.0;
                justification = 'Para distâncias > 20m em industrial, recomenda-se 6.0mm²';
            }
        }
        
        const voltageDrop = (distance * 2 * 220) / (diameter * 1000); // Aproximado
        
        const resultDiv = document.getElementById('materialsResult');
        resultDiv.innerHTML = `
            <h4>Resultado do Cálculo</h4>
            <p>Distância: ${distance} m</p>
            <p>Diâmetro selecionado: ${diameter} mm²</p>
            <p>Tipo de instalação: ${installationType}</p>
            ${recommendedDiameter !== diameter ? `<p><strong>Sugestão:</strong> ${justification}</p>` : ''}
            <p>Resistência total: ${totalResistance.toFixed(2)} Ω</p>
            <p>Queda de tensão (aprox.): ${voltageDrop.toFixed(2)} V</p>
        `;
    });

    // Cálculos Elétricos
    document.getElementById('calcForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const voltage = parseFloat(document.getElementById('voltage').value) || 220;
        const resistance = parseFloat(document.getElementById('resistance').value) || 10;
        
        // Lei de Ohm: I = V / R, V = I * R, P = V * I
        const current = voltage / resistance;
        const power = voltage * current;
        
        const resultDiv = document.getElementById('calcResult');
        resultDiv.innerHTML = `
            <h4>Resultados Elétricos</h4>
            <p>Tensão: ${voltage} V</p>
            <p>Resistência: ${resistance} Ω</p>
            <p>Corrente: ${current.toFixed(2)} A</p>
            <p>Potência: ${power.toFixed(2)} W</p>
            <p>Lei de Ohm: V = I × R</p>
        `;
    });

    // Navegação
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.target === sectionId) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.dataset.target;
            showSection(target);
        });
    });

    // Menu mobile
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
        }
    });

    // Atualizar estatísticas
    function updateStats() {
        const servicesCount = document.getElementById('servicesCount');
        const clientsCount = document.getElementById('clientsCount');
        const totalRevenue = document.getElementById('totalRevenue');
        
        servicesCount.textContent = state.services.length;
        clientsCount.textContent = state.clients.length;
        
        const totalRevenueValue = state.services.reduce((sum, service) => sum + service.value, 0);
        totalRevenue.textContent = `R$ ${totalRevenueValue.toFixed(2)}`;
    }

    // Popular seleção de clientes no formulário de serviço
    function populateServiceClients() {
        const clientSelect = document.getElementById('serviceClient');
        let options = '<option value="">Selecione um cliente</option>';
        
        state.clients.forEach(client => {
            options += `<option value="${client.name}">${client.name}</option>`;
        });
        
        clientSelect.innerHTML = options;
    }

    // Inicializar
    initState();
    populateServiceClients();
    updateStats();
});