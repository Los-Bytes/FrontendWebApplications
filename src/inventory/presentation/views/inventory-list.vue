<script setup>
import { onMounted, onActivated, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import useInventoryStore from "../../application/inventory.service.js";
import useLaboratoryMngmtStore from "../../../laboratory/application/laboratory.service.js";
import useIamStore from "../../../iam/application/iam.service.js";

const router = useRouter();
const route = useRoute();
const store = useInventoryStore();
const labStore = useLaboratoryMngmtStore();
const iamStore = useIamStore();

const { itemsLoaded, fetchItems, markAsSold, markAsUsed, markAsReturned, deleteItem } = store;

const laboratoryId = computed(() => parseInt(route.params.labId));

const currentLab = computed(() => {
  return labStore.getLaboratoryById(laboratoryId.value);
});

const labItems = computed(() => {
  if (!store.items || !Array.isArray(store.items)) {
    return [];
  }
  
  const filtered = store.items.filter(item => item.laboratoryId === laboratoryId.value);
  return filtered;
});

// Variables para los diálogos
const showSellDialog = ref(false);
const showUseDialog = ref(false);
const showReturnDialog = ref(false);
const selectedItem = ref(null);
const quantityToProcess = ref(0);

async function loadData() {
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

  await fetchItems(laboratoryId.value);
}

onMounted(async () => {
  await loadData();
});

onActivated(async () => {
  await fetchItems(laboratoryId.value);
});

function openSellDialog(item) {
  selectedItem.value = item;
  quantityToProcess.value = 1;
  showSellDialog.value = true;
}

function openUseDialog(item) {
  selectedItem.value = item;
  quantityToProcess.value = 1;
  showUseDialog.value = true;
}

function openReturnDialog(item) {
  selectedItem.value = item;
  quantityToProcess.value = 1;
  showReturnDialog.value = true;
}

async function confirmSell() {
  if (quantityToProcess.value > selectedItem.value.quantity) {
    alert(`No puedes vender más de ${selectedItem.value.quantity} unidades`);
    return;
  }
  
  if (quantityToProcess.value <= 0) {
    alert('La cantidad debe ser mayor a 0');
    return;
  }
  
  await markAsSold(selectedItem.value, quantityToProcess.value);
  showSellDialog.value = false;
  await fetchItems(laboratoryId.value);
}

async function confirmUse() {
  if (quantityToProcess.value > selectedItem.value.quantity) {
    alert(`No puedes usar más de ${selectedItem.value.quantity} unidades`);
    return;
  }
  
  if (quantityToProcess.value <= 0) {
    alert('La cantidad debe ser mayor a 0');
    return;
  }
  
  await markAsUsed(selectedItem.value, quantityToProcess.value);
  showUseDialog.value = false;
  await fetchItems(laboratoryId.value);
}

async function confirmReturn() {
  if (quantityToProcess.value <= 0) {
    alert('La cantidad debe ser mayor a 0');
    return;
  }
  
  await markAsReturned(selectedItem.value, quantityToProcess.value);
  showReturnDialog.value = false;
  await fetchItems(laboratoryId.value);
}

function navigateToNew() {
  router.push({ 
    name: "inventory-new", 
    params: { labId: laboratoryId.value } 
  });
}

function navigateToHistory() {
  router.push({ 
    name: "inventory-history", 
    params: { labId: laboratoryId.value } 
  });
}

function navigateBack() {
  router.push({ name: 'laboratoryMngmt-laboratories' });
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-2">Inventario de Laboratorio</h1>
    
    <div v-if="currentLab" class="mb-4 p-3 bg-blue-400 rounded">
      <strong>Laboratorio:</strong> {{ currentLab.name }}
      <br>
      <strong>Dirección:</strong> {{ currentLab.address }}
    </div>

    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <pv-button label="Volver a Labs" icon="pi pi-arrow-left" severity="secondary" @click="navigateBack" />
        <pv-button label="Nuevo Ítem" icon="pi pi-plus" @click="navigateToNew" />
        <pv-button label="Historial" icon="pi pi-clock" severity="secondary" @click="navigateToHistory" />
      </div>
    </div>

    <div v-if="!itemsLoaded">
      <p>Cargando inventario...</p>
    </div>

    <div v-else-if="labItems.length === 0">
      <p>No hay items en el inventario de este laboratorio.</p>
    </div>

    <pv-data-table v-if="itemsLoaded && labItems.length > 0" :value="labItems" paginator :rows="8" striped-rows>
      <pv-column field="id" header="ID" sortable />
      <pv-column field="name" header="Nombre" sortable />
      <pv-column field="category" header="Categoría" />
      <pv-column field="quantity" header="Cantidad" sortable />
      <pv-column field="status" header="Estado" />
      <pv-column field="userName" header="Usuario Asignado" sortable />
      <pv-column header="Acciones">
        <template #body="slotProps">
          <pv-button 
            icon="pi pi-shopping-cart" 
            text 
            @click="openSellDialog(slotProps.data)" 
            title="Vender"
            :disabled="slotProps.data.quantity === 0"
          />
          <pv-button 
            icon="pi pi-box" 
            text 
            severity="info" 
            @click="openUseDialog(slotProps.data)" 
            title="Uso en prácticas"
            :disabled="slotProps.data.quantity === 0"
          />
          <pv-button 
            icon="pi pi-undo" 
            text 
            severity="success" 
            @click="openReturnDialog(slotProps.data)" 
            title="Retornar al stock"
          />
          <pv-button 
            icon="pi pi-trash" 
            text 
            severity="danger" 
            @click="deleteItem(slotProps.data.id)" 
            title="Eliminar" 
          />
        </template>
      </pv-column>
    </pv-data-table>

    <!-- Dialog para Vender -->
    <pv-dialog v-model:visible="showSellDialog" header="Vender Item" :modal="true" :style="{ width: '400px' }">
      <div v-if="selectedItem" class="flex flex-col gap-4">
        <p><strong>Item:</strong> {{ selectedItem.name }}</p>
        <p><strong>Stock disponible:</strong> {{ selectedItem.quantity }}</p>
        
        <div class="field">
          <label for="sellQuantity">Cantidad a vender:</label>
          <pv-input-number 
            id="sellQuantity" 
            v-model="quantityToProcess" 
            :min="1" 
            :max="selectedItem.quantity"
            class="w-full" 
          />
        </div>
      </div>
      
      <template #footer>
        <pv-button label="Cancelar" severity="secondary" @click="showSellDialog = false" />
        <pv-button label="Vender" icon="pi pi-check" @click="confirmSell" />
      </template>
    </pv-dialog>

    <!-- Dialog para Usar en Prácticas -->
    <pv-dialog v-model:visible="showUseDialog" header="Usar en Prácticas" :modal="true" :style="{ width: '400px' }">
      <div v-if="selectedItem" class="flex flex-col gap-4">
        <p><strong>Item:</strong> {{ selectedItem.name }}</p>
        <p><strong>Stock disponible:</strong> {{ selectedItem.quantity }}</p>
        
        <div class="field">
          <label for="useQuantity">Cantidad a usar:</label>
          <pv-input-number 
            id="useQuantity" 
            v-model="quantityToProcess" 
            :min="1" 
            :max="selectedItem.quantity"
            class="w-full" 
          />
        </div>
      </div>
      
      <template #footer>
        <pv-button label="Cancelar" severity="secondary" @click="showUseDialog = false" />
        <pv-button label="Usar" icon="pi pi-check" severity="info" @click="confirmUse" />
      </template>
    </pv-dialog>

    <!-- Dialog para Retornar -->
    <pv-dialog v-model:visible="showReturnDialog" header="Retornar al Stock" :modal="true" :style="{ width: '400px' }">
      <div v-if="selectedItem" class="flex flex-col gap-4">
        <p><strong>Item:</strong> {{ selectedItem.name }}</p>
        <p><strong>Stock actual:</strong> {{ selectedItem.quantity }}</p>
        
        <div class="field">
          <label for="returnQuantity">Cantidad a retornar:</label>
          <pv-input-number 
            id="returnQuantity" 
            v-model="quantityToProcess" 
            :min="1"
            class="w-full" 
          />
        </div>
      </div>
      
      <template #footer>
        <pv-button label="Cancelar" severity="secondary" @click="showReturnDialog = false" />
        <pv-button label="Retornar" icon="pi pi-check" severity="success" @click="confirmReturn" />
      </template>
    </pv-dialog>
  </div>
</template>