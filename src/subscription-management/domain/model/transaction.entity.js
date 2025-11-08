/**
 * Transaction Entity - Represents a payment transaction in the domain
 * This is a Value Object in DDD
 */
export class Transaction {
    /**
     * Creates a new Transaction instance.
     * @param {Object} options - The transaction parameters.
     * @param {string} options.id - Unique transaction identifier.
     * @param {number} options.subscriptionId - Associated subscription ID.
     * @param {number} options.amount - Transaction amount.
     * @param {Date} options.date - Transaction date.
     * @param {string} options.status - Transaction status ('SUCCESS', 'PENDING', 'FAILED').
     * @param {string|null} options.paymentMethod - Payment method used.
     * @param {string|null} options.description - Transaction description.
     * @throws {Error} If validation fails.
     */
    constructor({ id, subscriptionId, amount, date, status = 'PENDING', paymentMethod = null, description = null }) {
        this.validate(amount, status)

        this.id = id
        this.subscriptionId = subscriptionId
        this.amount = amount
        this.date = date instanceof Date ? date : new Date(date)
        this.status = status                        // 'SUCCESS' | 'PENDING' | 'FAILED'
        this.paymentMethod = paymentMethod
        this.description = description
    }

    /**
     * Validates transaction data.
     * Throws an error if any validation fails.
     * @param {number} amount - Amount to validate.
     * @param {string} status - Status to validate.
     * @throws {Error} If validation fails.
     */
    validate(amount, status) {
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('invalidTransactionAmount')
        }

        const validStatuses = ['SUCCESS', 'PENDING', 'FAILED']
        if (!validStatuses.includes(status)) {
            throw new Error('invalidTransactionStatus')
        }
    }

    /**
     * Checks if transaction was successful.
     * @returns {boolean} True if successful; otherwise, false.
     */
    isSuccessful() {
        return this.status === 'SUCCESS'
    }

    /**
     * Checks if transaction is pending.
     * @returns {boolean} True if pending; otherwise, false.
     */
    isPending() {
        return this.status === 'PENDING'
    }

    /**
     * Checks if transaction failed.
     * @returns {boolean} True if failed; otherwise, false.
     */
    isFailed() {
        return this.status === 'FAILED'
    }

    /**
     * Gets formatted transaction date.
     * @returns {string} Formatted date (YYYY-MM-DD).
     */
    getFormattedDate() {
        return this.date.toISOString().split('T')[0]
    }

    /**
     * Gets formatted amount with currency symbol.
     * @param {string} currency - Currency symbol (default: $).
     * @returns {string} Formatted amount (e.g., $19.99).
     */
    getFormattedAmount(currency = '$') {
        return `${currency}${this.amount.toFixed(2)}`
    }

    /**
     * Checks if two transactions are equal.
     * @param {Transaction} other - Another Transaction instance.
     * @returns {boolean} True if equal; otherwise, false.
     */
    equals(other) {
        return other instanceof Transaction &&
            this.id === other.id &&
            this.subscriptionId === other.subscriptionId
    }

    /**
     * Converts Transaction to plain object for storage and display.
     * @returns {Object} Plain object representation.
     */
    toPlainObject() {
        return {
            id: this.id,
            subscriptionId: this.subscriptionId,
            amount: this.amount,
            date: this.date.toISOString(),
            status: this.status,
            paymentMethod: this.paymentMethod,
            description: this.description
        }
    }
}
