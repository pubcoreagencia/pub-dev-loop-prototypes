# Rotina+ 📱

Aplicativo Flutter para gerenciar sua rotina pessoal e profissional.

## ✨ Funcionalidades

### 📋 Gestão de Tarefas
- Criar, editar e excluir tarefas
- Categorização: **Pessoal** ou **Profissional**
- Definição de data e hora de vencimento
- Prioridades: Alta, Média, Baixa
- Marcar tarefas como concluídas
- Filtro por categoria

### 🔄 Rotinas
- Criar rotinas recorrentes (diárias ou semanais)
- Selecionar dias específicos da semana
- Associar rotinas a categorias
- Ativar/desativar rotinas

### 📊 Dashboard
- Resumo de tarefas pendentes
- Tarefas concluídas hoje
- Rotinas ativas e do dia

### 💾 Persistência
- Banco de dados SQLite local
- Dados salvos automaticamente
- Funciona offline

## 🎨 Design

- **Material Design 3**
- Tema claro com cores diferenciadas:
  - Roxo (#673AB7) - Cor primária
  - Coral/Laranja (#FF7043) - Categoria Pessoal
  - Azul (#2196F3) - Categoria Profissional
- Navegação por bottom bar com 3 abas

## 🏗️ Arquitetura

```
lib/
├── main.dart              # Entry point
├── models/                # Data models
│   ├── task.dart
│   └── routine.dart
├── screens/               # UI screens
│   ├── home_screen.dart
│   ├── tasks_screen.dart
│   ├── routines_screen.dart
│   ├── task_form_screen.dart
│   └── routine_form_screen.dart
├── services/              # Business logic
│   ├── database_service.dart
│   ├── task_service.dart
│   └── routine_service.dart
├── widgets/              # Reusable widgets
│   ├── task_card.dart
│   ├── routine_card.dart
│   ├── stat_card.dart
│   └── category_filter.dart
└── theme/                # App theme
    └── app_theme.dart
```

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| Flutter | Framework |
| Provider | Gerenciamento de estado |
| sqflite | Banco de dados local |
| intl | Formatação de datas |
| uuid | Geração de IDs únicos |

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   flutter pub get
   ```
3. Execute o app:
   ```bash
   flutter run
   ```

## 📱 Plataformas

- Android
- iOS

## 📄 Licença

MIT License
