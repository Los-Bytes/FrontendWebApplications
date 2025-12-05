/**
 * @class HistoryEntry
 * @summary Represents a history entry for inventory item actions.
 */
export class HistoryEntry {
  /**
   * @param {Object} params - The history entry parameters.
   * @param {string|number} [params.id] - The history entry ID.
   * @param {string|number} [params.inventoryItemId] - The associated inventory item ID.
   * @param {string|number} [params.laboratoryId] - The associated laboratory ID.
   * @param {string} [params.action] - The action performed (e.g., 'created', 'updated', 'sold', 'used', 'returned').
   * @param {string} [params.previousStatus] - The previous status of the inventory item.
   * @param {string} [params.newStatus] - The new status of the inventory item.
   * @param {number} [params.quantity] - The quantity involved in the action.
   * @param {string|number} [params.userId] - The ID of the user who performed the action.
   * @param {string} [params.username] - The name of the user who performed the action.
   * @param {string} [params.timestamp] - The timestamp of when the action occurred.
   * @param {string} [params.description] - Additional description of the action.
   */
  constructor({
    id = null,
    inventoryItemId = null,
    laboratoryId = null,
    action = '',
    previousStatus = '',
    newStatus = '',
    quantity = 0,
    userId = null,
    username = '',
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
    this.username = username;
    this.timestamp = timestamp;
    this.description = description;
  }
}