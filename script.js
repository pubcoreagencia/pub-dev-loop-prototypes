document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('serviceModal');
    const btn = document.getElementById('addServiceBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('serviceForm');
    const servicesList = document.getElementById('servicesList');

    // Abrir modal
    btn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.getElementById('serviceDate').valueAsDate = new Date();
    });

    // Fechar modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        form.reset();
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            form.reset();
        }
    });

    // Adicionar novo serviço
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const serviceName = document.getElementById('serviceName').value;
        const clientName = document.getElementById('clientName').value;
        const serviceDate = document.getElementById('serviceDate').value;
        const serviceStatus = document.getElementById('serviceStatus').value;

        const formattedDate = formatDate(serviceDate);
        const statusClass = serviceStatus === 'completed' ? 'completed' : 
                            serviceStatus === 'in-progress' ? 'in-progress' : 'pending';
        const statusText = serviceStatus === 'completed' ? 'Concluído' : 
                           serviceStatus === 'in-progress' ? 'Em Andamento' : 'Pendente';

        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.innerHTML = `
            <h3>${serviceName}</h3>
            <p>Cliente: ${clientName}</p>
            <p>Data: ${formattedDate}</p>
            <span class="status ${statusClass}">${statusText}</span>
        `;

        servicesList.insertBefore(serviceItem, servicesList.firstChild);

        modal.style.display = 'none';
        form.reset();

        // Atualizar contadores
        updateStats(serviceStatus);
    });

    function formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function updateStats(status) {
        const statCards = document.querySelectorAll('.stat-card');
        const totalServices = statCards[0].querySelector('.stat-number');
        const pendingServices = statCards[2].querySelector('.stat-number');

        const currentTotal = parseInt(totalServices.textContent) || 0;
        const currentPending = parseInt(pendingServices.textContent) || 0;

        totalServices.textContent = currentTotal + 1;

        if (status !== 'completed') {
            pendingServices.textContent = currentPending + 1;
        }
    }
});