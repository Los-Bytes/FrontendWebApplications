/**
 * @class Subscription
 * @summary Represents a user's subscription details.
 */
export class Subscription {
  /**
   * @param {Object} params - The subscription parameters.
   * @param {string|number} [params.id] - The subscription ID.
   * @param {string|number} [params.userId] - The user ID associated with the subscription.
   * @param {string} [params.planType] - The type of subscription plan.
   * @param {string} [params.startDate] - The start date of the subscription.
   * @param {string|null} [params.endDate] - The end date of the subscription (null if ongoing).
   * @param {number} [params.maxMembers] - The maximum number of members allowed.
   * @param {number} [params.maxInventoryItems] - The maximum number of inventory items allowed.
   * @param {boolean} [params.isActive] - Whether the subscription is active.
   */
  constructor({
    id = null,
    userId = null,
    planType = 'Free',
    startDate = '',
    endDate = null,
    maxMembers = 3,
    maxInventoryItems = 50,
    isActive = true
  }) {
    this.id = id;
    this.userId = userId;
    this.planType = planType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.maxMembers = maxMembers;
    this.maxInventoryItems = maxInventoryItems;
    this.isActive = isActive;
  }

  /**
   * Check if subscription is expired
   * @returns {boolean}
   */
  isExpired() {
    if (!this.endDate) return false;
    return new Date(this.endDate) < new Date();
  }
  /**
   * Get days remaining until subscription ends
   * @returns {number|null}
   */
  getDaysRemaining() {
    if (!this.endDate) return null;
    const now = new Date();
    const end = new Date(this.endDate);
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  /**
   * Check if subscription has unlimited members or items
   * @returns {boolean}
   */
  hasUnlimitedMembers() {
    return this.maxMembers === -1;
  }
  /**
   * Check if subscription has unlimited inventory items
   * @returns {boolean}
   */
  hasUnlimitedItems() {
    return this.maxInventoryItems === -1;
  }
}