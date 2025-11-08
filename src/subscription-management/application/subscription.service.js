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
            .then(response => SubscriptionAssembler.toEntitiesFromResponse(response))
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
                if (response.status !== 200) throw new Error('Not found')
                return SubscriptionAssembler.toEntityFromResource(response.data)
            })
    }

    /**
     * Create a new subscription using the provided command object.
     *
     * Handles the creation of a subscription with payment information.
     * Processes payment data, creates transaction record, and persists subscription.
     *
     * @param {Object} command - Data required to create a subscription.
     * @param {string|number} command.userId - ID of the user subscribing.
     * @param {string} command.plan - Plan name or identifier ('BASIC', 'STANDARD', 'PREMIUM').
     * @param {number} command.amount - Price of the plan.
     * @param {Date} command.startDate - Start date of the subscription.
     * @param {Date} command.endDate - End date of the subscription.
     * @param {string} command.status - Current status (e.g., ACTIVE, PENDING).
     * @param {Object} command.paymentData - Payment information.
     * @param {string} command.paymentData.type - Payment type ('VISA', 'MASTERCARD').
     * @param {string} command.paymentData.cardNumber - Card number.
     * @param {string} command.paymentData.cardholderName - Cardholder name.
     * @param {string} command.paymentData.expirationDate - Card expiration (MM/YY).
     * @param {string} command.paymentData.cvv - Card verification value.
     * @param {boolean} command.paymentData.savePaymentMethod - Save payment method flag.
     * @param {Date} [command.trialEndDate] - Optional trial end date.
     * @returns {Promise<Object>} The created subscription entity with transaction details.
     * @throws {Error} If payment validation fails.
     */
    create(command) {
        const payload = {
            userId: command.userId,
            plan: command.plan,
            amount: command.amount,
            startDate: command.startDate.toISOString(),
            endDate: command.endDate.toISOString(),
            status: command.status,
            trialEndDate: command.trialEndDate?.toISOString(),
            transactionId: this.generateTransactionId(),
            paymentMethod: command.paymentData.type,
            cardLastFourDigits: command.paymentData.cardNumber.slice(-4),
            cardholderName: command.paymentData.cardholderName,
            expirationDate: command.paymentData.expirationDate,
            savePaymentMethod: command.paymentData.savePaymentMethod
        }
        return this.api.create(payload)
            .then(response => SubscriptionAssembler.toEntityFromResource(response.data))
    }

    /**
     * Update an existing subscription.
     *
     * @param {Object} command - Data required to update a subscription.
     * @param {number|string} command.id - Subscription identifier.
     * @param {string|number} command.userId - ID of the user.
     * @param {string} command.plan - Plan name or identifier.
     * @param {number} command.amount - Price of the plan.
     * @param {Date} command.startDate - Updated start date.
     * @param {Date} command.endDate - Updated end date.
     * @param {string} command.status - Updated status.
     * @param {Date} [command.trialEndDate] - Optional trial end date.
     * @returns {Promise<Object>} The updated subscription entity.
     */
    update(command) {
        const payload = {
            id: command.id,
            userId: command.userId,
            plan: command.plan,
            amount: command.amount,
            startDate: command.startDate.toISOString(),
            endDate: command.endDate.toISOString(),
            status: command.status,
            trialEndDate: command.trialEndDate?.toISOString(),
            transactionId: command.transactionId,
            paymentMethod: command.paymentMethod,
            cardLastFourDigits: command.cardLastFourDigits,
            cardholderName: command.cardholderName,
            expirationDate: command.expirationDate,
            savePaymentMethod: command.savePaymentMethod
        }
        return this.api.update(payload)
            .then(response => SubscriptionAssembler.toEntityFromResource(response.data))
    }

    /**
     * Cancel an active subscription.
     *
     * Fetches the subscription by ID, sets its status to "CANCELLED",
     * and then performs an update operation.
     *
     * @param {number|string} id - Subscription identifier.
     * @returns {Promise<Object>} The cancelled subscription entity.
     * @throws {Error} If subscription is not active or not found.
     */
    cancel(id) {
        return this.getById(id)
            .then(sub => {
                sub.cancel()
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

    /**
     * Change the subscription plan to a different one.
     *
     * Retrieves the subscription, changes the plan using domain logic,
     * updates the end date based on the new plan, and persists changes.
     *
     * @param {number|string} id - Subscription identifier.
     * @param {string} newPlan - New plan type ('BASIC', 'STANDARD', 'PREMIUM').
     * @param {number} newAmount - New plan amount.
     * @returns {Promise<Object>} The updated subscription entity with new plan.
     * @throws {Error} If subscription is not active or plan is invalid.
     */
    changePlan(id, newPlan, newAmount) {
        return this.getById(id)
            .then(sub => {
                sub.changePlan(newPlan, newAmount)
                sub.endDate = this.calculateEndDate()
                return this.update(sub)
            })
    }

    /**
     * Change the payment method of an active subscription.
     *
     * Retrieves the subscription, updates payment information using domain logic,
     * and persists the changes.
     *
     * @param {number|string} id - Subscription identifier.
     * @param {Object} paymentData - New payment information.
     * @param {string} paymentData.type - Payment type ('VISA', 'MASTERCARD').
     * @param {string} paymentData.cardNumber - Card number.
     * @param {string} paymentData.cardholderName - Cardholder name.
     * @param {string} paymentData.expirationDate - Card expiration (MM/YY).
     * @param {string} paymentData.cvv - Card verification value.
     * @param {boolean} paymentData.savePaymentMethod - Save payment method flag.
     * @returns {Promise<Object>} The updated subscription entity with new payment method.
     * @throws {Error} If subscription is not active or payment data is invalid.
     */
    changePaymentMethod(id, paymentData) {
        return this.getById(id)
            .then(sub => {
                sub.updatePaymentMethod({
                    paymentMethod: paymentData.type,
                    cardLastFourDigits: paymentData.cardNumber.slice(-4),
                    cardholderName: paymentData.cardholderName,
                    expirationDate: paymentData.expirationDate,
                    savePaymentMethod: paymentData.savePaymentMethod
                })
                return this.update(sub)
            })
    }

    /**
     * Get subscription details by subscription ID.
     *
     * Retrieves complete subscription information including payment details
     * and transaction history for display in the subscription details page.
     *
     * @param {number|string} id - Subscription identifier.
     * @returns {Promise<Object>} The subscription entity with all details.
     * @throws {Error} If subscription is not found.
     */
    getSubscriptionDetails(id) {
        return this.getById(id)
            .then(subscription => {
                return {
                    id: subscription.id,
                    userId: subscription.userId,
                    plan: subscription.plan,
                    amount: subscription.amount,
                    status: subscription.status,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    transactionId: subscription.transactionId,
                    paymentMethod: subscription.paymentMethod,
                    cardLastFourDigits: subscription.cardLastFourDigits,
                    cardholderName: subscription.cardholderName,
                    expirationDate: subscription.expirationDate
                }
            })
    }

    /**
     * Activate a trial period for a subscription.
     *
     * @param {number|string} id - Subscription identifier.
     * @param {number} days - Number of days for the trial.
     * @returns {Promise<Object>} The updated subscription entity with trial activated.
     * @throws {Error} If subscription is not active or trial cannot be activated.
     */
    activateTrial(id, days) {
        return this.getById(id)
            .then(sub => {
                sub.activateTrial(days)
                return this.update(sub)
            })
    }

    /**
     * Calculate the end date for a subscription (30 days from now).
     *
     * @returns {Date} The calculated end date.
     * @private
     */
    calculateEndDate() {
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)
        return endDate
    }

    /**
     * Generate a unique transaction ID for payment processing.
     *
     * @returns {string} A unique transaction identifier.
     * @private
     */
    generateTransactionId() {
        return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    }
}
