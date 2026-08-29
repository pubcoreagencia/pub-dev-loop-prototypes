# 🎢 ParkMaster - Sistema de Gestão de Parque de Diversões

## 1. Concept & Vision

**ParkMaster** é um dashboard de gestão completo para parques de diversões. A experiência visual transmite a energia e diversão de um parque real — vibrante, colorido e dinâmico. O usuário se sente no controle de um parque de verdade, com métricas em tempo real, gestão de atrações e análise de visitantes.

## 2. Design Language

### Aesthetic Direction
Inspirado em painéis de controle de parques reais misturado com UI moderna. Cores vibrantes que remetem a emoções de diversão (azul parque, amarelo alegria, verde natureza). Cards com profundidade e sombras suaves.

### Color Palette
- **Primary**: `#6366F1` (Indigo vibrante - confiança)
- **Secondary**: `#F59E0B` (Amarelo - energia/diversão)
- **Accent**: `#10B981` (Verde - sucesso/ativo)
- **Danger**: `#EF4444` (Vermelho - manutenção/alerta)
- **Background**: `#0F172A` (Slate escuro)
- **Surface**: `#1E293B` (Cards)
- **Surface Light**: `#334155`
- **Text Primary**: `#F8FAFC`
- **Text Secondary**: `#94A3B8`

### Typography
- **Headings**: `'Fredoka One'` - divertida e bold
- **Body**: `'Nunito'` - moderna e legível
- **Data**: `'JetBrains Mono'` - monospace para números

### Spatial System
- Base unit: 8px
- Card padding: 24px
- Gap between cards: 24px
- Border radius: 16px (cards), 8px (buttons), 24px (modals)

### Motion Philosophy
- Transições suaves de 300ms ease-out
- Hover em cards: scale(1.02) + shadow elevada
- Contadores animados ao carregar dados
- Pulse sutil em status "operando"
- Modal slide-in com backdrop blur

### Visual Assets
- Emojis como ícones para kategori
- Gradientes sutis em backgrounds de cards
- Badge system para status

## 3. Layout & Structure

### Estrutura Principal
```
┌─────────────────────────────────────────────────┐
│  HEADER: Logo + Navegação + Hora/Data          │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  SIDEBAR   │         MAIN CONTENT              │
│  - Dashboard│     (muda conforme seção)         │
│  - Atrações│                                    │
│  - Bilhetes│                                    │
│  - Equipe  │                                    │
│            │                                    │
└────────────┴────────────────────────────────────┘
```

### Responsividade
- Desktop (>1024px): Sidebar fixa + conteúdo largo
- Tablet (768-1024px): Sidebar colapsável
- Mobile (<768px): Sidebar como drawer + cards empilhados

## 4. Features & Interactions

### Dashboard
- **Métricas principais**: Visitantes hoje, Receita, Atrações operacionais, Tempo médio de fila
- **Gráfico de visitantes**: Últimos 7 dias (bar chart)
- **Atrações em destaque**: Cards com status ao vivo
- **Alertas**: Manutenção programada, clima, eventos

### Gestão de Atrações
- Lista de atrações com: nome, tipo, capacidade, status, fila atual
- CRUD completo de atrações
- Status toggle: Operando / Manutenção / Fechado
- Modal de edição com validação
- Filtro por tipo e status

### Gestão de Bilhetes/Passaport
- Tipos: Ingresso simples,meia,Passaporte VIP,Passaporte família
- Preços e estoque
- Vendas do dia
- Check-in de visitantes

### Gestão de Equipe
- Lista de funcionários
- Função e turno
- Atribuição por atração

### Interações
- **Hover em cards**: Elevação + borda colorida
- **Click em atração**: Abre modal de detalhes
- **Toggle status**: Animação de pulse + toast notification
- **Form submit**: Loading state + success feedback
- **Delete**: Confirmação antes de executar

## 5. Component Inventory

### Card
- Background: surface com gradiente sutil
- Shadow: 0 4px 24px rgba(0,0,0,0.3)
- Hover: scale(1.02), shadow maior
- Border: 1px solid surface-light

### Button
- Primary: bg primary, text white, hover brightness
- Secondary: bg transparent, border primary
- Danger: bg danger
- Loading: spinner interno
- Disabled: opacity 0.5

### Badge/Status
- Operando: bg green, text white, pulse dot
- Manutenção: bg yellow, text dark
- Fechado: bg red
- Info: bg blue

### Input
- bg surface-light
- border transparent, focus: border primary
- Error: border danger, text danger abaixo

### Modal
- Backdrop blur(8px)
- Card centralizado
- Header + body + footer
- Close button X
- Escape key fecha

### Toast Notification
- Fixed bottom-right
- Slide in/out
- Auto-dismiss 3s
- Tipos: success, error, info

### Chart (Bar)
- Canvas com Chart.js
- Cores do tema
- Animação de entrada
- Tooltips customizados

## 6. Technical Approach

### Stack
- HTML5 semântico
- CSS3 com custom properties
- Vanilla JavaScript ES6+
- Chart.js via CDN
- LocalStorage para persistência de dados

### Arquitetura
```
index.html      - Estrutura principal
styles.css      - Estilos globais + componentes
script.js       - Lógica da aplicação
```

### Data Model
```javascript
// Atração
{
  id: string,
  nome: string,
  tipo: 'montanha-russa' | 'carrossel' | 'radical' | 'infantil' | 'aquatico',
  capacidade: number,
  filaAtual: number,
  status: 'operando' | 'manutencao' | 'fechado',
  tempoEstimado: number // minutos
}

// Bilhete
{
  id: string,
  tipo: 'inteira' | 'meia' | 'vip' | 'familia',
  preco: number,
  estoque: number,
  vendidosHoje: number
}

// Funcionário
{
  id: string,
  nome: string,
  funcao: string,
  turno: 'manha' | 'tarde' | 'noite',
  atracaoId: string | null
}

// Métricas
{
  visitantes: { dia: number, meta: number },
  receita: { atual: number, meta: number },
  data: string
}
```

### Estado da Aplicação
- single source of truth em objeto `appState`
- Render functions para cada seção
- Event delegation para cliques
- Sincronização com localStorage em mudanças
