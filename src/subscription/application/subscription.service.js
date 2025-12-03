import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SubscriptionApi } from "../infrastructure/subscription-api.js";
import { SubscriptionAssembler } from "../infrastructure/subscription.assembler.js";
import { SubscriptionPlanAssembler } from "../infrastructure/subscription-plan.assembler.js";
import useIamStore from "../../iam/application/iam.service.js";

const subscriptionApi = new SubscriptionApi();

const useSubscriptionStore = defineStore("subscriptionStore", () => {
  const subscriptions = ref([]);
  const plans = ref([]);
  const errors = ref([]);
  const subscriptionsLoaded = ref(false);
  const plansLoaded = ref(false);

  const iamStore = useIamStore();

  // Obtener suscripción del usuario actual
  const currentUserSubscription = computed(() => {
    if (!iamStore.currentUser) return null;
    return subscriptions.value.find(sub => 
      sub.userId === iamStore.currentUser.id && sub.isActive
    );
  });

  // Obtener plan actual del usuario
  const currentPlan = computed(() => {
    const subscription = currentUserSubscription.value;
    if (!subscription) return null;
    return plans.value.find(p => p.name === subscription.planType);
  });

  // Obtener límites actuales del usuario
  const currentLimits = computed(() => {
    const subscription = currentUserSubscription.value;
    if (!subscription) {
      // Plan Free por defecto
      return { maxMembers: 3, maxInventoryItems: 50 };
    }
    return {
      maxMembers: subscription.maxMembers,
      maxInventoryItems: subscription.maxInventoryItems
    };
  });

  // Verificar si puede agregar más miembros
  function canAddMembers(currentMemberCount) {
    const limits = currentLimits.value;
    if (limits.maxMembers === -1) return true; // Ilimitado
    return currentMemberCount < limits.maxMembers;
  }

  // Verificar si puede agregar más items
  function canAddInventoryItems(currentItemCount) {
    const limits = currentLimits.value;
    if (limits.maxInventoryItems === -1) return true; // Ilimitado
    return currentItemCount < limits.maxInventoryItems;
  }

  async function fetchSubscriptions() {
    try {
      const response = await subscriptionApi.getSubscriptions();
      subscriptions.value = SubscriptionAssembler.toEntityFromResponse(response);
      subscriptionsLoaded.value = true;
    } catch (e) {
      console.error("Error fetching subscriptions:", e);
      errors.value.push(e);
      subscriptionsLoaded.value = true;
    }
  }

  async function fetchPlans() {
    try {
      const response = await subscriptionApi.getPlans();
      plans.value = SubscriptionPlanAssembler.toEntityFromResponse(response);
      plansLoaded.value = true;
    } catch (e) {
      console.error("Error fetching plans:", e);
      errors.value.push(e);
      plansLoaded.value = true;
    }
  }

  async function changePlan(planName) {
    if (!iamStore.currentUser) {
      throw new Error("No user logged in");
    }

    const plan = plans.value.find(p => p.name === planName);
    if (!plan) {
      throw new Error("Plan not found");
    }

    try {
      // Desactivar suscripción actual si existe
      const currentSub = currentUserSubscription.value;
      if (currentSub) {
        currentSub.isActive = false;
        currentSub.endDate = new Date().toISOString();
        await subscriptionApi.updateSubscription(currentSub);
        
        // Actualizar en el array local
        const index = subscriptions.value.findIndex(s => s.id === currentSub.id);
        if (index !== -1) {
          subscriptions.value[index] = currentSub;
        }
      }

      // Crear nueva suscripción
      const newSubscription = {
        userId: iamStore.currentUser.id,
        planType: plan.name,
        startDate: new Date().toISOString(),
        endDate: null,
        maxMembers: plan.maxMembers,
        maxInventoryItems: plan.maxInventoryItems,
        isActive: true
      };

      const response = await subscriptionApi.createSubscription(newSubscription);
      const createdSub = SubscriptionAssembler.toEntityFromResource(response.data);
      subscriptions.value.push(createdSub);

      return createdSub;
    } catch (e) {
      console.error("Error changing plan:", e);
      errors.value.push(e);
      throw e;
    }
  }

  async function initializeDefaultSubscription(userId) {
    try {
      // Verificar si ya tiene suscripción
      const existingSub = subscriptions.value.find(
        sub => sub.userId === userId && sub.isActive
      );
      
      if (existingSub) {
        return existingSub;
      }

      // Crear suscripción Free por defecto
      const freePlan = plans.value.find(p => p.name === 'Free');
      if (!freePlan) {
        throw new Error("Free plan not found");
      }

      const newSubscription = {
        userId: userId,
        planType: 'Free',
        startDate: new Date().toISOString(),
        endDate: null,
        maxMembers: freePlan.maxMembers,
        maxInventoryItems: freePlan.maxInventoryItems,
        isActive: true
      };

      const response = await subscriptionApi.createSubscription(newSubscription);
      const createdSub = SubscriptionAssembler.toEntityFromResource(response.data);
      subscriptions.value.push(createdSub);

      return createdSub;
    } catch (e) {
      console.error("Error initializing default subscription:", e);
      errors.value.push(e);
      throw e;
    }
  }

  return {
    subscriptions,
    plans,
    errors,
    subscriptionsLoaded,
    plansLoaded,
    currentUserSubscription,
    currentPlan,
    currentLimits,
    canAddMembers,
    canAddInventoryItems,
    fetchSubscriptions,
    fetchPlans,
    changePlan,
    initializeDefaultSubscription
  };
});

export default useSubscriptionStore;