<script setup>
  import {useI18n} from "vue-i18n";
  import {useRoute, useRouter} from "vue-router";
  import useLaboratoryMngmtStore from "../../application/laboratoryMngmt.store.js";

  import {computed, onMounted, ref} from "vue";
  import {LabResponsible} from "../../domain/model/labResponsible.js";

  const {t} =useI18n();
  const route= useRoute();
  const router = useRouter();
  const store = useLaboratoryMngmtStore();
  const {errors, labResponsibles, addLabResponsible, updateLabResponsible, fetchLabResponsibles}=store;
  const form= ref({userid:'', accessLevel:''});
  const isEdit = computed(()=>!!route.params.id);

  onMounted(()=>{
    if (!labResponsibles.length) fetchLabResponsibles();
    if (isEdit.value){
      const labResponsible =getLabResponsibleById(route.params.id);
      if(labResponsible){
        form.value.userid=labResponsible.userid;
        form.value.accessLevel=labResponsible.accessLevel;
      } else router.push({name:'laboratoryMngmt-labResponsibles'});
    }
  });

  function getLabResponsibleById(id){
    return store.getLabResponsibleById(id);
  }

  const saveLabResponsible = ()=>{
    const labResponsible = new LabResponsible({
      id: isEdit.value ? route.params.id : null,
      userid: form.value.userid,
      accessLevel: form.value.accessLevel
    });
    if(isEdit.value) updateLabResponsible(labResponsible); else addLabResponsible(labResponsible);
    navigateBack();
  };

  const navigateBack = () => {
    router.push({name: 'laboratoryMngmt-labResponsibles'});
  }

</script>

<template>
  <div class="p-4 labResponsible-form">
    <h1 class="form-title">
      {{ isEdit ? "Edit Lab Responsible" : "New Lab Responsible" }}
    </h1>

    <form @submit.prevent="saveLabResponsible" class="form-grid">
      <div class="field">
        <label for="userid">User Id</label>
        <pv-input-text id="userid" v-model="form.userid" required class="w-full" />
      </div>

      <div class="field">
        <label for="accessLevel">Access Level</label>
        <pv-input-text id="accessLevel" v-model="form.accessLevel" required class="w-full" />
      </div>

      <!-- Actions -->
      <div class="field actions">
        <pv-button type="submit" label="Save" icon="pi pi-save" />
        <pv-button label="Cancel" severity="secondary" class="ml-2" @click="navigateBack" />
      </div>
    </form>

    <div v-if="errors && errors.length" class="errors mt-3">
      <strong>Errors occurred:</strong>
      <ul>
        <li v-for="(e, idx) in errors" :key="idx">{{ e.message || e }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>