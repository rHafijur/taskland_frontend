export const PriorityService = {
    getPriorities() {
        return new Promise((resolve, reject) => {
            resolve([
                { id: 1, title: 'Low DD' },
                { id: 2, title: 'Medium DD' },
                { id: 3, title: 'High DD' }
            ]);
        });
    }
};
