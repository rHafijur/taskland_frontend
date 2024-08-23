import ApiService from '@/service/ApiService';
export const RoleService = {
    path: '/role',
    getRoles() {
        return ApiService.get('/role');
    }
};
