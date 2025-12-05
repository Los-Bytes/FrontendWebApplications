import { HistoryEntry } from "../domain/model/history-entry.js";

/**
 * Assembler for converting history resources and responses into HistoryEntry entities.
 */
export class HistoryAssembler {
  static toEntityFromResource(resource) {
    return new HistoryEntry({ ...resource });
  }

  static toEntityFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status}: ${response.statusText}`);
      return [];
    }
    const resources = response.data instanceof Array ? response.data : response.data["history"];
    return resources.map((r) => this.toEntityFromResource(r));
  }
}