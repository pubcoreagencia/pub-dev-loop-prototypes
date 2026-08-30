import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/routine.dart';
import '../models/task.dart';
import '../theme/app_theme.dart';

class RoutineCard extends StatelessWidget {
  final Routine routine;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback onToggleActive;

  const RoutineCard({
    super.key,
    required this.routine,
    required this.onEdit,
    required this.onDelete,
    required this.onToggleActive,
  });

  @override
  Widget build(BuildContext context) {
    final categoryColor = AppTheme.getCategoryColor(routine.category);
    final timeFormat = DateFormat('HH:mm');

    return Dismissible(
      key: Key(routine.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      confirmDismiss: (direction) async {
        return await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Excluir Rotina'),
            content: const Text('Deseja realmente excluir esta rotina?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('Cancelar'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('Excluir', style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
        );
      },
      onDismissed: (_) => onDelete(),
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border(
              left: BorderSide(color: categoryColor, width: 4),
            ),
          ),
          child: ListTile(
            onTap: onEdit,
            leading: Icon(
              Icons.repeat,
              color: routine.isActive ? categoryColor : Colors.grey,
            ),
            title: Text(
              routine.title,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: routine.isActive ? Colors.black87 : Colors.grey,
              ),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: categoryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        routine.frequencyName,
                        style: TextStyle(
                          fontSize: 11,
                          color: categoryColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      routine.daysOfWeekNames,
                      style: const TextStyle(fontSize: 11, color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  timeFormat.format(routine.time),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: routine.isActive ? categoryColor : Colors.grey,
                  ),
                ),
                const SizedBox(width: 8),
                Switch(
                  value: routine.isActive,
                  onChanged: (_) => onToggleActive(),
                  activeColor: categoryColor,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
