<script setup>
import {useI18n} from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import useInventoryStore from "../../application/inventory.service.js";
import useSubscriptionStore from "../../../subscription/application/subscription.service.js";
import { InventoryItem } from "../../domain/model/inventory.js";

const {t} =useI18n();
const router = useRouter();
const route = useRoute();
const store = useInventoryStore();
const subscriptionStore = useSubscriptionStore();

/**
 * Destructure necessary methods and properties from the inventory store
 * and subscription store for easier access.
 */
const { addItem, updateItem, getItemById, fetchItems, loadUsers, items, usersLoaded } = store;
/**
 * Destructure necessary methods and properties from the subscription store.
 */
const { currentLimits, canAddInventoryItems, fetchSubscriptions, fetchPlans } = subscriptionStore;

/**
 * Computed property to determine if the form is in edit mode
 * based on the presence of an item ID in the route parameters.
 */
const isEdit = computed(() => !!route.params.id);

/** Computed property to get the laboratory ID from the route parameters. */
const laboratoryId = computed(() => parseInt(route.params.labId));

const form = ref({
  name: "",
  category: "",
  quantity: 0,
  description: "",
  status: "En stock",
  userId: null,
});

/** Computed property to get the list of users from the inventory store. */
const usersList = computed(() => {
  return Array.from(store.users.values());
});

/** Computed property to count the current number of items in the laboratory. */
const currentItemCount = computed(() => {
  if (!store.items) return 0;
  return store.items.filter(item => item.laboratoryId === laboratoryId.value).length;
});

/** Computed property to determine if a new item can be added based on subscription limits. */
const canAddNewItem = computed(() => {
  if (isEdit.value) return true;
  return canAddInventoryItems(currentItemCount.value);
});

/** Lifecycle hook to perform initial data fetching when the component is mounted.
 * - Fetch subscription plans and subscriptions if not already loaded.
 * - Load users if not already loaded.
 * - Fetch inventory items for the current laboratory if not already loaded.
 * - If in edit mode, populate the form with the existing item data; if the item does not exist, redirect to the inventory list.
 * Handles edge cases for data loading and navigation.
 */
onMounted(async () => {
  if (!subscriptionStore.plansLoaded.value) {
    await fetchPlans();
  }
  if (!subscriptionStore.subscriptionsLoaded.value) {
    await fetchSubscriptions();
  }

  if (!usersLoaded.value) {
    await loadUsers();
  }
  
  if (!items.value || items.value.length === 0) {
    await fetchItems(laboratoryId.value);
  }
  
  if (isEdit.value) {
    const item = getItemById(route.params.id);
    if (item) {
      form.value = { 
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        description: item.description,
        status: item.status,
        userId: item.userId
      };
    } else {
      router.push({ 
        name: "inventory-list", 
        params: { labId: laboratoryId.value } 
      });
    }
  }
});

/** Method to save the inventory item, either by adding a new item or updating an existing one.
 * - Checks if adding a new item is allowed based on subscription limits; if not, alerts the user.
 * - Constructs a new InventoryItem object with the form data.
 * - Calls the appropriate store method to add or update the item.
 * - Navigates back to the inventory list and refreshes the items after a short delay.
 * Handles errors during the save process and provides user feedback.
 */
const saveItem = async () => {
  if (!isEdit.value && !canAddNewItem.value) {
    alert(`Your current plan allows up to ${currentLimits.value.maxInventoryItems} inventory items per laboratory. Current count: ${currentItemCount.value}. Please upgrade your subscription to add more items.`);
    return;
  }

  const newItem = new InventoryItem({
    id: isEdit.value ? parseInt(route.params.id) : null,
    name: form.value.name,
    category: form.value.category,
    quantity: form.value.quantity,
    description: form.value.description,
    status: form.value.status,
    userId: form.value.userId,
    laboratoryId: laboratoryId.value
  });

  try {
    if (isEdit.value) {
      await updateItem(newItem);
    } else {
      await addItem(newItem);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await router.push({ 
      name: "inventory-list", 
      params: { labId: laboratoryId.value } 
    });
    
    setTimeout(async () => {
      await fetchItems(laboratoryId.value);
    }, 200);
    
  } catch (error) {
    console.error("Error saving item:", error);
    alert("Error saving item. Please try again.");
  }
};
</script>

<template>
  <div class="p-4 inventory-form">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? t('inventory.edit-item') : t('inventory.new-item') }}
    </h1>

    <!-- Información de límites -->
    <div v-if="!isEdit" class="mb-4 p-3 rounded" :class="canAddNewItem ? 'bg-blue-100' : 'bg-red-100'">
      <p>
        <strong>{{ t('inventory.items') }}:</strong> {{ currentItemCount }} / 
        <span v-if="currentLimits.maxInventoryItems === -1">{{ t('inventory.unlimited') }}</span>
        <span v-else>{{ currentLimits.maxInventoryItems }}</span>
      </p>
      <p v-if="!canAddNewItem" class="text-red-600 font-bold mt-2">
        {{ t('inventory.limit-reached') }} 
        <router-link :to="{ name: 'subscription-plans' }" class="underline">
          {{ t('inventory.upgrade') }}
        </router-link>
      </p>
    </div>

    <form @submit.prevent="saveItem" class="grid gap-4 max-w-xl">
      <div class="field">
        <label>{{ t('inventory.name') }}</label>
        <pv-input-text v-model="form.name" required class="w-full" />
      </div>

      <div class="field">
        <label>{{ t('inventory.category') }}</label>
        <pv-input-text v-model="form.category" required class="w-full" />
      </div>

      <div class="field">
        <label>{{ t('inventory.quantity') }}</label>
        <pv-input-number v-model="form.quantity" required class="w-full" />
      </div>

      <div class="field">
        <label>{{ t('inventory.description') }}</label>
        <pv-textarea v-model="form.description" rows="3" class="w-full" />
      </div>

      <div class="field">
        <label>{{ t('inventory.status') }}</label>
        <pv-select
          v-model="form.status"
          :options="[t('inventory.in-stock'), t('inventory.out-of-stock'), t('inventory.sold'), t('inventory.used')]"
          class="w-full"
        />
      </div>

      <div class="field">
        <label>{{ t('inventory.assigned') }}</label>
        <pv-select
          v-model="form.userId"
          :options="usersList"
          optionLabel="username"
          optionValue="id"
          placeholder="Seleccionar usuario"
          class="w-full"
          :disabled="!usersLoaded"
        />
        <small v-if="!usersLoaded" class="text-gray-500">
          {{ t('inventory.loading') }}
        </small>
        <small v-else-if="usersList.length === 0" class="text-orange-500">
          {{ t('inventory.not-users') }}
        </small>
      </div>

      <div class="flex gap-2">
        <pv-button 
          type="submit" 
          :label="t('inventory.save')" 
          icon="pi pi-save"
          :disabled="!isEdit && !canAddNewItem"
        />
        <pv-button 
          :label="t('inventory.cancel')" 
          severity="secondary" 
          @click="router.push({ name: 'inventory-list', params: { labId: laboratoryId } })" 
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.inventory-form {
  background: #51a2fd;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>