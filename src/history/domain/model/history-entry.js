export class HistoryEntry {
  constructor({
    id = null,
    inventoryItemId = null,
    laboratoryId = null,
    action = '', // Acciones: 'created', 'updated', 'sold', 'used', 'returned'
    previousStatus = '',
    newStatus = '',
    quantity = 0,
    userId = null,
    userName = '',
    timestamp = '',
    description = ''
  }) {
    this.id = id;
    this.inventoryItemId = inventoryItemId;
    this.laboratoryId = laboratoryId;
    this.action = action;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
    this.quantity = quantity;
    this.userId = userId;
    this.userName = userName;
    this.timestamp = timestamp;
    this.description = description;
  }
}