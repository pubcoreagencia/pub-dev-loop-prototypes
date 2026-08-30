import 'package:flutter_test/flutter_test.dart';
import 'package:rotina_mais/models/task.dart';
import 'package:rotina_mais/models/routine.dart';

void main() {
  group('Task Model Tests', () {
    test('Task creation with required fields', () {
      final task = Task(
        id: '123',
        title: 'Test Task',
        description: 'Test Description',
        category: TaskCategory.pessoal,
        dueDate: DateTime(2024, 12, 31),
        priority: TaskPriority.alta,
        createdAt: DateTime.now(),
      );

      expect(task.id, '123');
      expect(task.title, 'Test Task');
      expect(task.category, TaskCategory.pessoal);
      expect(task.isCompleted, false);
    });

    test('Task copyWith creates a copy with updated fields', () {
      final task = Task(
        id: '123',
        title: 'Test Task',
        description: 'Test Description',
        category: TaskCategory.pessoal,
        dueDate: DateTime(2024, 12, 31),
        priority: TaskPriority.alta,
        createdAt: DateTime.now(),
      );

      final completedTask = task.copyWith(isCompleted: true);
      
      expect(completedTask.isCompleted, true);
      expect(completedTask.title, task.title);
    });

    test('Task toMap and fromMap work correctly', () {
      final task = Task(
        id: '123',
        title: 'Test Task',
        description: 'Test Description',
        category: TaskCategory.profissional,
        dueDate: DateTime(2024, 12, 31, 10, 30),
        priority: TaskPriority.media,
        createdAt: DateTime(2024, 1, 1),
      );

      final map = task.toMap();
      final restoredTask = Task.fromMap(map);

      expect(restoredTask.id, task.id);
      expect(restoredTask.title, task.title);
      expect(restoredTask.category, task.category);
    });
  });

  group('Routine Model Tests', () {
    test('Routine creation with required fields', () {
      final routine = Routine(
        id: '456',
        title: 'Morning Routine',
        description: 'Daily morning activities',
        category: TaskCategory.pessoal,
        frequency: RoutineFrequency.diaria,
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        time: DateTime(2024, 1, 1, 7, 0),
        createdAt: DateTime.now(),
      );

      expect(routine.id, '456');
      expect(routine.title, 'Morning Routine');
      expect(routine.frequency, RoutineFrequency.diaria);
      expect(routine.isActive, true);
    });

    test('Routine copyWith creates a copy with updated fields', () {
      final routine = Routine(
        id: '456',
        title: 'Morning Routine',
        description: 'Daily morning activities',
        category: TaskCategory.pessoal,
        frequency: RoutineFrequency.diaria,
        daysOfWeek: [1, 2, 3, 4, 5],
        time: DateTime(2024, 1, 1, 7, 0),
        createdAt: DateTime.now(),
      );

      final deactivatedRoutine = routine.copyWith(isActive: false);
      
      expect(deactivatedRoutine.isActive, false);
      expect(deactivatedRoutine.title, routine.title);
    });
  });
}
