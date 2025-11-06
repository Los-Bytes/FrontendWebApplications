<script setup>

  import {useI18n} from "vue-i18n";
  import {useRouter} from "vue-router";
  import {useConfirm} from "primevue";
  import {onMounted} from "vue";
  import useLaboratoryMngmtStore from "../../application/laboratoryMngmt.store.js";

  const {t}=useI18n();
  const router = useRouter();
  const confirm = useConfirm();
  const store = useLaboratoryMngmtStore();
  const {laboratories, laboratoriesLoaded, errors, fetchLaboratories,
    deleteLaboratories}=store;
  onMounted(()=>{
    if (!laboratoriesLoaded) fetchLaboratories();
    console.log(laboratories);
  });
  const navigateToNew = () => {
    router.push({name:'laboratoryMngmt-laboratory-new'});
  }
  const navigateEdit = (id) => {
    console.log(id);
    router.push({name:'laboratoryMngmt-laboratory-edit', params: {id} });
  };
  const confirmDelete = (laboratory) => {
    confirm.require({
      message: 'Are you sure you want to delete this laboratory?',
      header: 'Are you sure you want to delete this laboratory?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { deleteLaboratories(laboratory); },
    });
  };

</script>

<template>

  <div class="p-4 laboratories-page">
    <h1>Laboratories</h1>

    <div class="actions-row mb-3">
      <pv-button label="New Laboratories" icon="pi pi-plus" @click="navigateToNew" />
    </div>

    <pv-data-table
        :value="laboratories"
        :loading="!laboratoriesLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="8"
        :rows-per-page-options="[5,8,10,20]"
        class="laboratories-table"
    >

      <pv-column field="id" header="ID" sortable />
      <pv-column field="name" header="Name" sortable />
      <pv-column field="address" header="Address" />
      <pv-column field="phone" header="Phone" />
      <pv-column field="capacity" header="Capacity" />
      <pv-column field="registrationDate" header="Registration Date" />
      <pv-column field="labResponsibleId" header="Lab Responsible ID" />

      <pv-column header="Actions" style="width: 140px;">
        <template #body="slotProps">
          <pv-button
              icon="pi pi-pencil"
              text
              rounded
              @click="navigateEdit(slotProps.data.id)"
              title="Edit"
          />
          <pv-button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              @click="confirmDelete(slotProps.data)"
              title="Delete"
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