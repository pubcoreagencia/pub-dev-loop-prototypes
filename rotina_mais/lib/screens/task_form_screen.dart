import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/task_service.dart';
import '../models/task.dart';
import '../theme/app_theme.dart';

class TaskFormScreen extends StatefulWidget {
  final Task? task;

  const TaskFormScreen({super.key, this.task});

  @override
  State<TaskFormScreen> createState() => _TaskFormScreenState();
}

class _TaskFormScreenState extends State<TaskFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  TaskCategory _category = TaskCategory.pessoal;
  TaskPriority _priority = TaskPriority.media;
  DateTime _dueDate = DateTime.now().add(const Duration(days: 1));
  TimeOfDay _dueTime = const TimeOfDay(hour: 9, minute: 0);

  bool get _isEditing => widget.task != null;

  @override
  void initState() {
    super.initState();
    if (widget.task != null) {
      _titleController.text = widget.task!.title;
      _descriptionController.text = widget.task!.description;
      _category = widget.task!.category;
      _priority = widget.task!.priority;
      _dueDate = widget.task!.dueDate;
      _dueTime = TimeOfDay.fromDateTime(widget.task!.dueDate);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Editar Tarefa' : 'Nova Tarefa'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Título',
                hintText: 'Digite o título da tarefa',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.title),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor, digite um título';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Descrição',
                hintText: 'Digite a descrição (opcional)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.description),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),
            Text(
              'Categoria',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _CategoryOption(
                    label: 'Pessoal',
                    icon: Icons.person,
                    color: AppColors.pessoal,
                    isSelected: _category == TaskCategory.pessoal,
                    onTap: () => setState(() => _category = TaskCategory.pessoal),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _CategoryOption(
                    label: 'Profissional',
                    icon: Icons.work,
                    color: AppColors.profissional,
                    isSelected: _category == TaskCategory.profissional,
                    onTap: () => setState(() => _category = TaskCategory.profissional),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              'Prioridade',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _PriorityOption(
                    label: 'Alta',
                    color: AppColors.highPriority,
                    isSelected: _priority == TaskPriority.alta,
                    onTap: () => setState(() => _priority = TaskPriority.alta),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _PriorityOption(
                    label: 'Média',
                    color: AppColors.mediumPriority,
                    isSelected: _priority == TaskPriority.media,
                    onTap: () => setState(() => _priority = TaskPriority.media),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _PriorityOption(
                    label: 'Baixa',
                    color: AppColors.lowPriority,
                    isSelected: _priority == TaskPriority.baixa,
                    onTap: () => setState(() => _priority = TaskPriority.baixa),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              'Data e Hora',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: _selectDate,
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.calendar_today),
                      ),
                      child: Text(DateFormat('dd/MM/yyyy').format(_dueDate)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: _selectTime,
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.access_time),
                      ),
                      child: Text(_dueTime.format(context)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _saveTask,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: Text(
                _isEditing ? 'Salvar Alterações' : 'Criar Tarefa',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _dueDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );
    if (picked != null) {
      setState(() => _dueDate = picked);
    }
  }

  Future<void> _selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _dueTime,
    );
    if (picked != null) {
      setState(() => _dueTime = picked);
    }
  }

  Future<void> _saveTask() async {
    if (!_formKey.currentState!.validate()) return;

    final dueDateTime = DateTime(
      _dueDate.year,
      _dueDate.month,
      _dueDate.day,
      _dueTime.hour,
      _dueTime.minute,
    );

    final service = Provider.of<TaskService>(context, listen: false);

    if (_isEditing) {
      await service.updateTask(
        widget.task!.copyWith(
          title: _titleController.text,
          description: _descriptionController.text,
          category: _category,
          priority: _priority,
          dueDate: dueDateTime,
        ),
      );
    } else {
      await service.addTask(
        title: _titleController.text,
        description: _descriptionController.text,
        category: _category,
        dueDate: dueDateTime,
        priority: _priority,
      );
    }

    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditing ? 'Tarefa atualizada!' : 'Tarefa criada!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }
}

class _CategoryOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryOption({
    required this.label,
    required this.icon,
    required this.color,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.1) : Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? color : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSelected ? color : Colors.grey, size: 32),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? color : Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PriorityOption extends StatelessWidget {
  final String label;
  final Color color;
  final bool isSelected;
  final VoidCallback onTap;

  const _PriorityOption({
    required this.label,
    required this.color,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.1) : Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? color : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? color : Colors.grey[600],
            ),
          ),
        ),
      ),
    );
  }
}
