export const ProjectService = {
    getProjects() {
        return new Promise((resolve, reject) => {
            resolve([
                { id: 1, title: 'Project 1' },
                { id: 2, title: 'Project 2' }
            ]);
        });
    }
};
