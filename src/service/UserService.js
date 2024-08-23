import ApiService from '@/service/ApiService';

export const UserService = {
    path: '/user',
    getUsers() {
        return ApiService.get(this.path);
    },
    createUser(userData) {
        return ApiService.post(this.path, userData);
    },
    updateUser(id, userData) {
        return ApiService.put(this.path + '/' + id, userData);
    },
    deleteUser(id) {
        return ApiService.delete(this.path + '/' + id);
    }
};
