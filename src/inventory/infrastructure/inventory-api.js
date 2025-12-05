import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

/** Inventory API class for managing inventory resources. */
const inventoryEndpointPath = import.meta.env.VITE_INVENTORY_ENDPOINT_PATH;
/** Users API class for managing user resources. */
const usersEndpointPath  = import.meta.env.VITE_USERS_ENDPOINT_PATH;

/**
 * @class InventoryApi
 * @summary API class for managing inventory items.
 * Extends the BaseApi to provide CRUD operations for inventory items.
 */
export class InventoryApi extends BaseApi {
  #inventoryEndpoint;
  #usersEndpoint;
  constructor() {
    super();
    this.#inventoryEndpoint = new BaseEndpoint(this, inventoryEndpointPath);
    this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
  }

  getItems() {
    return this.#inventoryEndpoint.getAll();
  }

  getItemById(id) {
    return this.#inventoryEndpoint.getById(id);
  }

  createItem(resource) {
    return this.#inventoryEndpoint.create(resource);
  }

  updateItem(resource) {
    return this.#inventoryEndpoint.update(resource.id, resource);
  }

  deleteItem(id) {
    return this.#inventoryEndpoint.delete(id);
  }

  getUsers() {
    return this.#usersEndpoint.getAll();
  }

  getUserById(userId) {
    return this.#usersEndpoint.getById(userId);
  }
}
