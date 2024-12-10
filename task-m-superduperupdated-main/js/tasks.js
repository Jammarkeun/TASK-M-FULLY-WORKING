document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const taskList = document.getElementById('taskList');

    // Load existing tasks
    loadTasks();

    function loadTasks() {
        fetch(`/api/tasks.php?user_id=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.records && data.records.length > 0) {
                    taskList.innerHTML = ''; // Clear existing tasks
                    data.records.forEach(task => {
                        const taskElement = createTaskElement(task);
                        taskList.appendChild(taskElement);
                    });
                } else {
                    taskList.innerHTML = '<p>No tasks found.</p>';
                }
            })
            .catch(error => console.error('Error loading tasks:', error));
    }

    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        taskElement.innerHTML = `
            <div class="task-info">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span class="task-category">${task.category}</span>
                    <span class="task-date"><i class="far fa-calendar"></i> ${task.due_date.split('T')[0]}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn edit-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                <button class="task-action-btn delete-btn" data-id="${task.id}"><i class="fas fa-trash"></i></button>
            </div>
            <div class="edit-form" style="display: none;">
                <input type="hidden" class="editTaskId" value="${task.id}">
                <div class="form-group">
                    <label for="editTaskTitle">Task Title</label>
                    <input type="text" class="editTaskTitle" value="${task.title}" required>
                </div>
                <div class="form-group">
                    <label for="editTaskDescription">Description</label>
                    <textarea class="editTaskDescription" required>${task.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="editDueDate">Due Date</label>
                    <input type="date" class="editDueDate" value="${task.due_date.split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label for="editTaskPriority">Priority</label>
                    <select class="editTaskPriority">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editTaskCategory">Category</label>
                    <input type="text" class="editTaskCategory" value="${task.category}" required>
                </div>
                <button class="update-task-button">Update Task</button>
            </div>
        `;

        taskElement.querySelector('.edit-btn').addEventListener('click', () => {
            const editForm = taskElement.querySelector('.edit-form');
            editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
        });

        taskElement.querySelector('.update-task-button').addEventListener('click', () => {
            const taskId = taskElement.querySelector('.editTaskId').value;

            const updatedTask = {
                id: taskId,
                title: taskElement.querySelector('.editTaskTitle').value,
                description: taskElement.querySelector('.editTaskDescription').value,
                due_date: taskElement.querySelector('.editDueDate').value,
                status: 'pending', // Adjust this based on your logic
                priority: taskElement.querySelector('.editTaskPriority').value,
                category: taskElement.querySelector('.editTaskCategory').value
            };

            fetch('/api/tasks.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Task updated:', data);
                loadTasks(); // Reload tasks after updating
            })
            .catch(error => console.error('Error updating task:', error));
        });

        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task.id);
        });

        return taskElement;
    }

    function deleteTask(taskId) {
        fetch('/api/tasks.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: taskId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task deleted:', data);
            loadTasks();
        })
        .catch(error => console.error('Error deleting task:', error));
    }
});
