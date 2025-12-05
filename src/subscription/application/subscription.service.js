import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SubscriptionApi } from "../infrastructure/subscription-api.js";
import { SubscriptionAssembler } from "../infrastructure/subscription.assembler.js";
import { SubscriptionPlanAssembler } from "../infrastructure/subscription-plan.assembler.js";
import useIamStore from "../../iam/application/iam.service.js";

const subscriptionApi = new SubscriptionApi();

/**
 * Subscription Store
 * @module subscription/store/subscriptionStore
 * @description Store to manage subscriptions and plans.
 * @returns {object} Store with state, getters, and actions.
 */
const useSubscriptionStore = defineStore("subscriptionStore", () => {
  /** @type {ref} List of subscriptions */
  const subscriptions = ref([]);
  /** @type {ref} List of subscription plans */
  const plans = ref([]);
  /** @type {ref} List of errors */
  const errors = ref([]);
  /** @type {ref} Indicates if subscriptions have been loaded */
  const subscriptionsLoaded = ref(false);
  /** @type {ref} Indicates if plans have been loaded */
  const plansLoaded = ref(false);
  /** @type {object} IAM Store instance */
  const iamStore = useIamStore();

  /**
   * Get current user's active subscription
   * @returns {object|null} Current user's subscription or null if none
   */
  const currentUserSubscription = computed(() => {
    if (!iamStore.currentUser) return null;
    return subscriptions.value.find(sub => 
      sub.userId === iamStore.currentUser.id && sub.isActive
    );
  });

  /**
   * Get current user's subscription plan
   * @returns {object|null} Current user's plan or null if none
   */
  const currentPlan = computed(() => {
    const subscription = currentUserSubscription.value;
    if (!subscription) return null;
    return plans.value.find(p => p.name === subscription.planType);
  });

  /**
   * Get current user's subscription limits
   * @returns {object} Current user's limits
   * maxMembers: number of members allowed
   * maxInventoryItems: number of inventory items allowed
   * -1 indicates unlimited
   */
  const currentLimits = computed(() => {
    const subscription = currentUserSubscription.value;
    if (!subscription) {
      return { maxMembers: 3, maxInventoryItems: 50 };
    }
    return {
      maxMembers: subscription.maxMembers,
      maxInventoryItems: subscription.maxInventoryItems
    };
  });

  /**
   * Check if more members can be added
   * @param {number} currentMemberCount - Current number of members
   * @returns {boolean} True if more members can be added, false otherwise
   * -1 indicates unlimited
   */
  function canAddMembers(currentMemberCount) {
    const limits = currentLimits.value;
    if (limits.maxMembers === -1) return true; // Ilimitado
    return currentMemberCount < limits.maxMembers;
  }

  /**
   * Check if more inventory items can be added
   * @param {number} currentItemCount - Current number of inventory items
   * @returns {boolean} True if more inventory items can be added, false otherwise
   * -1 indicates unlimited
   */
  function canAddInventoryItems(currentItemCount) {
    const limits = currentLimits.value;
    if (limits.maxInventoryItems === -1) return true; // Ilimitado
    return currentItemCount < limits.maxInventoryItems;
  }

  /**
   * Fetch subscriptions from API
   * @returns {Promise<void>}
   * @throws Will throw an error if the API call fails
   */
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
  
  /**
   * Fetch subscription plans from API
   * @returns {Promise<void>}
   * @throws Will throw an error if the API call fails
   */
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
  /**
   * Change the current user's subscription plan
   * @param {string} planName - Name of the new plan
   * @returns {Promise<object>} Updated subscription
   * @throws Will throw an error if the plan is not found or the API call fails
   */
  async function changePlan(planName) {
    if (!iamStore.currentUser) {
      throw new Error("No user logged in");
    }

    const plan = plans.value.find(p => p.name === planName);
    if (!plan) {
      throw new Error("Plan not found");
    }

    try {
      const currentSub = currentUserSubscription.value;
      
      if (!currentSub) {
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
      }

      const updatedSubscription = {
        ...currentSub,
        planType: plan.name,
        maxMembers: plan.maxMembers,
        maxInventoryItems: plan.maxInventoryItems,
        startDate: new Date().toISOString(),
        endDate: null,
        isActive: true
      };

      const response = await subscriptionApi.updateSubscription(updatedSubscription);
      const updatedSub = SubscriptionAssembler.toEntityFromResource(response.data);
      
      const index = subscriptions.value.findIndex(s => s.id === currentSub.id);
      if (index !== -1) {
        subscriptions.value[index] = updatedSub;
      }

      return updatedSub;
    } catch (e) {
      console.error("Error changing plan:", e);
      errors.value.push(e);
      throw e;
    }
  }
  /**
   * Initialize default subscription for a user
   * @param {string} userId - ID of the user
   * @returns {Promise<object>} Created or existing subscription
   * @throws Will throw an error if the API call fails
   */
  async function initializeDefaultSubscription(userId) {
    try {
      const existingSub = subscriptions.value.find(
        sub => sub.userId === userId && sub.isActive
      );
      
      if (existingSub) {
        return existingSub;
      }

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