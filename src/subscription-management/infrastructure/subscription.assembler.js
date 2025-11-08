import { Subscription } from '../domain/model/subscription.entity.js'

/**
 * SubscriptionAssembler
 *
 * Utility class for assembling Subscription entities from API resources or responses.
 * Handles the mapping between data transfer objects (DTOs) and domain entities.
 */
export class SubscriptionAssembler {
    /**
     * Converts a resource object into a Subscription entity.
     *
     * Maps all properties from the API resource (including payment and transaction data)
     * into a Subscription domain entity with proper type conversions for dates.
     *
     * @param {Object} r - The resource object to convert.
     * @param {number} r.id - The unique identifier of the subscription.
     * @param {number} r.userId - The unique identifier of the user.
     * @param {string} r.plan - The plan name of the subscription ('BASIC', 'STANDARD', 'PREMIUM').
     * @param {number} r.amount - The price of the plan.
     * @param {string|Date} r.startDate - The subscription start date.
     * @param {string|Date} r.endDate - The subscription end date.
     * @param {string} r.status - The status of the subscription ('ACTIVE', 'CANCELLED', 'EXPIRED').
     * @param {string|Date|null} r.trialEndDate - The end date of the trial period, if present.
     * @param {string|null} r.transactionId - The ID of the payment transaction.
     * @param {string|null} r.paymentMethod - Payment method used ('VISA', 'MASTERCARD', etc).
     * @param {string|null} r.cardLastFourDigits - Last 4 digits of the card.
     * @param {string|null} r.cardholderName - Name of the cardholder.
     * @param {string|null} r.expirationDate - Card expiration date (MM/YY).
     * @param {boolean} r.savePaymentMethod - Whether the payment method should be saved.
     * @returns {Subscription} The constructed Subscription entity.
     */
    static toEntityFromResource(r) {
        return new Subscription({
            id: r.id,
            userId: r.userId,
            plan: r.plan,
            amount: r.amount,
            startDate: new Date(r.startDate),
            endDate: r.endDate ? new Date(r.endDate) : null,
            status: r.status,
            trialEndDate: r.trialEndDate ? new Date(r.trialEndDate) : null,
            transactionId: r.transactionId || null,
            paymentMethod: r.paymentMethod || null,
            cardLastFourDigits: r.cardLastFourDigits || null,
            cardholderName: r.cardholderName || null,
            expirationDate: r.expirationDate || null,
            savePaymentMethod: r.savePaymentMethod || false
        })
    }

    /**
     * Creates an array of Subscription entities from an API response.
     *
     * Handles both array and object response formats.
     * Logs an error and returns an empty array if the response status is not 200.
     *
     * @param {Object} response - The API response object.
     * @param {number} response.status - HTTP status code.
     * @param {string} response.statusText - HTTP status text.
     * @param {Object|Array} response.data - Response data, can be an array or an object with a 'subscriptions' array.
     * @returns {Subscription[]} Array of Subscription entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`)
            return []
        }
        const data = Array.isArray(response.data)
            ? response.data
            : response.data['subscriptions']
        return data.map(r => this.toEntityFromResource(r))
    }

    /**
     * Converts a Subscription entity into a data transfer object (DTO) for API transmission.
     *
     * Maps the domain entity properties into a plain object suitable for sending
     * to the API. Handles date serialization to ISO format strings.
     *
     * @param {Subscription} entity - The Subscription entity to convert.
     * @returns {Object} Plain object representation suitable for API transmission.
     */
    static toDtoFromEntity(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            plan: entity.plan,
            amount: entity.amount,
            startDate: entity.startDate instanceof Date
                ? entity.startDate.toISOString()
                : entity.startDate,
            endDate: entity.endDate instanceof Date
                ? entity.endDate.toISOString()
                : entity.endDate,
            status: entity.status,
            trialEndDate: entity.trialEndDate instanceof Date
                ? entity.trialEndDate.toISOString()
                : entity.trialEndDate,
            transactionId: entity.transactionId,
            paymentMethod: entity.paymentMethod,
            cardLastFourDigits: entity.cardLastFourDigits,
            cardholderName: entity.cardholderName,
            expirationDate: entity.expirationDate,
            savePaymentMethod: entity.savePaymentMethod
        }
    }

    /**
     * Converts a Subscription entity into a presentation object for the view layer.
     *
     * Formats the entity data for display in UI components, handling localization
     * keys and formatted values. Dates are formatted as ISO strings for display.
     *
     * @param {Subscription} entity - The Subscription entity to convert.
     * @returns {Object} Formatted object for view layer display.
     */
    static toViewModelFromEntity(entity) {
        return {
            id: entity.id,
            userId: entity.userId,
            plan: entity.plan,
            amount: entity.amount,
            startDate: entity.startDate instanceof Date
                ? entity.startDate.toISOString().split('T')[0]
                : entity.startDate,
            endDate: entity.endDate instanceof Date
                ? entity.endDate.toISOString().split('T')[0]
                : entity.endDate,
            status: entity.status,
            transactionId: entity.transactionId,
            paymentMethod: entity.paymentMethod,
            cardLastFourDigits: entity.cardLastFourDigits,
            cardholderName: entity.cardholderName,
            expirationDate: entity.expirationDate,
            savePaymentMethod: entity.savePaymentMethod
        }
    }

    /**
     * Converts an array of Subscription entities into an array of DTOs.
     *
     * @param {Subscription[]} entities - Array of Subscription entities.
     * @returns {Object[]} Array of DTOs ready for API transmission.
     */
    static toDtosFromEntities(entities) {
        return entities.map(entity => this.toDtoFromEntity(entity))
    }

    /**
     * Converts an array of Subscription entities into an array of view models.
     *
     * @param {Subscription[]} entities - Array of Subscription entities.
     * @returns {Object[]} Array of view models for display.
     */
    static toViewModelsFromEntities(entities) {
        return entities.map(entity => this.toViewModelFromEntity(entity))
    }
}
