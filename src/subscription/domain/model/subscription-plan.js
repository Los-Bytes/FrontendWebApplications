/**
 * @class SubscriptionPlan
 * @summary Modelo de dominio para un plan de suscripción.
 */
export class SubscriptionPlan {
  /**
   * @param {Object} params - Los parámetros del plan de suscripción.
   * @param {string|number} [params.id] - El ID del plan.
   * @param {string} [params.name] - El nombre del plan.
   * @param {number} [params.price] - El precio del plan.
   * @param {string} [params.currency] - La moneda del precio.
   * @param {string} [params.period] - El período de facturación (mensual, anual).
   * @param {number} [params.maxMembers] - El número máximo de miembros permitidos.
   * @param {number} [params.maxInventoryItems] - El número máximo de ítems de inventario permitidos.
   * @param {Array<string>} [params.features] - Las características incluidas en el plan.
   */
  constructor({
    id = null,
    name = '',
    price = 0,
    currency = 'USD',
    period = 'monthly',
    maxMembers = 0,
    maxInventoryItems = 0,
    features = []
  }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.currency = currency;
    this.period = period;
    this.maxMembers = maxMembers;
    this.maxInventoryItems = maxInventoryItems;
    this.features = features;
  }
  /**
   * Check if the plan is free
   * @returns {boolean}
  */
  isFree() {
    return this.price === 0;
  }
  /**
   * Check if the plan is unlimited
   * @returns {boolean}
   */
  isUnlimited() {
    return this.maxMembers === -1 && this.maxInventoryItems === -1;
  }
  /**
   * Get formatted price
   * @returns {string}
   */
  getPriceFormatted() {
    if (this.isFree()) return 'Gratis';
    return `$${this.price.toFixed(2)} ${this.currency}`;
  }
  /**
   * Get display name
   * @returns {string}
   */
  getDisplayName() {
    return `${this.name} - ${this.getPriceFormatted()}`;
  }
}