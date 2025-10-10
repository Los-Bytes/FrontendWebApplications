export class InventoryItem {
  constructor({
    id = null,
    name = '',
    category = '',
    quantity = 0,
    status = 'En stock',
    description = ''
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.quantity = quantity;
    this.status = status;
    this.description = description;
  }
}

