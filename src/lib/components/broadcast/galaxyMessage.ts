import { BroadcastPayload, BroadcastTable } from "./interfaces";
import { DBOperation } from "./interfaces";

const { INSERT, UPDATE, DELETE } = DBOperation;

export const galaxyMessage = (payload: BroadcastPayload) => {
  let changes: any = {};
  switch (payload.operation) {
    case INSERT:
      changes = payload.record;
      break;
    case DELETE:
      changes = payload.old_record;
      break;
    case UPDATE:
      for (const [key, value] of Object.entries(payload.old_record)) {
        if (payload.record[key] != value) {
          changes[key] = [value, payload.record[key]]
        }
      }
      break;
    default:
      changes = {}
  }
  return {
    id: payload.id,
    table: payload.table,
    operation: payload.operation,
    changes,
    oldRecord: payload.old_record,
    record: payload.record
  }
}

export interface GalaxyMessage {
  id: string,
  table: BroadcastTable,
  operation: DBOperation,
  changes: any, // TODO: type
  oldRecord: any, // TODO: types
  record: any,
}
