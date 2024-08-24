import ApiService from '@/service/ApiService';
export const DashboardService = {
    path: '/dashboard',
    getDashboard() {
        return ApiService.get(this.path);
    }
};
