import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/routine.dart';
import '../models/task.dart';
import 'database_service.dart';

class RoutineService extends ChangeNotifier {
  final DatabaseService _db = DatabaseService.instance;
  final Uuid _uuid = Uuid();

  List<Routine> _routines = [];
  List<Routine> get routines => _routines;

  TaskCategory? _categoryFilter;
  TaskCategory? get categoryFilter => _categoryFilter;

  Future<void> loadRoutines() async {
    _routines = await _db.getAllRoutines();
    notifyListeners();
  }

  void setCategoryFilter(TaskCategory? category) {
    _categoryFilter = category;
    notifyListeners();
  }

  List<Routine> get filteredRoutines {
    if (_categoryFilter == null) return _routines;
    return _routines.where((r) => r.category == _categoryFilter).toList();
  }

  List<Routine> get todayRoutines {
    final now = DateTime.now();
    final weekday = now.weekday;
    return filteredRoutines.where((routine) {
      if (!routine.isActive) return false;
      if (routine.frequency == RoutineFrequency.diaria) return true;
      return routine.daysOfWeek.contains(weekday);
    }).toList();
  }

  Future<void> addRoutine({
    required String title,
    required String description,
    required TaskCategory category,
    required RoutineFrequency frequency,
    required List<int> daysOfWeek,
    required DateTime time,
  }) async {
    final routine = Routine(
      id: _uuid.v4(),
      title: title,
      description: description,
      category: category,
      frequency: frequency,
      daysOfWeek: daysOfWeek,
      time: time,
      createdAt: DateTime.now(),
    );
    await _db.insertRoutine(routine);
    await loadRoutines();
  }

  Future<void> updateRoutine(Routine routine) async {
    await _db.updateRoutine(routine);
    await loadRoutines();
  }

  Future<void> toggleRoutineActive(String id) async {
    final routine = _routines.firstWhere((r) => r.id == id);
    await updateRoutine(routine.copyWith(isActive: !routine.isActive));
  }

  Future<void> deleteRoutine(String id) async {
    await _db.deleteRoutine(id);
    await loadRoutines();
  }
}
