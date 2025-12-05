/**
 * @class InventoryItem
 * @summary Represents an item in the inventory system.
 */
export class InventoryItem {
  /**
   * @param {Object} params - The inventory item parameters.
   * @param {string|number} [params.id] - The inventory item ID.
   * @param {string} [params.name] - The name of the inventory item.
   * @param {string} [params.category] - The category of the inventory item.
   * @param {number} [params.quantity] - The quantity of the inventory item.
   * @param {string} [params.status] - The status of the inventory item (e.g., 'En stock', 'Agotado', 'Reservado').
   * @param {string} [params.description] - A description of the inventory item.
   * @param {string|number} [params.userId] - The ID of the user associated with the inventory item.
   * @param {string} [params.username] - The name of the user associated with the inventory item.
   * @param {string|number} [params.laboratoryId] - The associated laboratory ID.
  */
  constructor({
    id = null,
    name = '',
    category = '',
    quantity = 0,
    status = 'En stock',
    description = '',
    userId = null,
    username = '',
    laboratoryId = null
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.quantity = quantity;
    this.status = status;
    this.description = description;
    this.userId = userId;
    this.username = username;
    this.laboratoryId = laboratoryId;
  }
}

