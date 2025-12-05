import { Subscription } from "../domain/model/subscription.js";
/**
 * SubscriptionAssembler is responsible for converting between Subscription entities and their corresponding API resources and responses.
 */
export class SubscriptionAssembler {
  static toEntityFromResource(resource) {
    return new Subscription({ ...resource });
  }

  static toEntityFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}: ${response.statusText}`);
      return [];
    }
    
    let resources;
    
    if (response.data instanceof Array) {
      resources = response.data;
    } else if (response.data["subscriptions"]) {
      resources = response.data["subscriptions"];
    } else {
      resources = [response.data];
    }
    
    return resources.map((r) => this.toEntityFromResource(r));
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      userId: entity.userId,
      planType: entity.planType,
      startDate: entity.startDate,
      endDate: entity.endDate,
      maxMembers: entity.maxMembers,
      maxInventoryItems: entity.maxInventoryItems,
      isActive: entity.isActive
    };
  }
}