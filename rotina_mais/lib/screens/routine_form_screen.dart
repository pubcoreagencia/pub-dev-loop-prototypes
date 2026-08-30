import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/routine_service.dart';
import '../models/routine.dart';
import '../models/task.dart';
import '../theme/app_theme.dart';

class RoutineFormScreen extends StatefulWidget {
  final Routine? routine;

  const RoutineFormScreen({super.key, this.routine});

  @override
  State<RoutineFormScreen> createState() => _RoutineFormScreenState();
}

class _RoutineFormScreenState extends State<RoutineFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  TaskCategory _category = TaskCategory.pessoal;
  RoutineFrequency _frequency = RoutineFrequency.diaria;
  Set<int> _selectedDays = {1, 2, 3, 4, 5}; // Seg a Sex
  TimeOfDay _time = const TimeOfDay(hour: 8, minute: 0);

  bool get _isEditing => widget.routine != null;

  @override
  void initState() {
    super.initState();
    if (widget.routine != null) {
      _titleController.text = widget.routine!.title;
      _descriptionController.text = widget.routine!.description;
      _category = widget.routine!.category;
      _frequency = widget.routine!.frequency;
      _selectedDays = widget.routine!.daysOfWeek.toSet();
      _time = TimeOfDay.fromDateTime(widget.routine!.time);
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
        title: Text(_isEditing ? 'Editar Rotina' : 'Nova Rotina'),
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
                hintText: 'Ex: Meditação matinal',
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
              maxLines: 2,
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
              'Frequência',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _FrequencyOption(
                    label: 'Diária',
                    isSelected: _frequency == RoutineFrequency.diaria,
                    onTap: () => setState(() {
                      _frequency = RoutineFrequency.diaria;
                      _selectedDays = {1, 2, 3, 4, 5, 6, 7};
                    }),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _FrequencyOption(
                    label: 'Semanal',
                    isSelected: _frequency == RoutineFrequency.semanal,
                    onTap: () => setState(() {
                      _frequency = RoutineFrequency.semanal;
                      if (_selectedDays.isEmpty) {
                        _selectedDays = {1};
                      }
                    }),
                  ),
                ),
              ],
            ),
            if (_frequency == RoutineFrequency.semanal) ...[
              const SizedBox(height: 24),
              Text(
                'Dias da Semana',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              _buildDaySelector(),
            ],
            const SizedBox(height: 24),
            Text(
              'Horário',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            InkWell(
              onTap: _selectTime,
              child: InputDecorator(
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.access_time),
                ),
                child: Text(
                  _time.format(context),
                  style: const TextStyle(fontSize: 16),
                ),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _saveRoutine,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: Text(
                _isEditing ? 'Salvar Alterações' : 'Criar Rotina',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDaySelector() {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(7, (index) {
        final dayNumber = index + 1;
        final isSelected = _selectedDays.contains(dayNumber);
        return GestureDetector(
          onTap: () {
            setState(() {
              if (isSelected) {
                _selectedDays.remove(dayNumber);
              } else {
                _selectedDays.add(dayNumber);
              }
            });
          },
          child: Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary : Colors.grey[200],
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                days[index],
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.grey[600],
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  Future<void> _selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _time,
    );
    if (picked != null) {
      setState(() => _time = picked);
    }
  }

  Future<void> _saveRoutine() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedDays.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecione pelo menos um dia'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    final now = DateTime.now();
    final routineTime = DateTime(now.year, now.month, now.day, _time.hour, _time.minute);

    final service = Provider.of<RoutineService>(context, listen: false);

    if (_isEditing) {
      await service.updateRoutine(
        widget.routine!.copyWith(
          title: _titleController.text,
          description: _descriptionController.text,
          category: _category,
          frequency: _frequency,
          daysOfWeek: _selectedDays.toList()..sort(),
          time: routineTime,
        ),
      );
    } else {
      await service.addRoutine(
        title: _titleController.text,
        description: _descriptionController.text,
        category: _category,
        frequency: _frequency,
        daysOfWeek: _selectedDays.toList()..sort(),
        time: routineTime,
      );
    }

    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditing ? 'Rotina atualizada!' : 'Rotina criada!'),
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

class _FrequencyOption extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FrequencyOption({
    required this.label,
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
          color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primary : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? AppColors.primary : Colors.grey[600],
            ),
          ),
        ),
      ),
    );
  }
}
