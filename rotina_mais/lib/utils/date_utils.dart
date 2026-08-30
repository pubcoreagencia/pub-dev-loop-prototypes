import 'package:intl/intl.dart';

class DateUtils {
  static String formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  static String formatTime(DateTime time) {
    return DateFormat('HH:mm').format(time);
  }

  static String formatDateTime(DateTime dateTime) {
    return DateFormat('dd/MM/yyyy HH:mm').format(dateTime);
  }

  static String formatRelativeDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final dateOnly = DateTime(date.year, date.month, date.day);
    final difference = dateOnly.difference(today).inDays;

    if (difference == 0) return 'Hoje';
    if (difference == 1) return 'Amanhã';
    if (difference == -1) return 'Ontem';
    if (difference > 1 && difference <= 7) return 'Em $difference dias';
    if (difference < -1 && difference >= -7) return 'Há ${-difference} dias';
    
    return formatDate(date);
  }

  static bool isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year && 
           date.month == now.month && 
           date.day == now.day;
  }

  static bool isOverdue(DateTime date) {
    return date.isBefore(DateTime.now());
  }
}
