import ApiService from '@/service/ApiService';
export const TaskStatusService = {
    path: '/task_status',
    getTaskStatues() {
        return ApiService.get(this.path);
    }
};
