import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_theme.dart';

class CategoryFilter extends StatelessWidget {
  final TaskCategory? selected;
  final Function(TaskCategory?) onChanged;

  const CategoryFilter({
    super.key,
    required this.selected,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          _FilterChip(
            label: 'Todas',
            isSelected: selected == null,
            color: Colors.grey,
            onTap: () => onChanged(null),
          ),
          const SizedBox(width: 8),
          _FilterChip(
            label: 'Pessoal',
            isSelected: selected == TaskCategory.pessoal,
            color: AppColors.pessoal,
            onTap: () => onChanged(TaskCategory.pessoal),
          ),
          const SizedBox(width: 8),
          _FilterChip(
            label: 'Profissional',
            isSelected: selected == TaskCategory.profissional,
            color: AppColors.profissional,
            onTap: () => onChanged(TaskCategory.profissional),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final Color color;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? color : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color, width: 1.5),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : color,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}
