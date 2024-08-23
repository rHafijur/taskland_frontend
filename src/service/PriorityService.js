import ApiService from '@/service/ApiService';
export const PriorityService = {
    path: '/priority',
    getPriorities() {
        return ApiService.get(this.path);
    }
};
