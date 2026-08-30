import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/task_service.dart';
import '../services/routine_service.dart';
import '../theme/app_theme.dart';
import '../widgets/stat_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rotina+'),
        centerTitle: true,
      ),
      body: Consumer2<TaskService, RoutineService>(
        builder: (context, taskService, routineService, child) {
          return RefreshIndicator(
            onRefresh: () async {
              await taskService.loadTasks();
              await routineService.loadRoutines();
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Olá! 👋',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _getGreeting(),
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Resumo de Hoje',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 1.1,
                    children: [
                      StatCard(
                        title: 'Tarefas\nPendentes',
                        value: '${taskService.pendingCount}',
                        icon: Icons.pending_actions,
                        color: AppColors.primary,
                      ),
                      StatCard(
                        title: 'Concluídas\nHoje',
                        value: '${taskService.completedTodayCount}',
                        icon: Icons.check_circle,
                        color: AppColors.secondary,
                      ),
                      StatCard(
                        title: 'Rotinas\nAtivas',
                        value: '${routineService.routines.where((r) => r.isActive).length}',
                        icon: Icons.repeat,
                        color: AppColors.pessoal,
                      ),
                      StatCard(
                        title: 'Rotinas\nde Hoje',
                        value: '${routineService.todayRoutines.length}',
                        icon: Icons.today,
                        color: AppColors.profissional,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Tarefas de Hoje',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),
                  if (taskService.todayTasks.isEmpty)
                    _buildEmptyState('Nenhuma tarefa para hoje', Icons.check_circle_outline)
                  else
                    ...taskService.todayTasks.take(3).map((task) => _buildTaskItem(context, task, taskService)),
                  if (taskService.todayTasks.length > 3)
                    TextButton(
                      onPressed: () {
                        // Navigate to tasks tab
                      },
                      child: const Text('Ver todas as tarefas →'),
                    ),
                  const SizedBox(height: 24),
                  Text(
                    'Rotinas de Hoje',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),
                  if (routineService.todayRoutines.isEmpty)
                    _buildEmptyState('Nenhuma rotina para hoje', Icons.event_available)
                  else
                    ...routineService.todayRoutines.take(3).map((r) => _buildRoutineItem(context, r)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Bom dia! Tenha um ótimo dia!';
    if (hour < 18) return 'Boa tarde! Continue assim!';
    return 'Boa noite! Descanse bem!';
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: Colors.grey),
          const SizedBox(width: 12),
          Text(message, style: const TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildTaskItem(BuildContext context, task, TaskService service) {
    final color = AppTheme.getCategoryColor(task.category);
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(
          task.isCompleted ? Icons.check_circle : Icons.circle_outlined,
          color: task.isCompleted ? Colors.green : color,
        ),
        title: Text(
          task.title,
          style: TextStyle(
            decoration: task.isCompleted ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Text(task.categoryName),
        trailing: IconButton(
          icon: const Icon(Icons.check),
          onPressed: () => service.toggleTaskCompletion(task.id),
        ),
      ),
    );
  }

  Widget _buildRoutineItem(BuildContext context, routine) {
    final color = AppTheme.getCategoryColor(routine.category);
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(Icons.repeat, color: color),
        title: Text(routine.title),
        subtitle: Text(routine.frequencyName),
        trailing: Text(
          '${routine.time.hour.toString().padLeft(2, '0')}:${routine.time.minute.toString().padLeft(2, '0')}',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ),
    );
  }
}
