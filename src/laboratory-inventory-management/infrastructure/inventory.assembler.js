import { InventoryItem } from "../domain/model/inventory.js";

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
}
