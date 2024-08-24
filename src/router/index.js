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
                    component: () => import('@/views/users/UserCrud.vue'),
                    beforeEnter: (to, from, next) => {
                        if (localStorage.getItem('role_id') == 1) {
                            next();
                        } else {
                            next('/accessdenied');
                        }
                    }
                },
                {
                    path: '/tasks',
                    name: 'tasks',
                    component: () => import('@/views/tasks/TaskCrud.vue'),
                    beforeEnter: (to, from, next) => {
                        if (localStorage.getItem('role_id') == 2) {
                            next();
                        } else {
                            next('/accessdenied');
                        }
                    }
                },
                {
                    path: '/projects',
                    name: 'projects',
                    component: () => import('@/views/projects/ProjectCrud.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/accessdenied',
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
