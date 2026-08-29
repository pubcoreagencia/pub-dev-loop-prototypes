// App State
let state = {
    clients: [],
    appointments: [],
    services: [],
    reminders: []
};

let currentWeekDate = new Date();

// Load data from localStorage
function loadState() {
    try {
        const saved = localStorage.getItem('manicure-pro-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            state.clients = parsed.clients || [];
            state.appointments = parsed.appointments || [];
            state.services = parsed.services || [];
            state.reminders = parsed.reminders || [];
        }
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
    }
}

// Save data to localStorage
function saveState() {
    try {
        localStorage.setItem('manicure-pro-state', JSON.stringify(state));
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
    }
}

// Initialize app
function init() {
    loadState();
    renderAll();
    setupFormHandlers();
}

// Render everything
function renderAll() {
    updateDashboard();
    renderClients();
    renderSchedule();
    renderServices();
    renderReminders();
}

// Tab Navigation
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    event.target.closest('.tab-btn').classList.add('active');
}

// Dashboard
function updateDashboard() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(today);

    // Today's appointments
    const todayApps = state.appointments.filter(a => a.date === todayStr);
    document.getElementById('today-appointments').textContent = `${todayApps.length} agendamento${todayApps.length !== 1 ? 's' : ''}`;

    // This week's appointments
    const weekApps = state.appointments.filter(a => a.date >= weekStart && a.date <= weekEnd);
    document.getElementById('week-appointments').textContent = `${weekApps.length} agendamento${weekApps.length !== 1 ? 's' : ''}`;

    // Total clients
    document.getElementById('total-clients').textContent = `${state.clients.length} cliente${state.clients.length !== 1 ? 's' : ''}`;

    // This week's revenue
    const weekRevenue = weekApps.reduce((sum, app) => {
        const service = state.services.find(s => s.id === app.serviceId);
        return sum + (service ? service.price : 0);
    }, 0);
    document.getElementById('week-revenue').textContent = `R$ ${weekRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    // Dashboard appointments
    const dashAppointments = document.getElementById('dashboard-appointments');
    if (todayApps.length === 0) {
        dashAppointments.innerHTML = '<p class="empty-state">Nenhum agendamento hoje</p>';
    } else {
        dashAppointments.innerHTML = todayApps.map(app => {
            const service = state.services.find(s => s.id === app.serviceId);
            const client = state.clients.find(c => c.id === app.clientId);
            return `
                <div class="appointment-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 10px; margin-bottom: 8px;">
                    <div>
                        <strong>${client ? client.name : 'Cliente'}</strong>
                        <p style="color: #666; font-size: 0.9rem;">${service ? service.name : 'Serviço'} • ${app.time}</p>
                    </div>
                    <span class="status-badge">${app.completed ? 'Concluído' : 'Pendente'}</span>
                </div>
            `;
        }).join('');
    }

    // Dashboard clients (last 3)
    const dashClients = document.getElementById('dashboard-clients');
    const recentClients = state.clients.slice(-3).reverse();
    if (recentClients.length === 0) {
        dashClients.innerHTML = '<p class="empty-state">Nenhum cliente cadastrado</p>';
    } else {
        dashClients.innerHTML = recentClients.map(client => {
            const initial = client.name.charAt(0).toUpperCase();
            return `
                <div class="client-item">
                    <div class="client-info">
                        <div class="client-avatar">${initial}</div>
                        <div class="client-details">
                            <h4>${client.name}</h4>
                            <p>${client.phone}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Dashboard reminders for today
    const dashReminders = document.getElementById('dashboard-reminders');
    const todayReminders = state.reminders.filter(r => r.date === todayStr);
    if (todayReminders.length === 0) {
        dashReminders.innerHTML = '<p class="empty-state">Nenhum lembrete para hoje</p>';
    } else {
        dashReminders.innerHTML = todayReminders.map(reminder => `
            <div class="reminder-item">
                <div class="reminder-info">
                    <h4>${reminder.title}</h4>
                    <p>${reminder.notes || 'Sem observações'}</p>
                </div>
                <span class="reminder-date"><i class="fas fa-clock"></i> ${reminder.time || 'Sem hora'}</span>
            </div>
        `).join('');
    }
}

// Clients
function renderClients() {
    const container = document.getElementById('clients-list');
    if (state.clients.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum cliente cadastrado</p>';
        return;
    }

    container.innerHTML = state.clients.map(client => {
        const initial = client.name.charAt(0).toUpperCase();
        return `
            <div class="client-item">
                <div class="client-info">
                    <div class="client-avatar">${initial}</div>
                    <div class="client-details">
                        <h4>${client.name}</h4>
                        <p>${client.phone}${client.email ? ` • ${client.email}` : ''}</p>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editClient('${client.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteClient('${client.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function searchClients() {
    const searchTerm = document.getElementById('client-search').value.toLowerCase();
    const filtered = state.clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.phone.includes(searchTerm)
    );

    const container = document.getElementById('clients-list');
    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum cliente encontrado</p>';
        return;
    }

    container.innerHTML = filtered.map(client => {
        const initial = client.name.charAt(0).toUpperCase();
        return `
            <div class="client-item">
                <div class="client-info">
                    <div class="client-avatar">${initial}</div>
                    <div class="client-details">
                        <h4>${client.name}</h4>
                        <p>${client.phone}${client.email ? ` • ${client.email}` : ''}</p>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editClient('${client.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteClient('${client.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

// Schedule
function renderSchedule() {
    const weekStart = getWeekStart(currentWeekDate);
    const weekEnd = getWeekEnd(currentWeekDate);

    document.getElementById('current-week').textContent = formatWeekRange(weekStart, weekEnd);

    const container = document.getElementById('calendar-grid');
    let html = '';

    // Headers
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    days.forEach(day => {
        html += `<div class="calendar-header">${day}</div>`;
    });

    // Get the date range to show (previous month end, current week, next month start)
    const startDate = new Date(weekStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(weekEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Generate days
    const current = new Date(startDate);
    while (current <= endDate) {
        const dateStr = current.toISOString().split('T')[0];
        const isToday = isSameDay(current, new Date());
        const isCurrentMonth = current.getMonth() === new Date().getMonth();
        const dayAppointments = state.appointments.filter(a => a.date === dateStr);

        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}">
                <div class="day-header ${isToday ? 'today' : ''}">${current.getDate()}</div>
                <div class="day-appointments">
                    ${dayAppointments.map(app => {
                        const service = state.services.find(s => s.id === app.serviceId);
                        const client = state.clients.find(c => c.id === app.clientId);
                        return `
                            <div class="day-appointment ${app.completed ? 'completed' : ''}" title="${client ? client.name : ''} - ${service ? service.name : ''}">
                                ${app.time} - ${client ? client.name.split(' ')[0] : ''}
                            </div>
                        `;
                    }).join('')}
                    ${dayAppointments.length === 0 ? '<p style="color: #ccc; font-size: 0.8rem; text-align: center;">Sem agendamentos</p>' : ''}
                </div>
            </div>
        `;

        current.setDate(current.getDate() + 1);
    }

    container.innerHTML = html;
}

function previousWeek() {
    currentWeekDate.setDate(currentWeekDate.getDate() - 7);
    renderSchedule();
}

function nextWeek() {
    currentWeekDate.setDate(currentWeekDate.getDate() + 7);
    renderSchedule();
}

// Services
function renderServices() {
    const container = document.getElementById('services-list');
    if (state.services.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum serviço cadastrado</p>';
        return;
    }

    container.innerHTML = state.services.map(service => `
        <div class="service-item">
            <div class="service-details">
                <h4>${service.name}</h4>
                <p>${service.description || 'Sem descrição'}</p>
                <p style="color: #999; font-size: 0.8rem;">Duração: ${service.duration} min</p>
            </div>
            <div class="service-price">R$ ${service.price.toFixed(2)}</div>
            <div class="action-buttons">
                <button class="btn-icon btn-edit" onclick="editService('${service.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteService('${service.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Reminders
function renderReminders() {
    const container = document.getElementById('reminders-list');
    const sortedReminders = [...state.reminders].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (sortedReminders.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum lembrete cadastrado</p>';
        return;
    }

    container.innerHTML = sortedReminders.map(reminder => `
        <div class="reminder-item">
            <div class="reminder-info">
                <h4>${reminder.title}</h4>
                <p>${reminder.notes || 'Sem observações'}</p>
                <p class="reminder-date"><i class="fas fa-calendar"></i> ${formatDate(reminder.date)} ${reminder.time ? `• ${reminder.time}` : ''}</p>
            </div>
            <div class="action-buttons">
                <button class="btn-icon btn-edit" onclick="editReminder('${reminder.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteReminder('${reminder.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Modals - Clients
function openClientModal(clientId = null) {
    const modal = document.getElementById('client-modal');
    const title = document.getElementById('client-modal-title');

    if (clientId) {
        const client = state.clients.find(c => c.id === clientId);
        if (client) {
            title.textContent = 'Editar Cliente';
            document.getElementById('client-name').value = client.name;
            document.getElementById('client-phone').value = client.phone;
            document.getElementById('client-email').value = client.email || '';
            document.getElementById('client-notes').value = client.notes || '';
            document.getElementById('client-form').dataset.editId = clientId;
        }
    } else {
        title.textContent = 'Novo Cliente';
        document.getElementById('client-form').reset();
        delete document.getElementById('client-form').dataset.editId;
    }

    modal.classList.add('active');
}

function closeClientModal() {
    document.getElementById('client-modal').classList.remove('active');
}

function saveClient(e) {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const notes = document.getElementById('client-notes').value.trim();
    const editId = document.getElementById('client-form').dataset.editId;

    if (editId) {
        const index = state.clients.findIndex(c => c.id === editId);
        if (index !== -1) {
            state.clients[index] = { ...state.clients[index], name, phone, email, notes };
        }
    } else {
        state.clients.push({
            id: generateId(),
            name,
            phone,
            email,
            notes
        });
    }

    saveState();
    renderAll();
    closeClientModal();
}

function editClient(clientId) {
    openClientModal(clientId);
}

function deleteClient(clientId) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        state.clients = state.clients.filter(c => c.id !== clientId);
        state.appointments = state.appointments.filter(a => a.clientId !== clientId);
        saveState();
        renderAll();
    }
}

// Modals - Appointments
function openAppointmentModal(appointmentId = null) {
    const modal = document.getElementById('appointment-modal');
    const title = document.getElementById('appointment-modal-title');

    // Populate dropdowns
    const clientSelect = document.getElementById('appointment-client');
    const serviceSelect = document.getElementById('appointment-service');

    clientSelect.innerHTML = '<option value="">Selecione o cliente</option>' +
        state.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    serviceSelect.innerHTML = '<option value="">Selecione o serviço</option>' +
        state.services.map(s => `<option value="${s.id}">${s.name} - R$ ${s.price.toFixed(2)}</option>`).join('');

    if (appointmentId) {
        const appt = state.appointments.find(a => a.id === appointmentId);
        if (appt) {
            title.textContent = 'Editar Agendamento';
            clientSelect.value = appt.clientId;
            serviceSelect.value = appt.serviceId;
            document.getElementById('appointment-date').value = appt.date;
            document.getElementById('appointment-time').value = appt.time;
            document.getElementById('appointment-notes').value = appt.notes || '';
            document.getElementById('appointment-form').dataset.editId = appointmentId;
        }
    } else {
        title.textContent = 'Novo Agendamento';
        document.getElementById('appointment-form').reset();
        delete document.getElementById('appointment-form').dataset.editId;
        document.getElementById('appointment-date').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('active');
}

function closeAppointmentModal() {
    document.getElementById('appointment-modal').classList.remove('active');
}

function saveAppointment(e) {
    e.preventDefault();

    const clientId = document.getElementById('appointment-client').value;
    const serviceId = document.getElementById('appointment-service').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const notes = document.getElementById('appointment-notes').value.trim();
    const editId = document.getElementById('appointment-form').dataset.editId;

    if (editId) {
        const index = state.appointments.findIndex(a => a.id === editId);
        if (index !== -1) {
            state.appointments[index] = { ...state.appointments[index], clientId, serviceId, date, time, notes };
        }
    } else {
        state.appointments.push({
            id: generateId(),
            clientId,
            serviceId,
            date,
            time,
            notes,
            completed: false
        });
    }

    saveState();
    renderAll();
    closeAppointmentModal();
}

function editAppointment(appointmentId) {
    openAppointmentModal(appointmentId);
}

function deleteAppointment(appointmentId) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
        state.appointments = state.appointments.filter(a => a.id !== appointmentId);
        saveState();
        renderAll();
    }
}

// Modals - Services
function openServiceModal(serviceId = null) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');

    if (serviceId) {
        const service = state.services.find(s => s.id === serviceId);
        if (service) {
            title.textContent = 'Editar Serviço';
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-price').value = service.price;
            document.getElementById('service-duration').value = service.duration;
            document.getElementById('service-description').value = service.description || '';
            document.getElementById('service-form').dataset.editId = serviceId;
        }
    } else {
        title.textContent = 'Novo Serviço';
        document.getElementById('service-form').reset();
        delete document.getElementById('service-form').dataset.editId;
    }

    modal.classList.add('active');
}

function closeServiceModal() {
    document.getElementById('service-modal').classList.remove('active');
}

function saveService(e) {
    e.preventDefault();

    const name = document.getElementById('service-name').value.trim();
    const price = parseFloat(document.getElementById('service-price').value);
    const duration = parseInt(document.getElementById('service-duration').value);
    const description = document.getElementById('service-description').value.trim();
    const editId = document.getElementById('service-form').dataset.editId;

    if (editId) {
        const index = state.services.findIndex(s => s.id === editId);
        if (index !== -1) {
            state.services[index] = { ...state.services[index], name, price, duration, description };
        }
    } else {
        state.services.push({
            id: generateId(),
            name,
            price,
            duration,
            description
        });
    }

    saveState();
    renderAll();
    closeServiceModal();
}

function editService(serviceId) {
    openServiceModal(serviceId);
}

function deleteService(serviceId) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        state.services = state.services.filter(s => s.id !== serviceId);
        state.appointments = state.appointments.filter(a => a.serviceId !== serviceId);
        saveState();
        renderAll();
    }
}

// Modals - Reminders
function openReminderModal(reminderId = null) {
    const modal = document.getElementById('reminder-modal');
    const title = document.getElementById('reminder-modal-title');

    if (reminderId) {
        const reminder = state.reminders.find(r => r.id === reminderId);
        if (reminder) {
            title.textContent = 'Editar Lembrete';
            document.getElementById('reminder-title').value = reminder.title;
            document.getElementById('reminder-date').value = reminder.date;
            document.getElementById('reminder-time').value = reminder.time || '';
            document.getElementById('reminder-notes').value = reminder.notes || '';
            document.getElementById('reminder-form').dataset.editId = reminderId;
        }
    } else {
        title.textContent = 'Novo Lembrete';
        document.getElementById('reminder-form').reset();
        delete document.getElementById('reminder-form').dataset.editId;
    }

    modal.classList.add('active');
}

function closeReminderModal() {
    document.getElementById('reminder-modal').classList.remove('active');
}

function saveReminder(e) {
    e.preventDefault();

    const title = document.getElementById('reminder-title').value.trim();
    const date = document.getElementById('reminder-date').value;
    const time = document.getElementById('reminder-time').value;
    const notes = document.getElementById('reminder-notes').value.trim();
    const editId = document.getElementById('reminder-form').dataset.editId;

    if (editId) {
        const index = state.reminders.findIndex(r => r.id === editId);
        if (index !== -1) {
            state.reminders[index] = { ...state.reminders[index], title, date, time, notes };
        }
    } else {
        state.reminders.push({
            id: generateId(),
            title,
            date,
            time,
            notes
        });
    }

    saveState();
    renderAll();
    closeReminderModal();
}

function editReminder(reminderId) {
    openReminderModal(reminderId);
}

function deleteReminder(reminderId) {
    if (confirm('Tem certeza que deseja excluir este lembrete?')) {
        state.reminders = state.reminders.filter(r => r.id !== reminderId);
        saveState();
        renderAll();
    }
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateStr) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('pt-BR', options);
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0];
}

function getWeekEnd(date) {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end.toISOString().split('T')[0];
}

function formatWeekRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return `Semana de ${startDate.toLocaleDateString('pt-BR', options)} até ${endDate.toLocaleDateString('pt-BR', options)}`;
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

// Setup form handlers
function setupFormHandlers() {
    document.getElementById('client-form').addEventListener('submit', saveClient);
    document.getElementById('appointment-form').addEventListener('submit', saveAppointment);
    document.getElementById('service-form').addEventListener('submit', saveService);
    document.getElementById('reminder-form').addEventListener('submit', saveReminder);
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    }
});

// Close modals clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);