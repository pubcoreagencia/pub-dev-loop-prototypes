// Pato de Minas - Sistema de Gestão de Patos
// Gerenciamento completo de patos com LocalStorage

class DuckManager {
    constructor() {
        this.ducks = this.loadDucks();
        this.currentDuck = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderDucks();
        this.updateStats();
        this.startAutoHealthCheck();
    }

    loadDucks() {
        const stored = localStorage.getItem('patoDeMinas_ducks');
        if (stored) {
            return JSON.parse(stored);
        }
        // Dados iniciais de exemplo
        return [
            {
                id: 1,
                name: 'Quack-cola',
                breed: 'Pato de Pequim',
                age: 6,
                health: 'healthy',
                weight: 3.2,
                foodLevel: 80,
                happiness: 70,
                lastFed: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                sold: false
            },
            {
                id: 2,
                name: 'Pato-lito',
                breed: 'Marreco Dux',
                age: 12,
                health: 'sick',
                weight: 2.8,
                foodLevel: 40,
                happiness: 30,
                lastFed: new Date(Date.now() - 86400000).toISOString(),
                createdAt: new Date(Date.now() - 31536000000).toISOString(),
                sold: false
            },
            {
                id: 3,
                name: 'Pato-dão',
                breed: 'Pato Caique',
                age: 3,
                health: 'healthy',
                weight: 1.5,
                foodLevel: 90,
                happiness: 95,
                lastFed: new Date().toISOString(),
                createdAt: new Date(Date.now() - 7776000000).toISOString(),
                sold: false
            }
        ];
    }

    saveDucks() {
        localStorage.setItem('patoDeMinas_ducks', JSON.stringify(this.ducks));
    }

    generateId() {
        return Date.now() + Math.random();
    }

    bindEvents() {
        // Adicionar pato
        document.getElementById('add-duck-btn').addEventListener('click', () => {
            this.openModal('add-duck-modal');
        });

        document.getElementById('add-duck-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDuck();
        });

        // Alimentar aleatoriamente
        document.getElementById('random-feed-btn').addEventListener('click', () => {
            this.feedRandomDuck();
        });

        // Verificar saúde
        document.getElementById('health-check-btn').addEventListener('click', () => {
            this.performHealthCheck();
        });

        // Modal de detalhes
        document.getElementById('sell-duck-btn').addEventListener('click', () => {
            this.sellDuck();
        });

        document.getElementById('heal-duck-btn').addEventListener('click', () => {
            this.healDuck();
        });

        document.getElementById('delete-duck-btn').addEventListener('click', () => {
            this.deleteDuck();
        });

        // Fechar modais
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    this.closeAllModals();
                }
            });
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    addDuck() {
        const name = document.getElementById('duck-name').value.trim();
        const breedSelect = document.getElementById('duck-breed');
        const breed = breedSelect.options[breedSelect.selectedIndex].text;
        const breedValue = breedSelect.value;
        const age = parseInt(document.getElementById('duck-age').value);
        const health = document.querySelector('input[name="health"]:checked').value;

        const duck = {
            id: this.generateId(),
            name: name,
            breed: breed,
            breedCode: breedValue,
            age: age,
            health: health,
            weight: (Math.random() * 2 + 1).toFixed(1),
            foodLevel: 100,
            happiness: 80,
            lastFed: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            sold: false
        };

        this.ducks.push(duck);
        this.saveDucks();
        this.renderDucks();
        this.updateStats();
        this.closeAllModals();
        document.getElementById('add-duck-form').reset();

        this.showNotification(`Pato "${name}" adicionado com sucesso!`);
    }

    getDuckEmoji(duck) {
        if (duck.sold) return '🐔';
        if (duck.health === 'sick') return '🤒';
        if (duck.happiness < 50) return '😢';
        if (duck.happiness > 80) return '😄';
        return '🦆';
    }

    renderDucks() {
        const container = document.getElementById('duck-container');
        container.innerHTML = '';

        this.ducks.forEach(duck => {
            const card = document.createElement('div');
            card.className = 'duck-card';
            card.innerHTML = `
                <div class="duck-emoji">${this.getDuckEmoji(duck)}</div>
                <h3>${duck.name}</h3>
                <p>${duck.breed}</p>
                <p>${duck.age} meses | ${duck.weight}kg</p>
                <span class="status-badge ${duck.sold ? 'sold' : duck.health}">
                    ${duck.sold ? 'Vendido' : (duck.health === 'healthy' ? 'Saudável' : 'Doente')}
                </span>
            `;
            card.addEventListener('click', () => this.showDuckDetails(duck));
            container.appendChild(card);
        });
    }

    showDuckDetails(duck) {
        this.currentDuck = duck;
        const detailsDiv = document.getElementById('duck-details');
        
        const ageText = duck.age >= 12 
            ? `${Math.floor(duck.age / 12)} ano${Math.floor(duck.age / 12) > 1 ? 's' : ''}`
            : `${duck.age} meses`;

        detailsDiv.innerHTML = `
            <div style="text-align: center; font-size: 4em; margin-bottom: 15px;">
                ${this.getDuckEmoji(duck)}
            </div>
            <p><strong>Nome:</strong> ${duck.name}</p>
            <p><strong>Raça:</strong> ${duck.breed}</p>
            <p><strong>Idade:</strong> ${ageText}</p>
            <p><strong>Peso:</strong> ${duck.weight} kg</p>
            <p><strong>Saúde:</strong> ${duck.health === 'healthy' ? '✅ Saudável' : '🤒 Doente'}</p>
            <p><strong>Nível de Alimentação:</strong> ${duck.foodLevel}%</p>
            <p><strong>Felicidade:</strong> ${duck.happiness}%</p>
            <p><strong>Última Alimentação:</strong> ${this.formatDate(duck.lastFed)}</p>
            <p><strong>Data de Adição:</strong> ${this.formatDate(duck.createdAt)}</p>
            <p><strong>Status:</strong> ${duck.sold ? '🟢 Vendido' : '🔴 No Estoque'}</p>
        `;

        // Esconder/mostrar botões baseado no estado
        const sellBtn = document.getElementById('sell-duck-btn');
        const healBtn = document.getElementById('heal-duck-btn');
        
        sellBtn.style.display = duck.sold ? 'none' : 'block';
        healBtn.style.display = duck.sold || duck.health === 'healthy' ? 'none' : 'block';

        this.openModal('duck-details-modal');
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    sellDuck() {
        if (!this.currentDuck) return;
        
        this.currentDuck.sold = true;
        this.currentDuck.soldAt = new Date().toISOString();
        this.saveDucks();
        this.renderDucks();
        this.updateStats();
        this.closeAllModals();
        this.showNotification(`${this.currentDuck.name} foi vendido!`);
    }

    healDuck() {
        if (!this.currentDuck) return;
        
        this.currentDuck.health = 'healthy';
        this.currentDuck.happiness = Math.min(100, this.currentDuck.happiness + 30);
        this.saveDucks();
        this.renderDucks();
        this.updateStats();
        this.closeAllModals();
        this.showNotification(`${this.currentDuck.name} foi curado!`);
    }

    deleteDuck() {
        if (!this.currentDuck) return;
        
        if (confirm(`Tem certeza que deseja remover ${this.currentDuck.name}?`)) {
            this.ducks = this.ducks.filter(d => d.id !== this.currentDuck.id);
            this.saveDucks();
            this.renderDucks();
            this.updateStats();
            this.closeAllModals();
            this.showNotification(`Pato removido com sucesso!`);
        }
    }

    feedRandomDuck() {
        const availableDucks = this.ducks.filter(d => !d.sold);
        if (availableDucks.length === 0) {
            this.showNotification('Não há patos para alimentar!', 'warning');
            return;
        }

        const randomDuck = availableDucks[Math.floor(Math.random() * availableDucks.length)];
        randomDuck.foodLevel = Math.min(100, randomDuck.foodLevel + 30);
        randomDuck.lastFed = new Date().toISOString();
        
        if (randomDuck.health === 'healthy') {
            randomDuck.happiness = Math.min(100, randomDuck.happiness + 10);
        }

        this.saveDucks();
        this.renderDucks();
        this.showNotification(`${randomDuck.name} foi alimentado!`);
    }

    performHealthCheck() {
        let improved = 0;
        
        this.ducks.forEach(duck => {
            if (!duck.sold) {
                // Pato com comida baixa fica doente
                if (duck.foodLevel < 20) {
                    duck.health = 'sick';
                    duck.happiness = Math.max(0, duck.happiness - 20);
                    improved++;
                }
                // Pato bem alimentado pode melhorar
                else if (duck.foodLevel > 60 && duck.health === 'sick') {
                    duck.health = 'healthy';
                    duck.happiness = Math.min(100, duck.happiness + 15);
                    improved++;
                }
                // Felicidade cai com tempo
                duck.happiness = Math.max(0, duck.happiness - 5);
                // Comida diminui
                duck.foodLevel = Math.max(0, duck.foodLevel - 10);
            }
        });

        this.saveDucks();
        this.renderDucks();
        this.updateStats();
        
        this.showNotification(`Verificação de saúde concluída!`);
    }

    startAutoHealthCheck() {
        // Reduzir comida e felicidade a cada 30 segundos
        setInterval(() => {
            this.ducks.forEach(duck => {
                if (!duck.sold) {
                    duck.foodLevel = Math.max(0, duck.foodLevel - 5);
                    duck.happiness = Math.max(0, duck.happiness - 3);
                    
                    if (duck.foodLevel < 20 && duck.health === 'healthy') {
                        duck.health = 'sick';
                    }
                }
            });
            this.saveDucks();
            this.renderDucks();
            this.updateStats();
        }, 30000);
    }

    updateStats() {
        const activeDucks = this.ducks.filter(d => !d.sold);
        const healthy = activeDucks.filter(d => d.health === 'healthy').length;
        const sick = activeDucks.filter(d => d.health === 'sick').length;
        const sold = this.ducks.filter(d => d.sold).length;

        document.getElementById('total-ducks').textContent = this.ducks.length;
        document.getElementById('healthy-ducks').textContent = healthy;
        document.getElementById('sick-ducks').textContent = sick;
        document.getElementById('sold-ducks').textContent = sold;
    }

    showNotification(message, type = 'success') {
        // Remover notificação existente
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#dc3545'};
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Adicionar animações CSS
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

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    window.duckManager = new DuckManager();
});