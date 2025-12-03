<script setup>

import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import useUserProfileStore from "../../application/user-profile.service.js";
import useIamStore from "../../../iam/application/iam.service.js";
import {onMounted} from "vue";

const {t}=useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useUserProfileStore();
const iamStore = useIamStore();
const {users, usersLoaded, errors, fetchUsers, deleteUser}=store;

onMounted(()=>{
  if (!usersLoaded) fetchUsers();
  console.log(users);
});

const navigateToNew = () => {
  router.push({name:'user-profile-user-new'});
}

const navigateEdit = (id) => {
  console.log(id);
  router.push({name:'user-profile-user-edit', params: {id} });
};

const confirmDelete = (user) => {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
    header: 'Deleting User',
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteUser(user); },
  });
};

function loginAsUser(user) {
  iamStore.login(user);
  alert(`Logged in as: ${user.username}`);
  router.push({ name: "laboratoryMngmt-laboratories" });
}

</script>

<template>
  <div class="p-4 users-page">
    <h1>{{ t('user-profile.title') }}</h1>

    <div v-if="iamStore.currentUser" class="mb-4 p-3 bg-blue-400 rounded">
      <strong>{{ t('user-profile.current') }}:</strong> {{ iamStore.currentUser.username }} ({{ iamStore.currentUser.fullName }})
      <pv-button label="Logout" severity="secondary" size="small" @click="iamStore.logout()" class="ml-3" />
    </div>

    <div class="actions-row mb-3">
      <pv-button :label="t('user-profile.new-user')" icon="pi pi-plus" @click="navigateToNew" />
    </div>

    <pv-data-table
        :value="users"
        :loading="!usersLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="8"
        :rows-per-page-options="[5,8,10,20]"
        class="users-table"
    >
      <pv-column field="id" header="ID" sortable />
      <pv-column field="userName" :header="t('user-profile.username')" sortable />
      <pv-column field="fullName" :header="t('user-profile.fullname')" />
      <pv-column field="email" header="Email" />
      <pv-column field="role" :header="t('user-profile.role')" />
      <pv-column field="organization" :header="t('user-profile.organization')" />
      <pv-column :header="t('user-profile.action')" style="width: 140px;">
        <template #body="slotProps">
          <pv-button 
            icon="pi pi-sign-in" 
            text 
            @click="loginAsUser(slotProps.data)" 
            :title="t('user-profile.login')"
          />
          <pv-button
              icon="pi pi-pencil"
              text
              rounded
              @click="navigateEdit(slotProps.data.id)"
              :title="t('user-profile.edit')"
          />
          <pv-button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="confirmDelete(slotProps.data)"
              :title="t('user-profile.delete')"
          />
        </template>
      </pv-column>
    </pv-data-table>

    <div v-if="errors && errors.length" class="errors mt-3">
      <strong>Errors occurred:</strong>
      <ul>
        <li v-for="(e, idx) in errors" :key="idx">{{ e.message || e }}</li>
      </ul>
    </div>

    <pv-confirm-dialog />
  </div>
</template>

<style scoped>

</style>