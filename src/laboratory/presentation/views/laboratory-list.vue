<script setup>

  import {useI18n} from "vue-i18n";
  import {useRouter} from "vue-router";
  import {useConfirm} from "primevue";
  import {onMounted, watch} from "vue";
  import useLaboratoryMngmtStore from "../../application/laboratoryMngmt.store.js";
  import useAuthStore from "../../../iam/application/iam.store.js";

  const {t}=useI18n();
  const router = useRouter();
  const confirm = useConfirm();
  const store = useLaboratoryMngmtStore();
  const authStore = useAuthStore();
  const {userLaboratories, laboratoriesLoaded, fetchLaboratories,
    deleteLaboratory, isLabAdmin}=store;

  onMounted(()=>{
    if (!authStore.isSignedIn) {
      alert(t('auth.loginFirst'));
      router.push({ name: 'iam-sign-in' });
      return;
    }
    loadData();
  });

  async function loadData() {
    await fetchLaboratories();
    console.log('Laboratories loaded:', userLaboratories.value);
    console.log('Current user:', authStore.currentUsername);
  }

  watch(() => router.currentRoute.value.fullPath, (newPath) => {
    if (newPath.includes('/laboratories') && !newPath.includes('/new') && !newPath.includes('/edit')) {
      loadData();
    }
  });

  const navigateToNew = () => {
    router.push({name:'laboratoryMngmt-laboratory-new'});
  };

  const navigateEdit = (id) => {
    console.log(id);
    router.push({name:'laboratoryMngmt-laboratory-edit', params: {id} });
  };

  const confirmDelete = (labId) => {
    confirm.require({
      message: t('laboratories.dialogs.deleteConfirm'),
      header: t('laboratories.dialogs.deleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
      try {
        await deleteLaboratory(labId);
        console.log(t('laboratories.dialogs.deleteSuccess'));
        await loadData();
      } catch (error) {
        console.error('Error deleting laboratory:', error);
      }
    }
    });
  };

</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ $t('laboratories.title') }}</h1>
    
    <div v-if="authStore.isSignedIn" class="mb-4 p-3 border-round-md surface-card border-1 surface-border shadow-1 text-700">
      <strong>{{ $t('auth.loggedInAs') }}:</strong> {{ authStore.currentUsername }}
    </div>
    
    <div class="flex justify-between items-center mb-4">
      <pv-button :label="$t('laboratories.newLab')" icon="pi pi-plus" @click="navigateToNew" />
    </div>

    <div v-if="userLaboratories.length === 0">
      <p>{{ $t('laboratories.noLabs') }}</p>
    </div>

    <pv-data-table :value="userLaboratories" paginator :rows="10" striped-rows>
      <pv-column field="id" :header="$t('laboratories.headers.id')" sortable />
      <pv-column field="name" :header="$t('laboratories.headers.name')" sortable />
      <pv-column field="address" :header="$t('laboratories.headers.address')" />
      <pv-column field="phone" :header="$t('laboratories.headers.phone')" />
      <pv-column field="capacity" :header="$t('laboratories.headers.capacity')" />

      <pv-column :header="$t('laboratories.headers.adminId')">
        <template #body="slotProps">
          {{ slotProps.data.adminUserId }}
        </template>
      </pv-column>
      
      <pv-column :header="$t('laboratories.headers.role')">
        <template #body="slotProps">
          <span v-if="!slotProps.data.adminUserId">{{ $t('laboratories.role.noAdmin') }}</span>
          <pv-tag 
            :value="isLabAdmin(slotProps.data.id) ? $t('laboratories.role.admin') : $t('laboratories.role.member')" 
            :severity="isLabAdmin(slotProps.data.id) ? 'success' : 'info'" 
          />
        </template>
      </pv-column>
      
      <pv-column :header="$t('laboratories.headers.actions')">
        <template #body="slotProps">
          <pv-button 
            v-if="isLabAdmin(slotProps.data.id)"
            icon="pi pi-pencil" 
            text 
            @click="navigateEdit(slotProps.data.id)" 
            :title="$t('laboratories.actions.edit')" 
          />
          
          <pv-button 
            v-if="isLabAdmin(slotProps.data.id)"
            icon="pi pi-trash" 
            text 
            severity="danger" 
            @click="confirmDelete(slotProps.data.id)" 
            :title="$t('laboratories.actions.delete')" 
          />
          
          <pv-button 
            icon="pi pi-box" 
            text 
            severity="help"
            @click="router.push({ name: 'inventory-list', params: { labId: slotProps.data.id } })" 
            :title="$t('laboratories.actions.inventory')" 
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<style scoped>

</style>