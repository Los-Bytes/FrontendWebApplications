/**
 * PaymentMethod Entity - Represents payment information in the domain
 * This is a Value Object in DDD
 */
export class PaymentMethod {
    /**
     * Creates a new PaymentMethod instance.
     * @param {Object} options - The payment method parameters.
     * @param {string} options.type - Payment type ('VISA', 'MASTERCARD', etc).
     * @param {string} options.cardNumber - Full card number.
     * @param {string} options.cardholderName - Name of the cardholder.
     * @param {string} options.expirationDate - Card expiration date (MM/YY format).
     * @param {string} options.cvv - Card verification value.
     * @throws {Error} If validation fails.
     */
    constructor({ type, cardNumber, cardholderName, expirationDate, cvv }) {
        this.validate(cardNumber, cardholderName, expirationDate, cvv)

        this.type = type                                    // 'VISA' | 'MASTERCARD' | etc
        this.cardNumber = cardNumber
        this.cardholderName = cardholderName
        this.expirationDate = expirationDate                // MM/YY format
        this.cvv = cvv
    }

    /**
     * Validates payment method data.
     * Throws an error if any validation fails.
     * @param {string} cardNumber - Card number to validate.
     * @param {string} cardholderName - Cardholder name to validate.
     * @param {string} expirationDate - Expiration date to validate.
     * @param {string} cvv - CVV to validate.
     * @throws {Error} If validation fails.
     */
    validate(cardNumber, cardholderName, expirationDate, cvv) {
        if (!cardNumber || cardNumber.length < 13) {
            throw new Error('invalidCardNumber')
        }
        if (!cardholderName || cardholderName.trim().length === 0) {
            throw new Error('invalidCardholderName')
        }
        if (!expirationDate || !this.isValidExpirationDate(expirationDate)) {
            throw new Error('invalidExpirationDate')
        }
        if (!cvv || cvv.length < 3) {
            throw new Error('invalidCVV')
        }
    }

    /**
     * Validates expiration date format (MM/YY).
     * Ensures the date is not expired.
     * @param {string} date - Date in MM/YY format.
     * @returns {boolean} True if valid expiration date; otherwise, false.
     */
    isValidExpirationDate(date) {
        const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/
        if (!pattern.test(date)) {
            return false
        }

        const [month, year] = date.split('/')
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear() % 100
        const currentMonth = currentDate.getMonth() + 1

        const expYear = parseInt(year)
        const expMonth = parseInt(month)

        if (expYear < currentYear) {
            return false
        }
        if (expYear === currentYear && expMonth < currentMonth) {
            return false
        }

        return true
    }

    /**
     * Gets the last 4 digits of the card.
     * @returns {string} Last 4 digits of the card.
     */
    getLastFourDigits() {
        return this.cardNumber.slice(-4)
    }

    /**
     * Gets a masked version of the card for secure display.
     * @returns {string} Masked card number (e.g., **** **** **** 1213).
     */
    getMaskedCardNumber() {
        const lastFour = this.getLastFourDigits()
        return `**** **** **** ${lastFour}`
    }

    /**
     * Checks if two PaymentMethod objects are equal.
     * @param {PaymentMethod} other - Another PaymentMethod instance.
     * @returns {boolean} True if equal; otherwise, false.
     */
    equals(other) {
        return other instanceof PaymentMethod &&
            this.type === other.type &&
            this.cardNumber === other.cardNumber &&
            this.cardholderName === other.cardholderName &&
            this.expirationDate === other.expirationDate
    }

    /**
     * Converts PaymentMethod to plain object for storage.
     * Does not include CVV for security reasons.
     * @returns {Object} Plain object representation.
     */
    toPlainObject() {
        return {
            type: this.type,
            cardLastFourDigits: this.getLastFourDigits(),
            cardholderName: this.cardholderName,
            expirationDate: this.expirationDate
        }
    }
}
