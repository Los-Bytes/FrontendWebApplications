import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

/** History API class for managing history resources.*/
const historyEndpointPath = import.meta.env.VITE_HISTORY_ENDPOINT_PATH;

/**
 * @class HistoryApi
 * @summary API class for managing history entries.
 * Extends the BaseApi to provide CRUD operations for history entries.
 */
export class HistoryApi extends BaseApi {
  #historyEndpoint;

  constructor() {
    super();
    this.#historyEndpoint = new BaseEndpoint(this, historyEndpointPath);
  }

  getAll() {
    return this.#historyEndpoint.getAll();
  }

  getById(id) {
    return this.#historyEndpoint.getById(id);
  }

  create(resource) {
    return this.#historyEndpoint.create(resource);
  }

  delete(id) {
    return this.#historyEndpoint.delete(id);
  }
}