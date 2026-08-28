/* ===== PIZZA DATA ===== */
const pizzas = {
    classic: [
        {
            name: "Margherita",
            ingredients: "Molho de tomate, mussarela, manjericão fresco",
            price: "R$ 45",
            img: "https://images.unsplash.com/photo-1600891939287-6b25b1c5cf6a?auto=format&fit=crop&w=500&q=60",
            vegetarian: true
        },
        {
            name: "Pepperoni",
            ingredients: "Molho de tomate, mussarela, pepperoni italiano",
            price: "R$ 52",
            img: "https://images.unsplash.com/photo-1544982753-ffc1c57896a9?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        },
        {
            name: "Quatro Queijos",
            ingredients: "Mussarela, gorgonzola, parmesão e cheddar",
            price: "R$ 58",
            img: "https://images.unsplash.com/photo-1513104880128-5bc6eb3ac5b1?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        },
        {
            name: "Calabresa",
            ingredients: "Molho de tomate, mussarela, calabresa fatiada",
            price: "R$ 50",
            img: "https://images.unsplash.com/photo-1546069901-24307e1a94f0?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        }
    ],
    special: [
        {
            name: "Bella Especial",
            ingredients: "Molho de tomate, mussarela, rúcula, parmesão, gorgonzola e cascavel",
            price: "R$ 62",
            img: "https://images.unsplash.com/photo-1565299624944-7b55b75c6b4d?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        },
        {
            name: "Capricciosa",
            ingredients: "Molho de tomate, mussarela, cogumelos, cenoura ralada, azeitonas e presunto",
            price: "R$ 59",
            img: "https://images.unsplash.com/photo-1546069901-24307e1a94f0?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        },
        {
            name: "Vegetariana",
            ingredients: "Molho de tomate, mussarela, pimentões, cogumelos, cebola e manjericão",
            price: "R$ 54",
            img: "https://images.unsplash.com/photo-1553621042-f6e14e0f7f19?auto=format&fit=crop&w=500&q=60",
            vegetarian: true
        },
        {
            name: "Doce de Leite",
            ingredients: "Creme de doce de leite, chocolate ao leite, morangos frescos",
            price: "R$ 48",
            img: "https://images.unsplash.com/photo-1551183053-bf377523449d?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        }
    ],
    dessert: [
        {
            name: "Nutella & Banana",
            ingredients: "Creme de Nutella, fatias de banana caramelizada",
            price: "R$ 46",
            img: "https://images.unsplash.com/photo-1551183053-bf377523449d?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        },
        {
            name: "Romeu e Julieta",
            ingredients: "Goiabada em cubos, mussarela derretida, canela",
            price: "R$ 44",
            img: "https://images.unsplash.com/photo-1550583724-b2692b3b3d6f?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        },
        {
            name: "Chocolate Branco & Frutas",
            ingredients: "Creme de chocolate branco, frutas vermelhas frescas",
            price: "R$ 49",
            img: "https://images.unsplash.com/photo-1554974663-8177579bea57?auto=format&fit=crop&w=500&q=60",
            vegetarian: false
        }
    ]
};

/* ===== RENDER MENU ===== */
function renderMenu(category = 'classic') {
    const content = document.getElementById('menuContent');
    const items = pizzas[category] || [];
    let html = '';
    items.forEach(pizza => {
        html += `
            <div class="menu-card${pizza.vegetarian ? ' vegetarian' : ''}">
                <div class="menu-img">
                    <img src="${pizza.img}" alt="${pizza.name}">
                </div>
                <div class="menu-info">
                    <h3>${pizza.name} <span class="price">${pizza.price}</span></h3>
                    <p class="ingredients">${pizza.ingredients}</p>
                </div>
            </div>
        `;
    });
    content.innerHTML = html;
}

/* ===== RENDER GALLERY ===== */
const galleryImages = [
    { src: "https://images.unsplash.com/photo-1600891939287-6b25b1c5cf6a?auto=format&fit=crop&w=600&q=60", caption: "Margherita Clássica" },
    { src: "https://images.unsplash.com/photo-1544982753-ffc1c57896a9?auto=format&fit=crop&w=600&q=60", caption: "Pepperoni Artesanal" },
    { src: "https://images.unsplash.com/photo-1513104880128-5bc6eb3ac5b1?auto=format&fit=crop&w=600&q=60", caption: "Forno a Lenha" },
    { src: "https://images.unsplash.com/photo-1546069901-24307e1a94f0?auto=format&fit=crop&w=600&q=60", caption: "Pizza Quente" },
    { src: "https://images.unsplash.com/photo-1550583724-b2692b3b3d6f?auto=format&fit=crop&w=600&q=60", caption: "Massa em Descanso" },
    { src: "https://images.unsplash.com/photo-1554974663-8177579bea57?auto=format&fit=crop&w=600&q=60", caption: "Creme de Doce de Leite" }
];
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    let html = '';
    galleryImages.forEach(img => {
        html += `
            <div class="gallery-item">
                <img src="${img.src}" alt="${img.caption}">
                <span class="gallery-caption">${img.caption}</span>
            </div>
        `;
    });
    grid.innerHTML = html;
}

/* ===== TABS ===== */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            renderMenu(tab);
            updatePizzaSelect(tab);
        });
    });
}

/* ===== UPDATE PIZZA SELECT ===== */
function updatePizzaSelect(category) {
    const choice = document.getElementById('pizza-choice');
    const items = pizzas[category] || [];
    let html = '<option value="">Selecione um sabor</option>';
    items.forEach(pizza => {
        html += `<option value="${pizza.name}">${pizza.name} — ${pizza.price}</option>`;
    });
    choice.innerHTML = html;
}

/* ===== TOTAL CALCULATION ===== */
const sizePrices = {
    p: 35,
    m: 45,
    g: 55,
    gg: 65
};
function updateTotal() {
    const size = document.getElementById('size').value;
    const qty = parseInt(document.getElementById('quantity').value) || 1;
    const basePrice = sizePrices[size] || 45;
    const total = basePrice * qty;
    document.getElementById('totalDisplay').textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

/* ===== FORM SUBMIT ===== */
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate required fields
    const required = ['name', 'phone', 'pizza-type', 'pizza-choice', 'size', 'quantity', 'address'];
    let valid = true;
    required.forEach(id => {
        const field = document.getElementById(id);
        if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = 'var(--primary)';
        }
    });
    // Reset borders on input
    required.forEach(id => {
        const field = document.getElementById(id);
        field.addEventListener('input', () => {
            field.style.borderColor = '';
        });
    });
    if (!valid) return;

    // Show success overlay
    document.getElementById('formSuccess').style.display = 'flex';
});

/* ===== NEW ORDER ===== */
document.getElementById('btnNewOrder').addEventListener('click', function() {
    document.getElementById('formSuccess').style.display = 'none';
    document.getElementById('orderForm').reset();
    document.getElementById('quantity').value = '1';
    updatePizzaSelect('classic');
    updateTotal();
});

/* ===== MOBILE MENU ===== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});
// Close menu on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

/* ===== BACK TO TOP ===== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function() {
    renderMenu('classic');
    renderGallery();
    initTabs();
    updatePizzaSelect('classic');

    // Event listeners for total update
    document.getElementById('size').addEventListener('change', updateTotal);
    document.getElementById('quantity').addEventListener('input', updateTotal);

    // Close mobile menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
});
