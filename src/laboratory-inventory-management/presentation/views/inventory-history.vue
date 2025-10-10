<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import useInventoryStore from "../../application/inventory.store.js";

const router = useRouter();
const store = useInventoryStore();
const { items, itemsLoaded, fetchItems, markAsReturned } = store;

onMounted(() => {
  if (!itemsLoaded) fetchItems();
});

function navigateBack() {
  router.push({ name: "inventory-list" });
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Historial de Inventario</h1>
    <div class="flex justify-between items-center mb-4">
      <pv-button label="Volver" icon="pi pi-arrow-left" @click="navigateBack" />
    </div>

    <pv-data-table :value="items" paginator :rows="8" striped-rows>
      <pv-column field="name" header="Nombre" sortable />
      <pv-column field="status" header="Estado" />
      <pv-column field="category" header="Categoría" />
      <pv-column field="quantity" header="Cantidad" />
      <pv-column field="description" header="Descripción" />
      <pv-column header="Acciones">
        <template #body="slotProps">
          <pv-button
            v-if="slotProps.data.status === 'Vendido'"
            icon="pi pi-refresh"
            text
            severity="success"
            title="Retornar al stock"
            @click="markAsReturned(slotProps.data)"
          />
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>
