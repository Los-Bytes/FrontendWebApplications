<script setup>
import { useI18n } from "vue-i18n";
import { onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useHistoryStore from "../../application/history.store.js";
import useLaboratoryMngmtStore from "../../../laboratory/application/laboratory.service.js";
import useIamStore from "../../../iam/application/iam.service.js";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const historyStore = useHistoryStore();
const labStore = useLaboratoryMngmtStore();
const iamStore = useIamStore();

/**
 * Computed property for checking if history entries are loaded
 * and function to fetch history entries for the current laboratory.
 * Also computes the current laboratory and filters history entries
 * for that laboratory.
 */
const {entriesLoaded, fetchHistory } = historyStore;

/**
 * Computed property for the current laboratory ID from route params.
 */
const laboratoryId = computed(() => parseInt(route.params.labId));

/**
 * Computed property for the current laboratory based on the ID.
 */
const currentLab = computed(() => {
  return labStore.getLaboratoryById(laboratoryId.value);
});

/**
 * Computed property for filtering history entries by the current laboratory ID.
 * Handles cases where entries may be undefined or not an array.
 * Returns an empty array in such cases.
 */
const labHistory = computed(() => {
  if (!historyStore.entries || !Array.isArray(historyStore.entries)) {
    return [];
  }
  return historyStore.entries.filter(entry => entry.laboratoryId === laboratoryId.value);
});

/**
 * Lifecycle hook to perform actions on component mount:
 * - Check if the user is signed in; if not, redirect to sign-in page.
 * - Fetch laboratories if not already loaded.
 * - Check if the user has access to the current laboratory; if not, redirect to laboratories management page.
 * - Fetch history entries for the current laboratory.
 * Logs the loaded history entries to the console.
 * Handles edge cases for user authentication and laboratory access.
 */
onMounted(async () => {
  if (!iamStore.isSignedIn) {
    alert("Please login first");
    router.push({ name: 'iam-sign-in' });
    return;
  }

  if (!labStore.laboratoriesLoaded.value) {
    await labStore.fetchLaboratories();
  }

  if (labStore.hasLabAccess && !labStore.hasLabAccess(laboratoryId.value)) {
    alert("You don't have access to this laboratory");
    router.push({ name: 'laboratoryMngmt-laboratories' });
    return;
  }

  await fetchHistory(laboratoryId.value);
  
  console.log('📊 Historial cargado:');
  console.log('  - Total entries:', historyStore.entries);
  console.log('  - Lab history:', labHistory.value);
});

/**
 * Function to navigate back to the inventory list of the current laboratory.
 */
function navigateBack() {
  router.push({ 
    name: "inventory-list", 
    params: { labId: laboratoryId.value } 
  });
}

/**
 * Helper function to format timestamps into a readable date string.
 * @param {number} timestamp - The timestamp to format.
 * @returns {string} Formatted date string.
 * Uses Spanish locale for formatting.
 */
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Helper function to get the severity level for a given action.
 * @param {string} action - The action type.
 * @returns {string} Severity level for the action.
 * Maps action types to severity levels for UI display.
 */
function getActionSeverity(action) {
  const severityMap = {
    'created': 'success',
    'updated': 'info',
    'sold': 'warning',
    'used': 'secondary',
    'returned': 'success'
  };
  return severityMap[action] || 'info';
}

/**
 * Helper function to translate action types to Spanish.
 * @param {string} action - The action type.
 * @returns {string} Translated action string.
 */
function translateAction(action) {
  const translations = {
    'created': 'Creado',
    'updated': 'Actualizado',
    'sold': 'Vendido',
    'used': 'Usado en prácticas',
    'returned': 'Retornado'
  };
  return translations[action] || action;
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-2">{{ t('history.title') }}</h1>
    
    <div v-if="currentLab" class="mb-4 p-3 bg-blue-400 rounded">
      <strong>{{ t('history.lab') }}:</strong> {{ currentLab.name }}
    </div>

    <div class="flex justify-between items-center mb-4">
      <pv-button :label="t('history.return')" icon="pi pi-arrow-left" @click="navigateBack" />
    </div>

    <div v-if="!entriesLoaded">
      <p>{{ t('history.loading') }}</p>
    </div>

    <div v-else-if="labHistory.length === 0">
      <p>{{ t('history.not-hist') }}</p>
    </div>

    <pv-data-table 
      v-if="entriesLoaded && labHistory.length > 0"
      :value="labHistory" 
      paginator 
      :rows="10" 
      striped-rows
      sortField="timestamp"
      :sortOrder="-1"
    >
      <pv-column field="timestamp" :header="t('history.date')" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.timestamp) }}
        </template>
      </pv-column>

      <pv-column field="action" :header="t('history.status')" sortable>
        <template #body="slotProps">
          <pv-tag 
            :value="translateAction(slotProps.data.action)" 
            :severity="getActionSeverity(slotProps.data.action)"
          />
        </template>
      </pv-column>

      <pv-column field="description" :header="t('history.description')" />

      <pv-column field="previousStatus" :header="t('history.previous')" />
      
      <pv-column field="newStatus" :header="t('history.new')" />

      <pv-column field="quantity" :header="t('history.quantity')" />

      <pv-column field="username" :header="t('history.user')" />
    </pv-data-table>
  </div>
</template>

<style scoped>
.p-4 {
  padding: 1.5rem;
}
</style>