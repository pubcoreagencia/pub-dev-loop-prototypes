document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');

    // Load todos from localStorage if available
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            list.appendChild(li);
        });

        // Save to localStorage
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            input.value = '';
            renderTodos();
        }
    });

    list.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index);
            if (index >= 0 && index < todos.length) {
                todos.splice(index, 1);
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
            }
        }
    });

    // Initial render
    renderTodos();
});
