<script setup>

import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue/useconfirm";
import useUserProfileStore from "../../application/user-profile.store.js";
import useAuthStore from "../../../iam/application/iam.store.js";
import {onMounted} from "vue";

const {t}=useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useUserProfileStore();
const authStore = useAuthStore();
const {users, usersLoaded, errors, fetchUsers, deleteUser}=store;

onMounted(()=>{
  if (!authStore.isSignedIn) {
    alert(t('auth.loginFirst'));
    router.push({ name: 'iam-sign-in' });
    return;
  }
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
    message: t('users.dialogs.deleteConfirm'),
    header: t('users.dialogs.deleteTitle'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteUser(user); },
  });
};

function loginAsUser(user) {
  authStore.login(user);
  alert(`${t('auth.loggedInAs')}: ${user.userName}`);
  router.push({ name: "laboratoryMngmt-laboratories" });
}

</script>

<template>
  <div class="p-4 users-page">
    <h1>{{ $t('users.title') }}</h1>

    <div v-if="authStore.isSignedIn" class="mb-4 p-3 border-round-md surface-card border-1 surface-border flex align-items-center gap-3 shadow-1">
      <i class="pi pi-user text-primary text-xl"></i>
      <span class="text-700">
        <strong>{{ $t('auth.currentUser') }}:</strong> {{ authStore.currentUsername }}
      </span>
      <pv-button :label="$t('auth.logout')" severity="secondary" size="small" @click="authStore.signOut(router)" class="ml-auto" />
    </div>

    <div class="actions-row mb-3">
      <pv-button :label="$t('users.newUser')" icon="pi pi-plus" @click="navigateToNew" />
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
      <pv-column field="id" :header="$t('users.headers.id')" sortable />
      <pv-column field="userName" :header="$t('users.headers.username')" sortable />
      <pv-column field="fullName" :header="$t('users.headers.fullName')" />
      <pv-column field="email" :header="$t('users.headers.email')" />
      <pv-column field="role" :header="$t('users.headers.role')" />
      <pv-column field="organization" :header="$t('users.headers.organization')" />
      <pv-column :header="$t('users.headers.actions')" style="width: 140px;">
        <template #body="slotProps">
          <pv-button 
            icon="pi pi-sign-in" 
            text 
            @click="loginAsUser(slotProps.data)" 
            :title="$t('users.actions.loginAs')" 
          />
          <pv-button
              icon="pi pi-pencil"
              text
              rounded
              @click="navigateEdit(slotProps.data.id)"
              :title="$t('users.actions.edit')"
          />
          <pv-button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="confirmDelete(slotProps.data)"
              :title="$t('users.actions.delete')"
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