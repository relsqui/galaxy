import { GalaxyMessage } from "./galaxyMessage";

export enum DBOperation {
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

const broadcastTables = ["room", "person", "exit", "message"] as const;

export type BroadcastTable = typeof broadcastTables[number];

// it really is a BroadcastListeners, by definition,
// but I don't think I can convince the type system of that
export const initBroadcastListeners =
  Object.fromEntries(broadcastTables.map(t => [t, []])) as unknown as BroadcastListeners;

export interface BroadcastPayload {
  id: string;
  operation: DBOperation;
  table: BroadcastTable;
  old_record: any;
  record: any;
}

// handler fn returns true if it consumes the event and nothing else should
export type BroadcastHandler = (message: GalaxyMessage) => boolean | void;

export interface BroadcastListener {
  table: BroadcastTable;
  handler: BroadcastHandler;
  // TODO: sort by priority, if specified
  priority?: number;
}

export type BroadcastListeners = {
  [key in BroadcastTable]: BroadcastListener[];
};

export type SubscribeFn = (table: BroadcastTable, handler: BroadcastHandler, priority?: number) => BroadcastListener;
export type UnsubscribeFn = (listener: BroadcastListener) => void;
export type BroadcastContextType = [SubscribeFn, UnsubscribeFn];
