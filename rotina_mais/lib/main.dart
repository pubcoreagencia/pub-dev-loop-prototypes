import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/task_service.dart';
import 'services/routine_service.dart';
import 'screens/home_screen.dart';
import 'screens/tasks_screen.dart';
import 'screens/routines_screen.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RotinaMaisApp());
}

class RotinaMaisApp extends StatelessWidget {
  const RotinaMaisApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TaskService()..loadTasks()),
        ChangeNotifierProvider(create: (_) => RoutineService()..loadRoutines()),
      ],
      child: MaterialApp(
        title: 'Rotina+',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        home: const MainScreen(),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    TasksScreen(),
    RoutinesScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Início',
          ),
          NavigationDestination(
            icon: Icon(Icons.task_outlined),
            selectedIcon: Icon(Icons.task),
            label: 'Tarefas',
          ),
          NavigationDestination(
            icon: Icon(Icons.repeat_outlined),
            selectedIcon: Icon(Icons.repeat),
            label: 'Rotinas',
          ),
        ],
      ),
    );
  }
}
