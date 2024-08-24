<script setup>
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

import { MenuService } from '@/service/MenuService';

onMounted(() => {
    MenuService.getMenu().then((data) => {
        model.value = data.data;
    });
});

const model = ref([
    {
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }
            // { label: 'User', icon: 'pi pi-fw pi-user', to: '/users' },
            // { label: 'Projects', icon: 'pi pi-fw pi-list', to: '/projects' },
            // { label: 'Tasks', icon: 'pi pi-fw pi-check-square', to: '/tasks' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
