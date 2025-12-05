import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { HistoryApi } from "../infrastructure/history-api.js";
import { HistoryAssembler } from "../infrastructure/history.assembler.js";
import useAuthStore from "../../iam/application/iam.store.js";

const historyApi = new HistoryApi();

const useHistoryStore = defineStore("historyStore", () => {
  const entries = ref([]);
  const errors = ref([]);
  const entriesLoaded = ref(false);

  const authStore = useAuthStore();

  // Filtrar historial por laboratorio
  const getHistoryByLaboratory = computed(() => (labId) => {
    return entries.value.filter(entry => entry.laboratoryId === labId);
  });

  // Filtrar historial por item
  const getHistoryByItem = computed(() => (itemId) => {
    return entries.value.filter(entry => entry.inventoryItemId === itemId);
  });

  async function fetchHistory(laboratoryId = null) {
    try {
      const response = await historyApi.getAll();
      let allEntries = HistoryAssembler.toEntityFromResponse(response);

      // Filtrar por laboratorio si se proporciona
      if (laboratoryId) {
        allEntries = allEntries.filter(entry => entry.laboratoryId === laboratoryId);
      }

      entries.value = allEntries;
      entriesLoaded.value = true;
    } catch (e) {
      console.error("Error fetching history:", e);
      errors.value.push(e);
      entriesLoaded.value = true;
    }
  }

  async function addHistoryEntry(entry) {
    try {
      // Agregar usuario actual
      if (authStore.isSignedIn) {
        entry.userId = authStore.currentUserId;
        entry.userName = authStore.currentUsername;
      }
      entry.timestamp = new Date().toISOString();

      const response = await historyApi.create(entry);
      const newEntry = HistoryAssembler.toEntityFromResource(response.data);
      entries.value.push(newEntry);
      return newEntry;
    } catch (e) {
      console.error("Error adding history entry:", e);
      errors.value.push(e);
      throw e;
    }
  }

  return {
    entries,
    errors,
    entriesLoaded,
    getHistoryByLaboratory,
    getHistoryByItem,
    fetchHistory,
    addHistoryEntry
  };
});

export default useHistoryStore;