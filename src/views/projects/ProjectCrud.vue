<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { ProjectService } from '../../service/ProjectService';

onMounted(() => {
    ProjectService.getProjects().then((data) => {
        projects.value = data;
    });
});

const toast = useToast();
const dt = ref();
const roles = ref();
const projects = ref();
const projectDialog = ref(false);
const deleteProjectDialog = ref(false);
const project = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew() {
    project.value = {};
    submitted.value = false;
    projectDialog.value = true;
}

function hideDialog() {
    projectDialog.value = false;
    submitted.value = false;
}

function saveProject() {
    submitted.value = true;
}

function editProject(usr) {
    project.value = { ...usr };

    projectDialog.value = true;
}

function confirmDeleteProject(usr) {
    project.value = usr;
    deleteProjectDialog.value = true;
}

function deleteProject() {}

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
                :value="projects"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Projects</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" sortable style="min-width: 12rem"></Column>
                <Column field="title" header="Title" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProject(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProject(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="projectDialog" :style="{ width: '450px' }" :header="project?.id == null ? 'Create New Project' : 'Edit Project'" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="title" class="block font-bold mb-3">Title</label>
                    <InputText id="title" v-model.trim="project.title" required="true" autofocus :invalid="submitted && !project.title" fluid />
                    <small v-if="submitted && !project.title" class="text-red-500">Title is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProject" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProjectDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="project"
                    >Are you sure you want to delete <b>{{ project.title }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProjectDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProject" />
            </template>
        </Dialog>
    </div>
</template>
