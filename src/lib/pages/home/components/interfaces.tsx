// TODO: https://supabase.com/docs/reference/javascript/typescript-support

export interface Person {
  id: number;
  created_at: Date;
  location: number;
  display_name: string;
  description: string;
}

export interface Room {
  id: number;
  title: string;
  description: string;
  owner: number;
}

export interface Exit {
  id: number;
  title: string;
  description: string;
  origin: number;
  destination: number;
}

// what you need to supply to make one
export type ExitRequirements = Pick<Exit, "title" | "origin" | "destination">

export enum dbOperation {
  INSERT = "INSERT",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export interface broadcastPayload {
  op: dbOperation;
  table: string;
  old_record: any;
  record: any;
}

export type AtLeastID<T> = { id: number } & Partial<T>
