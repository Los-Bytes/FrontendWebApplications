/**
 * Subscription Entity - Represents a subscription in the domain
 * This is an Aggregate Root in DDD
 */
export class Subscription {
    /**
     * Creates a new subscription instance.
     * @param {Object} options - The subscription parameters.
     * @param {number|null} options.id - Unique identifier for the subscription.
     * @param {number|null} options.userId - ID of the user who owns the subscription.
     * @param {string} options.plan - Subscription plan ('BASIC', 'STANDARD', or 'PREMIUM').
     * @param {number} options.amount - Price of the subscription.
     * @param {Date} options.startDate - The date when the subscription starts.
     * @param {Date} options.endDate - The date when the subscription ends.
     * @param {string} options.status - Current status of the subscription ('ACTIVE', 'CANCELLED', 'EXPIRED').
     * @param {Date|null} options.trialEndDate - The date when the trial period ends, if applicable.
     * @param {string|null} options.transactionId - ID of the payment transaction.
     * @param {string|null} options.paymentMethod - Payment method used ('VISA', 'MASTERCARD', etc).
     * @param {string|null} options.cardLastFourDigits - Last 4 digits of the card.
     * @param {string|null} options.cardholderName - Name of the cardholder.
     * @param {string|null} options.expirationDate - Card expiration date (MM/YY).
     * @param {boolean} options.savePaymentMethod - Whether to save the payment method.
     */
    constructor({
                    id = null,
                    userId = null,
                    plan = '',
                    amount = 0,
                    startDate = new Date(),
                    endDate = null,
                    status = 'ACTIVE',
                    trialEndDate = null,
                    transactionId = null,
                    paymentMethod = null,
                    cardLastFourDigits = null,
                    cardholderName = null,
                    expirationDate = null,
                    savePaymentMethod = false
                }) {
        this.id = id
        this.userId = userId
        this.plan = plan                           // 'BASIC' | 'STANDARD' | 'PREMIUM'
        this.amount = amount                       // 9.99 | 19.99 | 49.99
        this.startDate = startDate
        this.endDate = endDate                     // Fecha de vencimiento de la suscripción
        this.status = status                       // 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
        this.trialEndDate = trialEndDate
        this.transactionId = transactionId         // ID de la transacción de pago
        this.paymentMethod = paymentMethod         // VISA, MASTERCARD, etc
        this.cardLastFourDigits = cardLastFourDigits  // 1213
        this.cardholderName = cardholderName       // José Paredes
        this.expirationDate = expirationDate       // 09/30
        this.savePaymentMethod = savePaymentMethod
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

    /**
     * Updates the payment information when user changes payment method.
     * Only allows updates if subscription is active.
     * @param {Object} paymentData - New payment data with type, cardLastFourDigits, cardholderName, expirationDate, savePaymentMethod.
     * @throws {Error} If the subscription is not active.
     */
    updatePaymentMethod(paymentData) {
        if (this.status !== 'ACTIVE') {
            throw new Error('cannotChangePayment:subscriptionNotActive')
        }
        this.paymentMethod = paymentData.paymentMethod
        this.cardLastFourDigits = paymentData.cardLastFourDigits
        this.cardholderName = paymentData.cardholderName
        this.expirationDate = paymentData.expirationDate
        this.savePaymentMethod = paymentData.savePaymentMethod
    }

    /**
     * Changes the subscription plan to a different one.
     * Only allows changes if subscription is active.
     * @param {string} newPlan - New plan type ('BASIC', 'STANDARD', 'PREMIUM').
     * @param {number} newAmount - New amount for the plan.
     * @throws {Error} If the subscription is not active.
     */
    changePlan(newPlan, newAmount) {
        if (this.status !== 'ACTIVE') {
            throw new Error('cannotChangePlan:subscriptionNotActive')
        }
        this.plan = newPlan
        this.amount = newAmount
    }

    /**
     * Marks subscription as expired.
     * Only allows expiration if subscription is currently active.
     * @throws {Error} If the subscription is not active.
     */
    expire() {
        if (this.status !== 'ACTIVE') {
            throw new Error('cannotExpire:subscriptionNotActive')
        }
        this.status = 'EXPIRED'
    }

    /**
     * Checks if subscription is currently valid.
     * A subscription is valid if it's active and not past the end date.
     * @returns {boolean} True if subscription is valid; otherwise, false.
     */
    isValid() {
        return this.status === 'ACTIVE' && (!this.endDate || new Date() < this.endDate)
    }

    /**
     * Converts subscription to plain object for storage.
     * @returns {Object} Plain object representation.
     */
    toPlainObject() {
        return {
            id: this.id,
            userId: this.userId,
            plan: this.plan,
            amount: this.amount,
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.status,
            trialEndDate: this.trialEndDate,
            transactionId: this.transactionId,
            paymentMethod: this.paymentMethod,
            cardLastFourDigits: this.cardLastFourDigits,
            cardholderName: this.cardholderName,
            expirationDate: this.expirationDate,
            savePaymentMethod: this.savePaymentMethod
        }
    }
}
