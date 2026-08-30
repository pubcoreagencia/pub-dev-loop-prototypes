import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/routine_service.dart';
import '../models/routine.dart';
import '../widgets/routine_card.dart';
import '../widgets/category_filter.dart';
import 'routine_form_screen.dart';

class RoutinesScreen extends StatelessWidget {
  const RoutinesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rotinas'),
      ),
      body: Consumer<RoutineService>(
        builder: (context, routineService, child) {
          return Column(
            children: [
              CategoryFilter(
                selected: routineService.categoryFilter,
                onChanged: (category) => routineService.setCategoryFilter(category),
              ),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: () => routineService.loadRoutines(),
                  child: routineService.filteredRoutines.isEmpty
                      ? _buildEmptyState()
                      : ListView.builder(
                          padding: const EdgeInsets.only(top: 8, bottom: 80),
                          itemCount: routineService.filteredRoutines.length,
                          itemBuilder: (context, index) {
                            final routine = routineService.filteredRoutines[index];
                            return RoutineCard(
                              routine: routine,
                              onEdit: () => _navigateToRoutineForm(context, routine),
                              onDelete: () => routineService.deleteRoutine(routine.id),
                              onToggleActive: () => routineService.toggleRoutineActive(routine.id),
                            );
                          },
                        ),
                ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _navigateToRoutineForm(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.repeat, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text(
            'Nenhuma rotina',
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

  void _navigateToRoutineForm(BuildContext context, {Routine? routine}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RoutineFormScreen(routine: routine),
      ),
    );
  }
}
