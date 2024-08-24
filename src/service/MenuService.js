import ApiService from '@/service/ApiService';
export const MenuService = {
    path: '/menu',
    getMenu() {
        return ApiService.get(this.path);
    }
};
