/* ============================================
   Barbearia Premium — Application Logic
   ============================================ */

// ============================================
// Data
// ============================================
const SERVICES = [
    {
        id: 'corte-classico',
        name: 'Corte Clássico',
        description: 'Corte tradicional com tesoura e máquina, finalizado com pomada.',
        price: 60,
        duration: 45,
        icon: 'scissors'
    },
    {
        id: 'corte-degrade',
        name: 'Corte Degradê',
        description: 'Degradê moderno com acabamento perfeito e linhas precisas.',
        price: 75,
        duration: 50,
        icon: 'razor'
    },
    {
        id: 'barba',
        name: 'Barba',
        description: 'Modelagem com toalha quente, navalha e produtos premium.',
        price: 50,
        duration: 40,
        icon: 'razor'
    },
    {
        id: 'corte-barba',
        name: 'Corte + Barba',
        description: 'Combo completo: corte de cabelo + modelagem de barba.',
        price: 100,
        duration: 80,
        icon: 'comb'
    },
    {
        id: 'pigmentacao',
        name: 'Pigmentação',
        description: 'Aplicação de pigmento para disfarçar falhas e dar volume.',
        price: 120,
        duration: 90,
        icon: 'brush'
    },
    {
        id: 'tratamento',
        name: 'Tratamento Capilar',
        description: 'Hidratação profunda, limpeza e revitalização dos fios.',
        price: 90,
        duration: 60,
        icon: 'drop'
    }
];

const ICONS = {
    scissors: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
    razor: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 2l-7 7m7-7l3 3-7 7-3-3 7-7zM9.5 7l3 3m-6 6.5l3 3 7-7-3-3m-7 7l-3 3m3-3l3 3"/></svg>',
    comb: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18"/></svg>',
    brush: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08M9.06 11.9l-4.24 4.24a2.85 2.85 0 0 0 4.03 4.03l4.24-4.24M9.06 11.9l4.24-4.24"/></svg>',
    drop: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
};

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// ============================================
// State
// ============================================
const state = {
    currentStep: 1,
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    calendarDate: new Date(),
    bookings: JSON.parse(localStorage.getItem('barbearia_bookings') || '[]')
};

// ============================================
// Utility Functions
// ============================================
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

function formatDateLong(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, parseInt(month) - 1, day);
    return `${WEEKDAYS[date.getDay()]}, ${parseInt(day)} de ${MONTHS[date.getMonth()]} de ${year}`;
}

function isPastDate(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = dateStr.split('-');
    return new Date(year, parseInt(month) - 1, day) < today;
}

function isToday(dateStr) {
    const today = new Date();
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, parseInt(month) - 1, day);
    return today.toDateString() === date.toDateString();
}

function isSunday(date) {
    return date.getDay() === 0;
}

function getDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveBookings() {
    localStorage.setItem('barbearia_bookings', JSON.stringify(state.bookings));
}

function getBookedSlots(dateStr) {
    return state.bookings
        .filter(b => b.date === dateStr)
        .map(b => b.time);
}

function isSlotBooked(dateStr, time) {
    return getBookedSlots(dateStr).includes(time);
}

function isPastTime(dateStr, time) {
    if (!isToday(dateStr)) return false;
    const now = new Date();
    const [h, m] = time.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(h, m, 0, 0);
    return slotTime <= now;
}

// ============================================
// Render Services Grid (Section)
// ============================================
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = SERVICES.map((service, i) => `
        <div class="service-card" style="animation-delay: ${i * 80}ms">
            <div class="service-icon">${ICONS[service.icon]}</div>
            <h3 class="service-name">${service.name}</h3>
            <p class="service-description">${service.description}</p>
            <div class="service-meta">
                <div>
                    <div class="service-price">
                        <span class="currency">R$</span>${service.price}
                    </div>
                </div>
                <div class="service-duration">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${service.duration} min
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Booking Services List (Step 1)
// ============================================
function renderBookingServices() {
    const list = document.getElementById('bookingServices');
    list.innerHTML = SERVICES.map(service => `
        <div class="service-item" data-id="${service.id}">
            <div class="service-item-icon">${ICONS[service.icon]}</div>
            <div class="service-item-content">
                <div class="service-item-name">${service.name}</div>
                <div class="service-item-desc">${service.description}</div>
            </div>
            <div class="service-item-right">
                <div class="service-item-price">${formatPrice(service.price)}</div>
                <div class="service-item-duration">${service.duration} min</div>
            </div>
            <div class="service-check">${ICONS.check}</div>
        </div>
    `).join('');

    list.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', () => {
            list.querySelectorAll('.service-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            state.selectedService = SERVICES.find(s => s.id === item.dataset.id);
        });
    });
}

// ============================================
// Calendar
// ============================================
function renderCalendar() {
    const year = state.calendarDate.getFullYear();
    const month = state.calendarDate.getMonth();

    document.getElementById('calendarTitle').textContent = `${MONTHS[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Empty slots before first day
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ day: '', empty: true });
    }

    // Day cells
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dateStr = getDateString(date);
        const past = date < today;
        const sunday = isSunday(date);
        const today_ = isToday(dateStr);
        const selected = state.selectedDate === dateStr;

        days.push({
            day: d,
            dateStr,
            disabled: past || sunday,
            today: today_,
            selected
        });
    }

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = days.map(d => {
        if (d.empty) {
            return `<div class="calendar-day empty"></div>`;
        }
        const classes = ['calendar-day'];
        if (d.disabled) classes.push('disabled');
        if (d.today) classes.push('today');
        if (d.selected) classes.push('selected');
        return `<div class="${classes.join(' ')}" data-date="${d.dateStr}">${d.day}</div>`;
    }).join('');

    calendarDays.querySelectorAll('.calendar-day:not(.empty):not(.disabled)').forEach(el => {
        el.addEventListener('click', () => {
            state.selectedDate = el.dataset.date;
            state.selectedTime = null;
            renderCalendar();
            renderTimeSlots();
        });
    });
}

function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    if (!state.selectedDate) {
        container.innerHTML = '<p class="timeslots-empty">Selecione uma data para ver os horários</p>';
        return;
    }

    const bookedSlots = getBookedSlots(state.selectedDate);
    const slots = TIME_SLOTS.map(time => {
        const booked = isSlotBooked(state.selectedDate, time);
        const past = isPastTime(state.selectedDate, time);
        const disabled = booked || past;
        const selected = state.selectedTime === time;
        return `<button class="timeslot${selected ? ' selected' : ''}" data-time="${time}"${disabled ? ' disabled' : ''}>${time}</button>`;
    }).join('');

    container.innerHTML = slots;

    container.querySelectorAll('.timeslot:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.timeslot').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.selectedTime = btn.dataset.time;
        });
    });
}

// ============================================
// Booking Stepper
// ============================================
function goToStep(step) {
    state.currentStep = step;

    document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.booking-step[data-step="${step}"]`).classList.add('active');

    document.querySelectorAll('.stepper .step').forEach(s => {
        const sStep = parseInt(s.dataset.step);
        s.classList.remove('active', 'completed');
        if (sStep === step) s.classList.add('active');
        else if (sStep < step) s.classList.add('completed');
    });

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (step === 1) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }

    if (step === 3) {
        nextBtn.innerHTML = `
            <span>Confirmar Agendamento</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
    } else {
        nextBtn.innerHTML = `
            <span>Continuar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
            </svg>
        `;
    }

    if (step === 3) updateSummary();

    // Scroll to top of booking
    document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateStep() {
    if (state.currentStep === 1) {
        if (!state.selectedService) {
            showToast('Selecione um serviço', 'Por favor, escolha o serviço desejado.', 'error');
            return false;
        }
        return true;
    }
    if (state.currentStep === 2) {
        if (!state.selectedDate) {
            showToast('Selecione uma data', 'Por favor, escolha a data do agendamento.', 'error');
            return false;
        }
        if (!state.selectedTime) {
            showToast('Selecione um horário', 'Por favor, escolha o horário disponível.', 'error');
            return false;
        }
        return true;
    }
    return true;
}

function updateSummary() {
    const service = state.selectedService;
    document.getElementById('summaryService').textContent = service ? service.name : '—';
    document.getElementById('summaryDate').textContent = state.selectedDate ? formatDateLong(state.selectedDate) : '—';
    document.getElementById('summaryTime').textContent = state.selectedTime || '—';
    document.getElementById('summaryPrice').textContent = service ? formatPrice(service.price) : '—';
}

function submitBooking() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();

    let valid = true;

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    nameError.textContent = '';
    phoneError.textContent = '';
    document.getElementById('clientName').parentElement.classList.remove('error');
    document.getElementById('clientPhone').parentElement.classList.remove('error');

    if (!name || name.length < 3) {
        nameError.textContent = 'Nome deve ter pelo menos 3 caracteres';
        document.getElementById('clientName').parentElement.classList.add('error');
        valid = false;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
        phoneError.textContent = 'Telefone inválido';
        document.getElementById('clientPhone').parentElement.classList.add('error');
        valid = false;
    }

    if (!valid) {
        showToast('Dados incompletos', 'Verifique os campos obrigatórios.', 'error');
        return;
    }

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = true;
    nextBtn.innerHTML = '<span class="spinner"></span> Processando...';

    setTimeout(() => {
        const booking = {
            id: Date.now().toString(36),
            serviceId: state.selectedService.id,
            serviceName: state.selectedService.name,
            price: state.selectedService.price,
            date: state.selectedDate,
            time: state.selectedTime,
            clientName: name,
            phone: cleanPhone,
            email: document.getElementById('clientEmail').value.trim(),
            notes: document.getElementById('clientNotes').value.trim(),
            createdAt: new Date().toISOString()
        };

        state.bookings.push(booking);
        saveBookings();

        showSuccessModal(booking);

        nextBtn.disabled = false;
        nextBtn.innerHTML = `
            <span>Confirmar Agendamento</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;

        resetBooking();
    }, 1200);
}

function resetBooking() {
    state.selectedService = null;
    state.selectedDate = null;
    state.selectedTime = null;
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('.service-item').forEach(i => i.classList.remove('selected'));
    goToStep(1);
}

// ============================================
// Modal
// ============================================
function showSuccessModal(booking) {
    const modal = document.getElementById('successModal');
    const details = document.getElementById('modalDetails');
    document.getElementById('modalMessage').textContent = `Olá, ${booking.clientName.split(' ')[0]}! Seu horário foi reservado.`;

    details.innerHTML = `
        <div class="modal-detail-row"><span>Serviço</span><strong>${booking.serviceName}</strong></div>
        <div class="modal-detail-row"><span>Data</span><strong>${formatDateLong(booking.date)}</strong></div>
        <div class="modal-detail-row"><span>Horário</span><strong>${booking.time}</strong></div>
        <div class="modal-detail-row"><span>Total</span><strong>${formatPrice(booking.price)}</strong></div>
        <div class="modal-detail-row"><span>Protocolo</span><strong>#${booking.id.toUpperCase()}</strong></div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// ============================================
// Toast
// ============================================
function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success'
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================
// Next Available Slot
// ============================================
function updateNextSlot() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let foundDate = null;
    let foundTime = null;

    for (let d = 0; d < 14 && !foundDate; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);
        if (isSunday(date)) continue;

        const dateStr = getDateString(date);
        for (const time of TIME_SLOTS) {
            if (isPastTime(dateStr, time)) continue;
            if (isSlotBooked(dateStr, time)) continue;
            foundDate = date;
            foundTime = time;
            break;
        }
    }

    if (foundDate && foundTime) {
        document.getElementById('nextSlot').textContent = foundTime;
        const dayName = foundDate.toDateString() === today.toDateString()
            ? 'Hoje'
            : WEEKDAYS[foundDate.getDay()];
        document.getElementById('nextSlotDay').textContent = dayName;
    } else {
        document.getElementById('nextSlot').textContent = '—';
        document.getElementById('nextSlotDay').textContent = 'Indisponível';
    }
}

// ============================================
// Counter Animation
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.counter);
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(target * ease);
            counter.textContent = target > 1000 ? value.toLocaleString('pt-BR') : value;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ============================================
// Navigation
// ============================================
function scrollToBooking() {
    document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
}

function scrollToServices() {
    document.getElementById('servicos').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// Phone Mask
// ============================================
function applyPhoneMask(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{0,4})(\d{0,4}).*/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{0,5})(\d{0,4}).*/, '($1) $2-$3');
    }
    return value;
}

// ============================================
// Event Listeners
// ============================================
function init() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('active'));
    });

    // Render sections
    renderServices();
    renderBookingServices();
    renderCalendar();
    renderTimeSlots();
    updateNextSlot();

    // Calendar nav
    document.getElementById('prevMonth').addEventListener('click', () => {
        state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
        renderCalendar();
    });

    // Booking navigation
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (state.currentStep < 3) {
            if (validateStep()) {
                goToStep(state.currentStep + 1);
            }
        } else {
            submitBooking();
        }
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (state.currentStep > 1) {
            goToStep(state.currentStep - 1);
        }
    });

    // Phone mask
    document.getElementById('clientPhone').addEventListener('input', e => {
        e.target.value = applyPhoneMask(e.target.value);
    });

    // Modal close on backdrop click
    document.getElementById('successModal').addEventListener('click', e => {
        if (e.target.id === 'successModal') closeModal();
    });

    // ESC to close modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // Animate counters when hero is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    });

    document.querySelectorAll('.hero-stats').forEach(el => observer.observe(el));
}

// ============================================
// Init
// ============================================
document.addEventListener('DOMContentLoaded', init);
