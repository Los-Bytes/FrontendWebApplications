import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint}  from "../../shared/infrastructure/base-endpoint.js";

const laboratoryEndpointPath=import.meta.env.VITE_LABORATORIES_ENDPOINT_PATH;

export class LaboratoryApi extends BaseApi {
    #laboratoryEndpoint;

    constructor() {
        super();
        this.#laboratoryEndpoint = new BaseEndpoint(this, laboratoryEndpointPath)
    }

    getLaboratories() {
        return this.#laboratoryEndpoint.getAll();
    }

    getLaboratoryById(id) {
        return this.#laboratoryEndpoint.getById(id);
    }

    createLaboratory(resource) {
        return this.#laboratoryEndpoint.create(resource);
    }

    updateLaboratory(resource) {
        return this.#laboratoryEndpoint.update(resource.id, resource);
    }

    deleteLaboratory(id) {
        return this.#laboratoryEndpoint.delete(id);
    }
}