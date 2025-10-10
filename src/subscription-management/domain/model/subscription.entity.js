/**
 * Utility class for Subscription entity
 */
export class Subscription {
    /**
     * Creates a new subscription instance.
     * @param {Object} options - The subscription parameters.
     * @param {number|null} options.id - Unique identifier for the subscription.
     * @param {number|null} options.userId - ID of the user who owns the subscription.
     * @param {string} options.plan - Subscription plan ('BASIC', 'STANDARD', or 'PREMIUM').
     * @param {Date} options.startDate - The date when the subscription starts.
     * @param {string} options.status - Current status of the subscription ('ACTIVE', 'CANCELLED', 'EXPIRED').
     * @param {Date|null} options.trialEndDate - The date when the trial period ends, if applicable.
     */
    constructor({ id = null, userId = null, plan = '', startDate = new Date(), status = 'ACTIVE', trialEndDate = null }) {
        this.id = id
        this.userId = userId
        this.plan = plan                // 'BASIC' | 'STANDARD' | 'PREMIUM'
        this.startDate = startDate
        this.status = status            // 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
        this.trialEndDate = trialEndDate
    }

    /**
     * Cancels the subscription if it is currently active.
     * Throws an error if the subscription is not active.
     * @throws {Error} If the subscription is not active.
     */

    cancel() {
        if (this.status !== 'ACTIVE') {
            throw new Error(`cannotCancel:${this.status}`)
        }
        this.status = 'CANCELLED'
    }

    /**
     * Activates a trial period for the subscription by setting an end date.
     * The trial is added only if the subscription is active.
     * @param {number} days - Duration of the trial period in days.
     * @throws {Error} If the subscription is not active.
     */

    activateTrial(days) {
        if (this.status !== 'ACTIVE') {
            throw new Error('cannotStartTrial')
        }
        const now = new Date()
        now.setDate(now.getDate() + days)
        this.trialEndDate = now
    }

    /**
     * Checks whether the trial period is currently active.
     * @returns {boolean} True if there is a valid trial end date and the current date is before it; otherwise, false.
     */
    isTrialActive() {
        return this.trialEndDate instanceof Date && new Date() < this.trialEndDate
    }
}
