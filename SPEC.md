# Barbearia - Sistema de Agendamento e Serviços

## 1. Concept & Vision

Uma plataforma de agendamento para barbearia que evoca o profissionalismo e tradição das barbearias clássicas, com um toque moderno. A experiência deve transmitir confiança, precisão e cuidado — como um bom barbeiro trata seus clientes. Interface sofisticada com elementos que remetem ao universo masculino e editorial.

## 2. Design Language

### Aesthetic Direction
Inspirado em barbearias tradicionais com elementos vintage/modernos. Texturas sutis de couro, tons quentes e iluminação aconchegante. Tipografia que remete a sinalizações clássicas de barbearia.

### Color Palette
- **Primary (Dark):** #1a1a1a (preto profundo)
- **Secondary:** #2d2d2d (cinza escuro)
- **Accent Gold:** #c9a227 (dourado clássico)
- **Accent Hover:** #e5b82a (dourado brilhante)
- **Background:** #121212 (fundo escuro)
- **Surface:** #1e1e1e (cards/superfícies)
- **Text Primary:** #f5f5f5 (branco suave)
- **Text Secondary:** #a0a0a0 (cinza claro)
- **Success:** #4caf50
- **Error:** #f44336

### Typography
- **Headings:** 'Playfair Display', serif — elegância clássica
- **Body:** 'Inter', sans-serif — legibilidade moderna
- **Accent:** 'Bebas Neue', sans-serif — para elementos destacados

### Spatial System
- Base unit: 8px
- Spacing scale: 8, 16, 24, 32, 48, 64px
- Border radius: 4px (botões), 8px (cards), 12px (modais)
- Max content width: 1200px

### Motion Philosophy
- Transições suaves de 300ms ease-out para hovers
- Fade-in staggered para lista de serviços (100ms delay entre items)
- Slide-up para elementos ao carregar (400ms)
- Pulse sutil no botão de agendamento

### Visual Assets
- Ícones: Lucide Icons (linha fina, elegante)
- Decorativo: linhas douradas divisórias, padrões sutis de listras de barbearia
- Gradientes sutis com overlay escuro

## 3. Layout & Structure

### Estrutura da Página
1. **Header** — Logo, navegação suave, botão CTA de agendamento
2. **Hero Section** — Título impactante, frase de efeito, CTA principal
3. **Serviços Section** — Grid de cards com serviços, preços e duração
4. **Barbeiros Section** — Apresentação da equipe com fotos e especialidades
5. **Agendamento Section** — Formulário interativo de agendamento
6. **Horário Funcionamento** — Informações de contato e mapa
7. **Footer** — Links, redes sociais, copyright

### Responsive Strategy
- Desktop: Grid 3 colunas para serviços
- Tablet: Grid 2 colunas
- Mobile: Stack vertical, navegação hamburger

## 4. Features & Interactions

### Core Features

**Catálogo de Serviços**
- Lista de serviços com nome, descrição, preço e duração
- Hover: card eleva com sombra dourada
- Ícone representativo para cada serviço

**Sistema de Agendamento**
- Seleção de serviço (visual highlighting)
- Escolha de data (calendário funcional)
- Seleção de horário disponível
- Formulário com nome, telefone, observações
- Validação em tempo real
- Confirmação visual após agendamento

**Feedback Visual**
- Toast notifications para ações (agendamento realizado, erro)
- Loading state durante "envio"
- Animação de sucesso (check animado)

### Edge Cases
- Data passada: desabilitada no calendário
- Horários ocupados: marcação visual de indisponibilidade
- Campos inválidos: mensagens de erro inline
- Form vazio: botão desabilitado

## 5. Component Inventory

### Service Card
- Default: fundo surface, borda sutil
- Hover: elevação, borda dourada, scale 1.02
- Contains: ícone, nome, descrição curta, preço, duração

### Calendar Picker
- Navegação mês anterior/próximo
- Dias disponíveis: fundo secondary
- Dia selecionado: fundo dourado, texto escuro
- Dia indisponível: opacidade reduzida, cursor not-allowed

### Time Slot Button
- Default: outline dourado
- Hover: fill dourado
- Selected: fill dourado sólido
- Disabled: opacidade 0.3

### Form Input
- Default: borda secondary
- Focus: borda dourada, glow sutil
- Error: borda vermelha, mensagem abaixo
- Filled: check verde

### CTA Button
- Default: fundo dourado, texto escuro
- Hover: fundo hover dourado, elevação
- Loading: spinner interno
- Disabled: opacidade 0.5

### Toast Notification
- Success: borda verde, ícone check
- Error: borda vermelha, ícone X
- Slide-in da direita, auto-dismiss 4s

## 6. Technical Approach

### Stack
- HTML5 semântico
- CSS3 com custom properties
- Vanilla JavaScript ES6+
- LocalStorage para persistência de agendamentos

### Architecture
- Single Page Application
- Módulos: Services, Calendar, Booking, Toast
- Event-driven com delegação de eventos

### Data Model
```javascript
Service {
  id: string,
  name: string,
  description: string,
  price: number,
  duration: number, // minutos
  icon: string
}

Booking {
  id: string,
  serviceId: string,
  date: string,
  time: string,
  clientName: string,
  phone: string,
  notes: string,
  createdAt: timestamp
}
```

### Horários de Funcionamento
- Segunda a Sexta: 09:00 - 20:00
- Sábado: 09:00 - 18:00
- Domingo: Fechado

### Slots Disponíveis
- 09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00
