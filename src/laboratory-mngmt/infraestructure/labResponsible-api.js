import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const labResponsibleEndpointPath=import.meta.env.VITE_LABRESPONSIBLES_ENDPOINT_PATH;
export class LabResponsibleApi extends BaseApi {
    #labResponsibleEndpoint;

    constructor() {
        super();
        this.#labResponsibleEndpoint = new BaseEndpoint(this, labResponsibleEndpointPath)
    }

    getLabResponsibles() {
        return this.#labResponsibleEndpoint.getAll();
    }

    getLabResponsibleById(id) {
        return this.#labResponsibleEndpoint.getById(id);
    }

    createLabResponsible(resource) {
        return this.#labResponsibleEndpoint.create(resource);
    }

    updateLabResponsible(resource) {
        return this.#labResponsibleEndpoint.update(resource.id, resource);
    }

    deleteLabResponsible(id) {
        return this.#labResponsibleEndpoint.delete(id);
    }
}