document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const input = document.getElementById('task-input');
    const tasksList = document.getElementById('tasks-list');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    function renderTasks() {
        tasksList.innerHTML = '';
        if (tasks.length === 0) {
            tasksList.innerHTML = '<p class="empty-state hidden">Nenhuma tarefa adicionada ainda</p>';
        } else {
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}" onclick="toggleTask(${index})">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <div class="task-actions">
                        <button class="task-btn complete-btn" onclick="toggleTask(${index})" ${task.completed ? 'disabled' : ''}>✓</button>
                        <button class="task-btn delete-btn" onclick="deleteTask(${index})">✕</button>
                    </div>
                `;
                tasksList.appendChild(li);
            });
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        input.value = '';
        input.focus();
    });

    function toggleTask(index) {
        const task = tasks[index];
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
