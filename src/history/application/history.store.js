import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { HistoryApi } from "../infrastructure/history-api.js";
import { HistoryAssembler } from "../infrastructure/history.assembler.js";
import useIamStore from "../../iam/application/iam.service.js";

/** Store to manage history entries. */
const historyApi = new HistoryApi();

/**
 * Pinia store for managing history entries.
 * Handles fetching and adding history entries.
 * @returns {Object} The store object with state and actions.
 */
const useHistoryStore = defineStore("historyStore", () => {
  /** @type {ref} Array of history entries */
  const entries = ref([]);
  /** @type {ref} Array of errors */
  const errors = ref([]);
  /** @type {ref} Boolean indicating if entries are loaded */
  const entriesLoaded = ref(false);

  /** Get IAM store instance */
  const iamStore = useIamStore();

  /** Filter history by laboratory ID
   * @return {Function} Function that takes labId and returns filtered entries
  */
  const getHistoryByLaboratory = computed(() => (labId) => {
    return entries.value.filter(entry => entry.laboratoryId === labId);
  });

  /** Filter history by item ID
   * @return {Function} Function that takes itemId and returns filtered entries
  */
  const getHistoryByItem = computed(() => (itemId) => {
    return entries.value.filter(entry => entry.inventoryItemId === itemId);
  });

  /** Fetch all history entries, optionally filtered by laboratory ID
   * @param {number|null} laboratoryId - Laboratory ID to filter by (optional)
   * @return {Promise<void>}
  */
  async function fetchHistory(laboratoryId = null) {
    try {
      const response = await historyApi.getAll();
      let allEntries = HistoryAssembler.toEntityFromResponse(response);
      
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

  /** Add a new history entry
   * @param {Object} entry - The history entry to add
   * @return {Promise<Object>} The newly added history entry
   * @throws Will throw an error if the addition fails
  */
  async function addHistoryEntry(entry) {
    try {
      if (iamStore.currentUser) {
        entry.userId = iamStore.currentUser.id;
        entry.username = iamStore.currentUser.username;
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