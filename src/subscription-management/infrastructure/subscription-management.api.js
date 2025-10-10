// src/infrastructure/subscription-management.api.js
import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'
import { SubscriptionAssembler } from './subscription.assembler.js'

const subscriptionsPath = import.meta.env.VITE_SUBSCRIPTIONS_PATH
/**
 * SubscriptionManagementApi
 *
 * Provides CRUD operations for subscription resources through HTTP requests.
 * Extends BaseApi to reuse common API configuration and behavior.
 */
export class SubscriptionManagementApi extends BaseApi {
    #endpoint
    /**
     * Construct a SubscriptionManagementApi instance.
     *
     * Initializes a private BaseEndpoint for the subscriptions resource using
     * the current API instance (this) and the configured subscriptions path.
     * The private `#endpoint` encapsulates the low-level HTTP operations
     * (getAll, getById, create, update, delete) so this class can expose
     * higher-level domain-aware methods.
     *
     * Configuration such as base URL, headers and common interceptors are
     * inherited from BaseApi and do not need to be passed here.
     */
    constructor() {
        super()
        this.#endpoint = new BaseEndpoint(this, subscriptionsPath)
    }
    /**
     * Retrieves all subscriptions from the API.
     * @returns {Promise<Array>} A list of subscription entities.
     */
    async getAll() {
        const resp = await this.#endpoint.getAll()
        return SubscriptionAssembler.toEntitiesFromResponse(resp)
    }
    /**
     * Retrieves a single subscription by its ID.
     * @param {number|string} id - Subscription identifier.
     * @returns {Promise<Object|null>} The subscription entity or null if not found.
     */
    async getById(id) {
        const resp = await this.#endpoint.getById(id)
        return resp.status === 200
            ? SubscriptionAssembler.toEntityFromResource(resp.data)
            : null
    }
    /**
     * Creates a new subscription.
     * @param {Object} entity - Subscription data to be created.
     * @returns {Promise<Object|null>} The created subscription entity or null if creation failed.
     */
    async create(entity) {
        const r = await this.#endpoint.create(entity)
        return r.status === 201
            ? SubscriptionAssembler.toEntityFromResource(r.data)
            : null
    }
    /**
     * Updates an existing subscription.
     * @param {Object} entity - Subscription data containing the ID and updated fields.
     * @returns {Promise<Object|null>} The updated subscription entity or null if update failed.
     */
    async update(entity) {
        const r = await this.#endpoint.update(entity.id, entity)
        return r.status === 200
            ? SubscriptionAssembler.toEntityFromResource(r.data)
            : null
    }
    /**
     * Deletes a subscription by its ID.
     * @param {number|string} id - Subscription identifier to delete.
     * @returns {Promise<Object>} The response from the API.
     */
    async delete(id) {
        return this.#endpoint.delete(id)
    }
}
