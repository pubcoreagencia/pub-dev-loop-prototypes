import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/task_service.dart';
import '../models/task.dart';
import '../widgets/task_card.dart';
import '../widgets/category_filter.dart';
import 'task_form_screen.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tarefas'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: 'Pendentes'),
            Tab(text: 'Concluídas'),
          ],
        ),
      ),
      body: Consumer<TaskService>(
        builder: (context, taskService, child) {
          return Column(
            children: [
              CategoryFilter(
                selected: taskService.categoryFilter,
                onChanged: (category) => taskService.setCategoryFilter(category),
              ),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildTaskList(taskService.pendingTasks, taskService),
                    _buildTaskList(taskService.completedTasks, taskService),
                  ],
                ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _navigateToTaskForm(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildTaskList(List<Task> tasks, TaskService service) {
    if (tasks.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.task_alt, size: 64, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              'Nenhuma tarefa',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[500],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Toque no + para adicionar',
              style: TextStyle(
                color: Colors.grey[400],
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => service.loadTasks(),
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8, bottom: 80),
        itemCount: tasks.length,
        itemBuilder: (context, index) {
          final task = tasks[index];
          return TaskCard(
            task: task,
            onToggle: () => service.toggleTaskCompletion(task.id),
            onEdit: () => _navigateToTaskForm(context, task: task),
            onDelete: () => service.deleteTask(task.id),
          );
        },
      ),
    );
  }

  void _navigateToTaskForm(BuildContext context, {Task? task}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TaskFormScreen(task: task),
      ),
    );
  }
}
