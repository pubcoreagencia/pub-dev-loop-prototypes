import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/task.dart';
import '../models/routine.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._init();
  static Database? _database;

  DatabaseService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('rotina_mais.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category INTEGER NOT NULL,
        dueDate TEXT NOT NULL,
        priority INTEGER NOT NULL,
        isCompleted INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      )
    ''');

    await db.execute('''
      CREATE TABLE routines (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category INTEGER NOT NULL,
        frequency INTEGER NOT NULL,
        daysOfWeek TEXT NOT NULL,
        time TEXT NOT NULL,
        isActive INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      )
    ''');
  }

  // Task CRUD
  Future<List<Task>> getAllTasks() async {
    final db = await database;
    final result = await db.query('tasks', orderBy: 'dueDate ASC');
    return result.map((map) => Task.fromMap(map)).toList();
  }

  Future<void> insertTask(Task task) async {
    final db = await database;
    await db.insert('tasks', task.toMap());
  }

  Future<void> updateTask(Task task) async {
    final db = await database;
    await db.update('tasks', task.toMap(), where: 'id = ?', whereArgs: [task.id]);
  }

  Future<void> deleteTask(String id) async {
    final db = await database;
    await db.delete('tasks', where: 'id = ?', whereArgs: [id]);
  }

  // Routine CRUD
  Future<List<Routine>> getAllRoutines() async {
    final db = await database;
    final result = await db.query('routines', orderBy: 'time ASC');
    return result.map((map) => Routine.fromMap(map)).toList();
  }

  Future<void> insertRoutine(Routine routine) async {
    final db = await database;
    await db.insert('routines', routine.toMap());
  }

  Future<void> updateRoutine(Routine routine) async {
    final db = await database;
    await db.update('routines', routine.toMap(), where: 'id = ?', whereArgs: [routine.id]);
  }

  Future<void> deleteRoutine(String id) async {
    final db = await database;
    await db.delete('routines', where: 'id = ?', whereArgs: [id]);
  }
}
