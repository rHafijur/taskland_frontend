export const RoleService = {
    getRoles() {
        return new Promise((resolve, reject) => {
            resolve([
                { id: 1, name: 'Admin Dummy' },
                { id: 2, name: 'User Dummy' }
            ]);
        });
    }
};
