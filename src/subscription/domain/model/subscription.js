export class Subscription {
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

  // Métodos de dominio
  isExpired() {
    if (!this.endDate) return false;
    return new Date(this.endDate) < new Date();
  }

  getDaysRemaining() {
    if (!this.endDate) return null;
    const now = new Date();
    const end = new Date(this.endDate);
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  hasUnlimitedMembers() {
    return this.maxMembers === -1;
  }

  hasUnlimitedItems() {
    return this.maxInventoryItems === -1;
  }
}