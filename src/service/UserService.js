export const UserService = {
    getUsers() {
        return new Promise((resolve, reject) => {
            resolve([
                { id: 1, name: 'User 1', email: 'user1@gmail.com', role: 'Admin' },
                { id: 2, name: 'User 2', email: 'user2@gmail.com', role: 'User' },
                { id: 3, name: 'User 3', email: 'user3@gmail.com', role: 'User' },
                { id: 4, name: 'User 4', email: 'user4@gmail.com', role: 'User' }
            ]);
        });
    }
};
