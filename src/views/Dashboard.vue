<script setup>
import { DashboardService } from '@/service/DashboardService';
import { PriorityService } from '@/service/PriorityService';
import { ProjectService } from '@/service/ProjectService';
import { TaskStatusService } from '@/service/TaskStatusService';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref } from 'vue';

const tasks = ref([]);
const upcomingDeadlineTasks = ref([]);
const stat = ref({});

const priorities = ref();
const taskStatuses = ref();
const projects = ref();

var channel = window.Echo.channel('web');
channel.listen('.task-completed', function (data) {
    // console.log(data);
    loadDashboardData();
});
channel.listen('.task-updated', function (data) {
    // console.log(data);
    loadDashboardData();
});

onMounted(() => {
    loadDashboardData();
    PriorityService.getPriorities().then((data) => {
        priorities.value = data.data.data;
    });
    ProjectService.getProjects().then((data) => {
        projects.value = data.data.data;
    });
    TaskStatusService.getTaskStatues().then((data) => {
        taskStatuses.value = data.data.data;
    });
});

function loadDashboardData() {
    DashboardService.getDashboard().then((res) => {
        upcomingDeadlineTasks.value = res.data.upcomingDeadlineTasks;
        tasks.value = res.data.tasks;
        stat.value = res.data.taskStatistics;
        // console.log(tasks);
    });
}

function getTaskStatusLabel(status) {
    switch (status) {
        case 'Completed':
            return 'success';

        case 'Due':
            return 'warn';

        case 'Canceled':
            return 'danger';

        default:
            return null;
    }
}

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    task_status_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    priority_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    project_id: { value: null, matchMode: FilterMatchMode.EQUALS }
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Total</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stat?.total ?? 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-list text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">Total number of tasks</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Due</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stat?.due ?? 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-info-circle text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">Total number of due tasks</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Completed</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stat?.completed ?? 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-check-circle text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">Total number of completed Tasks</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Due Today</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stat?.due_today ?? 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calendar-times text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-muted-color">Total number of today's due tasks</span>
            </div>
        </div>

        <div class="col-span-12 xl:col-span-12">
            <div class="card">
                <div class="font-semibold text-xl mb-4">All Tasks</div>
                <DataTable
                    ref="dt"
                    :value="tasks"
                    dataKey="id"
                    filterDisplay="row"
                    :paginator="true"
                    :rows="10"
                    size="small"
                    v-model:filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tasks"
                >
                    <template #header>
                        <div class="flex flex-wrap gap-2 items-center justify-between">
                            <!-- <h4 class="m-0">Manage Tasks</h4> -->
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column field="id" header="ID" sortable style="min-width: 4rem"></Column>
                    <Column filterField="project_id" :showFilterMenu="false" field="project_title" header="Project" sortable style="min-width: 12rem">
                        <template #filter="{ filterModel, filterCallback }">
                            <Select v-model="filterModel.value" @change="filterCallback()" :options="projects" optionLabel="title" optionValue="id" placeholder="Filter Project" style="min-width: 12rem" :showClear="true">
                                <template #option="slotProps">
                                    {{ slotProps.option.title }}
                                </template>
                            </Select>
                        </template>
                    </Column>
                    <Column field="title" header="Title" sortable style="min-width: 12rem"> </Column>
                    <Column field="description" header="Description" sortable style="min-width: 12rem"></Column>
                    <Column field="creator_name" header="Assigned To" sortable style="min-width: 12rem"></Column>
                    <Column field="due_date" header="Due Date" sortable style="min-width: 12rem"></Column>
                    <Column filterField="priority_id" :showFilterMenu="false" field="priority" header="Priority" sortable style="min-width: 12rem">
                        <template #filter="{ filterModel, filterCallback }">
                            <Select v-model="filterModel.value" @change="filterCallback()" :options="priorities" optionLabel="title" optionValue="id" placeholder="Filter Priority" style="min-width: 12rem" :showClear="true">
                                <template #option="slotProps">
                                    {{ slotProps.option.title }}
                                </template>
                            </Select>
                        </template>
                    </Column>
                    <Column filterField="task_status_id" :showFilterMenu="false" field="task_status" header="Status" sortable style="min-width: 12rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.task_status" :severity="getTaskStatusLabel(slotProps.data.task_status)" />
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Select v-model="filterModel.value" @change="filterCallback()" :options="taskStatuses" optionLabel="title" optionValue="id" placeholder="Filter Status" style="min-width: 12rem" :showClear="true">
                                <template #option="slotProps">
                                    <Tag :value="slotProps.option.title" :severity="getTaskStatusLabel(slotProps.option.title)" />
                                </template>
                            </Select>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-12">
            <div class="card">
                <div class="flex justify-between items-center mb-6">
                    <div class="font-semibold text-xl">Upcoming Deadlines</div>
                </div>
                <ul class="list-none p-0 m-0">
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6" v-for="task of upcomingDeadlineTasks">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ task.title }}</span>
                            <div class="mt-1 text-muted-color">{{ task.creator_name }}</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex items-center">
                            <span :class="{ 'text-yellow-500': task.remaining_days > 0 && task.remaining_days <= 3, 'text-red-700': task.remaining_days == 0, 'text-green-700': task.remaining_days > 3 }" class="ml-4 font-medium"
                                >{{ task.remaining_days }} Days remeining
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
