import 'package:flutter/material.dart';
import '../models/task.dart';

class AppColors {
  static const Color primary = Color(0xFF673AB7);
  static const Color secondary = Color(0xFF009688);
  static const Color pessoal = Color(0xFFFF7043);
  static const Color profissional = Color(0xFF2196F3);
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color highPriority = Color(0xFFE53935);
  static const Color mediumPriority = Color(0xFFFFA726);
  static const Color lowPriority = Color(0xFF66BB6A);
}

class AppTheme {
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: AppColors.background,
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }

  static Color getCategoryColor(TaskCategory category) {
    return category == TaskCategory.pessoal
        ? AppColors.pessoal
        : AppColors.profissional;
  }

  static Color getPriorityColor(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.alta:
        return AppColors.highPriority;
      case TaskPriority.media:
        return AppColors.mediumPriority;
      case TaskPriority.baixa:
        return AppColors.lowPriority;
    }
  }
}
