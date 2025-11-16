<script setup>

  import {useI18n} from "vue-i18n";
  import {useRouter} from "vue-router";
  import {useConfirm} from "primevue";
  import {onMounted, watch} from "vue";
  import useLaboratoryMngmtStore from "../../application/laboratoryMngmt.store.js";
  import useAuthStore from "../../../iam/application/auth.store.js";

  const {t}=useI18n();
  const router = useRouter();
  const confirm = useConfirm();
  const store = useLaboratoryMngmtStore();
  const authStore = useAuthStore();
  const {userLaboratories, laboratoriesLoaded, fetchLaboratories,
    deleteLaboratory, isLabAdmin}=store;

  onMounted(()=>{
    if (!authStore.isAuthenticated) {
      alert("Please login first");
      router.push({ name: 'users-list' });
      return;
    }
    loadData();
  });

  async function loadData() {
    await fetchLaboratories();
    console.log('Laboratories loaded:', userLaboratories.value);
    console.log('Current user:', authStore.currentUser);
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
      message: 'Are you sure you want to delete this laboratory?',
      header: 'Deleting Laboratory',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
      try {
        await deleteLaboratory(labId);
        console.log('Laboratory deleted successfully');
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
    <h1 class="text-2xl font-bold mb-4">My Laboratories</h1>
    
    <div v-if="authStore.currentUser" class="mb-4 p-3 bg-blue-400 rounded">
      <strong>Logged in as:</strong> {{ authStore.currentUser.userName }} ({{ authStore.currentUser.fullName }})
    </div>
    
    <div class="flex justify-between items-center mb-4">
      <pv-button label="New Laboratory" icon="pi pi-plus" @click="navigateToNew" />
    </div>

    <div v-if="userLaboratories.length === 0">
      <p>No laboratories found. You are not admin or member of any laboratory yet.</p>
    </div>

    <pv-data-table :value="userLaboratories" paginator :rows="10" striped-rows>
      <pv-column field="id" header="ID" sortable />
      <pv-column field="name" header="Name" sortable />
      <pv-column field="address" header="Address" />
      <pv-column field="phone" header="Phone" />
      <pv-column field="capacity" header="Capacity" />

      <pv-column header="Admin ID">
        <template #body="slotProps">
          {{ slotProps.data.adminUserId }}
        </template>
      </pv-column>
      
      <pv-column header="Your Role">
        <template #body="slotProps">
          <span v-if="!slotProps.data.adminUserId">No Admin</span>
          <pv-tag 
            :value="isLabAdmin(slotProps.data.id) ? 'Admin' : 'Member'" 
            :severity="isLabAdmin(slotProps.data.id) ? 'success' : 'info'" 
          />
        </template>
      </pv-column>
      
      <pv-column header="Actions">
        <template #body="slotProps">
          <pv-button 
            v-if="isLabAdmin(slotProps.data.id)"
            icon="pi pi-pencil" 
            text 
            @click="navigateEdit(slotProps.data.id)" 
            title="Edit" 
          />
          
          <pv-button 
            v-if="isLabAdmin(slotProps.data.id)"
            icon="pi pi-trash" 
            text 
            severity="danger" 
            @click="confirmDelete(slotProps.data.id)" 
            title="Delete" 
          />
          
          <pv-button 
            icon="pi pi-box" 
            text 
            severity="help"
            @click="router.push({ name: 'inventory-list', params: { labId: slotProps.data.id } })" 
            title="Ver Inventario" 
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<style scoped>

</style>