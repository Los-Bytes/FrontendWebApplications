import { Subscription } from '../domain/model/subscription.entity.js'
/**
 * Utility class for assembling Subscription entities from API resources or responses.
 */
export class SubscriptionAssembler {
    /**
     * Converts a resource object into a Subscription entity.
     * @param {Object} r - The resource object to convert.
     * @param {number} r.id - The unique identifier of the subscription.
     * @param {number} r.userId - The unique identifier of the user.
     * @param {string} r.plan - The plan name of the subscription.
     * @param {string|Date} r.startDate - The subscription start date.
     * @param {string} r.status - The status of the subscription.
     * @param {string|Date|null} r.trialEndDate - The end date of the trial period, if present.
     * @returns {Subscription} The constructed Subscription entity.
     */
    static toEntityFromResource(r) {
        return new Subscription({
            id: r.id,
            userId: r.userId,
            plan: r.plan,
            startDate: new Date(r.startDate),
            status: r.status,
            trialEndDate: r.trialEndDate ? new Date(r.trialEndDate) : null
        })
    }
    /**
     * Creates an array of Subscription entities from an API response.
     * Logs an error and returns an empty array if the response status is not 200.
     * @param {Object} response - The API response object.
     * @param {number} response.status - HTTP status code.
     * @param {string} response.statusText - HTTP status text.
     * @param {Object|Array} response.data - Response data, can be an array or an object with a 'subscriptions' array.
     * @returns {Subscription[]} Array of Subscription entities.
     */
    static toEntitiesFromResponse(response) {
        if (!response.data) return []
        // Handle both direct array (json-server) and wrapped envelope (likely legacy .NET)
        const data = Array.isArray(response.data)
            ? response.data
            : (response.data.results || response.data.subscriptions || [])

        return data.map(r => this.toEntityFromResource(r))
    }
}
