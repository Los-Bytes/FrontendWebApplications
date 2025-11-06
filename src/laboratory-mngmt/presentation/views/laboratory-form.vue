<script setup>

  import {useI18n} from "vue-i18n";
  import {useRoute, useRouter} from "vue-router";
  import useLaboratoryMngmtStore from "../../application/laboratoryMngmt.store.js";

  import {computed, onMounted, ref} from "vue";
  import {Laboratory} from "../../domain/model/laboratory.js";

  const {t} =useI18n();
  const route= useRoute();
  const router = useRouter();
  const store = useLaboratoryMngmtStore();
  const {errors, laboratories, addLaboratory, updateLaboratory, fetchLabLaboratories}=store;

  const form= ref({name:'', address:'',phone:'', capacity:'', registrationDate:'', labResponsibleId:''});
  const isEdit = computed(()=>!!route.params.id);

  onMounted(()=>{
    if (!laboratories.length) fetchLabLaboratories();
    if (isEdit.value){
      const laboratory =getLaboratoryById(route.params.id);
      if(laboratory){
        form.value.name=laboratory.name;
        form.value.address=laboratory.address;
        form.value.phone=laboratory.phone;
        form.value.capacity=laboratory.capacity;
        form.value.registrationDate=laboratory.registrationDate;
        form.value.labResponsibleId=laboratory.labResponsibleId;
      } else router.push({name:'laboratoryMngmt-laboratories'});
    }
  });

  function getLaboratoryById(id){
    return store.getLaboratoryById(id);
  }

  const saveLaboratory = ()=>{
    const laboratory = new Laboratory({
      id: isEdit.value ? route.params.id : null,
      name: form.value.name,
      address: form.value.address,
      phone: form.value.phone,
      capacity: form.value.capacity,
      registrationDate: form.value.registrationDate,
      labResponsibleId: form.value.labResponsibleId
    });
    if(isEdit.value) updateLaboratory(laboratory); else addLaboratory(laboratory);
    navigateBack();
  };

  const navigateBack = () => {
    router.push({name: 'laboratoryMngmt-laboratories'});
  }

</script>

<template>

  <div class="p-4 laboratory-form">
    <h1 class="form-title">
      {{ isEdit ? "Edit Laboratory" : "New Laboratory" }}
    </h1>

    <form @submit.prevent="saveLaboratory" class="form-grid">
      <div class="field">
        <label for="name">Name</label>
        <pv-input-text id="name" v-model="form.name" required class="w-full" />
      </div>

      <div class="field">
        <label for="address">Adress</label>
        <pv-input-text id="address" v-model="form.address" required class="w-full" />
      </div>

      <div class="field">
        <label for="phone">Phone</label>
        <pv-input-text id="phone" v-model="form.phone" required class="w-full" />
      </div>
      <div class="field">
        <label for="capacity">Capacity</label>
        <pv-input-text id="capacity" v-model="form.capacity" required class="w-full" />
      </div>
      <div class="field">
        <label for="registrationDate">Registration Date</label>
        <pv-input-text id="registrationDate" v-model="form.registrationDate" required class="w-full" />
      </div>
      <div class="field">
        <label for="labResponsibleId">Lab Responsible ID</label>
        <pv-input-text id="labResponsibleId" v-model="form.labResponsibleId" required class="w-full" />
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