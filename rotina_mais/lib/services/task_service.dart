import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/task.dart';
import 'database_service.dart';

class TaskService extends ChangeNotifier {
  final DatabaseService _db = DatabaseService.instance;
  final Uuid _uuid = Uuid();

  List<Task> _tasks = [];
  List<Task> get tasks => _tasks;

  TaskCategory? _categoryFilter;
  TaskCategory? get categoryFilter => _categoryFilter;

  Future<void> loadTasks() async {
    _tasks = await _db.getAllTasks();
    notifyListeners();
  }

  void setCategoryFilter(TaskCategory? category) {
    _categoryFilter = category;
    notifyListeners();
  }

  List<Task> get filteredTasks {
    if (_categoryFilter == null) return _tasks;
    return _tasks.where((task) => task.category == _categoryFilter).toList();
  }

  List<Task> get pendingTasks {
    return filteredTasks.where((task) => !task.isCompleted).toList();
  }

  List<Task> get completedTasks {
    return filteredTasks.where((task) => task.isCompleted).toList();
  }

  List<Task> get todayTasks {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));
    return filteredTasks.where((task) {
      final due = task.dueDate;
      return due.isAfter(today.subtract(const Duration(seconds: 1))) &&
          due.isBefore(tomorrow);
    }).toList();
  }

  int get completedTodayCount {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return _tasks.where((task) {
      if (!task.isCompleted) return false;
      return task.dueDate.year == today.year &&
          task.dueDate.month == today.month &&
          task.dueDate.day == today.day;
    }).length;
  }

  int get pendingCount => pendingTasks.length;

  Future<void> addTask({
    required String title,
    required String description,
    required TaskCategory category,
    required DateTime dueDate,
    required TaskPriority priority,
  }) async {
    final task = Task(
      id: _uuid.v4(),
      title: title,
      description: description,
      category: category,
      dueDate: dueDate,
      priority: priority,
      createdAt: DateTime.now(),
    );
    await _db.insertTask(task);
    await loadTasks();
  }

  Future<void> updateTask(Task task) async {
    await _db.updateTask(task);
    await loadTasks();
  }

  Future<void> toggleTaskCompletion(String id) async {
    final task = _tasks.firstWhere((t) => t.id == id);
    await updateTask(task.copyWith(isCompleted: !task.isCompleted));
  }

  Future<void> deleteTask(String id) async {
    await _db.deleteTask(id);
    await loadTasks();
  }
}
