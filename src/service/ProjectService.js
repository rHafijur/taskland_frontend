import ApiService from '@/service/ApiService';

export const ProjectService = {
    path: '/project',
    getProjects() {
        return ApiService.get(this.path);
    },
    createProject(projectData) {
        return ApiService.post(this.path, projectData);
    },
    updateProject(id, projectData) {
        return ApiService.put(this.path + '/' + id, projectData);
    },
    deleteProject(id) {
        return ApiService.delete(this.path + '/' + id);
    }
};
