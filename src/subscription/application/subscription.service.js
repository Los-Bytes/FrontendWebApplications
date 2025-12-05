import { SubscriptionAssembler } from '../infrastructure/subscription.assembler.js'
import { SubscriptionManagementApi } from '../infrastructure/subscription-management.api.js'
/**
 * SubscriptionService
 *
 * Service layer that coordinates subscription operations between
 * the domain layer and the infrastructure layer.
 *
 * This class acts as an intermediary — it translates domain commands
 * into payloads expected by the API and maps responses into domain entities.
 */
export class SubscriptionService {
    /**
     * Construct a SubscriptionService instance.
     *
     * Initializes a SubscriptionManagementApi to handle all HTTP requests
     * related to subscription management (create, read, update, delete).
     * This isolates the API logic from domain logic and maintains
     * a clean separation of concerns.
     */
    constructor() {
        this.api = new SubscriptionManagementApi()
    }
    /**
     * Retrieve all subscriptions.
     * @returns {Promise<Array>} A promise that resolves to a list of subscription entities.
     */
    listAll() {
        return this.api.getAll()
    }
    /**
     * Retrieve a subscription by its unique identifier.
     * @param {number|string} id - Subscription identifier.
     * @returns {Promise<Object>} A promise that resolves to a subscription entity.
     * @throws {Error} If the subscription is not found.
     */
    getById(id) {
        return this.api.getById(id)
            .then(response => {
                if (!response) throw new Error('Not found')
                return response
            })
    }
    /**
     * Create a new subscription using the provided command object.
     *
     * @param {Object} command - Data required to create a subscription.
     * @param {string|number} command.userId - ID of the user subscribing.
     * @param {string} command.plan - Plan name or identifier.
     * @param {Date} command.startDate - Start date of the subscription.
     * @param {string} command.status - Current status (e.g., ACTIVE, PENDING).
     * @param {Date} [command.trialEndDate] - Optional trial end date.
     * @returns {Promise<Object>} The created subscription entity.
     */
    create(command) {
        const payload = {
            userId: command.userId,
            plan: command.plan,
            startDate: command.startDate.toISOString(),
            status: command.status,
            trialEndDate: command.trialEndDate?.toISOString()
        }
        return this.api.create(payload)
    }
    /**
     * Update an existing subscription.
     *
     * @param {Object} command - Data required to update a subscription.
     * @param {number|string} command.id - Subscription identifier.
     * @param {string|number} command.userId - ID of the user.
     * @param {string} command.plan - Plan name or identifier.
     * @param {Date} command.startDate - Updated start date.
     * @param {string} command.status - Updated status.
     * @param {Date} [command.trialEndDate] - Optional trial end date.
     * @returns {Promise<Object>} The updated subscription entity.
     */
    update(command) {
        const payload = {
            id: command.id,
            userId: command.userId,
            plan: command.plan,
            startDate: command.startDate.toISOString(),
            status: command.status,
            trialEndDate: command.trialEndDate?.toISOString()
        }
        return this.api.update(payload)
    }
    /**
     * Cancel an active subscription.
     *
     * Fetches the subscription by ID, sets its status to "CANCELLED",
     * and then performs an update operation.
     *
     * @param {number|string} id - Subscription identifier.
     * @returns {Promise<Object>} The cancelled subscription entity.
     */
    cancel(id) {
        return this.getById(id)
            .then(sub => {
                sub.status = 'CANCELLED'
                return this.update(sub)
            })
    }
    /**
     * Delete a subscription permanently.
     *
     * @param {number|string} id - Subscription identifier.
     * @returns {Promise<Object>} API response from the delete operation.
     */
    delete(id) {
        return this.api.delete(id)
    }
}
