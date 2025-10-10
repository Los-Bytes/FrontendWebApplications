import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { InventoryApi } from "../infrastructure/inventory-api.js";
import { InventoryAssembler } from "../infrastructure/inventory.assembler.js";

const inventoryApi = new InventoryApi();

const useInventoryStore = defineStore("inventoryStore", () => {
  const items = ref([]);
  const errors = ref([]);
  const itemsLoaded = ref(false);
  const itemsCount = computed(() => (itemsLoaded.value ? items.value.length : 0));

  async function fetchItems() {
    try {
      const response = await inventoryApi.getItems();
      items.value = InventoryAssembler.toEntityFromResponse(response);
      itemsLoaded.value = true;
    } catch (e) {
      errors.value.push(e);
    }
  }

  function getItemById(id) {
    const idNum = parseInt(id);
    return items.value.find((i) => i.id === idNum);
  }

  async function addItem(item) {
    try {
      const response = await inventoryApi.createItem(item);
      const newItem = InventoryAssembler.toEntityFromResource(response.data);
      items.value.push(newItem);
    } catch (e) {
      errors.value.push(e);
    }
  }

  async function updateItem(item) {
    try {
      const response = await inventoryApi.updateItem(item);
      const updatedItem = InventoryAssembler.toEntityFromResource(response.data);
      const index = items.value.findIndex((i) => i.id === updatedItem.id);
      if (index !== -1) items.value[index] = updatedItem;
    } catch (e) {
      errors.value.push(e);
    }
  }

  async function deleteItem(id) {
    try {
      await inventoryApi.deleteItem(id);
      const index = items.value.findIndex((i) => i.id === id);
      if (index !== -1) items.value.splice(index, 1);
    } catch (e) {
      errors.value.push(e);
    }
  }

  // 🔹 Cambiar estados
  function markAsSold(item) {
    item.status = "Vendido";
    updateItem(item);
  }

  function markAsUsed(item) {
    item.status = "Uso en prácticas";
    updateItem(item);
  }

  function markAsReturned(item) {
    if (item.status === "Vendido") {
      item.status = "En stock";
      updateItem(item);
    }
  }

  // 🔹 Filtrado para historial
  const soldItems = computed(() =>
    items.value.filter((i) => i.status === "Vendido")
  );
  const usedItems = computed(() =>
    items.value.filter((i) => i.status === "Uso en prácticas")
  );

  return {
    items,
    errors,
    itemsLoaded,
    itemsCount,
    soldItems,
    usedItems,
    fetchItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
    markAsSold,
    markAsUsed,
    markAsReturned
  };
});

export default useInventoryStore;
