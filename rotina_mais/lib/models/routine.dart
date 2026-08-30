import 'task.dart';

enum RoutineFrequency { diaria, semanal }

class Routine {
  final String id;
  final String title;
  final String description;
  final TaskCategory category;
  final RoutineFrequency frequency;
  final List<int> daysOfWeek; // 1=Mon, 7=Sun
  final DateTime time;
  final bool isActive;
  final DateTime createdAt;

  Routine({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.frequency,
    required this.daysOfWeek,
    required this.time,
    this.isActive = true,
    required this.createdAt,
  });

  Routine copyWith({
    String? id,
    String? title,
    String? description,
    TaskCategory? category,
    RoutineFrequency? frequency,
    List<int>? daysOfWeek,
    DateTime? time,
    bool? isActive,
    DateTime? createdAt,
  }) {
    return Routine(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      frequency: frequency ?? this.frequency,
      daysOfWeek: daysOfWeek ?? this.daysOfWeek,
      time: time ?? this.time,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category.index,
      'frequency': frequency.index,
      'daysOfWeek': daysOfWeek.join(','),
      'time': time.toIso8601String(),
      'isActive': isActive ? 1 : 0,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Routine.fromMap(Map<String, dynamic> map) {
    return Routine(
      id: map['id'],
      title: map['title'],
      description: map['description'],
      category: TaskCategory.values[map['category']],
      frequency: RoutineFrequency.values[map['frequency']],
      daysOfWeek: (map['daysOfWeek'] as String).split(',').map((e) => int.parse(e)).toList(),
      time: DateTime.parse(map['time']),
      isActive: map['isActive'] == 1,
      createdAt: DateTime.parse(map['createdAt']),
    );
  }

  String get frequencyName => frequency == RoutineFrequency.diaria ? 'Diária' : 'Semanal';

  String get daysOfWeekNames {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return daysOfWeek.map((d) => days[d - 1]).join(', ');
  }
}
