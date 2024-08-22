export const TaskService = {
    getTasks() {
        return new Promise((resolve, reject) => {
            resolve([{ id: 1, title: 'Task 1', description: 'lorem task', project_title: 'Project 1', project_id: 1, status_id: 1, priority_id: 1, due_date: '01/06/2025', status: 'Pending', priority: 'High' }]);
        });
    }
};
