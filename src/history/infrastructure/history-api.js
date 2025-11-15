import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const historyEndpointPath = '/history';

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