<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useLaboratoryMngmtStore from "../../application/laboratory.service.js";
import useIamStore from "../../../iam/application/iam.service.js"; // ✅ ACTUALIZADO
import useSubscriptionStore from "../../../subscription/application/subscription.service.js";
import { computed, onMounted, ref } from "vue";
import { Laboratory } from "../../domain/model/laboratory.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useLaboratoryMngmtStore();
const iamStore = useIamStore(); // ✅ ACTUALIZADO
const subscriptionStore = useSubscriptionStore();

const { errors, addLaboratory, updateLaboratory, fetchLaboratories, getLaboratoryById } = store;
const { currentLimits, canAddMembers, fetchSubscriptions, fetchPlans } = subscriptionStore;

const form = ref({
  name: '',
  address: '',
  phone: '',
  capacity: '',
  labResponsibleId: ''
});

const isEdit = computed(() => !!route.params.id);

const canCreateLab = computed(() => {
  if (isEdit.value) return true;
  const userLabs = store.userLaboratories.value;
  const currentPlan = subscriptionStore.currentPlan.value;
  if (currentPlan && currentPlan.name === 'Max') return true;
  return true;
});

onMounted(async () => {
  if (!subscriptionStore.plansLoaded.value) {
    await fetchPlans();
  }
  if (!subscriptionStore.subscriptionsLoaded.value) {
    await fetchSubscriptions();
  }

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
  if (!canCreateLab.value) {
    alert("You have reached the maximum number of laboratories for your current plan. Please upgrade your subscription.");
    return;
  }

  if (form.value.labResponsibleId) {
    const memberCount = 1;
    if (!canAddMembers(memberCount)) {
      alert(`Your current plan allows up to ${currentLimits.value.maxMembers} members per laboratory. Please upgrade to add more members.`);
      return;
    }
  }

  const laboratory = new Laboratory({
    id: isEdit.value ? parseInt(route.params.id) : null,
    name: form.value.name,
    address: form.value.address,
    phone: form.value.phone,
    capacity: form.value.capacity,
    registrationDate: new Date().toISOString(),
    labResponsibleId: form.value.labResponsibleId,
    adminUserId: iamStore.currentUser?.id, // ✅ ACTUALIZADO
    memberUserIds: form.value.labResponsibleId ? [parseInt(form.value.labResponsibleId)] : []
  });

  try {
    if (isEdit.value) {
      await updateLaboratory(laboratory);
    } else {
      await addLaboratory(laboratory);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    navigateBack();
  } catch (error) {
    console.error("Error saving laboratory:", error);
    alert("Error saving laboratory. Please try again.");
  }
};

const navigateBack = () => {
  router.push({ name: 'laboratoryMngmt-laboratories' });
}
</script>

<template>
  <div class="p-4 laboratory-form">
    <h1 class="form-title">
      {{ isEdit ? t('laboratory.edit-lab') : t('laboratory.new-lab') }}
    </h1>

    <div v-if="iamStore.currentUser" class="mb-4 p-3 bg-blue-400 rounded border border-solid border-white">
      <strong>{{ t('laboratory.create-as') }}:</strong> {{ iamStore.currentUser.username }} ({{ iamStore.currentUser.fullName }})
      <br>
      <strong>{{ t('laboratory.current-plan') }}:</strong> {{ subscriptionStore.currentUserSubscription?.planType || 'Free' }}
      <br>
      <small>{{ t('laboratory.message') }}</small>
    </div>

    <div class="mb-4 p-3 bg-yellow-500 rounded border border-solid border-yellow-100">
      <h3 class="font-bold mb-2">
        <i class="pi pi-info-circle"></i>
        {{ t('laboratory.limit') }}
      </h3>
      <p><strong>{{ t('laboratory.max-member') }}:</strong> 
        <span v-if="currentLimits.maxMembers === -1">{{ t('laboratory.unlimited') }}</span>
        <span v-else> {{ t('laboratory.up-to') }} {{ currentLimits.maxMembers }}</span>
      </p>
      <p><strong>{{ t('laboratory.max-item') }}:</strong>
        <span v-if="currentLimits.maxInventoryItems === -1">{{ t('laboratory.unlimited') }}</span>
        <span v-else> {{ t('laboratory.up-to') }} {{ currentLimits.maxInventoryItems }}</span>
      </p>
    </div>

    <form @submit.prevent="saveLaboratory" class="form-grid">
      <div class="field">
        <label for="name">{{ t('laboratory.name') }}</label>
        <pv-input-text id="name" v-model="form.name" required class="w-full" autocomplete="organization" />
      </div>

      <div class="field">
        <label for="address">{{ t('laboratory.address') }}</label>
        <pv-input-text id="address" v-model="form.address" required class="w-full" autocomplete="street-address" />
      </div>

      <div class="field">
        <label for="phone">{{ t('laboratory.phone') }}</label>
        <pv-input-text id="phone" v-model="form.phone" required class="w-full" autocomplete="tel" />
      </div>

      <div class="field">
        <label for="capacity">{{ t('laboratory.capacity') }}</label>
        <pv-input-number id="capacity" v-model="form.capacity" required class="w-full" />
      </div>

      <div class="field">
        <label for="labResponsibleId">{{ t('laboratory.add-member') }}</label>
        <pv-input-number 
          id="labResponsibleId" 
          v-model="form.labResponsibleId" 
          class="w-full"
          :placeholder="t('laboratory.placeholder')"
        />
        <small>{{ t('laboratory.add-message') }}</small>
        <small v-if="form.labResponsibleId && !canAddMembers(1)" class="text-red-600">
          ⚠️ Your plan only allows {{ currentLimits.maxMembers }} members. Upgrade to add more.
        </small>
      </div>

      <div class="field actions">
        <pv-button type="submit" :label="t('laboratory.save')" icon="pi pi-save" />
        <pv-button :label="t('laboratory.cancel')" severity="secondary" class="ml-2" @click="navigateBack" />
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
  background: #51a2fd;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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