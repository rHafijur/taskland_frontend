<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { RoleService } from '../../service/RoleService';
import { UserService } from '../../service/UserService';

onMounted(() => {
    UserService.getUsers().then((data) => {
        users.value = data.data.data;
    });
    RoleService.getRoles().then((data) => {
        roles.value = data.data.data;
    });
});

const toast = useToast();
const dt = ref();
const roles = ref([]);
const users = ref([]);
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const user = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew() {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
    submitted.value = false;
}

function saveUser() {
    if (user.value.id == null) {
        UserService.createUser(user.value).then((res) => {
            users.value.push(res.data.data);
            userDialog.value = false;
        });
    } else {
        UserService.updateUser(user.value.id, user.value).then((res) => {
            for (var i in users.value) {
                if (users.value[i].id == user.value.id) {
                    users.value[i] = res.data.data;
                }
            }
            userDialog.value = false;
        });
    }
    submitted.value = true;
}

function editUser(usr) {
    user.value = { ...usr };

    userDialog.value = true;
}

function confirmDeleteUser(usr) {
    user.value = usr;
    deleteUserDialog.value = true;
}

function deleteUser() {
    UserService.deleteUser(user.value.id).then((res) => {
        users.value = users.value.filter((u) => u.id != user.value.id);
    });
    deleteUserDialog.value = false;
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
                :value="users"
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
                        <h4 class="m-0">Manage Users</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>
                <Column field="role" header="Role" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" :header="user?.id == null ? 'Create New User' : 'Edit User'" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus :invalid="submitted && !user.name" fluid />
                    <small v-if="submitted && !user.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model.trim="user.email" required="true" autofocus :invalid="submitted && !user.email" fluid />
                    <small v-if="submitted && !user.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="role" class="block font-bold mb-3">Role</label>
                    <Select :options="roles" optionLabel="name" optionValue="id" placeholder="Select a Role" v-model="user.role_id" fluid></Select>
                    <small v-if="submitted && !user.role_id" class="text-red-500">Role is required.</small>
                </div>
                <div>
                    <label for="password" class="block font-bold mb-3">Password</label>
                    <InputText type="password" id="password" v-model.trim="user.password" required="true" autofocus :invalid="submitted && !user.password" fluid />
                    <small v-if="submitted && !user.password && !user.id" class="text-red-500">Password is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="user"
                    >Are you sure you want to delete <b>{{ user.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteUserDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteUser" />
            </template>
        </Dialog>
    </div>
</template>
