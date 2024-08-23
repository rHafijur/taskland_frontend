import ApiService from '@/service/ApiService';

export const TaskService = {
    path: '/task',
    getTasks() {
        return ApiService.get(this.path);
    },
    createTask(taskData) {
        return ApiService.post(this.path, taskData);
    },
    updateTask(id, taskData) {
        return ApiService.put(this.path + '/' + id, taskData);
    },
    deleteTask(id) {
        return ApiService.delete(this.path + '/' + id);
    },
    completeTask(id) {
        return ApiService.post(this.path + '/complete', { id });
    }
};
