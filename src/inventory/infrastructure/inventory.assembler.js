import { InventoryItem } from "../domain/model/inventory.js";

/**
 * Assembler for converting inventory resources and responses into InventoryItem entities.
 */
export class InventoryAssembler {
  static toEntityFromResource(resource) {
    return new InventoryItem({ ...resource });
  }

  static toEntityFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}: ${response.statusText}`);
      return [];
    }
    const resources =
      response.data instanceof Array ? response.data : response.data["inventory"];
    return resources.map((r) => this.toEntityFromResource(r));
  }
  
  static toEntityWithUserFromResources(inventoryResources, usersMap) {
    return inventoryResources.map((item) => {
      const user = usersMap.get(item.userId);
      return new InventoryItem({
        ...item,
        username: user ? user.username : 'Sin asignar'
      });
    });
  }
}
