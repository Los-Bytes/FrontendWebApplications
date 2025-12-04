import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { InventoryApi } from "../infrastructure/inventory-api.js";
import { InventoryAssembler } from "../infrastructure/inventory.assembler.js";
import useHistoryStore from "../../history/application/history.store.js";
import { HistoryEntry } from "../../history/domain/model/history-entry.js";

const inventoryApi = new InventoryApi();

const useInventoryStore = defineStore("inventoryStore", () => {
  const items = ref([]);
  const users = ref(new Map());
  const errors = ref([]);
  const itemsLoaded = ref(false);
  const usersLoaded = ref(false);
  const itemsCount = computed(() => (itemsLoaded.value ? items.value.length : 0));
  
  const historyStore = useHistoryStore();

  const getItemsByLaboratory = computed(() => (labId) => {
    return items.value.filter(item => item.laboratoryId === labId);
  });

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

  function getItemById(id) {
    const idNum = parseInt(id);
    return items.value.find((i) => i.id === idNum);
  }

  async function addItem(item) {
    try {
      const response = await inventoryApi.createItem(item);
      const newItem = InventoryAssembler.toEntityFromResource(response.data);
      
      // ✅ Asignar userName desde el map de usuarios
      if (item.userId && users.value.has(item.userId)) {
        const user = users.value.get(item.userId);
        newItem.userName = user.userName;
      } else {
        newItem.userName = 'Sin asignar';
      }
      
      items.value.push(newItem);

      // Registrar en historial si existe
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

  async function updateItem(item) {
    try {
      const oldItem = getItemById(item.id);
      const response = await inventoryApi.updateItem(item);
      const user = users.value.get(item.userId);
      const updatedItem = InventoryAssembler.toEntityFromResource(response.data);
      updatedItem.userName = user ? user.userName : 'Sin asignar';
      const index = items.value.findIndex((i) => i.id === updatedItem.id);
      if (index !== -1) items.value[index] = updatedItem;

      // Registrar en historial
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

  async function deleteItem(id) {
    try {
      const item = getItemById(id);
      await inventoryApi.deleteItem(id);
      const index = items.value.findIndex((i) => i.id === id);
      if (index !== -1) items.value.splice(index, 1);

      // Registrar en historial
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

  // Cambiar estados
  // Vendido
  async function markAsSold(item, quantitySold) {
    try {
      const previousStatus = item.status;
      const previousQuantity = item.quantity;
      
      // Reducir la cantidad
      item.quantity = item.quantity - quantitySold;
      
      // Si la cantidad llega a 0, cambiar estado
      if (item.quantity === 0) {
        item.status = "Agotado";
      }
      
      await updateItem(item);

      // Registrar en historial - primero la actualización de cantidad
      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'updated',
        previousStatus: previousStatus,
        newStatus: item.status,
        quantity: item.quantity,
        description: `Item "${item.name}" actualizado - Cantidad: ${previousQuantity} → ${item.quantity}`
      }));

      // Luego registrar la venta
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
// Uso en prácticas
  async function markAsUsed(item, quantityUsed) {
    try {
      const previousStatus = item.status;
      const previousQuantity = item.quantity;
      
      // Reducir la cantidad
      item.quantity = item.quantity - quantityUsed;
      
      // Si la cantidad llega a 0, cambiar estado
      if (item.quantity === 0) {
        item.status = "Agotado";
      }
      
      await updateItem(item);

      // Registrar en historial - primero la actualización de cantidad
      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'updated',
        previousStatus: previousStatus,
        newStatus: item.status,
        quantity: item.quantity,
        description: `Item "${item.name}" actualizado - Cantidad: ${previousQuantity} → ${item.quantity}`
      }));

      // Luego registrar el uso
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
// Devolver a stock
  async function markAsReturned(item, quantityReturned) {
    try {
      const previousStatus = item.status;
      const previousQuantity = item.quantity;
      
      // Aumentar la cantidad devuelta
      item.quantity = item.quantity + quantityReturned;
      
      // Cambiar estado a "En stock" si estaba agotado
      if (item.status === "Agotado") {
        item.status = "En stock";
      }
      
      await updateItem(item);

      // Registrar en historial - primero la actualización de cantidad
      await historyStore.addHistoryEntry(new HistoryEntry({
        inventoryItemId: item.id,
        laboratoryId: item.laboratoryId,
        action: 'updated',
        previousStatus: previousStatus,
        newStatus: item.status,
        quantity: item.quantity,
        description: `Item "${item.name}" actualizado - Cantidad: ${previousQuantity} → ${item.quantity}`
      }));

      // Luego registrar la devolución
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

  // Filtrado para historial
  const soldItems = computed(() =>
    items.value.filter((i) => i.status === "Vendido")
  );
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
