// src/infrastructure/subscription-management.api.js
import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'
import { SubscriptionAssembler } from './subscription.assembler.js'

const subscriptionsPath = import.meta.env.VITE_SUBSCRIPTIONS_PATH

export class SubscriptionManagementApi extends BaseApi {
    #endpoint

    constructor() {
        super()
        this.#endpoint = new BaseEndpoint(this, subscriptionsPath)
    }

    async getAll() {
        const resp = await this.#endpoint.getAll()
        return SubscriptionAssembler.toEntitiesFromResponse(resp)
    }

    async getById(id) {
        const resp = await this.#endpoint.getById(id)
        return resp.status === 200
            ? SubscriptionAssembler.toEntityFromResource(resp.data)
            : null
    }

    async create(entity) {
        const r = await this.#endpoint.create(entity)
        return r.status === 201
            ? SubscriptionAssembler.toEntityFromResource(r.data)
            : null
    }

    async update(entity) {
        const r = await this.#endpoint.update(entity.id, entity)
        return r.status === 200
            ? SubscriptionAssembler.toEntityFromResource(r.data)
            : null
    }

    async delete(id) {
        return this.#endpoint.delete(id)
    }
}
