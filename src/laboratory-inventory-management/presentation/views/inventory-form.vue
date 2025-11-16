<script setup>
import {useI18n} from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import useInventoryStore from "../../application/inventory.store.js";
import { InventoryItem } from "../../domain/model/inventory.js";

const {t} =useI18n();
const router = useRouter();
const route = useRoute();
const store = useInventoryStore();
const { addItem, updateItem, getItemById, fetchItems, items } = store;

const isEdit = computed(() => !!route.params.id);
const form = ref({
  name: "",
  category: "",
  quantity: 0,
  description: "",
  status: "En stock",
});

onMounted(async () => {
  if (!items.length) await fetchItems();
  if (isEdit.value) {
    const item = getItemById(route.params.id);
    if (item) {
      form.value = { ...item };
    } else {
      router.push({ name: "inventory-list" });
    }
  }
});

const saveItem = () => {
  const newItem = new InventoryItem({
    id: isEdit.value ? route.params.id : null,
    name: form.value.name,
    category: form.value.category,
    quantity: form.value.quantity,
    description: form.value.description,
    status: form.value.status,
  });

  if (isEdit.value) updateItem(newItem);
  else addItem(newItem);

  router.push({ name: "inventory-list" });
};
</script>

<template>
  <div class="p-4 inventory-form">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? "Editar Ítem" : "Nuevo Ítem" }}
    </h1>

    <form @submit.prevent="saveItem" class="grid gap-4 max-w-xl">
      <div class="field">
        <label>Nombre</label>
        <pv-input-text v-model="form.name" required class="w-full" />
      </div>

      <div class="field">
        <label>Categoría</label>
        <pv-input-text v-model="form.category" required class="w-full" />
      </div>

      <div class="field">
        <label>Cantidad</label>
        <pv-input-number v-model="form.quantity" required class="w-full" />
      </div>

      <div class="field">
        <label>Descripción</label>
        <pv-textarea v-model="form.description" rows="3" class="w-full" />
      </div>

      <div class="field">
        <label>Estado</label>
        <pv-select
          v-model="form.status"
          :options="['En stock', 'Vendido', 'Uso en prácticas']"
          class="w-full"
        />
      </div>

      <div class="flex gap-2">
        <pv-button type="submit" label="Guardar" icon="pi pi-save" />
        <pv-button label="Cancelar" severity="secondary" @click="router.push({ name: 'inventory-list' })" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.inventory-form {
  background: #00b894;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>