/**
 * SubscriptionPlan Entity - Represents a subscription plan in the domain
 * This is a Value Object in DDD
 */
export class SubscriptionPlan {
    /**
     * Creates a new SubscriptionPlan instance.
     * @param {Object} options - The plan parameters.
     * @param {string} options.type - Plan type ('BASIC', 'STANDARD', 'PREMIUM').
     * @param {number} options.amount - Plan price.
     * @throws {Error} If validation fails.
     */
    constructor({ type, amount }) {
        this.validate(type, amount)

        this.type = type                           // 'BASIC' | 'STANDARD' | 'PREMIUM'
        this.amount = amount                       // 9.99 | 19.99 | 49.99
    }

    /**
     * Validates plan data.
     * Throws an error if any validation fails.
     * @param {string} type - Plan type to validate.
     * @param {number} amount - Plan amount to validate.
     * @throws {Error} If validation fails.
     */
    validate(type, amount) {
        const validTypes = ['BASIC', 'STANDARD', 'PREMIUM']
        if (!validTypes.includes(type)) {
            throw new Error('invalidPlanType')
        }

        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('invalidPlanAmount')
        }
    }

    /**
     * Gets plan name for display.
     * @returns {string} Plan name (e.g., 'STANDARD').
     */
    getDisplayName() {
        return this.type
    }

    /**
     * Gets formatted plan amount with currency.
     * @returns {string} Formatted amount (e.g., '$19.99').
     */
    getFormattedAmount() {
        return `$${this.amount.toFixed(2)}`
    }

    /**
     * Checks if two plans are equal.
     * @param {SubscriptionPlan} other - Another SubscriptionPlan instance.
     * @returns {boolean} True if equal; otherwise, false.
     */
    equals(other) {
        return other instanceof SubscriptionPlan &&
            this.type === other.type &&
            this.amount === other.amount
    }

    /**
     * Converts SubscriptionPlan to plain object for storage.
     * @returns {Object} Plain object representation.
     */
    toPlainObject() {
        return {
            type: this.type,
            amount: this.amount
        }
    }
}
