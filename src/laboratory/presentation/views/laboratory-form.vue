<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useLaboratoryMngmtStore from "../../application/laboratoryMngmt.store.js";
import useAuthStore from "../../../iam/application/iam.store.js";

import { computed, onMounted, ref } from "vue";
import { Laboratory } from "../../domain/model/laboratory.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useLaboratoryMngmtStore();
const authStore = useAuthStore();
const { errors, addLaboratory, updateLaboratory, fetchLaboratories, getLaboratoryById } = store;

const form = ref({
  name: '',
  address: '',
  phone: '',
  capacity: '',
  labResponsibleId: ''
});

const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  // ✅ Verificar si laboratories está definido y tiene length
  if (!store.laboratories || store.laboratories.length === 0) {
    await fetchLaboratories();
  }
  
  if (isEdit.value) {
    const laboratory = getLaboratoryById(parseInt(route.params.id));
    if (laboratory) {
      form.value.name = laboratory.name;
      form.value.address = laboratory.address;
      form.value.phone = laboratory.phone;
      form.value.capacity = laboratory.capacity;
      form.value.labResponsibleId = laboratory.labResponsibleId;
    } else {
      router.push({ name: 'laboratoryMngmt-laboratories' });
    }
  }
});

const saveLaboratory = async () => {
  const laboratory = new Laboratory({
    id: isEdit.value ? parseInt(route.params.id) : null,
    name: form.value.name,
    address: form.value.address,
    phone: form.value.phone,
    capacity: form.value.capacity,
    registrationDate: new Date().toISOString(),
    labResponsibleId: form.value.labResponsibleId,
    adminUserId: authStore.currentUserId,
    memberUserIds: form.value.labResponsibleId ? [parseInt(form.value.labResponsibleId)] : []
  });

  try {
    if (isEdit.value) {
      await updateLaboratory(laboratory);
    } else {
      await addLaboratory(laboratory);
    }

    // ✅ Esperar un poco antes de navegar
    await new Promise(resolve => setTimeout(resolve, 100));
    
    navigateBack();
  } catch (error) {
    console.error("Error saving laboratory:", error);
  }
};

const navigateBack = () => {
  router.push({ name: 'laboratoryMngmt-laboratories' });
}
</script>

<template>
  <div class="p-4 laboratory-form">
    <h1 class="form-title">
      {{ isEdit ? "Edit Laboratory" : "New Laboratory" }}
    </h1>

    <div v-if="authStore.isSignedIn" class="mb-4 p-3 border-round-md surface-card border-1 surface-border flex flex-column gap-2 shadow-1">
      <span class="text-700">
        <strong>Creating as:</strong> {{ authStore.currentUsername }}
      </span>
      <small class="text-500">You will be the administrator of this laboratory</small>
    </div>

    <form @submit.prevent="saveLaboratory" class="form-grid">
      <div class="field">
        <label for="name">Name</label>
        <pv-input-text id="name" v-model="form.name" required class="w-full" autocomplete="organization" />
      </div>

      <div class="field">
        <label for="address">Address</label>
        <pv-input-text id="address" v-model="form.address" required class="w-full" autocomplete="street-address" />
      </div>

      <div class="field">
        <label for="phone">Phone</label>
        <pv-input-text id="phone" v-model="form.phone" required class="w-full" autocomplete="tel" />
      </div>

      <div class="field">
        <label for="capacity">Capacity</label>
        <pv-input-number id="capacity" v-model="form.capacity" required class="w-full" />
      </div>

      <div class="field">
        <label for="labResponsibleId">Add Member User ID (Optional)</label>
        <pv-input-number 
          id="labResponsibleId" 
          v-model="form.labResponsibleId" 
          class="w-full"
          placeholder="Leave empty or add a user ID to add as member"
        />
        <small>Enter a user ID to add them as a member of this laboratory</small>
      </div>

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
.laboratory-form {
  background: var(--surface-card);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--surface-border);
}

.form-grid {
  display: grid;
  gap: 1rem;
  max-width: 600px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>