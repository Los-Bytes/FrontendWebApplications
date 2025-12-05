<script setup>
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import useSubscriptionStore from "../../application/subscription.service.js";
import useIamStore from "../../../iam/application/iam.service.js";
import { useI18n } from "vue-i18n";

const { t, tm } = useI18n();
const router = useRouter();
const subscriptionStore = useSubscriptionStore();
const iamStore = useIamStore();

const { 
  plans, 
  plansLoaded, 
  currentUserSubscription, 
  fetchPlans, 
  fetchSubscriptions, 
  changePlan,
  initializeDefaultSubscription
} = subscriptionStore;
/**
 * State variables to manage loading states for plan changes and initialization.
 * @type {import('vue').Ref<boolean>}
 */
const isChanging = ref(false);
/**
 * State variable to indicate if the default subscription is being initialized.
 * @type {import('vue').Ref<boolean>}
 */
const isInitializing = ref(false);

/**
 * Initial data fetching on component mount.
 * Checks if the user is signed in, fetches subscription plans and user subscriptions,
 * and initializes a default Free subscription if none exists.
 * @returns {Promise<void>}
 */
onMounted(async () => {
  if (!iamStore.isSignedIn) {
    alert("Please login first");
    router.push({ name: 'iam-sign-in' });
    return;
  }

  await fetchPlans();
  await fetchSubscriptions();
  
  if (!currentUserSubscription.value) {
    console.log('⚠️ Usuario sin suscripción activa, inicializando Free...');
    isInitializing.value = true;
    try {
      await initializeDefaultSubscription(iamStore.currentUser.id);
      console.log('✅ Suscripción Free creada');
    } catch (error) {
      console.error('❌ Error al crear suscripción:', error);
    } finally {
      isInitializing.value = false;
    }
  }
});

/**
 * Computed property to get the name of the current user's subscription plan.
 * @returns {import('vue').ComputedRef<string>}
 */
const currentPlanName = computed(() => {
  return currentUserSubscription.value?.planType || 'Free';
});

/**
 * Handles the plan change process, including user confirmation and error handling.
 * @param {string} planName - The name of the plan to change to.
 * @returns {Promise<void>}
 * Alerts the user if they are already on the selected plan or if an error occurs during the change.
 * Confirms with the user before proceeding with the plan change.
 * Sets loading state during the operation.
 * Fetches updated subscriptions after a successful plan change.
 * Logs errors to the console for debugging.
 * @throws Will throw an error if the plan change fails.
 */
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
/**
 * Returns the CSS classes for a plan card based on the plan name and whether it is the current plan.
 * @param {string} planName - The name of the subscription plan.
 * @returns {string} The CSS classes for the plan card.
 * Applies specific background and border colors based on the plan name.
 * Adds a ring effect if the plan is the current plan.
 * Adds a hover effect for non-current plans.
 */
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
/**
 * Returns the severity level for a plan button based on the plan name.
 * @param {string} planName - The name of the subscription plan.
 * @returns {string} The severity level for the button.
 * Maps plan names to severity levels for consistent styling.
 * Defaults to 'secondary' if the plan name is unrecognized.
 */
function getPlanButtonSeverity(planName) {
  const severities = {
    'Free': 'secondary',
    'Pro': 'info',
    'Max': 'help'
  };
  return severities[planName] || 'secondary';
}

/**
 * Navigates to the user's subscription dashboard.
 * @returns {void}
 * Uses Vue Router to navigate to the 'my-subscription' route.
 */
function navigateToMySubscription() {
  router.push({ name: 'my-subscription' });
}
/**
 * Retrieves translated features for a given plan name.
 * @param {string} planName - The name of the subscription plan.
 * @returns {Array<string>} An array of translated feature strings.
 * Logs a warning if no features are found for the specified plan.
 * Uses the translation manager to fetch features based on the plan name.
 */
function getTranslatedFeatures(planName) {
  const planKey = planName.toLowerCase();
  const features = tm(`plans.${planKey}.features`);
  
  if (Array.isArray(features)) {
    return features;
  }
  
  console.warn(`No se encontraron features para el plan: ${planKey}`);
  return [];
}

</script>

<template>
  <div class="p-4 subscription-plans-container">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">{{ t('subscription.plan-title') }}</h1>
      <pv-button 
        :label="t('subscription.my-dashboard')" 
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
            <strong>{{ t('subscription.user') }}:</strong> {{ iamStore.currentUser.username }} 
            <span class="text-gray-600">({{ iamStore.currentUser.fullName }})</span>
          </p>
          <p class="mt-1">
            <strong>{{ t('subscription.current-plan') }}:</strong> 
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

    <!-- Mensaje cuando no hay suscripción -->
    <div v-else-if="iamStore.currentUser && !currentUserSubscription && !isInitializing" 
         class="mb-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
      <p class="text-lg">
        ⚠️ No tienes una suscripción activa. Selecciona un plan para comenzar.
      </p>
    </div>
    
    <!-- Loading State -->
    <div v-if="!plansLoaded" class="p-6 bg-gray-100 rounded-lg text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
      <p class="mt-3 text-lg">{{ t('subscription.loading-plans') }}</p>
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
              :value="t('subscription.active')" 
              severity="success"
              icon="pi pi-check-circle"
            />
          </div>
          
          <div class="price mt-3">
            <span v-if="plan.price === 0" class="text-4xl font-bold text-gray-700">
              {{ t('subscription.free') }}
            </span>
            <span v-else class="text-4xl font-bold text-gray-900">
              ${{ plan.price.toFixed(2) }}
            </span>
            <span v-if="plan.price > 0" class="text-lg text-gray-600 ml-2">
              / {{ plan.period === 'monthly' ? t('subscription.monthly') : t('subscription.yearly') }}
            </span>
          </div>
        </div>

        <!-- Limits Section -->
        <div class="plan-limits mb-4 p-4 bg-white rounded-lg shadow-sm">
          <p class="font-bold mb-3 text-lg text-gray-500 flex items-center">
            <i class="pi pi-shield mr-2 text-blue-600"></i>
            {{ t('subscription.limits') }}:
          </p>
          <ul class="space-y-2">
            <li class="flex items-center">
              <i class="pi pi-users text-blue-600 mr-3"></i>
              <span class="font-medium">
                <span v-if="plan.maxMembers === -1" class="text-purple-600">{{ t('subscription.unlimited-members') }}</span>
                <span v-else class="text-gray-600">{{ t('subscription.up-to') }} {{ plan.maxMembers }} {{ t('subscription.memb') }}</span>
              </span>
            </li>
            <li class="flex items-center">
              <i class="pi pi-box text-green-600 mr-3"></i>
              <span class="font-medium">
                <span v-if="plan.maxInventoryItems === -1" class="text-purple-600">{{ t('subscription.unlimited-items') }}</span>
                <span v-else class="text-gray-600">{{ t('subscription.up-to') }} {{ plan.maxInventoryItems }} {{ t('subscription.itms') }}</span>
              </span>
            </li>
          </ul>
        </div>

        <!-- Features Section -->
        <div class="plan-features mb-5">
          <p class="font-bold mb-3 text-lg flex items-center">
            <i class="pi pi-star mr-2 text-yellow-500"></i>
            {{ t('subscription.features') }}:
          </p>
          <ul class="space-y-3">
            <li 
              v-for="(feature, index) in getTranslatedFeatures(plan.name)" 
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
            :label="t('subscription.actual-plan')"
            :severity="getPlanButtonSeverity(plan.name)"
            class="w-full"
            icon="pi pi-check"
            disabled
          />
          <pv-button 
            v-else
            :label="plan.price === 0 ? t('subscription.change-free') : `${t('subscription.obtain')} ${plan.name}`"
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
        {{ t('subscription.important-information') }}
      </h3>
      <ul class="space-y-2 text-gray-700">
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>{{ t('subscription.text-1') }} <strong>{{ t('subscription.text-1-strong') }}</strong></span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>{{ t('subscription.text-2') }} <strong>{{ t('subscription.text-2-strong') }}</strong></span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>{{ t('subscription.text-3') }} <strong>{{ t('subscription.text-3-strong') }}</strong></span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>{{ t('subscription.text-4') }}</span>
        </li>
        <li class="flex items-start">
          <i class="pi pi-angle-right mr-2 mt-1"></i>
          <span>{{ t('subscription.text-5') }} <strong>{{ t('subscription.text-5-strong') }}</strong></span>
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