export class SubscriptionPlan {
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

  // Métodos de dominio
  isFree() {
    return this.price === 0;
  }

  isUnlimited() {
    return this.maxMembers === -1 && this.maxInventoryItems === -1;
  }

  getPriceFormatted() {
    if (this.isFree()) return 'Gratis';
    return `$${this.price.toFixed(2)} ${this.currency}`;
  }

  getDisplayName() {
    return `${this.name} - ${this.getPriceFormatted()}`;
  }
}