<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useSubscriptionStore from "../../application/subscription.service.js";
import useIamStore from "../../../iam/application/iam.service.js";
import useLaboratoryMngmtStore from "../../../laboratory/application/laboratory.service.js";
import useInventoryStore from "../../../inventory/application/inventory.service.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
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

  // Cargar planes y suscripciones
  await fetchPlans();
  await fetchSubscriptions();
  
  // ✅ CARGAR datos para estadísticas
  if (!labStore.laboratoriesLoaded.value) {
    await labStore.fetchLaboratories();
  }

  // ✅ CARGAR inventario SIN filtrar por laboratorio (para obtener todos los items del usuario)
  await inventoryStore.fetchItems(); // Sin parámetro = obtiene todos
  
  console.log('📊 Datos cargados:');
  console.log('   - Laboratorios:', labStore.userLaboratories.length); // ✅ SIN .value porque es computed
  console.log('   - Items totales:', inventoryStore.items.length);
  console.log('   - Usuario actual:', iamStore.currentUser);
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
  const userLabs = labStore.userLaboratories || []; // ✅ SIN .value porque es computed
  
  console.log('🔄 Calculando estadísticas...');
  console.log('   - Laboratorios del usuario:', userLabs.length);
  console.log('   - Items en store:', inventoryStore.items?.length || 0);
  
  // ✅ Calcular total de miembros únicos across all labs del usuario
  const allMembers = new Set();
  userLabs.forEach(lab => {
    if (lab.adminUserId) allMembers.add(lab.adminUserId);
    if (lab.memberUserIds && Array.isArray(lab.memberUserIds)) {
      lab.memberUserIds.forEach(id => allMembers.add(id));
    }
  });

  // ✅ Calcular total de items del usuario
  let totalItems = 0;
  userLabs.forEach(lab => {
    // Asegurarse de que inventoryStore.items existe y es un array
    const allItems = inventoryStore.items || [];
    const labItems = allItems.filter(item => item.laboratoryId === lab.id);
    console.log(`   - Items en lab ${lab.id} (${lab.name}):`, labItems.length);
    totalItems += labItems.length;
  });

  console.log('   - Total items calculado:', totalItems);
  console.log('   - Total miembros únicos:', allMembers.size);

  // ✅ Promedio de items por laboratorio
  const avgItemsPerLab = userLabs.length > 0 ? Math.round(totalItems / userLabs.length) : 0;

  // ✅ Calcular promedio de miembros por laboratorio
  let totalMembersAcrossLabs = 0;
  userLabs.forEach(lab => {
    let labMemberCount = 0;
    if (lab.adminUserId) labMemberCount++;
    if (lab.memberUserIds && Array.isArray(lab.memberUserIds)) {
      labMemberCount += lab.memberUserIds.length;
    }
    totalMembersAcrossLabs += labMemberCount;
  });
  const avgMembersPerLab = userLabs.length > 0 ? Math.round(totalMembersAcrossLabs / userLabs.length) : 0;

  return {
    totalLaboratories: userLabs.length,
    totalMembers: allMembers.size,
    totalItems: totalItems,
    avgItemsPerLab: avgItemsPerLab,
    avgMembersPerLab: avgMembersPerLab
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
</script>

<template>
  <div class="p-4 my-subscription-container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">{{ t('subscription.db-title') }}</h1>
      <pv-button 
        :label="t('subscription.see-plans')" 
        icon="pi pi-th-large"
        severity="secondary"
        @click="navigateToPlans"
      />
    </div>
    
    <!-- User Info -->
    <div v-if="iamStore.currentUser" class="mb-6 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
      <div class="flex items-center gap-4">
        <img 
          :src="iamStore.currentUser.imgToImage" 
          :alt="iamStore.currentUser.username"
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
      <p class="mt-3 text-lg">{{ t('subscription.loading') }}</p>
    </div>

    <!-- Subscription Details -->
    <div v-else class="subscription-details">
      
      <!-- Current Plan Card -->
      <div class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300">
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <i class="pi pi-star-fill text-yellow-500 mr-2"></i>
          {{ t('subscription.current-plan') }}
        </h2>
        
        <div class="flex items-center justify-between mb-4">
          <div>
            <pv-tag 
              :value="currentUserSubscription.planType" 
              :severity="planColor"
              class="text-3xl px-6 py-3"
            />
            <p v-if="currentPlan" class="mt-2 text-xl font-semibold">
              {{ currentPlan.getPriceFormatted() }} / {{ currentPlan.period === 'monthly' ? 'mes' : 'año' }}
            </p>
          </div>
          <pv-button 
            :label="t('subscription.change-plan')" 
            icon="pi pi-arrow-right"
            size="large"
            @click="navigateToPlans"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="info-item bg-white p-3 rounded shadow">
            <span class="label text-gray-600">{{ t('subscription.start-date') }}:</span>
            <span class="value text-lg font-semibold text-gray-800">{{ formatDate(currentUserSubscription.startDate) }}</span>
          </div>
          <div class="info-item bg-white p-3 rounded shadow">
            <span class="label text-gray-600">{{ t('subscription.status') }}:</span>
            <pv-tag 
              :value="currentUserSubscription.isActive ? t('subscription.active') : t('subscription.inactive')" 
              :severity="currentUserSubscription.isActive ? 'success' : 'danger'"
            />
          </div>
        </div>
      </div>

      <!-- Limits and Usage Card -->
      <div class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-white border-2 border-gray-200">
        <h2 class="text-2xl font-bold mb-4 flex items-center text-gray-800">
          <i class="pi pi-chart-bar text-blue-600 mr-2"></i>
          {{ t('subscription.limits-usage') }}
        </h2>
        
        <div class="limits-grid">
          <!-- Members Limit -->
          <div class="limit-item p-4 bg-blue-50 rounded-lg shadow">
            <div class="flex items-center justify-between mb-3">
              <i class="pi pi-users text-3xl text-blue-600"></i>
              <pv-tag 
                v-if="currentLimits.maxMembers === -1"
                :value="t('subscription.unlimited')"
                severity="success"
              />
            </div>
            <p class="label text-gray-600 mb-2">{{ t('subscription.members') }}</p>
            <p class="value text-3xl font-bold text-blue-600">
              <span v-if="currentLimits.maxMembers === -1">∞</span>
              <span v-else>{{ currentLimits.maxMembers }}</span>
            </p>
            <p v-if="currentLimits.maxMembers !== -1" class="text-sm text-gray-500 mt-2">
              {{ t('subscription.current-average') }}: {{ usageStats.avgMembersPerLab }}
            </p>
          </div>

          <!-- Inventory Items Limit -->
          <div class="limit-item p-4 bg-green-50 rounded-lg shadow">
            <div class="flex items-center justify-between mb-3">
              <i class="pi pi-box text-3xl text-green-600"></i>
              <pv-tag 
                v-if="currentLimits.maxInventoryItems === -1"
                :value="t('subscription.unlimited')"
                severity="success"
              />
            </div>
            <p class="label text-gray-600 mb-2">{{ t('subscription.items') }}</p>
            <p class="value text-3xl font-bold text-green-600">
              <span v-if="currentLimits.maxInventoryItems === -1">∞</span>
              <span v-else>{{ currentLimits.maxInventoryItems }}</span>
            </p>
            <p v-if="currentLimits.maxInventoryItems !== -1" class="text-sm text-gray-500 mt-2">
              {{ t('subscription.current-average') }}: {{ usageStats.avgItemsPerLab }}
            </p>
          </div>
        </div>
      </div>

      <!-- Usage Statistics -->
      <div class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-white border-2 border-gray-200">
        <h2 class="text-2xl font-bold mb-4 flex items-center text-gray-800">
          <i class="pi pi-chart-line text-purple-600 mr-2"></i>
          {{ t('subscription.usage-stats') }}
        </h2>
        
        <div class="stats-grid">
          <div class="stat-card p-4 bg-purple-50 rounded-lg text-center">
            <i class="pi pi-building text-4xl text-purple-600 mb-2"></i>
            <p class="text-sm text-gray-600">{{ t('subscription.laboratories') }}</p>
            <p class="text-3xl font-bold text-purple-600">{{ usageStats.totalLaboratories }}</p>
          </div>

          <div class="stat-card p-4 bg-blue-50 rounded-lg text-center">
            <i class="pi pi-users text-4xl text-blue-600 mb-2"></i>
            <p class="text-sm text-gray-600">{{ t('subscription.total-members') }}</p>
            <p class="text-3xl font-bold text-blue-600">{{ usageStats.totalMembers }}</p>
          </div>

          <div class="stat-card p-4 bg-green-50 rounded-lg text-center">
            <i class="pi pi-box text-4xl text-green-600 mb-2"></i>
            <p class="text-sm text-gray-600">{{ t('subscription.total-items') }}</p>
            <p class="text-3xl font-bold text-green-600">{{ usageStats.totalItems }}</p>
          </div>

          <div class="stat-card p-4 bg-orange-50 rounded-lg text-center">
            <i class="pi pi-chart-pie text-4xl text-orange-600 mb-2"></i>
            <p class="text-sm text-gray-600">{{ t('subscription.average-items') }}</p>
            <p class="text-3xl font-bold text-orange-600">{{ usageStats.avgItemsPerLab }}</p>
          </div>
        </div>
      </div>

      <!-- Features Included -->
      <div v-if="currentPlan" class="detail-card p-5 mb-6 rounded-lg shadow-xl bg-white border-2 border-gray-200">
        <h2 class="text-2xl font-bold mb-4 flex items-center text-gray-800">
          <i class="pi pi-check-square text-green-600 mr-2"></i>
          {{ t('subscription.features-included') }}
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
          {{ t('subscription.need-more') }}
        </h3>
        <p class="mb-4">
          {{ t('subscription.upgrade-message') }}
        </p>
        <pv-button 
          :label="t('subscription.view-available')" 
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