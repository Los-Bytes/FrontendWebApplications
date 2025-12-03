<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useSubscriptionStore from "../../application/subscription.service.js";
import useIamStore from "../../../iam/application/iam.service.js";
import useLaboratoryMngmtStore from "../../../laboratory/application/laboratory.service.js";
import useInventoryStore from "../../../inventory/application/inventory.service.js";

const router = useRouter();
const subscriptionStore = useSubscriptionStore();
const iamStore = useIamStore();
const labStore = useLaboratoryMngmtStore();
const inventoryStore = useInventoryStore();

const { 
  currentUserSubscription, 
  currentPlan,
  currentLimits, 
  fetchSubscriptions, 
  fetchPlans 
} = subscriptionStore;

onMounted(async () => {
  if (!iamStore.isSignedIn) {
    alert("Please login first");
    router.push({ name: 'iam-sign-in' });
    return;
  }

  await fetchPlans();
  await fetchSubscriptions();
  
  // Cargar datos para estadísticas
  if (!labStore.laboratoriesLoaded.value) {
    await labStore.fetchLaboratories();
  }
});

const planColor = computed(() => {
  const plan = currentUserSubscription.value?.planType || 'Free';
  const colors = {
    'Free': 'secondary',
    'Pro': 'info',
    'Max': 'help'
  };
  return colors[plan] || 'secondary';
});

const usageStats = computed(() => {
  const userLabs = labStore.userLaboratories.value || [];
  
  // Calcular total de miembros (unique members across all labs)
  const allMembers = new Set();
  userLabs.forEach(lab => {
    if (lab.adminUserId) allMembers.add(lab.adminUserId);
    if (lab.memberUserIds) {
      lab.memberUserIds.forEach(id => allMembers.add(id));
    }
  });

  // Calcular promedio de items por laboratorio
  let totalItems = 0;
  userLabs.forEach(lab => {
    const labItems = inventoryStore.items.filter(item => item.laboratoryId === lab.id);
    totalItems += labItems.length;
  });
  const avgItemsPerLab = userLabs.length > 0 ? Math.round(totalItems / userLabs.length) : 0;

  return {
    totalLaboratories: userLabs.length,
    totalMembers: allMembers.size,
    totalItems: totalItems,
    avgItemsPerLab: avgItemsPerLab
  };
});

function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function navigateToPlans() {
  router.push({ name: 'subscription-plans' });
}

function getUsagePercentage(current, max) {
  if (max === -1) return 0; // Ilimitado
  if (max === 0) return 0;
  return Math.min(Math.round((current / max) * 100), 100);
}

function getUsageColor(percentage) {
  if (percentage < 50) return 'success';
  if (percentage < 80) return 'warn';
  return 'danger';
}
</script>

<template>
  <div class="p-4 my-subscription-container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">Panel de usuario</h1>
      <pv-button 
        label="Ver Planes" 
        icon="pi pi-th-large"
        severity="secondary"
        @click="navigateToPlans"
      />
    </div>
    
    <!-- User Info -->
    <div v-if="iamStore.currentUser" class="mb-6 p-4 bg-blue-300 rounded-lg border-2 border-blue-100">
      <div class="flex items-center gap-4">
        <img 
          :src="iamStore.currentUser.imgToImage" 
          :alt="iamStore.currentUser.userName"
          class="w-16 h-16 rounded-full border-4 border-white shadow-lg"
        />
        <div>
          <p class="text-xl font-bold">{{ iamStore.currentUser.fullName }}</p>
          <p class="text-gray-700">@{{ iamStore.currentUser.username }}</p>
          <p class="text-sm text-gray-600">{{ iamStore.currentUser.organization }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!currentUserSubscription" class="p-6 bg-gray-100 rounded-lg text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
      <p class="mt-3 text-lg">Cargando información de suscripción...</p>
    </div>

    <!-- Subscription Details -->
    <div v-else class="subscription-details">
      
      <!-- Current Plan Card -->
      <div class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300">
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <i class="pi pi-star-fill text-yellow-500 mr-2"></i>
          Plan Actual
        </h2>
        
        <div class="flex items-center justify-between mb-4">
          <div>
            <pv-tag 
              :value="currentUserSubscription.planType" 
              :severity="planColor"
              class="text-3xl px-6 py-3"
            />
            <p v-if="currentPlan" class="mt-2 text-xl font-semibold text-gray-900">
              {{ currentPlan.getPriceFormatted() }} / {{ currentPlan.period === 'monthly' ? 'mes' : 'año' }}
            </p>
          </div>
          <pv-button 
            label="Cambiar Plan" 
            icon="pi pi-arrow-right"
            size="large"
            @click="navigateToPlans"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="info-item bg-white p-3 rounded shadow">
            <span class="label text-gray-600">Fecha de inicio:</span>
            <span class="value text-lg font-semibold text-gray-900">{{ formatDate(currentUserSubscription.startDate) }}</span>
          </div>
          <div class="info-item bg-white p-3 rounded shadow">
            <span class="label text-gray-600">Estado:</span>
            <pv-tag 
              :value="currentUserSubscription.isActive ? 'Activo' : 'Inactivo'" 
              :severity="currentUserSubscription.isActive ? 'success' : 'danger'"
            />
          </div>
        </div>
      </div>

      <!-- Limits and Usage Card -->
      <div class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-white border-2 border-gray-200">
        <h2 class="text-2xl font-bold mb-4 flex items-center text-gray-600">
          <i class="pi pi-chart-bar text-blue-600 mr-2"></i>
          Límites y Uso
        </h2>
        
        <div class="limits-grid">
          <!-- Members Limit -->
          <div class="limit-item p-4 bg-blue-50 rounded-lg shadow">
            <div class="flex items-center justify-between mb-3">
              <i class="pi pi-users text-3xl text-blue-600"></i>
              <pv-tag 
                v-if="currentLimits.maxMembers === -1"
                value="Ilimitado"
                severity="success"
              />
            </div>
            <p class="label text-gray-600 mb-2">Miembros por Laboratorio</p>
            <p class="value text-3xl font-bold text-blue-600">
              <span v-if="currentLimits.maxMembers === -1">∞</span>
              <span v-else>{{ currentLimits.maxMembers }}</span>
            </p>
            <p v-if="currentLimits.maxMembers !== -1" class="text-sm text-gray-500 mt-2">
              Promedio actual: {{ usageStats.totalLaboratories > 0 ? Math.round(usageStats.totalMembers / usageStats.totalLaboratories) : 0 }}
            </p>
          </div>

          <!-- Inventory Items Limit -->
          <div class="limit-item p-4 bg-green-50 rounded-lg shadow">
            <div class="flex items-center justify-between mb-3">
              <i class="pi pi-box text-3xl text-green-600"></i>
              <pv-tag 
                v-if="currentLimits.maxInventoryItems === -1"
                value="Ilimitado"
                severity="success"
              />
            </div>
            <p class="label text-gray-600 mb-2">Items por Inventario</p>
            <p class="value text-3xl font-bold text-green-600">
              <span v-if="currentLimits.maxInventoryItems === -1">∞</span>
              <span v-else>{{ currentLimits.maxInventoryItems }}</span>
            </p>
            <p v-if="currentLimits.maxInventoryItems !== -1" class="text-sm text-gray-500 mt-2">
              Promedio actual: {{ usageStats.avgItemsPerLab }}
            </p>
          </div>
        </div>
      </div>

      <!-- Usage Statistics -->
      <div class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-white border-2 border-gray-200">
        <h2 class="text-2xl font-bold mb-4 flex items-center text-gray-600">
          <i class="pi pi-chart-line text-purple-600 mr-2"></i>
          Estadísticas de Uso
        </h2>
        
        <div class="stats-grid">
          <div class="stat-card p-4 bg-purple-50 rounded-lg text-center">
            <i class="pi pi-building text-4xl text-purple-600 mb-2"></i>
            <p class="text-sm text-gray-600">Laboratorios</p>
            <p class="text-3xl font-bold text-purple-600">{{ usageStats.totalLaboratories }}</p>
          </div>

          <div class="stat-card p-4 bg-blue-50 rounded-lg text-center">
            <i class="pi pi-users text-4xl text-blue-600 mb-2"></i>
            <p class="text-sm text-gray-600">Miembros Totales</p>
            <p class="text-3xl font-bold text-blue-600">{{ usageStats.totalMembers }}</p>
          </div>

          <div class="stat-card p-4 bg-green-50 rounded-lg text-center">
            <i class="pi pi-box text-4xl text-green-600 mb-2"></i>
            <p class="text-sm text-gray-600">Items Totales</p>
            <p class="text-3xl font-bold text-green-600">{{ usageStats.totalItems }}</p>
          </div>

          <div class="stat-card p-4 bg-orange-50 rounded-lg text-center">
            <i class="pi pi-chart-pie text-4xl text-orange-600 mb-2"></i>
            <p class="text-sm text-gray-600">Promedio Items/Lab</p>
            <p class="text-3xl font-bold text-orange-600">{{ usageStats.avgItemsPerLab }}</p>
          </div>
        </div>
      </div>

      <!-- Features Included -->
      <div v-if="currentPlan" class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-white border-2 border-gray-200">
        <h2 class="text-2xl font-bold mb-4 flex items-center text-gray-600">
          <i class="pi pi-check-square text-green-600 mr-2"></i>
          Características Incluidas
        </h2>
        
        <ul class="features-list space-y-3">
          <li 
            v-for="(feature, index) in currentPlan.features" 
            :key="index"
            class="flex items-start p-3 bg-green-50 rounded-lg"
          >
            <i class="pi pi-check-circle text-green-600 mr-3 mt-1 text-xl flex-shrink-0"></i>
            <span class="text-gray-800 font-medium">{{ feature }}</span>
          </li>
        </ul>
      </div>

      <!-- Upgrade Suggestion -->
      <div v-if="currentUserSubscription.planType !== 'Max'" class="detail-card p-5 rounded-lg shadow-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
        <h3 class="font-bold mb-3 text-xl flex items-center">
          <i class="pi pi-bolt text-yellow-600 mr-2"></i> 
          ¿Necesitas más?
        </h3>
        <p class="mb-4">
          Mejora tu plan para obtener más miembros, más items en inventario y características avanzadas.
        </p>
        <pv-button 
          label="Ver Planes Disponibles" 
          icon="pi pi-arrow-right"
          severity="warning"
          @click="navigateToPlans"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-subscription-container {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-card {
  transition: transform 0.2s ease;
}

.detail-card:hover {
  transform: translateY(-2px);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.limits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.limit-item {
  transition: transform 0.2s ease;
}

.limit-item:hover {
  transform: scale(1.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .limits-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>