document.addEventListener('DOMContentLoaded', function() {
    const taskStatusHandler = new TaskStatusHandler();
    taskStatusHandler.init();

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userId');
            localStorage.removeItem('fullname');
            window.location.href = 'login.html';
        });
    }

    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
    }

    // Display user's name
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const fullname = localStorage.getItem('fullname');
        userNameElement.textContent = fullname;
    }

    // Task form handling
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(taskForm);
            formData.append('user_id', userId);
            
            try {
                const response = await fetch('/api/tasks.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('Task created successfully');
                    taskForm.reset();
                    // Reload tasks or update task list
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the task');
            }
        });
    }

    // Task status update
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('status-update')) {
            const taskId = e.target.dataset.taskId;
            const newStatus = e.target.dataset.status;
            
            try {
                const response = await fetch('/api/tasks.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: taskId,
                        status: newStatus
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    // Reload tasks or update task list
                    location.reload();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the task status');
            }
        }
    });
});