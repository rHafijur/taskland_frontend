import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/users/UserCrud.vue')
                },
                {
                    path: '/tasks',
                    name: 'tasks',
                    component: () => import('@/views/tasks/TaskCrud.vue')
                },
                {
                    path: '/projects',
                    name: 'projects',
                    component: () => import('@/views/projects/ProjectCrud.vue')
                }
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/:pathMatch(.*)',
            name: '404',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

export default router;
