enum TaskCategory { pessoal, profissional }

enum TaskPriority { alta, media, baixa }

class Task {
  final String id;
  final String title;
  final String description;
  final TaskCategory category;
  final DateTime dueDate;
  final TaskPriority priority;
  final bool isCompleted;
  final DateTime createdAt;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.dueDate,
    required this.priority,
    this.isCompleted = false,
    required this.createdAt,
  });

  Task copyWith({
    String? id,
    String? title,
    String? description,
    TaskCategory? category,
    DateTime? dueDate,
    TaskPriority? priority,
    bool? isCompleted,
    DateTime? createdAt,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      dueDate: dueDate ?? this.dueDate,
      priority: priority ?? this.priority,
      isCompleted: isCompleted ?? this.isCompleted,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category.index,
      'dueDate': dueDate.toIso8601String(),
      'priority': priority.index,
      'isCompleted': isCompleted ? 1 : 0,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Task.fromMap(Map<String, dynamic> map) {
    return Task(
      id: map['id'],
      title: map['title'],
      description: map['description'],
      category: TaskCategory.values[map['category']],
      dueDate: DateTime.parse(map['dueDate']),
      priority: TaskPriority.values[map['priority']],
      isCompleted: map['isCompleted'] == 1,
      createdAt: DateTime.parse(map['createdAt']),
    );
  }

  String get categoryName => category == TaskCategory.pessoal ? 'Pessoal' : 'Profissional';
  
  String get priorityName {
    switch (priority) {
      case TaskPriority.alta:
        return 'Alta';
      case TaskPriority.media:
        return 'Média';
      case TaskPriority.baixa:
        return 'Baixa';
    }
  }
}
