<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { PriorityService } from '../../service/PriorityService';
import { ProjectService } from '../../service/ProjectService';
import { TaskService } from '../../service/TaskService';
import { TaskStatusService } from '../../service/TaskStatusService';

onMounted(() => {
    TaskService.getTasks().then((data) => {
        tasks.value = data.data.data;
    });
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

const toast = useToast();
const dt = ref();
const tasks = ref();
const priorities = ref();
const taskStatuses = ref();
const projects = ref();
const taskDialog = ref(false);
const deleteTaskDialog = ref(false);
const task = ref();
const errorMessages = ref({});
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    task_status_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    priority_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    project_id: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const submitted = ref(false);

function openNew() {
    task.value = {};
    submitted.value = false;
    taskDialog.value = true;
}

function hideDialog() {
    taskDialog.value = false;
    submitted.value = false;
}

function saveTask() {
    if (task.value.id == null) {
        TaskService.createTask(task.value).then(
            (res) => {
                tasks.value.push(res.data.data);
                taskDialog.value = false;
            },
            (error) => {
                errorMessages.value = error.response.data;
            }
        );
    } else {
        TaskService.updateTask(task.value.id, task.value).then(
            (res) => {
                for (var i in tasks.value) {
                    if (tasks.value[i].id == task.value.id) {
                        tasks.value[i] = res.data.data;
                    }
                }
                taskDialog.value = false;
            },
            (error) => {
                errorMessages.value = error.response.data;
            }
        );
    }
    submitted.value = true;
}

function editTask(usr) {
    task.value = { ...usr };

    taskDialog.value = true;
}

function confirmDeleteTask(usr) {
    task.value = usr;
    deleteTaskDialog.value = true;
}

function completeTask(id) {
    TaskService.completeTask(id).then((res) => {
        for (var i in tasks.value) {
            if (tasks.value[i].id == id) {
                tasks.value[i] = res.data.data;
            }
        }
        taskDialog.value = false;
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

function deleteTask() {
    TaskService.deleteTask(task.value.id).then((res) => {
        tasks.value = tasks.value.filter((u) => u.id != task.value.id);
        deleteTaskDialog.value = false;
    });
}

function exportCSV() {
    dt.value.exportCSV();
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <!-- <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" /> -->
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

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
                        <h4 class="m-0">Manage Tasks</h4>
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
                <Column field="title" header="Title" sortable style="min-width: 12rem">
                    <!-- <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
                    </template> -->
                </Column>
                <Column field="description" header="Description" sortable style="min-width: 12rem"></Column>
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
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-check-square" outlined class="mr-2" @click="completeTask(slotProps.data.id)" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editTask(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteTask(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="taskDialog" :style="{ width: '450px' }" :header="task?.id == null ? 'Create New Task' : 'Edit Task'" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label class="block font-bold mb-3">Project</label>
                    <Select fluid :options="projects" optionLabel="title" optionValue="id" placeholder="Select a Project" v-model="task.project_id" :invalid="errorMessages?.errors?.project_id != null"></Select>
                    <small v-if="errorMessages?.errors?.project_id != null" class="text-red-500">
                        <ul>
                            <li v-for="error of errorMessages.errors.project_id">{{ error }}</li>
                        </ul>
                    </small>
                </div>
                <div>
                    <label for="title" class="block font-bold mb-3">Title</label>
                    <InputText id="title" v-model.trim="task.title" required="true" autofocus :invalid="errorMessages?.errors?.title != null" fluid />
                    <small v-if="errorMessages?.errors?.title != null" class="text-red-500">
                        <ul>
                            <li v-for="error of errorMessages.errors.title">{{ error }}</li>
                        </ul>
                    </small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model.trim="task.description" required="true" autofocus :invalid="errorMessages?.errors?.description != null" fluid></Textarea>
                    <small v-if="errorMessages?.errors?.description != null" class="text-red-500">
                        <ul>
                            <li v-for="error of errorMessages.errors.description">{{ error }}</li>
                        </ul>
                    </small>
                </div>
                <div>
                    <label for="due_date" class="block font-bold mb-3">Due Date</label>
                    <DatePicker dateFormat="yy-mm-dd" showIcon fluid id="due_date" v-model="task.due_date" :disabled="task.id != null" :invalid="errorMessages?.errors?.due_date != null"></DatePicker>
                    <small v-if="errorMessages?.errors?.due_date != null" class="text-red-500">
                        <ul>
                            <li v-for="error of errorMessages.errors.due_date">{{ error }}</li>
                        </ul>
                    </small>
                </div>
                <div>
                    <label for="priority" class="block font-bold mb-3">Priority</label>
                    <SelectButton dataKey="id" :options="priorities" optionLabel="title" optionValue="id" v-model="task.priority_id" :invalid="errorMessages?.errors?.priority_id != null" fluid></SelectButton>
                    <small v-if="errorMessages?.errors?.priority_id != null" class="text-red-500">
                        <ul>
                            <li v-for="error of errorMessages.errors.priority_id">{{ error }}</li>
                        </ul>
                    </small>
                </div>
                <!-- <div>
                    <label for="status" class="block font-bold mb-3">Status</label>
                    <SelectButton dataKey="id" :options="taskStatuses" optionLabel="title" optionValue="id" v-model="task.task_task_status_id" :invalid="errorMessages?.errors?.task_task_status_id != null"></SelectButton>
                    <small v-if="errorMessages?.errors?.task_task_status_id != null" class="text-red-500">
                        <ul>
                            <li v-for="error of errorMessages.errors.task_task_status_id">{{ error }}</li>
                        </ul>
                    </small>
                </div> -->
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveTask" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteTaskDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="task"
                    >Are you sure you want to delete <b>{{ task.title }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteTaskDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteTask" />
            </template>
        </Dialog>
    </div>
</template>
