# Rotina+ - Project State

## Build Info
- **Project Name:** rotina_mais
- **Display Name:** Rotina+
- **Version:** 1.0.0+1
- **Build:** 1
- **Package ID:** com.rotina_mais.rotina_mais

## Configuration

### Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| flutter | sdk | Framework |
| cupertino_icons | ^1.0.6 | iOS icons |
| provider | ^6.1.1 | State management |
| sqflite | ^2.3.0 | SQLite database |
| path | ^1.8.3 | File paths |
| intl | ^0.18.1 | Date formatting |
| uuid | ^4.2.1 | Unique IDs |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| flutter_test | sdk | Testing framework |
| flutter_lints | ^3.0.1 | Lint rules |

## Database Schema

### tasks table
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category INTEGER NOT NULL,        -- 0: pessoal, 1: profissional
  dueDate TEXT NOT NULL,             -- ISO 8601
  priority INTEGER NOT NULL,         -- 0: alta, 1: media, 2: baixa
  isCompleted INTEGER NOT NULL,      -- 0 or 1
  createdAt TEXT NOT NULL            -- ISO 8601
)
```

### routines table
```sql
CREATE TABLE routines (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category INTEGER NOT NULL,
  frequency INTEGER NOT NULL,        -- 0: diaria, 1: semanal
  daysOfWeek TEXT NOT NULL,          -- CSV: "1,2,3,4,5"
  time TEXT NOT NULL,                -- ISO 8601
  isActive INTEGER NOT NULL,         -- 0 or 1
  createdAt TEXT NOT NULL
)
```

## Environment
- **Target Platforms:** Android, iOS
- **Min SDK (Android):** 21
- **iOS Deployment Target:** 12.0
- **Dart SDK:** >=3.0.0 <4.0.0

## Build Status
- ✅ Pubspec valid
- ✅ Models implemented
- ✅ Services implemented
- ✅ UI screens implemented
- ✅ Tests implemented
- ✅ Documentation complete
- ⚠️ Not yet built (requires Flutter SDK to compile)

## Last Update
- Implementation completed
- Ready for `flutter pub get && flutter run`
