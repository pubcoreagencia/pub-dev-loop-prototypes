/**
 * ATELIE ROGERIO PAES - Premium Scripts
 * Marcenaria Artesanal | Móveis Planejados
 */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initHeaderScroll();
    initRevealAnimations();
    initCounter();
    initPortfolio();
    initDepoimentos();
    initForm();
    initSmoothScroll();
});

/* ============== NAVIGATION ============== */
function initNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        const isOpen = menu.classList.contains('open');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

/* ============== HEADER SCROLL ============== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    }, { passive: true });
}

/* ============== REVEAL ANIMATIONS ============== */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.stat-item, .sobre-grid, .servico-card, .portfolio-item, .depoimento-card, .footer-top > *');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));

    // Stats grid animation
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateStatNumbers();
                statsObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsGrid);
    }
}

/* ============== COUNTER ANIMATION ============== */
function initCounter() {
    // Counter triggered by scroll (done in initRevealAnimations)
}

function animateStatNumbers() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('pt-BR');
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString('pt-BR');
            }
        };

        // Stagger each counter
        const statItem = counter.closest('.stat-item');
        const index = Array.from(document.querySelectorAll('.stat-item')).indexOf(statItem);
        setTimeout(update, index * 200);
    });
}

/* ============== PORTFOLIO ============== */
function initPortfolio() {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 60}ms`;
    });
}

/* ============== DEPOIMENTOS SLIDER ============== */
function initDepoimentos() {
    const slider = document.getElementById('depoimentosSlider');
    const dotsContainer = document.getElementById('depoimentosDots');
    if (!slider || !dotsContainer) return;

    const cards = slider.querySelectorAll('.depoimento-card');
    const totalCards = cards.length;
    let currentIndex = 0;

    // Create dots
    const dots = [];
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
    }

    function goToSlide(index) {
        dots[currentIndex].classList.remove('active');
        currentIndex = index;
        dots[currentIndex].classList.add('active');
    }

    // Auto-rotate
    let autoPlay = setInterval(() => {
        goToSlide((currentIndex + 1) % totalCards);
    }, 5000);

    slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
    slider.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            goToSlide((currentIndex + 1) % totalCards);
        }, 5000);
    });
}

/* ============== FORM ============== */
function initForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    if (!form || !successMsg) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const nome = form.querySelector('#nome').value.trim();
        const email = form.querySelector('#email').value.trim();
        const telefone = form.querySelector('#telefone').value.trim();
        const servico = form.querySelector('#servico').value;

        // Validate
        if (!nome || !email || !telefone || !servico) {
            shakeInvalidFields(form);
            return;
        }

        if (!isValidEmail(email)) {
            shakeInvalidFields(form.querySelector('#email').parentElement);
            return;
        }

        // Phone mask
        const telInput = form.querySelector('#telefone');
        telInput.value = formatPhone(telInput.value);

        // Simulate submit
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<span>Enviando...</span>';

        setTimeout(() => {
            form.classList.add('hide');
            successMsg.classList.add('show');
        }, 1500);
    });

    // Phone mask
    const telInput = form.querySelector('#telefone');
    if (telInput) {
        telInput.addEventListener('input', (e) => {
            e.target.value = formatPhone(e.target.value);
        });
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatPhone(value) {
    const nums = value.replace(/\D/g, '');
    if (nums.length <= 11) {
        return nums.replace(/^(\d{2})(\d)/g, '($1) $2')
                   .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
}

function shakeInvalidFields(element) {
    const toShake = typeof element === 'string'
        ? document.querySelector(element)
        : element;

    if (!toShake) return;

    toShake.style.animation = 'none';
    toShake.offsetHeight; // trigger reflow
    toShake.style.animation = 'shake 0.5s ease';

    const inputs = toShake.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            input.addEventListener('input', function handler() {
                input.style.borderColor = '';
                input.removeEventListener('input', handler);
            });
        }
    });
}

// Add shake keyframes dynamically
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);

/* ============== SMOOTH SCROLL ============== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============== PARALLAX HERO (subtle) ============== */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-image-frame');
    if (hero) {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroTop = heroSection.offsetTop;
            const heroHeight = heroSection.offsetHeight;
            if (scrolled < heroTop + heroHeight) {
                hero.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        }
    }
}, { passive: true });
