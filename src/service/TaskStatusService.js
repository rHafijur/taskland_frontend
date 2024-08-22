export const TaskStatusService = {
    getTaskStatues() {
        return new Promise((resolve, reject) => {
            resolve([
                { id: 1, title: 'Due' },
                { id: 2, title: 'Complete' }
            ]);
        });
    }
};
