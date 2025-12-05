<script setup>
  import {useI18n} from "vue-i18n";
  import {useRouter} from "vue-router";
  import {useConfirm} from "primevue";
  import {onMounted} from "vue";
  import useLaboratoryMngmtStore from "../../application/laboratory.service.js";

  const {t}=useI18n();
  const router = useRouter();
  const confirm = useConfirm();
  const store = useLaboratoryMngmtStore();
  const {labResponsibles, labResponsiblesLoaded, errors, fetchLabResponsibles,
    deleteLabResponsible}=store;
  
  /** Load lab responsibles data on component mount. */
  onMounted(()=>{
    if (!labResponsiblesLoaded) fetchLabResponsibles();
    console.log(labResponsibles);
  });
  /** Navigate to the new lab responsible form view. */
  const navigateToNew = () => {
    router.push({name:'laboratoryMngmt-labResponsible-new'});
  }
  /** Navigate to the edit lab responsible form view. */
  const navigateEdit = (id) => {
    console.log(id);
    router.push({name:'laboratoryMngmt-labResponsible-edit', params: {id} });
  };
  /** Confirm and delete a lab responsible. */
  const confirmDelete = (labResponsible) => {
    confirm.require({
      message: 'Are you sure you want to delete this lab responsible?',
      header: 'Are you sure you want to delete this lab responsible?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { deleteLabResponsible(labResponsible); },
    });
  };

</script>

<template>
  <div class="p-4 labResponsibles-page">
    <h1>Lab Responsibles</h1>

    <div class="actions-row mb-3">
      <pv-button label="New Lab Responsible" icon="pi pi-plus" @click="navigateToNew" />
    </div>

    <pv-data-table
        :value="labResponsibles"
        :loading="!labResponsiblesLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="8"
        :rows-per-page-options="[5,8,10,20]"
        class="labResponsibles-table"
    >
      <pv-column field="id" header="ID" sortable />
      <pv-column field="userid" header="User Id" sortable />
      <pv-column field="accessLevel" header="Access Level" />
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