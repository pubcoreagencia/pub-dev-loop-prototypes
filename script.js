// Barber Shop Dashboard JavaScript

// DOM Elements
const prevDayBtn = document.getElementById('prevDay');
const nextDayBtn = document.getElementById('nextDay');
const currentDateEl = document.getElementById('currentDate');

// Sample dates for calendar navigation
let currentDate = new Date('2024-01-15'); // Monday
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

// Quick Actions Functions
function addAppointment() {
    showNotification('Opening appointment form...');
    // In a real application, this would open a modal or navigate to appointments page
    console.log('Add appointment clicked');
}

function addCustomer() {
    showNotification('Opening customer form...');
    console.log('Add customer clicked');
}

function addService() {
    showNotification('Opening service form...');
    console.log('Add service clicked');
}

function viewReports() {
    showNotification('Loading reports...');
    console.log('View reports clicked');
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Calendar Navigation
function updateCalendarDisplay() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDateEl.textContent = currentDate.toLocaleDateString('en-US', options);
}

if (prevDayBtn) {
    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateCalendarDisplay();
        showNotification(`Showing ${currentDate.toLocaleDateString()}`);
    });
}

if (nextDayBtn) {
    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateCalendarDisplay();
        showNotification(`Showing ${currentDate.toLocaleDateString()}`);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Enhanced appointment interactions
function initializeAppointments() {
    const appointmentItems = document.querySelectorAll('.appointment-item');
    
    appointmentItems.forEach(appointment => {
        appointment.addEventListener('click', (e) => {
            // Don't trigger when clicking buttons
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const customerInfo = appointment.querySelector('.customer-info');
            if (customerInfo) {
                showNotification(`Viewing details for ${customerInfo.querySelector('h4').textContent}`);
            }
        });
    });
}

// Enhanced calendar event interactions
function initializeCalendarEvents() {
    const eventItems = document.querySelectorAll('.event-item');
    
    eventItems.forEach(event => {
        event.addEventListener('click', (e) => {
            const eventTime = event.querySelector('.event-time').textContent;
            const eventTitle = event.querySelector('.event-title').textContent;
            showNotification(`${eventTitle} at ${eventTime}`);
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    showNotification(`Searching for: ${query}`);
                }
            }
        });
    }
}

// User profile dropdown (simulate)
function initializeUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            showNotification('Opening user profile menu...');
        });
    }
}

// Quick action button hover effects
function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const icon = e.currentTarget.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        button.addEventListener('mouseleave', (e) => {
            const icon = e.currentTarget.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Notification badge animation
function animateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.animation = 'pulse 2s infinite';
        const pulseStyle = document.createElement('style');
        pulseStyle.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.1); }
            }
        `;
        document.head.appendChild(pulseStyle);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAppointments();
    initializeCalendarEvents();
    initializeSearch();
    initializeUserProfile();
    initializeQuickActions();
    animateNotificationBadge();
    updateCalendarDisplay();
    
    // Add welcome animation
    const welcomeMessage = document.querySelector('.header-left p');
    if (welcomeMessage) {
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.animation = 'fadeIn 0.5s ease forwards';
        
        const fadeInStyle = document.createElement('style');
        fadeInStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(fadeInStyle);
    }
});

// Stats card counter animation (simulated)
function animateStatsCards() {
    const statNumbers = document.querySelectorAll('.stat-info h3');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('$')) {
            // Format currency
            const num = parseFloat(text.replace('$', '').replace(',', ''));
            const original = stat.textContent;
            setTimeout(() => {
                stat.textContent = formatCurrency(num);
            }, Math.random() * 1000);
        } else if (!isNaN(parseFloat(text)) && text !== '') {
            // Animate numbers
            const target = parseInt(text);
            const duration = 1000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        }
    });
}

function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a real app
        console.log('Service Worker support detected');
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.');
});

// Console greeting
console.log('🚀 Barber Shop Dashboard loaded successfully!');
console.log('✨ Try clicking on appointments, calendar events, or quick action buttons!');