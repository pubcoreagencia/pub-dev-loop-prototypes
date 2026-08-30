// Simple storage using localStorage
const STORAGE_KEY_CLIENTS = 'eletricista_clients';
const STORAGE_KEY_BUDGETS = 'eletricista_budgets';

// Initialize data
let clients = JSON.parse(localStorage.getItem(STORAGE_KEY_CLIENTS)) || [];
let budgets = JSON.parse(localStorage.getItem(STORAGE_KEY_BUDGETS)) || [];

// DOM Elements
const views = {
  dashboard: document.getElementById('dashboard'),
  clients: document.getElementById('clients'),
  budget: document.getElementById('budget')
};
const navButtons = document.querySelectorAll('.nav-btn');

// Stats elements
const statClients = document.getElementById('stat-clients');
const statBudgets = document.getElementById('stat-budgets');
const statRevenue = document.getElementById('stat-revenue');
const recentBudgetsList = document.getElementById('recent-budgets');

// Client form and list
const clientForm = document.getElementById('client-form');
const clientList = document.getElementById('client-list');
const budgetClientSelect = document.getElementById('budget-client');

// Budget form
const budgetForm = document.getElementById('budget-form');
const budgetTotalInput = document.getElementById('budget-total');
const budgetMaterials = document.getElementById('budget-materials');
const budgetLabor = document.getElementById('budget-labor');
const budgetList = document.getElementById('budget-list');

// Initialize
function init() {
  // Navigation
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      showView(view);
      // Update select options when navigating to budget or dashboard
      if (view === 'budget' || view === 'dashboard') {
        updateClientSelect();
      }
      if (view === 'dashboard') {
        updateDashboard();
      }
    });
  });

  // Client form submit
  clientForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const address = document.getElementById('client-address').value.trim();

    if (!name) return;

    const client = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      address
    };

    clients.push(client);
    saveClients();
    renderClientList();
    clientForm.reset();
    updateClientSelect(); // update select in budget form
    updateDashboard(); // update stats
  });

  // Budget form calculate total on input change
  budgetMaterials.addEventListener('input', calculateTotal);
  budgetLabor.addEventListener('input', calculateTotal);

  // Budget form submit
  budgetForm.addEventListener('submit', e => {
    e.preventDefault();
    const clientId = budgetClientSelect.value;
    const service = document.getElementById('budget-service').value.trim();
    const materials = parseFloat(budgetMaterials.value) || 0;
    const labor = parseFloat(budgetLabor.value) || 0;
    const total = materials + labor;

    if (!clientId || !service) return;

    // Find client name
    const client = clients.find(c => c.id === clientId);
    const budget = {
      id: Date.now().toString(),
      clientId,
      clientName: client ? client.name : 'Unknown',
      service,
      materials,
      labor,
      total,
      date: new Date().toISOString()
    };

    budgets.push(budget);
    saveBudgets();
    renderBudgetList();
    budgetForm.reset();
    budgetTotalInput.value = '';
    updateDashboard(); // update stats and recent budgets
    showView('dashboard'); // go to dashboard after saving
  });

  // Initial load
  showView('dashboard'); // start with dashboard
  updateClientSelect();
  updateDashboard();
}

// Navigation
function showView(viewName) {
  // Hide all views
  Object.values(views).forEach(v => v.classList.remove('active'));
  // Show selected view
  if (views[viewName]) {
    views[viewName].classList.add('active');
  }
  // Update active button
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
}

// Client functions
function saveClients() {
  localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
}
function renderClientList() {
  clientList.innerHTML = '';
  if (clients.length === 0) {
    clientList.innerHTML = '<li>No clients yet.</li>';
    return;
  }
  clients.forEach(client => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${client.name}</strong><br>
      ${client.phone || ''} ${client.email || ''}<br>
      <small>${client.address || ''}</small>
    `;
    clientList.appendChild(li);
  });
}

// Budget functions
function saveBudgets() {
  localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
}
function calculateTotal() {
  const m = parseFloat(budgetMaterials.value) || 0;
  const l = parseFloat(budgetLabor.value) || 0;
  budgetTotalInput.value = (m + l).toFixed(2);
}
function renderBudgetList() {
  budgetList.innerHTML = '';
  if (budgets.length === 0) {
    budgetList.innerHTML = '<li>No budgets yet.</li>';
    return;
  }
  // Show recent first
  const sorted = [...budgets].sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach(b => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${b.clientName}</strong> - ${b.service}<br>
      Materials: R$ ${b.materials.toFixed(2)} | Labor: R$ ${b.labor.toFixed(2)}<br>
      <strong>Total: R$ ${b.total.toFixed(2)}</strong><br>
      <small>${new Date(b.date).toLocaleString()}</small>
    `;
    budgetList.appendChild(li);
  });
}

// Update client select (for budget form)
function updateClientSelect() {
  budgetClientSelect.innerHTML = '<option value="">Select a client</option>';
  clients.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = c.name;
    budgetClientSelect.appendChild(option);
  });
}

// Dashboard update
function updateDashboard() {
  // Stats
  statClients.textContent = clients.length;
  statBudgets.textContent = budgets.length;
  const totalRevenue = budgets.reduce((sum, b) => sum + b.total, 0);
  statRevenue.textContent = `R$ ${totalRevenue.toFixed(2)}`;

  // Recent budgets (last 3)
  recentBudgetsList.innerHTML = '';
  const recent = [...budgets]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  if (recent.length === 0) {
    recentBudgetsList.innerHTML = '<li>No budgets yet.</li>';
    return;
  }
  recent.forEach(b => {
    const li = document.createElement('li');
    li.textContent = `${b.clientName}: R$ ${b.total.toFixed(2)}`;
    recentBudgetsList.appendChild(li);
  });
}

// Start
init();