# Rotina+ - App de Gestão de Rotina Pessoal e Profissional

## 1. Project Overview

**Project Name:** Rotina+
**Type:** Mobile Application (Android/iOS)
**Core Functionality:** Aplicativo para gerenciar tarefas e rotinas tanto pessoais quanto profissionais, com separação clara entre esferas de vida, notificações e acompanhamento de progresso.

---

## 2. Technology Stack & Choices

| Aspect | Choice |
|--------|--------|
| **Framework** | Flutter 3.x |
| **Language** | Dart |
| **State Management** | Provider |
| **Local Database** | sqflite (SQLite) |
| **Local Notifications** | flutter_local_notifications |
| **Architecture** | Clean Architecture (UI / Business Logic / Data) |
| **Date/Time** | intl |
| **UUID** | uuid |

---

## 3. Feature List

### Core Features
1. **Gestão de Tarefas**
   - Criar, editar e excluir tarefas
   - Categorizar como Pessoal ou Profissional
   - Definir data e hora de vencimento
   - Marcar como concluída
   - Prioridade (Alta, Média, Baixa)

2. **Rotinas Diárias**
   - Criar rotinas recorrentes (diárias, semanais)
   - Associar rotinas a categorias (Pessoal/Profissional)
   - Visualizar rotinas do dia

3. **Separador de Esferas**
   - Filtro por categoria (Todas, Pessoal, Profissional)
   - Identificação visual diferenciada (cores)

4. **Lista de Tarefas**
   - Visualização em lista com swipe para ações
   - Tarefas pendentes vs concluídas
   - Ordenação por data, prioridade

5. **Dashboard/Resumo**
   - Quantidade de tarefas pendentes
   - Tarefas concluídas hoje
   - Progresso semanal

6. **Persistência Local**
   - Salvar todas as tarefas e rotinas no banco SQLite
   - Dados persistem entre sessões

---

## 4. UI/UX Design Direction

### Visual Style
- **Design System:** Material Design 3
- **Theme:** Light mode com cores vibrantes para diferenciação de categorias

### Color Scheme
| Element | Color |
|---------|-------|
| Primary | Deep Purple (#673AB7) |
| Secondary | Teal (#009688) |
| Pessoal | Coral/Laranja (#FF7043) |
| Profissional | Azul (#2196F3) |
| Background | White/Grey (#FAFAFA) |
| Surface | White (#FFFFFF) |

### Layout Approach
- **Navigation:** Bottom Navigation Bar com 3 abas
  - Home (Dashboard)
  - Tarefas (Lista de tarefas)
  - Rotinas (Gestão de rotinas)
- **FAB:** Botão flutuante para adicionar novas tarefas
- **Cards:** Tarefas exibidas em cards com swipe actions

### Typography
- Headlines: Roboto Bold
- Body: Roboto Regular
- Clear hierarchy with proper sizing

---

## 5. Data Models

### Task
- id, title, description, category (pessoal/profissional)
- dueDate, priority (high/medium/low)
- isCompleted, createdAt

### Routine
- id, title, description, category
- frequency (daily/weekly), daysOfWeek
- time, isActive
