import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { InventoryApi } from "../infrastructure/inventory-api.js";
import { InventoryAssembler } from "../infrastructure/inventory.assembler.js";
import useHistoryStore from "../../history/application/history.store.js";
import { HistoryEntry } from "../../history/domain/model/history-entry.js";

/**
 * Store to manage inventory items.
 */
const inventoryApi = new InventoryApi();

/**
 * Pinia store for inventory management.
 * Manages inventory items, users, and related operations.
 * @returns {object} The inventory store with state and actions.
 */
const useInventoryStore = defineStore("inventoryStore", () => {
  /** @type {ref} Array of inventory items */
  const items = ref([]);
  /** @type {ref} Map of users by ID */
  const users = ref(new Map());
  /** @type {ref} Array of errors */
  const errors = ref([]);
  /** @type {ref} Boolean indicating if items are loaded */
  const itemsLoaded = ref(false);
  /** @type {ref} Boolean indicating if users are loaded */
  const usersLoaded = ref(false);
  /** @type {computed} Count of items */
  const itemsCount = computed(() => (itemsLoaded.value ? items.value.length : 0));
  
  /** Get history store instance */
  const historyStore = useHistoryStore();

  /** Filter items by laboratory ID
   * @return {Function} Function that takes labId and returns filtered items
  */
  const getItemsByLaboratory = computed(() => (labId) => {
    return items.value.filter(item => item.laboratoryId === labId);
  });

  /** Load users from API */
  async function loadUsers() {
    if (usersLoaded.value) return true;
    
    try {
      const response = await inventoryApi.getUsers();
      if (response.status === 200) {
        const usersData = response.data instanceof Array ? response.data : response.data["users"];
        users.value = new Map(usersData.map(u => [u.id, u]));
        usersLoaded.value = true;
        return true;
      }
    } catch (e) {
      console.error("Error loading users:", e);
      errors.value.push(e);
      usersLoaded.value = false;
      return false;
    }
  }
  /** Fetch all inventory items, optionally filtered by laboratory ID
   * @param {number|null} laboratoryId - Laboratory ID to filter by (optional)
   * @return {Promise<void>}
  */
  async function fetchItems(laboratoryId = null) {
    console.log("fetchItems llamado con laboratoryId:", laboratoryId);
    try {
      if (users.value.size === 0) {
        console.log("Cargando usuarios primero...");
        await loadUsers();
      }

      console.log("Obteniendo items del API...");
      const response = await inventoryApi.getItems();
      console.log("Respuesta del API:", response);
      
      if (response.status !== 200) {
        console.error(`${response.status}: ${response.statusText}`);
        itemsLoaded.value = true;
        return;
      }

      const inventoryResources = response.data instanceof Array 
        ? response.data 
        : response.data["inventory"];

        console.log("Inventory resources:", inventoryResources);

      let allItems = [];
      if (users.value.size === 0) {
        console.log("Sin usuarios, usando assembler básico");
        allItems = InventoryAssembler.toEntityFromResponse(response);
      } else {
        console.log("Con usuarios, combinando datos");
        allItems = InventoryAssembler.toEntityWithUserFromResources(
          inventoryResources,
          users.value
        );
      }

      console.log("All items:", allItems);

      if (laboratoryId !== null && laboratoryId !== undefined) {
      items.value = allItems.filter(item => item.laboratoryId === laboratoryId);
      console.log(`Items filtrados para lab ${laboratoryId}:`, items.value);
    } else {
      items.value = allItems;
      console.log(`Items sin filtrar (todos):`, items.value.length);
    }
      
      itemsLoaded.value = true;
      console.log("Items cargados correctamente. Total:", items.value.length);
    } catch (e) {
      console.error("Error fetching items:", e);
      errors.value.push(e);
      itemsLoaded.value = true;
    }
  }

  /** Get item by ID
   * @param {number|string} id - Item ID
   * @return {Object|undefined} The inventory item or undefined if not found
  */
  function getItemById(id) {
    const idNum = parseInt(id);
    return items.value.find((i) => i.id === idNum);
  }

  /** Add a new inventory item
   * @param {Object} item - The inventory item to add
   * @return {Promise<void>}
  */
  async function addItem(item) {
    try {
      const response = await inventoryApi.createItem(item);
      const newItem = InventoryAssembler.toEntityFromResource(response.data);
      
      if (item.userId && users.value.has(item.userId)) {
        const user = users.value.get(item.userId);
        newItem.username = user.username;
      } else {
        newItem.username = 'Sin asignar';
      }
      
      items.value.push(newItem);

      if (historyStore) {
        await historyStore.addHistoryEntry(new HistoryEntry({
          inventoryItemId: newItem.id,
          laboratoryId: newItem.laboratoryId,
          action: 'created',
          previousStatus: '',
          newStatus: newItem.status,
          quantity: newItem.quantity,
          description: `Item "${newItem.name}" creado`
        }));
      }
    } catch (e) {
      console.error("Error adding item:", e);
      errors.value.push(e);
    }
  }

  /** Update an existing inventory item
   * @param {Object} item - The inventory item to update
   * @return {Promise<void>}
  */
  async function updateItem(item) {
    try {
      const oldItem = getItemById(item.id);
      const response = await inventoryApi.updateItem(item);
      const user = users.value.get(item.userId);
      const updatedItem = InventoryAssembler.toEntityFromResource(response.data);
      updatedItem.username = user ? user.username : 'Sin asignar';
      const index = items.value.findIndex((i) => i.id === updatedItem.id);
      if (index !== -1) items.value[index] = updatedItem;

      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: updatedItem.id,
        laboratoryId: updatedItem.laboratoryId,
        action: 'updated',
        previousStatus: oldItem ? oldItem.status : '',
        newStatus: updatedItem.status,
        quantity: updatedItem.quantity,
        description: `Item "${updatedItem.name}" actualizado`
      }));
    } catch (e) {
      console.error("Error updating item:", e);
      errors.value.push(e);
    }
  }
  /** Delete an inventory item
   * @param {number|string} id - The ID of the item to delete
   * @return {Promise<void>}
  */
  async function deleteItem(id) {
    try {
      const item = getItemById(id);
      await inventoryApi.deleteItem(id);
      const index = items.value.findIndex((i) => i.id === id);
      if (index !== -1) items.value.splice(index, 1);

      if (item) {
        await historyStore.addHistoryEntry(new HistoryEntry({
          inventoryItemId: item.id,
          laboratoryId: item.laboratoryId,
          action: 'deleted',
          previousStatus: item.status,
          newStatus: '',
          quantity: item.quantity,
          description: `Item "${item.name}" eliminado`
        }));
      }
    } catch (e) {
      console.error("Error deleting item:", e);
      errors.value.push(e);
    }
  }

  /** Mark an item as sold
   * @param {Object} item - The inventory item to mark as sold
   * @param {number} quantitySold - The quantity sold
   * @return {Promise<void>}
  */
  async function markAsSold(item, quantitySold) {
    try {
      const previousStatus = item.status;
      const previousQuantity = item.quantity;
      
      item.quantity = item.quantity - quantitySold;
      
      if (item.quantity === 0) {
        item.status = "Agotado";
      }
      
      await updateItem(item);

      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'updated',
        previousStatus: previousStatus,
        newStatus: item.status,
        quantity: item.quantity,
        description: `Item "${item.name}" actualizado - Cantidad: ${previousQuantity} → ${item.quantity}`
      }));

      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'sold',
        previousStatus: previousStatus,
        newStatus: 'Vendido',
        quantity: quantitySold,
        description: `Item "${item.name}" vendido - ${quantitySold} unidades`
      }));
    } catch (e) {
      console.error("Error marking as sold:", e);
      errors.value.push(e);
    }
  }
  /*  Mark an item as used in practices
   * @param {Object} item - The inventory item to mark as used
   * @param {number} quantityUsed - The quantity used
   * @return {Promise<void>}
  */
  async function markAsUsed(item, quantityUsed) {
    try {
      const previousStatus = item.status;
      const previousQuantity = item.quantity;
      
      item.quantity = item.quantity - quantityUsed;
      
      if (item.quantity === 0) {
        item.status = "Agotado";
      }
      
      await updateItem(item);

      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'updated',
        previousStatus: previousStatus,
        newStatus: item.status,
        quantity: item.quantity,
        description: `Item "${item.name}" actualizado - Cantidad: ${previousQuantity} → ${item.quantity}`
      }));

      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'used',
        previousStatus: previousStatus,
        newStatus: 'Uso en prácticas',
        quantity: quantityUsed,
        description: `Item "${item.name}" usado en prácticas - ${quantityUsed} unidades`
      }));
    } catch (e) {
      console.error("Error marking as used:", e);
      errors.value.push(e);
    }
  }
  /** Mark an item as returned to stock
   * @param {Object} item - The inventory item to mark as returned
   * @param {number} quantityReturned - The quantity returned
   * @return {Promise<void>}
  */
  async function markAsReturned(item, quantityReturned) {
    try {
      const previousStatus = item.status;
      const previousQuantity = item.quantity;
      
      item.quantity = item.quantity + quantityReturned;
      
      if (item.status === "Agotado") {
        item.status = "En stock";
      }
      
      await updateItem(item);

      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'updated',
        previousStatus: previousStatus,
        newStatus: item.status,
        quantity: item.quantity,
        description: `Item "${item.name}" actualizado - Cantidad: ${previousQuantity} → ${item.quantity}`
      }));

      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'returned',
        previousStatus: previousStatus,
        newStatus: 'En stock',
        quantity: quantityReturned,
        description: `Item "${item.name}" retornado al stock - ${quantityReturned} unidades devueltas`
      }));
    } catch (e) {
      console.error("Error returning item:", e);
      errors.value.push(e);
    }
  }

  /** Computed property for sold items */
  const soldItems = computed(() =>
    items.value.filter((i) => i.status === "Vendido")
  );
  /** Computed property for items used in practices */
  const usedItems = computed(() =>
    items.value.filter((i) => i.status === "Uso en prácticas")
  );

  return {
    items,
    users,
    errors,
    itemsLoaded,
    usersLoaded,
    itemsCount,
    soldItems,
    usedItems,
    getItemsByLaboratory,
    fetchItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
    markAsSold,
    markAsUsed,
    markAsReturned,
    loadUsers
  };
});

export default useInventoryStore;
