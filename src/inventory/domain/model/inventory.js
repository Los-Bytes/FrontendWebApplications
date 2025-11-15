export class InventoryItem {
  constructor({
    id = null,
    name = '',
    category = '',
    quantity = 0,
    status = 'En stock',
    description = '',
    userId = null,
    userName = '',
    laboratoryId = null
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.quantity = quantity;
    this.status = status;
    this.description = description;
    this.userId = userId;
    this.userName = userName;
    this.laboratoryId = laboratoryId;
  }
}

