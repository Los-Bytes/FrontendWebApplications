/**
 * @class BaseEndpoint
 * @summary Base class for API endpoints providing common CRUD operations.
 * @property {object} http - The Axios instance for making HTTP requests.
 * @property {string} endpointPath - The specific endpoint path for the resource.
 * @constructor
 * @param {BaseApi} baseApi - An instance of BaseApi to use for HTTP requests.
 * @param {string} endpointPath - The endpoint path for the resource.
 * Provides methods for common CRUD operations: getAll, getById, create, update, delete.
 */
export class BaseEndpoint{
    constructor(baseApi, endpointPath) {
        this.http=baseApi.http;
        this.endpointPath=endpointPath;
    }

    getAll(){
        return this.http.get(this.endpointPath);
    }
    getById(id) {
        return this.http.get(`${this.endpointPath}/${id}`);
    }

    create(resource) {
        return this.http.post(this.endpointPath, resource);
    }

    update(id, resource) {
        return this.http.put(`${this.endpointPath}/${id}`, resource);
    }

    delete(id) {
        return this.http.delete(`${this.endpointPath}/${id}`);
    }

}