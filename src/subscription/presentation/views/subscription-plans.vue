<script setup>
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import useSubscriptionStore from "../../application/subscription.service.js";
import useIamStore from "../../../iam/application/iam.service.js";

const router = useRouter();
const subscriptionStore = useSubscriptionStore();
const iamStore = useIamStore();

const { 
  plans, 
  plansLoaded, 
  currentUserSubscription, 
  fetchPlans, 
  fetchSubscriptions, 
  changePlan 
} = subscriptionStore;

const isChanging = ref(false);

onMounted(async () => {
  if (!iamStore.isSignedIn) {
    alert("Please login first");
    router.push({ name: 'iam-sign-in' });
    return;
  }

  await fetchPlans();
  await fetchSubscriptions();
});

const currentPlanName = computed(() => {
  return currentUserSubscription.value?.planType || 'Free';
});

async function handleChangePlan(planName) {
  if (planName === currentPlanName.value) {
    alert(`Ya tienes el plan ${planName}`);
    return;
  }

  const confirmMessage = planName === 'Free' 
    ? '¿Estás seguro de que quieres cambiar al plan Free? Perderás los beneficios del plan actual.'
    : `¿Estás seguro de que quieres cambiar al plan ${planName}?`;

  if (!confirm(confirmMessage)) {
    return;
  }

  isChanging.value = true;

  try {
    await changePlan(planName);
    alert(`¡Plan cambiado exitosamente a ${planName}!`);
    await fetchSubscriptions();
  } catch (error) {
    console.error("Error changing plan:", error);
    alert("Error al cambiar el plan. Por favor intenta de nuevo.");
  } finally {
    isChanging.value = false;
  }
}

function getPlanCardClass(planName) {
  const baseClass = 'plan-card p-5 rounded-lg shadow-lg transition-all';
  const colorClasses = {
    'Free': 'bg-gray-300 border-2 border-gray-50',
    'Pro': 'bg-blue-400 border-2 border-blue-50',
    'Max': 'bg-purple-400 border-2 border-purple-50'
  };
  
  if (planName === currentPlanName.value) {
    return `${baseClass} ${colorClasses[planName]} ring-4 ring-green-400`;
  }
  
  return `${baseClass} ${colorClasses[planName]} hover:scale-105`;
}

function getPlanButtonSeverity(planName) {
  const severities = {
    'Free': 'secondary',
    'Pro': 'info',
    'Max': 'help'
  };
  return severities[planName] || 'secondary';
}

function navigateToMySubscription() {
  router.push({ name: 'my-subscription' });
}
</script>

<template>
  <div class="p-4 subscription-plans-container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">Planes de Suscripción</h1>
      <pv-button 
        label="Mi Suscripción" 
        icon="pi pi-user"
        severity="secondary"
        @click="navigateToMySubscription"
      />
    </div>
    
    <!-- Usuario y Plan Actual -->
    <div v-if="iamStore.currentUser" class="mb-6 p-4 bg-blue-400 rounded-lg border-2 border-blue-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-lg">
            <strong>Usuario:</strong> {{ iamStore.currentUser.username }} 
            <span class="text-gray-600">({{ iamStore.currentUser.fullName }})</span>
          </p>
          <p class="mt-1">
            <strong>Plan Actual:</strong> 
            <pv-tag 
              :value="currentPlanName" 
              :severity="getPlanButtonSeverity(currentPlanName)"
              class="ml-2 text-lg"
            />
          </p>
        </div>
        <i class="pi pi-user-circle text-6xl text-blue-600"></i>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!plansLoaded" class="p-6 bg-gray-100 rounded-lg text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
      <p class="mt-3 text-lg">Cargando planes...</p>
    </div>

    <!-- Plans Grid -->
    <div v-else class="plans-grid">
      <div 
        v-for="plan in plans" 
        :key="plan.id"
        :class="getPlanCardClass(plan.name)"
      >
        <!-- Plan Header -->
        <div class="plan-header mb-4 pb-4 border-b-2">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-3xl font-bold">{{ plan.name }}</h2>
            <pv-tag 
              v-if="plan.name === currentPlanName"
              value="ACTIVO" 
              severity="success"
              icon="pi pi-check-circle"
            />
          </div>
          
          <div class="price mt-3">
            <span v-if="plan.price === 0" class="text-4xl font-bold text-gray-700">
              Gratis
            </span>
            <span v-else class="text-4xl font-bold text-gray-900">
              ${{ plan.price.toFixed(2) }}
            </span>
            <span v-if="plan.price > 0" class="text-lg text-gray-600 ml-2">
              / {{ plan.period === 'monthly' ? 'mes' : 'año' }}
            </span>
          </div>
        </div>

        <!-- Limits Section -->
        <div class="plan-limits mb-4 p-4 bg-white rounded-lg shadow-sm">
          <p class="font-bold mb-3 text-lg text-gray-500 flex items-center">
            <i class="pi pi-shield mr-2 text-blue-600"></i>
            Límites:
          </p>
          <ul class="space-y-2">
            <li class="flex items-center">
              <i class="pi pi-users text-blue-600 mr-3"></i>
              <span class="font-medium">
                <span v-if="plan.maxMembers === -1" class="text-purple-600">Miembros ilimitados</span>
                <span v-else class="text-gray-600">Hasta {{ plan.maxMembers }} miembros</span>
              </span>
            </li>
            <li class="flex items-center">
              <i class="pi pi-box text-green-600 mr-3"></i>
              <span class="font-medium">
                <span v-if="plan.maxInventoryItems === -1" class="text-purple-600">Items ilimitados</span>
                <span v-else class="text-gray-600">Hasta {{ plan.maxInventoryItems }} items</span>
              </span>
            </li>
          </ul>
        </div>

        <!-- Features Section -->
        <div class="plan-features mb-5">
          <p class="font-bold mb-3 text-lg flex items-center">
            <i class="pi pi-star mr-2 text-yellow-500"></i>
            Características:
          </p>
          <ul class="space-y-3">
            <li 
              v-for="(feature, index) in plan.features" 
              :key="index" 
              class="flex items-start"
            >
              <i class="pi pi-check-circle text-green-600 mr-3 mt-1 flex-shrink-0"></i>
              <span class="text-gray-50">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Action Button -->
        <div class="plan-action">
          <pv-button 
            v-if="plan.name === currentPlanName"
            label="Plan Actual"
            :severity="getPlanButtonSeverity(plan.name)"
            class="w-full"
            icon="pi pi-check"
            disabled
          />
          <pv-button 
            v-else
            :label="plan.price === 0 ? 'Cambiar a Free' : `Obtener ${plan.name}`"
            :severity="getPlanButtonSeverity(plan.name)"
            class="w-full"
            icon="pi pi-arrow-right"
            :loading="isChanging"
            @click="handleChangePlan(plan.name)"
          />
        </div>
      </div>
    </div>

    <!-- Information Section -->
    <div class="mt-8 p-5 bg-yellow-300 rounded-lg border-2 border-yellow-50">
      <h3 class="font-bold mb-3 text-xl flex items-center">
        <i class="pi pi-info-circle text-yellow-600 mr-2"></i> 
        Información importante
      </h3>
      <ul class="space-y-2 text-gray-700">
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>Los límites de miembros aplican <strong>por laboratorio</strong></span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>Los límites de items aplican <strong>por laboratorio</strong></span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>Puedes <strong>cambiar de plan en cualquier momento</strong></span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>Al cambiar a un plan inferior, los datos existentes se mantienen pero no podrás agregar más hasta estar dentro del límite</span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>Los cambios de plan son <strong>inmediatos</strong></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.subscription-plans-container {
  max-width: 1400px;
  margin: 0 auto;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.plan-card {
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.plan-header {
  border-bottom-color: currentColor;
}

.plan-features {
  flex-grow: 1;
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>