<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import useInventoryStore from "../../application/inventory.store.js";

const router = useRouter();
const store = useInventoryStore();
const { items, itemsLoaded, fetchItems, markAsSold, markAsUsed, deleteItem } = store;

onMounted(() => {
  if (!itemsLoaded) fetchItems();
});

function navigateToNew() {
  router.push({ name: "inventory-new" });
}

function navigateToHistory() {
  router.push({ name: "inventory-history" });
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Inventario de Laboratorio</h1>
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <pv-button label="Nuevo Ítem" icon="pi pi-plus" @click="navigateToNew" />
        <pv-button label="Historial" icon="pi pi-clock" severity="secondary" @click="navigateToHistory" />
      </div>
    </div>

    <pv-data-table :value="items" :loading="!itemsLoaded" paginator :rows="8" striped-rows>
      <pv-column field="id" header="ID" sortable />
      <pv-column field="name" header="Nombre" sortable />
      <pv-column field="category" header="Categoría" />
      <pv-column field="quantity" header="Cantidad" />
      <pv-column field="status" header="Estado" />
      <pv-column header="Acciones">
        <template #body="slotProps">
          <pv-button icon="pi pi-shopping-cart" text @click="markAsSold(slotProps.data)" title="Vender" />
          <pv-button icon="pi pi-box" text severity="info" @click="markAsUsed(slotProps.data)" title="Uso en prácticas" />
          <pv-button icon="pi pi-trash" text severity="danger" @click="deleteItem(slotProps.data.id)" title="Eliminar" />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>
