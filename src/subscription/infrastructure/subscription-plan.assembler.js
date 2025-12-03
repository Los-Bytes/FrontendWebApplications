import { SubscriptionPlan } from "../domain/model/subscription-plan.js";

export class SubscriptionPlanAssembler {
  static toEntityFromResource(resource) {
    return new SubscriptionPlan({ ...resource });
  }

  static toEntityFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}: ${response.statusText}`);
      return [];
    }
    
    // Maneja tanto respuestas directas como respuestas anidadas
    let resources;
    
    if (response.data instanceof Array) {
      resources = response.data;
    } else if (response.data["plans"]) {
      resources = response.data["plans"];
    } else if (response.data["subscription-plans"]) {
      resources = response.data["subscription-plans"];
    } else {
      // Si es un objeto único
      resources = [response.data];
    }
    
    return resources.map((r) => this.toEntityFromResource(r));
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      currency: entity.currency,
      period: entity.period,
      maxMembers: entity.maxMembers,
      maxInventoryItems: entity.maxInventoryItems,
      features: entity.features
    };
  }
}