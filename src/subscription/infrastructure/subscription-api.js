import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

/**
 * SubscriptionApi handles all API interactions related to subscriptions and subscription plans.
 */
const subscriptionsEndpointPath = import.meta.env.VITE_SUBSCRIPTIONS_ENDPOINT_PATH;
const plansEndpointPath = import.meta.env.VITE_PLANS_ENDPOINT_PATH;

/**
 * SubscriptionApi class provides methods to interact with subscription-related endpoints.
 * It includes CRUD operations for subscriptions and read-only operations for subscription plans.
 */
export class SubscriptionApi extends BaseApi {
  #subscriptionsEndpoint;
  #plansEndpoint;

  constructor() {
    super();
    this.#subscriptionsEndpoint = new BaseEndpoint(this, subscriptionsEndpointPath);
    this.#plansEndpoint = new BaseEndpoint(this, plansEndpointPath);
  }

  // ==========================================
  // Subscriptions CRUD
  // ==========================================
  
  getSubscriptions() {
    return this.#subscriptionsEndpoint.getAll();
  }

  getSubscriptionById(id) {
    return this.#subscriptionsEndpoint.getById(id);
  }

  createSubscription(resource) {
    return this.#subscriptionsEndpoint.create(resource);
  }

  updateSubscription(resource) {
    return this.#subscriptionsEndpoint.update(resource.id, resource);
  }

  deleteSubscription(id) {
    return this.#subscriptionsEndpoint.delete(id);
  }

  // ==========================================
  // Subscription Plans (Read-only)
  // ==========================================
  
  getPlans() {
    return this.#plansEndpoint.getAll();
  }

  getPlanById(id) {
    return this.#plansEndpoint.getById(id);
  }
}